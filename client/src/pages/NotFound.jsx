import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Home, Search } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative">
          <span className="text-8xl font-bold text-gradient">404</span>
          <Car className="absolute -right-4 -top-2 h-10 w-10 text-primary-400" />
        </div>
        <h1 className="text-2xl font-semibold text-text">Page not found</h1>
        <p className="max-w-md text-text-muted">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on the road.
        </p>
        <div className="flex gap-3">
          <Link to="/">
            <Button icon={Home}>Go Home</Button>
          </Link>
          <Link to="/vehicles">
            <Button variant="outline" icon={Search}>Browse Vehicles</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
