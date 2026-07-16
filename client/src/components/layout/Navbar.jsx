import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Search,
  Menu,
  X,
  User,
  Heart,
  LogIn,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Bell,
  Check,
  MapPin,
} from 'lucide-react';
import { NAV_LINKS } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { getNotifications, markNotificationRead } from '../../services/customerService';
import { getVehicles } from '../../services/vehicleService';
import Button from '../ui/Button';
import toast from 'react-hot-toast';
import vastuLogo from '../../assets/vastu_logo.png';

const INDIAN_LOCATIONS = [
  "Mumbai, Maharashtra",
  "Pune, Maharashtra",
  "Nagpur, Maharashtra",
  "Thane, Maharashtra",
  "Nashik, Maharashtra",
  "Maharashtra",
  "Delhi",
  "New Delhi",
  "Bengaluru, Karnataka",
  "Mysore, Karnataka",
  "Karnataka",
  "Chennai, Tamil Nadu",
  "Coimbatore, Tamil Nadu",
  "Tamil Nadu",
  "Hyderabad, Telangana",
  "Telangana",
  "Visakhapatnam, Andhra Pradesh",
  "Vijayawada, Andhra Pradesh",
  "Andhra Pradesh",
  "Kolkata, West Bengal",
  "West Bengal",
  "Ahmedabad, Gujarat",
  "Surat, Gujarat",
  "Vadodara, Gujarat",
  "Gujarat",
  "Lucknow, Uttar Pradesh",
  "Kanpur, Uttar Pradesh",
  "Noida, Uttar Pradesh",
  "Ghaziabad, Uttar Pradesh",
  "Uttar Pradesh",
  "Jaipur, Rajasthan",
  "Jodhpur, Rajasthan",
  "Udaipur, Rajasthan",
  "Rajasthan",
  "Ludhiana, Punjab",
  "Amritsar, Punjab",
  "Punjab",
  "Gurugram, Haryana",
  "Faridabad, Haryana",
  "Haryana",
  "Kochi, Kerala",
  "Thiruvananthapuram, Kerala",
  "Kerala",
  "Indore, Madhya Pradesh",
  "Bhopal, Madhya Pradesh",
  "Madhya Pradesh",
  "Patna, Bihar",
  "Bihar",
  "Bhubaneswar, Odisha",
  "Odisha",
  "Guwahati, Assam",
  "Assam",
  "Ranchi, Jharkhand",
  "Jamshedpur, Jharkhand",
  "Jharkhand",
  "Raipur, Chhattisgarh",
  "Chhattisgarh",
  "Dehradun, Uttarakhand",
  "Uttarakhand"
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [userLocationCity, setUserLocationCity] = useState(() => localStorage.getItem("vastu_gps_city") || "Detect Location");
  const [manualCityInput, setManualCityInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [allVehiclesPool, setAllVehiclesPool] = useState([]);

  useEffect(() => {
    const fetchVehiclesPool = async () => {
      try {
        const res = await getVehicles({ limit: 100 });
        setAllVehiclesPool(res.vehicles || []);
      } catch {
        // ignore
      }
    };
    fetchVehiclesPool();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchSuggestions([]);
      return;
    }
    const q = searchQuery.toLowerCase().trim();
    const starting = allVehiclesPool.filter(
      (v) =>
        v.name.toLowerCase().startsWith(q) ||
        v.brand.toLowerCase().startsWith(q) ||
        v.model.toLowerCase().startsWith(q)
    );
    const containing = allVehiclesPool.filter(
      (v) =>
        !starting.includes(v) &&
        (v.name.toLowerCase().includes(q) ||
         v.brand.toLowerCase().includes(q) ||
         v.model.toLowerCase().includes(q))
    );
    setSearchSuggestions([...starting, ...containing].slice(0, 5));
  }, [searchQuery, allVehiclesPool]);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isAdmin, isVendor } = useAuth();

  const handleManualLocationUpdate = (selectedLoc) => {
    const loc = selectedLoc || manualCityInput.trim();
    if (!loc) return;

    let city = loc;
    let state = '';
    if (loc.includes(',')) {
      const parts = loc.split(',');
      city = parts[0].trim();
      state = parts[1].trim();
    }

    localStorage.setItem('vastu_gps_city', city);
    if (state) {
      localStorage.setItem('vastu_gps_state', state);
    }

    let lat = 18.5204;
    let lng = 73.8567;
    const lowerCity = city.toLowerCase();
    if (lowerCity === 'mumbai') {
      lat = 19.076;
      lng = 72.8777;
    } else if (lowerCity === 'delhi' || lowerCity === 'new delhi') {
      lat = 28.6139;
      lng = 77.209;
    } else if (lowerCity === 'bangalore' || lowerCity === 'bengaluru') {
      lat = 12.9716;
      lng = 77.5946;
    } else if (lowerCity === 'pune') {
      lat = 18.5204;
      lng = 73.8567;
    }
    localStorage.setItem('vastu_gps_lat', lat);
    localStorage.setItem('vastu_gps_lng', lng);

    setUserLocationCity(city);
    setShowLocationModal(false);
    toast.success(`Location set to ${city}`);
    window.location.reload();
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          localStorage.setItem("vastu_gps_lat", lat);
          localStorage.setItem("vastu_gps_lng", lng);

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
          );

          const data = await response.json();

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
            "Unknown";

          const state = data.address.state || "";

          localStorage.setItem("vastu_gps_city", city);
          localStorage.setItem("vastu_gps_state", state);

          setUserLocationCity(city);

          toast.success(`Location detected: ${city}`);
        } catch (error) {
          console.error(error);
          toast.error("Unable to detect city.");
        }
      },
      () => {
        toast.error("Location permission denied.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchNotifs = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const res = await getNotifications();
        setNotifications(res.notifications || []);
      } catch {
        // fail silently
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 15000);
    return () => clearInterval(interval);
  }, [fetchNotifs]);

  useEffect(() => {
    setIsMobileOpen(false);
    setIsUserMenuOpen(false);
    setIsNotifOpen(false);
  }, [location.pathname]);

  const handleMarkAllRead = async () => {
    try {
      const unreadList = notifications.filter((n) => !n.isRead);
      for (const n of unreadList) {
        await markNotificationRead(n._id);
      }
      fetchNotifs();
      toast.success('All notifications marked as read.');
    } catch {
      toast.error('Failed to update notifications.');
    }
  };

  const handleMarkRead = async (id, e) => {
    e.stopPropagation();
    try {
      await markNotificationRead(id);
      fetchNotifs();
    } catch {
      // ignore
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/buy/cars?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/buy/cars');
    }
    setSearchQuery('');
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const navBg = isScrolled || !isHome
    ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-border/50'
    : 'bg-transparent';

  const textColor = isScrolled || !isHome ? 'text-text' : 'text-white';

  const dashboardPath = isAdmin
    ? '/admin/dashboard'
    : isVendor
      ? '/vendor/dashboard'
      : '/customer/wishlist';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <nav className="container-vastu max flex h-16 items-center justify-between lg:h-20">
        <Link to="/" className="flex items-center gap-2">
          <img src={vastuLogo} alt="Vastu Max Logo" className="h-12 sm:h-14 w-12 sm:w-14 rounded-full object-cover bg-white shadow-md border border-slate-200 p-1" />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary-600 ${isScrolled || !isHome ? 'text-text-muted' : 'text-white/90'
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <form onSubmit={handleSearchSubmit} className="relative items-center gap-2 rounded-2xl border border-border bg-white/90 px-3 py-1.5 shadow-soft lg:flex">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchSuggestions(true);
              }}
              onFocus={() => setShowSearchSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 250)}
              placeholder="Search vehicles..."
              className="w-40 bg-transparent text-sm text-text outline-none placeholder:text-slate-400"
            />
            <button type="submit" className="rounded-xl bg-primary-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-primary-700">
              Go
            </button>

            {showSearchSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 max-h-60 overflow-y-auto rounded-xl border border-slate-200/80 bg-white shadow-lg z-50">
                {searchSuggestions.map((v) => (
                  <button
                    key={v._id}
                    type="button"
                    onClick={() => {
                      navigate(`/vehicle/${v._id}`);
                      setSearchQuery('');
                      setShowSearchSuggestions(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 transition-colors font-semibold text-text flex items-center gap-2 cursor-pointer border-b border-slate-100 last:border-0"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                    <span className="flex-1 truncate">{v.name}</span>
                    <span className="text-[9px] text-text-muted font-normal capitalize">{v.category === 'commercial' ? 'Commercial' : v.bodyType}</span>
                  </button>
                ))}
              </div>
            )}
          </form>

          <button
            onClick={() => setShowLocationModal(true)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${isScrolled || !isHome
                ? 'text-text border-slate-200 bg-slate-50 hover:bg-slate-100'
                : 'text-white border-white/10 bg-white/5 hover:bg-white/10'
              }`}
          >
            <MapPin className="h-3.5 w-3.5 text-primary-500 animate-pulse" />
            <span>{userLocationCity}</span>
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-all hover:bg-slate-100/10 ${isScrolled || !isHome ? 'text-text hover:bg-slate-100' : 'text-white hover:bg-white/10'
                    }`}
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-2 ring-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {isNotifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-72 rounded-2xl border border-border bg-white p-4 shadow-elevated z-50 text-text"
                    >
                      <div className="flex items-center justify-between border-b border-border pb-2.5 mb-2.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-text">Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-[10px] font-bold text-primary-600 hover:underline flex items-center gap-1"
                          >
                            <Check className="h-3.5 w-3.5" /> Mark all read
                          </button>
                        )}
                      </div>

                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {notifications.length === 0 ? (
                          <p className="text-xs text-text-muted py-6 text-center">No new notifications.</p>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              onClick={() => {
                                handleMarkRead(n._id, { stopPropagation: () => { } });
                                if (n.link) navigate(n.link);
                                setIsNotifOpen(false);
                              }}
                              className={`group relative rounded-xl p-2.5 text-xs transition-colors cursor-pointer border ${n.isRead
                                  ? 'bg-white border-transparent text-text-muted'
                                  : 'bg-slate-50 border-slate-100 text-text font-semibold'
                                }`}
                            >
                              <div className="flex justify-between items-start gap-1">
                                <span className="block font-bold">{n.title}</span>
                                {!n.isRead && (
                                  <button
                                    onClick={(e) => handleMarkRead(n._id, e)}
                                    className="opacity-0 group-hover:opacity-100 text-primary-600 hover:text-primary-700 transition-opacity"
                                    title="Mark as Read"
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                              <p className="text-[10px] text-text-muted mt-1 leading-relaxed">{n.message}</p>
                              <span className="text-[9px] text-slate-400 block mt-1.5">{new Date(n.createdAt).toLocaleDateString()}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/50 ${isScrolled || !isHome ? 'text-text' : 'text-white'
                    }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="max-w-[100px] truncate">{user?.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-white py-2 shadow-[var(--shadow-elevated)] z-50"
                    >
                      {user?.role === 'customer' && (
                        <Link
                          to="/customer/wishlist"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-accent/50"
                        >
                          <Heart className="h-4 w-4" />
                          My Wishlist
                        </Link>
                      )}
                      {user?.role === 'vendor' && (
                        <>
                          <Link
                            to={dashboardPath}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-accent/50"
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                          </Link>
                          <Link
                            to="/vendor/wishlist"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-accent/50"
                          >
                            <Heart className="h-4 w-4" />
                            My Wishlist
                          </Link>
                        </>
                      )}
                      {user?.role === 'admin' && (
                        <Link
                          to={dashboardPath}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-accent/50"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                      )}
                      <hr className="my-1 border-border" />
                      <button
                        onClick={logout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant={isScrolled || !isHome ? 'ghost' : 'glass'}
                  size="sm"
                  icon={LogIn}
                >
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            className={`rounded-xl p-2 transition ${textColor} hover:bg-white/10`}
            onClick={() => setIsSearchOpen((prev) => !prev)}
            aria-label="Open search"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            className={`lg:hidden ${textColor}`}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border/50 bg-white lg:hidden"
          >
            <div className="container-vastu max py-4">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2 rounded-2xl border border-border bg-slate-50 px-3 py-2 shadow-soft">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchSuggestions(true);
                  }}
                  onFocus={() => setShowSearchSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 250)}
                  placeholder="Search vehicles..."
                  className="w-full bg-transparent text-sm text-text outline-none placeholder:text-slate-400"
                />
                <button type="submit" className="rounded-xl bg-primary-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-primary-700">
                  Go
                </button>

                {showSearchSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 max-h-60 overflow-y-auto rounded-xl border border-slate-200/80 bg-white shadow-lg z-50">
                    {searchSuggestions.map((v) => (
                      <button
                        key={v._id}
                        type="button"
                        onClick={() => {
                          navigate(`/vehicle/${v._id}`);
                          setSearchQuery('');
                          setShowSearchSuggestions(false);
                          setIsSearchOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 transition-colors font-semibold text-text flex items-center gap-2 cursor-pointer border-b border-slate-100 last:border-0"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                        <span className="flex-1 truncate">{v.name}</span>
                        <span className="text-[9px] text-text-muted font-normal capitalize">{v.category === 'commercial' ? 'Commercial' : v.bodyType}</span>
                      </button>
                    ))}
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        )}

        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border/50 bg-white lg:hidden"
          >
            <div className="container-vastu max flex flex-col gap-2 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium text-text hover:bg-accent/50"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-border" />
              {isAuthenticated ? (
                <>
                  <Link
                    to={dashboardPath}
                    className="rounded-lg px-4 py-2.5 text-sm font-medium text-text hover:bg-accent/50"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="rounded-lg px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2 px-4">
                  <Link to="/login" className="flex-1">
                    <Button variant="outline" fullWidth size="sm">Login</Button>
                  </Link>
                  <Link to="/register" className="flex-1">
                    <Button fullWidth size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>

    {/* Location Selector Modal (Rendered outside header to bypass backdrop-filter stacking context bugs) */}
    <AnimatePresence>
      {showLocationModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-sm rounded-3xl border border-border bg-white p-6 shadow-elevated text-text"
          >
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <h3 className="font-bold text-text flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary-600" />
                Select City Location
              </h3>
              <button onClick={() => setShowLocationModal(false)}>
                <X className="h-5 w-5 text-text-muted hover:text-text" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <label className="text-[10px] font-bold text-text-muted block mb-1">CITY / STATE NAME</label>
                <input
                  type="text"
                  placeholder="Search e.g. Mumbai, Maharashtra"
                  value={manualCityInput}
                  onChange={(e) => setManualCityInput(e.target.value)}
                  className="w-full rounded-xl border border-border px-3 py-2 text-xs text-text focus:outline-none focus:border-primary-500 bg-white"
                />
                {manualCityInput.trim() && (
                  <div className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto rounded-xl border border-border bg-white shadow-soft z-50 text-xs divide-y divide-slate-100">
                    {INDIAN_LOCATIONS.filter(loc => {
                      const q = manualCityInput.trim().toLowerCase();
                      return loc.toLowerCase().split(/[\s,]+/).some(w => w.startsWith(q));
                    }).map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setManualCityInput(loc);
                          handleManualLocationUpdate(loc);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors font-semibold"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button
                variant="primary"
                fullWidth
                onClick={() => handleManualLocationUpdate()}
              >
                Set Location
              </Button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-bold uppercase">or</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <Button
                variant="outline"
                fullWidth
                onClick={handleDetectLocation}
              >
                Detect My GPS Location
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
};

export default Navbar;
