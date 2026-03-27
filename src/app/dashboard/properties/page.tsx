'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  under_review: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  draft: 'bg-white/5 text-white/40 border-white/10',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function MyPropertiesPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Fetch properties based on filter with live API
  const {
    data: allProperties = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['my-properties', filter],
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
          <h1 className='text-2xl font-bold font-heading'>My Properties</h1>
          <p className='text-sm text-white/40 mt-1'>
            Manage your listed properties and track their performance.
          </p>
        </div>
        <Link href='/dashboard/properties/create'>
          <Button className='bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm'>
            <PlusCircle className='w-4 h-4 mr-2' /> Create New
          </Button>
        </Link>
      </div>

      {/* Search + Filter */}
      <div className='flex flex-col sm:flex-row gap-3'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20' />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search properties...'
            className='bg-white/5 border-white/10 rounded-xl pl-10 py-5 text-white placeholder:text-white/20 focus-visible:ring-blue-500/30'
          />
        </div>
        <div className='flex gap-2'>
          {['all', 'approved', 'rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${filter === s ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10 border border-white/5'}`}
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
              key={`skeleton-${idx}`}
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
            <div className='flex items-center justify-between gap-4'>
              <div className='flex items-center gap-4 min-w-0'>
                <div className='w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0'>
                  <Building2 className='w-5 h-5 text-blue-400' />
                </div>
                <div className='min-w-0'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <h3 className='text-sm font-semibold text-white'>
                      {p.title}
                    </h3>
                    <Badge
                      className={`text-[10px] ${statusStyles[(p.status || '').toLowerCase()] || statusStyles.draft}`}
                    >
                      {p.status === 'UNDER_REVIEW'
                        ? 'Under Review'
                        : (p.status || 'DRAFT').replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className='flex items-center gap-4 mt-1 text-xs text-white/30'>
                    <span>{p.category?.name || 'Category'}</span>
                    <span>
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString()
                        : '-'}
                    </span>
                    <span className='flex items-center gap-1'>
                      <Eye className='w-3 h-3' />
                      {0}
                    </span>
                    <span className='flex items-center gap-1'>
                      <BarChart3 className='w-3 h-3' />
                      {p.votes?.total ?? 0} votes
                    </span>
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-2 shrink-0'>
                {p.status === 'DRAFT' && (
                  <Button
                    onClick={() => submitMutation.mutate(p.id)}
                    variant='outline'
                    className='border-blue-500/20 text-blue-400 hover:bg-blue-500/10 rounded-xl text-xs h-9 px-3'
                  >
                    <Send className='w-3 h-3 mr-1' /> Submit
                  </Button>
                )}
                <Link href={`/dashboard/properties/${p.id}/edit`}>
                  <Button
                    variant='ghost'
                    className='text-white/40 hover:text-white hover:bg-white/5 rounded-xl h-9 w-9 p-0'
                  >
                    <Edit className='w-4 h-4' />
                  </Button>
                </Link>
                <Button
                  onClick={() => deleteMutation.mutate(p.id)}
                  variant='ghost'
                  className='text-white/40 hover:text-red-400 hover:bg-red-500/5 rounded-xl h-9 w-9 p-0'
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
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
