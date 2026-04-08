'use client';

import { Button } from '@/components/ui/button';
import { api, normalizeList, renderText } from '@/lib/api';
import { Category } from '@/lib/api-types';
import { useQuery } from '@tanstack/react-query';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Factory,
  Home,
  Laptop,
  Palmtree,
  Store,
} from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ElementType> = {
  Residential: Home,
  Commercial: Building2,
  Industrial: Factory,
  Retail: Store,
  'Co-working': Laptop,
  Vacation: Palmtree,
};

const gradients = [
  'from-blue-600 to-blue-400',
  'from-emerald-600 to-emerald-400',
  'from-purple-600 to-purple-400',
  'from-amber-600 to-amber-400',
  'from-rose-600 to-rose-400',
  'from-cyan-600 to-cyan-400',
];

export default function CategoriesPreview() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['categories-preview'],
    queryFn: async () => {
      const res = await api.get<{
        success: true;
        message: string;
        data: Category[] | { data?: Category[] };
      }>('/categories');
      return normalizeList<Category>(res.data.data);
    },
  });

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cat-header',
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
        '.cat-card',
        { opacity: 0, y: 60, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.cat-grid',
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if ((!isLoading && categories.length === 0) || isError) {
    return null;
  }

  return (
    <section ref={sectionRef} className='section-padding relative'>
      <div className='container-custom'>
        {/* Header */}
        <div className='cat-header flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16'>
          <div className='space-y-4'>
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20'>
              <span className='text-xs font-medium text-blue-400 uppercase tracking-wider'>
                Browse Categories
              </span>
            </div>
            <h2 className='text-4xl md:text-5xl font-bold font-heading'>
              Invest by <span className='gradient-text'>Property Type</span>
            </h2>
            <p className='text-white/40 text-lg max-w-xl'>
              Explore diverse property categories and find the perfect
              investment opportunity.
            </p>
          </div>
          <Link href='/categories'>
            <Button
              variant='outline'
              className='border-white/10 text-white hover:bg-white/5 rounded-2xl px-6 py-5 self-start md:self-auto group'
            >
              All Categories
              <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
            </Button>
          </Link>
        </div>

        {/* Categories Grid */}
        <div className='cat-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
          {categories.slice(0, 6).map((category, index) => {
            // Keep visual parity for known categories while still supporting new names from API.
            const Icon = iconMap[category.name] || Building2;
            return (
              <Link
                // Dedicated category details route does not exist; use properties page filter route.
                href={`/properties?categoryId=${category.id}`}
                key={category.id}
                className='cat-card group cursor-pointer'
              >
                <div className='relative bg-white/2 backdrop-blur-sm border border-white/5 rounded-2xl p-6 text-center space-y-4 hover:bg-white/5 hover:border-white/10 transition-all duration-500 h-full'>
                  <div
                    className={`absolute inset-0 rounded-2xl bg-linear-to-br ${gradients[index % gradients.length]} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />
                  <div className='relative mx-auto w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-white/20 transition-all duration-300'>
                    <Icon className='w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors' />
                  </div>
                  <div className='relative'>
                    <h3 className='text-sm font-semibold text-white'>
                      {category.name}
                    </h3>
                    <p className='text-xs text-white/30 mt-1'>
                      Explore Properties
                    </p>
                  </div>
                  <ArrowUpRight className='relative w-4 h-4 mx-auto text-white/0 group-hover:text-white/40 translate-y-2 group-hover:translate-y-0 transition-all duration-300' />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
