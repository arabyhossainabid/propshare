'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api, getApiErrorMessage, normalizeList } from '@/lib/api';
import { Category } from '@/lib/api-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Building2,
  Factory,
  FolderTree,
  Home,
  Laptop,
  Loader2,
  Palmtree,
  Plus,
  Search,
  Store,
  Trash2,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const iconMap: Record<string, React.ElementType> = {
  Residential: Home,
  Commercial: Building2,
  Industrial: Factory,
  Retail: Store,
  'Co-working': Laptop,
  Vacation: Palmtree,
};

const colors = ['blue', 'emerald', 'purple', 'amber', 'rose', 'cyan'];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  purple: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  amber: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  rose: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  cyan: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
};

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
  });

  type CategoryWithCount = Category & {
    _count?: {
      properties?: number;
    };
  };

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return normalizeList<CategoryWithCount>(res?.data?.data);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/categories/${id}`);
    },
    onSuccess: () => {
      toast.success('Category deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof newCategory) => {
      await api.post('/admin/categories', {
        name: data.name,
        description: data.description || undefined,
      });
    },
    onSuccess: () => {
      toast.success('Category created successfully');
      setNewCategory({ name: '', description: '' });
      setIsAddingNew(false);
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    createMutation.mutate(newCategory);
  };

  return (
    <div className='space-y-8 pb-12'>
      <div className='flex flex-col sm:flex-row items-center justify-between gap-6'>
        <div>
          <h1 className='text-3xl font-bold font-heading text-foreground'>
            Asset Taxonomy
          </h1>
          <p className='text-sm text-muted-foreground mt-1 font-medium'>
            Organize and manage the global property hierarchy.
          </p>
        </div>
        <Button
          onClick={() => setIsAddingNew(!isAddingNew)}
          className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 h-12 font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20'
        >
          {isAddingNew ? <X className="w-4 h-4 mr-2" /> : <Plus className='w-4 h-4 mr-2' />}
          {isAddingNew ? 'Close Form' : 'Add New Category'}
        </Button>
      </div>

      {/* Add New Category Form */}
      {isAddingNew && (
        <div className='bg-card border border-border rounded-2xl p-8 space-y-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300'>
          <div className='flex items-center justify-between'>
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                 <FolderTree className="w-5 h-5 text-primary" />
               </div>
               <h2 className='text-xl font-bold text-foreground'>New Category Definition</h2>
             </div>
          </div>

          <div className='grid md:grid-cols-2 gap-6'>
            <div className="space-y-2">
              <label className='text-[10px] text-muted-foreground uppercase tracking-widest font-bold'>
                Category Identity *
              </label>
              <Input
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                placeholder='e.g., Ultra-Luxury Residential'
                className='bg-muted/40 border-border rounded-xl h-12 text-foreground focus-visible:ring-blue-500/30'
              />
            </div>

            <div className="space-y-2">
              <label className='text-[10px] text-muted-foreground uppercase tracking-widest font-bold'>
                Functional Scope (Optional)
              </label>
              <Input
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
                placeholder='Brief description of this asset class'
                className='bg-muted/40 border-border rounded-xl h-12 text-foreground focus-visible:ring-blue-500/30'
              />
            </div>
          </div>

          <div className='flex gap-3'>
            <Button
              onClick={handleAddCategory}
              disabled={createMutation.isPending}
              className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-12 px-8 font-bold uppercase tracking-widest text-[11px]'
            >
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              Publish Category
            </Button>
            <Button
              onClick={() => setIsAddingNew(false)}
              variant='outline'
              className='border-border text-muted-foreground hover:bg-muted rounded-xl h-12 px-6 font-bold uppercase tracking-widest text-[11px]'
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className='relative group'>
        <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60' />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Locate categories within the registry...'
          className='bg-card border-border rounded-xl h-14 pl-12 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-blue-500/30 shadow-sm'
        />
      </div>

      {/* Category Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl h-56 animate-pulse" />
          ))
        ) : (
          filtered.map((c, i) => {
            const Icon = iconMap[c.name] || Building2;
            const color = colors[i % colors.length];
            return (
              <div
                key={c.id}
                className='bg-card border border-border rounded-2xl p-8 hover:shadow-xl hover:border-border/60 transition-all duration-300 group'
              >
                <div className='flex items-center justify-between mb-8'>
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${colorMap[color]}`}
                  >
                    <Icon className='w-7 h-7' />
                  </div>
                  <Button
                    onClick={() => {
                      if (confirm('Permanently decommission this category?')) {
                        deleteMutation.mutate(c.id);
                      }
                    }}
                    variant='ghost'
                    className='h-10 w-10 p-0 text-muted-foreground/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all'
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>
                </div>
                <div>
                  <h3 className='text-xl font-bold font-heading text-foreground'>
                    {c.name}
                  </h3>
                  <p className='text-sm text-muted-foreground mt-2 line-clamp-2 font-medium'>
                    {c.description || 'Institutional asset class definition.'}
                  </p>
                </div>
                <div className='flex items-center justify-between mt-8 pt-8 border-t border-border/60'>
                  <span className='text-[10px] text-muted-foreground font-bold uppercase tracking-widest'>
                    Portfolio Assets
                  </span>
                  <Badge variant="outline" className='bg-muted text-foreground border-border text-[10px] font-bold px-3 py-0.5'>
                    {c._count?.properties ?? 0}
                  </Badge>
                </div>
              </div>
            );
          })
        )}
      </div>

      {!isLoading && filtered.length === 0 && (
        <div className='text-center py-24 bg-muted/20 border border-dashed border-border rounded-3xl'>
          <p className='text-muted-foreground text-sm font-bold uppercase tracking-widest'>
            No asset categories match your search parameters.
          </p>
        </div>
      )}
    </div>
  );
}
