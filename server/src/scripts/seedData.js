const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config');
const User = require('../models/User');
const VendorProfile = require('../models/VendorProfile');
const Vehicle = require('../models/Vehicle');
const Brand = require('../models/Brand');
const Category = require('../models/Category');
const City = require('../models/City');
const { ROLES, VENDOR_STATUS, VEHICLE_STATUS } = require('../constants');

const seedAll = async () => {
  if (!config.mongoUri) {
    console.error('❌ MONGODB_URI is not configured in .env. Seeding aborted.');
    process.exit(1);
  }

  try {
    console.log('🔄 Connecting to database for seeding...');
    await mongoose.connect(config.mongoUri);
    console.log('✅ Database connected.');

    // Clear existing data (optional but good for a fresh start)
    console.log('🧹 Clearing old listings & users...');
    await Promise.all([
      User.deleteMany({}),
      VendorProfile.deleteMany({}),
      Vehicle.deleteMany({}),
      Brand.deleteMany({}),
      Category.deleteMany({}),
      City.deleteMany({}),
    ]);

    console.log('🌱 Seeding Brands, Categories, and Cities...');
    const brands = await Brand.insertMany([
      { name: 'Tesla', logo: 'https://logo.clearbit.com/tesla.com' },
      { name: 'BMW', logo: 'https://logo.clearbit.com/bmw.com' },
      { name: 'Mercedes-Benz', logo: 'https://logo.clearbit.com/mercedes-benz.com' },
      { name: 'Tata Motors', logo: 'https://logo.clearbit.com/tatamotors.com' },
      { name: 'Hyundai', logo: 'https://logo.clearbit.com/hyundai.com' },
      { name: 'Mahindra', logo: 'https://logo.clearbit.com/mahindra.com' },
      { name: 'Toyota', logo: 'https://logo.clearbit.com/toyota.com' },
      { name: 'Audi', logo: 'https://logo.clearbit.com/audi.com' },
    ]);

    const categories = await Category.insertMany([
      { name: 'SUV', icon: 'Truck' },
      { name: 'Sedan', icon: 'Car' },
      { name: 'Hatchback', icon: 'CarFront' },
      { name: 'Electric', icon: 'Zap' },
      { name: 'Luxury', icon: 'Gem' },
    ]);

    const cities = await City.insertMany([
      { name: 'Mumbai', state: 'Maharashtra' },
      { name: 'Bangalore', state: 'Karnataka' },
      { name: 'Delhi', state: 'Delhi' },
      { name: 'Pune', state: 'Maharashtra' },
      { name: 'Chennai', state: 'Tamil Nadu' },
    ]);

    console.log('🌱 Creating default users...');
    
    // Admin User
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      name: 'Vastu Max Admin',
      email: 'admin@vastumax.com',
      password: adminPassword,
      phone: '9999999999',
      role: ROLES.ADMIN,
      isActive: true,
      isEmailVerified: true,
    });

    // Approved Vendor
    const vendorPassword = await bcrypt.hash('vendor123', 12);
    const vendorUser = await User.create({
      name: 'Sherry Motors',
      email: 'vendor@vastumax.com',
      password: vendorPassword,
      phone: '9876543210',
      role: ROLES.VENDOR,
      isActive: true,
      isEmailVerified: true,
    });

    // Create and approve Vendor KYC Profile
    const vendorProfile = await VendorProfile.create({
      user: vendorUser._id,
      businessName: 'Sherry Motors Dealership',
      gstNumber: '27AAAAA1111A1Z1',
      panNumber: 'ABCDE1234F',
      aadharNumber: '123456789012',
      drivingLicenseNumber: 'MH-14-20150012345',
      address: {
        street: '102, Premium Auto Plaza, Baner Road',
        city: 'Pune',
        state: 'Maharashtra',
        zipCode: '411045',
      },
      bankDetails: {
        accountHolderName: 'Sherry Motors Ltd',
        accountNumber: '123456789012345',
        bankName: 'HDFC Bank',
        ifscCode: 'HDFC0000104',
      },
      profilePicture: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=300&q=80',
      cancelledChequeImage: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=500&q=80',
      businessProofImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=500&q=80',
      status: VENDOR_STATUS.APPROVED,
    });

    // Customer User
    const customerPassword = await bcrypt.hash('customer123', 12);
    const customerUser = await User.create({
      name: 'Komal Gupta',
      email: 'customer@vastumax.com',
      password: customerPassword,
      phone: '8888888888',
      role: ROLES.CUSTOMER,
      isActive: true,
      isEmailVerified: true,
    });

    console.log('🌱 Seeding vehicle inventory...');

    const vehicleData = [
      {
        name: 'Tesla Model S Plaid',
        brand: 'Tesla',
        model: 'Model S',
        variant: 'Plaid Tri-Motor',
        year: 2024,
        price: 119999,
        fuel: 'Electric',
        transmission: 'Automatic',
        engine: 'Tri-Motor Electric Drive',
        power: '1020 bhp',
        torque: '1420 Nm',
        mileage: 620, // range in km
        ownership: 'First Owner',
        insurance: 'Comprehensive',
        serviceHistory: 'Full Service History',
        registration: 'MH-12-TS-1020',
        description: 'The Tesla Model S Plaid is the quickest accelerating car in production today. With 1020 HP and a tri-motor setup, it handles like a supercar while maintaining family-sized comfort. Features autopilot, carbon deck spoiler, and yoke steering wheel.',
        features: ['Autopilot', 'Panoramic Glass Roof', 'Ventilated Yoke Seats', '17-inch Cinematic Screen', 'Subwoofer Premium Audio', 'Air Suspension'],
        specifications: {
          bootSpace: '793 L',
          groundClearance: '126 mm',
          topSpeed: '322 km/h',
          zeroToHundred: '2.1 s',
          safetyRating: '5 Star NHTSA',
          warranty: '8 Years Battery & Drive Unit',
          color: 'Solid Black',
          bodyType: 'Sedan',
          pros: ['Instant sub-3s acceleration', 'Exceptional battery range', 'Cutting edge software'],
          cons: ['Minimal physical buttons', 'Steering yoke requires getting used to'],
          rating: 4.8,
        },
        location: {
          type: 'Point',
          coordinates: [73.8567, 18.5204], // Pune coordinates [lng, lat]
          city: 'Pune',
          state: 'Maharashtra',
        },
        images: [
          'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=800&q=80'
        ],
        threeSixtyImages: [
          'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80'
        ],
        video: 'https://www.w3schools.com/html/mov_bbb.mp4',
        featured: true,
        verified: true,
        vendor: vendorUser._id,
        status: VEHICLE_STATUS.ACTIVE,
      },
      {
        name: 'BMW M4 Competition',
        brand: 'BMW',
        model: 'M4 Coupe',
        variant: 'xDrive Competition',
        year: 2023,
        price: 89000,
        fuel: 'Petrol',
        transmission: 'Automatic',
        engine: '3.0L Twin-Turbo Inline-6',
        power: '503 bhp',
        torque: '650 Nm',
        mileage: 9.8, // kmpl
        ownership: 'First Owner',
        insurance: 'Comprehensive',
        serviceHistory: 'Full Authorized Dealer Records',
        registration: 'MH-14-BMW-44',
        description: 'Immaculate BMW M4 Competition in Isle of Man Green. This high-performance coupe features xDrive all-wheel drive, full carbon interior packaging, and M-Sport adaptive damper suspension. Pristine condition with zero scratch marks.',
        features: ['M Carbon Ceramic Brakes', 'Harman Kardon Audio', 'Heated Carbon Seats', 'Laser Headlights', 'M Drift Analyzer', 'Head-Up Display'],
        specifications: {
          bootSpace: '440 L',
          groundClearance: '120 mm',
          topSpeed: '290 km/h',
          zeroToHundred: '3.5 s',
          safetyRating: '5 Star Euro NCAP',
          warranty: '3 Years Comprehensive',
          color: 'Isle of Man Green',
          bodyType: 'Coupe',
          pros: ['Razor-sharp track handling', 'Immensely powerful twin-turbo', 'Gorgeous aggressive grill design'],
          cons: ['Firm ride quality over potholes', 'Rear seat space is limited'],
          rating: 4.7,
        },
        location: {
          type: 'Point',
          coordinates: [72.8777, 19.076], // Mumbai coordinates
          city: 'Mumbai',
          state: 'Maharashtra',
        },
        images: [
          'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=800&q=80'
        ],
        threeSixtyImages: [
          'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=800&q=80'
        ],
        featured: true,
        verified: true,
        vendor: vendorUser._id,
        status: VEHICLE_STATUS.ACTIVE,
      },
      {
        name: 'Tata Nexon EV Max',
        brand: 'Tata Motors',
        model: 'Nexon EV',
        variant: 'Max XZ+ Lux',
        year: 2023,
        price: 21500,
        fuel: 'Electric',
        transmission: 'Automatic',
        engine: 'Permanent Magnet AC Motor',
        power: '141 bhp',
        torque: '250 Nm',
        mileage: 437, // range in km
        ownership: 'First Owner',
        insurance: 'Comprehensive',
        serviceHistory: 'Full Service Records',
        registration: 'KA-03-EV-4321',
        description: 'Best-selling family SUV in India. Nexon EV Max features a 40.5 kWh battery offering 437 km certified range, wireless charging, ventilated seats, and auto-dimming IRVM. Excellent city crawler.',
        features: ['Wireless Charging', 'Ventilated Front Seats', 'Harman Infotainment Screen', 'Cruise Control', 'Jewelled Drive Dial', 'Air Purifier'],
        specifications: {
          bootSpace: '350 L',
          groundClearance: '190 mm',
          topSpeed: '140 km/h',
          zeroToHundred: '9.0 s',
          safetyRating: '5 Star GNCAP',
          warranty: '8 Years Battery Warranty',
          color: 'Intense Teal',
          bodyType: 'SUV',
          pros: ['High ground clearance', 'Spacious cabin layout', 'Value for money EV tech'],
          cons: ['Infotainment interface feels dated', 'Charging speed capped at 50 kW'],
          rating: 4.5,
        },
        location: {
          type: 'Point',
          coordinates: [77.5946, 12.9716], // Bangalore coordinates
          city: 'Bangalore',
          state: 'Karnataka',
        },
        images: [
          'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80'
        ],
        threeSixtyImages: [
          'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80'
        ],
        featured: false,
        verified: true,
        vendor: vendorUser._id,
        status: VEHICLE_STATUS.ACTIVE,
      },
      {
        name: 'Mahindra XUV700 AX7 L',
        brand: 'Mahindra',
        model: 'XUV700',
        variant: 'AX7 Luxury Pack AWD',
        year: 2022,
        price: 32000,
        fuel: 'Diesel',
        transmission: 'Automatic',
        engine: '2.2L mHawk Turbo Diesel',
        power: '182 bhp',
        torque: '450 Nm',
        mileage: 14.2, // kmpl
        ownership: 'Second Owner',
        insurance: 'Comprehensive active till 2027',
        serviceHistory: 'Services done at Mahindra workshop',
        registration: 'DL-03-CD-8910',
        description: 'Mahindra XUV700 AX7 L Diesel AWD is the ultimate luxury SUV. Features a dual HD screen cockpit, level 2 ADAS safety, smart door handles, and a massive panoramic skyroof. Perfect tourer.',
        features: ['Level 2 ADAS Safety', '10.25-inch Dual Screen Panel', 'Sony 12-Speaker Sound', 'AWD System', 'Smart Door Handles', 'Panoramic Skyroof'],
        specifications: {
          bootSpace: '220 L (with 3rd row up)',
          groundClearance: '200 mm',
          topSpeed: '190 km/h',
          zeroToHundred: '9.5 s',
          safetyRating: '5 Star GNCAP',
          warranty: 'Remaining 2 Years Factory Warranty',
          color: 'Midnight Black',
          bodyType: 'SUV',
          pros: ['Very smooth AWD system', 'Extremely comfortable ADAS systems', 'Punchy mHawk engine'],
          cons: ['Third row seating is congested for adults', 'Heavy body roll at high curves'],
          rating: 4.6,
        },
        location: {
          type: 'Point',
          coordinates: [77.209, 28.6139], // Delhi coordinates
          city: 'Delhi',
          state: 'Delhi',
        },
        images: [
          'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
        ],
        threeSixtyImages: [
          'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
        ],
        featured: false,
        verified: false,
        vendor: vendorUser._id,
        status: VEHICLE_STATUS.ACTIVE,
      }
    ];

    await Vehicle.insertMany(vehicleData);

    console.log('✅ Seeding completed successfully!');
    console.log(`🔑 Admin Credentials: email: "admin@vastu max.com", password: "admin123"`);
    console.log(`🔑 Dealer/Vendor Credentials: email: "vendor@vastu max.com", password: "vendor123"`);
    console.log(`🔑 Customer Credentials: email: "customer@vastu max.com", password: "customer123"`);

    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedAll();
