'use client';

import { Button } from '@/components/ui/button';
import { api, getApiErrorMessage, normalizeItem } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare, RefreshCcw, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type PaymentFailurePayload = {
  reason?: string;
  message?: string;
  transactionId?: string;
};

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const transactionId =
    searchParams.get('transactionId') || searchParams.get('transaction_id');

  const {
    data: failureData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['payment-failure-reason', transactionId],
    enabled: Boolean(transactionId),
    retry: false,
    queryFn: async () => {
      const res = await api.get<{
        success: true;
        message: string;
        data: PaymentFailurePayload | { data?: PaymentFailurePayload };
      }>(`/investments/payment-failure/${transactionId}`);

      return normalizeItem<PaymentFailurePayload>(res.data.data);
    },
  });

  const apiFailureReason =
    failureData?.reason || failureData?.message || 'No failure details found.';

  return (
    <div className='min-h-screen bg-[#0a0f1d] flex items-center justify-center p-6 relative overflow-hidden'>
      <div className='absolute inset-0 grid-pattern opacity-20' />
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-600/5 blur-[200px]' />

      <div className='relative z-10 text-center max-w-lg space-y-8'>
        <div className='w-24 h-24 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto'>
          <XCircle className='w-12 h-12 text-red-400' />
        </div>

        <div className='space-y-3'>
          <h1 className='text-3xl md:text-4xl font-bold font-heading'>
            Payment <span className='text-red-400'>Failed</span>
          </h1>
          <p className='text-white/40 leading-relaxed'>
            Your payment was not completed. This could be due to insufficient
            funds, a cancelled transaction, or a temporary processing error. No
            amount has been deducted from your account.
          </p>
        </div>

        <div className='bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-3 text-left'>
          <h4 className='text-sm font-bold text-white mb-2'>Common Reasons</h4>
          {[
            'Insufficient balance in your account',
            'Transaction was cancelled by user',
            'Payment gateway timeout',
            'Card/mobile wallet declined',
          ].map((r) => (
            <div
              key={r}
              className='flex items-center gap-2 text-sm text-white/40'
            >
              <div className='w-1 h-1 rounded-full bg-red-400/50' />
              {r}
            </div>
          ))}

          {transactionId && (
            <div className='mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3'>
              <p className='text-[11px] text-white/40'>API Failure Reason</p>
              <p className='text-sm text-white/70 mt-1'>
                {isLoading
                  ? 'Loading failure details...'
                  : error
                    ? getApiErrorMessage(error)
                    : apiFailureReason}
              </p>
            </div>
          )}
        </div>

        <div className='flex flex-col sm:flex-row gap-3'>
          <Link href='/payment' className='flex-1'>
            <Button
              variant='outline'
              className='w-full border-white/10 text-white hover:bg-white/5 rounded-xl py-5'
            >
              <RefreshCcw className='w-4 h-4 mr-2' /> Try Again
            </Button>
          </Link>
          <Link href='/contact' className='flex-1'>
            <Button className='w-full bg-white/10 hover:bg-white/15 text-white rounded-xl py-5 group'>
              <MessageSquare className='w-4 h-4 mr-2' /> Contact Support
            </Button>
          </Link>
        </div>

        <Link
          href='/properties'
          className='text-xs text-white/30 hover:text-white/50 transition-colors'
        >
          ← Browse Properties
        </Link>
      </div>
    </div>
  );
}
