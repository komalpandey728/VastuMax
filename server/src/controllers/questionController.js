const Question = require('../models/Question');
const Vehicle = require('../models/Vehicle');
const Notification = require('../models/Notification');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Ask a question about a vehicle listing
 * @route   POST /api/questions
 * @access  Private (Customer only)
 */
exports.askQuestion = asyncHandler(async (req, res, next) => {
  const { vehicleId, questionText } = req.body;
  const customerId = req.user.id;

  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    return next(new AppError('Vehicle listing not found.', 404));
  }

  const question = await Question.create({
    vehicle: vehicleId,
    customer: customerId,
    vendor: vehicle.vendor,
    questionText,
  });

  // Notify Vendor about the inquiry
  await Notification.create({
    user: vehicle.vendor,
    title: 'New Vehicle Inquiry 💬',
    message: `A customer has asked a question about your listing "${vehicle.name}": "${questionText.substring(0, 40)}..."`,
    type: 'question',
    link: '/vendor/dashboard',
  });

  res.status(201).json({
    success: true,
    message: 'Your question has been submitted. It will appear publicly after moderation.',
    question,
  });
});

/**
 * @desc    Answer a customer question
 * @route   PATCH /api/questions/:id/answer
 * @access  Private (Vendor only)
 */
exports.answerQuestion = asyncHandler(async (req, res, next) => {
  const { answerText } = req.body;
  if (!answerText) {
    return next(new AppError('Answer text is required.', 400));
  }

  const question = await Question.findById(req.params.id)
    .populate('vehicle', 'name')
    .populate('customer', 'name');

  if (!question) {
    return next(new AppError('Question not found.', 404));
  }

  // Auth check: only the vendor owning the vehicle can answer
  if (question.vendor.toString() !== req.user.id) {
    return next(new AppError('Not authorized to answer this question.', 403));
  }

  question.answerText = answerText;
  question.isAnswered = true;
  await question.save();

  // Notify the Customer that their question has been answered
  await Notification.create({
    user: question.customer._id,
    title: 'Question Answered! 💬',
    message: `The dealer answered your question about "${question.vehicle.name}": "${answerText.substring(0, 40)}..."`,
    type: 'question',
    link: '/customer/dashboard',
  });

  res.status(200).json({
    success: true,
    message: 'Answer submitted successfully.',
    question,
  });
});

/**
 * @desc    Get public moderated questions for a vehicle listing
 * @route   GET /api/questions/vehicle/:vehicleId
 * @access  Public
 */
exports.getVehicleQuestions = asyncHandler(async (req, res, next) => {
  const questions = await Question.find({
    vehicle: req.params.vehicleId,
    isApproved: true,
  })
    .populate('customer', 'name')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: questions.length,
    questions,
  });
});

/**
 * @desc    Get all questions for a vendor (both answered and unanswered)
 * @route   GET /api/questions/vendor
 * @access  Private (Vendor only)
 */
exports.getVendorQuestions = asyncHandler(async (req, res, next) => {
  const questions = await Question.find({ vendor: req.user.id })
    .populate('vehicle', 'name brand model images')
    .populate('customer', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: questions.length,
    questions,
  });
});
