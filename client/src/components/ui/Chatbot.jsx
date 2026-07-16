import { useState } from 'react';
import { MessageCircle, X, Send, HelpCircle } from 'lucide-react';
import Button from './Button';

const cannedAnswers = [
  {
    question: 'What is the delivery time for a car?',
    answer: 'Most vehicles are ready for inspection within 24 hours and delivery can be arranged in 2-5 business days depending on your city.',
  },
  {
    question: 'Can I book a test drive?',
    answer: 'Yes, customers can book test drives directly from any vehicle detail page with the Book Test Drive form.',
  },
  {
    question: 'How do I compare cars?',
    answer: 'Select vehicles from the catalog and use the Compare Deck at the bottom of the page to open the comparison matrix.',
  },
  {
    question: 'How do I become a vendor?',
    answer: 'Vendors can complete the digital onboarding flow from Sell Car > Vendor Onboarding and submit KYC documents for approval.',
  },
  {
    question: 'How do I save a car to wishlist?',
    answer: 'Log in as a customer, then use the heart button on any vehicle card or listing page to save it to your wishlist.',
  },
];

const fallbackAnswer = 'Great question! Please browse our catalog or contact support through the Contact page for a quick response.';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I am Vastu Max Assistant. Ask me about search, compare, booking, or vendor onboarding.' },
  ]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { from: 'user', text: trimmed };
    const matched = cannedAnswers.find((item) =>
      trimmed.toLowerCase().includes(item.question.toLowerCase().split(' ').slice(0, 3).join(' '))
    );

    const botMessage = {
      from: 'bot',
      text: matched ? matched.answer : fallbackAnswer,
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput('');
  };

  const handleQuickQuestion = (question) => {
    setMessages((prev) => [
      ...prev,
      { from: 'user', text: question },
      { from: 'bot', text: cannedAnswers.find((item) => item.question === question)?.answer || fallbackAnswer },
    ]);
    setOpen(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm">
      <div className="flex justify-end">
        <button
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white shadow-xl shadow-primary-500/20 transition hover:bg-primary-700"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle chat widget"
        >
          {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        </button>
      </div>

      <div className={`mt-3 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-elevated transition-all ${open ? 'max-h-[520px]' : 'max-h-0 opacity-0'} ${open ? 'opacity-100' : 'opacity-0'}`}>
        <div className="border-b border-border bg-slate-950 px-4 py-3 text-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary-300" />
              <div>
                <p className="text-sm font-semibold">Vastu Max Assistant</p>
                <p className="text-[10px] text-slate-400">Canned help for buyers and vendors.</p>
              </div>
            </div>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-slate-300">Quick</span>
          </div>
        </div>

        <div className="flex max-h-[320px] flex-col gap-3 overflow-y-auto p-4 text-xs">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`rounded-2xl px-3 py-2 ${message.from === 'bot' ? 'bg-slate-100 text-slate-900 self-start' : 'bg-primary-600 text-white self-end'} max-w-[90%]`}
            >
              {message.text}
            </div>
          ))}
        </div>

        <div className="border-t border-border px-4 py-3">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about search, compare, onboarding..."
              className="flex-1 rounded-2xl border border-border bg-slate-50 px-3 py-2 text-xs text-text outline-none focus:border-primary-500"
            />
            <Button type="button" icon={Send} className="rounded-2xl px-4 py-2 text-xs" onClick={handleSend}>
              Send
            </Button>
          </div>
          <div className="mt-3 grid gap-2 text-[10px] text-slate-500">
            <span className="font-semibold text-slate-700">Try:</span>
            <div className="flex flex-wrap gap-2">
              {cannedAnswers.slice(0, 3).map((item) => (
                <button
                  key={item.question}
                  type="button"
                  onClick={() => handleQuickQuestion(item.question)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-100"
                >
                  {item.question}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
