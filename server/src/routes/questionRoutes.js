const express = require('express');
const {
  askQuestion,
  answerQuestion,
  getVehicleQuestions,
  getVendorQuestions,
} = require('../controllers/questionController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../constants');

const router = express.Router();

// Public: Get moderated questions for a vehicle
router.get('/vehicle/:vehicleId', getVehicleQuestions);

// Protected Routes
router.use(protect);

// Customer asks a question
router.post('/', authorize(ROLES.CUSTOMER), askQuestion);

// Vendor answers questions
router.get('/vendor', authorize(ROLES.VENDOR), getVendorQuestions);
router.patch('/:id/answer', authorize(ROLES.VENDOR), answerQuestion);

module.exports = router;
