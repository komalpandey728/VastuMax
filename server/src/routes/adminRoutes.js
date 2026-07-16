const express = require('express');
const {
  getDashboardStats,
  getVendors,
  approveVendor,
  rejectVendor,
  getCustomers,
  toggleUserStatus,
  getBrands,
  createBrand,
  deleteBrand,
  getCategories,
  createCategory,
  deleteCategory,
  getCities,
  createCity,
  deleteCity,
  getPendingQuestions,
  approveQuestion,
  deleteQuestion,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../constants');

const router = express.Router();

// Route middleware restriction: Admin only
router.use(protect);
router.use(authorize(ROLES.ADMIN));

// Core Stats & Accounts
router.get('/stats', getDashboardStats);
router.get('/vendors', getVendors);
router.post('/vendors/:id/approve', approveVendor);
router.post('/vendors/:id/reject', rejectVendor);
router.get('/customers', getCustomers);
router.patch('/users/:id/toggle-status', toggleUserStatus);

// Brands Metadata
router.route('/brands')
  .get(getBrands)
  .post(createBrand);
router.delete('/brands/:id', deleteBrand);

// Categories Metadata
router.route('/categories')
  .get(getCategories)
  .post(createCategory);
router.delete('/categories/:id', deleteCategory);

// Cities Metadata
router.route('/cities')
  .get(getCities)
  .post(createCity);
router.delete('/cities/:id', deleteCity);

// Question Moderation
router.get('/questions/pending', getPendingQuestions);
router.patch('/questions/:id/approve', approveQuestion);
router.delete('/questions/:id', deleteQuestion);

module.exports = router;
