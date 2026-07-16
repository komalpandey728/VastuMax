import { cn } from '../../utils';

const Skeleton = ({ className = '', variant = 'rectangular' }) => {
  const variants = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded h-4',
  };

  return (
    <div
      className={cn('skeleton', variants[variant], className)}
      aria-hidden="true"
    />
  );
};

export const SkeletonCard = () => (
  <div className="rounded-[var(--radius-card)] border border-border/50 bg-surface p-4 shadow-[var(--shadow-card)]">
    <Skeleton className="mb-4 h-48 w-full" />
    <Skeleton className="mb-2 h-5 w-3/4" variant="text" />
    <Skeleton className="mb-2 h-4 w-1/2" variant="text" />
    <Skeleton className="h-6 w-1/3" variant="text" />
  </div>
);

export default Skeleton;
