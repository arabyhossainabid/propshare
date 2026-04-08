'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Angel Investor',
    content: 'PropShare completely revolutionized how I diversify my portfolio. The fractional ownership model allowed me to access premium commercial real estate I previously thought was out of reach.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Real Estate Developer',
    content: 'The platform\'s secondary market liquidity is a game changer. I no longer have my capital locked up for years; I can trade my shares whenever I need liquidity.',
    rating: 5,
  },
  {
    name: 'Emily Rivera',
    role: 'First-time Investor',
    content: 'The dashboard is incredibly intuitive. As a beginner, I found it easy to understand the metrics, yields, and the entire investment process. Highly recommended!',
    rating: 4,
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.tests-header',
        { opacity: 0, y: 50 },
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

      gsap.fromTo(
        '.test-card',
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.tests-grid',
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden">
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

      <div className="container-custom relative z-10">
        <div className="tests-header text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
            <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">
              Testimonials
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-heading">
            What Our <span className="gradient-text">Investors Say</span>
          </h2>
        </div>

        <div className="tests-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, index) => (
            <div key={index} className="test-card card p-8 flex flex-col gap-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < test.rating ? 'text-amber-400 fill-amber-400' : 'text-white/10'}`}
                  />
                ))}
              </div>
              <p className="text-white/60 italic leading-relaxed grow">
                "{test.content}"
              </p>
              <div>
                <h4 className="font-bold text-white">{test.name}</h4>
                <p className="text-xs text-white/40">{test.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
