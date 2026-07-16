import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Star,
  ShieldCheck,
  Phone,
  Mail,
  CheckCircle,
  Store,
  MessageSquare,
} from 'lucide-react';
import { getPublicVendor } from '../services/vendorService';
import VehicleCard from '../components/ui/VehicleCard';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const DOC_CHECKLIST = [
  { key: 'pan', label: 'PAN Card' },
  { key: 'gst', label: 'GST Registration' },
  { key: 'license', label: 'Dealership License' },
  { key: 'bank', label: 'Bank Details' },
  { key: 'aadhaar', label: 'Aadhaar / Business Registration' },
];

const VendorProfile = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicVendor(id)
      .then(setData)
      .catch(() => toast.error('Vendor not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container-vastu max py-20 flex justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (!data?.profile) {
    return (
      <div className="container-vastu max py-20 text-center">
        <p className="text-text-muted">Vendor not found.</p>
        <Link to="/vendors" className="mt-4 text-primary-600 font-semibold">← Back to dealers</Link>
      </div>
    );
  }

  const { profile, vehicles, inventoryCount } = data;
  const user = profile.user;

  return (
    <div className="pb-16">
      {/* Hero banner */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-r from-slate-900 to-primary-900">
        {profile.coverImage && (
          <img src={profile.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        )}
        <div className="container-vastu max relative z-10 flex h-full items-end pb-8">
          <div className="flex items-end gap-5">
            <img
              src={profile.logo || profile.profilePicture}
              alt={profile.businessName}
              className="h-20 w-20 rounded-2xl border-4 border-white object-cover shadow-xl sm:h-24 sm:w-24"
            />
            <div className="text-white">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold sm:text-3xl">{profile.businessName}</h1>
                {profile.verifiedBadge && (
                  <Badge className="bg-secondary-500 text-white">
                    <ShieldCheck className="mr-1 h-3 w-3" /> Verified
                  </Badge>
                )}
              </div>
              <p className="mt-1 flex items-center gap-1 text-white/70 text-sm">
                <MapPin className="h-4 w-4" />
                {profile.address?.city}, {profile.address?.state} · {profile.yearsActive}+ years active
              </p>
              <div className="mt-2 flex items-center gap-3">
                <span className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {profile.rating?.toFixed(1)} ({profile.reviewCount} reviews)
                </span>
                <span className="text-sm text-white/60">· {inventoryCount} live listings</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-vastu max -mt-6 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-text mb-3">About This Dealer</h2>
            <p className="text-text-muted leading-relaxed">
              {profile.about ||
                `${profile.businessName} is a verified partner on Vastu Max with ${inventoryCount} vehicles in stock. All listings undergo quality checks and come with transparent pricing.`}
            </p>
          </Card>

          <div>
            <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
              <Store className="h-5 w-5 text-primary-600" />
              Live Inventory ({inventoryCount})
            </h2>
            {vehicles?.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {vehicles.map((v) => (
                  <VehicleCard key={v._id} vehicle={v} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center text-text-muted">No active listings right now.</Card>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-text mb-4">Contact Dealer</h3>
            <div className="space-y-3 text-sm">
              {user?.phone && (
                <a href={`tel:${user.phone}`} className="flex items-center gap-2 text-text-muted hover:text-primary-600">
                  <Phone className="h-4 w-4" /> {user.phone}
                </a>
              )}
              {user?.email && (
                <a href={`mailto:${user.email}`} className="flex items-center gap-2 text-text-muted hover:text-primary-600">
                  <Mail className="h-4 w-4" /> {user.email}
                </a>
              )}
            </div>
            <Button className="w-full mt-4" onClick={() => toast.success('Enquiry sent! Dealer will contact you shortly.')}>
              <MessageSquare className="h-4 w-4 mr-2" /> Send Enquiry
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-text mb-4">Document Checklist</h3>
            <ul className="space-y-2">
              {DOC_CHECKLIST.map((doc) => (
                <li key={doc.key} className="flex items-center gap-2 text-sm text-text-muted">
                  <CheckCircle className="h-4 w-4 text-secondary-500 shrink-0" />
                  {doc.label}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
