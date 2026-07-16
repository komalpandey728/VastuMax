import api from './api';
import { USE_LOCAL_STORAGE } from './config';
import { getLocalData, saveLocalData, saveFileToDB, getFileFromDB } from './db';

// Haversine formula to compute distance in km between two lat/lng coordinates
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const createVehicle = async (formData) => {
  if (USE_LOCAL_STORAGE) {
    const token = localStorage.getItem('vastu_token');
    const userId = token?.replace('mock_jwt_token_', '');
    if (!userId) throw new Error('Not authorized');

    // 1. Verify vendor approved
    const users = getLocalData('vastu_users');
    const currentUser = users.find((u) => u.id === userId);
    if (currentUser?.role === 'vendor') {
      const profiles = getLocalData('vastu_vendor_profiles');
      const profile = profiles.find((p) => p.user === userId);
      if (!profile || profile.status !== 'approved') {
        throw new Error('Your dealership KYC must be Approved before you can list cars.');
      }
    }

    const name = formData.get('name');
    const brand = formData.get('brand');
    const model = formData.get('model');
    const variant = formData.get('variant');
    const year = parseInt(formData.get('year'), 10);
    const price = parseFloat(formData.get('price'));
    const fuel = formData.get('fuel');
    const transmission = formData.get('transmission');
    const engine = formData.get('engine');
    const power = formData.get('power');
    const torque = formData.get('torque');
    const mileage = parseFloat(formData.get('mileage'));
    const ownership = formData.get('ownership');
    const insurance = formData.get('insurance');
    const serviceHistory = formData.get('serviceHistory');
    const registration = formData.get('registration');
    const description = formData.get('description');
    const city = formData.get('city');
    const state = formData.get('state');
    const lat = parseFloat(formData.get('latitude')) || 0;
    const lng = parseFloat(formData.get('longitude')) || 0;
    const status = formData.get('status') || 'active';
    const category = formData.get('category') || 'car';

    // Parse features & specs
    const features = JSON.parse(formData.get('features') || '[]');
    const specifications = JSON.parse(formData.get('specifications') || '{}');

    // Save media to IndexedDB
    const imageFiles = formData.getAll('images');
    const images = [];
    for (let i = 0; i < imageFiles.length; i++) {
      if (imageFiles[i] instanceof File) {
        const key = `file_car_img_${Date.now()}_${i}`;
        await saveFileToDB(key, imageFiles[i]);
        const url = await getFileFromDB(key);
        images.push(url);
      }
    }

    const threeSixtyFiles = formData.getAll('threeSixtyImages');
    const threeSixtyImages = [];
    for (let i = 0; i < threeSixtyFiles.length; i++) {
      if (threeSixtyFiles[i] instanceof File) {
        const key = `file_car_360_${Date.now()}_${i}`;
        await saveFileToDB(key, threeSixtyFiles[i]);
        const url = await getFileFromDB(key);
        threeSixtyImages.push(url);
      }
    }

    const videoFile = formData.get('video');
    let video = '';
    if (videoFile instanceof File && videoFile.size > 0) {
      const key = `file_car_video_${Date.now()}`;
      await saveFileToDB(key, videoFile);
      video = await getFileFromDB(key);
    }

    const vehicles = getLocalData('vastu_vehicles');
    const newCar = {
      _id: `car_${Date.now()}`,
      name,
      brand,
      model,
      variant,
      year,
      price,
      fuel,
      transmission,
      engine,
      power,
      torque,
      mileage,
      ownership,
      insurance,
      serviceHistory,
      registration,
      description,
      features,
      specifications,
      location: { city, state, coordinates: [lng, lat] },
      images,
      threeSixtyImages: [],
      video,
      category,
      featured: false,
      verified: false,
      vendor: userId,
      status,
      createdAt: new Date().toISOString(),
    };

    vehicles.push(newCar);
    saveLocalData('vastu_vehicles', vehicles);
    return { success: true, vehicle: newCar };
  }

  const { data } = await api.post('/vehicles', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const getVehicles = async (filters = {}) => {
  if (USE_LOCAL_STORAGE) {
    let list = getLocalData('vastu_vehicles');

    // Filter by Active status
    list = list.filter((v) => v.status === 'active');

    // Text search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      let matched = list.filter(
        (v) =>
          v.name.toLowerCase().startsWith(q) ||
          v.brand.toLowerCase().startsWith(q) ||
          v.model.toLowerCase().startsWith(q)
      );
      if (matched.length === 0) {
        const regex = new RegExp(filters.search, 'i');
        matched = list.filter(
          (v) =>
            regex.test(v.name) ||
            regex.test(v.brand) ||
            regex.test(v.model) ||
            regex.test(v.description)
        );
      }
      list = matched;
    }

    // Exact matches
    if (filters.brand) list = list.filter((v) => v.brand === filters.brand);
    if (filters.model) list = list.filter((v) => v.model === filters.model);
    if (filters.fuel) list = list.filter((v) => v.fuel === filters.fuel);
    if (filters.transmission) list = list.filter((v) => v.transmission === filters.transmission);
    if (filters.ownership) {
      const ownMap = {
        '1st Owner': 'First Owner',
        '2nd Owner': 'Second Owner',
        '3rd Owner': 'Third Owner',
        '3rd Owner or more': ['Third Owner', 'Fourth Owner+']
      };
      const targetVal = ownMap[filters.ownership];
      if (Array.isArray(targetVal)) {
        list = list.filter((v) => targetVal.includes(v.ownership));
      } else if (targetVal) {
        list = list.filter((v) => v.ownership === targetVal);
      }
    }
    if (filters.city) {
      const regex = new RegExp(filters.city, 'i');
      list = list.filter((v) => regex.test(v.location?.city));
    }
    if (filters.bodyType) {
      const target = filters.bodyType.toLowerCase().replace(/[^a-z0-9]/g, '');
      list = list.filter((v) => {
        const vType = (v.bodyType || v.specifications?.bodyType || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        return vType.includes(target) || target.includes(vType);
      });
    }

    if (filters.category) {
      const cat = filters.category.toLowerCase().replace(/s$/, '');
      if (cat === 'car' || cat === 'commercial') {
        list = list.filter((v) => (v.category || 'car') === cat);
      }
    }

    if (filters.payloadCapacity) {
      list = list.filter((v) => v.specifications?.payloadCapacity === filters.payloadCapacity);
    }
    if (filters.gvw) {
      list = list.filter((v) => v.specifications?.gvw === filters.gvw);
    }
    if (filters.numTyres) {
      list = list.filter((v) => v.specifications?.numTyres === filters.numTyres);
    }

    // Range matches
    if (filters.minPrice) list = list.filter((v) => v.price >= parseFloat(filters.minPrice));
    if (filters.maxPrice) list = list.filter((v) => v.price <= parseFloat(filters.maxPrice));
    if (filters.minYear) list = list.filter((v) => v.year >= parseInt(filters.minYear, 10));
    if (filters.maxYear) list = list.filter((v) => v.year <= parseInt(filters.maxYear, 10));

    // Geolocation proximity query
    let sortedByDistance = false;
    if (filters.lat && filters.lng) {
      const lat = parseFloat(filters.lat);
      const lng = parseFloat(filters.lng);
      const maxDist = parseFloat(filters.maxDistance) || 50;

      list = list
        .map((v) => {
          const vLng = v.location?.coordinates?.[0] || 0;
          const vLat = v.location?.coordinates?.[1] || 0;
          const dist = calculateHaversineDistance(lat, lng, vLat, vLng);
          return { ...v, distance: dist };
        })
        .filter((v) => v.distance <= maxDist)
        .sort((a, b) => a.distance - b.distance); // sort nearest first

      sortedByDistance = true;
    }

    // Sorting (if not already sorted by proximity)
    if (!sortedByDistance) {
      const sort = filters.sort || 'newest';
      if (sort === 'price-low') {
        list.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-high') {
        list.sort((a, b) => b.price - a.price);
      } else if (sort === 'year-new') {
        list.sort((a, b) => b.year - a.year);
      } else if (sort === 'year-old') {
        list.sort((a, b) => a.year - b.year);
      } else if (sort === 'mileage-low') {
        list.sort((a, b) => a.mileage - b.mileage);
      } else {
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    }

    // Pagination
    const page = parseInt(filters.page, 10) || 1;
    const limit = parseInt(filters.limit, 10) || 12;
    const skip = (page - 1) * limit;
    const paginated = list.slice(skip, skip + limit);

    // Populate vendor info
    const users = getLocalData('vastu_users');
    const populated = paginated.map((car) => {
      const vendorUser = users.find((u) => u.id === car.vendor);
      return {
        ...car,
        vendor: vendorUser ? { name: vendorUser.name, email: vendorUser.email, phone: vendorUser.phone } : null,
      };
    });

    return {
      vehicles: populated,
      total: list.length,
      pages: Math.ceil(list.length / limit),
      currentPage: page,
    };
  }

  const { data } = await api.get('/vehicles', { params: filters });
  return data;
};

export const getVehicle = async (id) => {
  if (USE_LOCAL_STORAGE) {
    const list = getLocalData('vastu_vehicles');
    const vehicle = list.find((v) => v._id === id);
    if (!vehicle) throw new Error('Vehicle not found');

    const users = getLocalData('vastu_users');
    const vendorUser = users.find((u) => u.id === vehicle.vendor);

    const profiles = getLocalData('vastu_vendor_profiles');
    const vendorProfile = profiles.find((p) => p.user === vehicle.vendor);

    return {
      vehicle: {
        ...vehicle,
        vendor: vendorUser ? { _id: vendorUser.id, name: vendorUser.name, email: vendorUser.email, phone: vendorUser.phone } : null,
      },
      vendorProfile,
    };
  }

  const { data } = await api.get(`/vehicles/detail/${id}`);
  return data;
};

export const updateVehicle = async (id, formData) => {
  if (USE_LOCAL_STORAGE) {
    const vehicles = getLocalData('vastu_vehicles');
    const idx = vehicles.findIndex((v) => v._id === id);
    if (idx === -1) throw new Error('Vehicle not found');

    // Parse input fields
    const name = formData.get('name') || vehicles[idx].name;
    const brand = formData.get('brand') || vehicles[idx].brand;
    const model = formData.get('model') || vehicles[idx].model;
    const variant = formData.get('variant') || vehicles[idx].variant;
    const year = formData.get('year') ? parseInt(formData.get('year'), 10) : vehicles[idx].year;
    const price = formData.get('price') ? parseFloat(formData.get('price')) : vehicles[idx].price;
    const fuel = formData.get('fuel') || vehicles[idx].fuel;
    const transmission = formData.get('transmission') || vehicles[idx].transmission;
    const engine = formData.get('engine') || vehicles[idx].engine;
    const power = formData.get('power') || vehicles[idx].power;
    const torque = formData.get('torque') || vehicles[idx].torque;
    const mileage = formData.get('mileage') ? parseFloat(formData.get('mileage')) : vehicles[idx].mileage;
    const ownership = formData.get('ownership') || vehicles[idx].ownership;
    const insurance = formData.get('insurance') || vehicles[idx].insurance;
    const serviceHistory = formData.get('serviceHistory') || vehicles[idx].serviceHistory;
    const registration = formData.get('registration') || vehicles[idx].registration;
    const description = formData.get('description') || vehicles[idx].description;
    const city = formData.get('city') || vehicles[idx].location?.city;
    const state = formData.get('state') || vehicles[idx].location?.state;
    const lat = parseFloat(formData.get('latitude')) || vehicles[idx].location?.coordinates[1];
    const lng = parseFloat(formData.get('longitude')) || vehicles[idx].location?.coordinates[0];
    const status = formData.get('status') || vehicles[idx].status;
    const category = formData.get('category') || vehicles[idx].category || 'car';

    const features = formData.get('features') ? JSON.parse(formData.get('features')) : vehicles[idx].features;
    const specifications = formData.get('specifications') ? JSON.parse(formData.get('specifications')) : vehicles[idx].specifications;

    // Handle new uploads or fallbacks
    let images = vehicles[idx].images;
    if (formData.get('existingImages')) {
      try {
        images = JSON.parse(formData.get('existingImages'));
      } catch (e) {
        // fallback
      }
    }
    const imageFiles = formData.getAll('images');
    if (imageFiles.length > 0) {
      const listUrls = [];
      for (let i = 0; i < imageFiles.length; i++) {
        if (imageFiles[i] instanceof File) {
          const key = `file_car_img_${id}_${Date.now()}_${i}`;
          await saveFileToDB(key, imageFiles[i]);
          const url = await getFileFromDB(key);
          listUrls.push(url);
        }
      }
      if (listUrls.length > 0) images = [...images, ...listUrls];
    }

    let threeSixtyImages = vehicles[idx].threeSixtyImages;
    if (formData.get('existing360')) {
      try {
        threeSixtyImages = JSON.parse(formData.get('existing360'));
      } catch (e) {
        // fallback
      }
    }
    const threeSixtyFiles = formData.getAll('threeSixtyImages');
    if (threeSixtyFiles.length > 0) {
      const listUrls = [];
      for (let i = 0; i < threeSixtyFiles.length; i++) {
        if (threeSixtyFiles[i] instanceof File) {
          const key = `file_car_360_${id}_${Date.now()}_${i}`;
          await saveFileToDB(key, threeSixtyFiles[i]);
          const url = await getFileFromDB(key);
          listUrls.push(url);
        }
      }
      if (listUrls.length > 0) threeSixtyImages = [...threeSixtyImages, ...listUrls];
    }

    const videoFile = formData.get('video');
    let video = vehicles[idx].video;
    if (videoFile instanceof File && videoFile.size > 0) {
      const key = `file_car_video_${id}_${Date.now()}`;
      await saveFileToDB(key, videoFile);
      video = await getFileFromDB(key);
    }

    vehicles[idx] = {
      ...vehicles[idx],
      name,
      brand,
      model,
      variant,
      year,
      price,
      fuel,
      transmission,
      engine,
      power,
      torque,
      mileage,
      ownership,
      insurance,
      serviceHistory,
      registration,
      description,
      features,
      specifications,
      location: { city, state, coordinates: [lng, lat] },
      images,
      threeSixtyImages: [],
      category,
      video,
      status,
    };

    saveLocalData('vastu_vehicles', vehicles);
    return { success: true, vehicle: vehicles[idx] };
  }

  const { data } = await api.put(`/vehicles/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const deleteVehicle = async (id) => {
  if (USE_LOCAL_STORAGE) {
    const list = getLocalData('vastu_vehicles');
    const filtered = list.filter((v) => v._id !== id);
    saveLocalData('vastu_vehicles', filtered);
    return { success: true };
  }

  const { data } = await api.delete(`/vehicles/${id}`);
  return data;
};

export const getVendorVehicles = async () => {
  if (USE_LOCAL_STORAGE) {
    const token = localStorage.getItem('vastu_token');
    const userId = token?.replace('mock_jwt_token_', '');
    if (!userId) throw new Error('Not authorized');

    const list = getLocalData('vastu_vehicles');
    const filtered = list.filter((v) => v.vendor === userId);
    return { vehicles: filtered };
  }

  const { data } = await api.get('/vehicles/vendor/listings');
  return data;
};
