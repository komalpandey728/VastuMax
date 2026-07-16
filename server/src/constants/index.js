const ROLES = {
  ADMIN: 'admin',
  VENDOR: 'vendor',
  CUSTOMER: 'customer',
  GUEST: 'guest',
};

const VENDOR_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
};

const VEHICLE_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  SOLD: 'sold',
  INACTIVE: 'inactive',
};

const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG'];
const TRANSMISSION_TYPES = ['Manual', 'Automatic', 'AMT', 'CVT', 'DCT'];
const BODY_TYPES = ['Hatchback', 'Sedan', 'SUV', 'MUV', 'Coupe', 'Convertible', 'Pickup', 'Van'];
const VEHICLE_TYPES = ['Car', 'Bike', 'Scooter', 'Commercial', 'Electric'];
const OWNERSHIP_TYPES = ['First Owner', 'Second Owner', 'Third Owner', 'Fourth Owner+'];

module.exports = {
  ROLES,
  VENDOR_STATUS,
  VEHICLE_STATUS,
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  BODY_TYPES,
  VEHICLE_TYPES,
  OWNERSHIP_TYPES,
};
