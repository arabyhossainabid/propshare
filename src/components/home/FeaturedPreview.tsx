'use client';

import { Button } from '@/components/ui/button';
import { api, normalizeList } from '@/lib/api';
import { Property } from '@/lib/api-types';
import { useQuery } from '@tanstack/react-query';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { PropertyCard } from '@/components/properties/PropertyCard';

gsap.registerPlugin(ScrollTrigger);



export default function FeaturedPreview() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const {
    data: properties = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['home-properties'],
    queryFn: async () => {
      const res = await api.get<{
        success: true;
        message: string;
        data: Property[] | { data?: Property[] };
      }>('/properties', {
        params: {
          limit: 4,
          status: 'APPROVED',
        },
      });
      return normalizeList<Property>(res.data.data);
    },
  });

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.fp-header',
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
        '.property-card',
        { opacity: 0, y: 80, rotateY: 5 },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.properties-grid',
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);



  return (
    <section ref={sectionRef} className='section-padding relative'>
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-blue-600/3 blur-[200px]' />

      <div className='container-custom relative z-10'>
        {/* Header */}
        <div className='fp-header flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16'>
          <div className='space-y-4'>
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20'>
              <Sparkles className='w-3 h-3 text-emerald-400' />
              <span className='text-xs font-medium text-emerald-400 uppercase tracking-wider'>
                Properties
              </span>
            </div>
            <h2 className='text-4xl md:text-5xl font-bold font-heading'>
              Explore <span className='gradient-text'>Properties</span>
            </h2>
            <p className='text-white/40 text-lg max-w-xl'>
              Browse top approved opportunities and start investing in premium
              real estate shares.
            </p>
          </div>
          <Link href='/properties'>
            <Button
              variant='outline'
              className='border-white/10 text-white hover:bg-white/5 rounded-2xl px-6 py-5 self-start md:self-auto group'
            >
              View All Properties
              <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
            </Button>
          </Link>
        </div>

        {/* Properties Grid */}
        <div className='properties-grid grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {isLoading &&
            Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={`home-prop-skeleton-${idx}`}
                className='rounded-3xl border border-white/5 bg-[#151c2e] overflow-hidden animate-pulse'
              >
                <div className='aspect-[16/10] bg-white/[0.05]' />
                <div className='p-6 space-y-4'>
                  <div className='space-y-2'>
                    <div className='h-4 w-3/4 rounded bg-white/[0.06]' />
                    <div className='h-3 w-1/2 rounded bg-white/[0.05]' />
                  </div>
                  <div className='grid grid-cols-2 gap-3'>
                    <div className='h-14 rounded-xl bg-white/[0.05]' />
                    <div className='h-14 rounded-xl bg-white/[0.05]' />
                  </div>
                  <div className='space-y-2'>
                    <div className='h-2 rounded bg-white/[0.05]' />
                    <div className='h-2 rounded bg-white/[0.05]' />
                  </div>
                  <div className='h-11 rounded-xl bg-white/[0.06]' />
                </div>
              </div>
            ))}

          {(isLoading ? [] : properties.slice(0, 4)).map((property) => (
            <PropertyCard key={property.id} property={property} viewMode="grid" />
          ))}

          {!isLoading && isError && (
            <div className='md:col-span-2 lg:col-span-4 text-center py-16 text-sm text-white/40'>
              Failed to load properties.
            </div>
          )}

          {!isLoading && !isError && properties.length === 0 && (
            <div className='md:col-span-2 lg:col-span-4 text-center py-16 text-sm text-white/40'>
              No properties found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
