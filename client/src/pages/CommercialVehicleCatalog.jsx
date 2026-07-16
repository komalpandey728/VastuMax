import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  X,
  Compass,
  Car,
  Truck,
  ArrowRight,
  TrendingUp,
  Settings,
  ShieldCheck,
  User,
  Wrench,
  Navigation,
  Scale
} from 'lucide-react';
import { getVehicles } from '../services/vehicleService';
import { getBrands, getCities } from '../services/adminService';
import VehicleCard from '../components/ui/VehicleCard';
import { SkeletonCard } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import PriceSlider from '../components/ui/PriceSlider';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const CommercialVehicleCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Loading & Data
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters Metadata
  const [brands, setBrands] = useState([]);
  const [cities, setCities] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Comparison State
  const [comparedCars, setComparedCars] = useState([]);

  // URL Filters
  const searchVal = searchParams.get('search') || '';
  const brandVal = searchParams.get('brand') || '';
  const fuelVal = searchParams.get('fuel') || '';
  const bodyTypeVal = searchParams.get('bodyType') || '';
  const payloadVal = searchParams.get('payloadCapacity') || '';
  const permitVal = searchParams.get('permitType') || '';
  const cityVal = searchParams.get('city') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sortBy = searchParams.get('sort') || 'newest';
  const lat = searchParams.get('lat') || '';
  const lng = searchParams.get('lng') || '';

  const [locationSearch, setLocationSearch] = useState(cityVal);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  useEffect(() => {
    setLocationSearch(cityVal);
  }, [cityVal]);

  const handleCitySelect = (cityName) => {
    updateParam('city', cityName);
    setLocationSearch(cityName);
    setShowLocationSuggestions(false);
  };

  const CV_BRANDS = ['Tata Motors', 'Ashok Leyland', 'Mahindra', 'Eicher', 'BharatBenz', 'Force Motors', 'Piaggio'];
  const CV_CATEGORIES = [
    { label: 'Pickup', value: 'pickup' },
    { label: 'Mini Truck', value: 'mini-truck' },
    { label: 'Truck (L/M/H)', value: 'truck' },
    { label: 'Tempo Traveller', value: 'tempo' },
    { label: 'Tractor', value: 'tractor' }
  ];

  // Load filter options
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const brandRes = await getBrands();
        const cityRes = await getCities();
        const fetchedBrands = brandRes.brands || [];
        const combinedBrands = fetchedBrands.filter(b => CV_BRANDS.includes(b.name));
        setBrands(combinedBrands.length ? combinedBrands : CV_BRANDS.map((name, i) => ({ _id: `bcv_${i}`, name })));
        setCities(cityRes.cities || []);
      } catch {
        setBrands(CV_BRANDS.map((name, i) => ({ _id: `bcv_${i}`, name })));
      }
    };
    fetchMetadata();
  }, []);

  const loadVehiclesData = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {};
      searchParams.forEach((value, key) => {
        filters[key] = value;
      });
      filters.category = 'commercial';

      const res = await getVehicles(filters);
      setVehicles(res.vehicles || []);
      setTotal(res.total || 0);
      setPages(res.pages || 1);
      setCurrentPage(res.currentPage || 1);
    } catch {
      toast.error('Failed to load commercial vehicle listings.');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    loadVehiclesData();
  }, [loadVehiclesData]);

  const updateParam = (key, val) => {
    const updatedParams = new URLSearchParams(searchParams);
    if (val) {
      updatedParams.set(key, val);
    } else {
      updatedParams.delete(key);
    }
    if (key !== 'page') {
      updatedParams.set('page', '1');
    }
    setSearchParams(updatedParams);
  };

  const handleClearFilters = () => {
    const updatedParams = new URLSearchParams();
    updatedParams.set('category', 'commercial');
    setSearchParams(updatedParams);
  };

  useEffect(() => {
    const syncCompare = async () => {
      const saved = localStorage.getItem('vastu_compare_ids');
      if (!saved) return;
      const ids = saved.split(',').filter(Boolean);
      if (ids.length === 0) {
        setComparedCars([]);
        return;
      }
      try {
        const res = await getVehicles({ limit: 100, category: 'commercial' });
        const matched = (res.vehicles || []).filter((v) => ids.includes(v._id));
        setComparedCars(matched);
      } catch {}
    };
    syncCompare();
  }, []);

  const handleCompareToggle = (vehicle) => {
    let nextCompared;
    if (comparedCars.find((c) => c._id === vehicle._id)) {
      nextCompared = comparedCars.filter((c) => c._id !== vehicle._id);
    } else {
      if (comparedCars.length >= 4) {
        toast.error('You can compare a maximum of 4 vehicles.');
        return;
      }
      nextCompared = [...comparedCars, vehicle];
    }
    setComparedCars(nextCompared);
    localStorage.setItem('vastu_compare_ids', nextCompared.map((c) => c._id).join(','));
  };

  const handleGPSProximity = () => {
    if (navigator.geolocation) {
      setGpsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          searchParams.set('lat', lat);
          searchParams.set('lng', lng);
          searchParams.set('maxDistance', '50');
          setSearchParams(searchParams);
          setGpsLoading(false);
          toast.success('Showing nearest commercial vehicles within 50km.');
        },
        () => {
          setGpsLoading(false);
          toast.error('Location permission denied.');
        }
      );
    }
  };

  const handleCompareGo = () => {
    const ids = comparedCars.map((c) => c._id).join(',');
    if (!ids) {
      toast.error('Select at least one commercial vehicle to compare.');
      return;
    }
    navigate(`/compare?ids=${ids}`);
  };

  const handleClearCompare = () => {
    setComparedCars([]);
    localStorage.removeItem('vastu_compare_ids');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-orange-600/10 blur-[80px] pointer-events-none" />

        <div className="container-vastu max relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <Link
              to="/buy/cars"
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm bg-white/10 text-white/70 hover:bg-white/20 transition-all"
            >
              <Car className="h-4 w-4" /> Cars Catalog
            </Link>
            <button
              disabled
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm bg-amber-500 text-white shadow-lg shadow-amber-950/40 cursor-default"
            >
              <Truck className="h-4 w-4" /> Commercial Hub
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
            Certified Commercial Fleet
          </h1>
          <p className="text-slate-400 text-sm mb-8">
            Browse verified pickups, mini-trucks, heavy duty tippers, and school buses. Fully inspected with permit history.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Tata Ace, Mahindra Pickup, Ashok Leyland..."
              value={searchVal}
              onChange={(e) => updateParam('search', e.target.value)}
              className="w-full rounded-2xl bg-white/10 border border-white/20 pl-12 pr-4 py-4 text-white placeholder:text-slate-400 focus:outline-none focus:bg-white/15 focus:border-amber-400 text-sm backdrop-blur-sm"
            />
            {searchVal && (
              <button onClick={() => updateParam('search', '')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Categories Grid strip */}
          <div className="mb-4">
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-3">CV BODY STYLES</p>
            <div className="flex flex-wrap gap-2.5">
              {CV_CATEGORIES.map((cat) => {
                const isActive = bodyTypeVal === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => updateParam('bodyType', isActive ? '' : cat.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 border-amber-500 text-white shadow-soft'
                        : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Brands strip */}
      <section className="bg-white border-b border-border py-4">
        <div className="container-vastu max flex overflow-x-auto gap-4 scrollbar-none items-center">
          <span className="text-xs font-black text-text-muted shrink-0 uppercase tracking-wider">POPULAR CV MAKE:</span>
          {CV_BRANDS.map((brandName) => {
            const isActive = brandVal === brandName;
            return (
              <button
                key={brandName}
                onClick={() => updateParam('brand', isActive ? '' : brandName)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-600 border-amber-600 text-white'
                    : 'bg-slate-50 border-slate-200 text-text-muted hover:border-slate-300'
                }`}
              >
                {brandName}
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Browse Columns */}
      <div className="container-vastu max py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="flex items-center gap-2 text-base font-bold text-text">
                <SlidersHorizontal className="h-4.5 w-4.5 text-amber-600" /> Filter Options
              </h2>
              <button onClick={handleClearFilters} className="text-xs font-bold text-amber-600 hover:underline">
                Reset
              </button>
            </div>

            {/* GPS Proximity */}
            <Card className="p-4 border border-border bg-white rounded-xl shadow-soft">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">GPS Location Radius</h3>
              {lat && lng ? (
                <div className="flex items-center justify-between text-xs text-green-700 bg-green-50 p-2.5 rounded-lg border border-green-100">
                  <span className="flex items-center gap-1">
                    <Compass className="h-3.5 w-3.5 animate-spin text-green-600" /> Active in 50km
                  </span>
                  <button
                    onClick={() => {
                      searchParams.delete('lat');
                      searchParams.delete('lng');
                      searchParams.delete('maxDistance');
                      setSearchParams(searchParams);
                    }}
                    className="text-[10px] font-bold underline text-green-800"
                  >
                    Disable
                  </button>
                </div>
              ) : (
                <Button size="sm" variant="outline" icon={MapPin} isLoading={gpsLoading} onClick={handleGPSProximity} className="w-full text-xs hover:bg-amber-50">
                  Search Near Me
                </Button>
              )}
            </Card>

            {/* RTO Registered City (Repositioned to top to prevent clipping) */}
            <Card className="p-4 border border-border bg-white rounded-xl shadow-soft relative z-30">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">RTO Registered City</h3>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
                <input
                  type="text"
                  value={locationSearch}
                  onChange={(e) => {
                    setLocationSearch(e.target.value);
                    setShowLocationSuggestions(true);
                  }}
                  onFocus={() => setShowLocationSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                  placeholder="Type RTO city name..."
                  className="w-full rounded-xl border border-border bg-slate-50 py-2 pl-9 pr-4 text-xs font-semibold focus:bg-white focus:outline-none transition-all"
                />
                
                {showLocationSuggestions && (
                  <div className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto rounded-xl border border-border bg-white shadow-lg z-30">
                    {cities.filter(c => !locationSearch || c.name.toLowerCase().startsWith(locationSearch.toLowerCase())).length === 0 ? (
                      <div className="p-2.5 text-center text-text-muted text-[10px]">No cities match</div>
                    ) : (
                      cities
                        .filter(c => !locationSearch || c.name.toLowerCase().startsWith(locationSearch.toLowerCase()))
                        .map((city) => (
                          <button
                            key={city._id}
                            type="button"
                            onClick={() => handleCitySelect(city.name)}
                            className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 transition-colors font-semibold text-text flex justify-between cursor-pointer"
                          >
                            <span>{city.name}</span>
                            <span className="text-[10px] text-text-muted font-normal">{city.state}</span>
                          </button>
                        ))
                    )}
                  </div>
                )}
              </div>

              {cityVal && (
                <div className="mt-2.5 flex items-center justify-between text-xs text-amber-800 bg-amber-50/70 px-2.5 py-1.5 rounded-xl border border-amber-100/50">
                  <span className="font-semibold">Filtered by: {cityVal}</span>
                  <button
                    type="button"
                    onClick={() => {
                      updateParam('city', '');
                      setLocationSearch('');
                    }}
                    className="text-[10px] text-red-500 font-bold hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              )}
            </Card>

            {/* Payload Filter */}
            <Card className="p-4 border border-border bg-white rounded-xl shadow-soft">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Payload / Load Capacity</h3>
              <div className="flex flex-col gap-2 text-xs">
                {[
                  { label: 'Under 1 Ton', val: 'under_1' },
                  { label: '1 - 5 Tons', val: '1_5' },
                  { label: 'Above 5 Tons', val: 'above_5' }
                ].map((p) => (
                  <label key={p.label} className="flex items-center gap-2 font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="payloadRadio"
                      checked={payloadVal === p.val}
                      onChange={() => updateParam('payloadCapacity', p.val)}
                      className="h-3.5 w-3.5 text-amber-600 focus:ring-amber-500/20"
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
                {payloadVal && (
                  <button onClick={() => updateParam('payloadCapacity', '')} className="text-[10px] text-red-500 hover:underline self-start">
                    Clear payload filter
                  </button>
                )}
              </div>
            </Card>

            {/* Permit Type */}
            <Card className="p-4 border border-border bg-white rounded-xl shadow-soft">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">RTO Permit Type</h3>
              <div className="flex flex-col gap-2 text-xs">
                {['National Permit', 'State Permit'].map((permit) => (
                  <label key={permit} className="flex items-center gap-2 font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="permitRadio"
                      checked={permitVal === permit}
                      onChange={() => updateParam('permitType', permit)}
                      className="h-3.5 w-3.5 text-amber-600 focus:ring-amber-500/20"
                    />
                    <span>{permit}</span>
                  </label>
                ))}
                {permitVal && (
                  <button onClick={() => updateParam('permitType', '')} className="text-[10px] text-red-500 hover:underline self-start">
                    Clear permit filter
                  </button>
                )}
              </div>
            </Card>

            {/* Budget filter */}
            <Card className="p-4 border border-border bg-white rounded-xl shadow-soft">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Price Range</h3>
              <PriceSlider
                min={200000}
                max={5000000}
                initialMin={minPrice ? Number(minPrice) : undefined}
                initialMax={maxPrice ? Number(maxPrice) : undefined}
                onChange={({ min, max }) => {
                  updateParam('minPrice', min ? min.toString() : '');
                  updateParam('maxPrice', max ? max.toString() : '');
                }}
              />
            </Card>

            {/* Fuel Type */}
            <Card className="p-4 border border-border bg-white rounded-xl shadow-soft">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Fuel Option</h3>
              <div className="flex flex-col gap-2 text-xs">
                {['Diesel', 'CNG', 'Electric'].map((f) => (
                  <label key={f} className="flex items-center gap-2 font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="cvFuelRadio"
                      checked={fuelVal === f}
                      onChange={() => updateParam('fuel', f)}
                      className="h-3.5 w-3.5 text-amber-600 focus:ring-amber-500/20"
                    />
                    <span>{f}</span>
                  </label>
                ))}
                {fuelVal && (
                  <button onClick={() => updateParam('fuel', '')} className="text-[10px] text-red-500 hover:underline self-start">
                    Deselect fuel
                  </button>
                )}
              </div>
            </Card>
          </aside>

          {/* Listings Hub Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header controls & Sort */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 border border-border rounded-2xl shadow-soft">
              <div className="text-xs text-text-muted font-bold uppercase tracking-wider">
                Showing {vehicles.length} of {total} Commercial Trucks
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="rounded-xl border border-border bg-slate-50 px-3 py-2 text-xs font-semibold text-text outline-none focus:border-amber-500"
                >
                  <option value="newest">Newest Listed</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="km_asc">Kms: Low to High</option>
                  <option value="year_desc">Model Year: Newest</option>
                </select>
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-border bg-slate-50 px-3.5 py-2 text-xs font-semibold text-text lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </button>
              </div>
            </div>

            {/* Active Filters list */}
            {(brandVal || payloadVal || permitVal || fuelVal || cityVal) && (
              <div className="flex flex-wrap gap-2 items-center text-xs">
                <span className="font-bold text-text-muted">Active:</span>
                {brandVal && (
                  <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
                    Make: {brandVal} <X className="h-3 w-3 cursor-pointer" onClick={() => updateParam('brand', '')} />
                  </span>
                )}
                {payloadVal && (
                  <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
                    Payload: {payloadVal === 'under_1' ? 'Under 1 Ton' : payloadVal === '1_5' ? '1 - 5 Tons' : payloadVal === 'above_5' ? 'Above 5 Tons' : payloadVal} <X className="h-3 w-3 cursor-pointer" onClick={() => updateParam('payloadCapacity', '')} />
                  </span>
                )}
                {permitVal && (
                  <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
                    Permit: {permitVal} <X className="h-3 w-3 cursor-pointer" onClick={() => updateParam('permitType', '')} />
                  </span>
                )}
                {fuelVal && (
                  <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
                    Fuel: {fuelVal} <X className="h-3 w-3 cursor-pointer" onClick={() => updateParam('fuel', '')} />
                  </span>
                )}
                {cityVal && (
                  <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
                    RTO: {cityVal} <X className="h-3 w-3 cursor-pointer" onClick={() => updateParam('city', '')} />
                  </span>
                )}
                <button onClick={handleClearFilters} className="text-[10px] font-bold text-red-500 hover:underline uppercase ml-2">
                  Clear all
                </button>
              </div>
            )}

            {/* Inventory Grid */}
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : vehicles.length === 0 ? (
              <Card className="flex flex-col items-center justify-center p-12 text-center text-text-muted bg-white border border-border rounded-3xl shadow-soft">
                <Truck className="h-16 w-16 text-slate-300 mb-4 animate-bounce" />
                <h3 className="text-lg font-bold text-text mb-1">No Commercial Vehicles Found</h3>
                <p className="text-xs text-text-muted max-w-sm mb-6">
                  We don't have active listings matching those specific load, permit, or tyre requirements. Adjust filters to search our full catalog.
                </p>
                <Button onClick={handleClearFilters}>Show Full CV Inventory</Button>
              </Card>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {vehicles.map((cv) => (
                  <VehicleCard
                    key={cv._id}
                    vehicle={cv}
                    onCompareToggle={handleCompareToggle}
                    isCompared={Boolean(comparedCars.find((c) => c._id === cv._id))}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FLOATING ACTION BOTTOM DRAWER FOR COMPARISON LIST */}
      <AnimatePresence>
        {comparedCars.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 w-[90vw] max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-elevated text-white flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md bg-opacity-95"
          >
            <div className="flex items-center gap-3">
              <Scale className="h-6 w-6 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">CV Comparison Deck</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {comparedCars.map((car) => (
                    <span key={car._id} className="inline-flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                      {car.brand} {car.model}
                      <button onClick={() => handleCompareToggle(car)} className="text-slate-500 hover:text-red-400 font-bold ml-1">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="secondary" className="bg-slate-800 hover:bg-slate-700 text-white border-slate-700 rounded-xl" onClick={handleClearCompare}>
                Clear
              </Button>
              <Button size="sm" variant="primary" disabled={comparedCars.length < 2} onClick={handleCompareGo} className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl border-0">
                Compare Fleet Now ({comparedCars.length})
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE FILTERS DRAWER */}
      <AnimatePresence>
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                <h3 className="font-bold text-text">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)}>
                  <X className="h-5 w-5 text-text-muted" />
                </button>
              </div>

              {/* Mobile Filter panels */}
              <div className="flex-1 space-y-5">
                {/* Proximity */}
                <Card className="p-3 bg-slate-50 border-0 rounded-xl">
                  <h4 className="text-xs font-bold text-text mb-2">PROXIMITY RADIAN</h4>
                  {lat && lng ? (
                    <Button size="xs" variant="outline" className="w-full text-red-600 border-red-200" onClick={() => {
                      searchParams.delete('lat');
                      searchParams.delete('lng');
                      searchParams.delete('maxDistance');
                      setSearchParams(searchParams);
                    }}>
                      Clear Proximity Filter
                    </Button>
                  ) : (
                    <Button size="xs" variant="primary" onClick={handleGPSProximity}>
                      Filter Within 50km
                    </Button>
                  )}
                </Card>

                {/* Brands */}
                <div>
                  <h4 className="text-xs font-bold text-text-muted mb-2 uppercase">Brand</h4>
                  <div className="flex flex-col gap-2">
                    {CV_BRANDS.map((brandName) => (
                      <label key={brandName} className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                        <input
                          type="radio"
                          name="mobileBrand"
                          checked={brandVal === brandName}
                          onChange={() => updateParam('brand', brandName)}
                          className="h-3.5 w-3.5 text-amber-600"
                        />
                        <span>{brandName}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <hr className="border-border/60" />

                {/* Budget */}
                <div>
                  <h4 className="text-xs font-bold text-text-muted mb-2 uppercase">Budget</h4>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => updateParam('minPrice', e.target.value)}
                      className="w-1/2 rounded-lg border border-border px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => updateParam('maxPrice', e.target.value)}
                      className="w-1/2 rounded-lg border border-border px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex gap-2">
                <Button variant="outline" className="w-1/2 text-xs py-2" onClick={handleClearFilters}>
                  Reset All
                </Button>
                <Button variant="primary" className="w-1/2 text-xs py-2" onClick={() => setShowMobileFilters(false)}>
                  Apply
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommercialVehicleCatalog;
