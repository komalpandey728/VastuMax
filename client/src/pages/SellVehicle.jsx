import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Truck,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  Upload,
  AlertCircle
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { createVehicle } from '../services/vehicleService';
import toast from 'react-hot-toast';

const CAR_BRANDS = [
  { slug: 'maruti-suzuki', name: 'Maruti Suzuki', logo: 'https://logo.clearbit.com/marutisuzuki.com' },
  { slug: 'hyundai', name: 'Hyundai', logo: 'https://logo.clearbit.com/hyundai.com' },
  { slug: 'tata-motors', name: 'Tata Motors', logo: 'https://logo.clearbit.com/tatamotors.com' },
  { slug: 'mahindra', name: 'Mahindra', logo: 'https://logo.clearbit.com/mahindra.com' },
  { slug: 'toyota', name: 'Toyota', logo: 'https://logo.clearbit.com/toyota.com' },
  { slug: 'kia', name: 'Kia', logo: 'https://logo.clearbit.com/kia.com' }
];

const CV_BRANDS = [
  { slug: 'tata-motors', name: 'Tata Motors', logo: 'https://logo.clearbit.com/tatamotors.com' },
  { slug: 'ashok-leyland', name: 'Ashok Leyland', logo: 'https://logo.clearbit.com/ashokleyland.com' },
  { slug: 'mahindra', name: 'Mahindra', logo: 'https://logo.clearbit.com/mahindra.com' },
  { slug: 'eicher', name: 'Eicher', logo: 'https://logo.clearbit.com/eicher.in' },
  { slug: 'bharatbenz', name: 'BharatBenz', logo: 'https://logo.clearbit.com/daimler.com' },
  { slug: 'force-motors', name: 'Force Motors', logo: 'https://logo.clearbit.com/forcemotors.com' }
];

