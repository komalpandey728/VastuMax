import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MapPin, Gauge, ShieldCheck, Zap } from 'lucide-react';
import Badge from './Badge';
import Card from './Card';
import Button from './Button';
import { useAuth } from '../../context/AuthContext';
import { addToWishlist, removeFromWishlist } from '../../services/customerService';
import { useState, useEffect } from 'react';
import { getFreeImage } from '../../utils/imageFallback';
import toast from 'react-hot-toast';

const VehicleCard = ({ vehicle, onCompareToggle, isCompared, wishlistIds = [], onWishlistUpdate }) => {
  const { isAuthenticated, user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsSaved(wishlistIds.includes(vehicle._id));
  }, [wishlistIds, vehicle._id]);

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to save vehicles.');
      return;
    }

    if (user.role !== 'customer' && user.role !== 'vendor') {
      toast.error('Only Customer and Dealer/Vendor accounts can save vehicles.');
      return;
    }

    setIsSaving(true);
    try {
      if (isSaved) {
        await removeFromWishlist(vehicle._id);
        setIsSaved(false);
        toast.success('Removed from wishlist');
        if (onWishlistUpdate) onWishlistUpdate(vehicle._id, 'remove');
      } else {
        await addToWishlist(vehicle._id);
        setIsSaved(true);
        toast.success('Added to wishlist');
        if (onWishlistUpdate) onWishlistUpdate(vehicle._id, 'add');
      }
    } catch {
      toast.error('Failed to update wishlist');
    } finally {
      setIsSaving(false);
    }
  };

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative h-full"
    >
      <Card className="flex h-full flex-col overflow-hidden border border-slate-200/60 bg-white shadow-soft transition-all duration-500 hover:shadow-elevated rounded-3xl hover:border-primary-500/30 hover:ring-4 hover:ring-primary-500/5 group/card">
        {/* Image Section */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-50">
          <img
            src={vehicle.images?.[0] || getFreeImage(vehicle.brand, vehicle.model, vehicle.category, vehicle._id)}
            alt={vehicle.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=333&fit=crop';
            }}
          />

          {/* Top Overlays */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
            {vehicle.verified && (
              <Badge variant="success" className="flex items-center gap-1 shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified
              </Badge>
            )}
            {vehicle.featured && (
              <Badge variant="primary" className="flex items-center gap-1 shadow-sm">
                <Zap className="h-3.5 w-3.5 text-amber-300" />
                Premium
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            disabled={isSaving}
            className={`absolute right-3 top-3 flex h-9.5 w-9.5 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-all z-10 ${isSaved
                ? 'bg-red-500 text-white'
                : 'bg-white/80 text-text hover:bg-white'
              }`}
          >
            <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>


        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col p-5">
          {/* Header */}
          <div className="mb-2">
            <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
              {vehicle.brand}
            </span>
            <Link to={`/vehicles/${vehicle._id}`}>
              <h3 className="mt-0.5 text-base font-bold text-text line-clamp-1 hover:text-primary-600 transition-colors">
                {vehicle.name}
              </h3>
            </Link>
            <p className="text-xs text-text-muted mt-0.5">{vehicle.variant}</p>
          </div>

          {/* Price */}
          <div className="mb-4">
            <span className="text-lg font-extrabold text-text">{formattedPrice}</span>
          </div>

          {/* Core Specs Grid */}
          <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 border-t border-border/60 py-3.5 text-xs text-text-muted">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-slate-400" />
              <span>{vehicle.mileage} {vehicle.fuel === 'Electric' ? 'km Range' : 'kmpl'}</span>
            </div>
            {vehicle.category === 'commercial' ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-500 bg-slate-100 rounded px-1.5 py-0.5 text-[10px] truncate">
                    Payload: {vehicle.specifications?.payloadCapacity || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-500 bg-slate-100 rounded px-1.5 py-0.5 text-[10px]">
                    {vehicle.fuel}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-500 bg-slate-100 rounded px-1.5 py-0.5 text-[10px]">
                    {vehicle.fuel}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-500 bg-slate-100 rounded px-1.5 py-0.5 text-[10px]">
                    {vehicle.transmission}
                  </span>
                </div>
              </>
            )}
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span className="line-clamp-1">{vehicle.location?.city}</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-auto border-t border-border/60 pt-4 flex items-center justify-between gap-3">
            {/* Compare Checkbox */}
            {onCompareToggle && (
              <label className="flex cursor-pointer items-center gap-2 select-none">
                <input
                  type="checkbox"
                  checked={isCompared}
                  onChange={() => onCompareToggle(vehicle)}
                  className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500/20"
                />
                <span className="text-xs font-semibold text-text">Compare</span>
              </label>
            )}

            <Link to={`/vehicles/${vehicle._id}`} className={onCompareToggle ? '' : 'w-full'}>
              <Button size="sm" variant={onCompareToggle ? 'secondary' : 'primary'} className="rounded-xl">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default VehicleCard;
