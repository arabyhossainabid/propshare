'use client';

import { Button } from '@/components/ui/button';
import { api, normalizeList } from '@/lib/api';
import { Property } from '@/lib/api-types';
import { useQuery } from '@tanstack/react-query';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { PropertyCard } from '@/components/properties/PropertyCard';

gsap.registerPlugin(ScrollTrigger);



export default function FeaturedPreview() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'latest' | 'trending'>('latest');

  const {
    data: latestProperties = [],
    isLoading: isLoadingLatest,
  } = useQuery({
    queryKey: ['home-properties-latest'],
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

  const {
    data: trendingProperties = [],
    isLoading: isLoadingTrending,
  } = useQuery({
    queryKey: ['home-properties-trending'],
    queryFn: async () => {
      try {
        const res = await api.get<{ success: true; data: Property[] | { data?: Property[] } }>('/ai/trending');
        return normalizeList<Property>(res.data.data);
      } catch (e) {
        return [];
      }
    },
  });

  const properties = activeTab === 'latest' ? latestProperties : trendingProperties;
  const isLoading = activeTab === 'latest' ? isLoadingLatest : isLoadingTrending;

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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animate cards when data loads
  useEffect(() => {
    if (isLoading || properties.length === 0) return;
    const cards = document.querySelectorAll('.property-card');
    if (cards.length === 0) return;
    gsap.fromTo(
      '.property-card',
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
      }
    );
  }, [isLoading, properties]);



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
            <p className='text-muted-foreground text-lg max-w-xl'>
              Browse top approved opportunities and start investing in premium
              real estate shares.
            </p>
            
            {/* Toggle Tabs */}
            <div className="flex items-center gap-2 p-1 bg-muted/50 border border-border rounded-xl w-fit mt-6">
              <button 
                onClick={() => setActiveTab('latest')}
                className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'latest' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Latest Assets
              </button>
              <button 
                onClick={() => setActiveTab('trending')}
                className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'trending' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Trending
              </button>
            </div>
          </div>
          <Link href='/properties'>
            <Button
              variant='outline'
              className='border-border text-foreground hover:bg-accent rounded-2xl px-6 py-5 self-start md:self-auto group'
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
                className='rounded-3xl border border-border bg-card overflow-hidden animate-pulse'
              >
                <div className='relative aspect-16/10 rounded-2xl overflow-hidden'>
                  <div className='w-full h-full bg-muted' />
                </div>
                <div className='p-6 space-y-4'>
                  <div className='space-y-2'>
                    <div className='h-4 w-3/4 rounded bg-muted' />
                    <div className='h-3 w-1/2 rounded bg-muted' />
                  </div>
                  <div className='grid grid-cols-2 gap-3'>
                    <div className='h-14 rounded-xl bg-muted' />
                    <div className='h-14 rounded-xl bg-muted' />
                  </div>
                  <div className='space-y-2'>
                    <div className='h-2 rounded bg-muted' />
                    <div className='h-2 rounded bg-muted' />
                  </div>
                  <div className='h-11 rounded-xl bg-muted' />
                </div>
              </div>
            ))}

          {!isLoading && properties.slice(0, 4).map((property) => (
            <PropertyCard key={property.id} property={property} viewMode="grid" />
          ))}

          {!isLoading && properties.length === 0 && (
            <div className='md:col-span-2 lg:col-span-4 text-center py-16 text-sm text-muted-foreground border-2 border-dashed border-border rounded-3xl'>
              No {activeTab} properties found at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
