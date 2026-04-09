'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { api, getApiErrorMessage, normalizeList } from '@/lib/api';
import { Property } from '@/lib/api-types';
import { submitPropertyForReview } from '@/lib/property-submit';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BarChart3,
  Building2,
  Edit,
  Eye,
  PlusCircle,
  Search,
  Send,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

const statusStyles: Record<string, string> = {
  approved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  under_review: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  draft: 'bg-muted text-muted-foreground/60 border-border',
  rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
};

export default function MyPropertiesPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const { isAuthenticated, isLoading: isAuthLoading, accessToken } = useAuth();

  // Fetch properties based on filter with live API
  const {
    data: allProperties = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['my-properties', filter],
    enabled: isAuthenticated && !isAuthLoading,
    queryFn: async () => {
      const res = await api.get<{
        success: true;
        message: string;
        data: Property[] | { data?: Property[] };
      }>('/properties/my-properties', {
        params: filter === 'all' ? {} : { status: filter.toUpperCase() },
      });
      return normalizeList<Property>(res.data.data);
    },
    refetchOnMount: 'always',
  });

  const filtered = allProperties.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.category?.name || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filter === 'all' || (p.status || '').toLowerCase() === filter;
    return matchSearch && matchStatus;
  });

  const submitMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      await submitPropertyForReview(propertyId);
    },
    onSuccess: async () => {
      toast.success('Submitted for review');
      await queryClient.invalidateQueries({ queryKey: ['my-properties'] });
      await queryClient.invalidateQueries({
        queryKey: ['my-properties-stats'],
      });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      await api.delete(`/properties/${propertyId}`);
    },
    onSuccess: async () => {
      toast.success('Property deleted');
      await queryClient.invalidateQueries({ queryKey: ['my-properties'] });
      await queryClient.invalidateQueries({
        queryKey: ['my-properties-stats'],
      });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold font-heading text-foreground'>My Properties</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Manage your listed properties and track their performance.
          </p>
        </div>
        <Link href='/dashboard/properties/create'>
          <Button className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-sm font-bold h-11 px-6 shadow-lg shadow-primary/20'>
            <PlusCircle className='w-4 h-4 mr-2' /> Create New
          </Button>
        </Link>
      </div>

      {/* Search + Filter */}
      <div className='flex flex-col sm:flex-row gap-3'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60' />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search properties...'
            className='bg-muted/50 border-border rounded-xl pl-10 h-12 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-blue-500/30 font-medium'
          />
        </div>
        <div className='flex gap-2 overflow-x-auto no-scrollbar pb-1'>
          {['all', 'approved', 'rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border whitespace-nowrap ${filter === s ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:text-foreground'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Property List */}
      <div className='space-y-3'>
        {isLoading &&
          Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={`skeleton-${idx}`}
              className='bg-card border border-border rounded-2xl p-5 animate-pulse'
            >
              <div className='flex items-center justify-between gap-4'>
                <div className='flex items-center gap-4 flex-1'>
                  <div className='w-12 h-12 rounded-xl bg-muted' />
                  <div className='space-y-2 flex-1'>
                    <div className='h-4 w-1/3 rounded bg-muted' />
                    <div className='h-3 w-1/2 rounded bg-muted/60' />
                  </div>
                </div>
                <div className='h-9 w-28 rounded-xl bg-muted' />
              </div>
            </div>
          ))}

        {!isLoading && isError && (
          <div className='text-center py-20 bg-muted/30 border border-dashed border-border rounded-3xl'>
            <p className='text-muted-foreground text-sm font-medium'>
              Could not load properties. Please try again.
            </p>
          </div>
        )}

        {filtered.map((p) => (
          <div
            key={p.id}
            className='bg-card border border-border rounded-2xl p-5 hover:border-blue-500/30 hover:shadow-xl transition-all group'
          >
            <div className='flex items-center justify-between gap-4'>
              <div className='flex items-center gap-4 min-w-0'>
                <div className='w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform'>
                  <Building2 className='w-5 h-5 text-blue-500' />
                </div>
                <div className='min-w-0'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <h3 className='text-sm font-bold text-foreground group-hover:text-blue-500 transition-colors'>
                      {p.title}
                    </h3>
                    <Badge
                      className={`text-[9px] uppercase tracking-widest h-5 px-2 border ${statusStyles[(p.status || '').toLowerCase()] || statusStyles.draft}`}
                    >
                      {p.status === 'UNDER_REVIEW'
                        ? 'Review'
                        : (p.status || 'DRAFT').replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className='flex items-center gap-4 mt-1.5 text-[10px] uppercase tracking-widest font-bold text-muted-foreground'>
                    <span>{p.category?.name || 'Category'}</span>
                    <span>
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString()
                        : '-'}
                    </span>
                    <span className='flex items-center gap-1'>
                      <Eye className='w-3 h-3' />
                      {p.viewCount || 0}
                    </span>
                    <span className='flex items-center gap-1'>
                      <BarChart3 className='w-3 h-3 text-emerald-500' />
                      {(p as any)._count?.votes ?? 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-2 shrink-0'>
                {p.status === 'DRAFT' && (
                  <Button
                    onClick={() => submitMutation.mutate(p.id)}
                    variant='outline'
                    className='border-blue-500/30 text-blue-500 hover:bg-blue-500/10 rounded-xl text-[10px] font-bold uppercase tracking-widest h-9 px-4 transition-all'
                  >
                    <Send className='w-3 h-3 mr-2' /> Submit
                  </Button>
                )}
                <Link href={`/dashboard/properties/${p.id}/edit`}>
                  <Button
                    variant='ghost'
                    className='text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-xl h-10 w-10 p-0 transition-all'
                  >
                    <Edit className='w-4 p-0.5' />
                  </Button>
                </Link>
                <Button
                  onClick={() => deleteMutation.mutate(p.id)}
                  variant='ghost'
                  className='text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl h-10 w-10 p-0 transition-all'
                >
                  <Trash2 className='w-4 p-0.5' />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className='text-center py-20 bg-muted/30 border border-dashed border-border rounded-3xl'>
            <p className='text-muted-foreground text-sm font-medium'>
              No properties found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
