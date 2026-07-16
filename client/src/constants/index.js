export const ROLES = {
  ADMIN: 'admin',
  VENDOR: 'vendor',
  CUSTOMER: 'customer',
  GUEST: 'guest',
};

export const API_URL = import.meta.env.VITE_API_URL || '/api';

export const BRAND_COLORS = {
  primary: '#2563EB',
  secondary: '#16A34A',
  background: '#F8FAFC',
  text: '#0F172A',
  accent: '#E2E8F0',
};

export const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG'];
export const TRANSMISSION_TYPES = ['Manual', 'Automatic', 'AMT', 'CVT', 'DCT'];
export const BODY_TYPES = ['Hatchback', 'Sedan', 'SUV', 'MUV', 'Coupe', 'Convertible', 'Pickup', 'Van'];
export const VEHICLE_TYPES = ['Car', 'Bike', 'Scooter', 'Commercial', 'Electric'];
export const OWNERSHIP_TYPES = ['First Owner', 'Second Owner', 'Third Owner', 'Fourth Owner+'];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'year-new', label: 'Year: Newest' },
  { value: 'year-old', label: 'Year: Oldest' },
  { value: 'mileage-low', label: 'Mileage: Low to High' },
];

export const NAV_LINKS = [
  { label: 'Buy', href: '/buy' },
  { label: 'Sell', href: '/sell' },
  { label: 'Compare', href: '/compare' },
  { label: 'Dealers', href: '/vendors' },
  { label: 'EMI Calculator', href: '/emi-calculator' },
];

export const FOOTER_LINKS = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Blog', href: '/blog' },
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQs', href: '/#faq' },
    { label: 'Test Drive', href: '/test-drive' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};

export const POPULAR_BRANDS = [
  { name: 'Maruti Suzuki', logo: 'https://cdn.simpleicons.org/suzuki' },
  { name: 'Hyundai', logo: 'https://cdn.simpleicons.org/hyundai' },
  { name: 'Tata Motors', logo: 'https://cdn.simpleicons.org/tata' },
  { name: 'Mahindra', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPm379b0tDCoZX8mhj7UWwiQrolB0JAoy40cfPIwiYXQ&s=10' },
  { name: 'Honda', logo: 'https://cdn.simpleicons.org/honda' },
  { name: 'Toyota', logo: 'https://cdn.simpleicons.org/toyota' },
  { name: 'Kia', logo: 'https://cdn.simpleicons.org/kia' },
  { name: 'MG', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPm379b0tDCoZX8mhj7UWwiQrolB0JAoy40cfPIwiYXQ&s=10' },
  { name: 'Ashok Leyland', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQi97BsPcFKCQvBV3Dv54G4EqXlKALg2XnSLJVH01N2w&s=10' },
  { name: 'Eicher', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzAwuVW3gS-PpXO9Ro7eKPRxBYA3UiDvLFG9O7BPWERA&s=10' }
];

export const VEHICLE_CATEGORIES = [
  { name: 'Sedan', icon: 'Car', count: '2,400+' },
  { name: 'SUV', icon: 'Truck', count: '3,100+' },
  { name: 'Hatchback', icon: 'CarFront', count: '1,800+' },
  { name: 'Electric', icon: 'Zap', count: '450+' },
  { name: 'Luxury', icon: 'Gem', count: '320+' },
  { name: 'Commercial', icon: 'Bus', count: '180+' },
];
