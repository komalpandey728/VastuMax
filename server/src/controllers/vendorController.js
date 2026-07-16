const VendorProfile = require('../models/VendorProfile');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { VENDOR_STATUS } = require('../constants');

// Utility to parse file paths from Multer (handles Cloudinary and local disk)
const getFileUrl = (files, fieldName) => {
  const fileArray = files?.[fieldName];
  if (!fileArray || fileArray.length === 0) return '';
  // Cloudinary puts URL in .path, local storage has filename
  return fileArray[0].path?.startsWith('http') 
    ? fileArray[0].path 
    : `/uploads/${fileArray[0].filename}`;
};

/**
 * @desc    Submit Digital Onboarding KYC details
 * @route   POST /api/vendors/onboarding
 * @access  Private (Vendor only)
 */
exports.submitOnboarding = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  // Check if profile already exists
  let profile = await VendorProfile.findOne({ user: userId });

  if (profile && profile.status === VENDOR_STATUS.APPROVED) {
    return next(new AppError('Your onboarding is already approved.', 400));
  }

  // Ensure documents are uploaded for new submissions
  if (!profile) {
    if (!req.files?.['cancelledChequeImage'] || !req.files?.['businessProofImage']) {
      return next(new AppError('Cancelled cheque and Business proof documents are required.', 400));
    }
  }

  const {
    businessName,
    gstNumber,
    panNumber,
    aadharNumber,
    drivingLicenseNumber,
    street,
    city,
    state,
    zipCode,
    accountHolderName,
    accountNumber,
    bankName,
    ifscCode,
  } = req.body;

  // Collect file URLs
  const profilePicture = getFileUrl(req.files, 'profilePicture') || profile?.profilePicture || '';
  const cancelledChequeImage = getFileUrl(req.files, 'cancelledChequeImage') || profile?.cancelledChequeImage;
  const businessProofImage = getFileUrl(req.files, 'businessProofImage') || profile?.businessProofImage;

  const profileData = {
    user: userId,
    businessName,
    gstNumber,
    panNumber,
    aadharNumber,
    drivingLicenseNumber,
    address: { street, city, state, zipCode },
    bankDetails: { accountHolderName, accountNumber, bankName, ifscCode },
    profilePicture,
    cancelledChequeImage,
    businessProofImage,
    status: VENDOR_STATUS.PENDING, // Reset status to pending on submit/resubmit
    rejectionReason: '', // Clear previous rejection reasons
  };

  if (profile) {
    // Update existing profile
    profile = await VendorProfile.findOneAndUpdate(
      { user: userId },
      { $set: profileData },
      { new: true, runValidators: true }
    );
  } else {
    // Create new profile
    profile = await VendorProfile.create(profileData);
  }

  res.status(200).json({
    success: true,
    message: 'Onboarding application submitted successfully. Pending admin review.',
    profile,
  });
});

/**
 * @desc    Get Current Vendor Onboarding Status & Profile
 * @route   GET /api/vendors/profile
 * @access  Private (Vendor only)
 */
exports.getVendorProfile = asyncHandler(async (req, res, next) => {
  const profile = await VendorProfile.findOne({ user: req.user.id });

  if (!profile) {
    return res.status(200).json({
      success: true,
      message: 'No onboarding profile found. Please start onboarding.',
      profile: null,
    });
  }

  res.status(200).json({
    success: true,
    profile,
  });
});

/**
 * @desc    List verified vendors for public directory
 * @route   GET /api/vendors/public
 * @access  Public
 */
exports.listPublicVendors = asyncHandler(async (req, res) => {
  const profiles = await VendorProfile.find({ status: VENDOR_STATUS.APPROVED })
    .populate('user', 'name email phone avatar')
    .sort({ rating: -1 });

  const withInventory = await Promise.all(
    profiles.map(async (profile) => {
      const count = await Vehicle.countDocuments({
        vendor: profile.user._id,
        status: 'active',
      });
      return {
        ...profile.toObject(),
        inventoryCount: count,
      };
    })
  );

  res.status(200).json({ success: true, count: withInventory.length, vendors: withInventory });
});

/**
 * @desc    Get public vendor profile by ID
 * @route   GET /api/vendors/public/:id
 * @access  Public
 */
exports.getPublicVendor = asyncHandler(async (req, res, next) => {
  const profile = await VendorProfile.findById(req.params.id).populate(
    'user',
    'name email phone avatar'
  );

  if (!profile || profile.status !== VENDOR_STATUS.APPROVED) {
    return next(new AppError('Vendor not found or not verified.', 404));
  }

  const vehicles = await Vehicle.find({
    vendor: profile.user._id,
    status: 'active',
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    profile,
    vehicles,
    inventoryCount: vehicles.length,
  });
});

/**
 * @desc    Update Vendor profile info
 * @route   PUT /api/vendors/profile
 * @access  Private (Vendor only)
 */
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  let profile = await VendorProfile.findOne({ user: userId });

  if (!profile) {
    return next(new AppError('No vendor profile found.', 404));
  }

  const {
    businessName,
    street,
    city,
    state,
    zipCode,
    accountHolderName,
    accountNumber,
    bankName,
    ifscCode,
  } = req.body;

  // Collect file URLs
  const profilePicture = getFileUrl(req.files, 'profilePicture') || profile.profilePicture || '';

  const updateData = {
    businessName: businessName || profile.businessName,
    address: {
      street: street !== undefined ? street : profile.address?.street,
      city: city !== undefined ? city : profile.address?.city,
      state: state !== undefined ? state : profile.address?.state,
      zipCode: zipCode !== undefined ? zipCode : profile.address?.zipCode,
    },
    bankDetails: {
      accountHolderName: accountHolderName !== undefined ? accountHolderName : profile.bankDetails?.accountHolderName,
      accountNumber: accountNumber !== undefined ? accountNumber : profile.bankDetails?.accountNumber,
      bankName: bankName !== undefined ? bankName : profile.bankDetails?.bankName,
      ifscCode: ifscCode !== undefined ? ifscCode : profile.bankDetails?.ifscCode,
    },
    profilePicture,
  };

  profile = await VendorProfile.findOneAndUpdate(
    { user: userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    profile,
  });
});
