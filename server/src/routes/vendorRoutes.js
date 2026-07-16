const express = require('express');
const {
  submitOnboarding,
  getVendorProfile,
  updateProfile,
  listPublicVendors,
  getPublicVendor,
} = require('../controllers/vendorController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { ROLES } = require('../constants');

const router = express.Router();

// Public vendor directory
router.get('/public', listPublicVendors);
router.get('/public/:id', getPublicVendor);

// Protected vendor routes
router.use(protect);
router.use(authorize(ROLES.VENDOR));

router.post(
  '/onboarding',
  upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'cancelledChequeImage', maxCount: 1 },
    { name: 'businessProofImage', maxCount: 1 },
  ]),
  submitOnboarding
);

router.put(
  '/profile',
  upload.fields([
    { name: 'profilePicture', maxCount: 1 }
  ]),
  updateProfile
);

router.get('/profile', getVendorProfile);

module.exports = router;
