'use client';

import { PropertyCard } from '@/components/properties/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api, normalizeList, renderText } from '@/lib/api';
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
  Zap,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

// Inline debounce hook to save time
function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function PropertiesPage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState('All');
  const [isFilterManuallySet, setIsFilterManuallySet] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // New Filter and Sort States
  const [priceFilter, setPriceFilter] = useState<{ min: number; max: number } | null>(null);
  const [sortOption, setSortOption] = useState<'popularity' | 'price-asc' | 'price-desc' | 'yield-desc'>('popularity');
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const [showSuggestions, setShowSuggestions] = useState(false);

  // AI Suggestions feature
  // AI Suggestions feature: Optimized for speed (150ms debounce)
  const debouncedSearch = useDebounceValue(searchQuery.trim(), 150);
  const { data: searchSuggestions = [] } = useQuery({
    queryKey: ['ai-search-suggestions', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch.trim()) return [];
      try {
        const res = await api.get<any>(`/ai/search-suggestions?q=${encodeURIComponent(debouncedSearch)}`);
        // Handle both { data: [...] } and direct [...] responses
        return res.data?.data || (Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        return [];
      }
    },
    enabled: debouncedSearch.length >= 1,
  });

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

  // Filter logic
  let filteredProperties = properties.filter((p) => {
    // Category match
    const matchesCategory = effectiveFilter === 'All' || p.category?.name === effectiveFilter;

    // Search match
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());

    // Price match
    let matchesPrice = true;
    if (priceFilter) {
      if (p.pricePerShare < priceFilter.min || p.pricePerShare > priceFilter.max) matchesPrice = false;
    }

    return matchesCategory && matchesSearch && matchesPrice;
  });

  // Sort logic
  filteredProperties = filteredProperties.sort((a, b) => {
    if (sortOption === 'price-asc') return a.pricePerShare - b.pricePerShare;
    if (sortOption === 'price-desc') return b.pricePerShare - a.pricePerShare;
    if (sortOption === 'yield-desc') return (b.expectedReturn || 0) - (a.expectedReturn || 0);
    return 0; // default popularity/recency kept as is
  });

  const paginatedProperties = filteredProperties.slice(0, page * itemsPerPage);
  const hasMore = paginatedProperties.length < filteredProperties.length;

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
    // Reset page on filter change
    setPage(1);

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
  }, [activeFilter, searchQuery, priceFilter, sortOption]);

  const handleSuggestionClick = (sug: string) => {
    setSearchQuery(sug);
    setShowSuggestions(false);
  };

  return (
    <div ref={sectionRef} className='min-h-screen bg-background pt-28 pb-20'>
      {/* Page Header */}
      <div className='container-custom'>
        <div className='page-header space-y-4 mb-12 flex flex-wrap justify-between items-end gap-6'>
          <div>
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20'>
              <Sparkles className='w-3 h-3 text-blue-400' />
              <span className='text-xs font-medium text-blue-400 uppercase tracking-wider'>
                Investment Opportunities
              </span>
            </div>
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold font-heading mt-4'>
              All <span className='gradient-text'>Properties</span>
            </h1>
            <p className='text-white/40 text-lg max-w-2xl mt-4'>
              Browse our complete collection of verified, high-yield investment
              properties. Filter by category, search by name or location.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className='filter-bar space-y-6 mb-12'>
          {/* Search & Controls */}
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1 relative group z-20'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20' />
              <Input
                placeholder='Search properties...'
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='bg-white/5 border-white/10 rounded-2xl pl-12 pr-12 py-6 text-white placeholder:text-white/30 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/30 w-full'
              />
              <Zap className='absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 animate-pulse' />

              {/* AI Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className='absolute top-full left-0 right-0 mt-2 bg-card border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50'>
                  {/* Suggestions List */}
                  {searchSuggestions.map((sug: string, i: number) => (
                    <div
                      key={i}
                      className='px-4 py-3 hover:bg-white/5 cursor-pointer text-sm text-white/80 transition-colors flex items-center gap-2'
                      onClick={() => handleSuggestionClick(sug)}
                    >
                      <Search className='w-3 h-3 text-white/20' /> {renderText(sug)}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className='flex gap-2 flex-wrap items-center'>
              {/* Secondary Filter: Price */}
              <div className='relative group'>
                <Button variant='outline' className='h-[52px] border-white/10 text-white/60 hover:text-white hover:bg-white/5 rounded-xl px-4'>
                  <Filter className='w-4 h-4 mr-2' />
                  {priceFilter ? `Price: $${priceFilter.min}-$${priceFilter.max}` : 'Price Filter'}
                </Button>
                <div className='absolute top-full mt-2 w-48 bg-card border border-white/10 rounded-xl shadow-2xl hidden group-hover:block z-30 overflow-hidden'>
                  <div className='p-2 flex flex-col'>
                    <button onClick={() => setPriceFilter(null)} className='text-sm text-left px-4 py-2 hover:bg-white/5 rounded-md'>Any Price</button>
                    <button onClick={() => setPriceFilter({ min: 0, max: 100 })} className='text-sm text-left px-4 py-2 hover:bg-white/5 rounded-md'>Under $100 / share</button>
                    <button onClick={() => setPriceFilter({ min: 100, max: 500 })} className='text-sm text-left px-4 py-2 hover:bg-white/5 rounded-md'>$100 - $500 / share</button>
                    <button onClick={() => setPriceFilter({ min: 500, max: 999999 })} className='text-sm text-left px-4 py-2 hover:bg-white/5 rounded-md'>Over $500 / share</button>
                  </div>
                </div>
              </div>

              {/* View Mode */}
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setViewMode('grid')}
                className={`rounded-xl h-[52px] w-[52px] transition-all duration-300 border border-white/5 ${viewMode === 'grid'
                  ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-none'
                  : 'bg-white/5 text-white/40 hover:bg-white/10'
                  }`}
              >
                <Grid3X3 className='w-5 h-5' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setViewMode('list')}
                className={`rounded-xl h-[52px] w-[52px] transition-all duration-300 border border-white/5 ${viewMode === 'list'
                  ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-none'
                  : 'bg-white/5 text-white/40 hover:bg-white/10'
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
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border border-white/5 ${effectiveFilter === cat
                  ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-none'
                  : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results count & Sort */}
          <div className='flex items-center justify-between'>
            <p className='text-sm text-white/30'>
              Showing{' '}
              <span className='text-white font-medium'>
                {filteredProperties.length}
              </span>{' '}
              properties
            </p>
            <div className='relative group z-10'>
              <button className='flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors py-2'>
                <SlidersHorizontal className='w-4 h-4' />
                Sort by: {sortOption.replace('-', ' ')}
                <ChevronDown className='w-3 h-3' />
              </button>
              <div className='absolute right-0 top-full mt-2 w-48 bg-card border border-white/10 rounded-xl shadow-2xl hidden group-hover:block overflow-hidden'>
                <div className='p-2 flex flex-col'>
                  <button onClick={() => setSortOption('popularity')} className='text-sm text-left px-4 py-2 hover:bg-white/5 rounded-md'>Popularity</button>
                  <button onClick={() => setSortOption('price-asc')} className='text-sm text-left px-4 py-2 hover:bg-white/5 rounded-md'>Price: Low to High</button>
                  <button onClick={() => setSortOption('price-desc')} className='text-sm text-left px-4 py-2 hover:bg-white/5 rounded-md'>Price: High to Low</button>
                  <button onClick={() => setSortOption('yield-desc')} className='text-sm text-left px-4 py-2 hover:bg-white/5 rounded-md'>Highest Yield</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div
          className={`${viewMode === 'grid'
            ? 'grid md:grid-cols-2 lg:grid-cols-4 gap-6'
            : 'flex flex-col gap-4'
            }`}
        >
          {isLoading &&
            (viewMode === 'grid'
              ? Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={`properties-grid-skeleton-${idx}`}
                  className='rounded-3xl border border-white/5 bg-card overflow-hidden animate-pulse'
                >
                  <div className='aspect-16/10 bg-white/5' />
                  <div className='p-6 space-y-4'>
                    <div className='space-y-2'>
                      <div className='h-4 w-2/3 rounded bg-white/6' />
                      <div className='h-3 w-1/2 rounded bg-white/5' />
                    </div>
                    <div className='grid grid-cols-2 gap-3'>
                      <div className='h-14 rounded-xl bg-white/5' />
                      <div className='h-14 rounded-xl bg-white/5' />
                    </div>
                    <div className='h-2 rounded bg-white/5' />
                    <div className='h-11 rounded-xl bg-white/6' />
                  </div>
                </div>
              ))
              : Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={`properties-list-skeleton-${idx}`}
                  className='rounded-2xl border border-white/5 bg-card p-5 animate-pulse'
                >
                  <div className='flex flex-col md:flex-row gap-4'>
                    <div className='h-40 md:h-28 md:w-72 rounded-xl bg-white/5 shrink-0' />
                    <div className='flex-1 space-y-3'>
                      <div className='h-4 w-2/3 rounded bg-white/6' />
                      <div className='h-3 w-1/3 rounded bg-white/5' />
                      <div className='h-10 w-full rounded bg-white/5' />
                    </div>
                  </div>
                </div>
              )))}

          {paginatedProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              viewMode={viewMode}
            />
          ))}
        </div>

        {/* Load More Pagination */}
        {!isLoading && hasMore && (
          <div className='mt-12 flex justify-center'>
            <Button
              onClick={() => setPage((p) => p + 1)}
              className='bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl px-8 py-6'
            >
              Load More Properties
            </Button>
          </div>
        )}

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
                setPriceFilter(null);
                setSortOption('popularity');
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
