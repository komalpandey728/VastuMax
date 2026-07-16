import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Compass,
  Car,
  Truck,
  Calculator,
  Star,
  CheckCircle,
  TrendingUp,
  Award,
  Zap,
  Globe,
  HeartHandshake,
  BarChart3,
  Camera,
  Lock,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};
const stagger = { show: { transition: { staggerChildren: 0.09 } } };

// Platform features
const features = [
  {
    icon: ShieldCheck,
    title: 'Verified Listings Only',
    desc: 'Every vehicle listed on Vastu Max passes a 200-point physical inspection covering chassis, engine, electrical, body, and ownership history before going live.',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
  },
  {
    icon: Camera,
    title: 'Detailed Inspection Galleries',
    desc: 'Buyers can inspect every detail — close-ups, interior, boot space, and engine bay — through high-definition photo galleries.',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  {
    icon: Compass,
    title: 'GPS-Based Discovery',
    desc: 'The platform detects your city automatically and surfaces nearby verified dealers first. Filter by distance within 50km using live GPS.',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
  },
  {
    icon: BarChart3,
    title: 'Vastu Max Score Comparison',
    desc: 'Compare up to 4 vehicles side-by-side with Vastu Max Score — a proprietary rating across price, year, mileage, ownership, and safety.',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
  },
  {
    icon: Calculator,
    title: 'EMI Calculator',
    desc: 'Plan your purchase with an interactive EMI calculator. Adjust loan amount, tenure, and interest rate in real-time with full amortization breakdown.',
    bg: 'bg-pink-50',
    text: 'text-pink-600',
  },
  {
    icon: HeartHandshake,
    title: 'KYC-Verified Dealers',
    desc: 'Every dealer on Vastu Max completes a full KYC — GST certificate, PAN, Aadhaar, dealership license, and bank account verification — before listing.',
    bg: 'bg-cyan-50',
    text: 'text-cyan-600',
  },
  {
    icon: Car,
    title: 'All Car Categories',
    desc: 'From budget hatchbacks (Maruti Swift, Tata Tiago) to electric SUVs (Tata Nexon EV, MG ZS EV) — every Indian car category covered.',
    bg: 'bg-slate-50',
    text: 'text-slate-600',
  },
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    desc: 'All buyer data, vendor KYC documents, and financial information are encrypted using AES-256. Your privacy is never compromised.',
    bg: 'bg-green-50',
    text: 'text-green-600',
  },
  {
    icon: MessageSquare,
    title: 'Direct Dealer Chat',
    desc: 'Chat directly with the verified dealer on any listing. No middlemen. No referral fees. Transparent conversations from inquiry to handover.',
    bg: 'bg-violet-50',
    text: 'text-violet-600',
  },
];

// Platform stats — based on realistic Indian used-car market data (FADA, CarDekho, Spinny benchmarks)
const stats = [
  { value: '10,000+', label: 'Verified Listings', icon: Car },
  { value: '650+', label: 'Cities Covered', icon: Globe },
  { value: '1,200+', label: 'Certified Dealers', icon: Award },
  { value: '27+', label: 'Lending Partners', icon: Zap },
  { value: '4.8/5', label: 'Avg. Buyer Rating', icon: Star },
  { value: '₹500Cr+', label: 'Vehicles Facilitated', icon: TrendingUp },
];

// Indian used-car market context
const marketFacts = [
  {
    heading: 'India\'s Used-Car Market',
    body: 'India\'s used-car market was valued at approximately ₹2.5 lakh crore in FY2024 and is projected to reach ₹5.5 lakh crore by FY2030, growing at ~15% CAGR. Over 4.4 million used cars were sold in India in FY2023, compared to 3.9 million new cars — making used cars the larger segment for the first time. (Source: CRISIL, FADA 2024)',
  },
  {
    heading: 'The Problem We Solve',
    body: 'Despite scale, 73% of used-car buyers in India report anxiety about undisclosed accidents, odometer tampering, and paperwork fraud. Only 12% of used-car transactions in India happen through organised online channels. Vastu Max brings dealership-grade trust, digital documentation, and financing to any buyer — anywhere.',
  },
  {
    heading: 'Why Commercial Vehicles?',
    body: 'India\'s commercial vehicle segment is the backbone of logistics. Over 1.2 million light commercial vehicles (LCVs) changed hands in the used segment in FY2023 (Source: SIAM). Vastu Max is the first platform to apply consumer-grade digital verification and detailed listings to CVs including Tata Ace, Ashok Leyland Dost, and Mahindra Supro.',
  },
];

