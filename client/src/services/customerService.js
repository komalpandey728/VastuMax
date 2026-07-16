import api from './api';
import { USE_LOCAL_STORAGE } from './config';
import { getLocalData, saveLocalData } from './db';

export const getCustomerProfile = async () => {
  if (USE_LOCAL_STORAGE) {
    const token = localStorage.getItem('vastu_token');
    const userId = token?.replace('mock_jwt_token_', '');
    if (!userId) throw new Error('Not authorized');

    const users = getLocalData('vastu_users');
    const customer = users.find((u) => u.id === userId);
    if (!customer) throw new Error('Customer not found');

    const { password, ...safeCustomer } = customer;
    return { success: true, customer: safeCustomer };
  }

  const { data } = await api.get('/customers/profile');
  return data;
};

export const updateCustomerProfile = async (profileData) => {
  if (USE_LOCAL_STORAGE) {
    const token = localStorage.getItem('vastu_token');
    const userId = token?.replace('mock_jwt_token_', '');
    if (!userId) throw new Error('Not authorized');

    const users = getLocalData('vastu_users');
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error('Customer not found');

    const { name, phone, city, state, latitude, longitude } = profileData;

    users[idx].name = name || users[idx].name;
    users[idx].phone = phone || users[idx].phone;

    if (city || state) {
      users[idx].location = {
        city: city || users[idx].location?.city || '',
        state: state || users[idx].location?.state || '',
        coordinates: [parseFloat(longitude) || 0, parseFloat(latitude) || 0],
      };
    }

    saveLocalData('vastu_users', users);
    const { password, ...safeCustomer } = users[idx];
    return { success: true, customer: safeCustomer };
  }

  const { data } = await api.put('/customers/profile', profileData);
  return data;
};

export const addToWishlist = async (vehicleId) => {
  if (USE_LOCAL_STORAGE) {
    const token = localStorage.getItem('vastu_token');
    const userId = token?.replace('mock_jwt_token_', '');
    if (!userId) throw new Error('Not authorized');

    const users = getLocalData('vastu_users');
    const idx = users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      if (!users[idx].wishlist) users[idx].wishlist = [];
      if (!users[idx].wishlist.includes(vehicleId)) {
        users[idx].wishlist.push(vehicleId);
        saveLocalData('vastu_users', users);
      }
    }
    return { success: true, wishlist: users[idx]?.wishlist || [] };
  }

  const { data } = await api.post(`/customers/wishlist/${vehicleId}`);
  return data;
};

export const removeFromWishlist = async (vehicleId) => {
  if (USE_LOCAL_STORAGE) {
    const token = localStorage.getItem('vastu_token');
    const userId = token?.replace('mock_jwt_token_', '');
    if (!userId) throw new Error('Not authorized');

    const users = getLocalData('vastu_users');
    const idx = users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      if (users[idx].wishlist) {
        users[idx].wishlist = users[idx].wishlist.filter((id) => id !== vehicleId);
        saveLocalData('vastu_users', users);
      }
    }
    return { success: true, wishlist: users[idx]?.wishlist || [] };
  }

  const { data } = await api.delete(`/customers/wishlist/${vehicleId}`);
  return data;
};

export const getWishlist = async () => {
  if (USE_LOCAL_STORAGE) {
    const token = localStorage.getItem('vastu_token');
    const userId = token?.replace('mock_jwt_token_', '');
    if (!userId) throw new Error('Not authorized');

    const users = getLocalData('vastu_users');
    const customer = users.find((u) => u.id === userId);
    const wishlistIds = customer?.wishlist || [];

    const vehicles = getLocalData('vastu_vehicles');
    const wishlistVehicles = vehicles.filter((v) => wishlistIds.includes(v._id));

    // Populate vendor info
    const populated = wishlistVehicles.map((car) => {
      const vendorUser = users.find((u) => u.id === car.vendor);
      return {
        ...car,
        vendor: vendorUser ? { name: vendorUser.name, email: vendorUser.email } : null,
      };
    });

    return { success: true, wishlist: populated };
  }

  const { data } = await api.get('/customers/wishlist');
  return data;
};

export const getNotifications = async () => {
  if (USE_LOCAL_STORAGE) {
    const token = localStorage.getItem('vastu_token');
    const userId = token?.replace('mock_jwt_token_', '');
    if (!userId) throw new Error('Not authorized');

    const notifications = getLocalData('vastu_notifications');
    const list = notifications.filter((n) => n.user === userId);
    return { success: true, notifications: list };
  }

  const { data } = await api.get('/customers/notifications');
  return data;
};

export const markNotificationRead = async (id) => {
  if (USE_LOCAL_STORAGE) {
    const notifications = getLocalData('vastu_notifications');
    const idx = notifications.findIndex((n) => n._id === id);
    if (idx !== -1) {
      notifications[idx].isRead = true;
      saveLocalData('vastu_notifications', notifications);
    }
    return { success: true };
  }

  const { data } = await api.patch(`/customers/notifications/${id}/read`);
  return data;
};
