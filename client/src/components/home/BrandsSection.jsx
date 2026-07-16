import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { POPULAR_BRANDS } from '../../constants';

const BRAND_COLOURS = {
  Maruti: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
  Hyundai: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100' },
  Tata: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-100' },
  Mahindra: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100' },
  Kia: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-100' },
  Honda: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100' },
  Toyota: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
  MG: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
  Volkswagen: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-100' },
  Skoda: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100' },
  Renault: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-100' },
  Nissan: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100' },
};

const stagger = { show: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const BrandsSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-white border-t border-border">
      <div className="container-vastu max">
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="text-center mb-10"
        >
          <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.35em] text-primary-600 mb-2">
            Top Brands
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-2xl font-black tracking-tight text-text sm:text-3xl">
            Browse by Manufacturer
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-2 text-sm text-text-muted">
            India's most popular car and commercial vehicle brands — all verified on Vastu Max
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
        >
          {POPULAR_BRANDS.map((brand) => {
            const colours = BRAND_COLOURS[brand.name] || { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
            return (
              <motion.button
                key={brand.name}
                variants={fadeUp}
                whileHover={{ y: -4, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onClick={() => {
                  const CV_BRANDS = ['Tata Motors', 'Ashok Leyland', 'Mahindra', 'Eicher', 'BharatBenz', 'Force Motors', 'Piaggio'];
                  if (CV_BRANDS.includes(brand.name)) {
                    navigate(`/buy/commercial?brand=${encodeURIComponent(brand.name)}`);
                  } else {
                    navigate(`/buy/cars?brand=${encodeURIComponent(brand.name)}`);
                  }
                }}
                className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border ${colours.bg} ${colours.border} hover:shadow-md transition-all cursor-pointer group`}
              >
                {/* Brand initial avatar */}
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-black text-xl ${colours.text} bg-white shadow-sm border ${colours.border} group-hover:scale-110 transition-transform`}>
                  {brand.name.charAt(0)}
                </div>
                <span className={`text-xs font-bold text-center leading-tight ${colours.text}`}>
                  {brand.name}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export { BrandsSection };
