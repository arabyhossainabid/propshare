'use client';
import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const faqs = [
  {
    question: 'What is fractional real estate investing?',
    answer: 'Fractional real estate investing allows multiple investors to pool their capital to buy shares in a single high-value property. Each investor owns a percentage of the asset and earns a proportional share of the rental income and capital appreciation.',
  },
  {
    question: 'How do I earn rental income?',
    answer: 'Rental income is collected monthly from the tenants of the property. After deducting management fees and maintenance costs, the remaining profit is distributed to shareholders based on their ownership percentage.',
  },
  {
    question: 'What is the minimum investment amount?',
    answer: 'At PropShare, we aim to make real estate accessible. You can start investing with as little as ৳5,000 in certain properties, although the minimum vary depending on the asset type and location.',
  },
  {
    question: 'Is my investment secure?',
    answer: 'Yes, all properties are legally registered under a Special Purpose Vehicle (SPV) or a Trust. Investors are legal beneficiaries of this entity. We also conduct rigorous due diligence and only list RERA-approved or verified properties.',
  },
  {
    question: 'Can I sell my shares whenever I want?',
    answer: 'We provide a secondary market where you can list your shares for sale to other investors on the platform. Additionally, we have scheduled exit windows every 3-5 years where the entire property may be sold.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className='py-14 md:py-24 bg-background relative overflow-hidden'>
      {/* Background decoration */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none' />

      <div className='container-custom relative z-10'>
        <div className='max-w-3xl mx-auto'>
          <div className='text-center mb-16'>
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6'>
              <HelpCircle className='w-3.5 h-3.5 text-blue-500' />
              <span className='text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]'>Common Questions</span>
            </div>
            <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-foreground mb-4 md:mb-6'>
              Everything You Need to <span className='gradient-text'>Know</span>
            </h2>
            <p className='text-muted-foreground text-lg'>
              New to fractional investing? Here are the answers to the most common questions our investors ask.
            </p>
          </div>

          <div className='space-y-4'>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`group border rounded-[24px] overflow-hidden transition-all duration-300 ${
                  openIndex === index 
                    ? 'border-blue-500/30 bg-muted/30 shadow-xl shadow-blue-500/5' 
                    : 'border-border bg-card hover:border-blue-500/20'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className='w-full px-8 py-6 flex items-center justify-between text-left gap-4'
                >
                  <span className={`text-lg font-bold transition-colors ${openIndex === index ? 'text-blue-500' : 'text-foreground hover:text-blue-500'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${openIndex === index ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 rotate-180' : 'bg-muted text-muted-foreground'}`}>
                    {openIndex === index ? <Minus className='w-4 h-4' /> : <Plus className='w-4 h-4' />}
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className='px-8 pb-6 text-muted-foreground leading-relaxed'>
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className='mt-16 p-8 rounded-[32px] bg-linear-to-br from-blue-600 to-indigo-600 text-white text-center shadow-2xl shadow-blue-500/20'>
            <h3 className='text-2xl font-bold mb-4'>Still have questions?</h3>
            <p className='text-blue-100 mb-8 max-w-md mx-auto'>
              Our investment advisors are available 24/7 to help you make the right choice for your portfolio.
            </p>
            <div className='flex flex-wrap justify-center gap-4'>
              <Link href='/contact'>
                <button className='px-8 h-14 bg-white text-blue-600 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-blue-50 transition-all'>
                  Contact Support
                </button>
              </Link>
              <Link href='/help'>
                <button className='px-8 h-14 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-white/20 transition-all'>
                  Visit Help Center
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
