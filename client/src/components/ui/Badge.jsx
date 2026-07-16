import { cn } from '../../utils';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-accent text-text-muted',
    primary: 'bg-primary-50 text-primary-700',
    secondary: 'bg-secondary-50 text-secondary-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-red-50 text-red-700',
    verified: 'bg-primary-600 text-white',
    featured: 'bg-amber-500 text-white',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
