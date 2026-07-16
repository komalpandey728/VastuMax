import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search, Scale, CreditCard, Car, CheckCircle } from 'lucide-react';

const steps = [
  { icon: CheckCircle, label: 'Drive Home', angle: -90 }, // Top
  { icon: Search, label: 'Browse', angle: -18 },          // Top-right
  { icon: Scale, label: 'Compare', angle: 54 },           // Bottom-right
  { icon: CreditCard, label: 'Finance', angle: 126 },     // Bottom-left
  { icon: Car, label: 'Test Drive', angle: 198 },         // Top-left
];

const CustomerJourney = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      <div className="container-vastu max">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-text sm:text-3xl">Your Journey to the Perfect Ride</h2>
          <p className="mt-2 text-text-muted">From search to steering wheel — we&apos;ve got every step covered</p>
        </div>

        <div ref={ref} className="relative mx-auto w-[320px] h-[320px] sm:w-[384px] sm:h-[384px] flex items-center justify-center shrink-0">
          {/* Rotating ring */}
          <motion.svg
            viewBox="0 0 200 200"
            className="absolute inset-0 h-full w-full"
            initial={{ rotate: -90, opacity: 0 }}
            animate={inView ? { rotate: 0, opacity: 1 } : {}}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <motion.circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="url(#journeyGrad)"
              strokeWidth="3"
              strokeDasharray="565"
              initial={{ strokeDashoffset: 565 }}
              animate={inView ? { strokeDashoffset: 0 } : {}}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
            <defs>
              <linearGradient id="journeyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#16A34A" />
              </linearGradient>
            </defs>
          </motion.svg>

          {/* Center hub */}
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ delay: 0.5, type: 'spring' }}
            className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-blue-700 text-white shadow-xl"
          >
            <span className="text-center text-xs font-bold leading-tight">Click<br />&amp; Drive</span>
          </motion.div>

          {/* Step nodes */}
          {steps.map((step, i) => {
            const rad = (step.angle * Math.PI) / 180;
            const x = 50 + 45 * Math.cos(rad);
            const y = 50 + 45 * Math.sin(rad);
            return (
              <div
                key={step.label}
                className="absolute flex flex-col items-center"
                style={{ 
                  left: `${x}%`, 
                  top: `${y}%`, 
                  transform: 'translate(-50%, -50%)',
                  width: '90px'
                }}
              >
                <motion.div
                  className="flex flex-col items-center w-full"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.15, type: 'spring' }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white border-2 border-primary-200 shadow-md text-primary-600 z-10 hover:border-primary-400 hover:scale-105 transition-all cursor-pointer">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="absolute top-13 text-[10px] font-black text-text bg-white/90 border border-slate-100 px-2 py-0.5 rounded-xl shadow-soft whitespace-nowrap text-center">
                    {step.label}
                  </span>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CustomerJourney;
