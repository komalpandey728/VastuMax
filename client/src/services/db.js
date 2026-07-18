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
  const SEED_VERSION_KEY = 'vastu_seeded_v17';
  const PREVIOUS_SEED_KEYS = ['vastu_seeded_v16', 'vastu_seeded_v15', 'vastu_seeded_v14', 'vastu_seeded_v13', 'vastu_seeded_v12', 'vastu_seeded_v11', 'vastu_seeded_v10', 'vastu_seeded_v9', 'vastu_seeded_v8', 'vastu_seeded_v7', 'vastu_seeded_v6', 'vastu_seeded_v5', 'vastu_seeded_v4', 'vastu_seeded_v3', 'vastu_seeded_v2', 'vastu_seeded_v1'];
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
  const getCuratedImages = (brand, model, category, index, variant = '') => {
    const variantLower = (variant || '').toLowerCase();
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

    const baseImages = Array.from({ length: 5 }, (_, idx) => {
      const base = list[(index + idx) % list.length];
      return `${base}?w=800&auto=format&fit=crop&q=80&sig=${index}-${idx}`;
    });

    if ((category || '').toLowerCase() === 'commercial') {
      const brandLower = brand.toLowerCase();
      if (modelLower.includes('tractor') || brandLower.includes('swaraj')) {
        baseImages[0] = '/src/assets/images/cv/tractor.png';
      } else if (brandLower.includes('omega') || modelLower.includes('m1ka')) {
        baseImages[0] = '/src/assets/images/cv/omega_seiki_m1ka.png';
      } else if (brandLower === 'mahindra' && variantLower.includes('delivery')) {
        baseImages[0] = '/src/assets/images/cv/mahindra_ev_truck.png';
      } else if (brandLower === 'tata motors' || modelLower.includes('ace')) {
        baseImages[0] = '/src/assets/images/cv/tata_ace_gold.png';
      } else if (brandLower === 'mahindra' || modelLower.includes('bolero')) {
        baseImages[0] = '/src/assets/images/cv/mahindra_bolero.png';
      } else if (brandLower === 'ashok leyland' || modelLower.includes('dost')) {
        baseImages[0] = '/src/assets/images/cv/ashok_leyland_dost.png';
      } else if (brandLower === 'eicher' || modelLower.includes('pro')) {
        baseImages[0] = '/src/assets/images/cv/eicher_pro.png';
      } else if (brandLower === 'force motors' || modelLower.includes('traveller')) {
        baseImages[0] = '/src/assets/images/cv/force_traveller.png';
      }
      return baseImages;
    }


    if (brand === 'Toyota' && modelLower === 'fortuner') {
      if (variantLower.includes('legender')) {
        baseImages[0] = '/src/assets/images/cars/toyota_fortuner_legender.png';
      } else {
        baseImages[0] = '/src/assets/images/cars/toyota_fortuner_standard.png';
      }
    } else if (brand === 'Toyota' && modelLower === 'innova crysta') {
      if (variantLower.includes('gx')) {
        baseImages[0] = '/src/assets/images/cars/toyota_innova_crysta_gx.png';
      } else if (variantLower.includes('zx')) {
        baseImages[0] = '/src/assets/images/cars/toyota_innova_crysta_zx.png';
      }
    } else if (brand === 'Honda' && modelLower === 'city') {
      if (variantLower.includes('v 1.5l')) {
        baseImages[0] = '/src/assets/images/cars/honda_city_v.png';
      }
    } else if (brand === 'Jeep' && modelLower === 'compass') {
      if (variantLower.includes('sport')) {
        baseImages[0] = '/src/assets/images/cars/jeep_compass_sport.png';
      }
    } else if (brand === 'Maruti Suzuki' && modelLower === 'swift') {
      baseImages[0] = '/src/assets/images/cars/maruti_swift.png';
    } else if (brand === 'Hyundai' && modelLower === 'creta') {
      if (variantLower.includes('sx(o)')) {
        baseImages[0] = '/src/assets/images/cars/hyundai_creta_sxo.png';
      } else {
        baseImages[0] = '/src/assets/images/cars/hyundai_creta_sx.png';
      }
    } else if (brand === 'Hyundai' && modelLower === 'i20') {
      if (variantLower.includes('asta')) {
        baseImages[0] = '/src/assets/images/cars/hyundai_i20_asta.png';
      } else if (variantLower.includes('magna')) {
        baseImages[0] = '/src/assets/images/cars/hyundai_i20_magna.png';
      }
    } else if (brand === 'Mahindra' && modelLower === 'thar') {
      if (variantLower.includes('mt')) {
        baseImages[0] = '/src/assets/images/cars/mahindra_thar_mt.png';
      } else {
        baseImages[0] = '/src/assets/images/cars/mahindra_thar_at.png';
      }
    }

    return baseImages;
  };

  const baseCars = [
    { name: 'Swift ZXI+', brand: 'Maruti Suzuki', model: 'Swift', variant: 'ZXI+ 1.2L Petrol AMT', year: 2023, price: 780000, fuel: 'Petrol (E-20)', transmission: 'Automatic', engine: '1197 cc', power: '89 bhp', torque: '113 Nm', mileage: 22.5, ownership: 'First Owner', kmDriven: 18000, bodyType: 'Hatchback', city: 'Pune', coordinates: [73.8567, 18.5204], category: 'car' },
    { name: 'Creta SX', brand: 'Hyundai', model: 'Creta', variant: 'SX 1.5L Diesel MT', year: 2022, price: 1650000, fuel: 'Diesel', transmission: 'Manual', engine: '1493 cc', power: '113 bhp', torque: '250 Nm', mileage: 18.0, ownership: 'First Owner', kmDriven: 24000, bodyType: 'SUV', city: 'Mumbai', coordinates: [72.8777, 19.076], category: 'car' },
    { name: 'Creta SX(O)', brand: 'Hyundai', model: 'Creta', variant: 'SX(O) Turbo Petrol DCT', year: 2023, price: 1890000, fuel: 'Petrol (E-20)', transmission: 'Automatic', engine: '1397 cc', power: '138 bhp', torque: '242 Nm', mileage: 16.8, ownership: 'First Owner', kmDriven: 12000, bodyType: 'SUV', city: 'Pune', coordinates: [73.8567, 18.5204], category: 'car' },
    { name: 'i20 Magna', brand: 'Hyundai', model: 'i20', variant: 'Magna 1.2L Petrol MT', year: 2021, price: 680000, fuel: 'Petrol', transmission: 'Manual', engine: '1197 cc', power: '82 bhp', torque: '115 Nm', mileage: 20.3, ownership: 'First Owner', kmDriven: 32000, bodyType: 'Hatchback', city: 'Mumbai', coordinates: [72.8777, 19.076], category: 'car' },
    { name: 'i20 Asta', brand: 'Hyundai', model: 'i20', variant: 'Asta 1.2L Petrol IVT', year: 2022, price: 890000, fuel: 'Petrol', transmission: 'Automatic', engine: '1197 cc', power: '82 bhp', torque: '115 Nm', mileage: 19.6, ownership: 'First Owner', kmDriven: 15000, bodyType: 'Hatchback', city: 'Mumbai', coordinates: [72.8777, 19.076], category: 'car' },
    { name: 'Thar LX MT', brand: 'Mahindra', model: 'Thar', variant: 'LX 4x4 Diesel MT', year: 2022, price: 1420000, fuel: 'Diesel', transmission: 'Manual', engine: '2184 cc', power: '130 bhp', torque: '300 Nm', mileage: 15.2, ownership: 'First Owner', kmDriven: 28000, bodyType: 'SUV', city: 'Delhi', coordinates: [77.209, 28.6139], category: 'car' },
    { name: 'Thar LX AT', brand: 'Mahindra', model: 'Thar', variant: 'LX 4x4 Petrol AT', year: 2023, price: 1580000, fuel: 'Petrol', transmission: 'Automatic', engine: '1997 cc', power: '150 bhp', torque: '320 Nm', mileage: 12.4, ownership: 'First Owner', kmDriven: 9000, bodyType: 'SUV', city: 'New Delhi', coordinates: [77.209, 28.6139], category: 'car' },
    { name: 'Fortuner Standard', brand: 'Toyota', model: 'Fortuner', variant: '2.8L 4x2 Diesel AT', year: 2021, price: 3450000, fuel: 'Diesel', transmission: 'Automatic', engine: '2755 cc', power: '201 bhp', torque: '500 Nm', mileage: 14.4, ownership: 'First Owner', kmDriven: 52000, bodyType: 'SUV', city: 'Bengaluru', coordinates: [77.5946, 12.9716], category: 'car' },
    { name: 'Fortuner Legender', brand: 'Toyota', model: 'Fortuner', variant: 'Legender 4x4 Diesel AT', year: 2023, price: 4290000, fuel: 'Diesel', transmission: 'Automatic', engine: '2755 cc', power: '201 bhp', torque: '500 Nm', mileage: 14.2, ownership: 'First Owner', kmDriven: 16000, bodyType: 'SUV', city: 'Bengaluru', coordinates: [77.5946, 12.9716], category: 'car' },
    // Commercial Vehicles (CVs)
    { name: 'Tata Ace Gold', brand: 'Tata Motors', model: 'Ace Gold', variant: 'Diesel Plus Mini Truck', year: 2022, price: 475000, fuel: 'Diesel', transmission: 'Manual', engine: '702 cc', power: '20 bhp', torque: '45 Nm', mileage: 21.0, ownership: 'First Owner', kmDriven: 41000, bodyType: 'Mini Truck', city: 'Mumbai', coordinates: [73.8567, 18.5204], category: 'commercial', specifications: { payloadCapacity: '750 kg', gvw: '1.6 Tons', bodyType: 'Open Body' } },
    { name: 'Mahindra Bolero Pickup', brand: 'Mahindra', model: 'Bolero Pik-Up', variant: 'CBC 1.7T MS', year: 2023, price: 490000, fuel: 'Diesel', transmission: 'Manual', engine: '2523 cc', power: '75 bhp', torque: '200 Nm', mileage: 14.3, ownership: 'First Owner', kmDriven: 29000, bodyType: 'Pickup', city: 'Bengaluru', coordinates: [77.5946, 12.9716], category: 'commercial', specifications: { payloadCapacity: '1.7 Tons', gvw: '3.4 Tons', bodyType: 'High Deck' } },
    { name: 'Ashok Leyland Dost+', brand: 'Ashok Leyland', model: 'Dost+', variant: 'LE Diesel', year: 2022, price: 380000, fuel: 'Diesel', transmission: 'Manual', engine: '1478 cc', power: '80 bhp', torque: '190 Nm', mileage: 17.6, ownership: 'First Owner', kmDriven: 36000, bodyType: 'Mini Truck', city: 'Mumbai', coordinates: [72.8777, 19.076], category: 'commercial', specifications: { payloadCapacity: '1.5 Tons', gvw: '2.8 Tons', bodyType: 'Open Body' } },
    { name: 'Eicher Pro 2049', brand: 'Eicher', model: 'Pro 2049', variant: 'CBC 10ft container', year: 2021, price: 1450000, fuel: 'Diesel', transmission: 'Manual', engine: '2000 cc', power: '100 bhp', torque: '285 Nm', mileage: 11.5, ownership: 'First Owner', kmDriven: 65000, bodyType: 'Truck', city: 'New Delhi', coordinates: [77.209, 28.6139], category: 'commercial', specifications: { payloadCapacity: '3.5 Tons', gvw: '4.9 Tons', bodyType: 'Closed Container' } },
    { name: 'Force Traveller 3050', brand: 'Force Motors', model: 'Traveller 3050', variant: '12 Seater AC', year: 2022, price: 1020000, fuel: 'Diesel', transmission: 'Manual', engine: '2596 cc', power: '115 bhp', torque: '350 Nm', mileage: 13.0, ownership: 'First Owner', kmDriven: 54000, bodyType: 'Bus', city: 'Mumbai', coordinates: [73.8567, 18.5204], category: 'commercial', specifications: { payloadCapacity: '2.5 Tons', gvw: '4.6 Tons', bodyType: 'Closed Container' } },
    { name: 'Swaraj 744 XT', brand: 'Swaraj', model: '744 XT', variant: 'XT 50 HP', year: 2023, price: 740000, fuel: 'Diesel', transmission: 'Manual', engine: '3478 cc', power: '50 bhp', torque: '200 Nm', mileage: 5.5, ownership: 'First Owner', kmDriven: 1200, bodyType: 'Tractor', city: 'Pune', coordinates: [73.8567, 18.5204], category: 'commercial', specifications: { payloadCapacity: '3.0 Tons (Towing)', gvw: '2.0 Tons', bodyType: 'Tractor' } },
    { name: 'Omega Seiki M1KA 1.0', brand: 'Omega Seiki', model: 'M1KA 1.0', variant: 'M1KA 1.0 Electric', year: 2024, price: 1699000, fuel: 'Electric', transmission: 'Automatic', engine: '15 kWh Electric Motor', power: '40 bhp', torque: '80 Nm', mileage: 120, ownership: 'First Owner', kmDriven: 8500, bodyType: 'Mini Truck', city: 'Mumbai', coordinates: [72.8777, 19.076], category: 'commercial', specifications: { payloadCapacity: '850 kg', gvw: '2.2 Tons', bodyType: 'Mini Truck' } },
    { name: 'Mahindra Zor Grand', brand: 'Mahindra', model: 'Zor Grand', variant: 'Zor Grand Delivery Van', year: 2023, price: 610000, fuel: 'Electric', transmission: 'Automatic', engine: '10.24 kWh Lithium-ion', power: '16 bhp', torque: '50 Nm', mileage: 125, ownership: 'First Owner', kmDriven: 6200, bodyType: 'Pickup', city: 'Bengaluru', coordinates: [77.5946, 12.9716], category: 'commercial', specifications: { payloadCapacity: '505 kg', gvw: '1.0 Tons', bodyType: 'Pickup' } },
  ];

  const vehicles = baseCars.map((car, idx) => {
    const uniqueImages = getCuratedImages(car.brand, car.model, car.category, idx, car.variant);

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
      kmDriven: car.kmDriven || 0,
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
    { _id: 'b1', name: 'Maruti Suzuki', logo: 'https://cdn.simpleicons.org/suzuki' },
    { _id: 'b2', name: 'Hyundai', logo: 'https://cdn.simpleicons.org/hyundai' },
    { _id: 'b3', name: 'Tata Motors', logo: 'https://cdn.simpleicons.org/tata' },
    { _id: 'b4', name: 'Mahindra', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Mahindra_Rise_Logo.svg' },
    { _id: 'b5', name: 'Toyota', logo: 'https://cdn.simpleicons.org/toyota' },
    { _id: 'b6', name: 'Kia', logo: 'https://cdn.simpleicons.org/kia' },
    { _id: 'b7', name: 'Honda', logo: 'https://cdn.simpleicons.org/honda' },
    { _id: 'b9', name: 'Ashok Leyland', logo: 'https://upload.wikimedia.org/wikipedia/en/8/8d/Ashok_Leyland_logo.svg' },
    { _id: 'b10', name: 'Eicher', logo: 'https://upload.wikimedia.org/wikipedia/en/0/03/Eicher_Motors_logo.svg' },
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

