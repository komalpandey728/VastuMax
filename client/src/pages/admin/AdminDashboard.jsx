import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Store,
  Car,
  CheckSquare,
  ShieldCheck,
  Ban,
  UserCheck,
  MessageSquare,
  Trash,
  Plus,
  Eye,
  FileImage,
  Globe,
} from 'lucide-react';
import {
  getAdminStats,
  getVendors,
  approveVendor,
  rejectVendor,
  getCustomers,
  toggleUserStatus,
  getBrands,
  createBrand,
  deleteBrand,
  getCategories,
  createCategory,
  deleteCategory,
  getCities,
  createCity,
  deleteCity,
  getPendingQuestions,
  approveQuestion,
  deleteQuestion,
} from '../../services/adminService';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'overview', title: 'System Overview' },
  { id: 'kyc', title: 'KYC Reviews' },
  { id: 'accounts', title: 'Manage Accounts' },
  { id: 'questions', title: 'Q&A Moderation' },
  { id: 'metadata', title: 'Metadata Lists' },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentVehicles, setRecentVehicles] = useState([]);

  // Data collections
  const [pendingVendors, setPendingVendors] = useState([]);
  const [allVendors, setAllVendors] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [pendingQuestions, setPendingQuestions] = useState([]);

  // Metadata Collections
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  // Metadata creation form states
  const [newBrand, setNewBrand] = useState({ name: '', logo: '' });
  const [newCategory, setNewCategory] = useState({ name: '', icon: 'Car' });
  const [newCity, setNewCity] = useState({ name: '', state: '' });

  // Modal Review States
  const [selectedVendorProfile, setSelectedVendorProfile] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  // Fetch functions wrap
  const loadStats = useCallback(async () => {
    try {
      const data = await getAdminStats();
      setStats(data.stats);
      setRecentUsers(data.recentUsers || []);
      setRecentVehicles(data.recentVehicles || []);
    } catch {
      toast.error('Failed to load system stats');
    }
  }, []);

  const loadKycRequests = useCallback(async () => {
    try {
      const data = await getVendors('pending');
      setPendingVendors(data.profiles || []);
    } catch {
      toast.error('Failed to load pending KYC reviews');
    }
  }, []);

  const loadAllAccounts = useCallback(async () => {
    try {
      const vendorData = await getVendors();
      const customerData = await getCustomers();
      setAllVendors(vendorData.profiles || []);
      setCustomers(customerData.customers || []);
    } catch {
      toast.error('Failed to load user accounts');
    }
  }, []);

  const loadPendingQuestions = useCallback(async () => {
    try {
      const data = await getPendingQuestions();
      setPendingQuestions(data.questions || []);
    } catch {
      toast.error('Failed to load pending Q&As');
    }
  }, []);

  const loadMetadata = useCallback(async () => {
    try {
      const brandData = await getBrands();
      const catData = await getCategories();
      const cityData = await getCities();
      setBrands(brandData.brands || []);
      setCategories(catData.categories || []);
      setCities(cityData.cities || []);
    } catch {
      toast.error('Failed to load metadata lists');
    }
  }, []);

  // Root Initial Loader
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await Promise.all([
        loadStats(),
        loadKycRequests(),
        loadAllAccounts(),
        loadPendingQuestions(),
        loadMetadata(),
      ]);
      setLoading(false);
    };
    initData();
  }, [loadStats, loadKycRequests, loadAllAccounts, loadPendingQuestions, loadMetadata]);

  // Vendor approvals
  const handleApproveVendor = async (profileId) => {
    try {
      await approveVendor(profileId);
      toast.success('Dealership approved successfully!');
      setSelectedVendorProfile(null);
      await loadKycRequests();
      await loadStats();
      await loadAllAccounts();
    } catch {
      toast.error('Failed to approve vendor');
    }
  };

  const handleRejectVendor = async (profileId) => {
    if (!rejectionReason.trim()) {
      toast.error('Please enter a rejection reason');
      return;
    }
    try {
      await rejectVendor(profileId, rejectionReason);
      toast.success('KYC application rejected.');
      setSelectedVendorProfile(null);
      setRejectionReason('');
      setShowRejectForm(false);
      await loadKycRequests();
      await loadStats();
      await loadAllAccounts();
    } catch {
      toast.error('Failed to reject vendor application');
    }
  };

  // Toggle user active status
  const handleToggleUser = async (userId) => {
    try {
      const data = await toggleUserStatus(userId);
      toast.success(data.message);
      await loadAllAccounts();
      await loadStats();
    } catch {
      toast.error('Failed to toggle user status');
    }
  };

  // Question Moderation
  const handleApproveQuestion = async (id) => {
    try {
      await approveQuestion(id);
      toast.success('Question approved for public view');
      await loadPendingQuestions();
    } catch {
      toast.error('Failed to approve question');
    }
  };

  const handleRejectQuestion = async (id) => {
    try {
      await deleteQuestion(id);
      toast.success('Question deleted');
      await loadPendingQuestions();
    } catch {
      toast.error('Failed to delete question');
    }
  };

  // Metadata Create/Delete Operations
  const handleAddBrand = async () => {
    if (!newBrand.name.trim()) return;
    try {
      await createBrand(newBrand);
      toast.success('Brand added');
      setNewBrand({ name: '', logo: '' });
      await loadMetadata();
    } catch {
      toast.error('Failed to create brand');
    }
  };

  const handleRemoveBrand = async (id) => {
    try {
      await deleteBrand(id);
      toast.success('Brand deleted');
      await loadMetadata();
    } catch {
      toast.error('Failed to delete brand');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) return;
    try {
      await createCategory(newCategory);
      toast.success('Category created');
      setNewCategory({ name: '', icon: 'Car' });
      await loadMetadata();
    } catch {
      toast.error('Failed to create category');
    }
  };

  const handleRemoveCategory = async (id) => {
    try {
      await deleteCategory(id);
      toast.success('Category deleted');
      await loadMetadata();
    } catch {
      toast.error('Failed to delete category');
    }
  };

  const handleAddCity = async () => {
    if (!newCity.name.trim() || !newCity.state.trim()) return;
    try {
      await createCity(newCity);
      toast.success('City registered');
      setNewCity({ name: '', state: '' });
      await loadMetadata();
    } catch {
      toast.error('Failed to register city');
    }
  };

  const handleRemoveCity = async (id) => {
    try {
      await deleteCity(id);
      toast.success('City deleted');
      await loadMetadata();
    } catch {
      toast.error('Failed to delete city');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container-vastu max py-12">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight">Admin Console</h1>
              <Badge variant="danger">System Superuser</Badge>
            </div>
            <p className="mt-1 text-sm text-text-muted">
              Configure system features, review vendor submissions, and monitor inventory statistics.
            </p>
          </div>
        </div>

        {/* Tab Headers */}
        <div className="flex overflow-x-auto rounded-xl bg-slate-100 p-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                {tab.title}
              </button>
            );
          })}
        </div>

        {/* TAB 1: SYSTEM OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats widgets */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="flex items-center gap-4 border border-border bg-white p-6 shadow-soft rounded-2xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-text-muted font-medium">Total Customers</p>
                  <h3 className="text-2xl font-bold text-text">{stats?.totalCustomers}</h3>
                </div>
              </Card>

              <Card className="flex items-center gap-4 border border-border bg-white p-6 shadow-soft rounded-2xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <Store className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-text-muted font-medium">Registered Dealers</p>
                  <h3 className="text-2xl font-bold text-text">{stats?.totalVendors}</h3>
                </div>
              </Card>

              <Card className="flex items-center gap-4 border border-border bg-white p-6 shadow-soft rounded-2xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <Car className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-text-muted font-medium">Vehicles Listed</p>
                  <h3 className="text-2xl font-bold text-text">{stats?.totalVehicles}</h3>
                </div>
              </Card>

              <Card className="flex items-center gap-4 border border-border bg-white p-6 shadow-soft rounded-2xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <CheckSquare className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-text-muted font-medium">Pending KYC Reviews</p>
                  <h3 className="text-2xl font-bold text-text">{stats?.pendingVendors}</h3>
                </div>
              </Card>
            </div>

            {/* Split panels: Recent Listings & Signups */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Recent Vehicles */}
              <Card className="border border-border bg-white p-6 shadow-soft rounded-2xl">
                <h3 className="text-lg font-bold text-text mb-4">Latest Vehicle Listings</h3>
                <div className="divide-y divide-border">
                  {recentVehicles.length === 0 ? (
                    <p className="text-xs py-4 text-text-muted">No vehicles uploaded yet.</p>
                  ) : (
                    recentVehicles.map((car) => (
                      <div key={car._id} className="flex items-center justify-between py-3">
                        <div>
                          <h4 className="font-semibold text-sm text-text">{car.name}</h4>
                          <p className="text-[11px] text-text-muted">
                            {car.year} • ₹{car.price.toLocaleString('en-IN')} • Dealer: {car.vendor?.name}
                          </p>
                        </div>
                        <Badge variant={car.status === 'active' ? 'success' : 'secondary'}>
                          {car.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* Recent Users */}
              <Card className="border border-border bg-white p-6 shadow-soft rounded-2xl">
                <h3 className="text-lg font-bold text-text mb-4">Recent User Registrations</h3>
                <div className="divide-y divide-border">
                  {recentUsers.map((user) => (
                    <div key={user._id} className="flex items-center justify-between py-3">
                      <div>
                        <h4 className="font-semibold text-sm text-text">{user.name}</h4>
                        <p className="text-[11px] text-text-muted">
                          {user.email} • {new Date(user.createdAt).toDateString()}
                        </p>
                      </div>
                      <Badge variant={user.role === 'admin' ? 'danger' : user.role === 'vendor' ? 'warning' : 'primary'}>
                        {user.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 2: KYC APPROVAL QUEUE */}
        {activeTab === 'kyc' && (
          <Card className="border border-border bg-white p-6 shadow-soft rounded-2xl">
            <h3 className="text-lg font-bold text-text mb-4">Dealers Awaiting Review</h3>
            {pendingVendors.length === 0 ? (
              <div className="py-12 text-center text-text-muted">
                <ShieldCheck className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="font-semibold text-text">No pending reviews</p>
                <p className="text-xs text-text-muted">All vendor onboarding applications are reviewed.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {pendingVendors.map((profile) => (
                  <div key={profile._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
                    <div>
                      <h4 className="font-bold text-text text-base">{profile.businessName}</h4>
                      <p className="text-xs text-text-muted mt-1">
                        Dealer Owner: {profile.user?.name} ({profile.user?.email}) • Phone: {profile.user?.phone}
                      </p>
                      <p className="text-[11px] text-primary-600 font-semibold mt-1">
                        GST Identification: {profile.gstNumber} • Location: {profile.address?.city}, {profile.address?.state}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" icon={Eye} onClick={() => setSelectedVendorProfile(profile)}>
                        Review Application
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleApproveVendor(profile._id)}
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* TAB 3: ACCOUNTS MANAGEMENT */}
        {activeTab === 'accounts' && (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Vendors List */}
            <Card className="border border-border bg-white p-6 shadow-soft rounded-2xl">
              <h3 className="text-lg font-bold text-text mb-4">Vendors / Dealerships ({allVendors.length})</h3>
              <div className="divide-y divide-border">
                {allVendors.map((profile) => (
                  <div key={profile._id} className="flex items-center justify-between py-3.5">
                    <div>
                      <h4 className="font-semibold text-sm text-text">{profile.businessName}</h4>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        GST: {profile.gstNumber} • Status: <span className="capitalize font-semibold">{profile.status}</span>
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={profile.user?.isActive ? 'outline' : 'primary'}
                      className={profile.user?.isActive ? 'text-red-600 border-red-200 hover:bg-red-50' : 'bg-green-600'}
                      icon={profile.user?.isActive ? Ban : UserCheck}
                      onClick={() => handleToggleUser(profile.user?._id)}
                    >
                      {profile.user?.isActive ? 'Block' : 'Unblock'}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Customers List */}
            <Card className="border border-border bg-white p-6 shadow-soft rounded-2xl">
              <h3 className="text-lg font-bold text-text mb-4">Customer Accounts ({customers.length})</h3>
              <div className="divide-y divide-border">
                {customers.map((cust) => (
                  <div key={cust._id} className="flex items-center justify-between py-3.5">
                    <div>
                      <h4 className="font-semibold text-sm text-text">{cust.name}</h4>
                      <p className="text-[11px] text-text-muted mt-0.5">{cust.email} • {cust.phone || 'No phone'}</p>
                    </div>
                    <Button
                      size="sm"
                      variant={cust.isActive ? 'outline' : 'primary'}
                      className={cust.isActive ? 'text-red-600 border-red-200 hover:bg-red-50' : 'bg-green-600'}
                      icon={cust.isActive ? Ban : UserCheck}
                      onClick={() => handleToggleUser(cust._id)}
                    >
                      {cust.isActive ? 'Block' : 'Unblock'}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* TAB 4: Q&A MODERATION */}
        {activeTab === 'questions' && (
          <Card className="border border-border bg-white p-6 shadow-soft rounded-2xl">
            <h3 className="text-lg font-bold text-text mb-4">Pending Inquiries Moderation</h3>
            {pendingQuestions.length === 0 ? (
              <div className="py-12 text-center text-text-muted">
                <MessageSquare className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                <p className="font-semibold text-text">No pending questions</p>
                <p className="text-xs text-text-muted">All community questions are currently moderated.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {pendingQuestions.map((q) => (
                  <div key={q._id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 py-4">
                    <div className="max-w-xl">
                      <p className="text-sm font-bold text-text">Question: "{q.questionText}"</p>
                      <p className="text-xs text-text-muted mt-1.5">
                        Vehicle: <span className="font-semibold text-text">{q.vehicle?.name}</span> • Customer: {q.customer?.name} ({q.customer?.email})
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleApproveQuestion(q._id)}
                      >
                        Approve View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleRejectQuestion(q._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* TAB 5: SYSTEM METADATA LISTS */}
        {activeTab === 'metadata' && (
          <div className="grid gap-8 md:grid-cols-3">
            {/* Brands */}
            <Card className="border border-border bg-white p-6 shadow-soft rounded-2xl">
              <h3 className="text-lg font-bold text-text mb-4">Supported Brands</h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="e.g. Audi"
                  value={newBrand.name}
                  onChange={(e) => setNewBrand({ name: e.target.value, logo: `https://logo.clearbit.com/${e.target.value.toLowerCase().replace(/\s/g, '')}.com` })}
                  className="flex-1 rounded-xl border border-border px-3 py-1.5 text-xs text-text focus:outline-none focus:border-primary-500"
                />
                <Button size="sm" onClick={handleAddBrand} className="px-2">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-border pr-2">
                {brands.map((brand) => (
                  <div key={brand._id} className="flex items-center justify-between py-2">
                    <span className="text-xs font-semibold text-text">{brand.name}</span>
                    <button onClick={() => handleRemoveBrand(brand._id)} className="text-red-500 hover:text-red-700">
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Categories */}
            <Card className="border border-border bg-white p-6 shadow-soft rounded-2xl">
              <h3 className="text-lg font-bold text-text mb-4">Vehicle Categories</h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="e.g. Convertible"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ name: e.target.value, icon: 'Car' })}
                  className="flex-1 rounded-xl border border-border px-3 py-1.5 text-xs text-text focus:outline-none focus:border-primary-500"
                />
                <Button size="sm" onClick={handleAddCategory} className="px-2">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-border pr-2">
                {categories.map((cat) => (
                  <div key={cat._id} className="flex items-center justify-between py-2">
                    <span className="text-xs font-semibold text-text">{cat.name}</span>
                    <button onClick={() => handleRemoveCategory(cat._id)} className="text-red-500 hover:text-red-700">
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Cities */}
            <Card className="border border-border bg-white p-6 shadow-soft rounded-2xl">
              <h3 className="text-lg font-bold text-text mb-4">Active Locations</h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="City"
                  value={newCity.name}
                  onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
                  className="w-1/2 rounded-xl border border-border px-2 py-1.5 text-xs text-text focus:outline-none focus:border-primary-500"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={newCity.state}
                  onChange={(e) => setNewCity({ ...newCity, state: e.target.value })}
                  className="w-1/2 rounded-xl border border-border px-2 py-1.5 text-xs text-text focus:outline-none focus:border-primary-500"
                />
                <Button size="sm" onClick={handleAddCity} className="px-2">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-border pr-2">
                {cities.map((city) => (
                  <div key={city._id} className="flex items-center justify-between py-2">
                    <span className="text-xs font-semibold text-text">{city.name}, {city.state}</span>
                    <button onClick={() => handleRemoveCity(city._id)} className="text-red-500 hover:text-red-700">
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* KYC REVIEW DETAILED MODAL */}
      <AnimatePresence>
        {selectedVendorProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 shadow-elevated"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h3 className="text-xl font-bold text-text">Dealership KYC Application Details</h3>
                <button
                  onClick={() => { setSelectedVendorProfile(null); setShowRejectForm(false); }}
                  className="text-text-muted hover:text-text text-xl font-semibold"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 space-y-6">
                {/* Dealer Grid */}
                <div className="grid gap-4 sm:grid-cols-2 text-xs">
                  <div>
                    <span className="text-text-muted block font-medium">Dealership Name</span>
                    <span className="font-bold text-sm text-text block mt-0.5">{selectedVendorProfile.businessName}</span>
                  </div>
                  <div>
                    <span className="text-text-muted block font-medium">Authorized Owner</span>
                    <span className="font-bold text-sm text-text block mt-0.5">{selectedVendorProfile.user?.name}</span>
                  </div>
                  <div>
                    <span className="text-text-muted block font-medium">GST Identification</span>
                    <span className="font-bold text-sm text-text block mt-0.5">{selectedVendorProfile.gstNumber}</span>
                  </div>
                  <div>
                    <span className="text-text-muted block font-medium">PAN Card</span>
                    <span className="font-bold text-sm text-text block mt-0.5">{selectedVendorProfile.panNumber}</span>
                  </div>
                  <div>
                    <span className="text-text-muted block font-medium">Aadhaar Card UID</span>
                    <span className="font-bold text-sm text-text block mt-0.5">{selectedVendorProfile.aadharNumber}</span>
                  </div>
                  <div>
                    <span className="text-text-muted block font-medium">Owner Driving License</span>
                    <span className="font-bold text-sm text-text block mt-0.5">{selectedVendorProfile.drivingLicenseNumber}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-text-muted block font-medium">Showroom Address</span>
                    <span className="font-bold text-sm text-text block mt-0.5">
                      {selectedVendorProfile.address?.street}, {selectedVendorProfile.address?.city}, {selectedVendorProfile.address?.state} - {selectedVendorProfile.address?.zipCode}
                    </span>
                  </div>
                </div>

                <hr className="border-border/60" />

                {/* Banking details */}
                <div>
                  <h4 className="text-sm font-bold text-text mb-3">Payout Bank Account</h4>
                  <div className="grid gap-4 sm:grid-cols-3 text-xs bg-slate-50 p-4 rounded-2xl">
                    <div>
                      <span className="text-text-muted block">Holder Name</span>
                      <span className="font-semibold text-text">{selectedVendorProfile.bankDetails?.accountHolderName}</span>
                    </div>
                    <div>
                      <span className="text-text-muted block">Account Number</span>
                      <span className="font-semibold text-text">{selectedVendorProfile.bankDetails?.accountNumber}</span>
                    </div>
                    <div>
                      <span className="text-text-muted block">Bank & IFSC</span>
                      <span className="font-semibold text-text">{selectedVendorProfile.bankDetails?.bankName} ({selectedVendorProfile.bankDetails?.ifscCode})</span>
                    </div>
                  </div>
                </div>

                <hr className="border-border/60" />

                {/* Documents attachments */}
                <div>
                  <h4 className="text-sm font-bold text-text mb-3">KYC Documents Proofs</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Cancelled cheque */}
                    <div className="rounded-xl border border-border p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileImage className="h-5 w-5 text-primary-500" />
                        <span className="text-xs font-semibold text-text">Cancelled Cheque copy</span>
                      </div>
                      <a
                        href={selectedVendorProfile.cancelledChequeImage}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary-600 hover:underline flex items-center gap-1"
                      >
                        <Globe className="h-3.5 w-3.5" /> View Upload
                      </a>
                    </div>

                    {/* Business Registration */}
                    <div className="rounded-xl border border-border p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileImage className="h-5 w-5 text-primary-500" />
                        <span className="text-xs font-semibold text-text">GST Business Registration</span>
                      </div>
                      <a
                        href={selectedVendorProfile.businessProofImage}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary-600 hover:underline flex items-center gap-1"
                      >
                        <Globe className="h-3.5 w-3.5" /> View Upload
                      </a>
                    </div>
                  </div>
                </div>

                {/* Moderation Controls */}
                <div className="border-t border-border pt-6 flex flex-col gap-4">
                  {!showRejectForm ? (
                    <div className="flex items-center justify-end gap-3">
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => setShowRejectForm(true)}
                      >
                        Reject KYC
                      </Button>
                      <Button
                        variant="primary"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApproveVendor(selectedVendorProfile._id)}
                      >
                        Approve Dealer
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        placeholder="Please detail the reason for rejecting this dealership profile (e.g. Unclear document photocopy or wrong GST number)..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-border p-3 text-xs focus:outline-none focus:border-red-500 bg-red-50/20 text-text"
                      />
                      <div className="flex items-center justify-end gap-3">
                        <Button variant="secondary" size="sm" onClick={() => setShowRejectForm(false)}>
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => handleRejectVendor(selectedVendorProfile._id)}
                        >
                          Confirm Rejection
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
