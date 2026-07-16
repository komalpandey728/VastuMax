import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ArrowUpRight, ArrowDownRight, Minus, ShoppingBag, MapPin, Gauge, Award, Sparkles, TrendingDown, DollarSign, User, Fuel, Settings, Truck, Car } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getWishlist, removeFromWishlist } from '../../services/customerService';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

// --- 6 MONTH PRICE GENERATOR ---
const generateSixMonthHistory = (basePrice) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIdx = new Date().getMonth();
  
  const history = [];
  const variance = [-0.035, -0.015, 0.02, 0.01, -0.025, 0];
  for (let i = 5; i >= 0; i--) {
    const monthIdx = (currentMonthIdx - i + 12) % 12;
    const monthName = months[monthIdx];
    const priceFactor = 1 + variance[5 - i];
    const price = Math.round((basePrice * priceFactor) / 1000) * 1000;
    history.push({ month: monthName, price });
  }
  return history;
};

// SVG Interactive Price Chart Component for Price Fluctuations (Enlarged)
const InteractivePriceChart = ({ basePrice }) => {
  const history = generateSixMonthHistory(basePrice);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const prices = history.map(h => h.price);
  const min = Math.min(...prices) * 0.98;
  const max = Math.max(...prices) * 1.02;
  const range = max - min || 1;

  const width = 800;
  const height = 210;
  const paddingLeft = 100;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const coords = history.map((pt, i) => {
    const x = paddingLeft + (i / (history.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((pt.price - min) / range) * chartHeight;
    return { x, y, month: pt.month, price: pt.price };
  });

  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${height - paddingBottom} L ${coords[0].x} ${height - paddingBottom} Z`;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;
    
    let closest = coords[0];
    let minDist = Math.abs(coords[0].x - mouseX);
    for (let i = 1; i < coords.length; i++) {
      const dist = Math.abs(coords[i].x - mouseX);
      if (dist < minDist) {
        minDist = dist;
        closest = coords[i];
      }
    }
    setHoveredPoint(closest);
    setMousePos({ x: closest.x, y: closest.y });
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <div className="relative bg-slate-950 text-white p-6 rounded-3xl border border-slate-800 shadow-[0_8px_32px_rgba(15,23,42,0.15)] overflow-hidden w-full select-none transition-all duration-300 hover:border-slate-700/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b border-slate-900 pb-3 gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-lg font-black uppercase tracking-[0.12em] text-white">Price Trend Tracker</span>
        </div>
        {hoveredPoint ? (
          <motion.span 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-sm font-black text-white bg-blue-600 px-4 py-1.5 rounded-xl border border-blue-500 shadow-sm"
          >
            {hoveredPoint.month}: ₹{hoveredPoint.price.toLocaleString('en-IN')}
          </motion.span>
        ) : (
          <span className="text-xs text-white font-extrabold uppercase tracking-wider bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">Glide cursor to check</span>
        )}
      </div>

      <div 
        className="relative cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          <defs>
            <linearGradient id="areaGradUpgraded" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineGradUpgraded" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>

          {/* Vertical Grid Lines */}
          {coords.map((c, i) => (
            <line
              key={`v-${i}`}
              x1={c.x}
              y1={paddingTop}
              x2={c.x}
              y2={height - paddingBottom}
              stroke="#1e293b"
              strokeWidth="1"
              strokeDasharray="2"
            />
          ))}

          {/* Horizontal Grid lines */}
          {[0, 0.5, 1].map((ratio, i) => {
            const y = paddingTop + ratio * chartHeight;
            const val = Math.round(max - ratio * range);
            return (
              <g key={i}>
                <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#334155" strokeWidth="1" strokeDasharray="3" className="opacity-20" />
                <text x={paddingLeft - 12} y={y + 7} textAnchor="end" fontSize="20" fill="#ffffff" fontWeight="black">
                  ₹{(val / 100000).toFixed(1)}L
                </text>
              </g>
            );
          })}

          {/* Area */}
          <path d={areaPath} fill="url(#areaGradUpgraded)" />

          {/* Line */}
          <path d={linePath} fill="none" stroke="url(#lineGradUpgraded)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Dots with glow */}
          {coords.map((c, i) => {
            const isPointHovered = hoveredPoint?.month === c.month;
            return (
              <g key={i}>
                {isPointHovered && (
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r="6"
                    fill="#3b82f6"
                    className="opacity-30 animate-ping"
                  />
                )}
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={isPointHovered ? "4" : "2.5"}
                  fill={isPointHovered ? "#2563eb" : "#0f172a"}
                  stroke={isPointHovered ? "#ffffff" : "#60a5fa"}
                  strokeWidth="2"
                  className="transition-all duration-200"
                />
              </g>
            );
          })}

          {/* Tooltip Glide Guide */}
          {hoveredPoint && (
            <g>
              <line
                x1={mousePos.x}
                y1={paddingTop}
                x2={mousePos.x}
                y2={height - paddingBottom}
                stroke="#60a5fa"
                strokeWidth="1"
                strokeDasharray="2"
                className="opacity-70"
              />
              <circle
                cx={mousePos.x}
                cy={mousePos.y}
                r="5"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
              />
            </g>
          )}

          {/* X labels */}
          {coords.map((c, i) => (
            <text
              key={i}
              x={c.x}
              y={height - 6}
              textAnchor="middle"
              fontSize="20"
              fill={hoveredPoint?.month === c.month ? '#60a5fa' : '#ffffff'}
              fontWeight="black"
              className="transition-colors duration-200"
            >
              {c.month}
            </text>
          ))}
        </svg>
      </div>

      {/* Narrative Summary Line */}
      <div className="mt-4 text-base text-white border-t border-slate-900 pt-3 font-bold">
        * Market Note: {basePrice > 1000000 
          ? "Vehicles of this model are currently showing a steady price drop of approx 3.5% over the past 3 months due to localized market adjustments." 
          : "Steady demand. Prices are currently holding stable with a slight drop expected next month based on seasonal trends."}
      </div>
    </div>
  );
};

const CustomerWishlist = () => {
  const { user, loadUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState([]);

  const fetchWishlistData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getWishlist();
      setWishlistItems(res.wishlist || []);
    } catch {
      toast.error('Failed to load wishlist items.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlistData();
  }, [fetchWishlistData]);

  const handleRemoveWishlist = async (vehicleId) => {
    const toastId = toast.loading('Removing from wishlist...');
    try {
      await removeFromWishlist(vehicleId);
      await loadUser();
      await fetchWishlistData();
      toast.dismiss(toastId);
      toast.success('Removed from wishlist');
    } catch {
      toast.dismiss(toastId);
      toast.error('Failed to remove item.');
    }
  };

  const getPriceChangeIndicator = (vehicle) => {
    const history = generateSixMonthHistory(vehicle.price);
    if (history.length < 2) return null;

    const currentPrice = history[history.length - 1].price;
    const previousPrice = history[history.length - 2].price;
    const diff = currentPrice - previousPrice;

    if (diff > 0) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg px-2 py-0.5">
          <ArrowUpRight className="h-3 w-3" /> +₹{diff.toLocaleString('en-IN')}
        </span>
      );
    } else if (diff < 0) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 border border-green-100 rounded-lg px-2 py-0.5">
          <ArrowDownRight className="h-3 w-3" /> -₹{Math.abs(diff).toLocaleString('en-IN')}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-100 rounded-lg px-2 py-0.5">
          <Minus className="h-3 w-3" /> Stable Price
        </span>
      );
    }
  };

  const getPriceReductionLabel = (vehicle) => {
    const history = generateSixMonthHistory(vehicle.price);
    const initialPrice = history[0].price;
    const finalPrice = history[history.length - 1].price;
    const drop = initialPrice - finalPrice;
    
    if (drop > 0) {
      return `Saved ₹${drop.toLocaleString('en-IN')} over 6m`;
    }
    return 'Stable Price Curve';
  };

  // Calculations for summary stats
  const totalValue = wishlistItems.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const avgPrice = wishlistItems.length ? Math.round(totalValue / wishlistItems.length) : 0;
  const bestValueItem = wishlistItems.reduce((prev, current) => {
    return (prev.priceHistory?.[0]?.price - prev.price > current.priceHistory?.[0]?.price - current.price) ? prev : current;
  }, wishlistItems[0] || {});

  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="container-vastu max max-w-7xl">
        
        {/* Beautified Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 mb-10 shadow-xl border border-slate-800">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 h-40 w-40 rounded-full bg-primary-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-primary-400 font-bold text-xs uppercase tracking-widest mb-1.5">
                <Sparkles className="h-4 w-4 text-primary-400 fill-current animate-pulse" />
                Vastu Max Personal Garage
              </div>
              <h1 className="text-3xl font-black tracking-tight leading-none">
                My Saved Vehicles
              </h1>
              <p className="text-slate-300 text-xs mt-2 max-w-lg leading-relaxed">
                Track dynamic market price changes, explore detailed vehicle sheets, and finalize booking quotes from your preferred dealer network.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <span className="bg-white/10 text-white text-xs font-black uppercase tracking-wider px-3.5 py-2 rounded-xl backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-slate-300" /> {user?.role === 'vendor' ? 'Vendor Account' : 'Customer Account'}
              </span>
              <span className="bg-primary-500/20 text-primary-300 text-xs font-black uppercase tracking-wider px-3.5 py-2 rounded-xl border border-primary-500/30 flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-primary-400 fill-primary-400" /> {wishlistItems.length} {wishlistItems.length === 1 ? 'Listing' : 'Listings'}
              </span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          {wishlistItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800/60 pt-6 mt-6 relative z-10 text-xs">
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-md flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20 text-primary-400">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase tracking-wider">Total Garage Value</span>
                  <span className="text-base font-black text-white mt-0.5 block">₹{totalValue.toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-md flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase tracking-wider">Average Price Point</span>
                  <span className="text-base font-black text-white mt-0.5 block">₹{avgPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-md flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
                  <TrendingDown className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase tracking-wider">Price Tracking Frequency</span>
                  <span className="text-xs font-black text-emerald-400 mt-0.5 flex items-center gap-1">
                    Live Updates Active
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="p-6 bg-white border border-border h-56 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : wishlistItems.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-16 text-center bg-white border border-border rounded-3xl shadow-soft">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 mb-4 animate-bounce">
              <Heart className="h-8 w-8 text-red-500 fill-current" />
            </div>
            <h3 className="text-lg font-bold text-text mb-1">Your wishlist is empty</h3>
            <p className="text-xs text-text-muted max-w-sm mb-6 leading-relaxed">
              Find passenger vehicles or commercial fleets in our catalog and click the heart icon on any model card to start tracking prices here.
            </p>
            <div className="flex gap-4">
              <Link to="/buy/cars">
                <Button variant="primary" className="rounded-xl px-5 py-2.5">Browse Cars</Button>
              </Link>
              <Link to="/buy/commercial">
                <Button variant="outline" className="rounded-xl px-5 py-2.5">Browse Fleet</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {wishlistItems.map((vehicle) => (
                <motion.div
                  key={vehicle._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="group"
                >
                  <Card className="bg-white border border-border hover:border-slate-300 rounded-3xl p-6 shadow-soft hover:shadow-md transition-all duration-300 flex flex-col xl:flex-row gap-6 items-stretch relative">
                    
                    {/* Vehicle Photo Container */}
                    <div className="w-full xl:w-80 h-52 xl:h-auto rounded-3xl overflow-hidden bg-slate-100 shrink-0 relative shadow-inner">
                      <img
                        src={vehicle.images?.[0] || 'https://placehold.co/400x240'}
                        alt={vehicle.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 bg-slate-900/80 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-xl backdrop-blur-md border border-white/10">
                        {vehicle.year} MODEL
                      </div>
                      
                      {/* Category Badge overlay */}
                      <div className="absolute bottom-3 left-3 bg-white/95 text-slate-800 text-[9px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-xl shadow-sm border border-slate-100 flex items-center gap-1">
                        {vehicle.category === 'commercial' ? (
                          <>
                            <Truck className="h-3 w-3 text-slate-600" /> Commercial
                          </>
                        ) : (
                          <>
                            <Car className="h-3 w-3 text-slate-600" /> Passenger
                          </>
                        )}
                      </div>
                    </div>

                    {/* Metadata & Actions grid (Center details) */}
                    <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                      <div>
                        <span className="inline-flex items-center gap-1 text-[9px] font-black text-primary-600 bg-primary-50 rounded-lg px-2.5 py-1 border border-primary-100 uppercase tracking-wider">
                          {vehicle.brand}
                        </span>
                        <h3 className="text-xl font-black text-text mt-1.5 leading-tight">{vehicle.name}</h3>
                        <p className="text-xs text-text-muted mt-1 font-medium">{vehicle.variant}</p>
                        
                        {/* Price details */}
                        <div className="mt-3.5 bg-slate-50 border border-slate-100 p-3 rounded-2xl w-fit">
                          <span className="text-xl font-black text-text block leading-none">
                            ₹{vehicle.price?.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[9px] text-text-muted mt-1 block font-bold uppercase tracking-wider">Showroom price</span>
                        </div>

                        {/* Specs badges */}
                        <div className="flex flex-wrap gap-2 mt-4 text-[10px] text-text-muted">
                          <span className="bg-slate-100/80 px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5">
                            <Fuel className="h-3.5 w-3.5 text-slate-500" /> {vehicle.fuel}
                          </span>
                          <span className="bg-slate-100/80 px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5">
                            <Settings className="h-3.5 w-3.5 text-slate-500" /> {vehicle.transmission}
                          </span>
                          <span className="bg-slate-100/80 px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-slate-500" /> {vehicle.ownership}
                          </span>
                          <span className="bg-slate-100/80 px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-slate-500" /> {vehicle.location?.city || 'India'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-row items-center justify-between gap-3 border-t border-slate-100 pt-4 mt-4 w-full">
                        <div className="flex items-center gap-2">
                          {getPriceChangeIndicator(vehicle)}
                          <span className="hidden sm:inline-flex bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-blue-100">
                            {getPriceReductionLabel(vehicle)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link to={`/vehicle/${vehicle._id}`}>
                            <Button size="sm" variant="secondary" className="rounded-xl text-xs py-2 px-4 font-bold border border-slate-200">
                              View Details
                            </Button>
                          </Link>
                          <button
                            onClick={() => handleRemoveWishlist(vehicle._id)}
                            className="p-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100 cursor-pointer"
                            title="Remove from saved"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Large Price Tracker Chart */}
                    <div className="w-full xl:w-[480px] shrink-0 border-t xl:border-t-0 xl:border-l border-slate-100 pt-5 xl:pt-0 xl:pl-6 flex flex-col justify-center">
                      <InteractivePriceChart basePrice={vehicle.price} />
                    </div>

                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerWishlist;
