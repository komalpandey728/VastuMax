import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, MapPin, Star, ShieldCheck, ChevronRight } from 'lucide-react';
import { getPublicVendors } from '../services/vendorService';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { FadeIn } from '../components/ui/Motion';

const VendorsDirectory = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicVendors()
      .then((res) => setVendors(res.vendors || []))
      .catch(() => setVendors([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-vastu max py-12">
      <FadeIn>
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-text">Verified Dealers</h1>
          <p className="mt-2 text-text-muted">
            Browse trusted partners with live inventory, ratings, and complete KYC verification.
          </p>
        </div>
      </FadeIn>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-3xl bg-slate-100" />
          ))}
        </div>
      ) : vendors.length === 0 ? (
        <Card className="p-12 text-center">
          <Store className="mx-auto h-12 w-12 text-text-muted" />
          <p className="mt-4 text-text-muted">No verified dealers yet. Check back soon!</p>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vendors.map((vendor, i) => (
            <motion.div
              key={vendor._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link to={`/vendors/${vendor._id}`}>
                <Card className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative h-32 bg-gradient-to-br from-primary-100 to-blue-50">
                    {vendor.coverImage && (
                      <img src={vendor.coverImage} alt="" className="h-full w-full object-cover" />
                    )}
                    {vendor.verifiedBadge && (
                      <Badge className="absolute right-3 top-3 bg-secondary-500 text-white">
                        <ShieldCheck className="mr-1 h-3 w-3" /> Verified
                      </Badge>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <img
                        src={vendor.logo || vendor.profilePicture || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=80'}
                        alt={vendor.businessName}
                        className="h-12 w-12 rounded-xl object-cover border border-border"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-text truncate group-hover:text-primary-600 transition-colors">
                          {vendor.businessName}
                        </h3>
                        <p className="flex items-center gap-1 text-xs text-text-muted mt-0.5">
                          <MapPin className="h-3 w-3" />
                          {vendor.address?.city}, {vendor.address?.state}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{vendor.rating?.toFixed(1) || '4.5'}</span>
                        <span className="text-text-muted">({vendor.reviewCount || 0} reviews)</span>
                      </div>
                      <span className="text-xs font-semibold text-primary-600">
                        {vendor.inventoryCount || 0} vehicles
                      </span>
                    </div>
                    <div className="mt-3 flex items-center text-sm font-semibold text-primary-600">
                      View Profile <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorsDirectory;
