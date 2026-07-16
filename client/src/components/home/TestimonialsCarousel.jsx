import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star, ShieldCheck } from 'lucide-react';

const testimonials = [
  {
    name: 'Rahul Sharma',
    city: 'Pune, Maharashtra',
    role: 'Bought a Hyundai Creta',
    text: 'Found my Creta through Vastu Max — EMI was approved in under 20 minutes. The detailed photos and side-by-side comparison saved me two trips to different showrooms. Genuinely seamless experience.',
    rating: 5,
    initials: 'RS',
    color: 'bg-blue-600',
  },
  {
    name: 'Priya Nair',
    city: 'Bengaluru, Karnataka',
    role: 'Sold a Maruti Swift',
    text: 'My Swift was listed on a Sunday afternoon and I had a verified buyer by Tuesday. Transparent pricing, zero middlemen, and the KYC process was completely digital. Best platform to sell a car in India.',
    rating: 5,
    initials: 'PN',
    color: 'bg-violet-600',
  },
  {
    name: 'Amit Patel',
    city: 'Ahmedabad, Gujarat',
    role: 'Compared 3 Tata Nexon variants',
    text: 'The comparison tool showed exactly where each Nexon variant differed — the Vastu Max Score made my decision crystal clear. No confusion, no dealer pressure. Bought the EV variant same week.',
    rating: 5,
    initials: 'AP',
    color: 'bg-emerald-600',
  },
  {
    name: 'Sneha Reddy',
    city: 'Hyderabad, Telangana',
    role: 'Verified Dealer on Vastu Max',
    text: 'Onboarding was smooth — KYC completed in one session, first listing went live the next morning. My inventory reach jumped 4x compared to the local classifieds I was using before.',
    rating: 5,
    initials: 'SR',
    color: 'bg-rose-600',
  },
  {
    name: 'Mohammed Iqbal',
    city: 'Mumbai, Maharashtra',
    role: 'Bought a Tata Ace (Mini Truck)',
    text: 'I needed a verified mini-truck for my courier business. Vastu Max was the only platform that had RC-clear commercial vehicles with service history. Got a Tata Ace within my budget in 3 days.',
    rating: 5,
    initials: 'MI',
    color: 'bg-amber-600',
  },
];

const TestimonialsCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setIndex((i) => (i + 1) % testimonials.length);

  const t = testimonials[index];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950 text-white overflow-hidden relative">
      <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-primary-600/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-violet-600/10 blur-[60px] pointer-events-none" />

      <div className="container-vastu max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary-400 mb-2">Customer Stories</p>
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">What Our Customers Say</h2>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="bg-white/8 border border-white/12 rounded-3xl p-8 sm:p-10 backdrop-blur-sm"
            >
              <Quote className="h-8 w-8 text-primary-400 mb-5" />
              <p className="text-lg leading-relaxed text-white/90 sm:text-xl mb-6">
                "{t.text}"
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 ${t.color} rounded-2xl flex items-center justify-center font-black text-white text-sm shadow-lg`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-white">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.city}</p>
                    <p className="text-xs text-primary-400 font-medium mt-0.5">{t.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              {/* Verified badge */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  <ShieldCheck className="h-3.5 w-3.5" /> Verified Vastu Max Customer
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 p-2.5 transition-all backdrop-blur-sm"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 p-2.5 transition-all backdrop-blur-sm"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`rounded-full transition-all ${i === index ? 'w-6 h-2 bg-primary-400' : 'w-2 h-2 bg-white/25 hover:bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
