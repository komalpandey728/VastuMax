import { useState } from 'react';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { ScrollReveal } from '../ui/Motion';
import Button from '../ui/Button';
import Input from '../ui/Input';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Subscribed! We\'ll keep you updated on the best deals.');
    setEmail('');
  };

  return (
    <section className="section-padding">
      <div className="container-vastu max">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 px-8 py-12 text-center sm:px-16 sm:py-16">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white" />
              <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white" />
            </div>

            <div className="relative z-10">
              <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
                Stay Updated on Best Deals
              </h2>
              <p className="mb-8 text-white/70">
                Get notified about new arrivals, price drops, and exclusive offers.
              </p>

              <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={Mail}
                  containerClassName="flex-1"
                  className="border-0 bg-white/10 text-white placeholder:text-white/50"
                  required
                />
                <Button type="submit" variant="secondary" size="lg">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default NewsletterSection;
