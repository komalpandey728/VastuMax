import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Car, Truck, ArrowRight, ShieldCheck, Star, Zap } from 'lucide-react';
import { POPULAR_BRANDS } from '../../constants';
import { buildVehicleSearchParams } from '../../utils/searchParams';

import heroBg from '../../assets/images/hero/hero_bg.png';

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

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [activeTab, setActiveTab] = useState('buy');
  const [showLocationAutocomplete, setShowLocationAutocomplete] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = buildVehicleSearchParams({ search: searchQuery, city: location });
    navigate(`/vehicles?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Background image with dark overlay */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Hero car"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/85 to-primary-950/80" />
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      {/* Floating blobs */}
      <div className="absolute top-1/4 right-[10%] h-96 w-96 rounded-full bg-primary-600/15 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-[5%] h-64 w-64 rounded-full bg-violet-600/10 blur-[80px] pointer-events-none" />

      <div className="container-vastu max relative z-10 py-32 sm:py-40">
        <div className="mx-auto max-w-5xl">

          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-3 mb-8"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              India's Most Trusted Vehicle Marketplace
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 text-xs font-semibold text-amber-300">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 4.8★ Rated
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl"
          >
            Find Your
            <span className="block bg-gradient-to-r from-primary-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              Perfect Vehicle
            </span>
            <span className="block text-3xl sm:text-4xl lg:text-5xl text-white/80 font-bold mt-1">
              at the right price.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 text-lg text-white/65 sm:text-xl max-w-2xl"
          >
            10,000+ certified listings · Verified stock · Transparent pricing · EMI from ₹5,999/mo
          </motion.p>

          {/* Buy / Sell tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="inline-flex rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-1 mb-4"
          >
            {['buy', 'sell'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all flex items-center gap-2 ${
                  activeTab === tab
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {tab === 'buy' ? (
                  <>
                    <Car className="h-4 w-4" /> Buy a Vehicle
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" /> Sell Your Vehicle
                  </>
                )}
              </button>
            ))}
          </motion.div>

          {/* Search Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={activeTab === 'buy' ? handleSearch : (e) => { e.preventDefault(); navigate('/sell'); }}
            className="flex flex-col gap-3 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-3 sm:flex-row mb-6 shadow-2xl"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder={activeTab === 'buy' ? 'Search brand, model, or variant...' : 'Enter your car model...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border-0 bg-white/10 py-4 pl-12 pr-4 text-white placeholder:text-white/50 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-primary-400/50"
              />
            </div>
            <div className="relative sm:w-52">
              <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder="City (e.g. Mumbai)"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setShowLocationAutocomplete(true);
                }}
                onFocus={() => setShowLocationAutocomplete(true)}
                onBlur={() => setTimeout(() => setShowLocationAutocomplete(false), 200)}
                className="w-full rounded-2xl border-0 bg-white/10 py-4 pl-12 pr-4 text-white placeholder:text-white/50 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-primary-400/50"
              />
              {showLocationAutocomplete && location.trim() && (
                <div className="absolute left-0 right-0 mt-2 max-h-40 overflow-y-auto rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-md shadow-2xl z-50 text-xs divide-y divide-white/5 text-white/95">
                  {INDIAN_LOCATIONS.filter(loc => {
                    const q = location.trim().toLowerCase();
                    return loc.toLowerCase().split(/[\s,]+/).some(w => w.startsWith(q));
                  }).map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        const cityOnly = loc.split(',')[0].trim();
                        setLocation(cityOnly);
                        setShowLocationAutocomplete(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-white/10 transition-colors font-semibold"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-primary-900/50 whitespace-nowrap"
            >
              {activeTab === 'buy' ? <><Search className="h-4 w-4" /> Search</> : <><ArrowRight className="h-4 w-4" /> Sell Now</>}
            </button>
          </motion.form>

          {/* Quick category pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-2 mb-8"
          >
            <span className="text-sm text-white/40 mr-1">Browse:</span>
            {[
              { label: 'Cars', href: '/buy/cars' },
              { label: 'Commercial', href: '/buy/commercial' },
              { label: 'Electric', href: '/vehicles?fuel=Electric' },
              { label: 'SUVs', href: '/vehicles?bodyType=suv' },
              { label: 'Luxury', href: '/vehicles?bodyType=luxury' },
              { label: '2020 & Newer', href: '/vehicles?minYear=2020' },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="rounded-full bg-white/10 hover:bg-white/20 border border-white/15 px-3.5 py-1.5 text-sm text-white/80 transition-all hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </motion.div>

          {/* Popular brands */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center gap-2"
          >
            <span className="text-xs text-white/40 font-medium uppercase tracking-wider mr-1">Popular:</span>
            {POPULAR_BRANDS.slice(0, 6).map((brand) => (
              <button
                key={brand.name}
                onClick={() => navigate(`/vehicles?brand=${brand.name}`)}
                className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-white/60 transition-colors hover:bg-white/15 hover:text-white"
              >
                {brand.name}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom trust strip */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 to-transparent py-8">
        <div className="container-vastu max">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-6 text-xs text-white/50 font-medium"
          >
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> 200-Point Inspection</span>
            <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-amber-500" /> EMI in 30 mins</span>
            <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-primary-400" /> 4.8★ Rated Platform</span>
            <span className="flex items-center gap-1.5"><Car className="h-3.5 w-3.5 text-violet-400" /> 10,000+ Listings</span>
            <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-orange-400" /> Cars + Commercial</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
