const Vehicle = require('../models/Vehicle');
const VendorProfile = require('../models/VendorProfile');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { VEHICLE_STATUS, VENDOR_STATUS } = require('../constants');

// Helper to extract uploaded file paths
const getFilesUrls = (req, fieldName) => {
  const files = req.files?.[fieldName];
  if (!files || files.length === 0) return [];
  return files.map((file) => 
    file.path?.startsWith('http') ? file.path : `/uploads/${file.filename}`
  );
};

/**
 * @desc    Create a new vehicle listing
 * @route   POST /api/vehicles
 * @access  Private (Vendor / Admin only)
 */
exports.createVehicle = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  // Check if Vendor is approved before allowing upload
  if (userRole === 'vendor') {
    const vendorProfile = await VendorProfile.findOne({ user: userId });
    if (!vendorProfile || vendorProfile.status !== VENDOR_STATUS.APPROVED) {
      return next(
        new AppError('Your dealership KYC onboarding must be Approved by the admin before listing vehicles.', 403)
      );
    }
  }

  // Parse location coordinates
  const lat = parseFloat(req.body.latitude);
  const lng = parseFloat(req.body.longitude);
  if (isNaN(lat) || isNaN(lng)) {
    return next(new AppError('Valid location coordinates (latitude and longitude) are required.', 400));
  }

  // Parse arrays/objects from JSON strings (since formData transmits them as strings)
  let features = [];
  try {
    features = req.body.features ? JSON.parse(req.body.features) : [];
  } catch {
    features = req.body.features ? req.body.features.split(',') : [];
  }

  let specifications = {};
  try {
    specifications = req.body.specifications ? JSON.parse(req.body.specifications) : {};
  } catch {
    specifications = {
      bootSpace: req.body.bootSpace || '',
      groundClearance: req.body.groundClearance || '',
      topSpeed: req.body.topSpeed || '',
      zeroToHundred: req.body.zeroToHundred || '',
      safetyRating: req.body.safetyRating || 'Not Rated',
      warranty: req.body.warranty || 'No Warranty',
      color: req.body.color || '',
      bodyType: req.body.bodyType || '',
      payloadCapacity: req.body.payloadCapacity || '',
      gvw: req.body.gvw || '',
      numTyres: req.body.numTyres || '',
      pros: req.body.pros ? req.body.pros.split(',') : [],
      cons: req.body.cons ? req.body.cons.split(',') : [],
    };
  }

  // Extract uploaded files
  const images = getFilesUrls(req, 'images');
  const threeSixtyImages = getFilesUrls(req, 'threeSixtyImages');
  
  let video = '';
  if (req.files?.['video'] && req.files['video'].length > 0) {
    video = req.files['video'][0].path?.startsWith('http') 
      ? req.files['video'][0].path 
      : `/uploads/${req.files['video'][0].filename}`;
  }

  const vehicleData = {
    name: req.body.name,
    brand: req.body.brand,
    model: req.body.model,
    variant: req.body.variant,
    year: parseInt(req.body.year, 10),
    price: parseFloat(req.body.price),
    fuel: req.body.fuel,
    transmission: req.body.transmission,
    engine: req.body.engine,
    power: req.body.power,
    torque: req.body.torque,
    mileage: parseFloat(req.body.mileage),
    ownership: req.body.ownership,
    insurance: req.body.insurance,
    serviceHistory: req.body.serviceHistory,
    registration: req.body.registration,
    description: req.body.description,
    features,
    specifications,
    location: {
      type: 'Point',
      coordinates: [lng, lat], // [longitude, latitude] for GeoJSON
      city: req.body.city,
      state: req.body.state,
    },
    images,
    threeSixtyImages,
    video,
    featured: req.body.featured === 'true' || req.body.featured === true,
    verified: req.body.verified === 'true' || req.body.verified === true,
    vendor: userId,
    status: req.body.status || VEHICLE_STATUS.ACTIVE,
  };

  const vehicle = await Vehicle.create(vehicleData);

  res.status(201).json({
    success: true,
    message: 'Vehicle listing created successfully.',
    vehicle,
  });
});

