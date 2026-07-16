import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ArrowUpRight, ArrowDownRight, Minus, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getWishlist } from '../../services/customerService';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

// SVG Sparkline Component for Price Trends
const PriceSparkline = ({ history }) => {
  if (!history || history.length < 2) {
    return (
      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-2.5 py-1.5 inline-flex items-center gap-1.5">
        📊 Price tracking starts now
      </span>
    );
  }

  const prices = history.map(h => h.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const width = 120;
  const height = 30;
  const padding = 4;

  const points = history.map((pt, i) => {
    const x = (i / (history.length - 1)) * (width - padding * 2) + padding;
    const y = height - padding - ((pt.price - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const isUp = prices[prices.length - 1] > prices[0];
  const strokeColor = isUp ? '#ef4444' : '#10b981'; // Red for price up, Green for saving money

  return (
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/50 p-2 rounded-xl">
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        <circle
          cx={(history.length - 1) / (history.length - 1) * (width - padding * 2) + padding}
          cy={height - padding - ((prices[prices.length - 1] - min) / range) * (height - padding * 2)}
          r="3.5"
          fill={strokeColor}
          className="animate-pulse"
        />
      </svg>
      <div className="flex flex-col text-[10px]">
        <span className="font-black text-text uppercase tracking-wider">Price Trend</span>
        <span className="text-text-muted">Past 4 Months</span>
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
      const users = JSON.parse(localStorage.getItem('vastu_users') || '[]');
      const updatedUsers = users.map((u) => {
        if (u.id === user.id) {
          return {
            ...u,
            wishlist: (u.wishlist || []).filter((id) => id !== vehicleId)
          };
        }
        return u;
      });
      localStorage.setItem('vastu_users', JSON.stringify(updatedUsers));
      
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
    const history = vehicle.priceHistory || [];
    if (history.length < 2) return null;

    const currentPrice = vehicle.price;
    const previousPrice = history[history.length - 2].price;
    const diff = currentPrice - previousPrice;

    if (diff > 0) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg px-2.5 py-1">
          <ArrowUpRight className="h-3.5 w-3.5" /> +₹{diff.toLocaleString('en-IN')}
        </span>
      );
    } else if (diff < 0) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 border border-green-100 rounded-lg px-2.5 py-1">
          <ArrowDownRight className="h-3.5 w-3.5" /> -₹{Math.abs(diff).toLocaleString('en-IN')}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1">
          <Minus className="h-3.5 w-3.5" /> Stable Price
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container-vastu max max-w-5xl">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-black text-text flex items-center gap-2 font-heading">
              <Heart className="h-6 w-6 text-red-500 fill-current" /> My Wishlist
            </h1>
            <p className="text-xs text-text-muted mt-1">
              Track prices, view active listings, and compare deal fluctuations.
            </p>
          </div>
          <Badge variant="primary" className="self-start sm:self-auto text-xs py-1.5 px-3">
            {wishlistItems.length} Saved {wishlistItems.length === 1 ? 'Vehicle' : 'Vehicles'}
          </Badge>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="p-6 bg-white border border-border h-48 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : wishlistItems.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-16 text-center bg-white border border-border rounded-3xl shadow-soft">
            <Heart className="h-16 w-16 text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-text mb-1">Your wishlist is empty</h3>
            <p className="text-xs text-text-muted max-w-sm mb-6 leading-relaxed">
              Explore our passenger cars or commercial fleets and click the heart icon on any vehicle to start tracking prices here.
            </p>
            <div className="flex gap-4">
              <Link to="/buy/cars">
                <Button variant="primary">Browse Cars</Button>
              </Link>
              <Link to="/buy/commercial">
                <Button variant="outline">Browse Fleet</Button>
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
                >
                  <Card className="bg-white border border-border hover:border-slate-300 rounded-3xl p-5 shadow-soft hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-5 items-stretch relative">
                    
                    {/* Vehicle Photo */}
                    <div className="w-full md:w-56 h-40 md:h-auto rounded-2xl overflow-hidden bg-slate-100 shrink-0 relative">
                      <img
                        src={vehicle.images?.[0] || 'https://placehold.co/400x240'}
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg backdrop-blur-sm">
                        {vehicle.year}
                      </div>
                    </div>

                    {/* Metadata column */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="text-[9px] font-bold text-primary-600 bg-primary-50 rounded-md px-2 py-0.5 border border-primary-100">
                              {vehicle.brand}
                            </span>
                            <h3 className="text-lg font-black text-text mt-1">{vehicle.name}</h3>
                            <p className="text-xs text-text-muted mt-0.5">{vehicle.variant}</p>
                          </div>
                          
                          {/* Price */}
                          <div className="text-right shrink-0">
                            <span className="text-xl font-black text-text block">
                              ₹{vehicle.price?.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-text-muted">Estimated price</span>
                          </div>
                        </div>

                        {/* Specs badges */}
                        <div className="flex flex-wrap gap-2 mt-4 text-[10px] text-text-muted">
                          <span className="bg-slate-100 px-2 py-1 rounded-lg font-semibold">{vehicle.fuel}</span>
                          <span className="bg-slate-100 px-2 py-1 rounded-lg font-semibold">{vehicle.transmission}</span>
                          <span className="bg-slate-100 px-2 py-1 rounded-lg font-semibold">{vehicle.ownership}</span>
                          <span className="bg-slate-100 px-2 py-1 rounded-lg font-semibold">{vehicle.location?.city}</span>
                        </div>
                      </div>

                      {/* Sparkline & Fluctuations */}
                      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4 mt-4">
                        <PriceSparkline history={vehicle.priceHistory} />
                        <div className="flex items-center gap-3">
                          {getPriceChangeIndicator(vehicle)}
                          <Link to={`/vehicle/${vehicle._id}`}>
                            <Button size="sm" variant="secondary" className="rounded-xl text-xs">
                              View Details
                            </Button>
                          </Link>
                          <button
                            onClick={() => handleRemoveWishlist(vehicle._id)}
                            className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

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
