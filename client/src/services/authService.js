import api from './api';
import { USE_LOCAL_STORAGE } from './config';
import { getLocalData, saveLocalData } from './db';

export const register = async (userData) => {
  if (USE_LOCAL_STORAGE) {
    const users = getLocalData('vastu_users');
    const existing = users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: userData.password, // stored plain for local sandbox
      phone: userData.phone,
      role: userData.role || 'customer',
      isActive: true,
      wishlist: [],
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveLocalData('vastu_users', users);

    // Auto-create blank KYC profile if vendor
    if (newUser.role === 'vendor') {
      const profiles = getLocalData('vastu_vendor_profiles');
      profiles.push({
        id: `vp_${Date.now()}`,
        user: newUser.id,
        businessName: `${newUser.name} Dealership`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      saveLocalData('vastu_vendor_profiles', profiles);
    }

    const token = `mock_jwt_token_${newUser.id}`;
    return { data: { user: newUser, token } };
  }

  const { data } = await api.post('/auth/register', userData);
  return { data };
};

export const login = async (credentials) => {
  if (USE_LOCAL_STORAGE) {
    const users = getLocalData('vastu_users');
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === credentials.email.toLowerCase() &&
        u.password === credentials.password
    );

    if (!user) {
      throw new Error('Invalid email address or password.');
    }

    if (!user.isActive) {
      throw new Error('Your account has been deactivated. Please contact support.');
    }

    const token = `mock_jwt_token_${user.id}`;
    return { data: { user, token } };
  }

  const { data } = await api.post('/auth/login', credentials);
  return { data };
};

export const logout = async () => {
  if (USE_LOCAL_STORAGE) {
    return { data: { success: true } };
  }
  const { data } = await api.post('/auth/logout');
  return { data };
};

export const getMe = async () => {
  if (USE_LOCAL_STORAGE) {
    const token = localStorage.getItem('vastu_token');
    if (!token || !token.startsWith('mock_jwt_token_')) {
      throw new Error('Not authorized');
    }
    const userId = token.replace('mock_jwt_token_', '');
    const users = getLocalData('vastu_users');
    const user = users.find((u) => u.id === userId);

    if (!user) {
      throw new Error('User not found');
    }

    return { data: { user } };
  }

  const { data } = await api.get('/auth/me');
  return { data };
};
