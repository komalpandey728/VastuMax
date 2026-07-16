import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, Trash2, ArrowLeft, Plus, Star, Trophy, TrendingUp } from 'lucide-react';
import { getVehicle } from '../services/vehicleService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

// ─── Vastu Max Score Engine ────────────────────────────────────────────────────────
// Produces a score from 1–10 based on multiple vehicle factors
const computeVastuScore = (vehicle, allVehicles) => {
  if (!vehicle) return 5;

  let score = 5.0;

  // Price factor (cheaper relative to others = better)
  const prices = allVehicles.map((v) => v.price || 0).filter(Boolean);
  if (prices.length > 1) {
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const range = maxPrice - minPrice || 1;
    const priceScore = 1 - (vehicle.price - minPrice) / range; // 0 = most expensive, 1 = cheapest
    score += priceScore * 1.5;
  }

  // Year factor (newer = better) — vehicles above 2020 get bonus
  const currentYear = new Date().getFullYear();
  const yearScore = Math.min(1, (vehicle.year - 2015) / (currentYear - 2015));
  score += yearScore * 1.5;

  // Mileage factor (lower km driven = better)
  const kmValues = allVehicles.map((v) => v.kmDriven || v.specifications?.bootSpace || 0).filter(Boolean);
  if (vehicle.kmDriven !== undefined) {
    const maxKm = Math.max(...allVehicles.map((v) => v.kmDriven || 0), 1);
    const kmScore = 1 - (vehicle.kmDriven || 0) / maxKm;
    score += kmScore * 1.0;
  }

  // Ownership factor (1st owner best)
  const ownershipScore = {
    '1st Owner': 1.0,
    '2nd Owner': 0.6,
    '3rd Owner': 0.3,
    '4th+ Owner': 0.1,
  };
  score += (ownershipScore[vehicle.ownership] || 0.5) * 0.8;

  // Fuel type bonus
  const fuelBonus = { Electric: 1.0, Hybrid: 0.8, Petrol: 0.5, Diesel: 0.4, CNG: 0.6 };
  score += (fuelBonus[vehicle.fuel] || 0.5) * 0.5;

  // Safety rating bonus
  const rating = parseFloat(vehicle.specifications?.safetyRating) || 0;
  if (rating > 0) score += (rating / 5) * 0.7;

  // Clamp to 1–10 and round to 1 decimal
  return Math.max(1, Math.min(10, parseFloat(score.toFixed(1))));
};

// ─── Parse numeric values ─────────────────────────────────────────────────────
const parseNumeric = (str, type) => {
  if (!str) return null;
  const match = String(str).match(/[\d.]+/);
  if (!match) return null;
  const num = parseFloat(match[0]);
  if (type === 'price' || type === 'kmDriven') return -num; // lower is better
  return num;
};