/**
 * @desc    Get all vehicles (Advanced Search, Filters, Location Proximity)
 * @route   GET /api/vehicles
 * @access  Public
 */
exports.getVehicles = asyncHandler(async (req, res, next) => {
  const queryObj = { status: VEHICLE_STATUS.ACTIVE };

  // Text search
  if (req.query.search) {
    const q = req.query.search;
    const startRegex = new RegExp(`^${q}`, 'i');
    const containRegex = new RegExp(q, 'i');
    
    const count = await Vehicle.countDocuments({
      status: VEHICLE_STATUS.ACTIVE,
      $or: [
        { name: startRegex },
        { brand: startRegex },
        { model: startRegex }
      ]
    });

    if (count > 0) {
      queryObj.$or = [
        { name: startRegex },
        { brand: startRegex },
        { model: startRegex }
      ];
    } else {
      queryObj.$or = [
        { name: containRegex },
        { brand: containRegex },
        { model: containRegex },
        { description: containRegex }
      ];
    }
  }

  // Exact Match filters
  if (req.query.brand) queryObj.brand = req.query.brand;
  if (req.query.model) queryObj.model = req.query.model;
  if (req.query.fuel) queryObj.fuel = req.query.fuel;
  if (req.query.transmission) queryObj.transmission = req.query.transmission;
  if (req.query.ownership) {
    const ownMap = {
      '1st Owner': 'First Owner',
      '2nd Owner': 'Second Owner',
      '3rd Owner': 'Third Owner',
      '3rd Owner or more': ['Third Owner', 'Fourth Owner+'],
      'First Owner': 'First Owner',
      'Second Owner': 'Second Owner',
      'Third Owner': 'Third Owner',
      'Fourth Owner+': 'Fourth Owner+',
    };
    const mapped = ownMap[req.query.ownership];
    if (Array.isArray(mapped)) {
      queryObj.ownership = { $in: mapped };
    } else if (mapped) {
      queryObj.ownership = mapped;
    } else {
      queryObj.ownership = req.query.ownership;
    }
  }
  if (req.query.city) queryObj['location.city'] = new RegExp(`^${req.query.city}$`, 'i');

  if (req.query.bodyType) {
    const cleanBodyType = req.query.bodyType.toLowerCase().replace(/[^a-z0-9]/g, '');
    const regexPattern = cleanBodyType.split('').join('.*');
    const regex = new RegExp(regexPattern, 'i');
    const bodyTypeQuery = {
      $or: [
        { bodyType: regex },
        { 'specifications.bodyType': regex }
      ]
    };
    if (queryObj.$and) {
      queryObj.$and.push(bodyTypeQuery);
    } else if (queryObj.$or) {
      queryObj.$and = [{ $or: queryObj.$or }, bodyTypeQuery];
      delete queryObj.$or;
    } else {
      queryObj.$or = bodyTypeQuery.$or;
    }
  }

  // CV specifications queries
  if (req.query.payloadCapacity) queryObj['specifications.payloadCapacity'] = req.query.payloadCapacity;
  if (req.query.gvw) queryObj['specifications.gvw'] = req.query.gvw;
  if (req.query.numTyres) queryObj['specifications.numTyres'] = req.query.numTyres;

  // Category filter: car | commercial (also accept ?category=cars or ?type=Commercial)
  if (req.query.category) {
    const cat = req.query.category.toLowerCase().replace(/s$/, '');
    if (cat === 'car' || cat === 'commercial') queryObj.category = cat;
  }
  if (req.query.type) {
    const t = req.query.type.toLowerCase();
    if (t === 'commercial') queryObj.category = 'commercial';
    else if (t === 'car') queryObj.category = 'car';
  }

  // Range filters
  if (req.query.minPrice || req.query.maxPrice) {
    queryObj.price = {};
    if (req.query.minPrice) queryObj.price.$gte = parseFloat(req.query.minPrice);
    if (req.query.maxPrice) queryObj.price.$lte = parseFloat(req.query.maxPrice);
  }

  if (req.query.minYear || req.query.maxYear) {
    queryObj.year = {};
    if (req.query.minYear) queryObj.year.$gte = parseInt(req.query.minYear, 10);
    if (req.query.maxYear) queryObj.year.$lte = parseInt(req.query.maxYear, 10);
  }

  if (req.query.minMileage || req.query.maxMileage) {
    queryObj.mileage = {};
    if (req.query.minMileage) queryObj.mileage.$gte = parseFloat(req.query.minMileage);
    if (req.query.maxMileage) queryObj.mileage.$lte = parseFloat(req.query.maxMileage);
  }

  // Location Proximity Query (Within radius in km)
  let geoQuery = null;
  if (req.query.lat && req.query.lng) {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const maxDistanceKm = parseFloat(req.query.maxDistance) || 50; // default 50km

    if (!isNaN(lat) && !isNaN(lng)) {
      queryObj['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $maxDistance: maxDistanceKm * 1000, // MongoDB distance in meters
        },
      };
      // MongoDB $near query handles sorting itself by distance, we don't apply sorting object
      geoQuery = true;
    }
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const skip = (page - 1) * limit;

  let query = Vehicle.find(queryObj);

  // Sorting (Skip if location proximity sorting is applied, as $near sorts by distance)
  if (!geoQuery) {
    const sortBy = req.query.sort;
    if (sortBy === 'price-low') {
      query = query.sort({ price: 1 });
    } else if (sortBy === 'price-high') {
      query = query.sort({ price: -1 });
    } else if (sortBy === 'year-new') {
      query = query.sort({ year: -1 });
    } else if (sortBy === 'year-old') {
      query = query.sort({ year: 1 });
    } else if (sortBy === 'mileage-low') {
      query = query.sort({ mileage: 1 });
    } else {
      query = query.sort({ createdAt: -1 }); // default newest first
    }
  }

  query = query.skip(skip).limit(limit).populate('vendor', 'name email phone avatar');

  const vehicles = await query;
  const total = await Vehicle.countDocuments(queryObj);

  res.status(200).json({
    success: true,
    count: vehicles.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
    vehicles,
  });
});

