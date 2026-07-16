import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import NotFound from '../pages/NotFound';
import { SkeletonCard } from '../components/ui/Skeleton';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const Home = lazy(() => import('../pages/Home'));
const BuyLanding = lazy(() => import('../pages/BuyLanding'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const CustomerWishlist = lazy(() => import('../pages/customer/CustomerWishlist'));
const VendorDashboard = lazy(() => import('../pages/vendor/VendorDashboard'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const VehicleCatalog = lazy(() => import('../pages/VehicleCatalog'));
const CommercialVehicleCatalog = lazy(() => import('../pages/CommercialVehicleCatalog'));
const VehicleDetails = lazy(() => import('../pages/VehicleDetails'));
const CompareVehicles = lazy(() => import('../pages/CompareVehicles'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const VendorOnboarding = lazy(() => import('../pages/vendor/VendorOnboarding'));
const VehicleForm = lazy(() => import('../pages/vendor/VehicleForm'));
const EmiCalculator = lazy(() => import('../pages/EmiCalculator'));
const SellVehicle = lazy(() => import('../pages/SellVehicle'));
const VendorsDirectory = lazy(() => import('../pages/VendorsDirectory'));
const VendorProfile = lazy(() => import('../pages/VendorProfile'));
const VendorProfileEdit = lazy(() => import('../pages/vendor/VendorProfileEdit'));

const PageLoader = () => (
  <div className="container-vastu max py-20 flex justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
  </div>
);

const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />

            {/* Auth */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* Buy — landing choice + catalog */}
            <Route path="buy" element={<BuyLanding />} />
            <Route path="buy/cars" element={<VehicleCatalog />} />
            <Route path="buy/commercial" element={<CommercialVehicleCatalog />} />
            <Route path="vehicle/:id" element={<VehicleDetails />} />
            <Route path="vehicles" element={<Navigate to="/buy/cars" replace />} />
            <Route path="account" element={<Navigate to="/customer/wishlist" replace />} />
            <Route path="admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="vendor-onboarding" element={<VendorOnboarding />} />
            <Route path="sell" element={<SellVehicle />} />
            <Route path="vendors" element={<VendorsDirectory />} />
            <Route path="vendors/:id" element={<VendorProfile />} />
            <Route path="emi-calculator" element={<EmiCalculator />} />

            {/* Legacy routes (kept for backward compat) */}
            <Route path="listings" element={<VehicleCatalog />} />
            <Route path="vehicles" element={<VehicleCatalog />} />
            <Route path="listings/:id" element={<VehicleDetails />} />
            <Route path="vehicles/:id" element={<VehicleDetails />} />
            <Route path="compare" element={<CompareVehicles />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />

            <Route
              path="customer/wishlist"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerWishlist />
                </ProtectedRoute>
              }
            />

            <Route path="vendor/onboarding" element={<VendorOnboarding />} />

            <Route
              path="vendor/dashboard"
              element={
                <ProtectedRoute allowedRoles={['vendor']}>
                  <VendorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="vendor/profile/edit"
              element={
                <ProtectedRoute allowedRoles={['vendor']}>
                  <VendorProfileEdit />
                </ProtectedRoute>
              }
            />

            <Route
              path="vendor/vehicles/new"
              element={
                <ProtectedRoute allowedRoles={['vendor', 'admin']}>
                  <VehicleForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="vendor/vehicles/edit/:id"
              element={
                <ProtectedRoute allowedRoles={['vendor', 'admin']}>
                  <VehicleForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/listings/new"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <VehicleForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/listings/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <VehicleForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;
