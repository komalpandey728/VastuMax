import api from './api';
import { USE_LOCAL_STORAGE } from './config';
import { getLocalData, saveLocalData, saveFileToDB, getFileFromDB } from './db';

export const submitOnboarding = async (formData) => {
  if (USE_LOCAL_STORAGE) {
    const token = localStorage.getItem('vastu_token');
    const userId = token?.replace('mock_jwt_token_', '');
    if (!userId) throw new Error('Not authorized');

    const profiles = getLocalData('vastu_vendor_profiles');
    let profile = profiles.find((p) => p.user === userId);

    const businessName = formData.get('businessName');
    const gstNumber = formData.get('gstNumber');
    const panNumber = formData.get('panNumber');
    const aadharNumber = formData.get('aadharNumber');
    const drivingLicenseNumber = formData.get('drivingLicenseNumber');
    const street = formData.get('street');
    const city = formData.get('city');
    const state = formData.get('state');
    const zipCode = formData.get('zipCode');
    const accountHolderName = formData.get('accountHolderName');
    const accountNumber = formData.get('accountNumber');
    const bankName = formData.get('bankName');
    const ifscCode = formData.get('ifscCode');

    // Extract files
    const profilePictureFile = formData.get('profilePicture');
    const cancelledChequeFile = formData.get('cancelledChequeImage');
    const businessProofFile = formData.get('businessProofImage');

    let profilePicture = profile?.profilePicture || '';
    if (profilePictureFile && profilePictureFile.size > 0) {
      const key = `file_avatar_${userId}_${Date.now()}`;
      await saveFileToDB(key, profilePictureFile);
      profilePicture = await getFileFromDB(key);
    }

    let cancelledChequeImage = profile?.cancelledChequeImage || '';
    if (cancelledChequeFile && cancelledChequeFile.size > 0) {
      const key = `file_cheque_${userId}_${Date.now()}`;
      await saveFileToDB(key, cancelledChequeFile);
      cancelledChequeImage = await getFileFromDB(key);
    }

    let businessProofImage = profile?.businessProofImage || '';
    if (businessProofFile && businessProofFile.size > 0) {
      const key = `file_proof_${userId}_${Date.now()}`;
      await saveFileToDB(key, businessProofFile);
      businessProofImage = await getFileFromDB(key);
    }

    const profileData = {
      id: profile?.id || `vp_${Date.now()}`,
      user: userId,
      businessName,
      gstNumber,
      panNumber,
      aadharNumber,
      drivingLicenseNumber,
      address: { street, city, state, zipCode },
      bankDetails: { accountHolderName, accountNumber, bankName, ifscCode },
      profilePicture,
      cancelledChequeImage,
      businessProofImage,
      status: 'pending', // reset to review status
      rejectionReason: '',
      createdAt: profile?.createdAt || new Date().toISOString(),
    };

    if (profile) {
      const idx = profiles.findIndex((p) => p.user === userId);
      profiles[idx] = profileData;
    } else {
      profiles.push(profileData);
    }
    saveLocalData('vastu_vendor_profiles', profiles);

    return { success: true, profile: profileData };
  }

  const { data } = await api.post('/vendors/onboarding', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const getVendorProfile = async () => {
  if (USE_LOCAL_STORAGE) {
    const token = localStorage.getItem('vastu_token');
    const userId = token?.replace('mock_jwt_token_', '');
    if (!userId) throw new Error('Not authorized');

    const profiles = getLocalData('vastu_vendor_profiles');
    const profile = profiles.find((p) => p.user === userId);

    // populate user info dynamically
    if (profile) {
      const users = getLocalData('vastu_users');
      profile.user = users.find((u) => u.id === userId);
    }

    return { success: true, profile: profile || null };
  }

  const { data } = await api.get('/vendors/profile');
  return data;
};

export const updateProfile = async (formData) => {
  if (USE_LOCAL_STORAGE) {
    const token = localStorage.getItem('vastu_token');
    const userId = token?.replace('mock_jwt_token_', '');
    if (!userId) throw new Error('Not authorized');

    const profiles = getLocalData('vastu_vendor_profiles');
    let profile = profiles.find((p) => p.user === userId);
    if (!profile) throw new Error('Vendor profile not found');

    const businessName = formData.get('businessName') || profile.businessName;
    const street = formData.get('street') || profile.address?.street;
    const city = formData.get('city') || profile.address?.city;
    const state = formData.get('state') || profile.address?.state;
    const zipCode = formData.get('zipCode') || profile.address?.zipCode;
    const accountHolderName = formData.get('accountHolderName') || profile.bankDetails?.accountHolderName;
    const accountNumber = formData.get('accountNumber') || profile.bankDetails?.accountNumber;
    const bankName = formData.get('bankName') || profile.bankDetails?.bankName;
    const ifscCode = formData.get('ifscCode') || profile.bankDetails?.ifscCode;

    const profilePictureFile = formData.get('profilePicture');
    let profilePicture = profile.profilePicture || '';
    if (profilePictureFile && profilePictureFile.size > 0) {
      const key = `file_avatar_${userId}_${Date.now()}`;
      await saveFileToDB(key, profilePictureFile);
      profilePicture = await getFileFromDB(key);
    }

    const updatedProfile = {
      ...profile,
      businessName,
      address: { street, city, state, zipCode },
      bankDetails: { accountHolderName, accountNumber, bankName, ifscCode },
      profilePicture,
    };

    const idx = profiles.findIndex((p) => p.user === userId);
    profiles[idx] = updatedProfile;
    saveLocalData('vastu_vendor_profiles', profiles);

    return { success: true, profile: updatedProfile };
  }

  const { data } = await api.put('/vendors/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const getPublicVendors = async () => {
  const { data } = await api.get('/vendors/public');
  return data;
};

export const getPublicVendor = async (id) => {
  const { data } = await api.get(`/vendors/public/${id}`);
  return data;
};
