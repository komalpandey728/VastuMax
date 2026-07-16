import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import BenefitTiles from '../components/home/BenefitTiles';
import CustomerJourney from '../components/home/CustomerJourney';
import CategoryTiles from '../components/home/CategoryTiles';
import { BrandsSection } from '../components/home/BrandsSection';
import FeaturedListings from '../components/home/FeaturedListings';
import TestimonialsCarousel from '../components/home/TestimonialsCarousel';
import PartnerMarquee from '../components/home/PartnerMarquee';
import FAQSection from '../components/home/FAQSection';
import NewsletterSection from '../components/home/NewsletterSection';

const Home = () => {
  return (
    <>
      <HeroSection />
      <BenefitTiles />
      <StatsSection />
      <CategoryTiles />
      <CustomerJourney />
      <BrandsSection />
      <FeaturedListings />
      <PartnerMarquee />
      <TestimonialsCarousel />
      <FAQSection />
      <NewsletterSection />
    </>
  );
};

export default Home;
