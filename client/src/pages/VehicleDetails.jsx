import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Car,
  Calendar,
  MessageSquare,
  Heart,
  Share2,
  Scale,
  MapPin,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Check,
  AlertCircle,
  Phone,
} from 'lucide-react';
import { getVehicle, getVehicles } from '../services/vehicleService';
import { getVehicleQuestions } from '../services/questionService';
import { createLead } from '../services/leadService';
import { createBooking } from '../services/bookingService';
import { addToWishlist, removeFromWishlist } from '../services/customerService';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import VehicleCard from '../components/ui/VehicleCard';
import toast from 'react-hot-toast';

const quickChips = [
  'Is the price negotiable?',
  'Is the vehicle still available?',
  'Can I schedule a test drive this weekend?',
  'Does the vehicle have any accident history?',
];

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Load States
  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState(null);
  const [vendorProfile, setVendorProfile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [relatedCars, setRelatedCars] = useState([]);

  // Media state
  const [activeMediaTab, setActiveMediaTab] = useState('photos');
  const [selectedPhoto, setSelectedPhoto] = useState('');

  // Wishlist & Compare
  const [isSaved, setIsSaved] = useState(false);
  const [isSavedLoading, setIsSavedLoading] = useState(false);

  const fallbackMediaImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXowUr0p8B6jDDwbRrB4YU4I29TsjPYNTQqltd-iXoiA&s=10';

  // Forms
  const [bookingForm, setBookingForm] = useState({ bookingDate: '', bookingTime: '10:00 AM', notes: '' });
  const [bookingLoading, setBookingLoading] = useState(false);

  const [questionText, setQuestionText] = useState('');
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [questionLoading, setQuestionLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);

  const loadAllDetails = useCallback(async () => {
    try {
      const res = await getVehicle(id);
      const vehicleData = { ...res.vehicle };
      const brand = vehicleData.brand;
      const modelLower = (vehicleData.model || '').toLowerCase();
      const variantLower = (vehicleData.variant || '').toLowerCase();

      if (brand === 'Maruti Suzuki' && modelLower === 'swift') {
        vehicleData.images = [
          'https://stimg.cardekho.com/images/carexteriorimages/930x620/Maruti/Swift/12028/1774511780726/exterior-image-166.jpg?tr=w-420',
          'https://stimg.cardekho.com/images/carexteriorimages/930x620/Maruti/Swift/12028/1774511780726/exterior-image-166.jpg?tr=w-420',
          'https://stimg.cardekho.com/images/carexteriorimages/930x620/Maruti/Swift/12028/1774511780726/exterior-image-166.jpg?tr=w-420',
          'https://stimg.cardekho.com/images/carexteriorimages/930x620/Maruti/Swift/12028/1774511780726/exterior-image-166.jpg?tr=w-420',
          'https://stimg.cardekho.com/images/carexteriorimages/930x620/Maruti/Swift/12028/1774511780726/exterior-image-166.jpg?tr=w-420'
        ];
      } else if (brand === 'Hyundai' && modelLower === 'creta') {
        if (variantLower.includes('sx(o)')) {
          vehicleData.images = [
            'https://imgd.aeplcdn.com/370x208/n/cw/ec/53327/hyundai-creta-right-side-view10.jpeg?wm=1&q=80',
            'https://imgd.aeplcdn.com/370x208/n/cw/ec/53327/hyundai-creta-right-side-view10.jpeg?wm=1&q=80',
            'https://imgd.aeplcdn.com/370x208/n/cw/ec/53327/hyundai-creta-right-side-view10.jpeg?wm=1&q=80',
            'https://imgd.aeplcdn.com/370x208/n/cw/ec/53327/hyundai-creta-right-side-view10.jpeg?wm=1&q=80',
            'https://imgd.aeplcdn.com/370x208/n/cw/ec/53327/hyundai-creta-right-side-view10.jpeg?wm=1&q=80'
          ];
        } else if (variantLower.includes('sx')) {
          vehicleData.images = [
            'https://imgd.aeplcdn.com/642x361/n/cw/ec/182021/hyundai-creta-front-view5.jpeg?isig=0&q=75',
            'https://imgd.aeplcdn.com/642x361/n/cw/ec/182021/hyundai-creta-left-front-three-quarter1.jpeg?isig=0&q=75',
            'https://imgd.aeplcdn.com/642x361/n/cw/ec/182021/hyundai-creta-left-rear-three-quarter3.jpeg?isig=0&q=75',
            'https://imgd.aeplcdn.com/642x361/n/cw/ec/182021/hyundai-creta-front-view5.jpeg?isig=0&q=75',
            'https://imgd.aeplcdn.com/642x361/n/cw/ec/182021/hyundai-creta-left-front-three-quarter1.jpeg?isig=0&q=75'
          ];
        }
      } else if (brand === 'Hyundai' && modelLower === 'i20') {
        if (variantLower.includes('magna')) {
          vehicleData.images = [
            'https://stimg.cardekho.com/images/carexteriorimages/930x620/Hyundai/Grand-i10-Nios/10096/1684298344769/front-view-118.jpg',
            'https://stimg.cardekho.com/images/carexteriorimages/930x620/Hyundai/Grand-i10-Nios/10096/1684298344769/side-view-(left)-90.jpg',
            'https://stimg.cardekho.com/images/carexteriorimages/930x620/Hyundai/Grand-i10-Nios/10096/1684298344769/rear-left-view-121.jpg',
            'https://stimg.cardekho.com/images/carexteriorimages/930x620/Hyundai/Grand-i10-Nios/10088/1739512983356/exterior-image-165.jpg',
            'https://stimg.cardekho.com/images/carexteriorimages/930x620/Hyundai/Grand-i10-Nios/10096/1684298344769/front-view-118.jpg'
          ];
        } else if (variantLower.includes('asta')) {
          vehicleData.images = [
            'https://stimg.cardekho.com/images/carexteriorimages/930x620/Hyundai/i20/11092/1755058597906/front-view-118.jpg?tr=w-420',
            'https://stimg.cardekho.com/images/carexteriorimages/930x620/Hyundai/i20/11092/1755058597906/side-view-(left)-90.jpg?tr=w-420',
            'https://stimg.cardekho.com/images/carexteriorimages/930x620/Hyundai/i20/11092/1755058597906/side-view-(left)-90.jpg?tr=w-420',
            'https://stimg.cardekho.com/images/carexteriorimages/930x620/Hyundai/i20/11092/1755058597906/side-view-(left)-90.jpg?tr=w-420',
            'https://stimg.cardekho.com/images/carexteriorimages/930x620/Hyundai/i20/11092/1755058597906/front-right-view-120.jpg?tr=w-420'
          ];
        }
      } else if (brand === 'Mahindra' && modelLower === 'thar') {
        vehicleData.images = [
          'https://imgd.aeplcdn.com/370x208/n/cw/ec/204996/thar-2025-exterior-left-rear-three-quarter.jpeg?isig=0&q=80',
          'https://imgd.aeplcdn.com/370x208/n/cw/ec/210859/thar-facelift-2025-exterior-left-rear-three-quarter.jpeg?isig=0&q=80',
          'https://imgd.aeplcdn.com/370x208/n/cw/ec/204996/thar-2025-exterior-left-rear-three-quarter.jpeg?isig=0&q=80',
          'https://imgd.aeplcdn.com/370x208/n/cw/ec/204996/thar-2025-exterior-left-rear-three-quarter.jpeg?isig=0&q=80',
          'https://imgd.aeplcdn.com/370x208/n/cw/ec/204996/thar-2025-exterior-left-rear-three-quarter.jpeg?isig=0&q=80'
        ];
      } else if (brand === 'Toyota' && modelLower === 'fortuner') {
        if (variantLower.includes('legender')) {
          vehicleData.images = [
            'https://stimg.cardekho.com/images/carexteriorimages/930x620/Toyota/Fortuner-Legender/10229/1749010740042/rear-right-side-48.jpg',
            'https://stimg.cardekho.com/images/carexteriorimages/930x620/Toyota/Fortuner-Legender/10229/1749726924621/exterior-image-165.jpg',
            'https://stimg.cardekho.com/images/carexteriorimages/930x620/Toyota/Fortuner-Legender/10229/1749726924621/exterior-image-166.jpg',
            'https://stimg.cardekho.com/images/carexteriorimages/930x620/Toyota/Fortuner-Legender/10229/1749010740042/rear-right-side-48.jpg',
            'https://stimg.cardekho.com/images/carexteriorimages/930x620/Toyota/Fortuner-Legender/10229/1749726924621/exterior-image-165.jpg'
          ];
        } else {
          vehicleData.images = [
            'https://imgd.aeplcdn.com/370x208/n/cw/ec/44709/fortuner-exterior-right-front-three-quarter-7.jpeg?isig=0&q=80',
            'https://imgd.aeplcdn.com/370x208/n/cw/ec/44709/fortuner-exterior-right-side-view-3.jpeg?isig=0&q=80',
            'https://imgd.aeplcdn.com/370x208/n/cw/ec/44709/fortuner-exterior-right-rear-three-quarter-2.jpeg?isig=0&q=80',
            'https://imgd.aeplcdn.com/370x208/n/cw/ec/44709/fortuner-exterior-right-rear-three-quarter-2.jpeg?isig=0&q=80',
            'https://imgd.aeplcdn.com/370x208/n/cw/ec/44709/fortuner-exterior-left-rear-three-quarter-4.jpeg?isig=0&q=80'
          ];
        }
      }

      setVehicle(vehicleData);
      setSelectedPhoto(vehicleData.images?.[0] || '');

      // Load Q&A list
      const qRes = await getVehicleQuestions(id);
      setQuestions(qRes.questions || []);

      // Load related vehicles
      const listRes = await getVehicles({ brand: res.vehicle.brand, limit: 3 });
      setRelatedCars(listRes.vehicles?.filter((car) => car._id !== id) || []);

      // Check wishlist
      if (isAuthenticated && user?.wishlist) {
        setIsSaved(user.wishlist.includes(id));
      }
    } catch {
      toast.error('Failed to load vehicle details');
      navigate('/vehicles');
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated, user, navigate]);

  useEffect(() => {
    loadAllDetails();
  }, [loadAllDetails]);

  // Wishlist trigger
  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save vehicles.');
      return;
    }
    if (user.role !== 'customer' && user.role !== 'vendor') {
      toast.error('Only Customer and Vendor accounts can save vehicles.');
      return;
    }

    setIsSavedLoading(true);
    try {
      if (isSaved) {
        await removeFromWishlist(id);
        setIsSaved(false);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(id);
        setIsSaved(true);
        toast.success('Added to wishlist');
      }
    } catch {
      toast.error('Wishlist action failed.');
    } finally {
      setIsSavedLoading(false);
    }
  };

  // Compare trigger
  const handleAddToCompare = () => {
    let ids = [];
    const saved = localStorage.getItem('vastu_compare_ids');
    if (saved) ids = saved.split(',').filter(Boolean);

    if (ids.includes(id)) {
      toast.success('Car is already in your comparison tray.');
      navigate('/compare?ids=' + ids.join(','));
      return;
    }

    if (ids.length >= 4) {
      toast.error('Your comparison list is full. Max 4 cars allowed.');
      return;
    }

    ids.push(id);
    localStorage.setItem('vastu_compare_ids', ids.join(','));
    toast.success('Added to Comparison Deck!');
    navigate('/compare?ids=' + ids.join(','));
  };

  // Share trigger
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Listing URL copied to clipboard!');
  };

  // Test Drive booking
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in as a Customer to book test drives.');
      return;
    }
    if (user.role !== 'customer') {
      toast.error('Only Customer accounts can request test drives.');
      return;
    }
    if (!bookingForm.bookingDate || !bookingForm.bookingTime) {
      toast.error('Please select both date and time slot.');
      return;
    }

    setBookingLoading(true);
    try {
      await createBooking({
        vehicleId: id,
        bookingDate: bookingForm.bookingDate,
        bookingTime: bookingForm.bookingTime,
        notes: bookingForm.notes,
      });
      toast.success('Test drive requested! Dealer will contact you.');
      setBookingForm({ bookingDate: '', bookingTime: '10:00 AM', notes: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to submit booking request.');
    } finally {
      setBookingLoading(false);
    }
  };

  // Q&A submit
  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in as a Customer to ask questions.');
      return;
    }
    if (user.role !== 'customer') {
      toast.error('Only Customer accounts can post questions.');
      return;
    }
    if (!questionText.trim()) return;

    setQuestionLoading(true);
    try {
      await askQuestion({
        vehicleId: id,
        questionText: questionText.trim(),
      });
      toast.success('Inquiry submitted. Answers display after approval.');
      setQuestionText('');
      const qRes = await getVehicleQuestions(id);
      setQuestions(qRes.questions || []);
    } catch (err) {
      toast.error(err.message || 'Failed to send inquiry.');
    } finally {
      setQuestionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex min-h-[75vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm text-text-muted">Vehicle details could not be loaded. Please return to the inventory and try again.</p>
        <Button onClick={() => navigate('/vehicles')}>Back to Inventory</Button>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  const has3D = Boolean(vehicle.model3D);
  const hasAnyMediaTab = has3D;

  // Proximity details calculation if user GPS exists
  const vLng = vehicle.location?.coordinates?.[0] || 0;
  const vLat = vehicle.location?.coordinates?.[1] || 0;

  // Image switching handlers for arrow navigation
  const handlePrevImage = () => {
    if (!vehicle.images || vehicle.images.length === 0) return;
    const currentIndex = vehicle.images.indexOf(selectedPhoto || vehicle.images[0]);
    const prevIndex = (currentIndex - 1 + vehicle.images.length) % vehicle.images.length;
    setSelectedPhoto(vehicle.images[prevIndex]);
  };

  const handleNextImage = () => {
    if (!vehicle.images || vehicle.images.length === 0) return;
    const currentIndex = vehicle.images.indexOf(selectedPhoto || vehicle.images[0]);
    const nextIndex = (currentIndex + 1) % vehicle.images.length;
    setSelectedPhoto(vehicle.images[nextIndex]);
  };

  return (
    <div className="container-vastu max py-12">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-1.5 text-xs font-semibold text-text-muted">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/vehicles" className="hover:text-primary-600">Inventory</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-text truncate">{vehicle.brand} {vehicle.model}</span>
      </div>

      {/* Grid wrapper */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* LEFT COLUMN: MEDIA & DETAILS */}
        <div className="lg:col-span-2 space-y-8">
          {/* Media Player Container */}
          <div className="space-y-4">
            {/* Media Viewer Frame */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 aspect-video w-full border border-border shadow-soft flex items-center justify-center group">
              <img
                src={selectedPhoto || vehicle.images?.[0] || fallbackMediaImage}
                className="h-full w-full object-contain"
                alt="Selected Car Frame"
                onError={(e) => {
                  e.currentTarget.src = fallbackMediaImage;
                }}
              />

              {/* Navigation Arrows */}
              {vehicle.images && vehicle.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-slate-950/60 hover:bg-slate-950/80 text-white rounded-full p-2.5 transition-colors border border-white/10 hover:scale-105 active:scale-95 shadow-md flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                    aria-label="Previous Image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-950/60 hover:bg-slate-950/80 text-white rounded-full p-2.5 transition-colors border border-white/10 hover:scale-105 active:scale-95 shadow-md flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                    aria-label="Next Image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail selector for Photos */}
            <div className="flex gap-2 overflow-x-auto pb-1.5">
              {vehicle.images?.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedPhoto(img)}
                  className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${selectedPhoto === img ? 'border-primary-600 scale-[0.98]' : 'border-transparent opacity-80'
                    }`}
                >
                  <img
                    src={img}
                    className="h-full w-full object-cover"
                    alt="thumbnail"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackMediaImage;
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Core Specs Grid */}
          <Card className="border border-border bg-white p-6 shadow-soft rounded-2xl">
            <h3 className="text-lg font-bold text-text mb-4 font-heading">Key Specifications</h3>
            <div className="grid gap-x-8 gap-y-4 grid-cols-2 sm:grid-cols-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-text-muted font-medium block">Ex-Showroom Price</span>
                <span className="font-extrabold text-sm text-text block mt-0.5">{formattedPrice}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-text-muted font-medium block">Year of Mfg</span>
                <span className="font-extrabold text-sm text-text block mt-0.5">{vehicle.year}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-text-muted font-medium block">Mileage / Range</span>
                <span className="font-extrabold text-sm text-text block mt-0.5">
                  {vehicle.mileage} {vehicle.fuel === 'Electric' ? 'km Range' : 'kmpl'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-text-muted font-medium block">Transmission</span>
                <span className="font-extrabold text-sm text-text block mt-0.5">{vehicle.transmission}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-text-muted font-medium block">Fuel Type</span>
                <span className="font-extrabold text-sm text-text block mt-0.5">{vehicle.fuel}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-text-muted font-medium block">Odometer Engine</span>
                <span className="font-extrabold text-sm text-text block mt-0.5">{vehicle.engine}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-text-muted font-medium block">Power Output</span>
                <span className="font-extrabold text-sm text-text block mt-0.5">{vehicle.power}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-text-muted font-medium block">Max Torque</span>
                <span className="font-extrabold text-sm text-text block mt-0.5">{vehicle.torque}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-text-muted font-medium block">Ownership Status</span>
                <span className="font-extrabold text-sm text-text block mt-0.5">{vehicle.ownership}</span>
              </div>
            </div>
          </Card>

          {/* Tabular specs list (boot space, ground clearance, safety or CV specs) */}
          <Card className="border border-border bg-white p-6 shadow-soft rounded-2xl">
            <h3 className="text-lg font-bold text-text mb-4">Detailed Specifications</h3>
            <div className="divide-y divide-border/60 text-xs">
              {vehicle.category === 'commercial' ? (
                <>
                  <div className="flex justify-between py-2.5">
                    <span className="font-semibold text-text-muted">Payload Capacity</span>
                    <span className="font-bold text-text">{vehicle.specifications?.payloadCapacity || 'Not available'}</span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="font-semibold text-text-muted">Gross Vehicle Weight (GVW)</span>
                    <span className="font-bold text-text">{vehicle.specifications?.gvw || 'Not available'}</span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="font-semibold text-text-muted">Cargo Body Type</span>
                    <span className="font-bold text-text">{vehicle.specifications?.bodyType || 'Open Body'}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between py-2.5">
                    <span className="font-semibold text-text-muted">Boot Space capacity</span>
                    <span className="font-bold text-text">{vehicle.specifications?.bootSpace || 'Not available'}</span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="font-semibold text-text-muted">Ground Clearance</span>
                    <span className="font-bold text-text">{vehicle.specifications?.groundClearance || 'Not available'}</span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="font-semibold text-text-muted">Top Rated Speed</span>
                    <span className="font-bold text-text">{vehicle.specifications?.topSpeed || 'Not available'}</span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="font-semibold text-text-muted">0-100 km/h acceleration</span>
                    <span className="font-bold text-text">{vehicle.specifications?.zeroToHundred || 'Not available'}</span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="font-semibold text-text-muted">Safety Crash Rating</span>
                    <span className="font-bold text-text">{vehicle.specifications?.safetyRating || 'Not Rated'}</span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="font-semibold text-text-muted">Dealer Warranty duration</span>
                    <span className="font-bold text-text">{vehicle.specifications?.warranty || 'No Warranty'}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between py-2.5">
                <span className="font-semibold text-text-muted">RTO State Registration</span>
                <span className="font-bold text-text">{vehicle.registration}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="font-semibold text-text-muted">Current Insurance</span>
                <span className="font-bold text-text">{vehicle.insurance}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="font-semibold text-text-muted">Workshop Service Record</span>
                <span className="font-bold text-text">{vehicle.serviceHistory}</span>
              </div>
            </div>
          </Card>

          {/* Description & Features list */}
          <Card className="border border-border bg-white p-6 shadow-soft rounded-2xl">
            <h3 className="text-lg font-bold text-text mb-2">Seller Notes</h3>
            <p className="text-xs text-text-muted leading-relaxed mb-6">{vehicle.description}</p>

            <h3 className="text-sm font-bold text-text mb-3">Vehicle Comfort & Safety Features</h3>
            <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-3 text-xs">
              {vehicle.features?.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-text font-semibold">
                  <Check className="h-4 w-4 text-green-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Location Proximity map wrapper */}
          <Card className="border border-border bg-white p-6 shadow-soft rounded-2xl">
            <h3 className="text-lg font-bold text-text mb-1">Dealership Map Location</h3>
            <p className="text-xs text-text-muted mb-4">Showroom located in {vehicle.location?.city}, {vehicle.location?.state}.</p>
            {/* OpenStreetMap iframe proxy */}
            <div className="overflow-hidden rounded-2xl border border-border aspect-21/9">
              <iframe
                title="OSM Location Map"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src={`https://maps.google.com/maps?q=${vLat},${vLng}&z=13&output=embed`}
              />
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: BOOKINGS & CONTACT FORM */}
        <div className="space-y-6">
          {/* Quick specs overview & action keys */}
          <Card className="border border-border bg-white p-6 shadow-soft rounded-2xl">
            <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">{vehicle.brand}</span>
            <h2 className="text-xl font-bold text-text mt-0.5">{vehicle.name}</h2>
            <p className="text-xs text-text-muted">{vehicle.variant}</p>
            <div className="mt-4 flex items-center gap-1.5">
              <span className="text-2xl font-extrabold text-text">{formattedPrice}</span>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              <Button variant="primary" fullWidth icon={Scale} onClick={handleAddToCompare}>
                Add to Comparison Deck
              </Button>
              <div className="flex gap-2.5">
                <Button variant="outline" className="w-1/2" icon={Heart} isLoading={isSavedLoading} onClick={handleWishlistToggle}>
                  {isSaved ? 'Saved to Wishlist' : 'Save Car'}
                </Button>
                <Button variant="outline" className="w-1/2" icon={Share2} onClick={handleShare}>
                  Share URL
                </Button>
              </div>
            </div>
          </Card>

          {/* Test drive scheduler form */}
          <Card className="border border-border bg-white p-6 shadow-soft rounded-2xl">
            <h3 className="text-md font-bold text-text mb-1 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary-600" />
              Book Test Drive
            </h3>
            <p className="text-xs text-text-muted mb-4">Select your date to schedule drive.</p>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-text-muted block mb-1">Select Date</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.bookingDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, bookingDate: e.target.value })}
                    className="w-full rounded-xl border border-border px-3 py-2 text-xs text-text focus:outline-none focus:border-primary-500 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-text-muted block mb-1">Preferred Time Slot</label>
                  <select
                    value={bookingForm.bookingTime}
                    onChange={(e) => setBookingForm({ ...bookingForm, bookingTime: e.target.value })}
                    className="w-full rounded-xl border border-border px-3 py-2 text-xs text-text focus:outline-none focus:border-primary-500 bg-white"
                  >
                    <option value="10:00 AM">10:00 AM (Morning)</option>
                    <option value="12:00 PM">12:00 PM (Noon)</option>
                    <option value="02:00 PM">02:00 PM (Afternoon)</option>
                    <option value="04:00 PM">04:00 PM (Evening)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-text-muted block mb-1">Inquiry details notes (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Please confirm if documentation is ready."
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    className="w-full rounded-xl border border-border px-3 py-2 text-xs text-text focus:outline-none focus:border-primary-500 bg-white"
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" fullWidth isLoading={bookingLoading} className="bg-secondary-600 hover:bg-secondary-700">
                Book Appointment Slot
              </Button>
            </form>
          </Card>

          {/* Ask question about vehicle form */}
          <Card className="border border-border bg-white p-6 shadow-soft rounded-2xl">
            <h3 className="text-md font-bold text-text mb-1 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary-600" />
              Ask Dealer Question
            </h3>
            <p className="text-xs text-text-muted mb-4 font-medium">Dealer will reply on your dashboard panel.</p>

            <form onSubmit={handleQuestionSubmit} className="space-y-4">
              <textarea
                placeholder="Ask details about battery warranty, road-tax clearance, or price negotiations..."
                rows={3}
                required
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full rounded-xl border border-border p-3 text-xs text-text focus:outline-none focus:border-primary-500 bg-white"
              />

              {/* Chips shortcuts */}
              <div className="flex flex-wrap gap-1.5">
                {quickChips.map((chip, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setQuestionText(chip)}
                    className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2 py-1 text-[9px] font-semibold text-text-muted transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <Button type="submit" variant="primary" fullWidth isLoading={questionLoading}>
                Submit Inquiry
              </Button>
            </form>

            {/* List of public answered questions */}
            {questions.length > 0 && (
              <div className="mt-6 border-t border-border pt-4 space-y-4">
                <h4 className="text-xs font-bold text-text uppercase tracking-wider">Answered Inquiries</h4>
                <div className="space-y-3.5 max-h-60 overflow-y-auto pr-1">
                  {questions.map((q) => (
                    <div key={q._id} className="text-xs space-y-1.5 p-2.5 rounded-xl border border-border bg-slate-50">
                      <p className="font-bold text-text">Q: "{q.questionText}"</p>
                      {q.isAnswered ? (
                        <p className="font-semibold text-primary-600 pl-2">A: "{q.answerText}"</p>
                      ) : (
                        <p className="italic text-text-muted pl-2">Pending response from dealer...</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Showroom Dealer card */}
          {vendorProfile && (
            <Card className="border border-border bg-white p-6 shadow-soft rounded-2xl">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">LISTING DEALER</h3>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-border">
                  <img
                    src={vendorProfile.profilePicture || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=300&q=80'}
                    alt="dealer avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-text text-sm flex items-center gap-1.5">
                    {vendorProfile.businessName}
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                  </h4>
                  <p className="text-[10px] text-text-muted mt-0.5">Vastu Max Certified Partner</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 border-t border-border/40 pt-4 text-xs font-semibold text-text">
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400" /> {vendorProfile.address?.street}, {vendorProfile.address?.city}</p>
                <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400" /> {vehicle.vendor?.phone || 'Contact Showroom'}</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* RELATED CARS SLIDER ROW */}
      {relatedCars.length > 0 && (
        <div className="mt-16 pt-8 border-t border-border/60">
          <h2 className="text-xl font-bold tracking-tight text-text mb-6 font-heading">
            More vehicles from {vehicle.brand}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {relatedCars.map((car) => (
              <VehicleCard key={car._id} vehicle={car} wishlistIds={user?.wishlist || []} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetails;
