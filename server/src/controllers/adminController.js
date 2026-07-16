const User = require('../models/User');
const VendorProfile = require('../models/VendorProfile');
const Vehicle = require('../models/Vehicle');
const Question = require('../models/Question');
const Brand = require('../models/Brand');
const Category = require('../models/Category');
const City = require('../models/City');
const Notification = require('../models/Notification');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { VENDOR_STATUS, ROLES } = require('../constants');

/**
 * @desc    Get Admin Dashboard Analytics
 * @route   GET /api/admin/stats
 * @access  Private (Admin only)
 */
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  const totalCustomers = await User.countDocuments({ role: ROLES.CUSTOMER });
  const totalVendors = await User.countDocuments({ role: ROLES.VENDOR });
  
  const pendingVendors = await VendorProfile.countDocuments({ status: VENDOR_STATUS.PENDING });
  const approvedVendors = await VendorProfile.countDocuments({ status: VENDOR_STATUS.APPROVED });

  const totalVehicles = await Vehicle.countDocuments();
  const activeVehicles = await Vehicle.countDocuments({ status: 'active' });
  const soldVehicles = await Vehicle.countDocuments({ status: 'sold' });

  // Get recent activity (newest 5 listings, newest 5 signups)
  const recentVehicles = await Vehicle.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('vendor', 'name email');

  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name email role createdAt');

  res.status(200).json({
    success: true,
    stats: {
      totalCustomers,
      totalVendors,
      pendingVendors,
      approvedVendors,
      totalVehicles,
      activeVehicles,
      soldVehicles,
    },
    recentVehicles,
    recentUsers,
  });
});

/**
 * @desc    Get List of Vendors (Optional status filtering)
 * @route   GET /api/admin/vendors
 * @access  Private (Admin only)
 */
exports.getVendors = asyncHandler(async (req, res, next) => {
  const { status } = req.query;
  const filter = {};
  if (status) {
    filter.status = status;
  }

  const profiles = await VendorProfile.find(filter)
    .populate('user', 'name email phone isActive')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    profiles,
  });
});

/**
 * @desc    Approve Vendor Onboarding
 * @route   POST /api/admin/vendors/:id/approve
 * @access  Private (Admin only)
 */
exports.approveVendor = asyncHandler(async (req, res, next) => {
  const profile = await VendorProfile.findById(req.params.id);

  if (!profile) {
    return next(new AppError('Vendor onboarding profile not found', 404));
  }

  profile.status = VENDOR_STATUS.APPROVED;
  profile.rejectionReason = '';
  await profile.save();

  // Create success notification for vendor
  await Notification.create({
    user: profile.user,
    title: 'KYC Onboarding Approved 🎉',
    message: `Congratulations! Your dealership onboarding for "${profile.businessName}" has been approved. You can now start listing vehicles.`,
    type: 'onboarding',
    link: '/vendor/dashboard',
  });

  res.status(200).json({
    success: true,
    message: 'Vendor approved successfully.',
    profile,
  });
});

/**
 * @desc    Reject Vendor Onboarding
 * @route   POST /api/admin/vendors/:id/reject
 * @access  Private (Admin only)
 */
exports.rejectVendor = asyncHandler(async (req, res, next) => {
  const { rejectionReason } = req.body;
  if (!rejectionReason) {
    return next(new AppError('Please provide a reason for rejection', 400));
  }

  const profile = await VendorProfile.findById(req.params.id);

  if (!profile) {
    return next(new AppError('Vendor onboarding profile not found', 404));
  }

  profile.status = VENDOR_STATUS.REJECTED;
  profile.rejectionReason = rejectionReason;
  await profile.save();

  // Create notification for vendor
  await Notification.create({
    user: profile.user,
    title: 'KYC Onboarding Rejected ⚠️',
    message: `Your onboarding submission was rejected: ${rejectionReason}. Please update and resubmit.`,
    type: 'onboarding',
    link: '/vendor/onboarding',
  });

  res.status(200).json({
    success: true,
    message: 'Vendor onboarding rejected.',
    profile,
  });
});

/**
 * @desc    Get List of Customers
 * @route   GET /api/admin/customers
 * @access  Private (Admin only)
 */
exports.getCustomers = asyncHandler(async (req, res, next) => {
  const customers = await User.find({ role: ROLES.CUSTOMER })
    .select('name email phone isActive createdAt')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    customers,
  });
});

/**
 * @desc    Toggle User Account Active Status
 * @route   PATCH /api/admin/users/:id/toggle-status
 * @access  Private (Admin only)
 */
exports.toggleUserStatus = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (user.role === ROLES.ADMIN) {
    return next(new AppError('Admin account status cannot be toggled', 400));
  }

  user.isActive = !user.isActive;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User account is now ${user.isActive ? 'Active' : 'Deactivated'}.`,
    user,
  });
});

/* ==========================================================================
   METADATA MANAGEMENT (Brands, Categories, Cities)
   ========================================================================== */

// Brand Controllers
exports.getBrands = asyncHandler(async (req, res, next) => {
  const brands = await Brand.find().sort({ name: 1 });
  res.status(200).json({ success: true, brands });
});

exports.createBrand = asyncHandler(async (req, res, next) => {
  const { name, logo } = req.body;
  const brand = await Brand.create({ name, logo });
  res.status(201).json({ success: true, brand });
});

exports.deleteBrand = asyncHandler(async (req, res, next) => {
  await Brand.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'Brand deleted' });
});

// Category Controllers
exports.getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort({ name: 1 });
  res.status(200).json({ success: true, categories });
});

exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name, icon } = req.body;
  const category = await Category.create({ name, icon });
  res.status(201).json({ success: true, category });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  await Category.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'Category deleted' });
});

// City Controllers
exports.getCities = asyncHandler(async (req, res, next) => {
  const cities = await City.find().sort({ name: 1 });
  res.status(200).json({ success: true, cities });
});

exports.createCity = asyncHandler(async (req, res, next) => {
  const { name, state } = req.body;
  const city = await City.create({ name, state });
  res.status(201).json({ success: true, city });
});

exports.deleteCity = asyncHandler(async (req, res, next) => {
  await City.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'City deleted' });
});

/* ==========================================================================
   QUESTION MODERATION
   ========================================================================== */

exports.getPendingQuestions = asyncHandler(async (req, res, next) => {
  const questions = await Question.find({ isApproved: false })
    .populate('vehicle', 'name brand model')
    .populate('customer', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    questions,
  });
});

exports.approveQuestion = asyncHandler(async (req, res, next) => {
  const question = await Question.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true }
  );

  if (!question) {
    return next(new AppError('Question not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Question approved for public view',
    question,
  });
});

exports.deleteQuestion = asyncHandler(async (req, res, next) => {
  await Question.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Question deleted successfully',
  });
});
