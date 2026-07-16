import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Building2,
  MapPin,
  Landmark,
  ArrowLeft,
  CheckCircle,
  Save,
  Upload,
} from 'lucide-react';
import { getVendorProfile, updateProfile } from '../../services/vendorService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';

const VendorProfileEdit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('business');
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      businessName: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      accountHolderName: '',
      accountNumber: '',
      bankName: '',
      ifscCode: '',
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { profile } = await getVendorProfile();
        if (profile) {
          setProfile(profile);
          // Set form values
          setValue('businessName', profile.businessName || '');
          if (profile.address) {
            setValue('street', profile.address.street || '');
            setValue('city', profile.address.city || '');
            setValue('state', profile.address.state || '');
            setValue('zipCode', profile.address.zipCode || '');
          }
          if (profile.bankDetails) {
            setValue('accountHolderName', profile.bankDetails.accountHolderName || '');
            setValue('accountNumber', profile.bankDetails.accountNumber || '');
            setValue('bankName', profile.bankDetails.bankName || '');
            setValue('ifscCode', profile.bankDetails.ifscCode || '');
          }
          if (profile.profilePicture) {
            setProfilePicPreview(profile.profilePicture);
          }
        }
      } catch (err) {
        toast.error('Failed to load profile details');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setValue]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    const formData = new FormData();
    formData.append('businessName', data.businessName);
    formData.append('street', data.street);
    formData.append('city', data.city);
    formData.append('state', data.state);
    formData.append('zipCode', data.zipCode);
    formData.append('accountHolderName', data.accountHolderName);
    formData.append('accountNumber', data.accountNumber);
    formData.append('bankName', data.bankName);
    formData.append('ifscCode', data.ifscCode);

    if (profilePic) {
      formData.append('profilePicture', profilePic);
    }

    try {
      await updateProfile(formData);
      toast.success('Dealer profile updated successfully!');
      navigate('/vendor/dashboard');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
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
      <div className="mx-auto max-w-3xl">
        {/* Back Link */}
        <button
          onClick={() => navigate('/vendor/dashboard')}
          className="flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-text transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-text">Edit Detailed Profile Info</h1>
            <p className="text-sm text-text-muted mt-1">Update your dealership business details, address, and payout bank accounts.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 text-xs font-semibold text-emerald-700">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            Verified Dealer Account
          </span>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-8 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('business')}
            className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'business'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-text-muted hover:text-text'
            }`}
          >
            <Building2 className="h-4 w-4" /> Dealership Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('address')}
            className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'address'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-text-muted hover:text-text'
            }`}
          >
            <MapPin className="h-4 w-4" /> Showroom Address
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bank')}
            className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'bank'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-text-muted hover:text-text'
            }`}
          >
            <Landmark className="h-4 w-4" /> Payout Bank Details
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="border border-border bg-white p-8 shadow-soft rounded-3xl mb-6">
            {activeTab === 'business' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-text mb-4 font-heading">Dealership Profile Picture</h3>
                  <div className="flex items-center gap-6">
                    <div className="relative h-20 w-20 rounded-2xl bg-slate-100 overflow-hidden border border-border shrink-0">
                      {profilePicPreview ? (
                        <img src={profilePicPreview} alt="Showroom" className="h-full w-full object-cover" />
                      ) : (
                        <Building2 className="h-10 w-10 text-slate-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      )}
                    </div>
                    <div>
                      <label className="flex items-center gap-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-border px-4 py-2.5 text-xs font-semibold text-text cursor-pointer transition-colors">
                        <Upload className="h-4 w-4 text-primary-500" />
                        Choose Showroom Photo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="text-[10px] text-text-muted mt-1.5">PNG or JPG. Recommended aspect ratio 1:1.</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Dealership / Business Name"
                    placeholder="e.g. Sherry Motors Pvt Ltd"
                    error={errors.businessName?.message}
                    {...register('businessName', { required: 'Business name is required' })}
                  />
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-text mb-1.5">GST Registration Status</label>
                    <span className="rounded-xl border border-border bg-slate-50 px-3.5 py-2.5 text-sm text-text-muted font-medium">
                      {profile?.gstNumber || 'Not Uploaded'} (Verified Partner Lock)
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-text mb-1.5">PAN Identification</label>
                    <span className="rounded-xl border border-border bg-slate-50 px-3.5 py-2.5 text-sm text-text-muted font-medium">
                      {profile?.panNumber || 'Not Uploaded'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'address' && (
              <div className="space-y-4">
                <Input
                  label="Street Address / Area"
                  placeholder="e.g. Shop 102, Auto Plaza, Baner Road"
                  error={errors.street?.message}
                  {...register('street', { required: 'Street address is required' })}
                />
                <div className="grid gap-4 sm:grid-cols-3">
                  <Input
                    label="City"
                    placeholder="e.g. Pune"
                    error={errors.city?.message}
                    {...register('city', { required: 'City is required' })}
                  />
                  <Input
                    label="State"
                    placeholder="e.g. Maharashtra"
                    error={errors.state?.message}
                    {...register('state', { required: 'State is required' })}
                  />
                  <Input
                    label="Zip Code"
                    placeholder="e.g. 411045"
                    error={errors.zipCode?.message}
                    {...register('zipCode', { required: 'Zip code is required' })}
                  />
                </div>
              </div>
            )}

            {activeTab === 'bank' && (
              <div className="space-y-4">
                <Input
                  label="Account Holder Name"
                  placeholder="e.g. Sherry Motors Ltd"
                  error={errors.accountHolderName?.message}
                  {...register('accountHolderName', { required: 'Account holder name is required' })}
                />
                <Input
                  label="Account Number"
                  placeholder="e.g. 123456789012345"
                  error={errors.accountNumber?.message}
                  {...register('accountNumber', { required: 'Account number is required' })}
                />
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
                    {...register('ifscCode', { required: 'IFSC code is required' })}
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Action Row */}
          <div className="flex items-center justify-between border-t border-border/60 pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/vendor/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={Save}
              isLoading={saving}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorProfileEdit;
