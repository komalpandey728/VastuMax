import { Link } from 'react-router-dom';
import { Car, Mail, Phone, MapPin, Share2, Globe, MessageCircle, Users } from 'lucide-react';
import { FOOTER_LINKS } from '../../constants';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-vastu max section-padding pb-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600">
                <Car className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-text">Vastu Max</span>
            </Link>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-text-muted">
              India's most trusted premium vehicle marketplace. Buy and sell verified
              cars with complete transparency, verified details, and expert support.
            </p>
            <div className="flex flex-col gap-2 text-sm text-text-muted">
              <a href="mailto:hello@vastumax.com" className="flex items-center gap-2 hover:text-primary-600">
                <Mail className="h-4 w-4" /> hello@vastumax.com
              </a>
              <a href="tel:+911800123456" className="flex items-center gap-2 hover:text-primary-600">
                <Phone className="h-4 w-4" /> 1800-123-456
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Mumbai, Maharashtra, India
              </span>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-text">Company</h4>
            <ul className="flex flex-col gap-2.5">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-text-muted hover:text-primary-600">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-text">Support</h4>
            <ul className="flex flex-col gap-2.5">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-text-muted hover:text-primary-600">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-text">Legal</h4>
            <ul className="flex flex-col gap-2.5">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-text-muted hover:text-primary-600">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} Vastu Max. All rights reserved.
          </p>
          <div className="flex gap-4">
            {[Share2, Globe, MessageCircle, Users].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/50 text-text-muted transition-colors hover:bg-primary-50 hover:text-primary-600"
                aria-label="Social link"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
