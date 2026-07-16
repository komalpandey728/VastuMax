import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getVehicles } from '../../services/vehicleService';
import VehicleCard from '../ui/VehicleCard';
import { SkeletonCard } from '../ui/Skeleton';
import Button from '../ui/Button';

const FeaturedListings = () => {
  const [activeTab, setActiveTab] = useState('premium');
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const queryParams = {
          limit: 3,
          sort: activeTab === 'premium' ? 'price-high' : 'newest',
        };
        const res = await getVehicles(queryParams);
        setVehicles(res.vehicles || []);
      } catch (err) {
        console.error('Failed to load home listings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [activeTab]);

  return (
    <section className="bg-slate-50 py-24">
      <div className="container-vastu max">
        {/* Title */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
              <Sparkles className="h-3 w-3" />
              Verified Catalog
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-text sm:text-4xl font-heading">
              Explore Our Showrooms
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Pre-approved certified inventory check with clear inspection details.
            </p>
          </div>

          {/* Tab toggles */}
          <div className="flex rounded-xl bg-slate-200/60 p-1 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('premium')}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'premium' ? 'bg-white text-primary-600 shadow-sm' : 'text-text-muted'
              }`}
            >
              Premium Collections
            </button>
            <button
              onClick={() => setActiveTab('latest')}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'latest' ? 'bg-white text-primary-600 shadow-sm' : 'text-text-muted'
              }`}
            >
              Latest Arrivals
            </button>
          </div>
        </div>

        {/* Listings display */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {vehicles.map((car) => (
                <div key={car._id}>
                  <VehicleCard vehicle={car} />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link to="/vehicles">
            <Button size="lg" icon={ArrowRight} iconPosition="right">
              View Entire Inventory
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
