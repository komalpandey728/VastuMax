import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Car, Truck, ArrowRight, ShieldCheck,
  Star, Zap, IndianRupee, Clock
} from 'lucide-react';
import passengerCarsBg from '../assets/images/cars/passenger_cars_bg.jpg';
import commercialVehiclesBg from '../assets/images/cv/commercial_vehicles_bg.jpg';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
const stagger = { show: { transition: { staggerChildren: 0.12 } } };

const stats = [
  { icon: Car, value: '10,000+', label: 'Verified Listings' },
  { icon: ShieldCheck, value: '1,200+', label: 'Certified Dealers' },
  { icon: Star, value: '4.8/5', label: 'Buyer Rating' },
  { icon: IndianRupee, value: '0', label: 'Listing Fee' },
];

const BuyLanding = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950 text-white py-24 overflow-hidden">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-primary-600/15 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-violet-600/10 blur-[80px] pointer-events-none" />

        <div className="container-vastu max relative z-10">
          <motion.div
            variants={stagger} initial="hidden" animate="show"
            className="text-center max-w-3xl mx-auto"
          >
            <motion.p variants={fadeUp} className="inline-block text-xs font-bold uppercase tracking-[0.35em] text-primary-400 bg-primary-400/10 border border-primary-400/20 rounded-full px-4 py-1.5 mb-6">
              Vastu Max Marketplace
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              What are you looking to buy?
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-5 text-lg text-slate-300 max-w-xl mx-auto">
              Choose your vehicle category. Every listing on Vastu Max is verified, RC-clear, free from legal disputes and pending traffic penalties, and priced transparently.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Choice Cards */}
      <section className="container-vastu max py-16">
        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {/* Cars */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -6 }}
          >
            <Link to="/buy/cars" className="block group">
              <div className="relative rounded-3xl overflow-hidden h-80 shadow-lg">
                <img
                  src={passengerCarsBg}
                  alt="Browse passenger cars on Vastu Max"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="h-12 w-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Car className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white">Passenger Cars</h2>
                      <p className="text-primary-400 text-sm font-semibold">8,000+ verified listings</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {['Hatchback', 'Sedan', 'SUV', 'MUV', 'Electric', 'Luxury'].map((cat) => (
                      <span key={cat} className="text-[11px] font-bold bg-white/15 text-white px-2.5 py-1 rounded-full border border-white/20">
                        {cat}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-bold px-5 py-3 rounded-2xl w-fit transition-all group-hover:gap-4">
                    Browse Cars <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Commercial Vehicles */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            whileHover={{ y: -6 }}
          >
            <Link to="/buy/commercial" className="block group">
              <div className="relative rounded-3xl overflow-hidden h-80 shadow-lg">
                <img
                  src={commercialVehiclesBg}
                  alt="Browse commercial vehicles on Vastu Max"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="h-12 w-12 bg-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Truck className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white">Commercial Vehicles</h2>
                      <p className="text-amber-400 text-sm font-semibold">2,000+ verified listings</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {['Mini Trucks', 'Pickup Trucks', 'Tempo', 'Buses & Vans', 'Tractors'].map((cat) => (
                      <span key={cat} className="text-[11px] font-bold bg-white/15 text-white px-2.5 py-1 rounded-full border border-white/20">
                        {cat}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold px-5 py-3 rounded-2xl w-fit transition-all group-hover:gap-4">
                    Browse CVs <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex flex-col items-center text-center gap-2 bg-white border border-border rounded-2xl p-5 shadow-soft">
                <div className="h-10 w-10 bg-primary-50 rounded-xl flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary-600" />
                </div>
                <p className="text-2xl font-black text-text">{stat.value}</p>
                <p className="text-xs text-text-muted font-medium">{stat.label}</p>
              </div>
            );
          })}
        </motion.div>
      </section>

      {/* Trust Strips */}
      <section className="border-t border-border bg-slate-50 py-12">
        <div className="container-vastu max">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto"
          >
            {[
              { icon: ShieldCheck, title: '200-Point Inspection', desc: 'Every listed vehicle passes a physical inspection covering chassis, engine, electrical, body, and paperwork.' },
              { icon: Clock, title: 'RC Transfer Support', desc: 'Vastu Max assists with RC name transfer, insurance transfer, and NOC documentation for every transaction.' },
              { icon: Zap, title: 'EMI in 20 Minutes', desc: 'Apply for a loan against any listed vehicle with 27 integrated NBFC and banking lending partners.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex flex-col items-center text-center gap-3 p-6 bg-white rounded-2xl border border-border shadow-soft">
                  <div className="h-12 w-12 bg-primary-50 rounded-2xl flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="font-bold text-text">{item.title}</h3>
                  <p className="text-sm text-text-muted leading-6">{item.desc}</p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Popular Brands Quick Access */}
      <section className="container-vastu max py-12">
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary-600 mb-2">Browse by Brand</p>
          <h2 className="text-2xl font-black text-text">Popular Manufacturers</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-3">
          {[
            { name: 'Maruti Suzuki', displayName: 'Maruti', logo: 'https://cdn.simpleicons.org/suzuki', color: 'bg-blue-50 text-blue-700 border-blue-100' },
            { name: 'Hyundai', displayName: 'Hyundai', logo: 'https://cdn.simpleicons.org/hyundai', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
            { name: 'Tata Motors', displayName: 'Tata', logo: 'https://cdn.simpleicons.org/tata', color: 'bg-sky-50 text-sky-700 border-sky-100' },
            { name: 'Mahindra', displayName: 'Mahindra', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPm379b0tDCoZX8mhj7UWwiQrolB0JAoy40cfPIwiYXQ&s=10', color: 'bg-red-50 text-red-700 border-red-100' },
            { name: 'Kia', displayName: 'Kia', logo: 'https://cdn.simpleicons.org/kia', color: 'bg-violet-50 text-violet-700 border-violet-100' },
            { name: 'Honda', displayName: 'Honda', logo: 'https://cdn.simpleicons.org/honda', color: 'bg-rose-50 text-rose-700 border-rose-100' },
            { name: 'Toyota', displayName: 'Toyota', logo: 'https://cdn.simpleicons.org/toyota', color: 'bg-slate-50 text-slate-700 border-slate-200' },
            { name: 'MG', displayName: 'MG', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPm379b0tDCoZX8mhj7UWwiQrolB0JAoy40cfPIwiYXQ&s=10', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { name: 'Ashok Leyland', displayName: 'Ashok Leyland', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQi97BsPcFKCQvBV3Dv54G4EqXlKALg2XnSLJVH01N2w&s=10', color: 'bg-amber-50 text-amber-700 border-amber-100' },
            { name: 'Eicher', displayName: 'Eicher', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzAwuVW3gS-PpXO9Ro7eKPRxBYA3UiDvLFG9O7BPWERA&s=10', color: 'bg-orange-50 text-orange-700 border-orange-100' },
          ].map((brand) => {
            const isCV = ['Ashok Leyland', 'Eicher'].includes(brand.displayName);
            const targetUrl = isCV
              ? `/buy/commercial?brand=${encodeURIComponent(brand.name)}`
              : `/buy/cars?brand=${encodeURIComponent(brand.name)}`;
            return (
              <Link
                key={brand.name}
                to={targetUrl}
                className={`flex flex-col items-center gap-2.5 p-3 rounded-2xl border ${brand.color} hover:shadow-md transition-all hover:-translate-y-1 text-center`}
              >
                <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-white shadow-sm border border-slate-100 p-1.5 overflow-hidden">
                  <img src={brand.logo} alt={brand.displayName} className="h-full w-full object-contain" />
                </div>
                <span className="text-[10px] font-bold leading-tight">{brand.displayName}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default BuyLanding;
