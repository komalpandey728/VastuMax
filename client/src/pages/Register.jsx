import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, ArrowRight, Car, ShieldCheck, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import toast from 'react-hot-toast';

const Register = () => {
  const { register: signup, continueAsGuest, isAuthenticated, user, isGuest } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('customer'); // 'customer' or 'vendor'
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
  }, [isAuthenticated, user, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordVal = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Remove confirmPassword, add selected role
      const { confirmPassword, ...signupData } = data;
      const finalData = { ...signupData, role };

      const user = await signup(finalData);

      // Redirect based on selected role
      const dashboardPath =
        user.role === 'admin'
          ? '/admin/dashboard'
          : user.role === 'vendor'
            ? '/vendor/dashboard'
            : '/customer/wishlist';
      navigate(dashboardPath, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[90vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Background Decorative Gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[15%] top-[10%] h-[300px] w-[300px] rounded-full bg-primary-100/40 blur-3xl" />
        <div className="absolute right-[15%] bottom-[10%] h-[300px] w-[300px] rounded-full bg-secondary-100/30 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="border border-border bg-white/80 p-8 shadow-elevated backdrop-blur-xl sm:p-10">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <Link to="/" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 shadow-lg shadow-primary-500/20">
              <Car className="h-6 w-6 text-white" />
            </Link>
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-text">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Join Vastu Max to start searching, wishlist, or selling vehicles.
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="mt-8 grid grid-cols-2 gap-2 rounded-xl bg-accent/40 p-1.5">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 ${role === 'customer'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-text-muted hover:text-text'
                }`}
            >
              <User className="h-4 w-4" />
              Customer Account
            </button>
            <button
              type="button"
              onClick={() => setRole('vendor')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 ${role === 'vendor'
                  ? 'bg-white text-secondary-600 shadow-sm'
                  : 'text-text-muted hover:text-text'
                }`}
            >
              <ShieldCheck className="h-4 w-4" />
              Vendor Partner
            </button>
          </div>

          {/* Form */}
          <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                icon={User}
                error={errors.name?.message}
                {...register('name', {
                  required: 'Name is required',
                  maxLength: { value: 50, message: 'Name cannot exceed 50 characters' },
                })}
              />

              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />

              <Input
                label="Phone Number (10-Digit Mobile)"
                type="tel"
                placeholder="9876543210"
                icon={Phone}
                error={errors.phone?.message}
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: 'Please enter a valid 10-digit Indian mobile number',
                  },
                })}
              />

              <div className="grid gap-4 sm:grid-cols-2">
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

                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  icon={Lock}
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === passwordVal || 'Passwords do not match',
                  })}
                />
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              icon={ArrowRight}
              iconPosition="right"
              className={role === 'vendor' ? 'bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500/30' : ''}
            >
              Get Started
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm">
            <span className="text-text-muted">Already have an account? </span>
            <Link
              to="/login"
              className="font-medium text-primary-600 transition-colors hover:text-primary-700"
            >
              Sign In
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
