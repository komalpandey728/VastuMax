const mongoose = require('mongoose');
const { FUEL_TYPES, TRANSMISSION_TYPES, OWNERSHIP_TYPES, VEHICLE_STATUS } = require('../constants');

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vehicle name is required'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    variant: {
      type: String,
      required: [true, 'Variant is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Manufacturing year is required'],
      min: [1900, 'Year cannot be before 1900'],
      max: [new Date().getFullYear() + 1, 'Invalid manufacturing year'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    fuel: {
      type: String,
      required: [true, 'Fuel type is required'],
      enum: FUEL_TYPES,
    },
    transmission: {
      type: String,
      required: [true, 'Transmission type is required'],
      enum: TRANSMISSION_TYPES,
    },
    engine: {
      type: String,
      required: [true, 'Engine specification is required'],
      trim: true,
    },
    power: {
      type: String,
      required: [true, 'Power specification is required'],
      trim: true,
    },
    torque: {
      type: String,
      required: [true, 'Torque specification is required'],
      trim: true,
    },
    mileage: {
      type: Number,
      required: [true, 'Mileage is required'],
      min: [0, 'Mileage cannot be negative'],
    },
    ownership: {
      type: String,
      required: [true, 'Ownership status is required'],
      enum: OWNERSHIP_TYPES,
    },
    insurance: {
      type: String,
      default: 'Not Insured',
      trim: true,
    },
    serviceHistory: {
      type: String,
      default: 'No History available',
      trim: true,
    },
    registration: {
      type: String,
      required: [true, 'Registration number / RTO State is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    specifications: {
      bootSpace: { type: String, default: '' },
      groundClearance: { type: String, default: '' },
      topSpeed: { type: String, default: '' },
      zeroToHundred: { type: String, default: '' },
      safetyRating: { type: String, default: 'Not Rated' },
      warranty: { type: String, default: 'No Warranty' },
      color: { type: String, default: '' },
      bodyType: { type: String, default: '' },
      payloadCapacity: { type: String, default: '' },
      gvw: { type: String, default: '' },
      numTyres: { type: String, default: '' },
      pros: [{ type: String, trim: true }],
      cons: [{ type: String, trim: true }],
      rating: { type: Number, default: 4.0, min: 1, max: 5 },
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Location coordinates are required'],
      },
      city: { type: String, required: [true, 'City is required'] },
      state: { type: String, required: [true, 'State is required'] },
    },
    category: {
      type: String,
      enum: ['car', 'commercial'],
      default: 'car',
    },
    kmDriven: {
      type: Number,
      default: 0,
      min: 0,
    },
    license: {
      type: String,
      default: 'Unsplash Stock (Free for Commercial Use)',
    },
    model3dUrl: {
      type: String,
      default: '',
    },
    usePhotoSpin360: {
      type: Boolean,
      default: true,
    },
    taggedImages: [
      {
        url: { type: String, required: true },
        angle: { type: String, default: 'front' },
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    threeSixtyImages: [
      {
        type: String,
      },
    ],
    video: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(VEHICLE_STATUS),
      default: VEHICLE_STATUS.DRAFT,
    },
  },
  {
    timestamps: true,
  }
);

// GeoJSON 2dsphere index for location-based suggestions
vehicleSchema.index({ location: '2dsphere' });
vehicleSchema.index({ brand: 1, model: 1 });
vehicleSchema.index({ price: 1 });
vehicleSchema.index({ status: 1 });

module.exports = mongoose.model('Vehicle', vehicleSchema);
