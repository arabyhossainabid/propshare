'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api, normalizeList, renderText } from '@/lib/api';
import { Property } from '@/lib/api-types';
import { useQuery } from '@tanstack/react-query';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

interface HeroStat {
  value: string;
  label: string;
}

interface HeroProps {
  heroStats?: HeroStat[];
}

export default function Hero({ heroStats }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const displayStats = heroStats ?? [];

  const { data: featuredProperties = [] } = useQuery({
    queryKey: ['hero-featured-property'],
    queryFn: async () => {
      const res = await api.get<{
        success: true;
        message: string;
        data: Property[] | { data?: Property[] };
      }>('/properties/featured');
      return normalizeList<Property>(res.data.data);
    },
  });

  const featuredProperty = featuredProperties[0];
  const featuredImage =
    featuredProperty?.images?.[0] ||
    featuredProperty?.imageUrl ||
    '/hero-property.png';

  // Main hero entrance animation (runs once)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });

      tl.fromTo(
        '.hero-badge',
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.2)' }
      );

      tl.fromTo(
        '.hero-title-line',
        { opacity: 0, y: 40, rotateX: -10 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power3.out',
        },
        '-=0.2'
      );

      tl.fromTo(
        '.hero-subtitle',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        '-=0.3'
      );

      tl.fromTo(
        '.hero-cta',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' },
        '-=0.2'
      );

      // Orbs
      gsap.to('.orb-1', { x: 100, y: -50, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.orb-2', { x: -80, y: 60, duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.orb-3', { x: 60, y: 80, duration: 12, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Stats animate in only when data arrives
  useEffect(() => {
    if (displayStats.length === 0) return;
    const statEls = document.querySelectorAll('.hero-stat');
    if (statEls.length === 0) return;
    gsap.fromTo(
      '.hero-stat',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, ease: 'power2.out' }
    );
  }, [displayStats]);

  return (
    <section
      ref={heroRef}
      className='relative min-h-[55vh] lg:min-h-[65vh] flex items-center justify-center overflow-hidden pt-16 lg:pt-20'
    >
      {/* Background Elements */}
      <div className='absolute inset-0'>
        {/* Grid Pattern */}
        <div className='absolute inset-0 grid-pattern opacity-30' />

        {/* Floating Orbs */}
        <div className='orb-1 absolute top-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]' />
        <div className='orb-2 absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-emerald-500/8 blur-[100px]' />
        <div className='orb-3 absolute top-[50%] left-[50%] w-[300px] h-[300px] rounded-full bg-purple-600/5 blur-[80px]' />

        {/* Gradient overlay */}
        <div className='absolute inset-0 bg-linear-to-b from-background via-transparent to-background' />
      </div>

      <div className='container-custom relative z-10 py-12 lg:py-20'>
        <div className='grid lg:grid-cols-2 gap-12 lg:gap-20 items-center'>
          {/* Left Content */}
          <div ref={textRef} className='space-y-5 lg:space-y-8'>
            {/* Badge */}
            <div className='hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm'>
              <div className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse' />
              <span className='text-xs font-medium text-blue-400 uppercase tracking-wider'>
                Live Investment Platform
              </span>
            </div>

            {/* Title */}
            <div className='space-y-2'>
              <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-foreground'>
                <span className='hero-title-line block'>Invest in</span>
                <span className='hero-title-line block gradient-text'>
                  Premium Real
                </span>
                <span className='hero-title-line block'>
                  Estate <span className='text-foreground/40'>Shares</span>
                </span>
                {featuredProperty && (
                  <p className="text-sm text-blue-500 mt-4 opacity-50">Featuring: {renderText(featuredProperty.title)}</p>
                )}
              </h1>
            </div>

            {/* Subtitle */}
            <p className='hero-subtitle text-sm sm:text-base text-muted-foreground max-w-lg leading-relaxed'>
              Own fractional shares in institutional-grade properties. Start
              investing with as little as ৳5,000 and earn monthly rental income
              from premium real estate across Bangladesh.
            </p>

            {/* CTA Buttons */}
            <div className='flex flex-wrap gap-4'>
              <Link href='/properties'>
                <Button className='hero-cta bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl px-8 py-6 text-sm font-semibold shadow-2xl transition-all duration-300 group'>
                  Explore Properties
                  <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            {displayStats.length > 0 && (
              <div ref={statsRef} className='flex flex-wrap gap-8 pt-4'>
                {displayStats.map((stat) => (
                  <div key={stat.label} className='hero-stat'>
                    <h3 className='text-sm font-semibold text-foreground'>
                      {renderText(stat.value)}
                    </h3>
                    <div className='text-xs text-muted-foreground uppercase tracking-wider mt-1'>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Content - Hero Image */}
          <div ref={imageRef} className='relative hidden lg:block'>
            {/* Main Image */}
            <div className='relative rounded-3xl overflow-hidden shadow-3xl border border-border'>
              <div className='aspect-4/5 relative'>
                <Image
                  src={featuredImage}
                  alt={renderText(featuredProperty?.title) || 'Premium Property'}
                  fill
                  className='object-cover'
                  priority
                />
                <div className='absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-80' />
              </div>

              <div className='absolute bottom-6 left-6'>
                <Badge className='bg-blue-600 dark:bg-blue-600/30 text-white dark:text-blue-200 border-blue-500/30'>
                  {renderText(featuredProperty?.title) || 'Verified Opportunity'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2'>
        <span className='text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40'>
          Scroll
        </span>
        <div className='w-5 h-8 rounded-full border border-border flex items-start justify-center p-1'>
          <div className='w-1 h-2 rounded-full bg-muted-foreground/40 animate-bounce' />
        </div>
      </div>
    </section>
  );
}
