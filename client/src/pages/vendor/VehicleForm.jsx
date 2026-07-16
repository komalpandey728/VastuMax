import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  Car,
  FileSpreadsheet,
  MapPin,
  Upload,
  ArrowRight,
  Plus,
  Trash,
} from 'lucide-react';
import { createVehicle, getVehicle, updateVehicle } from '../../services/vehicleService';
import { FUEL_TYPES, TRANSMISSION_TYPES, OWNERSHIP_TYPES } from '../../constants';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';

const CAR_BRANDS = ['Maruti Suzuki', 'Hyundai', 'Tata Motors', 'Mahindra', 'Toyota', 'Kia', 'Honda', 'BMW', 'Tesla', 'Skoda', 'Jeep', 'MG'];
const CV_BRANDS = ['Tata Motors', 'Ashok Leyland', 'Mahindra', 'Eicher', 'BharatBenz', 'Force Motors'];

const CAR_BODY_TYPES = ['Hatchback', 'Sedan', 'SUV', 'MUV / MPV', 'Luxury', 'Coupe', 'Electric'];
const CV_BODY_TYPES = ['Pickup', 'Mini Truck', 'Truck', 'Tempo', 'Bus', 'Tractor'];

const tabs = [
  { id: 'basic', title: 'Basic Info', icon: Car },
  { id: 'specs', title: 'Engine & Specs', icon: FileSpreadsheet },
  { id: 'details', title: 'Location & Docs', icon: MapPin },
  { id: 'media', title: 'Media Files', icon: Upload },
];

const VehicleForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('basic');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const [existingImages, setExistingImages] = useState([]);
  const [existing360, setExisting360] = useState([]);

  // Dynamic Array States
  const [featureList, setFeatureList] = useState([]);
  const [newFeature, setNewFeature] = useState('');
  const [proList, setProList] = useState([]);
  const [newPro, setNewPro] = useState('');
  const [conList, setConList] = useState([]);
  const [newCon, setNewCon] = useState('');

  // File lists
  const [images, setImages] = useState([]);
  const [threeSixtyImages, setThreeSixtyImages] = useState([]);
  const [video, setVideo] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      brand: '',
      model: '',
      variant: '',
      year: new Date().getFullYear(),
      price: '',
      fuel: 'Petrol',
      transmission: 'Manual',
      engine: '',
      power: '',
      torque: '',
      mileage: '',
      ownership: 'First Owner',
      insurance: 'Comprehensive',
      serviceHistory: 'Full Dealership History',
      registration: '',
      description: '',
      city: '',
      state: '',
      latitude: '',
      longitude: '',
      bootSpace: '',
      groundClearance: '',
      topSpeed: '',
      zeroToHundred: '',
      safetyRating: 'Not Rated',
      warranty: 'No Warranty',
      color: '',
      bodyType: 'Sedan',
      status: 'active',
      category: 'car',
      payloadCapacity: '',
      gvw: '',
      numTyres: '4',
    },
  });

  const watchCategory = watch('category') || 'car';

  // Attempt to auto-locate Coordinates using HTML5 Geolocation API
  const handleAutoLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('latitude', position.coords.latitude);
          setValue('longitude', position.coords.longitude);
          toast.success('Coordinates updated from browser GPS.');
        },
        () => {
          toast.error('Could not access current location. Please fill manually.');
        }
      );
    } else {
      toast.error('Browser geolocation not supported.');
    }
  };

  useEffect(() => {
    if (isEditMode) {
      const fetchVehicleData = async () => {
        try {
          const { vehicle } = await getVehicle(id);
          // Populate fields
          Object.keys(vehicle).forEach((key) => {
            if (key === 'location') {
              setValue('city', vehicle.location.city);
              setValue('state', vehicle.location.state);
              setValue('latitude', vehicle.location.coordinates[1]);
              setValue('longitude', vehicle.location.coordinates[0]);
            } else if (key === 'specifications') {
              Object.keys(vehicle.specifications).forEach((specKey) => {
                setValue(specKey, vehicle.specifications[specKey]);
              });
              setProList(vehicle.specifications.pros || []);
              setConList(vehicle.specifications.cons || []);
            } else {
              setValue(key, vehicle[key]);
            }
          });
          setFeatureList(vehicle.features || []);
          setExistingImages(vehicle.images || []);
          setExisting360(vehicle.threeSixtyImages || []);
        } catch {
          toast.error('Failed to retrieve vehicle details.');
          navigate('/vendor/dashboard');
        } finally {
          setLoading(false);
        }
      };
      fetchVehicleData();
    }
  }, [id, isEditMode, setValue, navigate]);

  // Pre-populate fields from URL parameters for new listings (e.g. fast path Sell flow)
  useEffect(() => {
    if (!isEditMode) {
      const searchParams = new URLSearchParams(window.location.search);
      const categoryParam = searchParams.get('category');
      const brandParam = searchParams.get('brand');
      const modelParam = searchParams.get('model');
      const yearParam = searchParams.get('year');
      const fuelParam = searchParams.get('fuel');
      const regParam = searchParams.get('reg');

      if (categoryParam) setValue('category', categoryParam);
      if (brandParam) setValue('brand', brandParam);
      if (modelParam) {
        setValue('model', modelParam);
        setValue('name', `${brandParam || ''} ${modelParam}`.trim());
      }
      if (yearParam) setValue('year', parseInt(yearParam, 10));
      if (fuelParam) setValue('fuel', fuelParam);
      if (regParam) setValue('registration', regParam);
    }
  }, [isEditMode, setValue]);

  const addFeature = () => {
    if (newFeature.trim() && !featureList.includes(newFeature.trim())) {
      setFeatureList([...featureList, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (idx) => {
    setFeatureList(featureList.filter((_, i) => i !== idx));
  };

  const addPro = () => {
    if (newPro.trim() && !proList.includes(newPro.trim())) {
      setProList([...proList, newPro.trim()]);
      setNewPro('');
    }
  };

  const removePro = (idx) => {
    setProList(proList.filter((_, i) => i !== idx));
  };

  const addCon = () => {
    if (newCon.trim() && !conList.includes(newCon.trim())) {
      setConList([...conList, newCon.trim()]);
      setNewCon('');
    }
  };

  const removeCon = (idx) => {
    setConList(conList.filter((_, i) => i !== idx));
  };

  const onSubmit = async (data) => {
    // Validate main images (new files + remaining existing images)
    const totalImagesCount = images.length + existingImages.length;
    if (totalImagesCount < 5 || totalImagesCount > 10) {
      toast.error('You must provide between 5 and 10 vehicle photos.');
      setActiveTab('media');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();

    // Appending simple root fields
    const textFields = [
      'name', 'brand', 'model', 'variant', 'year', 'price',
      'fuel', 'transmission', 'engine', 'power', 'torque',
      'mileage', 'ownership', 'insurance', 'serviceHistory',
      'registration', 'description', 'city', 'state',
      'latitude', 'longitude', 'status', 'category',
    ];

    textFields.forEach((field) => {
      formData.append(field, data[field]);
    });

    // Formatting Nested Specifications
    const specifications = watchCategory === 'commercial' ? {
      payloadCapacity: data.payloadCapacity || '',
      gvw: data.gvw || '',
      numTyres: data.numTyres || '',
      bodyType: data.bodyType || 'Pickup',
      pros: proList,
      cons: conList,
    } : {
      bootSpace: data.bootSpace || '',
      groundClearance: data.groundClearance || '',
      topSpeed: data.topSpeed || '',
      zeroToHundred: data.zeroToHundred || '',
      safetyRating: data.safetyRating || 'Not Rated',
      warranty: data.warranty || 'No Warranty',
      color: data.color || '',
      bodyType: data.bodyType || 'Sedan',
      pros: proList,
      cons: conList,
    };

    formData.append('specifications', JSON.stringify(specifications));
    formData.append('features', JSON.stringify(featureList));

    if (isEditMode) {
      formData.append('existingImages', JSON.stringify(existingImages));
      formData.append('existing360', JSON.stringify(existing360));
    }

    // Append new uploaded files
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }
    for (let i = 0; i < threeSixtyImages.length; i++) {
      formData.append('threeSixtyImages', threeSixtyImages[i]);
    }
    if (video) {
      formData.append('video', video);
    }

    try {
      if (isEditMode) {
        await updateVehicle(id, formData);
        toast.success('Vehicle listing updated successfully.');
      } else {
        await createVehicle(formData);
        toast.success('Vehicle listing created successfully!');
      }
      navigate('/vendor/dashboard');
    } catch (err) {
      toast.error(err.message || 'Failed to submit vehicle listing.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container-vastu max py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {isEditMode ? 'Edit Vehicle Listing' : 'Upload New Vehicle'}
            </h1>
            <p className="mt-1 text-sm text-text-muted">
              Provide certified metrics and specifications to sell your car.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate('/vendor/dashboard')}>
            Cancel
          </Button>
        </div>

        {/* Tab Headers */}
        <div className="mb-6 flex overflow-x-auto rounded-xl bg-slate-100 p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.title}
              </button>
            );
          })}
        </div>

        {/* Form Container */}
        <Card className="border border-border bg-white p-8 shadow-soft rounded-3xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* TAB 1: BASIC INFO */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <h3 className="text-lg font-bold text-text">Basic Details</h3>
                  
                  <div className="inline-flex rounded-xl bg-slate-100 p-1">
                    <button
                      type="button"
                      onClick={() => {
                        setValue('category', 'car');
                        setValue('brand', '');
                        setValue('bodyType', CAR_BODY_TYPES[0]);
                      }}
                      className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                        watchCategory === 'car' ? 'bg-white text-primary-600 shadow-sm' : 'text-text-muted hover:text-text'
                      }`}
                    >
                      Car
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setValue('category', 'commercial');
                        setValue('brand', '');
                        setValue('bodyType', CV_BODY_TYPES[0]);
                      }}
                      className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                        watchCategory === 'commercial' ? 'bg-white text-primary-600 shadow-sm' : 'text-text-muted hover:text-text'
                      }`}
                    >
                      Commercial Vehicle
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Vehicle Title / Name"
                    placeholder={watchCategory === 'commercial' ? 'e.g. Tata Ace Gold Diesel' : 'e.g. Tesla Model Y Performance'}
                    error={errors.name?.message}
                    {...register('name', { required: 'Name is required' })}
                  />
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-text mb-1">Manufacturer Brand</label>
                    <select
                      {...register('brand', { required: 'Brand is required' })}
                      className="rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text focus:border-primary-500 focus:outline-none h-[42px]"
                    >
                      <option value="">Select Brand</option>
                      {(watchCategory === 'commercial' ? CV_BRANDS : CAR_BRANDS).map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                    {errors.brand && <span className="mt-1 text-xs text-red-500">{errors.brand.message}</span>}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Input
                    label="Model"
                    placeholder="e.g. Model Y"
                    error={errors.model?.message}
                    {...register('model', { required: 'Model is required' })}
                  />
                  <Input
                    label="Variant / Trim"
                    placeholder="e.g. Performance AWD"
                    error={errors.variant?.message}
                    {...register('variant', { required: 'Variant details are required' })}
                  />
                  <Input
                    label="Manufacturing Year"
                    type="number"
                    placeholder="e.g. 2024"
                    error={errors.year?.message}
                    {...register('year', { required: 'Year is required' })}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Input
                    label="Price (INR ₹)"
                    type="number"
                    placeholder="e.g. 4500000"
                    error={errors.price?.message}
                    {...register('price', { required: 'Price is required' })}
                  />
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-text mb-1">Fuel Type</label>
                    <select
                      {...register('fuel')}
                      className="rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text focus:border-primary-500 focus:outline-none"
                    >
                      {FUEL_TYPES.map((fuel) => (
                        <option key={fuel} value={fuel}>
                          {fuel}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-text mb-1">Transmission</label>
                    <select
                      {...register('transmission')}
                      className="rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text focus:border-primary-500 focus:outline-none"
                    >
                      {TRANSMISSION_TYPES.map((trans) => (
                        <option key={trans} value={trans}>
                          {trans}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-text mb-1">Ownership Type</label>
                    <select
                      {...register('ownership')}
                      className="rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text focus:border-primary-500 focus:outline-none"
                    >
                      {OWNERSHIP_TYPES.map((owner) => (
                        <option key={owner} value={owner}>
                          {owner}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-text mb-1">Body Type</label>
                    <select
                      {...register('bodyType')}
                      className="rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text focus:border-primary-500 focus:outline-none"
                    >
                      {(watchCategory === 'commercial' ? CV_BODY_TYPES : CAR_BODY_TYPES).map((body) => (
                        <option key={body} value={body}>
                          {body}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-text mb-1">Listing Status</label>
                    <select
                      {...register('status')}
                      className="rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text focus:border-primary-500 focus:outline-none"
                    >
                      <option value="active">Active (Listed)</option>
                      <option value="draft">Draft (Hidden)</option>
                      <option value="sold">Sold (Out of stock)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="button" icon={ArrowRight} iconPosition="right" onClick={() => setActiveTab('specs')}>
                    Next: Engine & Specs
                  </Button>
                </div>
              </div>
            )}

            {/* TAB 2: SPECIFICATIONS */}
            {activeTab === 'specs' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-text">
                  {watchCategory === 'commercial' ? 'Commercial Specifications & Payload Metrics' : 'Engine Specifications & Performance Metrics'}
                </h3>
                <hr className="border-border/60" />
                
                <div className="grid gap-4 sm:grid-cols-3">
                  <Input
                    label="Engine Capacity"
                    placeholder="e.g. 1998 cc or Dual Motor"
                    error={errors.engine?.message}
                    {...register('engine', { required: 'Engine spec is required' })}
                  />
                  <Input
                    label="Power Output"
                    placeholder="e.g. 248 bhp @ 5200 rpm"
                    error={errors.power?.message}
                    {...register('power', { required: 'Power spec is required' })}
                  />
                  <Input
                    label="Torque Output"
                    placeholder="e.g. 350 Nm @ 1450 rpm"
                    error={errors.torque?.message}
                    {...register('torque', { required: 'Torque spec is required' })}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Input
                    label="Mileage (kmpl or km Range)"
                    type="number"
                    step="any"
                    placeholder="e.g. 15.2"
                    error={errors.mileage?.message}
                    {...register('mileage', { required: 'Mileage is required' })}
                  />
                  {watchCategory === 'commercial' ? (
                    <>
                      <Input label="Payload Capacity (e.g. 1.5 Tons)" placeholder="1.5 Tons" {...register('payloadCapacity')} />
                      <Input label="Gross Vehicle Weight (e.g. 3.2 Tons)" placeholder="3.2 Tons" {...register('gvw')} />
                    </>
                  ) : (
                    <>
                      <Input label="Boot Space (e.g. 480 L)" placeholder="480 L" {...register('bootSpace')} />
                      <Input label="Ground Clearance (e.g. 165 mm)" placeholder="165 mm" {...register('groundClearance')} />
                    </>
                  )}
                </div>

                {watchCategory === 'commercial' ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-text mb-1">Number of Tyres</label>
                      <select
                        {...register('numTyres')}
                        className="rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text focus:border-primary-500 focus:outline-none"
                      >
                        <option value="4">4 Tyres</option>
                        <option value="6">6 Tyres</option>
                        <option value="10">10 Tyres</option>
                        <option value="12">12 Tyres</option>
                        <option value="14">14 Tyres</option>
                        <option value="16+">16+ Tyres</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-4">
                    <Input label="Top Speed (km/h)" placeholder="250" {...register('topSpeed')} />
                    <Input label="0-100 km/h (sec)" placeholder="5.8" {...register('zeroToHundred')} />
                    <Input label="Safety Rating" placeholder="5 Star GNCAP" {...register('safetyRating')} />
                    <Input label="Warranty details" placeholder="2 Years Factory" {...register('warranty')} />
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Exterior Color" placeholder={watchCategory === 'commercial' ? 'Premium Yellow' : 'Mineral White Metallic'} {...register('color')} />
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-text mb-1">Add Features</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="e.g. Panoramic Sunroof"
                        className="flex-1 rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text focus:border-primary-500 focus:outline-none"
                      />
                      <Button type="button" variant="secondary" onClick={addFeature} className="rounded-xl px-3">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {/* Features Tags list */}
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {featureList.map((f, i) => (
                        <span key={i} className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-text">
                          {f}
                          <button type="button" onClick={() => removeFeature(i)} className="text-slate-400 hover:text-red-500">
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pros and Cons */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Pros */}
                  <div>
                    <label className="text-xs font-semibold text-text mb-1">Pros</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newPro}
                        onChange={(e) => setNewPro(e.target.value)}
                        placeholder="e.g. Insane acceleration"
                        className="flex-1 rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text focus:border-primary-500 focus:outline-none"
                      />
                      <Button type="button" variant="secondary" onClick={addPro} className="rounded-xl px-3">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-2 flex flex-col gap-1">
                      {proList.map((p, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg bg-green-50 px-2.5 py-1 text-xs text-green-900 border border-green-100">
                          <span>✓ {p}</span>
                          <button type="button" onClick={() => removePro(i)} className="text-green-400 hover:text-red-500">
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cons */}
                  <div>
                    <label className="text-xs font-semibold text-text mb-1">Cons</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCon}
                        onChange={(e) => setNewCon(e.target.value)}
                        placeholder="e.g. Slightly stiff suspension"
                        className="flex-1 rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text focus:border-primary-500 focus:outline-none"
                      />
                      <Button type="button" variant="secondary" onClick={addCon} className="rounded-xl px-3">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-2 flex flex-col gap-1">
                      {conList.map((c, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg bg-red-50 px-2.5 py-1 text-xs text-red-900 border border-red-100">
                          <span>✗ {c}</span>
                          <button type="button" onClick={() => removeCon(i)} className="text-red-400 hover:text-red-500">
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="secondary" onClick={() => setActiveTab('basic')}>
                    Back
                  </Button>
                  <Button type="button" icon={ArrowRight} iconPosition="right" onClick={() => setActiveTab('details')}>
                    Next: Location & Docs
                  </Button>
                </div>
              </div>
            )}

            {/* TAB 3: LOCATION & HISTORY */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-text">Vehicle Location, State RTO & History</h3>
                <hr className="border-border/60" />

                <div className="grid gap-4 sm:grid-cols-3">
                  <Input label="Insurance Status" placeholder="Comprehensive active till 2027" {...register('insurance')} />
                  <Input label="Service History Details" placeholder="Full service records available" {...register('serviceHistory')} />
                  <Input
                    label="Registration Number / RTO State"
                    placeholder="e.g. MH-12-FE-4532"
                    error={errors.registration?.message}
                    {...register('registration', { required: 'Registration RTO details are required' })}
                  />
                </div>

                <div className="space-y-4 rounded-2xl border border-border p-4 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-text">Proximity Location Coordinates</h4>
                    <Button type="button" variant="secondary" size="sm" onClick={handleAutoLocate}>
                      Use Current GPS Coordinates
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-4">
                    <Input
                      label="Latitude"
                      placeholder="e.g. 18.5204"
                      error={errors.latitude?.message}
                      {...register('latitude', { required: 'Latitude is required' })}
                    />
                    <Input
                      label="Longitude"
                      placeholder="e.g. 73.8567"
                      error={errors.longitude?.message}
                      {...register('longitude', { required: 'Longitude is required' })}
                    />
                    <Input
                      label="City Location"
                      placeholder="Pune"
                      error={errors.city?.message}
                      {...register('city', { required: 'City location is required' })}
                    />
                    <Input
                      label="State"
                      placeholder="Maharashtra"
                      error={errors.state?.message}
                      {...register('state', { required: 'State is required' })}
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-text mb-1">Detailed Description</label>
                  <textarea
                    rows={4}
                    placeholder="Provide a detailed write-up about the car condition, highway metrics, features etc."
                    className="rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-text focus:border-primary-500 focus:outline-none"
                    {...register('description', { required: 'Description is required' })}
                  />
                  {errors.description && <span className="mt-1 text-xs text-red-500">{errors.description.message}</span>}
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="secondary" onClick={() => setActiveTab('specs')}>
                    Back
                  </Button>
                  <Button type="button" icon={ArrowRight} iconPosition="right" onClick={() => setActiveTab('media')}>
                    Next: Media Files
                  </Button>
                </div>
              </div>
            )}

            {/* TAB 4: MEDIA UPLOADS */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-text">Upload Images & Video</h3>
                <hr className="border-border/60" />

                {/* Main Images */}
                <div className="rounded-2xl border border-border p-4 bg-slate-50/50">
                  <label className="block text-sm font-semibold text-text mb-1">
                    Upload Vehicle Images (5-10 Photos) <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-text-muted mb-3">Upload clear exterior, interior, dashboard, and tire photos.</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setImages(Array.from(e.target.files))}
                    className="text-xs file:mr-4 file:rounded-xl file:border-0 file:bg-primary-50 file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-primary-600 hover:file:bg-primary-100"
                  />
                  {existingImages.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold mb-1 text-green-600">Existing Images on Record ({existingImages.length}):</p>
                      <div className="flex flex-wrap gap-2">
                        {existingImages.map((src, i) => (
                          <div key={i} className="relative h-12 w-20 rounded-lg overflow-hidden border border-border">
                            <img src={src} className="h-full w-full object-cover" alt="prev" />
                            <button
                              type="button"
                              onClick={() => setExistingImages(existingImages.filter((_, idx) => idx !== i))}
                              className="absolute top-0 right-0 bg-red-600 text-white rounded-bl h-4 w-4 flex items-center justify-center text-[10px]"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 360 images removed */}

                {/* Video walkthrough */}
                <div className="rounded-2xl border border-border p-4 bg-slate-50/50">
                  <label className="block text-sm font-semibold text-text mb-1">
                    Walkthrough Video MP4
                  </label>
                  <p className="text-xs text-text-muted mb-3">Upload a clean vehicle walkthrough or startup exhaust sound video clip.</p>
                  <input
                    type="file"
                    accept="video/mp4,video/quicktime"
                    onChange={(e) => setVideo(e.target.files[0])}
                    className="text-xs file:mr-4 file:rounded-xl file:border-0 file:bg-primary-50 file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-primary-600 hover:file:bg-primary-100"
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="secondary" onClick={() => setActiveTab('details')}>
                    Back
                  </Button>
                  <Button type="submit" variant="primary" isLoading={submitting} className="bg-secondary-600 hover:bg-secondary-700">
                    {isEditMode ? 'Save Listing Changes' : 'Submit Listing to Catalog'}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};

export default VehicleForm;
