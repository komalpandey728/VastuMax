import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  FileText,
  CreditCard,
  Upload,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { submitOnboarding, getVendorProfile } from '../../services/vendorService';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';

const steps = [
  { id: 'business', title: 'Business Info', icon: Building2 },
  { id: 'contact', title: 'Contact Details', icon: FileText },
  { id: 'address', title: 'Business Address', icon: FileText },
  { id: 'bank', title: 'Bank Details', icon: CreditCard },
  { id: 'identity', title: 'Identity Verification', icon: FileText },
  { id: 'businessVerification', title: 'Business Verification', icon: FileText },
  { id: 'showroom', title: 'Showroom Details', icon: FileText },
  { id: 'documents', title: 'Required Documents', icon: FileText },
  { id: 'review', title: 'Review & Submit', icon: CheckCircle },
];

const VendorOnboarding = () => {
  const { loadUser } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingProfile, setExistingProfile] = useState(null);

  const [files, setFiles] = useState({
    profilePicture: null,
    cancelledChequeImage: null,
    businessProofImage: null,
    aadhaarFront: null,
    aadhaarBack: null,
    panCard: null,
    drivingLicense: null,
    gstCertificate: null,
    shopCertificate: null,
    tradeLicense: null,
    msmeCertificate: null,
    dealerAuthLetter: null,
    businessRegCertificate: null,
    showroomImages: [],
    companyLogo: null,
    coverBanner: null,
  });

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useForm({
    defaultValues: {
      businessName: '',
      dealerName: '',
      ownerName: '',
      businessType: '',
      yearsInBusiness: '',
      gstNumber: '',
      panNumber: '',
      aadharNumber: '',
      mobileNumber: '',
      email: '',
      whatsappNumber: '',
      alternateContactNumber: '',
      website: '',
      drivingLicenseNumber: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      landmark: '',
      accountHolderName: '',
      accountNumber: '',
      bankName: '',
      ifscCode: '',
      showroomName: '',
      numVehicles: '',
      workingHours: '',
      servicesOffered: [],
    },
  });

  // Auto-save draft: watch form values and persist
  useEffect(() => {
    const draft = localStorage.getItem('vendor_onboarding_draft');
    if (draft) {
      try {
        const data = JSON.parse(draft);
        Object.keys(data).forEach((k) => {
          if (k in data && data[k] !== undefined) setValue(k, data[k]);
        });
      } catch {
        // ignore parse errors
      }
    }
  }, [setValue]);

  useEffect(() => {
    const sub = watch((value) => {
      try {
        localStorage.setItem('vendor_onboarding_draft', JSON.stringify(value));
      } catch {
        // ignore
      }
    });
    return () => sub.unsubscribe();
  }, [watch]);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const { profile } = await getVendorProfile();
        if (profile) {
          setExistingProfile(profile);
          // Pre-populate fields
          Object.keys(profile).forEach((key) => {
            if (key === 'address' || key === 'bankDetails') {
              Object.keys(profile[key]).forEach((subKey) => {
                setValue(subKey, profile[key][subKey]);
              });
            } else {
              setValue(key, profile[key]);
            }
          });
        }
      } catch {
        toast.error('Failed to retrieve onboarding details');
      } finally {
        setLoading(false);
      }
    };
    checkProfile();
  }, [setValue]);

  const handleFileChange = (e, fieldName) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({
        ...prev,
        [fieldName]: e.target.files[0],
      }));
    }
  };

  const handleMultipleFiles = (e, fieldName) => {
    if (e.target.files && e.target.files.length) {
      const arr = Array.from(e.target.files);
      setFiles((prev) => ({ ...prev, [fieldName]: arr }));
    }
  };

  const handleNext = async () => {
    // Validate current step fields
    let fieldsToValidate = [];
    if (currentStep === 0) {
      fieldsToValidate = ['businessName', 'gstNumber', 'panNumber', 'aadharNumber', 'drivingLicenseNumber'];
    } else if (currentStep === 1) {
      fieldsToValidate = ['street', 'city', 'state', 'zipCode', 'accountHolderName', 'accountNumber', 'bankName', 'ifscCode'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data) => {
    // Check if new documents are attached
    if (!existingProfile) {
      if (!files.cancelledChequeImage || !files.businessProofImage) {
        toast.error('Please upload both Cancelled Cheque and Business Registration proofs');
        return;
      }
    }

    setSubmitting(true);
    const formData = new FormData();
    
    // Append text fields
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    // Append files
    if (files.profilePicture) formData.append('profilePicture', files.profilePicture);
    if (files.cancelledChequeImage) formData.append('cancelledChequeImage', files.cancelledChequeImage);
    if (files.businessProofImage) formData.append('businessProofImage', files.businessProofImage);

    try {
      await submitOnboarding(formData);
      toast.success('KYC documents submitted successfully!');
      await loadUser(); // refresh user session context
      navigate('/vendor/dashboard');
    } catch (err) {
      toast.error(err.message || 'Submission failed. Please verify your fields.');
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

  // Display status overlays based on status
  if (existingProfile && existingProfile.status === 'approved') {
    return (
      <div className="container-vastu max py-20 flex flex-col items-center">
        <Card className="max-w-md p-8 text-center border border-green-100 bg-green-50/20 shadow-soft">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
          <h2 className="mt-6 text-xl font-bold text-text">Dealership Approved</h2>
          <p className="mt-2 text-sm text-text-muted">
            Your Vastu Max partner profile has been fully verified and approved. You have full access to list cars, check bookings, and contact customers.
          </p>
          <Button className="mt-6" onClick={() => navigate('/vendor/dashboard')}>
            Go to Vendor Panel
          </Button>
        </Card>
      </div>
    );
  }

  if (existingProfile && existingProfile.status === 'pending') {
    return (
      <div className="container-vastu max py-20 flex flex-col items-center">
        <Card className="max-w-md p-8 text-center border border-amber-100 bg-amber-50/20 shadow-soft">
          <Clock className="h-16 w-16 text-amber-600 mx-auto animate-pulse" />
          <h2 className="mt-6 text-xl font-bold text-text">KYC Verification In Progress</h2>
          <p className="mt-2 text-sm text-text-muted">
            We are reviewing your dealership KYC details (GST, bank details, and PAN registration). This usually takes less than 24 hours. We will email you once approved!
          </p>
          <Button className="mt-6" variant="secondary" onClick={() => navigate('/vendor/dashboard')}>
            Back to Panel
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950 text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-primary-600/15 blur-[100px] pointer-events-none" />
        <div className="container-vastu max relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary-400 mb-3">Dealer Verification</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">Become a Verified Vastu Max Dealer</h1>
          <p className="text-slate-300 text-base max-w-2xl">
            Complete your KYC to list certified vehicles, display a Verified badge on every listing, and get direct access to 50,000+ buyers across India.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { title: 'Verified Badge', body: 'Approved dealers display a trust badge on every listing — increasing buyer confidence by 3x.' },
              { title: 'Free Listing', body: 'Standard listings are free. Premium placement is available to boost visibility.' },
              { title: 'Secure Payouts', body: 'Bank verification ensures fast, hassle-free payouts with no delays.' },
            ].map((card) => (
              <div key={card.title} className="rounded-2xl bg-white/8 border border-white/12 p-5 backdrop-blur-sm">
                <p className="font-bold text-white text-sm mb-1">{card.title}</p>
                <p className="text-slate-400 text-xs leading-5">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-vastu max py-12">
        <div className="mx-auto max-w-3xl">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-text">
                Step {currentStep + 1} of {steps.length}: <span className="text-primary-600">{steps[currentStep]?.title}</span>
              </p>
              <div className="flex items-center gap-3">
                <p className="text-xs text-text-muted">{Math.round((currentStep / (steps.length - 1)) * 100)}% complete</p>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      const vals = getValues();
                      localStorage.setItem('vendor_onboarding_draft', JSON.stringify(vals));
                      toast.success('Draft saved');
                    } catch {
                      toast.error('Could not save draft');
                    }
                  }}
                  className="text-xs font-semibold text-primary-600 hover:underline"
                >
                  Save Draft
                </button>
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-violet-500 transition-all duration-500"
                style={{ width: `${Math.round((currentStep / (steps.length - 1)) * 100)}%` }}
              />
            </div>
          </div>

          {/* Step dots */}
          <div className="mb-8 flex items-center justify-between gap-1 px-1">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isActive = index === currentStep;
              const Icon = step.icon;
              return (
                <div key={step.id} className="relative flex flex-col items-center flex-1 last:flex-initial">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      isCompleted
                        ? 'border-primary-600 bg-primary-600 text-white'
                        : isActive
                        ? 'border-primary-600 bg-white text-primary-600 shadow-md ring-4 ring-primary-100'
                        : 'border-border bg-white text-text-muted'
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className={`mt-1.5 text-[10px] font-semibold hidden sm:inline text-center leading-tight ${
                    isActive ? 'text-primary-600' : 'text-text-muted'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`absolute left-[60%] top-4.5 -z-10 h-0.5 w-[80%] ${isCompleted ? 'bg-primary-600' : 'bg-border'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {existingProfile?.status === 'rejected' && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-left text-sm text-red-900">
              <AlertTriangle className="h-6 w-6 shrink-0 text-red-600" />
              <div>
                <p className="font-bold">KYC Submission Rejected</p>
                <p className="mt-1 text-xs text-red-800/80">
                  {existingProfile.rejectionReason || 'Please review your uploaded documents and resubmit with clear scans or photos.'}
                </p>
              </div>
            </div>
          )}

          <Card className="border border-border bg-white p-8 shadow-soft rounded-3xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <h3 className="text-lg font-bold text-text">Step 1: Dealership & KYC Identification</h3>
                  <hr className="border-border/60" />
                  
                  <Input
                    label="Dealership / Business Name"
                    placeholder="e.g. Sherry Motors Pvt Ltd"
                    error={errors.businessName?.message}
                    {...register('businessName', { required: 'Business name is required' })}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="GST Number"
                      placeholder="e.g. 27AAAAA1111A1Z1"
                      error={errors.gstNumber?.message}
                      {...register('gstNumber', {
                        required: 'GST identification is required',
                        pattern: {
                          value: /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/,
                          message: 'Invalid Indian GST Number format',
                        },
                      })}
                    />

                    <Input
                      label="PAN Card Number"
                      placeholder="e.g. ABCDE1234F"
                      error={errors.panNumber?.message}
                      {...register('panNumber', {
                        required: 'PAN number is required',
                        pattern: {
                          value: /^[A-Z]{5}\d{4}[A-Z]{1}$/,
                          message: 'Invalid PAN Number format',
                        },
                      })}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Aadhaar UID Number (12 Digit)"
                      placeholder="e.g. 123456789012"
                      error={errors.aadharNumber?.message}
                      {...register('aadharNumber', {
                        required: 'Aadhaar registration is required',
                        pattern: {
                          value: /^\d{12}$/,
                          message: 'Must be exactly 12 digits',
                        },
                      })}
                    />

                    <Input
                      label="Owner Driving License (DL)"
                      placeholder="e.g. MH-14-XXXXXXXXXXX"
                      error={errors.drivingLicenseNumber?.message}
                      {...register('drivingLicenseNumber', { required: 'DL number is required' })}
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <h3 className="text-lg font-bold text-text">Step 2: Business Address & Bank Account</h3>
                  <hr className="border-border/60" />

                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-text">Dealership Address</h4>
                    <Input
                      label="Street Address"
                      placeholder="Showroom no 1, Auto Plaza"
                      error={errors.street?.message}
                      {...register('street', { required: 'Street address is required' })}
                    />
                    <div className="grid gap-4 sm:grid-cols-3">
                      <Input
                        label="City"
                        placeholder="Pune"
                        error={errors.city?.message}
                        {...register('city', { required: 'City is required' })}
                      />
                      <Input
                        label="State"
                        placeholder="Maharashtra"
                        error={errors.state?.message}
                        {...register('state', { required: 'State is required' })}
                      />
                      <Input
                        label="Zip Code"
                        placeholder="411045"
                        error={errors.zipCode?.message}
                        {...register('zipCode', { required: 'Zip code is required' })}
                      />
                    </div>
                  </div>

                  <hr className="border-border/40" />

                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-text">Payout Banking Details</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Account Holder Name"
                        placeholder="e.g. Sherry Motors Ltd"
                        error={errors.accountHolderName?.message}
                        {...register('accountHolderName', { required: 'Account holder name is required' })}
                      />
                      <Input
                        label="Bank Account Number"
                        placeholder="e.g. 50100234567890"
                        error={errors.accountNumber?.message}
                        {...register('accountNumber', { required: 'Account number is required' })}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Bank Name"
                        placeholder="e.g. HDFC Bank"
                        error={errors.bankName?.message}
                        {...register('bankName', { required: 'Bank name is required' })}
                      />
                      <Input
                        label="IFSC Code"
                        placeholder="e.g. HDFC0000104"
                        error={errors.ifscCode?.message}
                        {...register('ifscCode', {
                          required: 'IFSC is required',
                          pattern: {
                            value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                            message: 'Invalid Indian Bank IFSC Code format',
                          },
                        })}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step-contact"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <h3 className="text-lg font-bold text-text">Step 3: Contact Details</h3>
                  <hr className="border-border/60" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Mobile Number" placeholder="Mobile" {...register('mobileNumber', { required: 'Mobile is required' })} />
                    <Input label="Email Address" placeholder="Email" {...register('email', { required: 'Email is required' })} />
                    <Input label="WhatsApp Number" placeholder="WhatsApp" {...register('whatsappNumber')} />
                    <Input label="Alternate Contact" placeholder="Alternate" {...register('alternateContactNumber')} />
                    <Input label="Website (Optional)" placeholder="Website" {...register('website')} />
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step-address"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <h3 className="text-lg font-bold text-text">Step 4: Business Address (Map)</h3>
                  <hr className="border-border/60" />
                  <Input label="Landmark" placeholder="Near ..." {...register('landmark')} />
                  <p className="text-xs text-text-muted">You can pick your location on the map picker below (opens a new window).</p>
                  <div className="mt-3">
                    <Button size="sm" variant="outline" onClick={() => window.open('/map-picker', '_blank')}>Open Map Picker</Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step-bank"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <h3 className="text-lg font-bold text-text">Step 5: Bank Details</h3>
                  <hr className="border-border/60" />
                  <Input label="Account Holder Name" {...register('accountHolderName', { required: 'Required' })} />
                  <Input label="Account Number" {...register('accountNumber', { required: 'Required' })} />
                  <Input label="Confirm Account Number" />
                  <Input label="IFSC" {...register('ifscCode', { required: 'Required' })} />
                  <div className="rounded-2xl border border-border p-4 bg-slate-50/50">
                    <label className="block text-sm font-semibold mb-1">Cancelled Cheque / Passbook</label>
                    <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, 'cancelledChequeImage')} />
                    {files.cancelledChequeImage && <span className="text-xs text-green-600">✓ File attached</span>}
                  </div>
                </motion.div>
              )}

              {currentStep === 5 && (
                <motion.div
                  key="step-identity"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <h3 className="text-lg font-bold text-text">Step 6: Identity Verification (KYC)</h3>
                  <p className="text-xs text-text-muted">Upload Aadhaar front/back, PAN, Driving License.</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm">Aadhaar Card (Front)</label>
                      <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, 'aadhaarFront')} />
                    </div>
                    <div>
                      <label className="block text-sm">Aadhaar Card (Back)</label>
                      <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, 'aadhaarBack')} />
                    </div>
                    <div>
                      <label className="block text-sm">PAN Card</label>
                      <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, 'panCard')} />
                    </div>
                    <div>
                      <label className="block text-sm">Driving License</label>
                      <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, 'drivingLicense')} />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 6 && (
                <motion.div
                  key="step-business-verification"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <h3 className="text-lg font-bold text-text">Step 7: Business Verification</h3>
                  <p className="text-xs text-text-muted">Upload GST, Shop & Establishment, Trade License, Dealer Authorization, MSME (optional).</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm">GST Certificate</label>
                      <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, 'gstCertificate')} />
                    </div>
                    <div>
                      <label className="block text-sm">Shop & Establishment</label>
                      <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, 'shopCertificate')} />
                    </div>
                    <div>
                      <label className="block text-sm">Trade License</label>
                      <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, 'tradeLicense')} />
                    </div>
                    <div>
                      <label className="block text-sm">MSME / UDYAM (Optional)</label>
                      <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, 'msmeCertificate')} />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 7 && (
                <motion.div
                  key="step-showroom"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <h3 className="text-lg font-bold text-text">Step 8: Showroom Details</h3>
                  <hr className="border-border/60" />
                  <Input label="Showroom Name" {...register('showroomName')} />
                  <Input label="Number of Vehicles Available" {...register('numVehicles')} />
                  <Input label="Working Hours" {...register('workingHours')} />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className="flex items-center gap-2"><input type="checkbox" {...register('servicesOffered')} value="Finance" /> Finance Available</label>
                    <label className="flex items-center gap-2"><input type="checkbox" {...register('servicesOffered')} value="Exchange" /> Exchange</label>
                    <label className="flex items-center gap-2"><input type="checkbox" {...register('servicesOffered')} value="Test Drive" /> Test Drive</label>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm">Showroom Photos (Front, Reception, Display, Parking)</label>
                    <input type="file" accept="image/*" multiple onChange={(e) => handleMultipleFiles(e, 'showroomImages')} />
                  </div>
                </motion.div>
              )}

              {currentStep === 8 && (
                <motion.div
                  key="step-docs"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <h3 className="text-lg font-bold text-text">Step 9: Review & Submit</h3>
                  <p className="text-sm text-text-muted">Review the details below and submit. You can edit any section before final submission.</p>
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-lg border border-border p-4 bg-slate-50">
                      <p className="text-xs text-text-muted">Business Name</p>
                      <p className="font-semibold">{getValues().businessName}</p>
                    </div>
                    <div className="rounded-lg border border-border p-4 bg-slate-50">
                      <p className="text-xs text-text-muted">Contact</p>
                      <p className="font-semibold">{getValues().mobileNumber} • {getValues().email}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <h3 className="text-lg font-bold text-text">Step 3: Document Verification Uploads</h3>
                  <p className="text-xs text-text-muted">Upload high-resolution images or PDF documents under 10MB.</p>
                  <hr className="border-border/60" />

                  {/* Profile Picture */}
                  <div>
                    <label className="block text-sm font-semibold text-text mb-1.5">Dealer Profile Picture (Optional)</label>
                    <div className="flex items-center gap-4">
                      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-dashed border-border bg-slate-50">
                        {files.profilePicture ? (
                          <img
                            src={URL.createObjectURL(files.profilePicture)}
                            alt="avatar preview"
                            className="h-full w-full rounded-2xl object-cover"
                          />
                        ) : (
                          <Upload className="h-6 w-6 text-slate-400" />
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'profilePicture')}
                        className="text-xs file:mr-4 file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-primary-600 hover:file:bg-slate-200"
                      />
                    </div>
                  </div>

                  {/* Cancelled Cheque */}
                  <div className="rounded-2xl border border-border p-4 bg-slate-50/50">
                    <label className="block text-sm font-semibold text-text mb-1">
                      Cancelled Cheque / Bank Passbook Copy <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-text-muted mb-3">Used by Vastu Max for verification of account details and dealer payouts.</p>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileChange(e, 'cancelledChequeImage')}
                      className="text-xs file:mr-4 file:rounded-xl file:border-0 file:bg-primary-50 file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-primary-600 hover:file:bg-primary-100"
                    />
                    {existingProfile && !files.cancelledChequeImage && (
                      <span className="mt-1 block text-xs text-green-600">✓ Cancelled cheque copy already on record.</span>
                    )}
                  </div>

                  {/* Business Registration */}
                  <div className="rounded-2xl border border-border p-4 bg-slate-50/50">
                    <label className="block text-sm font-semibold text-text mb-1">
                      Business Proof / GST Registration Copy <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-text-muted mb-3">Copy of GST Certificate or Partnership deed verifying showroom validity.</p>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileChange(e, 'businessProofImage')}
                      className="text-xs file:mr-4 file:rounded-xl file:border-0 file:bg-primary-50 file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-primary-600 hover:file:bg-primary-100"
                    />
                    {existingProfile && !files.businessProofImage && (
                      <span className="mt-1 block text-xs text-green-600">✓ Registration documents already on record.</span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions Footer */}
            <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-6">
              <Button
                type="button"
                variant="secondary"
                icon={ArrowLeft}
                onClick={handleBack}
                className={currentStep === 0 ? 'invisible' : ''}
              >
                Back
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  variant="primary"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={handleNext}
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={submitting}
                  className="bg-secondary-600 hover:bg-secondary-700"
                >
                  Submit KYC Profile
                </Button>
              )}
            </div>
          </form>
          </Card>

          {/* Bottom navigation */}
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 rounded-2xl border border-border bg-white px-6 py-3 text-sm font-semibold text-text shadow-soft hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 rounded-2xl bg-primary-600 hover:bg-primary-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary-900/30 transition-all"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                form="onboarding-form"
                disabled={submitting}
                className="flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 px-8 py-3 text-sm font-bold text-white shadow-lg disabled:opacity-60 transition-all"
              >
                {submitting ? 'Submitting...' : 'Submit for Review'}
                {!submitting && <CheckCircle className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorOnboarding;
