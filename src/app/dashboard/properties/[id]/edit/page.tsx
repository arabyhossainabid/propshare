'use client';

import { ImageUploader } from '@/components/ImageUploader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import {
  api,
  getApiErrorMessage,
  normalizeItem,
  normalizeList,
} from '@/lib/api';
import { Category, Property } from '@/lib/api-types';
import { submitPropertyForReview } from '@/lib/property-submit';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  DollarSign,
  FileText,
  ImagePlus,
  Layers,
  MapPin,
  Save,
  Send,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isLoading: isAuthLoading, accessToken } = useAuth();
  const propertyId = String(params.id);
  const [form, setForm] = useState({
    title: 'Rooftop Café Space',
    description:
      'A trendy rooftop café space in the heart of Gulshan with panoramic city views. Perfect for food & beverage investment with high foot traffic.',
    location: 'Gulshan Circle-1, Dhaka',
    categoryId: '',
    pricePerShare: '35000',
    totalShares: '150',
    expectedReturn: '18',
    duration: '24',
    minInvestment: '35000',
    features: 'Rooftop View, Fully Furnished, High Foot Traffic, AC System',
    imageUrl: '',
  });

  const updateForm = (key: string, value: string) =>
    setForm({ ...form, [key]: value });

  const { isLoading: isLoadingProperty, isError: isErrorProperty } = useQuery({
    queryKey: ['edit-property', propertyId],
    enabled: isAuthenticated && !isAuthLoading && !!accessToken,
    queryFn: async () => {
      const res = await api.get<{
        success: true;
        message: string;
        data: Property | { data?: Property };
      }>(`/properties/${propertyId}`);
      const p = normalizeItem<Property>(res.data.data);
      if (!p) {
        throw new Error('Invalid property payload');
      }
      setForm({
        title: p.title || '',
        description: p.description || '',
        location: p.location || '',
        categoryId: p.categoryId || '',
        pricePerShare: String(p.pricePerShare || ''),
        totalShares: String(p.totalShares || ''),
        expectedReturn: String(p.expectedReturn || ''),
        duration: '24',
        minInvestment: String(p.pricePerShare || ''),
        features: '',
        imageUrl: p.imageUrl || '',
      });
      return p;
    },
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['edit-property-categories'],
    enabled: isAuthenticated && !isAuthLoading && !!accessToken,
    queryFn: async () => {
      const res = await api.get<{
        success: true;
        message: string;
        data: Category[] | { data?: Category[] };
      }>('/categories');
      return normalizeList<Category>(res.data.data);
    },
  });

  const isPageLoading = isLoadingProperty || isLoadingCategories;

  const updateMutation = useMutation({
    mutationFn: async () => {
      const patchPayload: Record<string, unknown> = {
        title: form.title,
        description: form.description,
        location: form.location,
        pricePerShare: Number(form.pricePerShare),
        totalShares: Number(form.totalShares),
        expectedReturn: form.expectedReturn
          ? Number(form.expectedReturn)
          : undefined,
        images: form.imageUrl ? [form.imageUrl] : undefined,
      };

      // Only include categoryId if it has a value
      if (form.categoryId) {
        patchPayload.categoryId = form.categoryId;
      }

      await api.patch(`/properties/${propertyId}`, patchPayload);
    },
    onSuccess: () => {
      toast.success('Property updated');
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const updateAndSubmitMutation = useMutation({
    mutationFn: async () => {
      const patchPayload: Record<string, unknown> = {
        title: form.title,
        description: form.description,
        location: form.location,
        pricePerShare: Number(form.pricePerShare),
        totalShares: Number(form.totalShares),
        expectedReturn: form.expectedReturn
          ? Number(form.expectedReturn)
          : undefined,
        images: form.imageUrl ? [form.imageUrl] : undefined,
      };

      // Only include categoryId if it has a value
      if (form.categoryId) {
        patchPayload.categoryId = form.categoryId;
      }

      await api.patch(`/properties/${propertyId}`, patchPayload);
      await submitPropertyForReview(propertyId);
    },
    onSuccess: () => {
      toast.success('Updated and submitted for review');
      router.push('/dashboard/properties');
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  if (isPageLoading) {
    return (
      <div className='space-y-6 max-w-3xl'>
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={`edit-property-skeleton-${idx}`}
            className='bg-white/[0.02] border border-white/5 rounded-2xl p-6 animate-pulse'
          >
            <div className='space-y-3'>
              <div className='h-4 w-1/4 rounded bg-white/[0.07]' />
              <div className='h-10 w-full rounded bg-white/[0.05]' />
              <div className='h-10 w-full rounded bg-white/[0.05]' />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isErrorProperty) {
    return (
      <div className='max-w-3xl rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center'>
        <p className='text-sm text-white/40'>
          Could not load this property for editing. Please refresh and try
          again.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-8 max-w-3xl'>
      <div className='flex items-center justify-between'>
        <div>
          <Link
            href='/dashboard/properties'
            className='text-xs text-white/40 hover:text-white/60 flex items-center gap-1 mb-2'
          >
            <ArrowLeft className='w-3 h-3' /> Back to Properties
          </Link>
          <h1 className='text-2xl font-bold font-heading'>Edit Property</h1>
          <p className='text-sm text-white/40 mt-1'>
            Update property ID: {params.id}
          </p>
        </div>
        <Badge className='bg-emerald-500/10 text-emerald-400 border-emerald-500/20'>
          Approved
        </Badge>
      </div>

      {/* Basic Info */}
      <div className='bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-5'>
        <h3 className='text-base font-bold flex items-center gap-2'>
          <div className='w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center'>
            <FileText className='w-3.5 h-3.5 text-blue-400' />
          </div>
          Basic Information
        </h3>
        <div className='space-y-2'>
          <label className='text-xs text-white/40 uppercase tracking-wider font-medium'>
            Property Title *
          </label>
          <Input
            value={form.title}
            onChange={(e) => updateForm('title', e.target.value)}
            className='bg-white/5 border-white/10 rounded-xl py-5 text-white focus-visible:ring-blue-500/30'
          />
        </div>
        <div className='space-y-2'>
          <label className='text-xs text-white/40 uppercase tracking-wider font-medium'>
            Description *
          </label>
          <textarea
            value={form.description}
            onChange={(e) => updateForm('description', e.target.value)}
            rows={5}
            className='w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:ring-2 focus:ring-blue-500/30 outline-none resize-none'
          />
        </div>
        <div className='grid md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <label className='text-xs text-white/40 uppercase tracking-wider font-medium'>
              Location *
            </label>
            <div className='relative'>
              <MapPin className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20' />
              <Input
                value={form.location}
                onChange={(e) => updateForm('location', e.target.value)}
                className='bg-white/5 border-white/10 rounded-xl pl-10 py-5 text-white focus-visible:ring-blue-500/30'
              />
            </div>
          </div>
          <div className='space-y-2'>
            <label className='text-xs text-white/40 uppercase tracking-wider font-medium'>
              Category *
            </label>
            <select
              value={form.categoryId}
              onChange={(e) => updateForm('categoryId', e.target.value)}
              className='w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:ring-2 focus:ring-blue-500/30 outline-none appearance-none'
            >
              <option value='' className='bg-[#151c2e]'>
                Select category
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className='bg-[#151c2e]'>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Financial */}
      <div className='bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-5'>
        <h3 className='text-base font-bold flex items-center gap-2'>
          <div className='w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center'>
            <DollarSign className='w-3.5 h-3.5 text-emerald-400' />
          </div>
          Financial Details
        </h3>
        <div className='grid md:grid-cols-2 gap-4'>
          {[
            { l: 'Price Per Share (৳)', k: 'pricePerShare' },
            { l: 'Total Shares', k: 'totalShares' },
            { l: 'Expected Return (%)', k: 'expectedReturn' },
            { l: 'Duration (months)', k: 'duration' },
          ].map((f) => (
            <div key={f.k} className='space-y-2'>
              <label className='text-xs text-white/40 uppercase tracking-wider font-medium'>
                {f.l}
              </label>
              <Input
                type='number'
                value={form[f.k as keyof typeof form]}
                onChange={(e) => updateForm(f.k, e.target.value)}
                className='bg-white/5 border-white/10 rounded-xl py-5 text-white focus-visible:ring-blue-500/30'
              />
            </div>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className='bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4'>
        <h3 className='text-sm font-semibold flex items-center gap-2'>
          <div className='w-6 h-6 rounded-md bg-purple-500/15 flex items-center justify-center'>
            <ImagePlus className='w-3 h-3 text-purple-300' />
          </div>
          Property Images
        </h3>
        <p className='text-xs text-white/45'>
          Keep a clear cover photo to improve property visibility.
        </p>
        <ImageUploader
          label='Update Property Image'
          placeholder='Drag and drop or click to upload new property image'
          onImageUpload={(url) => updateForm('imageUrl', url)}
          previewHeight={220}
          previewWidth={320}
          compact
        />
        {form.imageUrl && (
          <p className='text-xs text-emerald-300'>
            ✓ Current image: {form.imageUrl.split('/').pop()}
          </p>
        )}
      </div>

      {/* Features */}
      <div className='bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-5'>
        <h3 className='text-base font-bold flex items-center gap-2'>
          <div className='w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center'>
            <Layers className='w-3.5 h-3.5 text-amber-400' />
          </div>
          Features
        </h3>
        <textarea
          value={form.features}
          onChange={(e) => updateForm('features', e.target.value)}
          rows={2}
          className='w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:ring-2 focus:ring-blue-500/30 outline-none resize-none'
        />
      </div>

      {/* Actions */}
      <div className='flex gap-3'>
        <Button
          onClick={() => updateMutation.mutate()}
          variant='outline'
          className='border-white/10 text-white hover:bg-white/5 rounded-xl px-6 py-5'
        >
          <Save className='w-4 h-4 mr-2' /> Save Changes
        </Button>
        <Button
          onClick={() => updateAndSubmitMutation.mutate()}
          className='flex-1 bg-white/10 hover:bg-white/15 text-white rounded-xl py-5 text-sm font-semibold group'
        >
          Update & Re-Submit{' '}
          <Send className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
        </Button>
      </div>
    </div>
  );
}
