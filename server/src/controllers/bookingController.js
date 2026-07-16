const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const Notification = require('../models/Notification');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Request/Book a Test Drive
 * @route   POST /api/bookings
 * @access  Private (Customer only)
 */
exports.createBooking = asyncHandler(async (req, res, next) => {
  const { vehicleId, bookingDate, bookingTime, notes } = req.body;
  const customerId = req.user.id;

  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    return next(new AppError('Vehicle listing not found.', 404));
  }

  const booking = await Booking.create({
    vehicle: vehicleId,
    customer: customerId,
    vendor: vehicle.vendor,
    bookingDate: new Date(bookingDate),
    bookingTime,
    notes,
  });

  // Notify the Vendor
  await Notification.create({
    user: vehicle.vendor,
    title: 'New Test Drive Booking Request 🚗',
    message: `A customer has requested a test drive for your listing: "${vehicle.name}" on ${bookingDate} at ${bookingTime}.`,
    type: 'booking',
    link: '/vendor/dashboard',
  });

  res.status(201).json({
    success: true,
    message: 'Test drive scheduled successfully. Waiting for dealer confirmation.',
    booking,
  });
});

/**
 * @desc    Get bookings of current customer
 * @route   GET /api/bookings/customer
 * @access  Private (Customer only)
 */
exports.getCustomerBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ customer: req.user.id })
    .populate('vehicle', 'name brand model images price location')
    .populate('vendor', 'name email phone')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings,
  });
});

/**
 * @desc    Get bookings for a vendor
 * @route   GET /api/bookings/vendor
 * @access  Private (Vendor only)
 */
exports.getVendorBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ vendor: req.user.id })
    .populate('vehicle', 'name brand model images price')
    .populate('customer', 'name email phone')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings,
  });
});

/**
 * @desc    Update Booking status (Approve / Reject / Complete)
 * @route   PATCH /api/bookings/:id/status
 * @access  Private (Vendor only)
 */
exports.updateBookingStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
    return next(new AppError('Invalid booking status', 400));
  }

  const booking = await Booking.findById(req.params.id).populate('vehicle', 'name');

  if (!booking) {
    return next(new AppError('Booking not found.', 404));
  }

  // Auth check: Only the vendor assigned to this booking can update it
  if (booking.vendor.toString() !== req.user.id) {
    return next(new AppError('Not authorized to update this booking.', 403));
  }

  booking.status = status;
  await booking.save();

  // Notify the Customer
  let title = 'Test Drive Update 🚗';
  let message = `Your test drive booking request for "${booking.vehicle.name}" has been ${status}.`;
  if (status === 'confirmed') {
    title = 'Test Drive Confirmed! ✅';
    message = `Awesome news! The dealer has confirmed your test drive for "${booking.vehicle.name}" on ${booking.bookingDate.toDateString()} at ${booking.bookingTime}.`;
  } else if (status === 'cancelled') {
    title = 'Test Drive Cancelled ❌';
    message = `Your test drive request for "${booking.vehicle.name}" was cancelled by the dealer.`;
  }

  await Notification.create({
    user: booking.customer,
    title,
    message,
    type: 'booking',
    link: '/customer/dashboard',
  });

  res.status(200).json({
    success: true,
    message: `Test drive booking status updated to ${status}.`,
    booking,
  });
});
