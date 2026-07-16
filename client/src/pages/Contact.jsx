import { motion } from 'framer-motion';
import { Mail, PhoneCall, MapPin } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';
import { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Thanks for reaching out. Our team will contact you shortly.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="container-vastu max py-20">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">Contact Vastu Max</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-text sm:text-5xl">Let’s talk about your next vehicle.</h1>
          <p className="mt-6 text-lg leading-8 text-text-muted">
            Whether you are buying, selling, or exploring a premium listing, our team is ready to help.
          </p>

          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 shadow-soft">
              <div className="rounded-xl bg-primary-50 p-3 text-primary-600"><Mail className="h-5 w-5" /></div>
              <div>
                <p className="font-semibold text-text">Email</p>
                <p className="text-sm text-text-muted">hello@vastu max.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 shadow-soft">
              <div className="rounded-xl bg-primary-50 p-3 text-primary-600"><PhoneCall className="h-5 w-5" /></div>
              <div>
                <p className="font-semibold text-text">Phone</p>
                <p className="text-sm text-text-muted">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 shadow-soft">
              <div className="rounded-xl bg-primary-50 p-3 text-primary-600"><MapPin className="h-5 w-5" /></div>
              <div>
                <p className="font-semibold text-text">Studio</p>
                <p className="text-sm text-text-muted">Mumbai, Bengaluru, Delhi</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="rounded-3xl border border-border bg-white p-6 shadow-elevated">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Aarav Sharma" />
              <Input label="Email address" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
              <label className="block text-sm font-semibold text-text">
                Message
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows="5" className="mt-2 w-full rounded-[var(--radius-button)] border border-border bg-surface px-4 py-3 text-sm text-text transition-all duration-200 placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" placeholder="Tell us what you need help with." />
              </label>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
