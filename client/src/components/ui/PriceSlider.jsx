import { useState, useEffect } from 'react';

const PriceSlider = ({ min = 0, max = 5000000, initialMin, initialMax, onChange }) => {
  const [low, setLow] = useState(initialMin ?? min);
  const [high, setHigh] = useState(initialMax ?? max);

  useEffect(() => {
    setLow(initialMin ?? min);
  }, [initialMin, min]);

  useEffect(() => {
    setHigh(initialMax ?? max);
  }, [initialMax, max]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (onChange) onChange({ min: low, max: high });
    }, 150);
    return () => clearTimeout(handler);
  }, [low, high]);

  const handleLow = (e) => {
    const val = Math.min(Number(e.target.value), high - 50000);
    setLow(val);
  };
  const handleHigh = (e) => {
    const val = Math.max(Number(e.target.value), low + 50000);
    setHigh(val);
  };

  const formatPrice = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const presets = [
    { label: 'Under ₹5L', min: 0, max: 500000 },
    { label: '₹5L – 10L', min: 500000, max: 1000000 },
    { label: '₹10L – 20L', min: 1000000, max: 2000000 },
    { label: '₹20L+', min: 2000000, max: 5000000 },
  ];

  // Mock listing pricing density values (16 buckets)
  const density = [10, 25, 45, 70, 85, 95, 75, 60, 50, 35, 25, 18, 12, 8, 4, 2];

  return (
    <div className="space-y-4 price-slider-container">
      <style>{`
        .price-slider-container input[type="range"] {
          pointer-events: none;
        }
        .price-slider-container input[type="range"]::-webkit-slider-thumb {
          pointer-events: auto;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #2563eb;
          border: 2px solid white;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
          -webkit-appearance: none;
        }
        .price-slider-container input[type="range"]::-moz-range-thumb {
          pointer-events: auto;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #2563eb;
          border: 2px solid white;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }
      `}</style>

      {/* Live Selected Labels */}
      <div className="flex items-center justify-between text-xs font-black text-primary-600 bg-primary-50 px-3 py-2 rounded-xl">
        <span>Min: {formatPrice(low)}</span>
        <span>Max: {formatPrice(high)}</span>
      </div>

      {/* Histogram + Double Range Track Container */}
      <div className="relative pt-6 pb-2">
        {/* Histogram density bars behind the slider */}
        <div className="flex items-end justify-between h-10 w-full px-1.5 mb-1.5 opacity-60">
          {density.map((val, idx) => {
            // Check if this bar falls within the current low/high selection
            const pct = (idx / density.length) * (max - min) + min;
            const inRange = pct >= low && pct <= high;
            return (
              <div
                key={idx}
                className={`w-[5%] rounded-t-sm transition-all duration-300 ${
                  inRange ? 'bg-primary-500' : 'bg-slate-200'
                }`}
                style={{ height: `${val}%` }}
              />
            );
          })}
        </div>

        {/* Dual Handle Slider Track */}
        <div className="relative h-2">
          <div className="absolute left-0 right-0 top-0 h-2 rounded bg-slate-200" />
          <div
            className="absolute top-0 h-2 rounded bg-primary-600"
            style={{
              left: `${((low - min) / (max - min)) * 100}%`,
              right: `${100 - ((high - min) / (max - min)) * 100}%`,
            }}
          />

          {/* Hidden inputs stacked exactly on top */}
          <input
            type="range"
            min={min}
            max={max}
            step={25000}
            value={low}
            onChange={handleLow}
            className="absolute inset-0 h-2 w-full appearance-none bg-transparent"
            style={{
              zIndex: low > max / 2 ? 5 : 4,
              WebkitAppearance: 'none',
            }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={25000}
            value={high}
            onChange={handleHigh}
            className="absolute inset-0 h-2 w-full appearance-none bg-transparent"
            style={{
              zIndex: high < max / 2 ? 5 : 4,
              WebkitAppearance: 'none',
            }}
          />
        </div>
      </div>

      {/* Preset Quick Filters */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setLow(p.min);
              setHigh(p.max);
            }}
            className="rounded-xl border border-slate-200 hover:border-primary-400 bg-white hover:bg-slate-50 text-[10px] font-bold py-2 px-1 text-center transition-colors cursor-pointer text-text"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PriceSlider;