/**
 * @desc    Get single vehicle details
 * @route   GET /api/vehicles/:id
 * @access  Public
 */
exports.getVehicle = asyncHandler(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id)
    .populate('vendor', 'name email phone avatar');

  if (!vehicle) {
    return next(new AppError('Vehicle listing not found.', 404));
  }

  // Get active vendor info if available
  const vendorProfile = await VendorProfile.findOne({ user: vehicle.vendor._id });

  res.status(200).json({
    success: true,
    vehicle,
    vendorProfile,
  });
});

/**
 * @desc    Update a vehicle listing
 * @route   PUT /api/vehicles/:id
 * @access  Private (Vendor / Admin only)
 */
exports.updateVehicle = asyncHandler(async (req, res, next) => {
  let vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return next(new AppError('Vehicle listing not found.', 404));
  }

  // Authorization Check: Vendor can only update their own listings; Admin can update any.
  if (req.user.role !== 'admin' && vehicle.vendor.toString() !== req.user.id) {
    return next(new AppError('Not authorized to edit this listing.', 403));
  }

  // Parse coordinates if provided
  let locationData = vehicle.location;
  if (req.body.latitude && req.body.longitude) {
    const lat = parseFloat(req.body.latitude);
    const lng = parseFloat(req.body.longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      locationData = {
        type: 'Point',
        coordinates: [lng, lat],
        city: req.body.city || vehicle.location.city,
        state: req.body.state || vehicle.location.state,
      };
    }
  } else if (req.body.city || req.body.state) {
    locationData = {
      ...vehicle.location,
      city: req.body.city || vehicle.location.city,
      state: req.body.state || vehicle.location.state,
    };
  }

  // Merge JSON arrays/objects
  let features = vehicle.features;
  if (req.body.features) {
    try {
      features = JSON.parse(req.body.features);
    } catch {
      features = req.body.features.split(',');
    }
  }

  let specifications = vehicle.specifications;
  if (req.body.specifications) {
    try {
      specifications = JSON.parse(req.body.specifications);
    } catch {
      specifications = { ...vehicle.specifications, ...req.body };
    }
  }

  // Append new media files if uploaded, else keep existing
  let images = vehicle.images;
  if (req.body.existingImages) {
    try {
      images = JSON.parse(req.body.existingImages);
    } catch (e) {
      // fallback
    }
  }
  const newImages = getFilesUrls(req, 'images');
  if (newImages.length > 0) {
    images = [...images, ...newImages];
  }

  let threeSixtyImages = vehicle.threeSixtyImages;
  if (req.body.existing360) {
    try {
      threeSixtyImages = JSON.parse(req.body.existing360);
    } catch (e) {
      // fallback
    }
  }
  const newThreeSixty = getFilesUrls(req, 'threeSixtyImages');
  if (newThreeSixty.length > 0) {
    threeSixtyImages = [...threeSixtyImages, ...newThreeSixty];
  }

  let video = vehicle.video;
  if (req.files?.['video'] && req.files['video'].length > 0) {
    video = req.files['video'][0].path?.startsWith('http') 
      ? req.files['video'][0].path 
      : `/uploads/${req.files['video'][0].filename}`;
  }

  const updatedData = {
    name: req.body.name || vehicle.name,
    brand: req.body.brand || vehicle.brand,
    model: req.body.model || vehicle.model,
    variant: req.body.variant || vehicle.variant,
    year: req.body.year ? parseInt(req.body.year, 10) : vehicle.year,
    price: req.body.price ? parseFloat(req.body.price) : vehicle.price,
    fuel: req.body.fuel || vehicle.fuel,
    transmission: req.body.transmission || vehicle.transmission,
    engine: req.body.engine || vehicle.engine,
    power: req.body.power || vehicle.power,
    torque: req.body.torque || vehicle.torque,
    mileage: req.body.mileage ? parseFloat(req.body.mileage) : vehicle.mileage,
    ownership: req.body.ownership || vehicle.ownership,
    insurance: req.body.insurance || vehicle.insurance,
    serviceHistory: req.body.serviceHistory || vehicle.serviceHistory,
    registration: req.body.registration || vehicle.registration,
    description: req.body.description || vehicle.description,
    features,
    specifications,
    location: locationData,
    images,
    threeSixtyImages,
    video,
    featured: req.body.featured !== undefined ? req.body.featured === 'true' || req.body.featured === true : vehicle.featured,
    verified: req.body.verified !== undefined ? req.body.verified === 'true' || req.body.verified === true : vehicle.verified,
    status: req.body.status || vehicle.status,
  };

  vehicle = await Vehicle.findByIdAndUpdate(req.params.id, { $set: updatedData }, { new: true, runValidators: true });

  res.status(200).json({
    success: true,
    message: 'Vehicle listing updated successfully.',
    vehicle,
  });
});

/**
 * @desc    Delete a vehicle listing
 * @route   DELETE /api/vehicles/:id
 * @access  Private (Vendor / Admin only)
 */
exports.deleteVehicle = asyncHandler(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return next(new AppError('Vehicle listing not found.', 404));
  }

  // Authorization Check
  if (req.user.role !== 'admin' && vehicle.vendor.toString() !== req.user.id) {
    return next(new AppError('Not authorized to delete this listing.', 403));
  }

  await vehicle.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Vehicle listing deleted successfully.',
  });
});

/**
 * @desc    Get current vendor's listings
 * @route   GET /api/vehicles/vendor/listings
 * @access  Private (Vendor only)
 */
exports.getVendorVehicles = asyncHandler(async (req, res, next) => {
  const vehicles = await Vehicle.find({ vendor: req.user.id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: vehicles.length,
    vehicles,
  });
});
