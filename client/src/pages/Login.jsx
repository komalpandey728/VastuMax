import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Car, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, continueAsGuest, isAuthenticated, user, isGuest } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user && !isGuest) {
      const dashboardPath =
        user.role === 'admin'
          ? '/admin/dashboard'
          : user.role === 'vendor'
            ? '/vendor/dashboard'
            : '/customer/wishlist';
      navigate(dashboardPath, { replace: true });
    }
  }, [isAuthenticated, user, isGuest, navigate]);

  const handleGuest = async () => {
    await continueAsGuest();
    navigate(from, { replace: true });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const user = await login(data);
      // Redirect based on role or where they came from
      if (from === '/') {
        const dashboardPath =
          user.role === 'admin'
            ? '/admin/dashboard'
            : user.role === 'vendor'
              ? '/vendor/dashboard'
              : '/customer/wishlist';
        navigate(dashboardPath, { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[85vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Background Decorative Gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[10%] top-[10%] h-[300px] w-[300px] rounded-full bg-primary-100/40 blur-3xl" />
        <div className="absolute right-[10%] bottom-[10%] h-[300px] w-[300px] rounded-full bg-secondary-100/30 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border border-border bg-white/80 p-8 shadow-elevated backdrop-blur-xl sm:p-10">
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center">
            <Link to="/" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 shadow-lg shadow-primary-500/20">
              <Car className="h-6 w-6 text-white" />
            </Link>
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-text">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Log in to your account to manage your listings and wishlist
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email address is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="remember-me" className="ml-2 text-text-muted">
                  Remember me
                </label>
              </div>

              <a href="#" className="font-medium text-primary-600 hover:text-primary-700">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In
            </Button>

            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={handleGuest}
              icon={UserCircle}
            >
              Continue as Guest
            </Button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 text-center text-sm">
            <span className="text-text-muted">Don't have an account? </span>
            <Link
              to="/register"
              className="font-medium text-primary-600 transition-colors hover:text-primary-700"
            >
              Create one now
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
