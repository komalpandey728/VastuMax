const Lead = require('../models/Lead');
const Vehicle = require('../models/Vehicle');
const Notification = require('../models/Notification');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Submit "Ask a Question" lead (guest or logged-in)
 * @route   POST /api/leads
 * @access  Public
 */
exports.createLead = asyncHandler(async (req, res, next) => {
  const { vehicleId, name, phone, message } = req.body;

  if (!vehicleId || !name || !phone || !message) {
    return next(new AppError('Vehicle, name, phone, and message are required.', 400));
  }

  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    return next(new AppError('Vehicle listing not found.', 404));
  }

  const lead = await Lead.create({
    vehicle: vehicleId,
    vendor: vehicle.vendor,
    customer: req.user?.id || null,
    name,
    phone,
    message,
  });

  await Notification.create({
    user: vehicle.vendor,
    title: 'New Customer Inquiry 📞',
    message: `${name} asked about "${vehicle.name}": "${message.substring(0, 50)}..."`,
    type: 'lead',
    link: '/vendor/dashboard',
  });

  res.status(201).json({
    success: true,
    message: 'Your inquiry has been submitted. The dealer will contact you shortly.',
    lead,
  });
});

/**
 * @desc    Get all leads (admin)
 * @route   GET /api/leads
 * @access  Private (Admin)
 */
exports.getLeads = asyncHandler(async (req, res) => {
  const leads = await Lead.find()
    .populate('vehicle', 'name brand model price images')
    .populate('vendor', 'name email phone')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: leads.length,
    leads,
  });
});

/**
 * @desc    Update lead status
 * @route   PATCH /api/leads/:id
 * @access  Private (Admin)
 */
exports.updateLeadStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!lead) {
    return next(new AppError('Lead not found.', 404));
  }

  res.status(200).json({ success: true, lead });
});
