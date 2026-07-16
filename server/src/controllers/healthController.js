const asyncHandler = require('../utils/asyncHandler');
const config = require('../config');

exports.healthCheck = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Vastu Max API is running',
    environment: config.env,
    timestamp: new Date().toISOString(),
  });
});
