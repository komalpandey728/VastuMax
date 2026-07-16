import api from './api';
import { USE_LOCAL_STORAGE } from './config';
import { getLocalData, saveLocalData } from './db';

// Stats & Users
export const getAdminStats = async () => {
  if (USE_LOCAL_STORAGE) {
    const users = getLocalData('vastu_users');
    const profiles = getLocalData('vastu_vendor_profiles');
    const vehicles = getLocalData('vastu_vehicles');

    const totalCustomers = users.filter((u) => u.role === 'customer').length;
    const totalVendors = users.filter((u) => u.role === 'vendor').length;
    const pendingVendors = profiles.filter((p) => p.status === 'pending').length;
    const approvedVendors = profiles.filter((p) => p.status === 'approved').length;
    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter((v) => v.status === 'active').length;
    const soldVehicles = vehicles.filter((v) => v.status === 'sold').length;

    const recentVehicles = [...vehicles]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    // populate vendor inside recent vehicles
    recentVehicles.forEach((v) => {
      v.vendor = users.find((usr) => usr.id === v.vendor);
    });

    const recentUsers = [...users]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    return {
      stats: {
        totalCustomers,
        totalVendors,
        pendingVendors,
        approvedVendors,
        totalVehicles,
        activeVehicles,
        soldVehicles,
      },
      recentVehicles,
      recentUsers,
    };
  }

  const { data } = await api.get('/admin/stats');
  return data;
};

export const getVendors = async (status) => {
  if (USE_LOCAL_STORAGE) {
    const profiles = getLocalData('vastu_vendor_profiles');
    const users = getLocalData('vastu_users');

    const filtered = status ? profiles.filter((p) => p.status === status) : profiles;

    // populate user
    const populated = filtered.map((p) => {
      const u = users.find((usr) => usr.id === p.user);
      return {
        ...p,
        user: u ? { name: u.name, email: u.email, phone: u.phone, isActive: u.isActive, id: u.id } : null,
      };
    });

    return { profiles: populated };
  }

  const params = status ? { status } : {};
  const { data } = await api.get('/admin/vendors', { params });
  return data;
};

export const approveVendor = async (id) => {
  if (USE_LOCAL_STORAGE) {
    const profiles = getLocalData('vastu_vendor_profiles');
    const idx = profiles.findIndex((p) => p.id === id);
    if (idx !== -1) {
      profiles[idx].status = 'approved';
      profiles[idx].rejectionReason = '';
      saveLocalData('vastu_vendor_profiles', profiles);

      // Notify vendor
      const notifications = getLocalData('vastu_notifications');
      notifications.push({
        _id: `nt_${Date.now()}`,
        user: profiles[idx].user,
        title: 'KYC Onboarding Approved 🎉',
        message: `Congratulations! Your dealership onboarding for "${profiles[idx].businessName}" has been approved. You can now start listing vehicles.`,
        type: 'onboarding',
        isRead: false,
        link: '/vendor/dashboard',
        createdAt: new Date().toISOString(),
      });
      saveLocalData('vastu_notifications', notifications);
    }
    return { success: true };
  }

  const { data } = await api.post(`/admin/vendors/${id}/approve`);
  return data;
};

export const rejectVendor = async (id, rejectionReason) => {
  if (USE_LOCAL_STORAGE) {
    const profiles = getLocalData('vastu_vendor_profiles');
    const idx = profiles.findIndex((p) => p.id === id);
    if (idx !== -1) {
      profiles[idx].status = 'rejected';
      profiles[idx].rejectionReason = rejectionReason;
      saveLocalData('vastu_vendor_profiles', profiles);

      // Notify vendor
      const notifications = getLocalData('vastu_notifications');
      notifications.push({
        _id: `nt_${Date.now()}`,
        user: profiles[idx].user,
        title: 'KYC Onboarding Rejected ⚠️',
        message: `Your onboarding submission was rejected: ${rejectionReason}. Please update and resubmit.`,
        type: 'onboarding',
        isRead: false,
        link: '/vendor/onboarding',
        createdAt: new Date().toISOString(),
      });
      saveLocalData('vastu_notifications', notifications);
    }
    return { success: true };
  }

  const { data } = await api.post(`/admin/vendors/${id}/reject`, { rejectionReason });
  return data;
};

export const getCustomers = async () => {
  if (USE_LOCAL_STORAGE) {
    const users = getLocalData('vastu_users');
    const customers = users.filter((u) => u.role === 'customer');
    return { customers };
  }

  const { data } = await api.get('/admin/customers');
  return data;
};

