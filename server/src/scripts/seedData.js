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
      { name: 'Swaraj', logo: 'https://logo.clearbit.com/swarajenterprise.com' },
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
        kmDriven: 12000,
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
          pros: ['Razor-sharp track tracking', 'Immensely powerful twin-turbo', 'Gorgeous aggressive grill design'],
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
        kmDriven: 24000,
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
        kmDriven: 35000,
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
      },
      {
        name: 'Swaraj 744 XT Tractor',
        brand: 'Swaraj',
        model: '744 XT',
        variant: 'XT 50 HP',
        year: 2023,
        price: 740000,
        fuel: 'Diesel',
        transmission: 'Manual',
        engine: '3478 cc',
        power: '50 bhp',
        torque: '200 Nm',
        mileage: 5.5,
        ownership: 'First Owner',
        insurance: 'Third Party Active',
        serviceHistory: 'Services done at authorized dealer',
        registration: 'MH-12-TR-7440',
        kmDriven: 1200,
        description: 'Swaraj 744 XT Tractor in great condition. Powerful engine, excellent fuel efficiency, robust build, and low maintenance. Ideal for agricultural and haulage uses.',
        features: ['Power Steering', 'Multi Speed PTO', 'Dual Clutch', 'OIB Brakes'],
        specifications: {
          payloadCapacity: '3.0 Tons (Towing)',
          gvw: '2.0 Tons',
          bodyType: 'Tractor',
          pros: ['Heavy towing capacity', 'Extremely durable chassis build', 'Very low maintenance costs'],
          cons: ['No passenger cabin space', 'No air conditioning'],
          rating: 4.6,
        },
        location: {
          type: 'Point',
          coordinates: [73.8567, 18.5204],
          city: 'Pune',
          state: 'Maharashtra',
        },
        images: ['/src/assets/images/cv/tractor.png'],
        threeSixtyImages: ['/src/assets/images/cv/tractor.png'],
        featured: false,
        verified: true,
        vendor: vendorUser._id,
        status: VEHICLE_STATUS.ACTIVE,
      },
      {
        name: 'Omega Seiki M1KA 1.0',
        brand: 'Omega Seiki',
        model: 'M1KA 1.0',
        variant: 'M1KA 1.0 Electric',
        year: 2024,
        price: 699000,
        fuel: 'Electric',
        transmission: 'Automatic',
        engine: '15 kWh Electric Motor',
        power: '40 bhp',
        torque: '80 Nm',
        mileage: 120,
        ownership: 'First Owner',
        insurance: 'Comprehensive',
        serviceHistory: 'First service done',
        registration: 'MH-12-OS-1001',
        kmDriven: 8500,
        description: 'Omega Seiki M1KA 1.0 electric compact SCV. Aimed at last-mile urban delivery. Zero emissions, fast-charging option selected, and highly cost-efficient.',
        features: ['Fast Charging', 'Digital Instrument Cluster', 'Regenerative Braking', 'Cabin Heater'],
        specifications: {
          payloadCapacity: '850 kg',
          gvw: '2.2 Tons',
          bodyType: 'Mini Truck',
          pros: ['Extremely low running costs', 'Zero urban emissions', 'Smooth silent electric drive'],
          cons: ['Charging infrastructure dependency', 'Highway speeds are capped'],
          rating: 4.4,
        },
        location: {
          type: 'Point',
          coordinates: [72.8777, 19.076],
          city: 'Mumbai',
          state: 'Maharashtra',
        },
        images: ['/src/assets/images/cv/omega_seiki_m1ka.png'],
        threeSixtyImages: ['/src/assets/images/cv/omega_seiki_m1ka.png'],
        featured: true,
        verified: true,
        vendor: vendorUser._id,
        status: VEHICLE_STATUS.ACTIVE,
      },
      {
        name: 'Mahindra Zor Grand',
        brand: 'Mahindra',
        model: 'Zor Grand',
        variant: 'Zor Grand Delivery Van',
        year: 2023,
        price: 310000,
        fuel: 'Electric',
        transmission: 'Automatic',
        engine: '10.24 kWh Lithium-ion',
        power: '16 bhp',
        torque: '50 Nm',
        mileage: 125,
        ownership: 'First Owner',
        insurance: 'Comprehensive',
        serviceHistory: 'Authorized service history available',
        registration: 'KA-03-ZG-9090',
        kmDriven: 6200,
        description: 'Mahindra Zor Grand Electric 3-wheeler cargo delivery vehicle. Designed for last-mile urban logistics. Features a large closed container box and highly reliable battery.',
        features: ['Lithium-ion Battery Pack', 'Telematics System', 'Fast Charging Support', 'Closed Delivery Van Body'],
        specifications: {
          payloadCapacity: '505 kg',
          gvw: '1.0 Tons',
          bodyType: 'Pickup',
          pros: ['Very compact turning radius', 'Low cargo deck height', 'Quick battery recharging'],
          cons: ['Three-wheeler stability limits speed', 'Limited cabin features'],
          rating: 4.5,
        },
        location: {
          type: 'Point',
          coordinates: [77.5946, 12.9716],
          city: 'Bangalore',
          state: 'Karnataka',
        },
        images: ['/src/assets/images/cv/mahindra_ev_truck.png'],
        threeSixtyImages: ['/src/assets/images/cv/mahindra_ev_truck.png'],
        featured: false,
        verified: true,
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
