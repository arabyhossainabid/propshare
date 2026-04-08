'use client';

import React, { useEffect, useRef } from 'react';
import { ShieldCheck, TrendingUp, Wallet, Globe, Lock, Clock } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: ShieldCheck,
    title: 'Institutional Grade Security',
    description: 'Bank-level encryption and smart contract auditing ensure your assets are protected at all times.',
  },
  {
    icon: Wallet,
    title: 'Fractional Ownership',
    description: 'Invest in premium real estate with just a fraction of the total cost. Democratizing property investment.',
  },
  {
    icon: TrendingUp,
    title: 'High Yield Returns',
    description: 'Access curated properties selected by our experts for maximum rental yield and capital appreciation.',
  },
  {
    icon: Globe,
    title: 'Global Access',
    description: 'Diversify your portfolio with international real estate opportunities across major global markets.',
  },
  {
    icon: Lock,
    title: 'Transparent Smart Contracts',
    description: 'Every transaction is recorded immutably on the registry, ensuring complete transparency and trust.',
  },
  {
    icon: Clock,
    title: '24/7 Secondary Market',
    description: 'Trade your property shares anytime on our built-in secondary market for instant liquidity.',
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.features-header',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
          },
        }
      );

      gsap.fromTo(
        '.feature-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 90%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding relative bg-background">
      <div className="container-custom relative z-10">
        <div className="features-header text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
              Why Choose PropShare
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-heading">
            Platform <span className="gradient-text">Features</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Experience the next generation of real estate investment with our cutting-edge features.
          </p>
        </div>

        <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="feature-card card p-8 group">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                <feature.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
