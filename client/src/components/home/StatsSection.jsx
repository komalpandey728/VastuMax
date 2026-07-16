import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ScrollReveal } from '../ui/Motion';

const stats = [
  { value: 10000, suffix: '+', label: 'Verified Vehicles' },
  { value: 500, suffix: '+', label: 'Trusted Vendors' },
  { value: 50, suffix: '+', label: 'Cities Covered' },
  { value: 98, suffix: '%', label: 'Customer Satisfaction' },
];

const Counter = ({ end, suffix, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString('en-IN')}{suffix}
    </span>
  );
};

const StatsSection = () => {
  return (
    <section className="relative -mt-16 z-20">
      <div className="container-vastu max">
        <ScrollReveal>
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border/50 bg-white p-6 shadow-[var(--shadow-elevated)] lg:grid-cols-4 lg:gap-8 lg:p-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-2xl font-bold text-primary-600 sm:text-3xl lg:text-4xl">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-sm text-text-muted">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default StatsSection;
