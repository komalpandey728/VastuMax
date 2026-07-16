import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Car, Truck, ArrowRight, Zap, Shield, Star,
  Cog, Users, Package, Bus
} from 'lucide-react';

const CAR_CATEGORIES = [
  { label: 'Hatchback', href: '/vehicles?bodyType=hatchback', count: '3,200+', color: 'bg-blue-50 text-blue-600 border-blue-100', img: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=240&fit=crop' },
  { label: 'SUV', href: '/vehicles?bodyType=suv', count: '2,800+', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', img: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=240&fit=crop' },
  { label: 'Sedan', href: '/vehicles?bodyType=sedan', count: '1,900+', color: 'bg-violet-50 text-violet-600 border-violet-100', img: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400&h=240&fit=crop' },
  { label: 'Electric', href: '/vehicles?fuel=Electric', count: '650+', color: 'bg-amber-50 text-amber-600 border-amber-100', img: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=240&fit=crop' },
  { label: 'Luxury', href: '/vehicles?bodyType=luxury', count: '420+', color: 'bg-rose-50 text-rose-600 border-rose-100', img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=240&fit=crop' },
  { label: 'MUV / MPV', href: '/vehicles?bodyType=muv', count: '780+', color: 'bg-cyan-50 text-cyan-600 border-cyan-100', img: 'https://images.unsplash.com/photo-1543465077-db45d34b88a5?w=400&h=240&fit=crop' },
];

const CV_CATEGORIES = [
  { label: 'Mini Truck', href: '/vehicles?category=commercial&bodyType=mini-truck', count: '900+', img: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=400&h=240&fit=crop' },
  { label: 'Heavy Truck', href: '/vehicles?category=commercial&bodyType=heavy-truck', count: '540+', img: 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=400&h=240&fit=crop' },
  { label: 'Pickup', href: '/vehicles?category=commercial&bodyType=pickup', count: '380+', img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&h=240&fit=crop' },
];

const HERO_CATEGORIES = [
  {
    title: 'Buy a Car',
    subtitle: 'Certified used cars across India',
    desc: '10,000+ hatchbacks, sedans, SUVs & EVs — verified by Vastu Max experts with 200-point inspection.',
    href: '/buy/cars',
    icon: Car,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&h=500&fit=crop',
    accent: 'from-primary-600/90 to-blue-900/90',
    badge: '10,000+ Cars',
    badgeColor: 'bg-primary-500/90',
    stats: [{ icon: Shield, label: 'Verified' }, { icon: Star, label: '4.8★ Rated' }, { icon: Zap, label: 'EMI Ready' }],
  },
  {
    title: 'Commercial Vehicles',
    subtitle: 'For businesses & fleet operators',
    desc: '2,000+ trucks, tempos, mini-trucks & pickup vans — all RC-clear with full service history.',
    href: '/buy/commercial',
    icon: Truck,
    image: 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=900&h=500&fit=crop',
    accent: 'from-slate-800/90 to-amber-900/85',
    badge: '2,000+ CVs',
    badgeColor: 'bg-amber-500/90',
    stats: [{ icon: Cog, label: 'Fleet Grade' }, { icon: Users, label: 'B2B Ready' }, { icon: Package, label: 'RC Clear' }],
  },
];

const stagger = { show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const CategoryTiles = () => (
  <section className="py-20 bg-slate-50">
    <div className="container-vastu max">
      {/* Section header */}
      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
        className="text-center mb-14"
      >
        <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.35em] text-primary-600 mb-2">
          What We Offer
        </motion.p>
        <motion.h2 variants={fadeUp} className="text-3xl font-black tracking-tight text-text sm:text-4xl">
          Explore by Category
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-3 text-base text-text-muted max-w-xl mx-auto">
          From daily commuters to heavy commercial fleets — every category, every budget, all verified.
        </motion.p>
      </motion.div>

      {/* Hero category tiles (large) */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {HERO_CATEGORIES.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link to={cat.href}>
                <motion.div
                  whileHover={{ scale: 1.015 }}
                  className="group relative h-80 overflow-hidden rounded-3xl shadow-lg cursor-pointer"
                >
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.accent}`} />

                  {/* Badge */}
                  <div className={`absolute top-4 left-4 ${cat.badgeColor} text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm`}>
                    {cat.badge}
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex h-full flex-col justify-end p-7 text-white">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-9 w-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <p className="text-xs font-semibold text-white/70">{cat.subtitle}</p>
                        </div>
                        <h3 className="text-2xl font-black leading-tight">{cat.title}</h3>
                        <p className="mt-1.5 text-sm text-white/75 max-w-xs leading-relaxed">{cat.desc}</p>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 mb-4">
                      {cat.stats.map((s) => {
                        const SIcon = s.icon;
                        return (
                          <span key={s.label} className="flex items-center gap-1 text-xs text-white/70 font-medium">
                            <SIcon className="h-3.5 w-3.5" /> {s.label}
                          </span>
                        );
                      })}
                    </div>

                    <span className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-sm font-bold px-4 py-2 rounded-xl backdrop-blur-sm transition-all self-start group-hover:gap-3">
                      Browse {cat.title} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default CategoryTiles;
