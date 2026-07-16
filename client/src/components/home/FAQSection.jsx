import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { ScrollReveal } from '../ui/Motion';

const faqs = [
  {
    question: 'How does Vastu Max verify vehicles?',
    answer: 'Every vehicle listed on Vastu Max goes through a comprehensive 200-point inspection covering engine, exterior, interior, documents, and history. Only vehicles that pass our quality standards receive the Verified badge.',
  },
  {
    question: 'Can I book a test drive?',
    answer: 'Yes! You can book a free test drive for any vehicle directly from the vehicle details page. Choose your preferred date and time, and our team will coordinate with the vendor.',
  },
  {
    question: 'How do I become a vendor on Vastu Max?',
    answer: 'Click on "Sell Car" and complete our digital onboarding process. Upload your business documents (GST, PAN, Aadhar, etc.) and our admin team will review and approve your application within 48 hours.',
  },
  {
    question: 'Is there a return policy?',
    answer: 'Select vehicles come with a 7-day return policy. If you\'re not satisfied with your purchase, you can return the vehicle within 7 days for a full refund, subject to terms and conditions.',
  },
  {
    question: 'How does the compare feature work?',
    answer: 'You can compare up to 4 vehicles side by side. Add vehicles to compare from any listing or details page. Differences between similar models are highlighted in green (better) and red (lower) for easy decision making.',
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="section-padding bg-white">
      <div className="container-vastu max">
        <ScrollReveal className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-text">Frequently Asked Questions</h2>
          <p className="text-text-muted">Everything you need to know about Vastu Max</p>
        </ScrollReveal>

        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((faq, index) => (
            <ScrollReveal key={index} delay={index * 0.05}>
              <div className="overflow-hidden rounded-xl border border-border/50 bg-surface">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <span className="pr-4 text-sm font-medium text-text sm:text-base">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-5 w-5 shrink-0 text-text-muted" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="border-t border-border/50 px-6 py-4 text-sm leading-relaxed text-text-muted">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
