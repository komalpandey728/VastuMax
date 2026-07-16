const express = require('express');
const {
  createBooking,
  getCustomerBookings,
  getVendorBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../constants');

const router = express.Router();

router.use(protect);

// Customer bookings routes
router.post('/', authorize(ROLES.CUSTOMER), createBooking);
router.get('/customer', authorize(ROLES.CUSTOMER), getCustomerBookings);

// Vendor bookings routes
router.get('/vendor', authorize(ROLES.VENDOR), getVendorBookings);
router.patch('/:id/status', authorize(ROLES.VENDOR), updateBookingStatus);

module.exports = router;
