'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: 'What is fractional real estate investing?',
    a: 'Fractional investing allows multiple investors to pool their capital to buy a property. You own a fractional share, entitling you to a proportional share of the rental income and capital appreciation.',
  },
  {
    q: 'How do I earn returns?',
    a: 'Returns come from two sources: monthly rental income distributed proportionally and capital appreciation if the property is sold or values increase over time.',
  },
  {
    q: 'Can I sell my shares easily?',
    a: 'Yes! PropShare offers a managed secondary market where you can list your shares for sale to other verified users on the platform.',
  },
  {
    q: 'What are the fees associated with investing?',
    a: 'We charge a transparent 1% sourcing fee upon initial investment and a 5% management fee on the monthly rental income. There are zero hidden charges.',
  },
  {
    q: 'Are these properties vetted?',
    a: 'Absolutely. Every property undergoes a rigorous 50-point institutional-grade vetting process by our expert real estate team before being listed.',
  },
];

export default function FAQs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.faqs-section',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-muted/30 border-y border-border">
      <div className="container-custom faqs-section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <span className="text-xs font-medium text-cyan-400 uppercase tracking-wider">
                Support & Info
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Find quick answers to common questions about investing with PropShare. Can't find what you're looking for? Reach out to our support team.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-border rounded-2xl bg-card overflow-hidden transition-all duration-300 hover:border-border/60"
              >
                <button
                  className="w-full flex items-center justify-between p-6 text-left"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="font-bold text-foreground">{faq.q}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                  />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-500 ${openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="p-6 pt-0 text-muted-foreground text-sm leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
