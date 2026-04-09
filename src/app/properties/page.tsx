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

  const categoryIdFromUrl = searchParams.get('categoryId');
  const urlFilterName = categoryIdFromUrl
    ? categories.find((c) => c.id === categoryIdFromUrl)?.name
    : undefined;
  const effectiveFilter =
    !isFilterManuallySet && urlFilterName ? urlFilterName : activeFilter;
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties'], // Fetch basic list once for local matching
    queryFn: async () => {
      const res = await api.get<{
        success: true;
        message: string;
        data: Property[] | { data?: Property[] };
      }>('/properties', { params: { limit: 1000 } });
      return normalizeList<Property>(res.data.data);
    },
  });

  const debouncedSearch = useDebounceValue(searchQuery.trim(), 100);
  const { data: searchSuggestions = [], isLoading: isSuggestionsLoading } = useQuery({
    queryKey: ['ai-search-suggestions', debouncedSearch, properties.length, searchQuery],
    queryFn: async () => {
      let results: string[] = [];

      // 1. Instant Local Matches (prioritize raw searchQuery for real-time feel)
      if (searchQuery.trim().length > 0) {
        results = properties
          .filter(p => 
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            p.location.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(p => p.title)
          .slice(0, 4);
      }

      // 2. Fetch from AI API (debounced to avoid spamming)
      if (debouncedSearch.trim().length > 0) {
        try {
          const res = await api.get<any>(`/ai/search-suggestions`, {
            params: { q: debouncedSearch }
          });
          const aiData = res.data?.data || (Array.isArray(res.data) ? res.data : []);
          const aiStrings = aiData.map((r: any) => typeof r === 'string' ? r : r.name || String(r));
          results = [...new Set([...results, ...aiStrings])];
        } catch (e) {
          // ignore API errors
        }
      }

      return results.slice(0, 8);
    },
    // Fast updates
    staleTime: 0,
  });

  const { data: searchResults = [] } = useQuery({
    queryKey: ['properties-search', searchQuery, effectiveFilter, priceFilter],
    queryFn: async () => {
      const isFilterActive = searchQuery || effectiveFilter !== 'All' || priceFilter;
      if (!isFilterActive) return properties;

      const endpoint = searchQuery ? '/properties/search' : '/properties';
      const res = await api.get<{
        success: true;
        message: string;
        data: Property[] | { data?: Property[] };
      }>(endpoint, {
        params: { 
          q: searchQuery || undefined,
          search: searchQuery || undefined,
          category: effectiveFilter !== 'All' ? effectiveFilter : undefined,
          minPrice: priceFilter?.min,
          maxPrice: priceFilter?.max,
          limit: 100
        },
      });
      return normalizeList<Property>(res.data.data);
    },
    enabled: !!properties,
  });

  const filterCategories = ['All', ...categories.map((c) => c.name)];

  // We keep the local filter for a snappy "instant" UI feel, while the API refetches in the background
  const dataToFilter = searchResults.length > 0 ? searchResults : properties;
  let filteredProperties = dataToFilter.filter((p) => {
    // Category match - Case insensitive and fallback to name string
    const pCatName = (typeof p.category === 'string' ? p.category : p.category?.name) || '';
    const matchesCategory =
      effectiveFilter === 'All' ||
      pCatName.toLowerCase() === effectiveFilter.toLowerCase();

    // Search match (local safety layer)
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());

    // Price match
    let matchesPrice = true;
    if (priceFilter) {
      if (
        p.pricePerShare < priceFilter.min ||
        p.pricePerShare > priceFilter.max
      )
        matchesPrice = false;
    }

    return matchesCategory && matchesSearch && matchesPrice;
  });

  // Sort logic (if not handled fully by backend or as an extra layer)
  filteredProperties = [...filteredProperties].sort((a, b) => {
    if (sortOption === 'price-asc') return a.pricePerShare - b.pricePerShare;
    if (sortOption === 'price-desc') return b.pricePerShare - a.pricePerShare;
    if (sortOption === 'yield-desc')
      return (b.expectedReturn || 0) - (a.expectedReturn || 0);
    return 0;
  });

  const paginatedProperties = filteredProperties.slice(0, page * itemsPerPage);
  const hasMore = paginatedProperties.length < filteredProperties.length;

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.page-header',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
        }
      );

      gsap.fromTo(
        '.filter-bar',
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
          delay: 0.1,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Reset page on filter change
    setPage(1);

    // Only animate if cards exist in the DOM
    const cards = document.querySelectorAll('.prop-card');
    if (cards.length > 0) {
      gsap.fromTo(
        '.prop-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.04,
          ease: 'power2.out',
        }
      );
    }
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
            <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading mt-3 md:mt-4'>
              All <span className='gradient-text'>Properties</span>
            </h1>
            <p className='text-sm md:text-base text-muted-foreground max-w-2xl mt-3 md:mt-4'>
              Browse our complete collection of verified, high-yield investment
              properties. Filter by category, search by name or location.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className='filter-bar space-y-6 mb-12 relative z-40'>
          {/* Search & Controls */}
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1 relative group z-30'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60' />
              <Input
                placeholder='Search properties...'
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='bg-muted border-border rounded-2xl h-14 pl-12 pr-12 text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-blue-500/30'
              />
              <Zap className='absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500/60 animate-pulse' />

              {/* AI Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className='absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl overflow-hidden shadow-2xl z-50'>
                  {/* Suggestions List */}
                  {searchSuggestions.map((sug: string, i: number) => (
                    <div
                      key={i}
                      className='px-5 py-3 hover:bg-accent cursor-pointer text-sm text-foreground transition-colors flex items-center gap-3'
                      onClick={() => handleSuggestionClick(sug)}
                    >
                      <Search className='w-3.5 h-3.5 text-muted-foreground/50' /> {renderText(sug)}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className='flex gap-2.5 flex-wrap items-center'>
              {/* Secondary Filter: Price */}
              <div className='relative group'>
                <Button variant='outline' className='h-14 border-border text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl px-5 bg-background'>
                  <Filter className='w-4 h-4 mr-2' />
                  {priceFilter ? `Price: $${priceFilter.min}-$${priceFilter.max}` : 'Price Filter'}
                </Button>
                <div className='absolute top-full mt-2 w-52 bg-card border border-border rounded-xl shadow-2xl hidden group-hover:block z-30 overflow-hidden'>
                  <div className='p-1.5 flex flex-col space-y-1'>
                    <button onClick={() => setPriceFilter(null)} className='text-xs font-bold uppercase tracking-widest text-left px-4 py-3 hover:bg-accent rounded-lg transition-colors'>Any Price</button>
                    <button onClick={() => setPriceFilter({ min: 0, max: 100 })} className='text-xs font-bold uppercase tracking-widest text-left px-4 py-3 hover:bg-accent rounded-lg transition-colors'>Under $100</button>
                    <button onClick={() => setPriceFilter({ min: 100, max: 500 })} className='text-xs font-bold uppercase tracking-widest text-left px-4 py-3 hover:bg-accent rounded-lg transition-colors'>$100 - $500</button>
                    <button onClick={() => setPriceFilter({ min: 500, max: 999999 })} className='text-xs font-bold uppercase tracking-widest text-left px-4 py-3 hover:bg-accent rounded-lg transition-colors'>Over $500</button>
                  </div>
                </div>
              </div>

              {/* View Mode */}
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setViewMode('grid')}
                className={`rounded-xl h-14 w-14 transition-all duration-300 border ${viewMode === 'grid'
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                  : 'bg-muted border-border text-muted-foreground hover:bg-accent hover:text-foreground hover:border-border/80'
                  }`}
              >
                <Grid3X3 className='w-5 h-5' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setViewMode('list')}
                className={`rounded-xl h-14 w-14 transition-all duration-300 border ${viewMode === 'list'
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                  : 'bg-muted border-border text-muted-foreground hover:bg-accent hover:text-foreground hover:border-border/80'
                  }`}
              >
                <LayoutList className='w-5 h-5' />
              </Button>
            </div>
          </div>

          {/* Category Filters */}
          <div className='flex flex-wrap gap-2.5'>
            {filterCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveFilter(cat);
                  setIsFilterManuallySet(true);
                }}
                className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${effectiveFilter === cat
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                  : 'bg-muted/50 border-border text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results count & Sort */}
          <div className='flex items-center justify-between py-2 border-b border-border/50'>
            <p className='text-[10px] text-muted-foreground font-bold uppercase tracking-widest'>
              Active Results:{' '}
              <span className='text-foreground font-black'>
                {filteredProperties.length}
              </span>
            </p>
            <div className='relative group z-10'>
              <button className='flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors py-2 bg-muted/50 border border-border rounded-xl px-4 h-9'>
                <SlidersHorizontal className='w-3.5 h-3.5' />
                Sort by: {sortOption.replace('-', ' ')}
                <ChevronDown className='w-3 h-3' />
              </button>
              <div className='absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-xl shadow-2xl hidden group-hover:block overflow-hidden z-50'>
                <div className='p-1.5 flex flex-col space-y-1'>
                  <button onClick={() => setSortOption('popularity')} className='text-xs font-bold uppercase tracking-widest text-left px-4 py-3 hover:bg-accent text-foreground rounded-lg transition-colors'>Popularity</button>
                  <button onClick={() => setSortOption('price-asc')} className='text-xs font-bold uppercase tracking-widest text-left px-4 py-3 hover:bg-accent text-foreground rounded-lg transition-colors'>Price: Low to High</button>
                  <button onClick={() => setSortOption('price-desc')} className='text-xs font-bold uppercase tracking-widest text-left px-4 py-3 hover:bg-accent text-foreground rounded-lg transition-colors'>Price: High to Low</button>
                  <button onClick={() => setSortOption('yield-desc')} className='text-xs font-bold uppercase tracking-widest text-left px-4 py-3 hover:bg-accent text-foreground rounded-lg transition-colors'>Highest Yield</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div
          className={`${viewMode === 'grid'
            ? 'grid md:grid-cols-2 lg:grid-cols-4 gap-8'
            : 'flex flex-col gap-6'
            }`}
        >
          {isLoading &&
            (viewMode === 'grid'
              ? Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={`properties-grid-skeleton-${idx}`}
                  className='rounded-3xl border border-border bg-card overflow-hidden animate-pulse shadow-sm'
                >
                  <div className='aspect-16/10 bg-muted/50' />
                  <div className='p-6 space-y-4'>
                    <div className='space-y-3'>
                      <div className='h-4 w-3/4 rounded bg-muted' />
                      <div className='h-3 w-1/2 rounded bg-muted/60' />
                    </div>
                    <div className='grid grid-cols-2 gap-3'>
                      <div className='h-14 rounded-xl bg-muted/50' />
                      <div className='h-14 rounded-xl bg-muted/50' />
                    </div>
                    <div className='h-2 rounded bg-muted/50' />
                    <div className='h-12 rounded-xl bg-muted' />
                  </div>
                </div>
              ))
              : Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={`properties-list-skeleton-${idx}`}
                  className='rounded-3xl border border-border bg-card p-5 animate-pulse shadow-sm'
                >
                  <div className='flex flex-col md:flex-row gap-6'>
                    <div className='h-48 md:h-32 md:w-80 rounded-2xl bg-muted/50 shrink-0' />
                    <div className='flex-1 space-y-4 py-2'>
                      <div className='h-5 w-3/4 rounded bg-muted' />
                      <div className='h-4 w-1/2 rounded bg-muted/60' />
                      <div className='h-10 w-full rounded-xl bg-muted/50' />
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
          <div className='mt-16 flex justify-center'>
            <Button
              onClick={() => setPage((p) => p + 1)}
              className='bg-muted border border-border text-foreground hover:bg-accent rounded-xl px-10 py-7 h-auto font-bold uppercase tracking-widest shadow-lg'
            >
              Explore More Assets
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProperties.length === 0 && (
          <div className='text-center py-24 space-y-6 col-span-full'>
            <div className='w-24 h-24 rounded-3xl bg-muted border-2 border-dashed border-border flex items-center justify-center mx-auto'>
              <Filter className='w-10 h-10 text-muted-foreground/50' />
            </div>
            <div className='space-y-3'>
              <h3 className='text-2xl font-bold text-foreground'>
                No matching opportunities found
              </h3>
              <p className='text-muted-foreground max-w-sm mx-auto'>
                Try adjusting your filters or expanding your search criteria.
              </p>
            </div>
            <Button
              onClick={() => {
                setActiveFilter('All');
                setSearchQuery('');
                setPriceFilter(null);
                setSortOption('popularity');
              }}
              className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 h-12 font-bold uppercase tracking-widest shadow-lg shadow-primary/20'
            >
              Reset All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
