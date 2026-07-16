import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as loginApi, register as registerApi, getMe, logout as logoutApi } from '../services/authService';
import api from '../services/api';
import toast from 'react-hot-toast';

const GUEST_KEY = 'vastu_guest_session';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const loadUser = useCallback(async () => {
    const guestData = localStorage.getItem(GUEST_KEY);
    if (guestData) {
      try {
        const guestUser = JSON.parse(guestData);
        setUser(guestUser);
        setIsAuthenticated(true);
        setIsGuest(true);
        setLoading(false);
        return;
      } catch {
        localStorage.removeItem(GUEST_KEY);
      }
    }

    const token = localStorage.getItem('vastu_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await getMe();
      setUser(data.user);
      setIsAuthenticated(true);
      setIsGuest(false);
    } catch {
      localStorage.removeItem('vastu_token');
      localStorage.removeItem('vastu_user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    const locateUser = () => {
      if (!localStorage.getItem('vastu_gps_city') && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;

  localStorage.setItem("vastu_gps_lat", lat);
  localStorage.setItem("vastu_gps_lng", lng);

  fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const city =
  data.address.city ||
  data.address.town ||
  data.address.village ||
  data.address.suburb ||
  data.address.city_district ||
  data.address.municipality ||
  data.address.borough ||
  data.address.neighbourhood ||
  data.address.hamlet ||
  data.address.county ||
  "";

      const state = data.address.state || "";

      localStorage.setItem("vastu_gps_city", city);
      localStorage.setItem("vastu_gps_state", state);

      console.log("📍 Location detected:", {
        city,
        state,
        latitude: lat,
        longitude: lng,
      });
    })
    .catch((error) => {
      console.error("Reverse geocoding failed:", error);

      localStorage.setItem("vastu_gps_city", "");
      localStorage.setItem("vastu_gps_state", "");
    });
},
          (error) => {
  console.error("Unable to get GPS location:", error);

  localStorage.removeItem("vastu_gps_city");
  localStorage.removeItem("vastu_gps_state");
  localStorage.removeItem("vastu_gps_lat");
  localStorage.removeItem("vastu_gps_lng");
}
        );
      }
    };
    locateUser();
  }, []);

  const login = async (credentials) => {
    localStorage.removeItem(GUEST_KEY);
    const { data } = await loginApi(credentials);
    localStorage.setItem('vastu_token', data.token);
    localStorage.setItem('vastu_user', JSON.stringify(data.user));
    setUser(data.user);
    setIsAuthenticated(true);
    setIsGuest(false);
    toast.success(`Welcome back, ${data.user.name}!`);
    return data.user;
  };

  const register = async (userData) => {
    localStorage.removeItem(GUEST_KEY);
    const { data } = await registerApi(userData);
    localStorage.setItem('vastu_token', data.token);
    localStorage.setItem('vastu_user', JSON.stringify(data.user));
    setUser(data.user);
    setIsAuthenticated(true);
    setIsGuest(false);
    toast.success('Account created successfully!');
    return data.user;
  };

  const continueAsGuest = async () => {
    const city = localStorage.getItem('vastu_gps_city') || '';
    try {
      const { data } = await api.post('/auth/guest', { city });
      const guestUser = { ...data.user, city };
      localStorage.setItem(GUEST_KEY, JSON.stringify(guestUser));
      localStorage.removeItem('vastu_token');
      localStorage.removeItem('vastu_user');
      setUser(guestUser);
      setIsAuthenticated(true);
      setIsGuest(true);
      toast.success('Browsing as guest — full access to listings & compare!');
      return guestUser;
    } catch {
      const guestUser = {
        id: `guest_${Date.now()}`,
        name: 'Guest',
        role: 'guest',
        city,
        wishlist: [],
      };
      localStorage.setItem(GUEST_KEY, JSON.stringify(guestUser));
      setUser(guestUser);
      setIsAuthenticated(true);
      setIsGuest(true);
      toast.success('Browsing as guest!');
      return guestUser;
    }
  };

  const logout = async () => {
    if (isGuest) {
      localStorage.removeItem(GUEST_KEY);
      setUser(null);
      setIsAuthenticated(false);
      setIsGuest(false);
      toast.success('Guest session ended');
      return;
    }
    try {
      await logoutApi();
    } catch {
      // proceed with local logout
    }
    localStorage.removeItem('vastu_token');
    localStorage.removeItem('vastu_user');
    setUser(null);
    setIsAuthenticated(false);
    setIsGuest(false);
    toast.success('Logged out successfully');
  };

  const isAdmin = user?.role === 'admin';
  const isVendor = user?.role === 'vendor';
  const isCustomer = user?.role === 'customer';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isGuest,
        isAdmin,
        isVendor,
        isCustomer,
        login,
        register,
        continueAsGuest,
        logout,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