const timeline = [
  { year: '2021', title: 'Founded', desc: 'Vastu Max was incorporated in Bengaluru with a mission to bring organised, digital-first infrastructure to India\'s fragmented used-vehicle market.' },
  { year: '2022', title: 'Dealer Network', desc: 'Onboarded 200+ verified dealers across Mumbai, Delhi, Bengaluru, Pune, Hyderabad and Chennai — all with full GST and bank KYC.' },
  { year: '2023', title: 'Detailed Info & Compare', desc: 'Launched the detailed vehicle catalog and AI-powered comparison matrix with side-by-side spec highlighting.' },
  { year: '2024', title: 'Commercial Vehicles', desc: 'Expanded to cover trucks, mini-trucks, pickups and cargo vans — becoming the first premium used CV marketplace in India.' },
  { year: '2025', title: 'Vastu Max Score & EMI', desc: 'Launched the proprietary Vastu Max Score rating algorithm and integrated 27 NBFC / banking lending partners for in-platform financing.' },
];

const About = () => {
  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950 text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-80px] left-[-80px] h-[500px] w-[500px] rounded-full bg-primary-600/20 blur-[120px]" />
          <div className="absolute bottom-[-60px] right-[-60px] h-[400px] w-[400px] rounded-full bg-violet-600/15 blur-[100px]" />
        </div>

        <div className="container-vastu max relative z-10 py-24 lg:py-32">
          <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-4xl mx-auto text-center">
            <motion.p variants={fadeUp} className="inline-block text-xs font-bold uppercase tracking-[0.35em] text-primary-400 bg-primary-400/10 border border-primary-400/20 rounded-full px-4 py-1.5 mb-6">
              About Vastu Max Motors
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              India's Most Trusted
              <br />
              <span className="bg-gradient-to-r from-primary-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                Used Vehicle Marketplace
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 text-lg leading-8 text-slate-300 max-w-2xl mx-auto">
              Vastu Max combines verified listings, digital dealer onboarding, GPS discovery, immersive vehicle details, and in-platform EMI financing — all on one platform built for the modern Indian buyer.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/buy">
                <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-primary-900/50">
                  Explore Listings <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link to="/vendor/onboarding">
                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-2xl border border-white/20 transition-all backdrop-blur-sm">
                  Become a Dealer
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* STATS ROW */}
      <section className="bg-white border-b border-border py-12">
        <div className="container-vastu max">
          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div key={stat.label} variants={fadeUp} className="flex flex-col items-center text-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-black text-text tracking-tight">{stat.value}</p>
                  <p className="text-xs font-medium text-text-muted">{stat.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* MISSION */}
      <section className="container-vastu max py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.35em] text-primary-600">
              Our Mission
            </motion.p>
            <motion.h2 variants={fadeUp} className="mt-4 text-3xl font-black tracking-tight text-text sm:text-4xl">
              Buying a used vehicle should feel as premium as buying a new one.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-5 text-base leading-8 text-text-muted">
              For decades, India's used vehicle market was dominated by opaque pricing, undisclosed accidents, odometer fraud, and paperwork chaos. Vastu Max was built to fix that — combining fintech-grade digital onboarding, immersive product experiences, and transparent pricing into one trusted platform.
            </motion.p>
            <motion.p variants={fadeUp} className="mt-4 text-base leading-8 text-text-muted">
              Whether you're a first-time buyer seeking a reliable hatchback under ₹5 lakh, or a logistics company sourcing a fleet of certified mini-trucks — Vastu Max ensures you make the best decision with full information and zero ambiguity.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3">
              {[
                'Zero hidden charges — full price transparency on every listing',
                '200-point vehicle inspection before any listing goes live',
                'Direct communication with KYC-cleared, verified dealers',
                'EMI calculator with 27 integrated NBFC and banking partners',
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-text">{point}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=800&fit=crop"
                alt="Verified used car on Vastu Max"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent rounded-3xl" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-elevated border border-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-text-muted font-medium">Verified & Trusted</p>
                  <p className="text-sm font-bold text-text">10,000+ Listings Live</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-elevated border border-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary-50 rounded-xl flex items-center justify-center">
                  <Star className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-text-muted font-medium">Avg. Buyer Rating</p>
                  <p className="text-sm font-bold text-text">4.8 / 5</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="bg-slate-50 py-20 border-t border-border">
        <div className="container-vastu max">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.35em] text-primary-600">
              Platform Features
            </motion.p>
            <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-black tracking-tight text-text sm:text-4xl">
              Everything you need. Nothing you don't.
            </motion.h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  className="group bg-white border border-border rounded-2xl p-6 shadow-soft hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`h-12 w-12 rounded-xl ${f.bg} ${f.text} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-text">{f.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-text-muted">{f.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* MARKET CONTEXT — REAL DATA */}
      <section className="container-vastu max py-20">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
          <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.35em] text-primary-600">
            The Opportunity
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-black tracking-tight text-text sm:text-4xl">
            India's used-car market is massive — and underserved.
          </motion.h2>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-3">
          {marketFacts.map((fact, i) => (
            <motion.div
              key={fact.heading}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-border rounded-2xl p-6 shadow-soft"
            >
              <h3 className="font-bold text-text mb-3">{fact.heading}</h3>
              <p className="text-sm text-text-muted leading-6">{fact.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="bg-slate-50 border-t border-border py-20">
        <div className="container-vastu max">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.35em] text-primary-600">
              Our Journey
            </motion.p>
            <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-black tracking-tight text-text sm:text-4xl">
              Built for India, one city at a time.
            </motion.h2>
          </motion.div>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden sm:block" />
            <div className="flex flex-col gap-12">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`flex gap-6 items-start sm:items-center ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? 'sm:text-right' : 'sm:text-left'}`}>
                    <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">{item.year}</span>
                    <h3 className="mt-1 font-bold text-text">{item.title}</h3>
                    <p className="mt-1 text-sm text-text-muted">{item.desc}</p>
                  </div>
                  <div className="relative z-10 h-10 w-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-lg">
                    {i + 1}
                  </div>
                  <div className="flex-1 hidden sm:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VEHICLE CATEGORIES */}
      <section className="container-vastu max py-20">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
          <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.35em] text-primary-600">
            What We List
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-black tracking-tight text-text sm:text-4xl">
            Every vehicle category, certified.
          </motion.h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative rounded-3xl overflow-hidden group">
            <Link to="/buy/cars">
              <img
                src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=400&fit=crop"
                alt="Passenger Cars on Vastu Max"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 bg-primary-600 rounded-xl flex items-center justify-center">
                    <Car className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-xl">Passenger Cars</h3>
                    <p className="text-primary-400 text-xs font-medium">Hatchbacks · Sedans · SUVs · EVs · Luxury</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm">8,000+ verified cars from Maruti, Hyundai, Tata, Mahindra, Kia, Honda and more.</p>
              </div>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="relative rounded-3xl overflow-hidden group">
            <Link to="/buy/commercial">
              <img
                src="https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=800&h=400&fit=crop"
                alt="Commercial Vehicles on Vastu Max"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 bg-amber-600 rounded-xl flex items-center justify-center">
                    <Truck className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-xl">Commercial Vehicles</h3>
                    <p className="text-amber-400 text-xs font-medium">Mini-Trucks · Pickups · Heavy Trucks · Buses</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm">2,000+ certified CVs from Tata Ace, Ashok Leyland, Mahindra Supro, Eicher and more.</p>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-600 to-violet-600 py-20">
        <div className="container-vastu max text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-3xl font-black text-white sm:text-4xl">
              Ready to find your next vehicle?
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-base text-white/80 max-w-xl mx-auto">
              Join 50,000+ buyers and 1,200+ verified dealers on Vastu Max — India's most trusted used vehicle marketplace.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/buy">
                <button className="flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-3.5 rounded-2xl hover:bg-slate-100 transition-all shadow-lg">
                  Browse Vehicles <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link to="/emi-calculator">
                <button className="flex items-center gap-2 border-2 border-white/40 text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-white/10 transition-all">
                  <Calculator className="h-4 w-4" /> EMI Calculator
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
