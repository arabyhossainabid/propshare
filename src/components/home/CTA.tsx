'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Bell, CheckCircle, Mail } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      await api.post('/newsletters/subscribe', { email });
    },
    onSuccess: () => {
      setIsSubscribed(true);
      toast.success('Subscribed successfully');
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 3000);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cta-content',
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
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

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      subscribeMutation.mutate();
    }
  };

  return (
    <section
      ref={sectionRef}
      className='section-padding relative overflow-hidden'
    >
      <div className='container-custom relative z-10'>
        <div className='cta-content relative'>
          {/* Main CTA Card */}
          <div className='relative bg-card rounded-[40px] border border-border p-12 md:p-16 lg:p-20 overflow-hidden shadow-2xl'>
            {/* Background effects */}
            <div className='absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]' />
            <div className='absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-emerald-600/5 blur-[100px]' />
            <div className='absolute inset-0 grid-pattern opacity-10' />

            {/* Floating elements */}
            <div className='absolute top-10 right-10 hidden lg:block'>
              <div className='w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center animate-float'>
                <Bell className='w-8 h-8 text-blue-400' />
              </div>
            </div>

            <div className='relative z-10 max-w-2xl text-left'>
              {/* Badge */}
              <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border mb-8'>
                <Mail className='w-3 h-3 text-blue-400' />
                <span className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Stay Updated
                </span>
              </div>

              {/* Title */}
              <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-foreground leading-tight mb-6'>
                Never Miss a{' '}
                <span className='gradient-text'>Premium Listing</span>
              </h2>

              {/* Subtitle */}
              <p className='text-lg text-muted-foreground mb-10 max-w-xl leading-relaxed'>
                Get exclusive early access to new property listings, market
                insights, and investment opportunities delivered directly to
                your inbox.
              </p>

              {/* Newsletter Form */}
              <form
                onSubmit={handleSubscribe}
                className='flex flex-col sm:flex-row gap-3 max-w-lg'
              >
                <div className='relative flex-1'>
                  <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40' />
                  <Input
                    type='email'
                    placeholder='Enter your email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='bg-background border border-border rounded-2xl pl-12 pr-4 py-6 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/30 text-sm'
                  />
                </div>
                <Button
                  type='submit'
                  disabled={isSubscribed || subscribeMutation.isPending}
                  className={`rounded-2xl px-8 py-6 text-sm font-semibold transition-all duration-300 ${
                    isSubscribed
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg'
                  }`}
                >
                  {isSubscribed ? (
                    <>
                      <CheckCircle className='w-4 h-4 mr-2' />
                      Subscribed!
                    </>
                  ) : subscribeMutation.isPending ? (
                    'Subscribing...'
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight className='w-4 h-4 ml-2' />
                    </>
                  )}
                </Button>
              </form>

              {/* Trust line */}
              <div className='flex items-center gap-4 mt-6'>
                <div className='flex -space-x-2'>
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className='w-8 h-8 rounded-full bg-linear-to-br from-blue-500/20 to-purple-500/20 border-2 border-card flex items-center justify-center'
                    >
                      <span className='text-[10px] text-muted-foreground'>
                        {String.fromCharCode(64 + i)}
                      </span>
                    </div>
                  ))}
                </div>
                <p className='text-xs text-muted-foreground/60'>
                  Join 2,500+ investors getting weekly updates
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
