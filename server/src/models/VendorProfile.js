const mongoose = require('mongoose');
const { VENDOR_STATUS } = require('../constants');

const vendorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
    },
    gstNumber: {
      type: String,
      required: [true, 'GST number is required'],
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/, 'Please enter a valid GST number'],
    },
    panNumber: {
      type: String,
      required: [true, 'PAN number is required'],
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^[A-Z]{5}\d{4}[A-Z]{1}$/, 'Please enter a valid PAN number'],
    },
    aadharNumber: {
      type: String,
      required: [true, 'Aadhaar number is required'],
      unique: true,
      trim: true,
      match: [/^\d{12}$/, 'Please enter a valid 12-digit Aadhaar number'],
    },
    drivingLicenseNumber: {
      type: String,
      required: [true, 'Driving License number is required'],
      trim: true,
    },
    address: {
      street: { type: String, required: [true, 'Street address is required'] },
      city: { type: String, required: [true, 'City is required'] },
      state: { type: String, required: [true, 'State is required'] },
      zipCode: { type: String, required: [true, 'Zip code is required'] },
    },
    bankDetails: {
      accountHolderName: { type: String, required: [true, 'Account holder name is required'] },
      accountNumber: { type: String, required: [true, 'Account number is required'] },
      bankName: { type: String, required: [true, 'Bank name is required'] },
      ifscCode: { 
        type: String, 
        required: [true, 'IFSC code is required'],
        uppercase: true,
        match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please enter a valid IFSC code'],
      },
    },
    profilePicture: {
      type: String,
      default: '',
    },
    cancelledChequeImage: {
      type: String,
      required: [true, 'Cancelled cheque image is required'],
    },
    businessProofImage: {
      type: String,
      required: [true, 'Business proof document is required'],
    },
    additionalDocuments: [
      {
        name: String,
        url: String,
      }
    ],
    status: {
      type: String,
      enum: Object.values(VENDOR_STATUS),
      default: VENDOR_STATUS.PENDING,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    businessType: {
      type: String,
      enum: ['individual', 'dealer', 'dealership_chain'],
      default: 'dealer',
    },
    yearsActive: { type: Number, default: 1 },
    about: { type: String, default: '' },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    inventoryIntent: { type: Number, default: 0 },
    inventoryCategories: [{ type: String }],
    trackingId: { type: String, default: '' },
    verifiedBadge: { type: Boolean, default: false },
    logo: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    website: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

vendorProfileSchema.index({ user: 1 });
vendorProfileSchema.index({ status: 1 });

module.exports = mongoose.model('VendorProfile', vendorProfileSchema);
