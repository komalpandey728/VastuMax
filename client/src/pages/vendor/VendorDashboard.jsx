import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Store,
  ShieldAlert,
  Award,
  FileText,
  PlusCircle,
  MessageSquare,
  Calendar,
  Check,
  X,
  Trash,
  Edit,
  Mail,
  Phone,
  Clock,
  ExternalLink,
  CreditCard,
  Building2,
  Landmark,
  ShieldCheck,
  AlertCircle,
  Car,
  Upload,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getVendorProfile } from '../../services/vendorService';
import { getVendorVehicles, deleteVehicle } from '../../services/vehicleService';
import { getVendorBookings, updateBookingStatus } from '../../services/bookingService';
import { getVendorQuestions, answerQuestion } from '../../services/questionService';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const VendorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeSubTab, setActiveSubTab] = useState('vehicles');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // Collections
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [questions, setQuestions] = useState([]);

  // Question Reply States
  const [replyTexts, setReplyTexts] = useState({});
  const [submittingReply, setSubmittingReply] = useState({});

  const loadData = useCallback(async () => {
    try {
      const profileData = await getVendorProfile();
      setProfile(profileData.profile);

      if (profileData.profile && profileData.profile.status === 'approved') {
        const [vehiclesRes, bookingsRes, questionsRes] = await Promise.all([
          getVendorVehicles(),
          getVendorBookings(),
          getVendorQuestions(),
        ]);
        setVehicles(vehiclesRes.vehicles || []);
        setBookings(bookingsRes.bookings || []);
        setQuestions(questionsRes.questions || []);
      }
    } catch {
      toast.error('Failed to load dealer statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Booking Actions
  const handleBookingAction = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
      toast.success(`Booking status set to: ${status}`);
      await loadData();
    } catch {
      toast.error('Failed to update booking');
    }
  };

  // Question reply submit
  const handleAnswerSubmit = async (questionId) => {
    const text = replyTexts[questionId];
    if (!text || !text.trim()) {
      toast.error('Please type a reply.');
      return;
    }

    setSubmittingReply((prev) => ({ ...prev, [questionId]: true }));
    try {
      await answerQuestion(questionId, text);
      toast.success('Reply submitted successfully');
      setReplyTexts((prev) => ({ ...prev, [questionId]: '' }));
      await loadData();
    } catch {
      toast.error('Failed to submit response');
    } finally {
      setSubmittingReply((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  // Delete Listing
  const handleDeleteListing = async (carId) => {
    if (window.confirm('Are you sure you want to delete this listing permanently?')) {
      try {
        await deleteVehicle(carId);
        toast.success('Listing deleted');
        await loadData();
      } catch {
        toast.error('Failed to delete listing');
      }
    }
  };

  const handleReplyTextChange = (questionId, text) => {
    setReplyTexts((prev) => ({
      ...prev,
      [questionId]: text,
    }));
  };

  const getDocumentChecklist = () => {
    if (!profile) return [];

    const baseDate = profile.createdAt ? new Date(profile.createdAt) : new Date();
    const formattedUploadDate = baseDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    
    const verDate = new Date(baseDate);
    verDate.setDate(verDate.getDate() + 1);
    const formattedVerifyDate = verDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    return [
      {
        name: 'GST Registration Certificate',
        key: 'gst',
        uploaded: !!profile.gstNumber,
        status: profile.gstNumber ? 'Uploaded' : 'Missing',
        verification: profile.status === 'approved' ? 'Verified' : profile.status === 'rejected' ? 'Rejected' : 'Pending Review',
        dateUploaded: profile.gstNumber ? formattedUploadDate : '—',
        dateVerified: profile.gstNumber && profile.status === 'approved' ? formattedVerifyDate : '—',
        fileType: 'Text Detail',
        icon: Building2,
        actionVal: profile.gstNumber,
        isLink: false,
      },
      {
        name: 'PAN Card Verification',
        key: 'pan',
        uploaded: !!profile.panNumber,
        status: profile.panNumber ? 'Uploaded' : 'Missing',
        verification: profile.status === 'approved' ? 'Verified' : profile.status === 'rejected' ? 'Rejected' : 'Pending Review',
        dateUploaded: profile.panNumber ? formattedUploadDate : '—',
        dateVerified: profile.panNumber && profile.status === 'approved' ? formattedVerifyDate : '—',
        fileType: 'Text Detail',
        icon: CreditCard,
        actionVal: profile.panNumber,
        isLink: false,
      },
      {
        name: 'Dealership License / ID',
        key: 'license',
        uploaded: !!profile.drivingLicenseNumber,
        status: profile.drivingLicenseNumber ? 'Uploaded' : 'Missing',
        verification: profile.status === 'approved' ? 'Verified' : profile.status === 'rejected' ? 'Rejected' : 'Pending Review',
        dateUploaded: profile.drivingLicenseNumber ? formattedUploadDate : '—',
        dateVerified: profile.drivingLicenseNumber && profile.status === 'approved' ? formattedVerifyDate : '—',
        fileType: 'Text Detail',
        icon: FileText,
        actionVal: profile.drivingLicenseNumber,
        isLink: false,
      },
      {
        name: 'Business Registration Proof',
        key: 'proof',
        uploaded: !!profile.businessProofImage,
        status: profile.businessProofImage ? 'Uploaded' : 'Missing',
        verification: profile.status === 'approved' ? 'Verified' : profile.status === 'rejected' ? 'Rejected' : 'Pending Review',
        dateUploaded: profile.businessProofImage ? formattedUploadDate : '—',
        dateVerified: profile.businessProofImage && profile.status === 'approved' ? formattedVerifyDate : '—',
        fileType: 'Image File',
        icon: FileText,
        actionVal: profile.businessProofImage,
        isLink: true,
      },
      {
        name: 'Bank Details (Cancelled Cheque)',
        key: 'cheque',
        uploaded: !!profile.cancelledChequeImage,
        status: profile.cancelledChequeImage ? 'Uploaded' : 'Missing',
        verification: profile.status === 'approved' ? 'Verified' : profile.status === 'rejected' ? 'Rejected' : 'Pending Review',
        dateUploaded: profile.cancelledChequeImage ? formattedUploadDate : '—',
        dateVerified: profile.cancelledChequeImage && profile.status === 'approved' ? formattedVerifyDate : '—',
        fileType: 'Image File',
        icon: Landmark,
        actionVal: profile.cancelledChequeImage,
        isLink: true,
      },
    ];
  };

  if (loading) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  const handleInlineUpload = async (docType, file) => {
    if (!file) return;
    const toastId = toast.loading('Uploading document...');
    try {
      const formData = new FormData();
      formData.append('businessName', profile?.businessName || 'Dealer Business');
      formData.append('gstNumber', profile?.gstNumber || '27AAAAA0000A1Z5');
      formData.append('panNumber', profile?.panNumber || 'ABCDE1234F');
      formData.append('aadharNumber', profile?.aadharNumber || '123456789012');
      formData.append('drivingLicenseNumber', profile?.drivingLicenseNumber || 'DL-12345678901');

      if (docType === 'cheque') {
        formData.append('cancelledChequeImage', file);
      } else if (docType === 'proof') {
        formData.append('businessProofImage', file);
      }

      await submitOnboarding(formData);
      toast.success('Document uploaded successfully!', { id: toastId });
      loadData();
    } catch (err) {
      toast.error('Upload failed: ' + err.message, { id: toastId });
    }
  };

  // Onboarding / KYC Checks (Two states UI layout)
  if (!profile || profile.status === 'pending' || profile.status === 'rejected') {
    const docStatus = [
      {
        name: 'GST Certificate',
        uploaded: !!(profile?.gstNumber),
        desc: 'GST registration ID number',
      },
      {
        name: 'PAN Card',
        uploaded: !!(profile?.panNumber),
        desc: 'Permanent Account Number registration details',
      },
      {
        name: 'Business Registration Proof',
        uploaded: !!(profile?.businessProofImage),
        desc: 'Shop Act, MSME, or Trade License document',
        type: 'proof',
      },
      {
        name: 'Bank Details (Cancelled Cheque)',
        uploaded: !!(profile?.cancelledChequeImage),
        desc: 'Cancelled cheque image or bank statement',
        type: 'cheque',
      },
      {
        name: 'Dealership License / ID Proof',
        uploaded: !!(profile?.aadharNumber || profile?.drivingLicenseNumber),
        desc: 'Proprietor Aadhaar or Driving License details',
      },
    ];

    const uploadedCount = docStatus.filter((d) => d.uploaded).length;
    const progressPercent = Math.round((uploadedCount / docStatus.length) * 100);

    return (
      <div className="container-vastu max py-16">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black tracking-tight text-text">Dealership KYC & Onboarding</h1>
          <p className="mt-2 text-sm text-text-muted max-w-xl mx-auto">
            Complete your verification setup to start listing passenger cars and commercial vehicles on Vastu Max.
          </p>
        </div>

        {profile?.status === 'rejected' && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
            <div className="flex gap-3">
              <ShieldAlert className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm">Onboarding KYC Rejected</h3>
                <p className="mt-1 text-xs leading-relaxed text-red-700">
                  Compliance team reason: <strong className="text-red-900">{profile.rejectionReason || 'Please review document uploads.'}</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Card A: Target Goal State - Verified & Onboarded Vendor */}
          <Card className="relative overflow-hidden border border-slate-200 bg-white p-8 shadow-soft rounded-3xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 text-xs font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Verified & Onboarded Partner
              </span>
              <Award className="h-6 w-6 text-primary-500" />
            </div>

            <h3 className="text-xl font-extrabold text-text mb-2">Goal State: Fully Verified Dealer</h3>
            <p className="text-xs text-text-muted leading-relaxed mb-6">
              Verified dealers enjoy full listing priority, CRM lead dashboard access, automated bookings scheduler, and premium buyer directory display.
            </p>

            <div className="space-y-4 mb-8">
              {docStatus.map((item) => (
                <div key={item.name} className="flex items-start gap-3 text-left">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-text">{item.name}</span>
                    <span className="block text-[10px] text-text-muted mt-0.5">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              fullWidth
              className="bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed hover:bg-slate-50 hover:text-slate-400"
              disabled
            >
              Go to CRM Dashboard
            </Button>
            <p className="text-[10px] text-center text-text-muted mt-2">
              Unlocks automatically upon full compliance verification approval.
            </p>
          </Card>

          {/* Card B: Active Pending State */}
          <Card className="border border-slate-200 bg-slate-50/50 p-8 shadow-soft rounded-3xl relative">
            <div className="flex items-center justify-between mb-6">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${profile?.status === 'pending'
                  ? 'bg-amber-50 border border-amber-200 text-amber-700'
                  : profile?.status === 'rejected'
                    ? 'bg-red-50 border border-red-200 text-red-700'
                    : 'bg-blue-50 border border-blue-200 text-blue-700'
                }`}>
                <span className={`h-2 w-2 rounded-full ${profile?.status === 'pending'
                    ? 'bg-amber-500 animate-pulse'
                    : profile?.status === 'rejected'
                      ? 'bg-red-500'
                      : 'bg-blue-500'
                  }`} />
                {profile?.status === 'pending'
                  ? 'Compliance Review In Progress'
                  : profile?.status === 'rejected'
                    ? 'KYC Incomplete / Rejected'
                    : 'KYC Documentation Required'}
              </span>
              <span className="text-xs font-black text-text-muted">{progressPercent}% Done</span>
            </div>

            <h3 className="text-xl font-extrabold text-text mb-2">Your Verification Checklist</h3>
            <p className="text-xs text-text-muted leading-relaxed mb-6">
              {profile?.status === 'pending'
                ? 'Your uploaded details are currently being audited. You can update documents inline if needed.'
                : 'Upload all requested certificates to register your dealership with Vastu Max.'}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full mb-8 overflow-hidden">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="space-y-4 mb-8">
              {docStatus.map((item) => (
                <div key={item.name} className="flex items-start justify-between gap-3 text-left">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full flex-shrink-0 mt-0.5 ${item.uploaded
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-200 text-slate-400'
                      }`}>
                      {item.uploaded ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    </div>
                    <div>
                      <span className={`block text-xs font-bold ${item.uploaded ? 'text-text' : 'text-text-muted'}`}>{item.name}</span>
                      <span className="block text-[10px] text-text-muted mt-0.5">{item.desc}</span>
                    </div>
                  </div>

                  {item.type && (
                    <div className="flex-shrink-0">
                      <label className="inline-flex items-center gap-1 rounded-lg bg-white border border-border px-2.5 py-1 text-[10px] font-bold text-text-muted hover:text-text hover:border-slate-400 transition-all cursor-pointer">
                        <Upload className="h-3 w-3 text-primary-500" />
                        {item.uploaded ? 'Update' : 'Upload'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleInlineUpload(item.type, e.target.files[0])}
                        />
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <Link to={profile ? "/vendor/profile/edit" : "/vendor/onboarding"}>
                <Button fullWidth icon={PlusCircle}>
                  {profile ? 'Edit Detailed Profile Info' : 'Start Verification Form'}
                </Button>
              </Link>
              <Button variant="outline" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Case 3: Fully Approved Vendor Dashboard
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const unansweredQuestions = questions.filter((q) => !q.isAnswered).length;

  return (
    <div className="container-vastu max py-12">
      <div className="flex flex-col gap-8">
        {/* Welcome Section */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight">Dealer Workspace</h1>
              <Badge variant="success">Certified Partner</Badge>
            </div>
            <p className="mt-1 text-sm text-text-muted">
              List certified cars, update bookings, and manage customer inquiries.
            </p>
          </div>
          <Link to="/vendor/vehicles/new">
            <Button icon={PlusCircle}>Upload Vehicle</Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="flex items-center gap-4 border border-border bg-white p-6 shadow-soft rounded-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-text-muted font-medium">Active Listings</p>
              <h3 className="text-2xl font-bold">{vehicles.length} Vehicles</h3>
            </div>
          </Card>

          <Card className="flex items-center gap-4 border border-border bg-white p-6 shadow-soft rounded-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-text-muted font-medium">Pending Test Drives</p>
              <h3 className="text-2xl font-bold">{pendingBookings} Requests</h3>
            </div>
          </Card>

          <Card className="flex items-center gap-4 border border-border bg-white p-6 shadow-soft rounded-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-text-muted font-medium">Customer Inquiries</p>
              <h3 className="text-2xl font-bold">{unansweredQuestions} Unanswered</h3>
            </div>
          </Card>
        </div>

        {/* Subtabs Navigation */}
        <div className="flex overflow-x-auto border-b border-border gap-0 scrollbar-none">
          <button
            onClick={() => setActiveSubTab('vehicles')}
            className={`border-b-2 px-6 py-3.5 text-sm font-bold transition-all whitespace-nowrap ${activeSubTab === 'vehicles'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-text-muted hover:text-text'
              }`}
          >
            My Listings ({vehicles.length})
          </button>
          <button
            onClick={() => setActiveSubTab('documents')}
            className={`border-b-2 px-6 py-3.5 text-sm font-bold transition-all whitespace-nowrap ${activeSubTab === 'documents'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-text-muted hover:text-text'
              }`}
          >
            My Documents
          </button>
          <button
            onClick={() => setActiveSubTab('bookings')}
            className={`border-b-2 px-6 py-3.5 text-sm font-bold transition-all whitespace-nowrap ${activeSubTab === 'bookings'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-text-muted hover:text-text'
              }`}
          >
            Test Drive Leads ({bookings.length})
          </button>
          <button
            onClick={() => setActiveSubTab('questions')}
            className={`border-b-2 px-6 py-3.5 text-sm font-bold transition-all whitespace-nowrap ${activeSubTab === 'questions'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-text-muted hover:text-text'
              }`}
          >
            Customer Q&A ({questions.length})
          </button>
        </div>

        {/* Tab Contents */}
        <div>
          {/* My Documents Tab */}
          {activeSubTab === 'documents' && (
            <Card className="border border-border bg-white p-6 shadow-soft rounded-2xl">
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-text">Dealership KYC Checklist</h3>
                  <p className="text-xs text-text-muted mt-0.5">Verification status of mandatory business registration and ID proofs.</p>
                </div>
                <Link to="/vendor/onboarding">
                  <Button size="sm" variant="outline">Update Documents</Button>
                </Link>
              </div>

              {/* Checklist Grid Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/85 text-text-muted text-[10px] uppercase font-bold tracking-wider">
                      <th className="py-3 px-4">Document Details</th>
                      <th className="py-3 px-4">File Type</th>
                      <th className="py-3 px-4">Upload Status</th>
                      <th className="py-3 px-4">Verification</th>
                      <th className="py-3 px-4">Upload Date</th>
                      <th className="py-3 px-4">Verified Date</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {getDocumentChecklist().map((doc) => {
                      const Icon = doc.icon;
                      return (
                        <tr key={doc.key} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 px-4 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                              <Icon className="h-4.5 w-4.5" />
                            </div>
                            <span className="font-bold text-text leading-tight">{doc.name}</span>
                          </td>
                          <td className="py-3.5 px-4 text-text-muted">{doc.fileType}</td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                              doc.uploaded 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}>
                              {doc.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`font-bold capitalize ${
                              doc.verification === 'Verified'
                                ? 'text-emerald-600'
                                : doc.verification === 'Rejected'
                                ? 'text-rose-600'
                                : 'text-amber-600'
                            }`}>
                              {doc.verification}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-text-muted font-medium">{doc.dateUploaded}</td>
                          <td className="py-3.5 px-4 text-text-muted font-medium">{doc.dateVerified}</td>
                          <td className="py-3.5 px-4 text-right">
                            {doc.uploaded ? (
                              doc.isLink ? (
                                <a
                                  href={doc.actionVal}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700 hover:underline"
                                >
                                  View File <ExternalLink className="h-3 w-3" />
                                </a>
                              ) : (
                                <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[10px] select-all">
                                  {doc.actionVal}
                                </span>
                              )
                            ) : (
                              <Link to="/vendor/onboarding" className="text-primary-600 hover:underline font-bold">
                                Upload
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Verification status summary */}
              <div className={`mt-8 rounded-2xl p-4 flex items-center gap-4 ${
                profile?.status === 'approved'
                  ? 'bg-emerald-50 border border-emerald-100'
                  : profile?.status === 'pending'
                  ? 'bg-amber-50 border border-amber-100'
                  : 'bg-red-50 border border-red-100'
              }`}>
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                  profile?.status === 'approved' ? 'bg-emerald-100' : profile?.status === 'pending' ? 'bg-amber-100' : 'bg-red-100'
                }`}>
                  {profile?.status === 'approved' ? (
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  ) : profile?.status === 'pending' ? (
                    <Clock className="h-5 w-5 text-amber-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-text text-sm">
                    KYC Status: <span className="capitalize">{profile?.status || 'Unknown'}</span>
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {profile?.status === 'approved'
                      ? 'All documents verified. Your dealership is live on Vastu Max.'
                      : profile?.status === 'pending'
                      ? 'Your documents are under review. This usually takes 1–2 business days.'
                      : 'Verification failed. Please re-upload your documents.'}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Listings Tab */}
          {activeSubTab === 'vehicles' && (
            <Card className="border border-border bg-white p-6 shadow-soft rounded-2xl">
              <h3 className="text-lg font-bold text-text mb-4 font-heading">Dealership Inventory</h3>
              {vehicles.length === 0 ? (
                <div className="py-12 text-center text-text-muted">
                  <Car className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="font-semibold text-text">No listings uploaded yet</p>
                  <p className="text-xs text-text-muted mb-4">Upload certified premium listings to Vastu Max to get customers.</p>
                  <Link to="/vendor/vehicles/new">
                    <Button size="sm">Create First Listing</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {vehicles.map((car) => (
                    <div key={car._id} className="relative rounded-2xl border border-border overflow-hidden bg-slate-50 flex flex-col">
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                        <img src={car.images?.[0]} className="h-full w-full object-cover" alt="vehicle" />
                        <div className="absolute left-3 top-3">
                          <Badge variant={car.status === 'active' ? 'success' : car.status === 'sold' ? 'info' : 'warning'}>
                            {car.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h4 className="font-bold text-text text-sm">{car.name}</h4>
                        <p className="text-xs text-text-muted mt-0.5">{car.variant} • {car.year}</p>
                        <p className="text-sm font-extrabold text-primary-600 mt-2">
                          ₹{car.price.toLocaleString('en-IN')}
                        </p>
                        <div className="mt-auto pt-4 flex gap-2 border-t border-border/40 justify-end">
                          <button
                            onClick={() => navigate(`/vendor/vehicles/edit/${car._id}`)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteListing(car._id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                            title="Delete"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                          <Link
                            to={`/vehicles/${car._id}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100"
                            title="View Public Link"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Bookings Tab */}
          {activeSubTab === 'bookings' && (
            <Card className="border border-border bg-white p-6 shadow-soft rounded-2xl">
              <h3 className="text-lg font-bold text-text mb-4 font-heading">Test Drive Request Leads</h3>
              {bookings.length === 0 ? (
                <div className="py-12 text-center text-text-muted">
                  <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="font-semibold text-text">No test drive requests yet</p>
                  <p className="text-xs text-text-muted">Requests from customers will appear here.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-text text-sm">Vehicle: {booking.vehicle?.name}</h4>
                          <Badge variant={booking.status === 'confirmed' ? 'success' : booking.status === 'cancelled' ? 'danger' : 'warning'}>
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-text-muted mt-1.5">
                          Scheduled: <span className="font-semibold text-text">{new Date(booking.bookingDate).toDateString()} at {booking.bookingTime}</span>
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">
                          Lead: {booking.customer?.name} ({booking.customer?.email}) • Phone: {booking.customer?.phone}
                        </p>
                        {booking.notes && <p className="text-xs text-amber-800 bg-amber-50 p-2 rounded-xl mt-2 italic">Notes: "{booking.notes}"</p>}
                      </div>
                      {booking.status === 'pending' && (
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleBookingAction(booking._id, 'confirmed')}
                            className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-green-600 px-3.5 text-xs font-semibold text-white hover:bg-green-700 shadow"
                          >
                            <Check className="h-4 w-4" /> Confirm
                          </button>
                          <button
                            onClick={() => handleBookingAction(booking._id, 'cancelled')}
                            className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-red-200 px-3.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" /> Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Q&A Tab */}
          {activeSubTab === 'questions' && (
            <Card className="border border-border bg-white p-6 shadow-soft rounded-2xl">
              <h3 className="text-lg font-bold text-text mb-4 font-heading">Vehicle Inquiries & Q&As</h3>
              {questions.length === 0 ? (
                <div className="py-12 text-center text-text-muted">
                  <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="font-semibold text-text">No questions asked yet</p>
                  <p className="text-xs text-text-muted">Client questions about your cars will appear here.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {questions.map((q) => (
                    <div key={q._id} className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
                          {q.vehicle?.name}
                        </span>
                        <Badge variant={q.isAnswered ? 'success' : 'warning'}>
                          {q.isAnswered ? 'Answered' : 'Needs Response'}
                        </Badge>
                      </div>
                      <p className="text-sm font-bold text-text mt-1">Q: "{q.questionText}"</p>
                      <p className="text-[10px] text-text-muted mt-0.5">Asked by {q.customer?.name} ({q.customer?.email})</p>

                      {q.isAnswered ? (
                        <div className="mt-3 rounded-2xl bg-slate-50 p-4 border border-border">
                          <p className="text-xs font-semibold text-text">A: "{q.answerText}"</p>
                        </div>
                      ) : (
                        <div className="mt-3 flex gap-2 max-w-xl">
                          <input
                            type="text"
                            placeholder="Type dealership answer..."
                            value={replyTexts[q._id] || ''}
                            onChange={(e) => handleReplyTextChange(q._id, e.target.value)}
                            className="flex-1 rounded-xl border border-border px-3.5 py-1.5 text-xs text-text focus:outline-none focus:border-primary-500"
                          />
                          <Button
                            size="sm"
                            disabled={submittingReply[q._id]}
                            onClick={() => handleAnswerSubmit(q._id)}
                          >
                            Send Answer
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Dealership profile info */}
        <div className="grid gap-8 lg:grid-cols-3 mt-4">
          <Card className="border border-border bg-white p-6 shadow-soft rounded-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-text">Dealer Profile</h3>
              <Link to="/vendor/profile/edit" className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline">
                Edit Profile
              </Link>
            </div>
            <hr className="my-4 border-border/60" />
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Store className="h-5 w-5 text-text-muted" />
                <div>
                  <p className="text-[10px] text-text-muted font-medium">Dealership Name</p>
                  <p className="text-sm font-semibold text-text">{profile?.businessName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-text-muted" />
                <div>
                  <p className="text-[10px] text-text-muted font-medium">Authorized Email</p>
                  <p className="text-sm font-semibold text-text">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-text-muted" />
                <div>
                  <p className="text-[10px] text-text-muted font-medium">Contact Phone</p>
                  <p className="text-sm font-semibold text-text">{user?.phone || 'Not available'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-text-muted" />
                <div>
                  <p className="text-[10px] text-text-muted font-medium">GST Identification</p>
                  <p className="text-sm font-semibold text-text">{profile?.gstNumber}</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-2">
            <Card className="border border-border bg-white p-6 shadow-soft rounded-2xl h-full">
              <h3 className="text-lg font-bold text-text">Dealership Location Address</h3>
              <hr className="my-4 border-border/60" />
              <div className="text-xs text-text space-y-2">
                <p><span className="font-semibold text-text-muted">Street:</span> {profile?.address?.street}</p>
                <p><span className="font-semibold text-text-muted">City:</span> {profile?.address?.city}</p>
                <p><span className="font-semibold text-text-muted">State & Zip Code:</span> {profile?.address?.state} - {profile?.address?.zipCode}</p>
              </div>
              <div className="mt-6 rounded-2xl bg-primary-50/50 border border-primary-100 p-4 text-xs text-primary-900">
                <p className="font-bold">Dealer Payouts Account Info:</p>
                <p className="mt-1">Bank: {profile?.bankDetails?.bankName} • Account: {profile?.bankDetails?.accountNumber}</p>
                <p>IFSC Code: {profile?.bankDetails?.ifscCode} • Beneficiary: {profile?.bankDetails?.accountHolderName}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
