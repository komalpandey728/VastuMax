// Browser Database Engine for standalone execution (LocalStorage + IndexedDB)
const DB_NAME = 'VastuIndexedDB';
const DB_VERSION = 1;
const BLOB_STORE = 'files';

// Open IndexedDB connection for files
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(BLOB_STORE)) {
        db.createObjectStore(BLOB_STORE);
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
};

// Store file helper
export const saveFileToDB = async (key, file) => {
  const db = await openDB();
  const base64 = await fileToBase64(file);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BLOB_STORE, 'readwrite');
    const store = tx.objectStore(BLOB_STORE);
    const request = store.put(base64, key);
    request.onsuccess = () => resolve(key);
    request.onerror = () => reject(request.error);
  });
};

// Fetch file helper
export const getFileFromDB = async (key) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BLOB_STORE, 'readonly');
    const store = tx.objectStore(BLOB_STORE);
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result || '');
    request.onerror = () => reject(request.error);
  });
};

// Convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

// Helper for local storage JSON
export const getLocalData = (key, defaultVal = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultVal;
  } catch {
    return defaultVal;
  }
};

export const saveLocalData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving to localStorage', e);
  }
};

// --- DATA SEEDING ---
export const seedBrowserDB = () => {
  const SEED_VERSION_KEY = 'vastu_seeded_v9';
  const PREVIOUS_SEED_KEYS = ['vastu_seeded_v8', 'vastu_seeded_v7', 'vastu_seeded_v6', 'vastu_seeded_v5', 'vastu_seeded_v4', 'vastu_seeded_v3', 'vastu_seeded_v2', 'vastu_seeded_v1'];
  const DATA_KEYS = [
    'vastu_users',
    'vastu_vendor_profiles',
    'vastu_vehicles',
    'vastu_brands',
    'vastu_categories',
    'vastu_cities',
    'vastu_questions',
    'vastu_bookings',
    'vastu_notifications',
    'vastu_compare_ids',
  ];

  // Avoid repeating older seed logic; if the current seed version is present, do nothing.
  if (localStorage.getItem(SEED_VERSION_KEY)) return;

  // If old seed versions exist, clear their generated demo data so the new seed takes effect.
  PREVIOUS_SEED_KEYS.forEach((key) => {
    if (localStorage.getItem(key)) {
      DATA_KEYS.forEach((dataKey) => localStorage.removeItem(dataKey));
      localStorage.removeItem(key);
    }
  });

  console.log('🌱 Seeding browser storage with demo data...');

  // 1. Seed Users
  const users = [
    {
      id: 'usr_admin',
      name: 'Vastu Max Admin Portal',
      email: 'admin@vastumax.com',
      password: 'admin123', // plain text for local mock check
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr_vendor_1',
      name: 'Sherry Motors Owner',
      email: 'vendor@vastumax.com',
      password: 'vendor123',
      role: 'vendor',
      phone: '9876543210',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr_vendor_2',
      name: 'Elite Autos Owner',
      email: 'pending_vendor@vastumax.com',
      password: 'vendor123',
      role: 'vendor',
      phone: '9876543211',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr_vendor_3',
      name: 'Apex Preowned Owner',
      email: 'rejected_vendor@vastumax.com',
      password: 'vendor123',
      role: 'vendor',
      phone: '9876543212',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr_customer_1',
      name: 'Komal Gupta',
      email: 'customer@vastumax.com',
      password: 'customer123',
      role: 'customer',
      phone: '8888888888',
      isActive: true,
      wishlist: [],
      location: { city: 'Pune', state: 'Maharashtra', coordinates: [73.8567, 18.5204] },
      createdAt: new Date().toISOString(),
    },
  ];
  saveLocalData('vastu_users', users);

  // 2. Seed Vendor KYC Profiles
  const vendorProfiles = [
    {
      id: 'vp_1',
      user: 'usr_vendor_1',
      businessName: 'Sherry Motors Dealership',
      gstNumber: '27AAAAA1111A1Z1',
      panNumber: 'ABCDE1234F',
      aadharNumber: '123456789012',
      drivingLicenseNumber: 'MH-14-20150012345',
      address: { street: '102, Premium Auto Plaza, Baner Road', city: 'Pune', state: 'Maharashtra', zipCode: '411045' },
      bankDetails: { accountHolderName: 'Sherry Motors Ltd', accountNumber: '123456789012345', bankName: 'HDFC Bank', ifscCode: 'HDFC0000104' },
      profilePicture: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=300&q=80',
      cancelledChequeImage: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=300&q=80',
      businessProofImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=300&q=80',
      status: 'approved',
      rejectionReason: '',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'vp_2',
      user: 'usr_vendor_2',
      businessName: 'Elite Autos Pune',
      gstNumber: '27BBBBB2222B2Z2',
      panNumber: 'FGHIJ5678K',
      aadharNumber: '987654321098',
      drivingLicenseNumber: 'MH-12-20140098765',
      address: { street: '55, MG Road', city: 'Pune', state: 'Maharashtra', zipCode: '411001' },
      bankDetails: { accountHolderName: 'Elite Autos', accountNumber: '98765432109876', bankName: 'ICICI Bank', ifscCode: 'ICIC0000007' },
      profilePicture: '',
      cancelledChequeImage: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=300&q=80',
      businessProofImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=300&q=80',
      status: 'pending',
      rejectionReason: '',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'vp_3',
      user: 'usr_vendor_3',
      businessName: 'Apex Preowned Vehicles',
      gstNumber: '27CCCCC3333C3Z3',
      panNumber: 'LMNOP9012Q',
      aadharNumber: '111122223333',
      drivingLicenseNumber: 'DL-01-20190011223',
      address: { street: 'Block B, Connaught Place', city: 'Delhi', state: 'Delhi', zipCode: '110001' },
      bankDetails: { accountHolderName: 'Apex Preowned', accountNumber: '22223333444455', bankName: 'SBI Bank', ifscCode: 'SBIN0000001' },
      profilePicture: '',
      cancelledChequeImage: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=300&q=80',
      businessProofImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=300&q=80',
      status: 'rejected',
      rejectionReason: 'The uploaded cancelled cheque copy is blurred and unreadable. Please upload a clear photo.',
      createdAt: new Date().toISOString(),
    },
  ];
  vendorProfiles.forEach((profile) => {
    // If user registration roles match, link them
    const u = users.find((usr) => usr.id === profile.user);
    if (u) u.vendorProfile = profile.id;
  });
  saveLocalData('vastu_vendor_profiles', vendorProfiles);
  saveLocalData('vastu_users', users);

  // 3. Seed Vehicles (35 items, including same-model and normal everyday Indian cars)
  const getCuratedImages = (brand, model, category, index) => {
    const hatchbacks = [
      'https://images.unsplash.com/photo-1619767886558-efdc259cde1a',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888',
      'https://images.unsplash.com/photo-1627454820516-dc767bcb4d3e',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d',
    ];
    const suvs = [
      'https://images.unsplash.com/photo-1669023199464-944ec7833076',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf',
      'https://images.unsplash.com/photo-1617469767053-d3b508a0d84d',
      'https://images.unsplash.com/photo-1563720223185-11003d516935',
      'https://images.unsplash.com/photo-1632245889027-e406faaa19cd',
    ];
    const sedans = [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2',
      'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341',
      'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3',
    ];
    const cvs = [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d',
      'https://images.unsplash.com/photo-1516576880858-12409e6ed100',
      'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e',
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957',
    ];
    const luxury = [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e',
      'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3',
    ];

    let list = suvs;
    const cat = (category || '').toLowerCase();
    const modelLower = (model || '').toLowerCase();

    if (cat === 'commercial' || modelLower.includes('truck') || modelLower.includes('pickup') || modelLower.includes('ace') || modelLower.includes('dost') || modelLower.includes('traveller')) {
      list = cvs;
    } else if (cat === 'hatchback' || modelLower.includes('swift') || modelLower.includes('alto') || modelLower.includes('i20') || modelLower.includes('punch')) {
      list = hatchbacks;
    } else if (cat === 'sedan' || modelLower.includes('city') || modelLower.includes('slavia') || modelLower.includes('model 3')) {
      list = sedans;
    } else if (cat === 'luxury' || cat === 'coupe' || modelLower.includes('m4')) {
      list = luxury;
    }

    return Array.from({ length: 5 }, (_, idx) => {
      const base = list[(index + idx) % list.length];
      return `${base}?w=800&auto=format&fit=crop&q=80&sig=${index}-${idx}`;
    });
  };

  const baseCars = [
    { name: 'Swift VXI', brand: 'Maruti Suzuki', model: 'Swift', variant: 'VXI 1.2L Petrol MT', year: 2022, price: 650000, fuel: 'Petrol', transmission: 'Manual', engine: '1197 cc', power: '89 bhp', torque: '113 Nm', mileage: 22.3, ownership: 'First Owner', bodyType: 'Hatchback', city: 'Pune', coordinates: [73.8567, 18.5204], category: 'car' },
    { name: 'Swift ZXI+', brand: 'Maruti Suzuki', model: 'Swift', variant: 'ZXI+ 1.2L Petrol AMT', year: 2023, price: 780000, fuel: 'Petrol', transmission: 'Automatic', engine: '1197 cc', power: '89 bhp', torque: '113 Nm', mileage: 22.5, ownership: 'First Owner', bodyType: 'Hatchback', city: 'Pune', coordinates: [73.8567, 18.5204], category: 'car' },
    { name: 'Alto LXI', brand: 'Maruti Suzuki', model: 'Alto', variant: 'LXI CNG MT', year: 2021, price: 390000, fuel: 'CNG', transmission: 'Manual', engine: '796 cc', power: '47 bhp', torque: '60 Nm', mileage: 31.5, ownership: 'Second Owner', bodyType: 'Hatchback', city: 'Delhi', coordinates: [77.209, 28.6139], category: 'car' },
    { name: 'Alto VXI', brand: 'Maruti Suzuki', model: 'Alto', variant: 'VXI Petrol MT', year: 2022, price: 440000, fuel: 'Petrol', transmission: 'Manual', engine: '796 cc', power: '47 bhp', torque: '69 Nm', mileage: 22.0, ownership: 'First Owner', bodyType: 'Hatchback', city: 'Delhi', coordinates: [77.209, 28.6139], category: 'car' },
    { name: 'Creta SX', brand: 'Hyundai', model: 'Creta', variant: 'SX 1.5L Diesel MT', year: 2022, price: 1650000, fuel: 'Diesel', transmission: 'Manual', engine: '1493 cc', power: '113 bhp', torque: '250 Nm', mileage: 18.0, ownership: 'First Owner', bodyType: 'SUV', city: 'Mumbai', coordinates: [72.8777, 19.076], category: 'car' },
    { name: 'Creta SX(O)', brand: 'Hyundai', model: 'Creta', variant: 'SX(O) Turbo Petrol DCT', year: 2023, price: 1890000, fuel: 'Petrol', transmission: 'Automatic', engine: '1397 cc', power: '138 bhp', torque: '242 Nm', mileage: 16.8, ownership: 'First Owner', bodyType: 'SUV', city: 'Pune', coordinates: [73.8567, 18.5204], category: 'car' },
    { name: 'i20 Magna', brand: 'Hyundai', model: 'i20', variant: 'Magna 1.2L Petrol MT', year: 2021, price: 680000, fuel: 'Petrol', transmission: 'Manual', engine: '1197 cc', power: '82 bhp', torque: '115 Nm', mileage: 20.3, ownership: 'First Owner', bodyType: 'Hatchback', city: 'Mumbai', coordinates: [72.8777, 19.076], category: 'car' },
    { name: 'i20 Asta', brand: 'Hyundai', model: 'i20', variant: 'Asta 1.2L Petrol IVT', year: 2022, price: 890000, fuel: 'Petrol', transmission: 'Automatic', engine: '1197 cc', power: '82 bhp', torque: '115 Nm', mileage: 19.6, ownership: 'First Owner', bodyType: 'Hatchback', city: 'Mumbai', coordinates: [72.8777, 19.076], category: 'car' },
    { name: 'Thar LX MT', brand: 'Mahindra', model: 'Thar', variant: 'LX 4x4 Diesel MT', year: 2022, price: 1420000, fuel: 'Diesel', transmission: 'Manual', engine: '2184 cc', power: '130 bhp', torque: '300 Nm', mileage: 15.2, ownership: 'First Owner', bodyType: 'SUV', city: 'Delhi', coordinates: [77.209, 28.6139], category: 'car' },
    { name: 'Thar LX AT', brand: 'Mahindra', model: 'Thar', variant: 'LX 4x4 Petrol AT', year: 2023, price: 1580000, fuel: 'Petrol', transmission: 'Automatic', engine: '1997 cc', power: '150 bhp', torque: '320 Nm', mileage: 12.4, ownership: 'First Owner', bodyType: 'SUV', city: 'New Delhi', coordinates: [77.209, 28.6139], category: 'car' },
    { name: 'XUV700 AX5', brand: 'Mahindra', model: 'XUV700', variant: 'AX5 Diesel MT 5Str', year: 2022, price: 1720000, fuel: 'Diesel', transmission: 'Manual', engine: '2198 cc', power: '182 bhp', torque: '420 Nm', mileage: 16.2, ownership: 'First Owner', bodyType: 'SUV', city: 'Mumbai', coordinates: [73.8567, 18.5204], category: 'car' },
    { name: 'XUV700 AX7L', brand: 'Mahindra', model: 'XUV700', variant: 'AX7L Diesel AT 7Str', year: 2023, price: 2280000, fuel: 'Diesel', transmission: 'Automatic', engine: '2198 cc', power: '182 bhp', torque: '450 Nm', mileage: 15.5, ownership: 'First Owner', bodyType: 'SUV', city: 'Mumbai', coordinates: [73.8567, 18.5204], category: 'car' },
    { name: 'Fortuner Standard', brand: 'Toyota', model: 'Fortuner', variant: '2.8L 4x2 Diesel AT', year: 2021, price: 3450000, fuel: 'Diesel', transmission: 'Automatic', engine: '2755 cc', power: '201 bhp', torque: '500 Nm', mileage: 14.4, ownership: 'First Owner', bodyType: 'SUV', city: 'Bengaluru', coordinates: [77.5946, 12.9716], category: 'car' },
    { name: 'Fortuner Legender', brand: 'Toyota', model: 'Fortuner', variant: 'Legender 4x4 Diesel AT', year: 2023, price: 4290000, fuel: 'Diesel', transmission: 'Automatic', engine: '2755 cc', power: '201 bhp', torque: '500 Nm', mileage: 14.2, ownership: 'First Owner', bodyType: 'SUV', city: 'Bengaluru', coordinates: [77.5946, 12.9716], category: 'car' },
    { name: 'Innova Crysta GX', brand: 'Toyota', model: 'Innova Crysta', variant: 'GX 2.4L Diesel MT', year: 2022, price: 1980000, fuel: 'Diesel', transmission: 'Manual', engine: '2393 cc', power: '148 bhp', torque: '343 Nm', mileage: 13.5, ownership: 'First Owner', bodyType: 'MPV', city: 'Mumbai', coordinates: [72.8777, 19.076], category: 'car' },
    { name: 'Innova Crysta ZX', brand: 'Toyota', model: 'Innova Crysta', variant: 'ZX 2.4L Diesel AT', year: 2023, price: 2450000, fuel: 'Diesel', transmission: 'Automatic', engine: '2393 cc', power: '148 bhp', torque: '360 Nm', mileage: 13.0, ownership: 'First Owner', bodyType: 'MPV', city: 'Mumbai', coordinates: [72.8777, 19.076], category: 'car' },
    { name: 'City V', brand: 'Honda', model: 'City', variant: 'V 1.5L Petrol MT', year: 2021, price: 1120000, fuel: 'Petrol', transmission: 'Manual', engine: '1498 cc', power: '119 bhp', torque: '145 Nm', mileage: 17.8, ownership: 'First Owner', bodyType: 'Sedan', city: 'Mumbai', coordinates: [72.8777, 19.076], category: 'car' },
    { name: 'City ZX', brand: 'Honda', model: 'City', variant: 'ZX 1.5L Petrol CVT', year: 2023, price: 1460000, fuel: 'Petrol', transmission: 'Automatic', engine: '1498 cc', power: '119 bhp', torque: '145 Nm', mileage: 18.4, ownership: 'First Owner', bodyType: 'Sedan', city: 'Mumbai', coordinates: [72.8777, 19.076], category: 'car' },
    { name: 'Nexon EV Prime', brand: 'Tata Motors', model: 'Nexon EV', variant: 'Prime XM 30.2kWh', year: 2022, price: 1450000, fuel: 'Electric', transmission: 'Automatic', engine: 'Permanent Magnet Motor', power: '127 bhp', torque: '245 Nm', mileage: 312, ownership: 'First Owner', bodyType: 'SUV', city: 'Mumbai', coordinates: [73.8567, 18.5204], category: 'car' },
    { name: 'Nexon EV Max', brand: 'Tata Motors', model: 'Nexon EV', variant: 'Max XZ+ Lux 40.5kWh', year: 2023, price: 1850000, fuel: 'Electric', transmission: 'Automatic', engine: 'Permanent Magnet Motor', power: '141 bhp', torque: '250 Nm', mileage: 437, ownership: 'First Owner', bodyType: 'SUV', city: 'Mumbai', coordinates: [73.8567, 18.5204], category: 'car' },
    { name: 'Punch Adventure', brand: 'Tata Motors', model: 'Punch', variant: 'Adventure 1.2L Petrol MT', year: 2022, price: 690000, fuel: 'Petrol', transmission: 'Manual', engine: '1199 cc', power: '84 bhp', torque: '113 Nm', mileage: 18.9, ownership: 'First Owner', bodyType: 'SUV', city: 'New Delhi', coordinates: [77.209, 28.6139], category: 'car' },
    { name: 'Punch Creative', brand: 'Tata Motors', model: 'Punch', variant: 'Creative 1.2L Petrol AMT', year: 2023, price: 850000, fuel: 'Petrol', transmission: 'Automatic', engine: '1199 cc', power: '84 bhp', torque: '113 Nm', mileage: 18.8, ownership: 'First Owner', bodyType: 'SUV', city: 'New Delhi', coordinates: [77.209, 28.6139], category: 'car' },
    { name: 'Harrier XT', brand: 'Tata Motors', model: 'Harrier', variant: 'XT 2.0L Diesel MT', year: 2021, price: 1540000, fuel: 'Diesel', transmission: 'Manual', engine: '1956 cc', power: '168 bhp', torque: '350 Nm', mileage: 16.3, ownership: 'Second Owner', bodyType: 'SUV', city: 'Bengaluru', coordinates: [77.5946, 12.9716], category: 'car' },
    { name: 'Harrier XZ+', brand: 'Tata Motors', model: 'Harrier', variant: 'XZ+ 2.0L Diesel AT', year: 2023, price: 2180000, fuel: 'Diesel', transmission: 'Automatic', engine: '1956 cc', power: '168 bhp', torque: '350 Nm', mileage: 14.6, ownership: 'First Owner', bodyType: 'SUV', city: 'Bengaluru', coordinates: [77.5946, 12.9716], category: 'car' },
    { name: 'Seltos HTX', brand: 'Kia', model: 'Seltos', variant: 'HTX 1.5L Petrol MT', year: 2022, price: 1490000, fuel: 'Petrol', transmission: 'Manual', engine: '1497 cc', power: '113 bhp', torque: '144 Nm', mileage: 16.5, ownership: 'First Owner', bodyType: 'SUV', city: 'Bengaluru', coordinates: [77.5946, 12.9716], category: 'car' },
    { name: 'Seltos GTX+', brand: 'Kia', model: 'Seltos', variant: 'GTX+ 1.5L Diesel AT', year: 2023, price: 1980000, fuel: 'Diesel', transmission: 'Automatic', engine: '1493 cc', power: '113 bhp', torque: '250 Nm', mileage: 18.0, ownership: 'First Owner', bodyType: 'SUV', city: 'Bengaluru', coordinates: [77.5946, 12.9716], category: 'car' },
    { name: 'Slavia Active', brand: 'Skoda', model: 'Slavia', variant: 'Active 1.0L TSI MT', year: 2022, price: 1090000, fuel: 'Petrol', transmission: 'Manual', engine: '999 cc', power: '114 bhp', torque: '178 Nm', mileage: 19.4, ownership: 'First Owner', bodyType: 'Sedan', city: 'Mumbai', coordinates: [73.8567, 18.5204], category: 'car' },
    { name: 'Slavia Style', brand: 'Skoda', model: 'Slavia', variant: 'Style 1.5L TSI DSG', year: 2023, price: 1680000, fuel: 'Petrol', transmission: 'Automatic', engine: '1498 cc', power: '148 bhp', torque: '250 Nm', mileage: 18.4, ownership: 'First Owner', bodyType: 'Sedan', city: 'Mumbai', coordinates: [73.8567, 18.5204], category: 'car' },
    { name: 'ZS EV Excite', brand: 'MG', model: 'ZS EV', variant: 'Excite 50.3kWh', year: 2022, price: 2190000, fuel: 'Electric', transmission: 'Automatic', engine: 'Electric Motor', power: '173 bhp', torque: '280 Nm', mileage: 461, ownership: 'First Owner', bodyType: 'SUV', city: 'New Delhi', coordinates: [77.209, 28.6139], category: 'car' },
    { name: 'ZS EV Exclusive', brand: 'MG', model: 'ZS EV', variant: 'Exclusive 50.3kWh', year: 2023, price: 2480000, fuel: 'Electric', transmission: 'Automatic', engine: 'Electric Motor', power: '173 bhp', torque: '280 Nm', mileage: 461, ownership: 'First Owner', bodyType: 'SUV', city: 'New Delhi', coordinates: [77.209, 28.6139], category: 'car' },
    { name: 'BMW M4 Standard', brand: 'BMW', model: 'M4 Coupe', variant: 'Standard 3.0L RWD MT', year: 2022, price: 7490000, fuel: 'Petrol', transmission: 'Manual', engine: '2993 cc', power: '473 bhp', torque: '550 Nm', mileage: 10.4, ownership: 'Second Owner', bodyType: 'Coupe', city: 'New Delhi', coordinates: [77.209, 28.6139], category: 'car' },
    { name: 'BMW M4 Competition', brand: 'BMW', model: 'M4 Coupe', variant: 'xDrive Competition AT', year: 2023, price: 8900000, fuel: 'Petrol', transmission: 'Automatic', engine: '2993 cc', power: '503 bhp', torque: '650 Nm', mileage: 9.8, ownership: 'First Owner', bodyType: 'Coupe', city: 'Mumbai', coordinates: [72.8777, 19.076], category: 'car' },
    { name: 'Tesla Model 3 Long Range', brand: 'Tesla', model: 'Model 3', variant: 'Long Range AWD', year: 2024, price: 4899000, fuel: 'Electric', transmission: 'Automatic', engine: 'Dual Motor AWD', power: '394 bhp', torque: '493 Nm', mileage: 629, ownership: 'First Owner', bodyType: 'Sedan', city: 'Mumbai', coordinates: [73.8567, 18.5204], category: 'car' },
    { name: 'Tesla Model 3 Performance', brand: 'Tesla', model: 'Model 3', variant: 'Performance AWD', year: 2024, price: 5499000, fuel: 'Electric', transmission: 'Automatic', engine: 'Dual Motor Performance', power: '510 bhp', torque: '741 Nm', mileage: 528, ownership: 'First Owner', bodyType: 'Sedan', city: 'Mumbai', coordinates: [73.8567, 18.5204], category: 'car' },
    { name: 'Compass Sport', brand: 'Jeep', model: 'Compass', variant: 'Sport 2.0L Diesel MT', year: 2022, price: 1890000, fuel: 'Diesel', transmission: 'Manual', engine: '1956 cc', power: '170 bhp', torque: '350 Nm', mileage: 17.1, ownership: 'First Owner', bodyType: 'SUV', city: 'Mumbai', coordinates: [73.8567, 18.5204], category: 'car' },
    // Commercial Vehicles (CVs)
    { name: 'Tata Ace Gold', brand: 'Tata Motors', model: 'Ace Gold', variant: 'Diesel Plus Mini Truck', year: 2022, price: 475000, fuel: 'Diesel', transmission: 'Manual', engine: '702 cc', power: '20 bhp', torque: '45 Nm', mileage: 21.0, ownership: 'First Owner', bodyType: 'Mini Truck', city: 'Mumbai', coordinates: [73.8567, 18.5204], category: 'commercial', specifications: { payloadCapacity: '750 kg', gvw: '1.6 Tons', numTyres: '4', bodyType: 'Open Body' } },
    { name: 'Mahindra Bolero Pickup', brand: 'Mahindra', model: 'Bolero Pik-Up', variant: 'CBC 1.7T MS', year: 2023, price: 820000, fuel: 'Diesel', transmission: 'Manual', engine: '2523 cc', power: '75 bhp', torque: '200 Nm', mileage: 14.3, ownership: 'First Owner', bodyType: 'Pickup', city: 'Bengaluru', coordinates: [77.5946, 12.9716], category: 'commercial', specifications: { payloadCapacity: '1.7 Tons', gvw: '3.4 Tons', numTyres: '4', bodyType: 'High Deck' } },
    { name: 'Ashok Leyland Dost+', brand: 'Ashok Leyland', model: 'Dost+', variant: 'LE Diesel', year: 2022, price: 690000, fuel: 'Diesel', transmission: 'Manual', engine: '1478 cc', power: '80 bhp', torque: '190 Nm', mileage: 17.6, ownership: 'First Owner', bodyType: 'Mini Truck', city: 'Mumbai', coordinates: [72.8777, 19.076], category: 'commercial', specifications: { payloadCapacity: '1.5 Tons', gvw: '2.8 Tons', numTyres: '4', bodyType: 'Open Body' } },
    { name: 'Eicher Pro 2049', brand: 'Eicher', model: 'Pro 2049', variant: 'CBC 10ft container', year: 2021, price: 1250000, fuel: 'Diesel', transmission: 'Manual', engine: '2000 cc', power: '100 bhp', torque: '285 Nm', mileage: 11.5, ownership: 'First Owner', bodyType: 'Truck', city: 'New Delhi', coordinates: [77.209, 28.6139], category: 'commercial', specifications: { payloadCapacity: '3.5 Tons', gvw: '4.9 Tons', numTyres: '6', bodyType: 'Closed Container' } },
    { name: 'Force Traveller 3050', brand: 'Force Motors', model: 'Traveller 3050', variant: '12 Seater AC', year: 2022, price: 1480000, fuel: 'Diesel', transmission: 'Manual', engine: '2596 cc', power: '115 bhp', torque: '350 Nm', mileage: 13.0, ownership: 'First Owner', bodyType: 'Bus', city: 'Mumbai', coordinates: [73.8567, 18.5204], category: 'commercial', specifications: { payloadCapacity: '2.5 Tons', gvw: '4.6 Tons', numTyres: '4', bodyType: 'Closed Container' } },
  ];

  const vehicles = baseCars.map((car, idx) => {
    const uniqueImages = getCuratedImages(car.brand, car.model, car.category, idx);

    return {
      _id: `car_${car.brand.toLowerCase().replace(/\s+/g, '_')}_${car.model.toLowerCase().replace(/\s+/g, '_')}_${car.variant.toLowerCase().replace(/\s+/g, '_')}_${car.year}_${idx}`,
      name: `${car.brand} ${car.model}`,
      brand: car.brand,
      model: car.model,
      variant: car.variant,
      year: car.year,
      price: car.price,
      fuel: car.fuel,
      transmission: car.transmission,
      engine: car.engine,
      power: car.power,
      torque: car.torque,
      mileage: car.mileage,
      ownership: car.ownership,
      category: car.category || 'car',
      insurance: 'Comprehensive active',
      serviceHistory: 'Full Dealership History',
      registration: `${car.coordinates[0] > 75 ? 'DL-03' : 'MH-12'}-FE-${Math.floor(1000 + Math.random() * 9000)}`,
      license: 'Unsplash Stock (Free for Commercial Use)',
      description: `Premium certified pre-owned ${car.brand} ${car.model} ${car.variant}. Fully inspected at 140 points by Vastu Max certified workshops. Excellent condition interior, tires at 80% life, original company paint, single-owner driven and comprehensive insurance loaded.`,
      features: ['Power Steering', 'ABS Braking', 'Airbags', 'Air Conditioning'],
      specifications: car.category === 'commercial' ? {
        payloadCapacity: car.specifications.payloadCapacity,
        gvw: car.specifications.gvw,
        numTyres: car.specifications.numTyres,
        bodyType: car.specifications.bodyType || car.bodyType,
        pros: ['Refined silent drive response', 'Excellent load carrying performance', 'Suspension is built very solid'],
        cons: ['Interior cabin utilities are basic', 'Engine noise is audible under heavy loads'],
        rating: 4.5,
      } : {
        bootSpace: car.bodyType === 'SUV' ? '480 L' : car.bodyType === 'Sedan' ? '510 L' : '310 L',
        groundClearance: car.bodyType === 'SUV' ? '200 mm' : '150 mm',
        topSpeed: car.bodyType === 'Coupe' ? '290 km/h' : '180 km/h',
        zeroToHundred: car.bodyType === 'Coupe' ? '3.8 s' : '11.5 s',
        safetyRating: '5 Star Rated',
        warranty: '1 Year Warranty',
        color: 'Premium Metallic',
        bodyType: car.bodyType,
        pros: ['Refined silent drive response', 'Excellent cabin utilities layout', 'Fuel efficiency is very solid'],
        cons: ['Infotainment screen responsiveness can improve', 'Suspension is on the firm side over broken tracks'],
        rating: 4.5,
      },
      location: { 
        city: car.city, 
        state: car.city === 'New Delhi' ? 'Delhi' : car.city === 'Bengaluru' ? 'Karnataka' : 'Maharashtra', 
        coordinates: car.coordinates 
      },
      images: uniqueImages,
      threeSixtyImages: [],
      model3D: '/models/VC.glb',
      featured: car.price > 1200000,
      verified: true,
      vendor: 'usr_vendor_1',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
  });

  saveLocalData('vastu_vehicles', vehicles);

  // 4. Seed metadata tables
  const brands = [
    { _id: 'b1', name: 'Maruti Suzuki', logo: 'https://logo.clearbit.com/marutisuzuki.com' },
    { _id: 'b2', name: 'Hyundai', logo: 'https://logo.clearbit.com/hyundai.com' },
    { _id: 'b3', name: 'Tata Motors', logo: 'https://logo.clearbit.com/tatamotors.com' },
    { _id: 'b4', name: 'Mahindra', logo: 'https://logo.clearbit.com/mahindra.com' },
    { _id: 'b5', name: 'Toyota', logo: 'https://logo.clearbit.com/toyota.com' },
    { _id: 'b6', name: 'Kia', logo: 'https://logo.clearbit.com/kia.com' },
    { _id: 'b7', name: 'BMW', logo: 'https://logo.clearbit.com/bmw.com' },
    { _id: 'b8', name: 'Tesla', logo: 'https://logo.clearbit.com/tesla.com' },
    { _id: 'b9', name: 'Ashok Leyland', logo: 'https://logo.clearbit.com/ashokleyland.com' },
    { _id: 'b10', name: 'Eicher', logo: 'https://logo.clearbit.com/eicher.in' },
    { _id: 'b11', name: 'Force Motors', logo: 'https://logo.clearbit.com/forcemotors.com' },
  ];
  saveLocalData('vastu_brands', brands);

  const categories = [
    { _id: 'c1', name: 'SUV', icon: 'Truck' },
    { _id: 'c2', name: 'Sedan', icon: 'Car' },
    { _id: 'c3', name: 'Hatchback', icon: 'CarFront' },
    { _id: 'c4', name: 'Electric', icon: 'Zap' },
    { _id: 'c5', name: 'Luxury', icon: 'Gem' },
    { _id: 'c6', name: 'Coupe', icon: 'Car' },
  ];
  saveLocalData('vastu_categories', categories);

  const cities = [
    { _id: 'ct1', name: 'Mumbai', state: 'Maharashtra' },
    { _id: 'ct2', name: 'New Delhi', state: 'Delhi' },
    { _id: 'ct3', name: 'Bengaluru', state: 'Karnataka' },
    { _id: 'ct4', name: 'Chennai', state: 'Tamil Nadu' },
    { _id: 'ct5', name: 'Ahmedabad', state: 'Gujarat' },
    { _id: 'ct6', name: 'Lucknow', state: 'Uttar Pradesh' },
    { _id: 'ct7', name: 'Hyderabad', state: 'Telangana' },
    { _id: 'ct8', name: 'Kolkata', state: 'West Bengal' },
    { _id: 'ct9', name: 'Jaipur', state: 'Rajasthan' },
    { _id: 'ct10', name: 'Gurugram', state: 'Haryana' },
    { _id: 'ct11', name: 'Indore', state: 'Madhya Pradesh' },
    { _id: 'ct12', name: 'Ludhiana', state: 'Punjab' },
    { _id: 'ct13', name: 'Vijayawada', state: 'Andhra Pradesh' },
    { _id: 'ct14', name: 'Kochi', state: 'Kerala' },
    { _id: 'ct15', name: 'Patna', state: 'Bihar' },
    { _id: 'ct16', name: 'Bhubaneswar', state: 'Odisha' },
    { _id: 'ct17', name: 'Guwahati', state: 'Assam' },
    { _id: 'ct18', name: 'Ranchi', state: 'Jharkhand' },
    { _id: 'ct19', name: 'Raipur', state: 'Chhattisgarh' },
    { _id: 'ct20', name: 'Dehradun', state: 'Uttarakhand' }
  ];
  saveLocalData('vastu_cities', cities);

  // 5. Seed Inquiries / Questions
  const questions = [
    {
      _id: 'q_1',
      vehicle: 'car_1',
      customer: 'usr_customer_1',
      vendor: 'usr_vendor_1',
      questionText: 'Is the battery health above 95%? Does it have the full self driving beta active?',
      answerText: 'Yes, battery SOH is currently at 98.4%. It has standard Autopilot active, FSD beta can be purchased separately.',
      isApproved: true,
      isAnswered: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'q_2',
      vehicle: 'car_3',
      customer: 'usr_customer_1',
      vendor: 'usr_vendor_1',
      questionText: 'Is the price negotiable? Can I visit the Baner showroom for inspection?',
      answerText: '',
      isApproved: false,
      isAnswered: false,
      createdAt: new Date().toISOString(),
    },
  ];
  saveLocalData('vastu_questions', questions);

  // 6. Seed Bookings
  const bookings = [
    {
      _id: 'bk_1',
      vehicle: 'car_1',
      customer: 'usr_customer_1',
      vendor: 'usr_vendor_1',
      bookingDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days later
      bookingTime: '11:00 AM',
      status: 'pending',
      notes: 'I would like to inspect the panel gaps and do a short highway run to test acceleration.',
      createdAt: new Date().toISOString(),
    },
  ];
  saveLocalData('vastu_bookings', bookings);

  // 7. Seed Notifications
  const notifications = [
    {
      _id: 'nt_1',
      user: 'usr_vendor_1',
      title: 'Dealership KYC Approved 🎉',
      message: 'Congratulations! Your showroom has been validated by Vastu Max admin compliance. You can now list certified pre-owned vehicles.',
      type: 'onboarding',
      isRead: false,
      link: '/vendor/dashboard',
      createdAt: new Date().toISOString(),
    },
  ];
  saveLocalData('vastu_notifications', notifications);

  localStorage.setItem(SEED_VERSION_KEY, 'true');
  PREVIOUS_SEED_KEYS.forEach((key) => localStorage.removeItem(key));
  console.log('✅ Browser database seeded successfully.');
};

