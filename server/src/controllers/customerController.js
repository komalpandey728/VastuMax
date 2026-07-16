const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Notification = require('../models/Notification');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get customer profile
 * @route   GET /api/customers/profile
 * @access  Private (Customer only)
 */
exports.getCustomerProfile = asyncHandler(async (req, res, next) => {
  const customer = await User.findById(req.user.id).select('-password');
  res.status(200).json({ success: true, customer });
});

/**
 * @desc    Update customer profile (includes location coordinates)
 * @route   PUT /api/customers/profile
 * @access  Private (Customer only)
 */
exports.updateCustomerProfile = asyncHandler(async (req, res, next) => {
  const { name, phone, latitude, longitude, city, state } = req.body;
  
  const updateData = { name, phone };

  if (latitude && longitude) {
    updateData.location = {
      type: 'Point',
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
      city,
      state,
    };
  }

  const customer = await User.findByIdAndUpdate(
    req.user.id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select('-password');

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    customer,
  });
});

/**
 * @desc    Add vehicle to customer wishlist
 * @route   POST /api/customers/wishlist/:vehicleId
 * @access  Private (Customer only)
 */
exports.addToWishlist = asyncHandler(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.vehicleId);
  if (!vehicle) {
    return next(new AppError('Vehicle not found', 404));
  }

  const user = await User.findById(req.user.id);
  if (user.wishlist.includes(req.params.vehicleId)) {
    return res.status(200).json({ success: true, message: 'Vehicle already in wishlist', wishlist: user.wishlist });
  }

  user.wishlist.push(req.params.vehicleId);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Vehicle added to wishlist successfully',
    wishlist: user.wishlist,
  });
});

/**
 * @desc    Remove vehicle from customer wishlist
 * @route   DELETE /api/customers/wishlist/:vehicleId
 * @access  Private (Customer only)
 */
exports.removeFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.vehicleId);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Vehicle removed from wishlist successfully',
    wishlist: user.wishlist,
  });
});

/**
 * @desc    Get customer wishlist items
 * @route   GET /api/customers/wishlist
 * @access  Private (Customer/Vendor/Admin - but mainly Customer)
 */
exports.getWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: 'wishlist',
    populate: { path: 'vendor', select: 'name email' }
  });

  res.status(200).json({
    success: true,
    wishlist: user.wishlist,
  });
});

/**
 * @desc    Get all notifications for logged-in user
 * @route   GET /api/customers/notifications
 * @access  Private
 */
exports.getNotifications = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.find({ user: req.user.id })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    notifications,
  });
});

/**
 * @desc    Mark a notification as read
 * @route   PATCH /api/customers/notifications/:id/read
 * @access  Private
 */
exports.markNotificationRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }

  res.status(200).json({
    success: true,
    notification,
  });
});
