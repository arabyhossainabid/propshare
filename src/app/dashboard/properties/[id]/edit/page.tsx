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
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
  ArrowLeft,
  DollarSign,
  FileText,
  ImagePlus,
  Layers,
  Loader2,
  MapPin,
  Save,
  Send,
  TrendingUp,
} from 'lucide-react';

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isLoading: isAuthLoading, accessToken } = useAuth();
  const propertyId = String(params.id);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    categoryId: '',
    pricePerShare: '',
    totalShares: '',
    expectedReturn: '',
    duration: '24',
    minInvestment: '',
    features: '',
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

      if (form.categoryId) {
        patchPayload.categoryId = form.categoryId;
      }

      await api.patch(`/properties/${propertyId}`, patchPayload);
    },
    onSuccess: () => {
      toast.success('Property details updated');
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

      if (form.categoryId) {
        patchPayload.categoryId = form.categoryId;
      }

      await api.patch(`/properties/${propertyId}`, patchPayload);
      await submitPropertyForReview(propertyId);
    },
    onSuccess: () => {
      toast.success('Updated and submitted for verification');
      router.push('/dashboard/properties');
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  if (isPageLoading) {
    return (
      <div className='space-y-6 max-w-3xl pb-12'>
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={`edit-property-skeleton-${idx}`}
            className='bg-card border border-border rounded-2xl p-8 animate-pulse shadow-sm'
          >
            <div className='space-y-4'>
              <div className='h-4 w-1/4 rounded bg-muted' />
              <div className='h-12 w-full rounded bg-muted/60' />
              <div className='h-32 w-full rounded bg-muted/40' />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isErrorProperty) {
    return (
      <div className='max-w-3xl rounded-3xl border border-dashed border-border bg-muted/20 p-12 text-center'>
        <p className='text-sm text-muted-foreground font-medium'>
          Could not synchronize property data. Please re-authenticate and try again.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-8 max-w-3xl pb-12'>
      <div className='flex items-center justify-between'>
        <div>
          <Link
            href='/dashboard/properties'
            className='text-[10px] text-blue-600 hover:text-blue-700 flex items-center gap-1.5 mb-2 font-bold uppercase tracking-widest transition-colors'
          >
            <ArrowLeft className='w-3 h-3' /> Back to Portfolio
          </Link>
          <h1 className='text-3xl font-bold font-heading text-foreground'>Edit Property</h1>
          <p className='text-xs text-muted-foreground mt-1 font-medium'>
            Prop ID: <span className="text-foreground font-bold">{propertyId.toUpperCase()}</span>
          </p>
        </div>
        <Badge variant="outline" className='bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1 font-bold'>
          Active Assets
        </Badge>
      </div>

      {/* Basic Info */}
      <div className='bg-card border border-border rounded-2xl p-8 space-y-6 shadow-sm'>
        <h3 className='text-lg font-bold flex items-center gap-3 text-foreground mb-2'>
          <div className='w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center'>
            <FileText className='w-4 h-4 text-blue-500' />
          </div>
          General Information
        </h3>
        <div className='space-y-2'>
          <label className='text-[10px] text-muted-foreground uppercase tracking-widest font-bold'>
            Property Heading *
          </label>
          <Input
            value={form.title}
            onChange={(e) => updateForm('title', e.target.value)}
            className='bg-muted/30 border-border rounded-xl h-12 text-foreground focus-visible:ring-blue-500/30 font-bold'
          />
        </div>
        <div className='space-y-2'>
          <label className='text-[10px] text-muted-foreground uppercase tracking-widest font-bold'>
            Full Description *
          </label>
          <textarea
            value={form.description}
            onChange={(e) => updateForm('description', e.target.value)}
            rows={5}
            className='w-full bg-muted/30 border border-border rounded-xl p-4 text-foreground text-sm focus:ring-2 focus:ring-blue-500/30 outline-none resize-none font-medium'
          />
        </div>
        <div className='grid md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <label className='text-[10px] text-muted-foreground uppercase tracking-widest font-bold'>
              Property Location *
            </label>
            <div className='relative'>
              <div className='absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-muted flex items-center justify-center overflow-hidden'>
                <MapPin className='w-4 h-4 text-blue-500/60' />
              </div>
              <Input
                value={form.location}
                onChange={(e) => updateForm('location', e.target.value)}
                className='bg-muted/30 border-border rounded-xl pl-12 h-12 text-foreground focus-visible:ring-blue-500/30 font-medium'
              />
            </div>
          </div>
          <div className='space-y-2'>
            <label className='text-[10px] text-muted-foreground uppercase tracking-widest font-bold'>
              Asset Category *
            </label>
            <div className="relative">
               <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500/60 z-10" />
              <select
                value={form.categoryId}
                onChange={(e) => updateForm('categoryId', e.target.value)}
                className='w-full bg-muted/30 border border-border rounded-xl pl-10 h-12 text-foreground text-sm focus:ring-2 focus:ring-blue-500/30 outline-none appearance-none font-medium'
              >
                <option value='' className='bg-card'>
                  Select category
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className='bg-card'>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Financial */}
      <div className='bg-card border border-border rounded-2xl p-8 space-y-6 shadow-sm'>
        <h3 className='text-lg font-bold flex items-center gap-3 text-foreground mb-2'>
          <div className='w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center'>
            <DollarSign className='w-4 h-4 text-emerald-500' />
          </div>
          Institutional Financials
        </h3>
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {[
            { l: 'Price / Share (৳)', k: 'pricePerShare' },
            { l: 'Total Units', k: 'totalShares' },
            { l: 'Return (%)', k: 'expectedReturn' },
            { l: 'Term (Months)', k: 'duration' },
          ].map((f) => (
            <div key={f.k} className='space-y-2'>
              <label className='text-[10px] text-muted-foreground uppercase tracking-widest font-bold'>
                {f.l}
              </label>
              <Input
                type='number'
                value={form[f.k as keyof typeof form]}
                onChange={(e) => updateForm(f.k, e.target.value)}
                className='bg-muted/30 border-border rounded-xl h-12 text-foreground focus-visible:ring-blue-500/30 font-bold'
              />
            </div>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className='bg-muted/30 border border-dashed border-border rounded-3xl p-8 space-y-6'>
        <div className="flex items-center gap-3">
          <div className='w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center'>
            <ImagePlus className='w-5 h-5 text-purple-500' />
          </div>
          <div>
            <h3 className='text-base font-bold text-foreground'>Asset Media</h3>
            <p className='text-xs text-muted-foreground font-medium'>
              High-resolution cover imagery only.
            </p>
          </div>
        </div>
        <ImageUploader
          label='Update Property Image'
          placeholder='Drag and drop or click to upload new property image'
          onImageUpload={(url) => updateForm('imageUrl', url)}
          previewHeight={220}
          previewWidth={320}
          compact
        />
        {form.imageUrl && (
          <div className='flex items-center gap-2 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl'>
            <p className='text-xs text-emerald-600 font-bold uppercase tracking-widest'>
              ✓ Media Synchronized
            </p>
          </div>
        )}
      </div>

      {/* Features */}
      <div className='bg-card border border-border rounded-2xl p-8 space-y-6 shadow-sm'>
        <h3 className='text-lg font-bold flex items-center gap-3 text-foreground mb-2'>
          <div className='w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center'>
            <Layers className='w-4 h-4 text-amber-500' />
          </div>
          Key Highlights
        </h3>
        <textarea
          value={form.features}
          onChange={(e) => updateForm('features', e.target.value)}
          rows={3}
          placeholder="Enter comma separated highlights (e.g. Near Metro, Fully Serviced, ESG Compliant)"
          className='w-full bg-muted/30 border border-border rounded-xl p-4 text-foreground text-sm focus:ring-2 focus:ring-blue-500/30 outline-none resize-none font-medium'
        />
      </div>

      {/* Actions */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <Button
          onClick={() => updateMutation.mutate()}
          variant='outline'
          disabled={updateMutation.isPending || updateAndSubmitMutation.isPending}
          className='flex-1 border-border text-foreground hover:bg-muted rounded-xl h-14 text-sm font-bold uppercase tracking-widest transition-all'
        >
          {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className='w-4 h-4 mr-2' />}
          Save Refinements
        </Button>
        <Button
          onClick={() => updateAndSubmitMutation.mutate()}
          disabled={updateMutation.isPending || updateAndSubmitMutation.isPending}
          className='flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-14 text-sm font-bold uppercase tracking-widest shadow-xl shadow-primary/20 group transition-all'
        >
          {updateAndSubmitMutation.isPending ? (
             <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <>
               Sync & Re-Verify{' '}
               <Send className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
