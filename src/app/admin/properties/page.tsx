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
  approved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  under_review: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
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
    <div className='space-y-6 pb-12'>
      <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold font-heading text-foreground'>
            Property Moderation
          </h1>
          <p className='text-sm text-muted-foreground mt-1 font-medium'>
            Institutional oversight and listing verification.
          </p>
        </div>
        <div className='flex gap-2'>
          <Badge className='bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold px-3 py-1'>
            {allProperties.filter((p) => p.status === 'UNDER_REVIEW').length}{' '}
            Pending Sync
          </Badge>
        </div>
      </div>

      {/* Search + Filter */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60' />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search assets or operators...'
            className='bg-muted/40 border-border rounded-xl pl-12 h-12 text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-blue-500/30 font-medium'
          />
        </div>
        <div className='flex gap-2 p-1 bg-muted/60 rounded-xl'>
          {['all', 'approved', 'rejected', 'under_review'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${statusFilter === s ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Property List */}
      <div className='space-y-4'>
        {isLoading &&
          Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={`admin-prop-skeleton-${idx}`}
              className='bg-card border border-border rounded-2xl p-6 animate-pulse'
            >
              <div className='flex items-center justify-between gap-4'>
                <div className='flex items-center gap-6 flex-1'>
                  <div className='w-14 h-14 rounded-xl bg-muted' />
                  <div className='space-y-3 flex-1'>
                    <div className='h-4 w-1/3 rounded bg-muted' />
                    <div className='h-3 w-1/2 rounded bg-muted/60' />
                  </div>
                </div>
                <div className='h-10 w-32 rounded-xl bg-muted' />
              </div>
            </div>
          ))}

        {!isLoading && isError && (
          <div className='text-center py-20 bg-muted/20 border border-dashed border-border rounded-3xl'>
            <p className='text-muted-foreground text-sm font-medium'>
              Network synchronization error. Please retry.
            </p>
          </div>
        )}

        {filtered.map((p) => (
          <div
            key={p.id}
            className='bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-all group'
          >
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
              <div className='flex items-center gap-6 min-w-0'>
                <div className='w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 shadow-sm'>
                  <Building2 className='w-6 h-6 text-blue-500' />
                </div>
                <div className='min-w-0'>
                  <div className='flex items-center gap-3 flex-wrap'>
                    <h3 className='text-base font-bold text-foreground truncate'>
                      {p.title}
                    </h3>
                    <Badge
                      className={`text-[10px] h-5 font-bold uppercase tracking-wider ${statusStyles[(p.status || '').toLowerCase()] || statusStyles.under_review} border`}
                    >
                      {p.status === 'UNDER_REVIEW'
                        ? 'Under Review'
                        : (p.status || 'UNKNOWN').replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className='text-xs text-muted-foreground mt-1 font-medium'>
                    Originator:{' '}
                    <span className='text-foreground font-bold'>
                      {p.author?.name || 'Institutional'}
                    </span>{' '}
                    · Cap:{' '}
                    <span className='text-blue-600 font-bold'>
                      ৳{((p.pricePerShare * p.totalShares) / 100000).toFixed(1)}
                      L
                    </span>
                  </p>
                  <div className='flex items-center gap-2 mt-2'>
                     <span className='text-[10px] text-foreground/60 font-black uppercase tracking-widest'>
                      {p.category?.name || 'Asset'}
                    </span>
                    <span className='w-1 h-1 rounded-full bg-border' />
                    <span className='text-[10px] text-foreground/40 font-bold uppercase tracking-tight'>
                      Submitted {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}
                    </span>
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-3 shrink-0 self-end md:self-center'>
                {p.status === 'UNDER_REVIEW' ? (
                  <Link href={`/admin/properties/${p.id}/review`}>
                    <Button className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-xs font-bold uppercase tracking-widest h-11 px-6 shadow-lg shadow-primary/20'>
                      Moderate
                      <ArrowRight className='w-3.5 h-3.5 ml-2' />
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/properties/${p.id}`}>
                    <Button
                      variant='outline'
                      className='border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl text-[10px] font-bold uppercase tracking-widest h-11 px-6'
                    >
                      Audit Listing
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className='text-center py-20 bg-muted/20 border border-dashed border-border rounded-3xl'>
            <p className='text-muted-foreground text-sm font-medium uppercase tracking-widest'>
              No assets matching the current parameters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
