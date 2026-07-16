import { motion } from 'framer-motion';
import { CreditCard, FileCheck, Zap, Shield, Clock, Headphones, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const benefits = [
  {
    icon: CreditCard,
    title: 'Access to Credit',
    desc: 'Pre-approved loans from 27+ lending partners in minutes. EMI starts at ₹5,999/mo.',
    color: 'from-blue-500 to-primary-600',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    stat: '27+ Partners',
  },
  {
    icon: FileCheck,
    title: 'Paperless Processing',
    desc: 'Upload docs once — RC transfer, insurance & registration handled end-to-end.',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    stat: '100% Digital',
  },
  {
    icon: Zap,
    title: 'Instant Approval',
    desc: 'Loan sanction in under 30 minutes with Aadhaar-based digital KYC verification.',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    stat: '< 30 mins',
  },
  {
    icon: Shield,
    title: 'Verified Listings',
    desc: 'Every vehicle passes a rigorous 200-point quality inspection before listing.',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    text: 'text-violet-600',
    stat: '200-Point Check',
  },
  {
    icon: Clock,
    title: 'Click & Drive',
    desc: 'Book, finance, and drive home same day. Zero wait time with instant delivery.',
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    stat: 'Same Day',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    desc: 'Dedicated relationship manager from first enquiry all the way to delivery.',
    color: 'from-cyan-500 to-sky-600',
    bg: 'bg-cyan-50',
    text: 'text-cyan-600',
    stat: 'Always On',
  },
];

const stagger = { show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

const BenefitTiles = () => (
  <section className="py-20 bg-white border-b border-border">
    <div className="container-vastu max">
      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={stagger}
        className="text-center mb-14"
      >
        <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.35em] text-primary-600 mb-2">
          Why Vastu Max
        </motion.p>
        <motion.h2 variants={fadeUp} className="text-3xl font-black tracking-tight text-text sm:text-4xl">
          The fintech-meets-automotive experience
          <span className="block text-primary-600">you actually deserve.</span>
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-4 text-base text-text-muted max-w-2xl mx-auto">
          Built for the modern Indian buyer — digital-first, paperless, and radically transparent.
        </motion.p>
      </motion.div>

      <motion.div
        variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {benefits.map((b) => {
          const Icon = b.icon;
          return (
            <motion.div
              key={b.title}
              variants={fadeUp}
              whileHover={{ y: -6, scale: 1.015 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="group relative rounded-3xl border border-border bg-white p-6 shadow-soft hover:shadow-lg hover:border-primary-200/60 transition-all cursor-default overflow-hidden"
            >
              {/* Subtle gradient top accent */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${b.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

              <div className="flex items-start justify-between mb-4">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${b.color} text-white shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider ${b.text} ${b.bg} px-2.5 py-1 rounded-full border ${b.bg.replace('bg-', 'border-')} opacity-80`}>
                  {b.stat}
                </span>
              </div>
              <h3 className="text-lg font-bold text-text mb-2">{b.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{b.desc}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-12 text-center"
      >
        <Link to="/about">
          <button className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all text-sm group">
            Learn more about how Vastu Max works
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </motion.div>
    </div>
  </section>
);

export default BenefitTiles;
