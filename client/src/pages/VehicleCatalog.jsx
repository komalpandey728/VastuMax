import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Scale,
  X,
  Compass,
  Car,
  Truck,
  ChevronRight,
  Flame,
  Star,
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

const VehicleCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Read current filters from URL search params
  const searchVal = searchParams.get('search') || '';
  const brandVal = searchParams.get('brand') || '';
  const fuelVal = searchParams.get('fuel') || '';
  const transVal = searchParams.get('transmission') || '';
  const ownerVal = searchParams.get('ownership') || '';
  const cityVal = searchParams.get('city') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sortBy = searchParams.get('sort') || 'newest';
  const lat = searchParams.get('lat') || '';
  const lng = searchParams.get('lng') || '';
  const activeCategory = searchParams.get('category') || 'car';

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

  // Proximity Geolocation
  const [gpsLoading, setGpsLoading] = useState(false);

  // Comparison State
  const [comparedCars, setComparedCars] = useState([]);
  const CAR_BRANDS = ['Maruti Suzuki', 'Hyundai', 'Tata Motors', 'Mahindra', 'Toyota', 'Kia', 'Honda', 'BMW', 'Tesla', 'Skoda', 'Jeep', 'MG'];
  const CV_BRANDS = ['Tata Motors', 'Ashok Leyland', 'Mahindra', 'Eicher', 'BharatBenz', 'Force Motors'];
  const filteredBrands = brands.filter((b) => {
    const allowed = activeCategory === 'commercial' ? CV_BRANDS : CAR_BRANDS;
    return allowed.includes(b.name);
  });

  // Load filter options
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const brandRes = await getBrands();
        const cityRes = await getCities();
        setBrands(brandRes.brands || []);
        setCities(cityRes.cities || []);
      } catch {
        // fail silently
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

      const res = await getVehicles(filters);
      // ensure each vehicle has at least one usable image (try to supply a free image)
      const imageModule = await import('../utils/imageFallback');
      const processed = (res.vehicles || []).map((v) => ({
        ...v,
        images: v.images && v.images.length ? v.images : [imageModule.getFreeImage(v.brand, v.model, v.category, v._id)],
      }));
      setVehicles(processed);
      setTotal(res.total || 0);
      setPages(res.pages || 1);
      setCurrentPage(res.currentPage || 1);
    } catch {
      toast.error('Failed to load vehicle listings.');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // Load listings whenever URL search params change
  useEffect(() => {
    loadVehiclesData();
  }, [loadVehiclesData]);

  // Update a URL search parameter
  const updateParam = (key, val) => {
    const updatedParams = new URLSearchParams(searchParams);
    if (val) {
      updatedParams.set(key, val);
    } else {
      updatedParams.delete(key);
    }
    // Reset to page 1 on filter updates, but preserve when explicitly changing `page`
    if (key !== 'page') {
      updatedParams.set('page', '1');
    }
    setSearchParams(updatedParams);
  };

  const handleCategoryToggle = (category) => {
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.set('category', category);
    updatedParams.delete('bodyType');
    updatedParams.delete('brand');
    updatedParams.delete('numTyres');
    updatedParams.delete('payloadCapacity');
    updatedParams.set('page', '1');
    setSearchParams(updatedParams);
    navigate(`/buy/${category === 'commercial' ? 'commercial' : 'cars'}?${updatedParams.toString()}`);
  };

  const handleClearFilters = () => {
    const updatedParams = new URLSearchParams();
    updatedParams.set('category', activeCategory);
    setSearchParams(updatedParams);
  };

  // Browser Geolocation Proximity search
  const handleGPSProximity = () => {
    if (navigator.geolocation) {
      setGpsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          // attempt reverse geocoding using Nominatim (OpenStreetMap)
          (async () => {
            try {
              const resp = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
              );
              const json = await resp.json();
              const city = json.address?.city || json.address?.town || json.address?.village || json.address?.county || '';
              if (city) searchParams.set('city', city);
            } catch (e) {
              // ignore reverse geocode failures
            } finally {
              searchParams.set('lat', lat);
              searchParams.set('lng', lng);
              searchParams.set('maxDistance', '50'); // 50km radius
              setSearchParams(searchParams);
              setGpsLoading(false);
              toast.success('Showing nearest vehicles within 50km radius.');
            }
          })();
        },
        async () => {
          // fallback: try IP-based geolocation (less accurate but works without permission)
          try {
            const r = await fetch('https://ipapi.co/json/');
            const j = await r.json();
            const lat = j.latitude;
            const lng = j.longitude;
            const city = j.city || '';
            if (city) searchParams.set('city', city);
            if (lat && lng) {
              searchParams.set('lat', lat);
              searchParams.set('lng', lng);
              searchParams.set('maxDistance', '50');
              setSearchParams(searchParams);
              toast.success(`Detected location: ${city || 'nearby area'}`);
            } else {
              toast.error('Unable to determine location via IP.');
            }
          } catch (err) {
            toast.error('Location permission denied and IP geolocation failed.');
          } finally {
            setGpsLoading(false);
          }
        }
      );
    } else {
      toast.error('Geolocation not supported by browser.');
    }
  };

  const handleClearGPS = () => {
    searchParams.delete('lat');
    searchParams.delete('lng');
    searchParams.delete('maxDistance');
    setSearchParams(searchParams);
  };

  // Sync comparedCars with localStorage on mount
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
        const res = await getVehicles({ limit: 100 });
        const matched = (res.vehicles || []).filter((v) => ids.includes(v._id));
        setComparedCars(matched);
      } catch {
        // ignore
      }
    };
    syncCompare();
  }, []);

  // Compare listings select toggling
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

  const handleCompareGo = () => {
    const ids = comparedCars.map((c) => c._id).join(',');
    if (!ids) {
      toast.error('Select at least one vehicle to compare.');
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
      {/* ── HERO HEADER ── */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950 text-white py-12 relative overflow-hidden">
        {/* Background blob */}
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary-600/15 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-violet-600/10 blur-[80px] pointer-events-none" />

        <div className="container-vastu max relative z-10">
          {/* Category Toggle (Spinny-style) */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => handleCategoryToggle('car')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer ${activeCategory === 'car'
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
            >
              <Car className="h-4 w-4" /> Cars
            </button>
            <button
              onClick={() => handleCategoryToggle('commercial')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer ${activeCategory === 'commercial'
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-900/50'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
            >
              <Truck className="h-4 w-4" /> Commercial Vehicles
            </button>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-black tracking-tight mb-2"
          >
            {searchParams.get('category') === 'commercial' ? (
              <>Certified Commercial Vehicles</>
            ) : (
              <>Find Your Perfect Car</>
            )}
          </motion.h1>
          <p className="text-slate-400 text-sm mb-8">
            {total > 0 ? `${total} verified listings` : 'Verified listings'} · Multiple cities · Transparent pricing
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search brand, model, or variant..."
              value={searchVal}
              onChange={(e) => updateParam('search', e.target.value)}
              className="w-full rounded-2xl bg-white/10 border border-white/20 pl-12 pr-4 py-4 text-white placeholder:text-slate-400 focus:outline-none focus:bg-white/15 focus:border-primary-400 text-sm backdrop-blur-sm"
            />
            {searchVal && (
              <button onClick={() => updateParam('search', '')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Body type quick filters — Spinny-style pills */}
          {(!searchParams.get('category') || searchParams.get('category') === 'car') && (
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'All Cars', value: '' },
                { label: 'Hatchback', value: 'hatchback' },
                { label: 'Sedan', value: 'sedan' },
                { label: 'SUV', value: 'suv' },
                { label: 'MUV/MPV', value: 'muv' },
                { label: 'Luxury', value: 'luxury' },
                { label: 'Coupe', value: 'coupe' },
                { label: 'Electric', filterKey: 'fuel', filterVal: 'Electric' },
              ].map((pill) => {
                const isActive = pill.filterKey
                  ? searchParams.get(pill.filterKey) === pill.filterVal
                  : pill.value
                    ? searchParams.get('bodyType') === pill.value
                    : !searchParams.get('bodyType') && !searchParams.get('fuel');
                return (
                  <button
                    key={pill.label}
                    onClick={() => {
                      if (pill.filterKey) {
                        updateParam(pill.filterKey, pill.filterVal);
                      } else if (pill.value) {
                        updateParam('bodyType', pill.value);
                      } else {
                        handleClearFilters();
                      }
                    }}
                    className={`flex items-center gap-1.5 border text-xs font-semibold px-3.5 py-2 rounded-full transition-all ${isActive
                        ? 'bg-primary-600 border-primary-600 text-white shadow-soft'
                        : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                      }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Commercial vehicle type pills */}
          {searchParams.get('category') === 'commercial' && (
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'All CVs', value: '' },
                { label: 'Pickup', value: 'pickup' },
                { label: 'Mini Truck', value: 'mini-truck' },
                { label: 'Truck', value: 'truck' },
                { label: 'Tempo', value: 'tempo' },
                { label: 'Bus', value: 'bus' },
                { label: 'Tractor', value: 'tractor' },
              ].map((pill) => {
                const isActive = pill.value
                  ? searchParams.get('bodyType') === pill.value
                  : !searchParams.get('bodyType');
                return (
                  <button
                    key={pill.label}
                    onClick={() => {
                      if (pill.value) updateParam('bodyType', pill.value);
                      else handleClearFilters();
                    }}
                    className={`flex items-center gap-1.5 border text-xs font-semibold px-3.5 py-2 rounded-full transition-all ${isActive
                        ? 'bg-amber-500 border-amber-500 text-white shadow-soft'
                        : 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/30 text-amber-200'
                      }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="container-vastu max py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* LEFT COLUMN: FILTERS (DESKTOP) */}
          <aside className="hidden lg:block space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-text">
                <SlidersHorizontal className="h-5 w-5 text-primary-600" />
                Filters
              </h2>
              <button onClick={handleClearFilters} className="text-xs font-semibold text-primary-600 hover:underline">
                Clear All
              </button>
            </div>

            {/* GPS Proximity Section */}
            <Card className="border border-border bg-white p-4 rounded-xl shadow-soft">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">PROXIMITY SEARCH</h3>
              {lat && lng ? (
                <div className="flex items-center justify-between text-xs text-green-700 bg-green-50 p-2.5 rounded-lg border border-green-100">
                  <span className="flex items-center gap-1">
                    <Compass className="h-4 w-4 animate-spin text-green-600" /> Proximity Enabled
                  </span>
                  <button onClick={handleClearGPS} className="text-[10px] font-bold underline text-green-800">
                    Disable
                  </button>
                </div>
              ) : (
                <Button size="sm" variant="outline" icon={MapPin} isLoading={gpsLoading} onClick={handleGPSProximity} className="w-full text-xs">
                  Find Cars Near Me
                </Button>
              )}
            </Card>

            {/* Brands list */}
            <Card className="border border-border bg-white p-4 rounded-xl shadow-soft">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Brands</h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {filteredBrands.map((b) => (
                  <label key={b._id} className="flex items-center gap-2 text-xs font-medium cursor-pointer select-none">
                    <input
                      type="radio"
                      name="brandRadio"
                      checked={brandVal === b.name}
                      onChange={() => updateParam('brand', b.name)}
                      className="h-3.5 w-3.5 text-primary-600 focus:ring-primary-500/20"
                    />
                    <span>{b.name}</span>
                  </label>
                ))}
                {brandVal && (
                  <button onClick={() => updateParam('brand', '')} className="text-[10px] text-red-500 hover:underline">
                    Deselect Brand
                  </button>
                )}
              </div>
            </Card>

            {activeCategory === 'commercial' && (
              <>
                {/* Tyres Filter */}
                <Card className="border border-border bg-white p-4 rounded-xl shadow-soft">
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Number of Tyres</h3>
                  <div className="flex flex-col gap-2 text-xs">
                    {['4', '6', '10', '12', '14+'].map((tyres) => (
                      <label key={tyres} className="flex items-center gap-2 font-medium cursor-pointer">
                        <input
                          type="radio"
                          name="tyresRadio"
                          checked={searchParams.get('numTyres') === tyres}
                          onChange={() => updateParam('numTyres', tyres)}
                          className="h-3.5 w-3.5 text-primary-600"
                        />
                        <span>{tyres} Tyres</span>
                      </label>
                    ))}
                    {searchParams.get('numTyres') && (
                      <button onClick={() => updateParam('numTyres', '')} className="text-[10px] text-red-500 hover:underline self-start">
                        Clear Tyres Filter
                      </button>
                    )}
                  </div>
                </Card>

                {/* Payload Filter */}
                <Card className="border border-border bg-white p-4 rounded-xl shadow-soft">
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Payload Capacity</h3>
                  <div className="flex flex-col gap-2 text-xs">
                    {[
                      { label: 'Under 1 Ton', val: '750 kg' },
                      { label: '1 - 2 Tons', val: '1.5 Tons' },
                      { label: 'Above 2 Tons', val: '3.5 Tons' }
                    ].map((p) => (
                      <label key={p.label} className="flex items-center gap-2 font-medium cursor-pointer">
                        <input
                          type="radio"
                          name="payloadRadio"
                          checked={searchParams.get('payloadCapacity') === p.val}
                          onChange={() => updateParam('payloadCapacity', p.val)}
                          className="h-3.5 w-3.5 text-primary-600"
                        />
                        <span>{p.label}</span>
                      </label>
                    ))}
                    {searchParams.get('payloadCapacity') && (
                      <button onClick={() => updateParam('payloadCapacity', '')} className="text-[10px] text-red-500 hover:underline self-start">
                        Clear Payload Filter
                      </button>
                    )}
                  </div>
                </Card>
              </>
            )}

            {/* Budget filter */}
            <Card className="border border-border bg-white p-4 rounded-xl shadow-soft">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Price Range</h3>
              <PriceSlider
                min={0}
                max={5000000}
                initialMin={minPrice ? Number(minPrice) : undefined}
                initialMax={maxPrice ? Number(maxPrice) : undefined}
                onChange={({ min, max }) => {
                  if (min) updateParam('minPrice', min.toString());
                  else updateParam('minPrice', '');
                  if (max) updateParam('maxPrice', max.toString());
                  else updateParam('maxPrice', '');
                }}
              />
            </Card>

            {/* Transmission */}
            <Card className="border border-border bg-white p-4 rounded-xl shadow-soft">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Transmission</h3>
              <div className="flex flex-col gap-2 text-xs">
                {['Manual', 'Automatic'].map((trans) => (
                  <label key={trans} className="flex items-center gap-2 font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="transRadio"
                      checked={transVal === trans}
                      onChange={() => updateParam('transmission', trans)}
                      className="h-3.5 w-3.5 text-primary-600"
                    />
                    <span>{trans}</span>
                  </label>
                ))}
                {transVal && (
                  <button onClick={() => updateParam('transmission', '')} className="text-[10px] text-red-500 hover:underline self-start">
                    Deselect
                  </button>
                )}
              </div>
            </Card>

            {/* Fuel types */}
            <Card className="border border-border bg-white p-4 rounded-xl shadow-soft">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Fuel Type</h3>
              <div className="flex flex-col gap-2 text-xs">
                {['Petrol', 'Diesel', 'Electric', 'Hybrid'].map((fuel) => (
                  <label key={fuel} className="flex items-center gap-2 font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="fuelRadio"
                      checked={fuelVal === fuel}
                      onChange={() => updateParam('fuel', fuel)}
                      className="h-3.5 w-3.5 text-primary-600"
                    />
                    <span>{fuel}</span>
                  </label>
                ))}
                {fuelVal && (
                  <button onClick={() => updateParam('fuel', '')} className="text-[10px] text-red-500 hover:underline self-start">
                    Deselect
                  </button>
                )}
              </div>
            </Card>

            {/* Cities locations Autocomplete search */}
            <Card className="border border-border bg-white p-4 rounded-xl shadow-soft">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Showrooms City</h3>
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
                <div className="mt-2.5 flex items-center justify-between text-xs text-primary-700 bg-primary-50/70 px-2.5 py-1.5 rounded-xl border border-primary-100/50">
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

            {/* Year filter */}
            <Card className="border border-border bg-white p-4 rounded-xl shadow-soft">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Year of Manufacture</h3>
              <div className="flex flex-col gap-2 text-xs">
                {[{ label: '2023 – 2025', min: '2023' }, { label: '2021 – 2022', min: '2021', max: '2022' }, { label: '2020 & Newer', min: '2020' }].map((yr) => (
                  <button
                    key={yr.label}
                    onClick={() => {
                      updateParam('minYear', yr.min);
                      if (yr.max) updateParam('maxYear', yr.max);
                    }}
                    className={`text-left font-semibold px-3 py-2 rounded-lg border transition-all ${searchParams.get('minYear') === yr.min
                        ? 'bg-primary-50 border-primary-200 text-primary-700'
                        : 'bg-white border-border text-text hover:bg-slate-50'
                      }`}
                  >
                    {yr.label}
                  </button>
                ))}
                {searchParams.get('minYear') && (
                  <button onClick={() => { updateParam('minYear', ''); updateParam('maxYear', ''); }} className="text-[10px] text-red-500 hover:underline self-start">Clear Year</button>
                )}
              </div>
            </Card>

            {/* Ownership filter */}
            <Card className="border border-border bg-white p-4 rounded-xl shadow-soft">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Ownership</h3>
              <div className="flex flex-col gap-2 text-xs">
                {['1st Owner', '2nd Owner', '3rd Owner'].map((own) => (
                  <label key={own} className="flex items-center gap-2 font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="ownerRadio"
                      checked={ownerVal === own}
                      onChange={() => updateParam('ownership', own)}
                      className="h-3.5 w-3.5 text-primary-600"
                    />
                    <span>{own}</span>
                  </label>
                ))}
                {ownerVal && (
                  <button onClick={() => updateParam('ownership', '')} className="text-[10px] text-red-500 hover:underline self-start">Clear</button>
                )}
              </div>
            </Card>
          </aside>

          {/* RIGHT COLUMN: CATALOG RESULTS */}
          <main className="lg:col-span-3 space-y-6">

            {/* Sort & Result count bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white border border-border rounded-2xl p-4 shadow-soft">
              <div className="text-sm text-text-muted">
                Found <span className="font-bold text-text">{total}</span> verified vehicles
                {brandVal && <span> · <span className="text-primary-600 font-semibold">{brandVal}</span></span>}
                {fuelVal && <span> · <span className="text-primary-600 font-semibold">{fuelVal}</span></span>}
                {cityVal && <span> · <span className="text-primary-600 font-semibold">{cityVal}</span></span>}
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-text shadow-soft focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="year-new">Year: Newest</option>
                  <option value="year-old">Year: Oldest</option>
                  <option value="mileage-low">Mileage: Low to High</option>
                </select>

                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden flex items-center gap-1.5"
                  onClick={() => setShowMobileFilters(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </Button>
              </div>
            </div>


            {/* Active search counts details */}
            <div className="text-xs text-text-muted flex justify-between items-center bg-slate-50 p-3.5 rounded-2xl border border-border/40">
              <span>Found <span className="font-bold text-text">{total}</span> vehicles listed in database</span>
              {searchParams.toString() && (
                <button onClick={handleClearFilters} className="text-primary-600 font-semibold hover:underline">
                  Reset Filters
                </button>
              )}
            </div>

            {/* Grid listing */}
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : vehicles.length === 0 ? (
              <div className="py-20 text-center text-text-muted">
                <SlidersHorizontal className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-text">No vehicles match filters</h3>
                <p className="text-xs text-text-muted max-w-sm mx-auto mt-1">
                  Try widening your budget, selecting other transmission types, or de-selecting the proximity filters.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {vehicles.map((car) => (
                  <VehicleCard
                    key={car._id}
                    vehicle={car}
                    isCompared={!!comparedCars.find((c) => c._id === car._id)}
                    onCompareToggle={handleCompareToggle}
                    wishlistIds={user?.wishlist || []}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6 border-t border-border/60">
                {Array.from({ length: pages }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => updateParam('page', pageNum.toString())}
                      className={`h-9 w-9 rounded-xl text-xs font-semibold border transition-all ${currentPage === pageNum
                          ? 'bg-primary-600 border-primary-600 text-white'
                          : 'bg-white border-border text-text hover:bg-slate-50'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
            )}
          </main>
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
              <Scale className="h-6 w-6 text-primary-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Comparison Deck</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {comparedCars.map((car) => (
                    <span key={car._id} className="inline-flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                      {car.brand} {car.model}
                      <button onClick={() => handleCompareToggle(car)} className="text-slate-500 hover:text-red-400">
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
              <Button size="sm" variant="primary" disabled={comparedCars.length < 2} onClick={handleCompareGo} className="rounded-xl">
                Compare Cars Now ({comparedCars.length})
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
                    <Button size="xs" variant="outline" className="w-full text-red-600 border-red-200" onClick={handleClearGPS}>
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
                    {brands.map((b) => (
                      <label key={b._id} className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                        <input
                          type="radio"
                          name="mobileBrand"
                          checked={brandVal === b.name}
                          onChange={() => updateParam('brand', b.name)}
                          className="h-3.5 w-3.5 text-primary-600"
                        />
                        <span>{b.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <hr className="border-border/60" />

                {/* Price */}
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

export default VehicleCatalog;
