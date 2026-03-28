'use client';

import { Button } from '@/components/ui/button';
import { api, getApiErrorMessage, normalizeItem } from '@/lib/api';
import { InvestmentSessionDetails } from '@/lib/api-types';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const {
    data: sessionData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['investment-session-details', sessionId],
    queryFn: async () => {
      const res = await api.get<{
        success: true;
        message: string;
        data: InvestmentSessionDetails | { data?: InvestmentSessionDetails };
      }>(`/investments/session/${sessionId}`);
      return normalizeItem<InvestmentSessionDetails>(res.data.data);
    },
    enabled: Boolean(sessionId),
    retry: false,
  });

  const amount = Number(sessionData?.amount ?? 0);
  const shares = Number(sessionData?.shares ?? 0);
  const propertyTitle = sessionData?.property?.title || 'Property';
  const paymentStatus = sessionData?.paymentStatus || sessionData?.status;
  const statusLabel =
    String(paymentStatus || 'SUCCESS').toUpperCase() === 'SUCCESS'
      ? 'Confirmed'
      : String(paymentStatus || 'PENDING');
  const statusClass =
    String(paymentStatus || 'SUCCESS').toUpperCase() === 'SUCCESS'
      ? 'text-emerald-400'
      : 'text-amber-400';

  return (
    <div className='min-h-screen bg-[#0a0f1d] flex items-center justify-center p-6 relative overflow-hidden'>
      <div className='absolute inset-0 grid-pattern opacity-20' />
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-600/10 blur-[200px]' />

      <div className='relative z-10 text-center max-w-lg space-y-8'>
        <div className='w-24 h-24 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto animate-pulse-glow'>
          <CheckCircle className='w-12 h-12 text-emerald-400' />
        </div>

        <div className='space-y-3'>
          <h1 className='text-3xl md:text-4xl font-bold font-heading'>
            Payment <span className='text-emerald-400'>Successful!</span>
          </h1>
          <div className='text-white/40 leading-relaxed'>
            {!sessionId && (
              <p className='text-amber-400 mb-2'>
                Missing session id in URL. Transaction details are unavailable.
              </p>
            )}
            {sessionId && isLoading && (
              <p className='mb-2'>Loading transaction details...</p>
            )}
            {error && (
              <p className='text-amber-400 mb-2'>{getApiErrorMessage(error)}</p>
            )}
            <p>
              Congratulations! You have successfully invested in{' '}
              <span className='text-white font-medium'>{propertyTitle}</span>.
              Your {shares} shares have been credited to your portfolio.
            </p>
          </div>
        </div>

        <div className='bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4 text-left'>
          <div className='flex justify-between text-sm'>
            <span className='text-white/40'>Transaction ID</span>
            <span className='text-white font-mono truncate ml-4'>
              {sessionId || 'PENDING'}
            </span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-white/40'>Status</span>
            <span className={`${statusClass} font-medium`}>{statusLabel}</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-white/40'>Amount</span>
            <span className='text-white font-bold'>
              ৳{amount.toLocaleString()}
            </span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-white/40'>Shares</span>
            <span className='text-white font-medium'>{shares} Shares</span>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row gap-3'>
          <Link href='/dashboard/investments' className='flex-1'>
            <Button className='w-full bg-white/10 hover:bg-white/15 text-white rounded-xl py-5 group'>
              View Investments{' '}
              <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
            </Button>
          </Link>
        </div>

        <Link
          href='/'
          className='text-xs text-white/30 hover:text-white/50 transition-colors'
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className='min-h-screen bg-[#0a0f1d]' />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
