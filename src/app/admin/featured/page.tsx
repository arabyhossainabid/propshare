'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api, getApiErrorMessage, normalizeList } from '@/lib/api';
import { Property } from '@/lib/api-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PlusCircle, Star, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminFeaturedPage() {
  const queryClient = useQueryClient();

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['admin-featured-properties'],
    queryFn: async () => {
      const res = await api.get<{
        success: true;
        message: string;
        data: Property[] | { data?: Property[] };
      }>('/admin/properties', { params: { limit: 200 } });
      return normalizeList<Property>(res.data.data);
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      await api.patch(`/properties/${propertyId}/toggle-featured`);
    },
    onSuccess: async () => {
      toast.success('Featured status updated');
      await queryClient.invalidateQueries({
        queryKey: ['admin-featured-properties'],
      });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const featured = properties.filter((p) => p.isFeatured);
  const available = properties.filter((p) => !p.isFeatured);

  return (
    <div className='space-y-8'>
      <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold font-heading'>Featured Properties</h1>
          <p className='text-sm text-white/40 mt-1'>
            API-backed featured properties management.
          </p>
        </div>
        <Badge className='bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] py-1'>
          {featured.length} Featured
        </Badge>
      </div>

      {isLoading && <p className='text-sm text-white/40'>Loading...</p>}

      <div className='grid lg:grid-cols-2 gap-8'>
        <div className='space-y-4'>
          <h3 className='text-sm font-bold uppercase tracking-widest text-white/30 flex items-center gap-2'>
            <Star className='w-4 h-4 text-amber-400 fill-amber-400' />
            Active Featured
          </h3>
          <div className='space-y-3'>
            {featured.map((p) => (
              <div
                key={p.id}
                className='bg-white/[0.03] border border-blue-500/20 rounded-2xl p-4 flex items-center gap-4'
              >
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-bold text-white truncate'>{p.title}</p>
                  <p className='text-[10px] text-white/30 mt-0.5'>
                    {p.category?.name || 'Uncategorized'}
                  </p>
                </div>
                <Button
                  variant='ghost'
                  className='h-9 w-9 p-0 text-white/20 hover:text-red-400 rounded-xl hover:bg-red-500/5'
                  onClick={() => toggleFeaturedMutation.mutate(p.id)}
                  disabled={toggleFeaturedMutation.isPending}
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </div>
            ))}
            {featured.length === 0 && (
              <div className='bg-white/[0.01] border border-dashed border-white/5 rounded-2xl p-8 text-center'>
                <p className='text-xs text-white/20'>No properties featured.</p>
              </div>
            )}
          </div>
        </div>

        <div className='space-y-4'>
          <h3 className='text-sm font-bold uppercase tracking-widest text-white/30'>
            Available Listings
          </h3>
          <div className='space-y-3'>
            {available.map((p) => (
              <div
                key={p.id}
                className='bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center gap-4'
              >
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-bold text-white truncate'>{p.title}</p>
                  <p className='text-[10px] text-white/30 mt-1'>
                    {p.category?.name || 'Uncategorized'}
                  </p>
                </div>
                <Button
                  className='bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-[10px] h-8 px-3'
                  onClick={() => toggleFeaturedMutation.mutate(p.id)}
                  disabled={toggleFeaturedMutation.isPending}
                >
                  Add <PlusCircle className='w-3 h-3 ml-2' />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
