'use client';

import { ImageUploader } from '@/components/ImageUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api, getApiErrorMessage, normalizeList } from '@/lib/api';
import { Category } from '@/lib/api-types';
import {
  extractPropertyIdFromCreateResponse,
  submitPropertyForReview,
} from '@/lib/property-submit';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  DollarSign,
  FileText,
  ImagePlus,
  Layers,
  MapPin,
  Save,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function CreatePropertyPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    location: '',
    pricePerShare: '',
    totalShares: '',
    expectedReturn: '',
    problemStatement: '',
    proposedSolution: '',
    imageUrl: '',
  });

  const updateForm = (key: string, value: string) =>
    setForm({ ...form, [key]: value });

  const validateRequiredFields = () => {
    if (!form.title.trim()) {
      toast.error('Title is required');
      return false;
    }
    if (!form.description.trim()) {
      toast.error('Description is required');
      return false;
    }
    if (!form.location.trim()) {
      toast.error('Location is required');
      return false;
    }
    if (!form.categoryId) {
      toast.error('Category is required');
      return false;
    }
    if (!form.pricePerShare || Number(form.pricePerShare) <= 0) {
      toast.error('Valid price per share is required');
      return false;
    }
    if (!form.totalShares || Number(form.totalShares) <= 0) {
      toast.error('Valid total shares is required');
      return false;
    }

    return true;
  };

  const buildPayload = (): Record<string, unknown> => {
    const postPayload: Record<string, unknown> = {
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      problemStatement: form.problemStatement?.trim() || undefined,
      proposedSolution: form.proposedSolution?.trim() || undefined,
      pricePerShare: Number(form.pricePerShare),
      totalShares: Number(form.totalShares),
      expectedReturn: form.expectedReturn
        ? Number(form.expectedReturn)
        : undefined,
      images: form.imageUrl ? [form.imageUrl] : undefined,
      categoryId: form.categoryId,
    };

    return postPayload;
  };

  const { data: categories = [] } = useQuery({
    queryKey: ['create-property-categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return normalizeList<Category>(res?.data?.data);
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!validateRequiredFields()) {
        throw new Error('Please fill all required fields correctly');
      }

      const postPayload = buildPayload();
      await api.post('/properties', postPayload);
    },
    onSuccess: () => {
      toast.success('Property created');
      router.push('/dashboard/properties');
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const submitForReviewMutation = useMutation({
    mutationFn: async () => {
      if (!validateRequiredFields()) {
        throw new Error('Please fill all required fields correctly');
      }

      const postPayload = buildPayload();

      const createRes = await api.post('/properties', postPayload);
      const createdId = extractPropertyIdFromCreateResponse(createRes.data);

      if (!createdId) {
        throw new Error('Property created but ID was not returned by API');
      }

      await submitPropertyForReview(createdId);
    },
    onSuccess: () => {
      toast.success('Property submitted for review');
      router.push('/dashboard/properties');
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return (
    <div className='space-y-8 max-w-3xl'>
      <div>
        <h1 className='text-2xl font-bold font-heading'>Create Property</h1>
        <p className='text-sm text-white/40 mt-1'>
          List a new property for investment on PropShare.
        </p>
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
            placeholder='e.g. Aurora Waterfront Residences'
            className='bg-white/5 border-white/10 rounded-xl py-5 text-white placeholder:text-white/20 focus-visible:ring-blue-500/30'
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
            placeholder='Describe the property, its features, and investment opportunity...'
            className='w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/30 outline-none resize-none'
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
                placeholder='Gulshan, Dhaka'
                className='bg-white/5 border-white/10 rounded-xl pl-10 py-5 text-white placeholder:text-white/20 focus-visible:ring-blue-500/30'
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
              className='w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:ring-2 focus:ring-blue-500/30 outline-none appearance-none cursor-pointer'
            >
              <option value='' className='bg-[#151c2e]'>
                Select category
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className='bg-[#151c2e]'>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Financial Details */}
      <div className='bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-5'>
        <h3 className='text-base font-bold flex items-center gap-2'>
          <div className='w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center'>
            <DollarSign className='w-3.5 h-3.5 text-emerald-400' />
          </div>
          Financial Details
        </h3>
        <div className='grid md:grid-cols-2 gap-4'>
          {[
            {
              label: 'Price Per Share (৳)',
              key: 'pricePerShare',
              placeholder: '50000',
            },
            { label: 'Total Shares', key: 'totalShares', placeholder: '300' },
            {
              label: 'Expected Return (%)',
              key: 'expectedReturn',
              placeholder: '22',
            },
          ].map((f) => (
            <div key={f.key} className='space-y-2'>
              <label className='text-xs text-white/40 uppercase tracking-wider font-medium'>
                {f.label} *
              </label>
              <Input
                type='number'
                value={form[f.key as keyof typeof form]}
                onChange={(e) => updateForm(f.key, e.target.value)}
                placeholder={f.placeholder}
                className='bg-white/5 border-white/10 rounded-xl py-5 text-white placeholder:text-white/20 focus-visible:ring-blue-500/30'
              />
            </div>
          ))}
        </div>
      </div>

      {/* Media Upload */}
      <div className='bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-5'>
        <h3 className='text-base font-bold flex items-center gap-2'>
          <div className='w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center'>
            <ImagePlus className='w-3.5 h-3.5 text-purple-400' />
          </div>
          Property Images
        </h3>
        <ImageUploader
          label='Upload Property Image'
          placeholder='Drag and drop or click to upload property image'
          onImageUpload={(url) => updateForm('imageUrl', url)}
          previewHeight={300}
          previewWidth={400}
        />
        {form.imageUrl && (
          <p className='text-xs text-green-400'>
            ✓ Image uploaded: {form.imageUrl.split('/').pop()}
          </p>
        )}
      </div>

      {/* Features & Proposal */}
      <div className='bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-5'>
        <h3 className='text-base font-bold flex items-center gap-2'>
          <div className='w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center'>
            <Layers className='w-3.5 h-3.5 text-amber-400' />
          </div>
          Detailed Proposal
        </h3>
        <div className='space-y-2'>
          <label className='text-xs text-white/40 uppercase tracking-wider font-medium'>
            Problem Statement (Optional)
          </label>
          <textarea
            value={form.problemStatement}
            onChange={(e) => updateForm('problemStatement', e.target.value)}
            rows={3}
            placeholder='What problem does this property solve or what gap does it fill?'
            className='w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/30 outline-none resize-none'
          />
        </div>
        <div className='space-y-2'>
          <label className='text-xs text-white/40 uppercase tracking-wider font-medium'>
            Proposed Solution (Optional)
          </label>
          <textarea
            value={form.proposedSolution}
            onChange={(e) => updateForm('proposedSolution', e.target.value)}
            rows={3}
            placeholder='How will this property investment yield returns or solve the stated problem?'
            className='w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/30 outline-none resize-none'
          />
        </div>
      </div>

      {/* Actions */}
      <div className='flex gap-3'>
        <Button
          variant='outline'
          onClick={() => createMutation.mutate()}
          disabled={
            createMutation.isPending || submitForReviewMutation.isPending
          }
          className='border-white/10 text-white hover:bg-white/5 rounded-xl px-6 py-5'
        >
          <Save className='w-4 h-4 mr-2' /> Save as Draft
        </Button>
        <Button
          onClick={() => submitForReviewMutation.mutate()}
          disabled={
            createMutation.isPending || submitForReviewMutation.isPending
          }
          className='flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-5 text-sm font-semibold group'
        >
          Submit for Review{' '}
          <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
        </Button>
      </div>
    </div>
  );
}
