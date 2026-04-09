'use client';

import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail } from 'lucide-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

gsap.registerPlugin(ScrollTrigger);

export default function Newsletter() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.nl-card',
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.currentTarget.querySelector('input[type="email"]') as HTMLInputElement).value;
    
    try {
      await api.post('/newsletters/subscribe', { email });
      toast.success('Successfully subscribed to Newsletter!');
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    }
  };

  return (
    <section ref={sectionRef} className="pb-24 pt-12 relative px-6">
      <div className="container-custom relative">
        <div className="nl-card bg-muted/50 border border-border rounded-[40px] p-10 md:p-16 lg:p-20 overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full dark:mix-blend-screen pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full dark:mix-blend-screen pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-xl text-center lg:text-left space-y-6">
              <div className="inline-flex items-center justify-center lg:justify-start gap-3 text-muted-foreground font-medium uppercase tracking-widest text-xs">
                <Mail className="w-5 h-5 text-blue-400" />
                Stay Updated
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground">
                Never miss a <span className="text-blue-500">prime</span> investment
              </h2>
              <p className="text-muted-foreground text-lg">
                Join our newsletter to receive weekly updates on market trends, new property listings, and expert insights directly to your inbox.
              </p>
            </div>

            <div className="w-full lg:w-auto grow max-w-md">
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="relative">
                  <Input 
                    type="email" 
                    placeholder="Enter your email address" 
                    required
                    className="w-full bg-background border-border h-16 pl-6 pr-[140px] rounded-2xl text-foreground placeholder:text-muted-foreground focus:border-blue-500/50"
                  />
                  <Button 
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-6 font-bold"
                  >
                    Subscribe
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground/60 text-center lg:text-left">
                  By subscribing, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