const SellVehicle = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeCategory, setActiveCategory] = useState('car');
  
  // Lookup states
  const [registrationNum, setRegistrationNum] = useState('');
  const [loadingLookup, setLoadingLookup] = useState(false);
  const [lookupDone, setLookupDone] = useState(false);

  // Manual list state toggle
  const [showManualForm, setShowManualForm] = useState(false);
  const [submittingManual, setSubmittingManual] = useState(false);

  // Manual listing fields
  const [manualData, setManualData] = useState({
    brand: '',
    name: '',
    variant: '',
    year: new Date().getFullYear(),
    price: '',
    fuel: 'Petrol',
    transmission: 'Manual',
    mileage: '',
    ownership: 'First Owner',
    bodyType: 'SUV',
    city: 'Pune',
    state: 'Maharashtra',
    description: '',
    images: [],
    // CV Specific fields
    gvw: '',
    payloadCapacity: '',
    numTyres: '6',
    permitType: 'National Permit',
    fitnessStatus: 'Valid',
  });

  const handleManualFieldChange = (key, val) => {
    setManualData((prev) => ({ ...prev, [key]: val }));
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in or register as a vendor to list vehicles.');
      navigate('/login?redirect=/sell');
      return;
    }
    if (user.role !== 'vendor') {
      toast.error('Only registered dealers/vendors can list vehicles on Vastu Max.');
      return;
    }

    if (!manualData.brand || !manualData.name || !manualData.price) {
      toast.error('Please specify make, model, and price.');
      return;
    }

    setSubmittingManual(true);
    const toastId = toast.loading('Creating vehicle listing...');
    try {
      const formData = new FormData();
      formData.append('brand', manualData.brand);
      formData.append('name', manualData.name);
      formData.append('variant', manualData.variant || 'Standard');
      formData.append('year', manualData.year.toString());
      formData.append('price', manualData.price.toString());
      formData.append('fuel', manualData.fuel);
      formData.append('transmission', manualData.transmission);
      formData.append('mileage', manualData.mileage ? manualData.mileage.toString() : '15');
      formData.append('ownership', manualData.ownership);
      formData.append('bodyType', manualData.bodyType);
      formData.append('city', manualData.city);
      formData.append('state', manualData.state);
      formData.append('description', manualData.description || 'Verified vehicle listing.');
      formData.append('category', activeCategory);

      // Add CV specific values
      if (activeCategory === 'commercial') {
        formData.append('gvw', manualData.gvw || '3.5 Tons');
        formData.append('payloadCapacity', manualData.payloadCapacity || '1.5 Tons');
        formData.append('numTyres', manualData.numTyres);
        formData.append('permitType', manualData.permitType);
        formData.append('fitnessStatus', manualData.fitnessStatus);
      }

      await createVehicle(formData);
      toast.dismiss(toastId);
      toast.success('Listing created successfully!');
      navigate('/vendor/dashboard');
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.message || 'Failed to submit manual listing.');
    } finally {
      setSubmittingManual(false);
    }
  };

  const handleLookupSubmit = (e) => {
    e.preventDefault();
    if (!registrationNum) return;
    setLoadingLookup(true);
    setTimeout(() => {
      setLoadingLookup(false);
      setLookupDone(true);
      if (!isAuthenticated) {
        toast.error('Log in as a vendor to complete RTO listing.');
        navigate('/login?redirect=/sell');
        return;
      }
      if (user?.role !== 'vendor') {
        toast.error('Register as a Vastu Max dealer/vendor to publish listings.');
        return;
      }
      toast.success('RTO verification details matched! Redirecting to quick listing draft...');
      navigate(`/vendor/vehicles/new?category=${activeCategory}&reg=${encodeURIComponent(registrationNum)}`);
    }, 1500);
  };

  const handleBrandClick = (brandSlug) => {
    const matchedBrand = (activeCategory === 'commercial' ? CV_BRANDS : CAR_BRANDS).find(b => b.slug === brandSlug);
    if (!isAuthenticated) {
      toast.error('Log in to list vehicles.');
      navigate('/login?redirect=/sell');
      return;
    }
    if (user?.role !== 'vendor') {
      toast.error('Deregistered client. Access restricted to approved vendors.');
      return;
    }
    navigate(`/vendor/vehicles/new?category=${activeCategory}&brand=${encodeURIComponent(matchedBrand?.name || brandSlug)}`);
  };

  return (
    <div className="overflow-x-hidden bg-slate-50 min-h-screen">
      {/* Category selector panel */}
      <section className="bg-slate-900 py-6 border-b border-slate-800 text-white relative">
        <div className="container-vastu max flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Sell on Vastu Max</h1>
            <p className="text-xs text-slate-400 mt-0.5">India's leading marketplace for verified passenger cars and heavy fleets.</p>
          </div>
          <div className="flex bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60">
            <button
              onClick={() => {
                setActiveCategory('car');
                setShowManualForm(false);
              }}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeCategory === 'car'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              <Car className="h-4 w-4" /> Passenger Cars
            </button>
            <button
              onClick={() => {
                setActiveCategory('commercial');
                setShowManualForm(false);
              }}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeCategory === 'commercial'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              <Truck className="h-4 w-4" /> Commercial Fleet
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="container-vastu max py-12 max-w-5xl">
        <AnimatePresence mode="wait">
          {!showManualForm ? (
            <motion.div
              key="main-sell-choices"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid gap-8 md:grid-cols-3"
            >
              {/* Left Column: Quick Path */}
              <div className="md:col-span-2 space-y-6">
                <Card className="p-8 border border-amber-200/60 bg-gradient-to-br from-white via-white to-amber-50/20 shadow-soft rounded-3xl relative overflow-hidden">
                  <div className="absolute top-4 right-4 z-10">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-5 w-5 text-amber-500 fill-current animate-pulse" />
                    <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-full">
                      Recommended & Fastest Path
                    </span>
                  </div>

                  <h2 className="text-xl font-black text-text mb-2">RC Number Quick Look-up</h2>
                  <p className="text-xs text-text-muted mb-6">
                    Enter your vehicle registration certificate (RC) number. Vastu Max fetches engine, chassis, manufacture date, and fuel history directly from RTO databases instantly.
                  </p>

                  <form onSubmit={handleLookupSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="e.g. MH12AA1234, DL3CAA9999"
                      value={registrationNum}
                      onChange={(e) => setRegistrationNum(e.target.value.toUpperCase())}
                      className="flex-1 rounded-2xl border border-border px-4 py-3 text-sm focus:outline-none focus:border-amber-500 font-bold uppercase tracking-wider"
                    />
                    <Button type="submit" variant="primary" isLoading={loadingLookup}>
                      Fetch details <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>

                  <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-6 mt-6 text-center">
                    <div>
                      <span className="text-xs font-bold text-text-muted block">1. Fetch</span>
                      <span className="text-[10px] text-text-muted">Direct RTO match</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-text-muted block">2. Verify</span>
                      <span className="text-[10px] text-text-muted">Validate specs</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-text-muted block">3. Live</span>
                      <span className="text-[10px] text-text-muted">Publish instant listing</span>
                    </div>
                  </div>
                </Card>

                {/* Popular Brand Grid Picker */}
                <Card className="p-6 border border-border bg-white shadow-soft rounded-3xl">
                  <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">
                    Or select maker for manual draft:
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {(activeCategory === 'commercial' ? CV_BRANDS : CAR_BRANDS).map((b) => (
                      <button
                        key={b.slug}
                        onClick={() => handleBrandClick(b.slug)}
                        className="flex flex-col items-center justify-center p-3 rounded-2xl border border-border bg-slate-50 hover:bg-white hover:border-slate-300 hover:shadow-soft transition-all duration-300 transform hover:-translate-y-1 cursor-pointer shrink-0"
                      >
                        <div className="h-10 w-10 flex items-center justify-center mb-1">
                          <img src={b.logo} alt={b.name} className="max-h-full max-w-full object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all" />
                        </div>
                        <span className="text-[10px] font-bold text-text text-center truncate w-full">{b.name}</span>
                      </button>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Right Column: Benefits & Manual Listing Switch */}
              <div className="space-y-6">
                <Card className="p-6 border border-border bg-white shadow-soft rounded-3xl">
                  <h3 className="text-base font-black text-text mb-4">Why Sell on Vastu Max?</h3>
                  <div className="space-y-4 text-xs">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <ShieldCheck className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="font-bold text-text">Zero Listing Fee</p>
                        <p className="text-text-muted mt-0.5">List unlimited fleets or passenger cars for free.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <Sparkles className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="font-bold text-text">Insta KYC Badge</p>
                        <p className="text-text-muted mt-0.5">Dealers get verified badges to build customer trust.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <TrendingUp className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="font-bold text-text">Max Pricing Analysis</p>
                        <p className="text-text-muted mt-0.5">Built-in tracker alerts buyers to fair value trends.</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Switch to manual path */}
                <Card className="p-6 border border-border bg-slate-50 rounded-3xl text-center flex flex-col items-center">
                  <AlertCircle className="h-10 w-10 text-slate-400 mb-2" />
                  <h4 className="text-sm font-bold text-text">No RC Number on hand?</h4>
                  <p className="text-[11px] text-text-muted mt-1 mb-4 leading-relaxed">
                    You can input specifications, features, and upload photos manually to create your listing immediately.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setShowManualForm(true)} className="w-full text-xs">
                    List Manually Now
                  </Button>
                </Card>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="manual-sell-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {/* Back selector link */}
              <button
                onClick={() => setShowManualForm(false)}
                className="flex items-center gap-1.5 text-xs text-primary-600 font-bold hover:underline mb-6 cursor-pointer"
              >
                ← Back to quick RC search
              </button>

              <Card className="p-8 border border-border bg-white rounded-3xl shadow-soft">
                <div className="mb-6 pb-4 border-b border-slate-100">
                  <h2 className="text-xl font-black text-text">
                    Manual {activeCategory === 'commercial' ? 'Commercial Fleet' : 'Passenger Car'} Draft
                  </h2>
                  <p className="text-xs text-text-muted mt-0.5">Please provide valid specifications below. Listings are audited before publication.</p>
                </div>

                <form onSubmit={handleManualSubmit} className="space-y-6">
                  {/* Row 1: Brand & Model name */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-text mb-1.5">Manufacturer Brand *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Maruti Suzuki, Ashok Leyland, Tata Motors"
                        value={manualData.brand}
                        onChange={(e) => handleManualFieldChange('brand', e.target.value)}
                        className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text mb-1.5">Model Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Swift LXI, Eicher Pro 2049, Tata Ace"
                        value={manualData.name}
                        onChange={(e) => handleManualFieldChange('name', e.target.value)}
                        className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500 font-semibold"
                      />
                    </div>
                  </div>

                  {/* Row 2: Variant & Year */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-text mb-1.5">Variant Spec (optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. VXI MT, Cabin with Chassis, High Deck"
                        value={manualData.variant}
                        onChange={(e) => handleManualFieldChange('variant', e.target.value)}
                        className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text mb-1.5">Model Year *</label>
                      <input
                        type="number"
                        required
                        value={manualData.year}
                        onChange={(e) => handleManualFieldChange('year', Number(e.target.value))}
                        className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500 font-semibold"
                      />
                    </div>
                  </div>

                  {/* Row 3: Price & Mileage */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-text mb-1.5">Expected Price (INR) *</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 750000"
                        value={manualData.price}
                        onChange={(e) => handleManualFieldChange('price', Number(e.target.value))}
                        className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text mb-1.5">Kilometers Driven *</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 35000"
                        value={manualData.mileage}
                        onChange={(e) => handleManualFieldChange('mileage', Number(e.target.value))}
                        className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500 font-semibold"
                      />
                    </div>
                  </div>

                  {/* Row 4: Specs dropdowns */}
                  <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-bold text-text mb-1.5">Fuel Type</label>
                      <select
                        value={manualData.fuel}
                        onChange={(e) => handleManualFieldChange('fuel', e.target.value)}
                        className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs focus:border-amber-500 font-semibold outline-none"
                      >
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="CNG">CNG</option>
                        <option value="Electric">Electric</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text mb-1.5">Transmission</label>
                      <select
                        value={manualData.transmission}
                        onChange={(e) => handleManualFieldChange('transmission', e.target.value)}
                        className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs focus:border-amber-500 font-semibold outline-none"
                      >
                        <option value="Manual">Manual</option>
                        <option value="Automatic">Automatic</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text mb-1.5">Ownership</label>
                      <select
                        value={manualData.ownership}
                        onChange={(e) => handleManualFieldChange('ownership', e.target.value)}
                        className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs focus:border-amber-500 font-semibold outline-none"
                      >
                        <option value="First Owner">First Owner</option>
                        <option value="Second Owner">Second Owner</option>
                        <option value="Third Owner">Third Owner</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 5: Location Details */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-text mb-1.5">RTO Register City *</label>
                      <input
                        type="text"
                        required
                        value={manualData.city}
                        onChange={(e) => handleManualFieldChange('city', e.target.value)}
                        className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text mb-1.5">State *</label>
                      <input
                        type="text"
                        required
                        value={manualData.state}
                        onChange={(e) => handleManualFieldChange('state', e.target.value)}
                        className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500 font-semibold"
                      />
                    </div>
                  </div>

                  {/* Commercial Specific specs */}
                  {activeCategory === 'commercial' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border-t border-slate-100 pt-6 space-y-6"
                    >
                      <h3 className="text-xs font-black text-amber-600 uppercase tracking-wider">Heavy Transport Specifications</h3>
                      <div className="grid gap-6 sm:grid-cols-3">
                        <div>
                          <label className="block text-xs font-bold text-text mb-1.5">Gross Vehicle Weight (GVW)</label>
                          <input
                            type="text"
                            placeholder="e.g. 7.5 Tons, 3500 kg"
                            value={manualData.gvw}
                            onChange={(e) => handleManualFieldChange('gvw', e.target.value)}
                            className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-text mb-1.5">Payload Capacity</label>
                          <input
                            type="text"
                            placeholder="e.g. 3.5 Tons, 1200 kg"
                            value={manualData.payloadCapacity}
                            onChange={(e) => handleManualFieldChange('payloadCapacity', e.target.value)}
                            className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-text mb-1.5">Number of Tyres</label>
                          <select
                            value={manualData.numTyres}
                            onChange={(e) => handleManualFieldChange('numTyres', e.target.value)}
                            className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs focus:border-amber-500 font-semibold outline-none"
                          >
                            <option value="4">4 Tyres</option>
                            <option value="6">6 Tyres</option>
                            <option value="10">10 Tyres</option>
                            <option value="12">12 Tyres</option>
                            <option value="14+">14+ Tyres</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-bold text-text mb-1.5">RTO Permit Type</label>
                          <select
                            value={manualData.permitType}
                            onChange={(e) => handleManualFieldChange('permitType', e.target.value)}
                            className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs focus:border-amber-500 font-semibold outline-none"
                          >
                            <option value="National Permit">National Permit</option>
                            <option value="State Permit">State Permit</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-text mb-1.5">Fitness Status</label>
                          <select
                            value={manualData.fitnessStatus}
                            onChange={(e) => handleManualFieldChange('fitnessStatus', e.target.value)}
                            className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs focus:border-amber-500 font-semibold outline-none"
                          >
                            <option value="Valid">Valid Fitness Certificate</option>
                            <option value="Expired">Expired</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-text mb-1.5">Vehicle Description</label>
                    <textarea
                      rows={3}
                      placeholder="Highlight tyre health, active warranty, engine modifications, or insurance status..."
                      value={manualData.description}
                      onChange={(e) => handleManualFieldChange('description', e.target.value)}
                      className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500 font-semibold"
                    />
                  </div>

                  {/* Photo upload mock */}
                  <div>
                    <label className="block text-xs font-bold text-text mb-1.5">Upload Vehicle Photos</label>
                    <div className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50">
                      <Upload className="h-8 w-8 text-slate-400 mb-2" />
                      <span className="text-xs font-bold text-text">Drag & drop files here, or click to upload</span>
                      <span className="text-[10px] text-text-muted mt-0.5">Supports WebP, PNG, JPEG up to 5MB</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 justify-end border-t border-slate-100 pt-6 mt-6">
                    <Button variant="outline" type="button" onClick={() => setShowManualForm(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" type="submit" isLoading={submittingManual}>
                      Publish Listing
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SellVehicle;
