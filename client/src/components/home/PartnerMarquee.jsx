const partners = [
  { name: 'HDFC Bank', logo: 'https://logo.clearbit.com/hdfcbank.com' },
  { name: 'ICICI Bank', logo: 'https://logo.clearbit.com/icicibank.com' },
  { name: 'Axis Bank', logo: 'https://logo.clearbit.com/axisbank.com' },
  { name: 'SBI', logo: 'https://logo.clearbit.com/sbi.co.in' },
  { name: 'Kotak', logo: 'https://logo.clearbit.com/kotak.com' },
  { name: 'Bajaj Finserv', logo: 'https://logo.clearbit.com/bajajfinserv.in' },
  { name: 'Tata Capital', logo: 'https://logo.clearbit.com/tatacapital.com' },
  { name: 'Mahindra Finance', logo: 'https://logo.clearbit.com/mahindrafinance.com' },
];

const PartnerMarquee = () => (
  <section className="py-12 border-y border-border bg-slate-50 overflow-hidden">
    <div className="container-vastu max mb-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-text-muted">
        27+ Lending Partners
      </p>
    </div>
    <div className="relative">
      <div className="flex animate-marquee gap-12 whitespace-nowrap">
        {[...partners, ...partners].map((p, i) => (
          <div key={`${p.name}-${i}`} className="flex items-center gap-3 shrink-0 opacity-60 hover:opacity-100 transition-opacity">
            <img src={p.logo} alt={p.name} className="h-8 w-auto grayscale hover:grayscale-0 transition" onError={(e) => { e.target.style.display = 'none'; }} />
            <span className="text-sm font-semibold text-text-muted">{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PartnerMarquee;
