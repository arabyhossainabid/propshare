'use client';

import { ImageUploader } from '@/components/ImageUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
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
  Loader2,
  MapPin,
  Save,
  TrendingUp,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function CreatePropertyPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading, accessToken } = useAuth();
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
    enabled: isAuthenticated && !isAuthLoading,
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
    <div className='space-y-8 max-w-3xl pb-12'>
      <div>
        <h1 className='text-3xl font-bold font-heading text-foreground'>Create Property</h1>
        <p className='text-sm text-muted-foreground mt-1'>
          List a new institutional-grade property for investment on PropShare.
        </p>
      </div>

      {/* Basic Info */}
      <div className='bg-card border border-border rounded-2xl p-8 space-y-6 shadow-sm'>
        <h3 className='text-lg font-bold flex items-center gap-3 text-foreground mb-2'>
          <div className='w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center'>
            <FileText className='w-4 h-4 text-blue-500' />
          </div>
          Basic Information
        </h3>
        <div className='space-y-2'>
          <label className='text-[10px] text-muted-foreground uppercase tracking-widest font-bold'>
            Property Title *
          </label>
          <Input
            value={form.title}
            onChange={(e) => updateForm('title', e.target.value)}
            placeholder='e.g. Aurora Waterfront Residences'
            className='bg-muted/30 border-border rounded-xl h-12 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-blue-500/30 font-medium'
          />
        </div>
        <div className='space-y-2'>
          <label className='text-[10px] text-muted-foreground uppercase tracking-widest font-bold'>
            Description *
          </label>
          <textarea
            value={form.description}
            onChange={(e) => updateForm('description', e.target.value)}
            rows={5}
            placeholder='Describe the property, its features, and investment opportunity...'
            className='w-full bg-muted/30 border border-border rounded-xl p-4 text-foreground text-sm placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-blue-500/30 outline-none resize-none font-medium'
          />
        </div>
        <div className='grid md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <label className='text-[10px] text-muted-foreground uppercase tracking-widest font-bold'>
              Location *
            </label>
            <div className='relative'>
               <div className='absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-muted flex items-center justify-center overflow-hidden'>
                <MapPin className='w-4 h-4 text-blue-500/60' />
               </div>
              <Input
                value={form.location}
                onChange={(e) => updateForm('location', e.target.value)}
                placeholder='Gulshan, Dhaka'
                className='bg-muted/30 border-border rounded-xl pl-12 h-12 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-blue-500/30 font-medium'
              />
            </div>
          </div>
          <div className='space-y-2'>
            <label className='text-[10px] text-muted-foreground uppercase tracking-widest font-bold'>
              Category *
            </label>
            <div className="relative">
               <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500/60 z-10" />
              <select
                value={form.categoryId}
                onChange={(e) => updateForm('categoryId', e.target.value)}
                className='w-full bg-muted/30 border border-border rounded-xl pl-10 h-12 text-foreground text-sm focus:ring-2 focus:ring-blue-500/30 outline-none appearance-none cursor-pointer font-medium'
              >
                <option value='' className='bg-card'>
                  Select category
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className='bg-card'>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Details */}
      <div className='bg-card border border-border rounded-2xl p-8 space-y-6 shadow-sm'>
        <h3 className='text-lg font-bold flex items-center gap-3 text-foreground mb-2'>
          <div className='w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center'>
            <DollarSign className='w-4 h-4 text-emerald-500' />
          </div>
          Financial Details
        </h3>
        <div className='grid md:grid-cols-3 gap-6'>
          {[
            {
              label: 'Price Per Share (৳)',
              key: 'pricePerShare',
              placeholder: '50000',
              icon: DollarSign,
              color: 'text-blue-500'
            },
            { label: 'Total Shares', key: 'totalShares', placeholder: '300', icon: Layers, color: 'text-purple-500' },
            {
              label: 'Return (%)',
              key: 'expectedReturn',
              placeholder: '22',
              icon: TrendingUp,
              color: 'text-emerald-500'
            },
          ].map((f) => (
            <div key={f.key} className='space-y-2'>
              <label className='text-[10px] text-muted-foreground uppercase tracking-widest font-bold'>
                {f.label} *
              </label>
              <Input
                type='number'
                value={form[f.key as keyof typeof form]}
                onChange={(e) => updateForm(f.key, e.target.value)}
                placeholder={f.placeholder}
                className='bg-muted/30 border-border rounded-xl h-12 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-blue-500/30 font-bold'
              />
            </div>
          ))}
        </div>
      </div>

      {/* Media Upload */}
      <div className='bg-muted/30 border border-dashed border-border rounded-3xl p-8 space-y-6'>
        <div className="flex items-center gap-3">
          <div className='w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center'>
            <ImagePlus className='w-5 h-5 text-purple-500' />
          </div>
          <div>
             <h3 className='text-base font-bold text-foreground'>Property Visuals</h3>
             <p className='text-xs text-muted-foreground font-medium'>
              High-quality imagery increases investor confidence.
            </p>
          </div>
        </div>
        <ImageUploader
          label='Upload Property Image'
          placeholder='Drag and drop or click to upload property image'
          onImageUpload={(url) => updateForm('imageUrl', url)}
          previewHeight={220}
          previewWidth={320}
          compact
        />
        {form.imageUrl && (
          <div className='flex items-center gap-2 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl'>
            <p className='text-xs text-emerald-600 font-bold uppercase tracking-widest'>
              ✓ Image Ready
            </p>
          </div>
        )}
      </div>

      {/* Features & Proposal */}
      <div className='bg-card border border-border rounded-2xl p-8 space-y-6 shadow-sm'>
        <h3 className='text-lg font-bold flex items-center gap-3 text-foreground mb-2'>
          <div className='w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center'>
            <Layers className='w-4 h-4 text-amber-500' />
          </div>
          Detailed Proposal
        </h3>
        <div className='space-y-2'>
          <label className='text-[10px] text-muted-foreground uppercase tracking-widest font-bold'>
            Problem Statement (Optional)
          </label>
          <textarea
            value={form.problemStatement}
            onChange={(e) => updateForm('problemStatement', e.target.value)}
            rows={3}
            placeholder='What market need does this property address?'
            className='w-full bg-muted/30 border border-border rounded-xl p-4 text-foreground text-sm placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-blue-500/30 outline-none resize-none font-medium'
          />
        </div>
        <div className='space-y-2'>
          <label className='text-[10px] text-muted-foreground uppercase tracking-widest font-bold'>
            Value Proposition (Optional)
          </label>
          <textarea
            value={form.proposedSolution}
            onChange={(e) => updateForm('proposedSolution', e.target.value)}
            rows={3}
            placeholder='Explain the projected return mechanism...'
            className='w-full bg-muted/30 border border-border rounded-xl p-4 text-foreground text-sm placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-blue-500/30 outline-none resize-none font-medium'
          />
        </div>
      </div>

      {/* Actions */}
      <div className='flex flex-col sm:flex-row gap-4'>
         <Button
          onClick={() => createMutation.mutate()}
          variant="outline"
          disabled={
            createMutation.isPending || submitForReviewMutation.isPending
          }
          className='flex-1 border-border text-foreground hover:bg-muted rounded-xl h-14 text-sm font-bold uppercase tracking-widest transition-all'
        >
          <Save className="w-4 h-4 mr-2" />
          Save as Draft
        </Button>
        <Button
          onClick={() => submitForReviewMutation.mutate()}
          disabled={
            createMutation.isPending || submitForReviewMutation.isPending
          }
          className='flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-14 text-sm font-bold uppercase tracking-widest shadow-xl shadow-primary/20 group transition-all'
        >
          {(createMutation.isPending || submitForReviewMutation.isPending) ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <>
               Submit for Verification
               <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
