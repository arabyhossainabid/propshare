'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import gsap from 'gsap';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  ExternalLink,
  FileText,
  Layers,
  MapPin,
  Send,
  Shield,
  Target,
  User,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const demoProperty = {
  id: '2',
  title: 'Tech Co-working Hub',
  owner: 'Fatima Akter',
  ownerEmail: 'fatima.akter@email.com',
  category: 'Co-working',
  status: 'under_review',
  submittedDate: 'Mar 18, 2026',
  price: 45000,
  totalShares: 100,
  targetAmount: 4500000,
  expectedReturn: '18%',
  duration: '24 months',
  location: 'Banani, Dhaka',
  description:
    "A modern, high-tech co-working space strategically located in the heart of Banani's business district. Fully furnished with modular workstations, high-speed internet, and premium meeting rooms. Targeting startups and freelancers in Dhaka's tech scene.",
  images: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop',
  ],
  features: [
    'High-speed fiber internet',
    '24/7 access control',
    'Conference room with 4K display',
    'Kitchen and relaxation zone',
    'Backup power generator',
  ],
  documents: [
    { name: 'Property Ownership Deed.pdf', size: '2.4 MB' },
    { name: 'Municipal Approval Certificate.pdf', size: '1.1 MB' },
    { name: 'Business License.pdf', size: '0.8 MB' },
  ],
};

