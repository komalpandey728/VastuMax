import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const slideInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
};

const slideInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

const PageTransition = ({ children, className = '' }) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={fadeInUp}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

const ScrollReveal = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}) => {
  const variants = {
    up: fadeInUp,
    down: { initial: { opacity: 0, y: -30 }, animate: { opacity: 1, y: 0 } },
    left: slideInLeft,
    right: slideInRight,
    scale: scaleIn,
    fade: fadeIn,
  };

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-50px' }}
      variants={variants[direction] || fadeInUp}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StaggerContainer = ({ children, className = '', staggerDelay = 0.1 }) => (
  <motion.div
    initial="initial"
    whileInView="animate"
    viewport={{ once: true }}
    variants={{
      animate: { transition: { staggerChildren: staggerDelay } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

const StaggerItem = ({ children, className = '' }) => (
  <motion.div
    variants={fadeInUp}
    transition={{ duration: 0.4 }}
    className={className}
  >
    {children}
  </motion.div>
);

const FadeIn = ({ children, className = '', delay = 0 }) => (
  <ScrollReveal direction="fade" delay={delay} className={className}>
    {children}
  </ScrollReveal>
);

export {
  PageTransition,
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  FadeIn,
  fadeInUp,
  fadeIn,
  scaleIn,
};
