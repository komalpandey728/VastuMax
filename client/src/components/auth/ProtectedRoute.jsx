import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
        <p className="text-sm font-medium text-text-muted">Verifying secure session...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect unauthorized users to their own dashboard
    const defaultDashboard =
      user.role === 'admin'
        ? '/admin/dashboard'
        : user.role === 'vendor'
          ? '/vendor/dashboard'
          : '/customer/wishlist';

    return <Navigate to={defaultDashboard} replace />;
  }

  return children;
};

export default ProtectedRoute;
