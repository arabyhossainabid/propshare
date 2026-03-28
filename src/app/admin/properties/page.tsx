'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api, normalizeList } from '@/lib/api';
import { Property } from '@/lib/api-types';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Building2, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const statusStyles: Record<string, string> = {
  approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  under_review: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function AdminPropertiesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const {
    data: allProperties = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin-properties', statusFilter],
    queryFn: async () => {
      const res = await api.get<{
        success: true;
        message: string;
        data: Property[] | { data?: Property[] };
      }>('/admin/properties', {
        params:
          statusFilter === 'all' ? {} : { status: statusFilter.toUpperCase() },
      });
      return normalizeList<Property>(res.data.data);
    },
    refetchOnMount: 'always',
  });

  const filtered = allProperties.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.author?.name || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === 'all' || (p.status || '').toLowerCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold font-heading'>
            Property Moderation
          </h1>
          <p className='text-sm text-white/40 mt-1'>
            Review, approve, or reject property listings.
          </p>
        </div>
        <div className='flex gap-2'>
          <Badge className='bg-amber-500/10 text-amber-400 border-amber-500/20'>
            {allProperties.filter((p) => p.status === 'UNDER_REVIEW').length}{' '}
            Pending
          </Badge>
        </div>
      </div>

      {/* Search + Filter */}
      <div className='flex flex-col sm:flex-row gap-3'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20' />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search properties or owners...'
            className='bg-white/5 border-white/10 rounded-xl pl-10 py-5 text-white placeholder:text-white/20 focus-visible:ring-blue-500/30'
          />
        </div>
        <div className='flex gap-2'>
          {['all', 'approved', 'rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${statusFilter === s ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10 border border-white/5'}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Property List */}
      <div className='space-y-3'>
        {isLoading &&
          Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={`admin-prop-skeleton-${idx}`}
              className='bg-white/[0.02] border border-white/5 rounded-2xl p-5 animate-pulse'
            >
              <div className='flex items-center justify-between gap-4'>
                <div className='flex items-center gap-4 flex-1'>
                  <div className='w-12 h-12 rounded-xl bg-white/[0.06]' />
                  <div className='space-y-2 flex-1'>
                    <div className='h-4 w-1/3 rounded bg-white/[0.07]' />
                    <div className='h-3 w-1/2 rounded bg-white/[0.05]' />
                    <div className='h-3 w-1/4 rounded bg-white/[0.05]' />
                  </div>
                </div>
                <div className='h-9 w-28 rounded-xl bg-white/[0.08]' />
              </div>
            </div>
          ))}

        {!isLoading && isError && (
          <div className='text-center py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl'>
            <p className='text-white/30 text-sm'>
              Could not load properties. Please try again.
            </p>
          </div>
        )}

        {filtered.map((p) => (
          <div
            key={p.id}
            className='bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.04] transition-all'
          >
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
              <div className='flex items-center gap-4 min-w-0'>
                <div className='w-12 h-12 rounded-xl bg-blue-500/10 border border-white/10 flex items-center justify-center shrink-0'>
                  <Building2 className='w-5 h-5 text-white' />
                </div>
                <div className='min-w-0'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <h3 className='text-sm font-semibold text-white'>
                      {p.title}
                    </h3>
                    <Badge
                      className={`text-[10px] ${statusStyles[(p.status || '').toLowerCase()] || statusStyles.under_review}`}
                    >
                      {p.status === 'UNDER_REVIEW'
                        ? 'Under Review'
                        : (p.status || 'UNKNOWN').replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className='text-xs text-white/30 mt-1'>
                    Owner:{' '}
                    <span className='text-white/60'>
                      {p.author?.name || 'Unknown'}
                    </span>{' '}
                    · Target:{' '}
                    <span className='text-white/60'>
                      ৳{((p.pricePerShare * p.totalShares) / 100000).toFixed(1)}
                      L
                    </span>
                  </p>
                  <p className='text-[10px] text-white/20 mt-1 uppercase tracking-wider'>
                    {p.category?.name || 'Category'} · Submitted{' '}
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString()
                      : '-'}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-2 shrink-0 self-end md:self-center'>
                {p.status === 'UNDER_REVIEW' ? (
                  <Link href={`/admin/properties/${p.id}/review`}>
                    <Button className='bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs h-9 px-4'>
                      Review Now
                      <ArrowRight className='w-3.5 h-3.5 ml-2' />
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/properties/${p.id}`}>
                    <Button
                      variant='outline'
                      className='border-white/10 text-white/60 hover:text-white hover:bg-white/5 rounded-xl text-xs h-9 px-4'
                    >
                      View Listing
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className='text-center py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl'>
            <p className='text-white/20 text-sm'>
              No properties found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
