import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Calculator, IndianRupee, Percent, Calendar } from 'lucide-react';
import Card from '../components/ui/Card';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/ui/Motion';

const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const EmiCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(800000);
  const [tenure, setTenure] = useState(60);
  const [interestRate, setInterestRate] = useState(9.5);
  const [downPayment, setDownPayment] = useState(200000);

  const { emi, totalInterest, totalPayment, schedule } = useMemo(() => {
    const principal = Math.max(loanAmount - downPayment, 0);
    const monthlyRate = interestRate / 12 / 100;
    let emiVal = 0;
    if (monthlyRate > 0) {
      emiVal = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
        (Math.pow(1 + monthlyRate, tenure) - 1);
    } else {
      emiVal = principal / tenure;
    }
    const total = emiVal * tenure;
    const interest = total - principal;

    const chartData = [];
    let balance = principal;
    for (let m = 1; m <= Math.min(tenure, 60); m++) {
      const interestPart = balance * monthlyRate;
      const principalPart = emiVal - interestPart;
      balance -= principalPart;
      chartData.push({ month: `M${m}`, balance: Math.max(balance, 0), emi: emiVal });
    }

    return {
      emi: Math.round(emiVal),
      totalInterest: Math.round(interest),
      totalPayment: Math.round(total),
      schedule: chartData,
    };
  }, [loanAmount, tenure, interestRate, downPayment]);

  const Slider = ({ label, value, min, max, step, onChange, format }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-text">{label}</span>
        <span className="font-bold text-primary-600">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary-600"
      />
    </div>
  );

  return (
    <div className="container-vastu max py-12">
      <FadeIn>
        <div className="mb-10 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-sm font-semibold text-primary-700">
            <Calculator className="h-4 w-4" />
            Smart Financing
          </span>
          <h1 className="text-3xl font-bold text-text sm:text-4xl">EMI Calculator</h1>
          <p className="mt-3 text-text-muted">
            Plan your dream ride with instant loan estimates — paperless, transparent, Kuwy-style.
          </p>
        </div>
      </FadeIn>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="p-6 space-y-6">
          <StaggerContainer>
            <StaggerItem>
              <Slider
                label="Vehicle Price"
                value={loanAmount}
                min={100000}
                max={5000000}
                step={50000}
                onChange={setLoanAmount}
                format={formatINR}
              />
            </StaggerItem>
            <StaggerItem>
              <Slider
                label="Down Payment"
                value={downPayment}
                min={0}
                max={loanAmount * 0.8}
                step={10000}
                onChange={setDownPayment}
                format={formatINR}
              />
            </StaggerItem>
            <StaggerItem>
              <Slider
                label="Loan Tenure"
                value={tenure}
                min={12}
                max={84}
                step={6}
                onChange={setTenure}
                format={(v) => `${v} months`}
              />
            </StaggerItem>
            <StaggerItem>
              <Slider
                label="Interest Rate"
                value={interestRate}
                min={6}
                max={18}
                step={0.1}
                onChange={setInterestRate}
                format={(v) => `${v}% p.a.`}
              />
            </StaggerItem>
          </StaggerContainer>
        </Card>

        <div className="space-y-6">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-3xl bg-gradient-to-br from-primary-600 to-blue-700 p-8 text-white shadow-xl"
          >
            <p className="text-sm font-medium text-white/70">Your Monthly EMI</p>
            <p className="mt-2 text-5xl font-bold">{formatINR(emi)}</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/10 p-4">
                <IndianRupee className="h-5 w-5 text-white/70" />
                <p className="mt-1 text-xs text-white/60">Total Payment</p>
                <p className="font-bold">{formatINR(totalPayment)}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <Percent className="h-5 w-5 text-white/70" />
                <p className="mt-1 text-xs text-white/60">Total Interest</p>
                <p className="font-bold">{formatINR(totalInterest)}</p>
              </div>
            </div>
          </motion.div>

          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-text">
              <Calendar className="h-5 w-5 text-primary-600" />
              Amortization Preview
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={schedule}>
                  <defs>
                    <linearGradient id="emiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => formatINR(v)} />
                  <Area type="monotone" dataKey="balance" stroke="#2563EB" fill="url(#emiGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmiCalculator;
