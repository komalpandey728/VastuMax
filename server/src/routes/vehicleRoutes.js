const express = require('express');
const {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
  getVendorVehicles,
} = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { ROLES } = require('../constants');

const router = express.Router();

const uploadFields = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'threeSixtyImages', maxCount: 30 },
  { name: 'video', maxCount: 1 },
]);

// Public Listing Queries
router.get('/', getVehicles);
router.get('/detail/:id', getVehicle);

// Protected Operations (Vendor/Admin listings management)
router.post(
  '/',
  protect,
  authorize(ROLES.VENDOR, ROLES.ADMIN),
  uploadFields,
  createVehicle
);

router.get(
  '/vendor/listings',
  protect,
  authorize(ROLES.VENDOR),
  getVendorVehicles
);

router.route('/:id')
  .put(
    protect,
    authorize(ROLES.VENDOR, ROLES.ADMIN),
    uploadFields,
    updateVehicle
  )
  .delete(
    protect,
    authorize(ROLES.VENDOR, ROLES.ADMIN),
    deleteVehicle
  );

module.exports = router;
