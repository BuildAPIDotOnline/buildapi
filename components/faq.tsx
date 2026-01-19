"use client";
import { useState } from 'react';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  { q: "Do you charge any undisclosed fees?", a: "No, our pricing is transparent and clearly stated." },
  { q: "Are there any hidden fees?", a: "We automatically scale your account to handle growth, with fair overage pricing." },
  { q: "Can you tell me if there are any hidden charges?", a: "Our billing system provides detailed breakdowns every month." },
  // ... add more as per your design
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(1); // 1 is open by default in your image

  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-6xl  container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <span className="text-blue-600 text-sm font-bold tracking-tight mb-4 block">FAQs</span>
          <h2 className="text-5xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <p className="text-slate-500 text-lg mb-10 max-w-md">
            We've compiled the most common questions to help you get started.
          </p>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
            Learn More <ArrowRight size={20} />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-6 cursor-pointer" onClick={() => setOpenIndex(openIndex === idx ? null : idx)}>
              <div className="flex justify-between items-center group">
                <h3 className="text-xl font-semibold text-slate-800 group-hover:text-blue-600 transition">{faq.q}</h3>
                {openIndex === idx ? <Minus className="text-slate-400" /> : <Plus className="text-slate-400" />}
              </div>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: "auto", opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="pt-4 text-slate-500 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};