export const toggleUserStatus = async (id) => {
  if (USE_LOCAL_STORAGE) {
    const users = getLocalData('vastu_users');
    const idx = users.findIndex((u) => u.id === id);
    if (idx !== -1) {
      users[idx].isActive = !users[idx].isActive;
      saveLocalData('vastu_users', users);
      return { success: true, message: `User account is now ${users[idx].isActive ? 'Active' : 'Blocked'}.` };
    }
    throw new Error('User not found');
  }

  const { data } = await api.patch(`/admin/users/${id}/toggle-status`);
  return data;
};

// Brands
export const getBrands = async () => {
  if (USE_LOCAL_STORAGE) {
    const brands = getLocalData('vastu_brands');
    return { brands };
  }
  const { data } = await api.get('/admin/brands');
  return data;
};

export const createBrand = async (brandData) => {
  if (USE_LOCAL_STORAGE) {
    const brands = getLocalData('vastu_brands');
    const newB = { _id: `b_${Date.now()}`, ...brandData };
    brands.push(newB);
    saveLocalData('vastu_brands', brands);
    return { success: true, brand: newB };
  }
  const { data } = await api.post('/admin/brands', brandData);
  return data;
};

export const deleteBrand = async (id) => {
  if (USE_LOCAL_STORAGE) {
    const brands = getLocalData('vastu_brands');
    const filtered = brands.filter((b) => b._id !== id);
    saveLocalData('vastu_brands', filtered);
    return { success: true };
  }
  const { data } = await api.delete(`/admin/brands/${id}`);
  return data;
};

// Categories
export const getCategories = async () => {
  if (USE_LOCAL_STORAGE) {
    const categories = getLocalData('vastu_categories');
    return { categories };
  }
  const { data } = await api.get('/admin/categories');
  return data;
};

export const createCategory = async (catData) => {
  if (USE_LOCAL_STORAGE) {
    const categories = getLocalData('vastu_categories');
    const newC = { _id: `c_${Date.now()}`, ...catData };
    categories.push(newC);
    saveLocalData('vastu_categories', categories);
    return { success: true, category: newC };
  }
  const { data } = await api.post('/admin/categories', catData);
  return data;
};

export const deleteCategory = async (id) => {
  if (USE_LOCAL_STORAGE) {
    const categories = getLocalData('vastu_categories');
    const filtered = categories.filter((c) => c._id !== id);
    saveLocalData('vastu_categories', filtered);
    return { success: true };
  }
  const { data } = await api.delete(`/admin/categories/${id}`);
  return data;
};

// Cities
export const getCities = async () => {
  if (USE_LOCAL_STORAGE) {
    const cities = getLocalData('vastu_cities');
    return { cities };
  }
  const { data } = await api.get('/admin/cities');
  return data;
};

export const createCity = async (cityData) => {
  if (USE_LOCAL_STORAGE) {
    const cities = getLocalData('vastu_cities');
    const newCity = { _id: `ct_${Date.now()}`, ...cityData };
    cities.push(newCity);
    saveLocalData('vastu_cities', cities);
    return { success: true, city: newCity };
  }
  const { data } = await api.post('/admin/cities', cityData);
  return data;
};

export const deleteCity = async (id) => {
  if (USE_LOCAL_STORAGE) {
    const cities = getLocalData('vastu_cities');
    const filtered = cities.filter((c) => c._id !== id);
    saveLocalData('vastu_cities', filtered);
    return { success: true };
  }
  const { data } = await api.delete(`/admin/cities/${id}`);
  return data;
};

// Q&A Moderation
export const getPendingQuestions = async () => {
  if (USE_LOCAL_STORAGE) {
    const questions = getLocalData('vastu_questions');
    const users = getLocalData('vastu_users');
    const vehicles = getLocalData('vastu_vehicles');

    const pending = questions.filter((q) => !q.isApproved);
    const populated = pending.map((q) => {
      const v = vehicles.find((car) => car._id === q.vehicle);
      const c = users.find((usr) => usr.id === q.customer);
      return {
        ...q,
        vehicle: v ? { name: v.name, brand: v.brand, model: v.model } : null,
        customer: c ? { name: c.name, email: c.email } : null,
      };
    });

    return { questions: populated };
  }

  const { data } = await api.get('/admin/questions/pending');
  return data;
};

export const approveQuestion = async (id) => {
  if (USE_LOCAL_STORAGE) {
    const questions = getLocalData('vastu_questions');
    const idx = questions.findIndex((q) => q._id === id);
    if (idx !== -1) {
      questions[idx].isApproved = true;
      saveLocalData('vastu_questions', questions);
    }
    return { success: true };
  }

  const { data } = await api.patch(`/admin/questions/${id}/approve`);
  return data;
};

export const deleteQuestion = async (id) => {
  if (USE_LOCAL_STORAGE) {
    const questions = getLocalData('vastu_questions');
    const filtered = questions.filter((q) => q._id !== id);
    saveLocalData('vastu_questions', filtered);
    return { success: true };
  }

  const { data } = await api.delete(`/admin/questions/${id}`);
  return data;
};
