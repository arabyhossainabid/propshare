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
    <div className='space-y-10 pb-12'>
      <div className='flex flex-col sm:flex-row items-center justify-between gap-6'>
        <div>
          <h1 className='text-3xl font-bold font-heading text-foreground'>Curation Matrix</h1>
          <p className='text-sm text-muted-foreground mt-1 font-medium'>
            Select high-performance assets for priority placement.
          </p>
        </div>
        <Badge className='bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[11px] font-bold px-4 py-1.5 shadow-sm'>
          {featured.length} ACTIVE SHOWCASE
        </Badge>
      </div>

      {isLoading && (
        <div className="grid lg:grid-cols-2 gap-8 animate-pulse">
           <div className="h-48 bg-muted rounded-3xl" />
           <div className="h-48 bg-muted rounded-3xl" />
        </div>
      )}

      <div className='grid lg:grid-cols-2 gap-10'>
        {/* Featured Section */}
        <div className='space-y-6'>
          <h3 className='text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-3'>
            <Star className='w-4 h-4 text-amber-500 fill-amber-500' />
            Current Showcase
          </h3>
          <div className='space-y-4'>
            {featured.map((p) => (
              <div
                key={p.id}
                className='bg-card border border-amber-500/10 hover:border-amber-500/20 rounded-2xl p-6 flex items-center gap-6 shadow-sm group transition-all duration-300'
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/5 flex items-center justify-center border border-amber-500/10 shadow-inner">
                   <Star className="w-6 h-6 text-amber-500" />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-base font-bold text-foreground truncate'>{p.title}</p>
                  <p className='text-[10px] text-muted-foreground mt-1.5 font-bold uppercase tracking-widest'>
                    {p.category?.name || 'INSTITUTIONAL ASSET'}
                  </p>
                </div>
                <Button
                  variant='ghost'
                  className='h-12 w-12 p-0 text-muted-foreground/20 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all'
                  onClick={() => toggleFeaturedMutation.mutate(p.id)}
                  disabled={toggleFeaturedMutation.isPending}
                >
                  <Trash2 className='w-5 h-5' />
                </Button>
              </div>
            ))}
            {featured.length === 0 && !isLoading && (
              <div className='bg-muted/10 border border-dashed border-border rounded-3xl p-12 text-center'>
                <p className='text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-40'>No assets currently featured</p>
              </div>
            )}
          </div>
        </div>

        {/* Available Section */}
        <div className='space-y-6'>
          <h3 className='text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60'>
            Inventory Source
          </h3>
          <div className='space-y-4 max-h-[600px] overflow-auto pr-2 no-scrollbar'>
            {available.map((p) => (
              <div
                key={p.id}
                className='bg-card border border-border rounded-2xl p-6 flex items-center gap-6 hover:shadow-md transition-all group'
              >
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center border border-border shadow-inner">
                   <PlusCircle className="w-6 h-6 text-muted-foreground/40" />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-base font-bold text-foreground truncate'>{p.title}</p>
                  <p className='text-[10px] text-muted-foreground mt-1.5 font-bold uppercase tracking-widest'>
                    {p.category?.name || 'UNCLASSIFIED ASSET'}
                  </p>
                </div>
                <Button
                  onClick={() => toggleFeaturedMutation.mutate(p.id)}
                  disabled={toggleFeaturedMutation.isPending}
                  className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-[10px] h-10 px-5 font-bold uppercase tracking-widest shadow-xl shadow-primary/10'
                >
                  Promote
                </Button>
              </div>
            ))}
            {available.length === 0 && !isLoading && (
               <div className='bg-muted/10 border border-dashed border-border rounded-3xl p-12 text-center'>
                 <p className='text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-40'>All assets are featured</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
