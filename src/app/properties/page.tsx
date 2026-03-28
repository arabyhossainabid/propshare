'use client';

import { PropertyCard } from '@/components/properties/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api, normalizeList } from '@/lib/api';
import { Category, Property } from '@/lib/api-types';
import { useQuery } from '@tanstack/react-query';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ChevronDown,
  Filter,
  Grid3X3,
  LayoutList,
  Search,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

export default function PropertiesPage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState('All');
  const [isFilterManuallySet, setIsFilterManuallySet] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const res = await api.get<{
        success: true;
        message: string;
        data: Property[] | { data?: Property[] };
      }>('/properties', {
        params: { limit: 100 },
      });
      return normalizeList<Property>(res.data.data);
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories-filters'],
    queryFn: async () => {
      const res = await api.get<{
        success: true;
        message: string;
        data: Category[] | { data?: Category[] };
      }>('/categories');
      return normalizeList<Category>(res.data.data);
    },
  });

  const filterCategories = ['All', ...categories.map((c) => c.name)];

  const categoryIdFromUrl = searchParams.get('categoryId');
  const urlFilterName = categoryIdFromUrl
    ? categories.find((c) => c.id === categoryIdFromUrl)?.name
    : undefined;
  const effectiveFilter =
    !isFilterManuallySet && urlFilterName ? urlFilterName : activeFilter;

  const filteredProperties = properties.filter((p) => {
    const matchesCategory =
      effectiveFilter === 'All' || p.category?.name === effectiveFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.page-header',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
        }
      );

      gsap.fromTo(
        '.filter-bar',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.2,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Animate cards when filter changes
    gsap.fromTo(
      '.prop-card',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
      }
    );
  }, [activeFilter, searchQuery]);

  return (
    <div ref={sectionRef} className='min-h-screen bg-[#0a0f1d] pt-28 pb-20'>
      {/* Page Header */}
      <div className='container-custom'>
        <div className='page-header space-y-4 mb-12'>
          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20'>
            <Sparkles className='w-3 h-3 text-blue-400' />
            <span className='text-xs font-medium text-blue-400 uppercase tracking-wider'>
              Investment Opportunities
            </span>
          </div>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold font-heading'>
            All <span className='gradient-text'>Properties</span>
          </h1>
          <p className='text-white/40 text-lg max-w-2xl'>
            Browse our complete collection of verified, high-yield investment
            properties. Filter by category, search by name or location.
          </p>
        </div>

        {/* Filter Bar */}
        <div className='filter-bar space-y-6 mb-12'>
          {/* Search & Controls */}
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1 relative'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20' />
              <Input
                placeholder='Search properties, locations...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='bg-white/5 border-white/10 rounded-2xl pl-12 pr-4 py-6 text-white placeholder:text-white/30 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/30 w-full'
              />
            </div>
            <div className='flex gap-2'>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setViewMode('grid')}
                className={`rounded-xl h-[52px] w-[52px] transition-all duration-300 border border-white/5 ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white hover:bg-blue-500 dark:hover:bg-blue-500 shadow-none'
                    : 'bg-white/5 text-white/40 hover:bg-white/10 dark:hover:bg-white/10 hover:text-white dark:hover:text-white'
                }`}
              >
                <Grid3X3 className='w-5 h-5' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setViewMode('list')}
                className={`rounded-xl h-[52px] w-[52px] transition-all duration-300 border border-white/5 ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white hover:bg-blue-500 dark:hover:bg-blue-500 shadow-none'
                    : 'bg-white/5 text-white/40 hover:bg-white/10 dark:hover:bg-white/10 hover:text-white dark:hover:text-white'
                }`}
              >
                <LayoutList className='w-5 h-5' />
              </Button>
            </div>
          </div>

          {/* Category Filters */}
          <div className='flex flex-wrap gap-2'>
            {filterCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveFilter(cat);
                  setIsFilterManuallySet(true);
                }}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border border-white/5 ${
                  effectiveFilter === cat
                    ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-none'
                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results count */}
          <div className='flex items-center justify-between'>
            <p className='text-sm text-white/30'>
              Showing{' '}
              <span className='text-white font-medium'>
                {filteredProperties.length}
              </span>{' '}
              properties
            </p>
            <button className='flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors'>
              <SlidersHorizontal className='w-4 h-4' />
              Sort by: Popularity
              <ChevronDown className='w-3 h-3' />
            </button>
          </div>
        </div>

        {/* Properties Grid */}
        <div
          className={`${
            viewMode === 'grid'
              ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'flex flex-col gap-4'
          }`}
        >
          {isLoading &&
            (viewMode === 'grid'
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={`properties-grid-skeleton-${idx}`}
                    className='rounded-3xl border border-white/5 bg-[#151c2e] overflow-hidden animate-pulse'
                  >
                    <div className='aspect-[16/10] bg-white/[0.05]' />
                    <div className='p-6 space-y-4'>
                      <div className='space-y-2'>
                        <div className='h-4 w-2/3 rounded bg-white/[0.06]' />
                        <div className='h-3 w-1/2 rounded bg-white/[0.05]' />
                      </div>
                      <div className='grid grid-cols-2 gap-3'>
                        <div className='h-14 rounded-xl bg-white/[0.05]' />
                        <div className='h-14 rounded-xl bg-white/[0.05]' />
                      </div>
                      <div className='h-2 rounded bg-white/[0.05]' />
                      <div className='h-11 rounded-xl bg-white/[0.06]' />
                    </div>
                  </div>
                ))
              : Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={`properties-list-skeleton-${idx}`}
                    className='rounded-2xl border border-white/5 bg-[#151c2e] p-5 animate-pulse'
                  >
                    <div className='flex flex-col md:flex-row gap-4'>
                      <div className='h-40 md:h-28 md:w-72 rounded-xl bg-white/[0.05] shrink-0' />
                      <div className='flex-1 space-y-3'>
                        <div className='h-4 w-2/3 rounded bg-white/[0.06]' />
                        <div className='h-3 w-1/3 rounded bg-white/[0.05]' />
                        <div className='h-10 w-full rounded bg-white/[0.05]' />
                      </div>
                    </div>
                  </div>
                )))}

          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              viewMode={viewMode}
            />
          ))}
        </div>

        {/* Empty State */}
        {!isLoading && filteredProperties.length === 0 && (
          <div className='text-center py-20 space-y-4'>
            <div className='w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto'>
              <Filter className='w-8 h-8 text-white/20' />
            </div>
            <h3 className='text-xl font-bold text-white'>
              No properties found
            </h3>
            <p className='text-white/40'>
              Try adjusting your filters or search query.
            </p>
            <Button
              onClick={() => {
                setActiveFilter('All');
                setSearchQuery('');
              }}
              variant='outline'
              className='border-white/10 text-white hover:bg-white/5 rounded-xl'
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