const CompareVehicles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const ids = (searchParams.get('ids') || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  const allSameModel = vehicles.length > 1 && vehicles.every((v) => v.model === vehicles[0].model);

  useEffect(() => {
    if (ids.length === 0) {
      setVehicles([]);
      setLoading(false);
      return;
    }

    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const results = await Promise.allSettled(ids.map((id) => getVehicle(id)));
        const loadedVehicles = results
          .filter((result) => result.status === 'fulfilled' && result.value?.vehicle)
          .map((result) => result.value.vehicle);

        setVehicles(loadedVehicles);
        if (loadedVehicles.length < ids.length) {
          toast.error('Some selected vehicles could not be loaded for comparison.');
        }
      } catch {
        toast.error('Failed to load some vehicles for comparison.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [searchParams]);

  const handleRemove = (vehicleId) => {
    const updatedIds = ids.filter((id) => id !== vehicleId);
    if (updatedIds.length === 0) {
      searchParams.delete('ids');
    } else {
      searchParams.set('ids', updatedIds.join(','));
    }
    setSearchParams(searchParams);
  };

  // ── NEW: green = single best value, red = everything else (when values differ) ──
  const getCellStyle = (specKey, value, isNested = false) => {
    if (vehicles.length < 2) return { className: '', isBest: false };

    const values = vehicles.map((v) => {
      const rawVal = isNested ? v.specifications?.[specKey] : v[specKey];
      return parseNumeric(rawVal, specKey);
    });

    // If all null or all same, no highlighting
    const nonNull = values.filter((v) => v !== null);
    if (nonNull.length === 0) return { className: '', isBest: false };
    const maxVal = Math.max(...nonNull);
    const minVal = Math.min(...nonNull);
    if (maxVal === minVal) return { className: '', isBest: false };

    const rawVal = isNested ? value : value;
    const currentVal = parseNumeric(rawVal, specKey);
    if (currentVal === null) return { className: '', isBest: false };

    const isBest = currentVal === maxVal;
    return {
      className: isBest
        ? 'bg-emerald-50 text-emerald-800 border-l-2 border-emerald-400'
        : 'bg-red-50/60 text-red-800 border-l-2 border-red-300',
      isBest,
    };
  };

  // Vastu Max scores for all vehicles
  const vastuScores = vehicles.map((v) => computeVastuScore(v, vehicles));
  const maxVastuScore = Math.max(...vastuScores);
  const bestVastuIndex = vastuScores.indexOf(maxVastuScore);

  if (loading) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="container-vastu max py-20 flex flex-col items-center justify-center">
        <Scale className="h-16 w-16 text-slate-300 mb-4 animate-bounce" />
        <h2 className="text-2xl font-extrabold text-text">Compare Vehicle Matrix</h2>
        <p className="mt-2 text-sm text-text-muted max-w-sm text-center">
          Compare up to 4 vehicles side-by-side with our Vastu Max Score. Select vehicles from the explore catalog list.
        </p>
        <Link to="/vehicles" className="mt-6">
          <Button icon={Plus}>Browse Vehicles</Button>
        </Link>
      </div>
    );
  }

  const isCommercial = vehicles.length > 0 && vehicles[0].category === 'commercial';

  // Specifications rows configuration
  const specRows = isCommercial
    ? [
        { label: 'Ex-Showroom Price', key: 'price', format: (val) => `₹${(val || 0).toLocaleString('en-IN')}` },
        { label: 'Model Year', key: 'year' },
        { label: 'Fuel Type', key: 'fuel' },
        { label: 'Transmission', key: 'transmission' },
        { label: 'Ownership', key: 'ownership' },
        { label: 'KM Driven', key: 'kmDriven', format: (val) => val ? `${val.toLocaleString('en-IN')} km` : 'N/A' },
        { label: 'Engine Capacity', key: 'engine' },
        { label: 'Max Power Output', key: 'power' },
        { label: 'Max Torque Output', key: 'torque' },
        { label: 'Mileage / Range', key: 'mileage', format: (val, item) => val ? `${val} ${item.fuel === 'Electric' ? 'km' : 'kmpl'}` : 'N/A' },
        { label: 'Payload Capacity', key: 'payloadCapacity', isNested: true },
        { label: 'Gross Vehicle Weight (GVW)', key: 'gvw', isNested: true },
        { label: 'Permit Type', key: 'permitType', isNested: true },
        { label: 'Fitness Certificate', key: 'fitnessStatus', isNested: true },
        { label: 'Body Type', key: 'bodyType', isNested: true },
        { label: 'Exterior Color', key: 'color', isNested: true },
      ]
    : [
        { label: 'Ex-Showroom Price', key: 'price', format: (val) => `₹${(val || 0).toLocaleString('en-IN')}` },
        { label: 'Model Year', key: 'year' },
        { label: 'Fuel Type', key: 'fuel' },
        { label: 'Transmission', key: 'transmission' },
        { label: 'Ownership', key: 'ownership' },
        { label: 'KM Driven', key: 'kmDriven', format: (val) => val ? `${val.toLocaleString('en-IN')} km` : 'N/A' },
        { label: 'Engine Capacity', key: 'engine' },
        { label: 'Max Power Output', key: 'power' },
        { label: 'Max Torque Output', key: 'torque' },
        { label: 'Mileage / Range', key: 'mileage', format: (val, item) => val ? `${val} ${item.fuel === 'Electric' ? 'km' : 'kmpl'}` : 'N/A' },
        { label: 'Boot Space', key: 'bootSpace', isNested: true },
        { label: 'Ground Clearance', key: 'groundClearance', isNested: true },
        { label: 'Top Speed', key: 'topSpeed', isNested: true },
        { label: '0-100 km/h Sprint', key: 'zeroToHundred', isNested: true },
        { label: 'Safety Rating', key: 'safetyRating', isNested: true },
        { label: 'Dealer Warranty', key: 'warranty', isNested: true },
        { label: 'Exterior Color', key: 'color', isNested: true },
      ];

  return (
    <div className="container-vastu max py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-text hover:text-primary-600 cursor-pointer">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Compare Specifications</h1>
            {allSameModel && (
              <p className="text-sm text-primary-600">Comparing variants of the same model — differing specs are highlighted.</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-full px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" /> Best value
          </span>
          <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-full px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-red-400 inline-block" /> Others
          </span>
        </div>
      </div>

      {/* Specifications Scrollable Table */}
      <div className="mt-6 overflow-auto max-h-[85vh] lg:max-h-[750px] rounded-3xl border border-slate-200/80 bg-white shadow-soft relative">
        <table className="w-full border-separate border-spacing-0 text-left text-xs sm:text-sm min-w-[750px]">
          <thead>
            <tr>
              {/* Top-Left Corner Cell: Sticky in both directions (z-40) */}
              <th className="sticky left-0 top-0 z-40 bg-slate-100 p-4 border-b border-r border-slate-200/80 shadow-[2px_2px_5px_-2px_rgba(0,0,0,0.07)] min-w-[180px] sm:min-w-[240px]">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-black text-text uppercase tracking-wider">Compare Deck</span>
                  <Link to={isCommercial ? "/buy/commercial" : "/buy/cars"}>
                    <Button size="sm" variant="outline" icon={Plus} className="rounded-xl w-full text-xs py-1.5 px-3">
                      {isCommercial ? "Add CVs" : "Add Cars"}
                    </Button>
                  </Link>
                </div>
              </th>
              {vehicles.map((car, idx) => (
                /* Header Cells: Sticky on Top (z-30) */
                <th
                  key={car._id}
                  className={`sticky top-0 z-30 p-4 border-b border-l border-slate-200/60 text-left min-w-[210px] ${
                    idx === bestVastuIndex ? 'bg-[#f0fdf4]' : 'bg-slate-50'
                  }`}
                >
                  <div className="relative flex flex-col h-full">
                    {/* Trash / Delete button */}
                    <button
                      onClick={() => handleRemove(car._id)}
                      className="absolute right-0 top-0 rounded-full bg-slate-200/60 p-1.5 text-text-muted hover:bg-red-50 hover:text-red-600 transition-colors z-10 cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>

                    {/* Image */}
                    <div className="h-28 overflow-hidden rounded-xl bg-slate-100 mb-2 mt-4">
                      <img
                        src={car.images?.[0]}
                        className="h-full w-full object-contain bg-slate-50"
                        alt={car.name}
                      />
                    </div>

                    {/* Details */}
                    <div className="mb-2">
                      <span className="text-[9px] font-bold text-primary-600 uppercase tracking-wide block">{car.brand}</span>
                      <h3 className="font-extrabold text-text text-xs sm:text-sm line-clamp-1">{car.name}</h3>
                      <p className="text-[10px] text-text-muted line-clamp-1">{car.variant}</p>
                      <span className="text-xs font-bold text-text mt-1 block">
                        ₹{(car.price || 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Vastu Max Score Inline */}
                    <div className={`mt-2 p-2 rounded-xl flex items-center justify-between text-xs font-bold ${
                      idx === bestVastuIndex
                        ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'
                        : 'bg-red-500/5 text-red-700 border border-red-500/10'
                    }`}>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span>Vastu Max Score: {vastuScores[idx]}/10</span>
                      </div>
                      {idx === bestVastuIndex && (
                        <span className="text-[8px] bg-emerald-500 text-white uppercase tracking-wider px-1 py-0.5 rounded font-black">
                          Best
                        </span>
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {specRows.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                {/* Left Parameter Column: Sticky on Left (z-20) */}
                <td className="sticky left-0 bg-white z-20 py-5 px-6 font-semibold text-text-muted shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] border-r border-b border-slate-200/80">
                  {row.label}
                </td>
                {vehicles.map((car) => {
                  const val = row.isNested ? car.specifications?.[row.key] : car[row.key];
                  const displayVal = row.format ? row.format(val, car) : (val || 'Not Specified');
                  const { className: highlightClass } = getCellStyle(row.key, val, row.isNested);

                  return (
                    <td key={car._id} className={`py-5 px-6 font-bold border-l border-b border-slate-200/60 text-text ${highlightClass || 'bg-white'}`}>
                      {displayVal}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Pros Row */}
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="sticky left-0 bg-white z-20 py-5 px-6 font-semibold text-text-muted shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] border-r border-b border-slate-200/80">
                Key Pros
              </td>
              {vehicles.map((car, idx) => (
                <td key={car._id} className={`py-5 px-6 border-l border-b border-slate-200/60 text-xs font-medium ${idx === bestVastuIndex ? 'bg-[#e6fcf5] text-emerald-900' : 'text-text-muted bg-white'}`}>
                  <ul className="list-disc pl-4 space-y-1">
                    {car.specifications?.pros?.map((p, i) => (
                      <li key={i}>{p}</li>
                    )) || <li>Class-leading utility specs</li>}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Cons Row */}
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="sticky left-0 bg-white z-20 py-5 px-6 font-semibold text-text-muted shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] border-r border-b border-slate-200/80">
                Key Cons
              </td>
              {vehicles.map((car) => (
                <td key={car._id} className="py-5 px-6 border-l border-b border-slate-200/60 text-xs text-red-800 bg-[#fff5f5] font-medium">
                  <ul className="list-disc pl-4 space-y-1">
                    {car.specifications?.cons?.map((c, i) => (
                      <li key={i}>{c}</li>
                    )) || <li>Service center footprint coverage</li>}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-primary-50 to-violet-50 border border-primary-100"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 bg-primary-600 rounded-xl flex items-center justify-center">
            <Star className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-bold text-text">Vastu Max Recommendation</h3>
        </div>
        {vehicles[bestVastuIndex] && (
          <p className="text-sm text-text-muted leading-6">
            Based on price-value ratio, year of manufacture, ownership history, fuel efficiency, and safety ratings —{' '}
            <span className="font-bold text-text">
              {vehicles[bestVastuIndex].brand} {vehicles[bestVastuIndex].model}
            </span>{' '}
            scores the highest Vastu Max Score of{' '}
            <span className="font-black text-emerald-600">{vastuScores[bestVastuIndex]}/10</span> and is our recommended pick from this comparison.
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default CompareVehicles;
