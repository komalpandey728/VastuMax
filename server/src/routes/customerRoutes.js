const express = require('express');
const {
  getCustomerProfile,
  updateCustomerProfile,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getNotifications,
  markNotificationRead,
} = require('../controllers/customerController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all customer endpoints
router.use(protect);

router.route('/profile')
  .get(getCustomerProfile)
  .put(updateCustomerProfile);

router.route('/wishlist')
  .get(getWishlist);

router.route('/wishlist/:vehicleId')
  .post(addToWishlist)
  .delete(removeFromWishlist);

router.route('/notifications')
  .get(getNotifications);

router.route('/notifications/:id/read')
  .patch(markNotificationRead);

module.exports = router;
