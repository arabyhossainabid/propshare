'use client';

import { api, normalizeList } from '@/lib/api';
import { Category } from '@/lib/api-types';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Layers } from 'lucide-react';
import Link from 'next/link';

export default function CategoriesPage() {
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['categories-page'],
    queryFn: async () => {
      const res = await api.get<{
        success: true;
        message: string;
        data: Category[] | { data?: Category[] };
      }>('/categories');
      return normalizeList<Category>(res.data.data);
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className='min-h-screen bg-background pt-28 pb-20'>
      <div className='container-custom'>
        <div className='space-y-4 mb-12'>
          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20'>
            <Layers className='w-3.5 h-3.5 text-purple-500' />
            <span className='text-[10px] font-bold text-purple-500 uppercase tracking-widest'>
              Investment Sectors
            </span>
          </div>
          <h1 className='text-4xl md:text-5xl font-bold font-heading text-foreground uppercase tracking-tight'>
            Available <span className='gradient-text'>Portfolios</span>
          </h1>
          <p className='text-muted-foreground text-lg max-w-2xl'>
            Explore institutional-grade investment segments and discover targeted opportunities with ease.
          </p>
        </div>

        {isLoading && (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={`category-skeleton-${idx}`}
                className='rounded-3xl border border-border bg-card p-8 animate-pulse space-y-4 shadow-sm'
              >
                <div className='h-6 w-1/2 rounded bg-muted' />
                <div className='h-4 w-full rounded bg-muted/60' />
                <div className='h-4 w-2/3 rounded bg-muted/60' />
                <div className='h-4 w-1/3 rounded bg-muted/80 mt-6' />
              </div>
            ))}
          </div>
        )}

        {!isLoading && isError && (
          <div className='rounded-2xl border border-destructive/20 bg-destructive/10 p-8 text-sm text-destructive font-bold text-center'>
            System error: Could not synchronize category data. Please try again later.
          </div>
        )}

        {!isLoading && !isError && categories.length === 0 && (
          <div className='rounded-3xl border border-dashed border-border bg-muted/30 p-12 text-center'>
            <p className='text-muted-foreground font-medium'>No categories are currently cataloged in the system.</p>
          </div>
        )}

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {categories.map((category) => (
            <div
              key={category.id}
              className='rounded-3xl border border-border bg-card p-8 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col group'
            >
              <h2 className='text-2xl font-bold text-foreground group-hover:text-primary transition-colors'>
                {category.name}
              </h2>
              <p className='text-sm text-muted-foreground mt-4 leading-relaxed min-h-16 flex-1'>
                {category.description || 'Institutional-grade investment segment ready for capital allocation.'}
              </p>
              <Link
                href={`/properties?categoryId=${category.id}`}
                className='mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all uppercase tracking-widest'
              >
                Discover Assets
                <ArrowRight className='w-4 h-4' />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
