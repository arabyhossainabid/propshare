'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { UserPlus, Search, CreditCard, Activity } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: UserPlus,
    title: 'Create an Account',
    description: 'Sign up in minutes and complete our seamless KYC process to unlock institutional real estate.',
  },
  {
    icon: Search,
    title: 'Browse Properties',
    description: 'Explore our curated list of high-yield properties securely vetted by our expert committee.',
  },
  {
    icon: CreditCard,
    title: 'Invest Fractionally',
    description: 'Purchase fractional shares starting from low minimums, instantly diversifying your portfolio.',
  },
  {
    icon: Activity,
    title: 'Earn & Track Returns',
    description: 'Monitor your yields in real-time on our advanced dashboard and collect monthly income.',
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hw-header',
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
          },
        }
      );

      gsap.fromTo(
        '.hw-step',
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.hw-grid',
            start: 'top 90%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden">
      <div className="container-custom">
        <div className="hw-header text-center max-w-3xl mx-auto mb-10 md:mb-20 space-y-3 md:space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20">
            <span className="text-xs font-medium text-rose-400 uppercase tracking-wider">
              Simple Process
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-heading">
            How PropShare <span className="gradient-text">Works</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Four simple steps to start building your professional real estate portfolio today.
          </p>
        </div>

        <div className="hw-grid grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8 relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent -translate-y-1/2 z-0" />
          
          {steps.map((step, index) => (
            <div key={index} className="hw-step relative z-10 text-center space-y-4 md:space-y-6">
              <div className="w-14 h-14 md:w-20 md:h-20 mx-auto rounded-2xl md:rounded-3xl bg-card border border-border flex items-center justify-center shadow-xl md:shadow-2xl relative group">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs md:text-sm border-2 md:border-4 border-background">
                  {index + 1}
                </div>
                <step.icon className="w-6 h-6 md:w-8 md:h-8 text-blue-400 relative z-10" />
              </div>
              <div>
                <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-3 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground text-[11px] md:text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
