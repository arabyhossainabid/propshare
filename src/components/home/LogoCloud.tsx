'use client';
import React from 'react';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';

export default function LogoCloud() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.logo-item',
        { opacity: 0, y: 20 },
        {
          opacity: 0.5,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const logos = [
    { name: 'Goldman Sachs', icon: '🏦' },
    { name: 'Morgan Stanley', icon: '🏗️' },
    { name: 'BlackRock', icon: '🏙️' },
    { name: 'CBRE', icon: '🏢' },
    { name: 'JLL', icon: '🏡' },
    { name: 'Knight Frank', icon: '🏰' },
  ];

  return (
    <div ref={containerRef} className='py-20 border-y border-border/50 bg-muted/10'>
      <div className='container-custom'>
        <p className='text-[10px] font-black uppercase tracking-[0.3em] text-center text-muted-foreground mb-12'>
          Trusted by Industry Leaders & Institutions
        </p>
        <div className='grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8 items-center justify-items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-700'>
          {logos.map((logo) => (
            <div key={logo.name} className='logo-item flex items-center gap-3 group cursor-default'>
              <span className='text-3xl filter grayscale group-hover:grayscale-0 transition-all'>{logo.icon}</span>
              <span className='text-sm font-bold text-foreground font-heading tracking-tight'>{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