export default function AdminPropertyReviewPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const propertyId = String(params.id);
  const pageRef = useRef<HTMLDivElement>(null);
  const [reviewStage, setReviewStage] = useState<'detail' | 'decision'>(
    'detail'
  );
  const [feedback, setFeedback] = useState('');
  const [submittingType, setSubmittingType] = useState<
    'approve' | 'reject' | null
  >(null);

  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.review-header',
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.review-content',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
      );
      gsap.fromTo(
        '.review-sidebar',
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 }
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const handleDecision = (type: 'approve' | 'reject') => {
    if (type === 'reject' && !feedback.trim()) {
      toast.error('Feedback note is required when rejecting a property');
      return;
    }
    reviewMutation.mutate(type);
  };

  const reviewMutation = useMutation({
    mutationFn: async (type: 'approve' | 'reject') => {
      setSubmittingType(type);
      await api.patch(`/properties/${propertyId}/review`, {
        status: type === 'approve' ? 'APPROVED' : 'REJECTED',
        feedbackNote: type === 'reject' ? feedback : undefined,
      });
      return type;
    },
    onSuccess: async (type) => {
      const nextStatus = type === 'approve' ? 'APPROVED' : 'REJECTED';

      // Optimistically update any admin properties cache so action buttons switch immediately.
      queryClient.setQueriesData({ queryKey: ['admin-properties'] }, (old) => {
        if (!Array.isArray(old)) return old;
        return old.map((p: unknown) => {
          if (!p || typeof p !== 'object') return p;
          const record = p as { id?: string; status?: string };
          return record.id === propertyId
            ? { ...record, status: nextStatus }
            : p;
        });
      });

      await queryClient.invalidateQueries({ queryKey: ['admin-properties'] });

      toast.success('Review submitted');
      router.push('/admin/properties');
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
    onSettled: () => setSubmittingType(null),
  });

  return (
    <div ref={pageRef} className='space-y-6 pb-20'>
      {/* Header */}
      <div className='review-header flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <Link href='/admin/properties'>
            <Button
              variant='ghost'
              className='h-10 w-10 p-0 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all'
            >
              <ArrowLeft className='w-5 h-5' />
            </Button>
          </Link>
          <div>
            <h1 className='text-2xl font-bold font-heading'>Property Review</h1>
            <p className='text-sm text-white/40 mt-1'>
              Property ID:{' '}
              <span className='text-blue-400 font-mono'>
                #{demoProperty.id}
              </span>
            </p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <Badge className='bg-amber-500/10 text-amber-400 border border-amber-500/20 py-1.5 px-3'>
            <Clock className='w-3.5 h-3.5 mr-1.5' /> Under Review
          </Badge>
        </div>
      </div>

      <div className='grid lg:grid-cols-3 gap-8'>
        {/* Main Review Section */}
        <div className='review-content lg:col-span-2 space-y-8'>
          {/* Decision Stage */}
          {reviewStage === 'decision' ? (
            <div className='bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-6'>
              <h3 className='text-xl font-bold font-heading'>Final Decision</h3>
              <p className='text-white/40 text-sm'>
                Please provide feedback for the property owner regarding your
                decision.
              </p>

              <div className='space-y-2'>
                <label className='text-xs text-white/40 uppercase tracking-wider font-medium'>
                  Internal Notes / Feedback *
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={6}
                  placeholder='Explain why the property is being approved or rejected. This will be visible to the owner if rejected.'
                  className='w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:ring-2 focus:ring-blue-500/30 outline-none resize-none'
                />
                <p className='text-[11px] text-white/35'>
                  Reject করতে feedback note mandatory.
                </p>
              </div>

              <div className='flex gap-4 pt-4'>
                <Button
                  onClick={() => setReviewStage('detail')}
                  variant='outline'
                  className='flex-1 border-white/10 text-white/60 hover:text-white hover:bg-white/5 rounded-xl h-14'
                  disabled={reviewMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDecision('reject')}
                  className='flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl h-14'
                  disabled={reviewMutation.isPending || !feedback.trim()}
                >
                  {submittingType === 'reject' ? (
                    <span className='flex items-center gap-2'>
                      <div className='w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin' />{' '}
                      Rejecting...
                    </span>
                  ) : (
                    <>
                      <XCircle className='w-4 h-4 mr-2' /> Reject Property
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => handleDecision('approve')}
                  className='flex-1 bg-white/10 hover:bg-white/15 text-white rounded-xl h-14 shadow-lg shadow-black/20'
                  disabled={reviewMutation.isPending}
                >
                  {submittingType === 'approve' ? (
                    <span className='flex items-center gap-2'>
                      <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />{' '}
                      Approving...
                    </span>
                  ) : (
                    <>
                      <CheckCircle className='w-4 h-4 mr-2' /> Approve Property
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Images Gallery Preview */}
              <div className='space-y-4'>
                <div className='relative aspect-[21/9] rounded-3xl overflow-hidden bg-white/5 border border-white/5'>
                  <Image
                    src={demoProperty.images[0]}
                    fill
                    alt={demoProperty.title}
                    className='object-cover'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-[#0a0f1d] to-transparent opacity-40' />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  {demoProperty.images.slice(1).map((img, i) => (
                    <div
                      key={i}
                      className='relative aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/5'
                    >
                      <Image
                        src={img}
                        fill
                        alt={`${demoProperty.title} ${i + 2}`}
                        className='object-cover'
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Details Content */}
              <div className='bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-8'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <Badge className='bg-blue-500/10 text-blue-400 border border-blue-500/20'>
                      {demoProperty.category}
                    </Badge>
                    <Badge className='bg-white/5 text-white/40 border border-white/10'>
                      <Clock className='w-3 h-3 mr-1' /> Submitted{' '}
                      {demoProperty.submittedDate}
                    </Badge>
                  </div>
                  <h2 className='text-3xl font-bold font-heading'>
                    {demoProperty.title}
                  </h2>
                  <div className='flex items-center gap-4 text-white/40 text-sm'>
                    <span className='flex items-center gap-1.5'>
                      <MapPin className='w-4 h-4' /> {demoProperty.location}
                    </span>
                    <span className='flex items-center gap-1.5'>
                      <User className='w-4 h-4' /> By {demoProperty.owner}
                    </span>
                  </div>
                </div>

                <div className='space-y-4'>
                  <h4 className='text-sm font-bold uppercase tracking-widest text-white/30'>
                    Description
                  </h4>
                  <p className='text-white/60 leading-relaxed text-sm'>
                    {demoProperty.description}
                  </p>
                </div>

                <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
                  {[
                    {
                      l: 'Price / Share',
                      v: `৳${demoProperty.price.toLocaleString()}`,
                      i: DollarSign,
                    },
                    {
                      l: 'Total Shares',
                      v: demoProperty.totalShares,
                      i: Layers,
                    },
                    { l: 'Return', v: demoProperty.expectedReturn, i: Target },
                    { l: 'Duration', v: demoProperty.duration, i: Calendar },
                  ].map((m, i) => {
                    const Icon = m.i;
                    return (
                      <div key={i} className='space-y-1'>
                        <p className='text-[10px] uppercase tracking-widest text-white/30 font-bold'>
                          {m.l}
                        </p>
                        <div className='flex items-center gap-2'>
                          <Icon className='w-4 h-4 text-blue-400' />
                          <p className='text-base font-bold text-white'>
                            {m.v}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className='space-y-4'>
                  <h4 className='text-sm font-bold uppercase tracking-widest text-white/30'>
                    Features
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {demoProperty.features.map((f) => (
                      <span
                        key={f}
                        className='px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-xs text-white/60'
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className='review-sidebar space-y-6'>
          {/* Owner Information */}
          <div className='bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-6'>
            <h4 className='text-sm font-bold uppercase tracking-widest text-white/30'>
              Submitted By
            </h4>
            <div className='flex items-center gap-4'>
              <div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-blue-500/20'>
                FA
              </div>
              <div>
                <p className='font-bold text-white'>{demoProperty.owner}</p>
                <p className='text-xs text-white/40'>
                  {demoProperty.ownerEmail}
                </p>
              </div>
            </div>
            <div className='pt-4 border-t border-white/5 space-y-3'>
              <div className='flex justify-between text-xs'>
                <span className='text-white/30'>Total Listed</span>
                <span className='text-white'>2 Properties</span>
              </div>
              <div className='flex justify-between text-xs'>
                <span className='text-white/30'>Approved</span>
                <span className='text-emerald-400'>1</span>
              </div>
              <div className='flex justify-between text-xs'>
                <span className='text-white/30'>Join Date</span>
                <span className='text-white'>Feb 2025</span>
              </div>
            </div>
          </div>

          {/* Verification Documents */}
          <div className='bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-5'>
            <h4 className='text-sm font-bold uppercase tracking-widest text-white/30'>
              Verification Docs
            </h4>
            <div className='space-y-3'>
              {demoProperty.documents.map((doc, i) => (
                <div
                  key={i}
                  className='flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 group hover:bg-white/[0.05] transition-all cursor-pointer'
                >
                  <div className='flex items-center gap-3 min-w-0'>
                    <FileText className='w-4 h-4 text-white/30 group-hover:text-blue-400' />
                    <div className='min-w-0'>
                      <p className='text-xs font-medium text-white/80 truncate'>
                        {doc.name}
                      </p>
                      <p className='text-[10px] text-white/30'>{doc.size}</p>
                    </div>
                  </div>
                  <ExternalLink className='w-3.5 h-3.5 text-white/20 group-hover:text-white' />
                </div>
              ))}
            </div>
            <div className='bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 flex items-start gap-3'>
              <Shield className='w-4 h-4 text-emerald-400 mt-0.5' />
              <p className='text-[10px] text-emerald-400/80 leading-relaxed'>
                All essential documents have been uploaded and scanned for
                malware.
              </p>
            </div>
          </div>

          {/* Actions Sticky Card */}
          {reviewStage === 'detail' && (
            <div className='bg-blue-600/10 border border-blue-500/30 rounded-3xl p-6 space-y-4'>
              <h4 className='text-sm font-bold text-white'>Review Status</h4>
              <div className='flex items-center gap-3 text-sm text-blue-400'>
                <Clock className='w-4 h-4' />
                <span>Awaiting Decision</span>
              </div>
              <Button
                onClick={() => setReviewStage('decision')}
                className='w-full bg-white/10 hover:bg-white/15 text-white rounded-xl py-6 text-sm font-semibold shadow-xl shadow-black/20 group'
              >
                Make a Decision
                <Send className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
