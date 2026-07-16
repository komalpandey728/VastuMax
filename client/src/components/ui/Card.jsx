import { motion } from 'framer-motion';
import { cn } from '../../utils';

const Card = ({
  children,
  className = '',
  hover = false,
  glass = false,
  padding = true,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: 'var(--shadow-elevated)' } : undefined}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-[var(--radius-card)] border border-border/50 bg-surface',
        glass && 'glass',
        !glass && 'shadow-[var(--shadow-card)]',
        padding && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
