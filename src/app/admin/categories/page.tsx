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
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
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
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold font-heading'>
            Category Management
          </h1>
          <p className='text-sm text-white/40 mt-1'>
            Organize and manage property categories.
          </p>
        </div>
        <Button
          onClick={() => setIsAddingNew(!isAddingNew)}
          className='bg-white/10 hover:bg-white/15 text-white rounded-xl text-sm'
        >
          <Plus className='w-4 h-4 mr-2' /> Add Category
        </Button>
      </div>

      {/* Add New Category Form */}
      {isAddingNew && (
        <div className='bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>New Category</h2>
            <button
              onClick={() => setIsAddingNew(false)}
              className='text-white/40 hover:text-white'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          <div className='space-y-4'>
            <div>
              <label className='block text-xs font-semibold text-white/60 mb-2'>
                Category Name *
              </label>
              <Input
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                placeholder='e.g., Residential, Commercial, Industrial...'
                className='bg-white/5 border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20'
              />
            </div>

            <div>
              <label className='block text-xs font-semibold text-white/60 mb-2'>
                Description (Optional)
              </label>
              <Input
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
                placeholder='Brief description of this category'
                className='bg-white/5 border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20'
              />
            </div>
          </div>

          <div className='flex gap-3 pt-2'>
            <Button
              onClick={handleAddCategory}
              disabled={createMutation.isPending}
              className='bg-white/10 hover:bg-white/15 text-white rounded-xl'
            >
              {createMutation.isPending ? 'Creating...' : 'Create Category'}
            </Button>
            <Button
              onClick={() => setIsAddingNew(false)}
              variant='outline'
              className='border-white/10 text-white/40 hover:text-white rounded-xl'
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20' />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search categories...'
          className='bg-white/5 border-white/10 rounded-xl pl-10 py-5 text-white placeholder:text-white/20 focus-visible:ring-blue-500/30'
        />
      </div>

      {/* Category Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {isLoading ? (
          <div className='col-span-full py-12 text-center'>
            <Loader2 className='w-6 h-6 animate-spin mx-auto text-blue-500' />
          </div>
        ) : (
          filtered.map((c, i) => {
            const Icon = iconMap[c.name] || Building2;
            const color = colors[i % colors.length];
            return (
              <div
                key={c.id}
                className='bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] transition-all group'
              >
                <div className='flex items-center justify-between mb-6'>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[color]}`}
                  >
                    <Icon className='w-6 h-6' />
                  </div>
                  <div className='flex items-center gap-1'>
                    <Button
                      onClick={() => {
                        if (confirm('Delete this category?')) {
                          deleteMutation.mutate(c.id);
                        }
                      }}
                      variant='ghost'
                      className='h-8 w-8 p-0 text-white/20 hover:text-red-400 rounded-lg'
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className='text-lg font-bold font-heading text-white'>
                    {c.name}
                  </h3>
                  <p className='text-xs text-white/30 font-mono mt-1'>
                    {c.description || 'No description provided.'}
                  </p>
                </div>
                <div className='flex items-center justify-between mt-6 pt-6 border-t border-white/5'>
                  <span className='text-xs text-white/30'>
                    Total Properties
                  </span>
                  <Badge className='bg-white/5 text-white/60 border border-white/10 text-[10px]'>
                    {c._count?.properties ?? 0}
                  </Badge>
                </div>
              </div>
            );
          })
        )}
      </div>

      {!isLoading && filtered.length === 0 && (
        <div className='text-center py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl'>
          <p className='text-white/20 text-sm'>
            No categories found matching your search.
          </p>
        </div>
      )}
    </div>
  );
}
