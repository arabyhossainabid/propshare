import { Button } from '@/components/ui/button';
import { ArrowRight, Shield } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface PropertySidebarProps {
  propertyId: string;
  hasInvested: boolean;
  price: number;
  expectedReturn: string;
  totalShares: number;
  availableShares: number;
  fundingProgress: number;
  isPropertyOwner?: boolean;
}

export function PropertySidebar({
  propertyId,
  hasInvested,
  price,
  expectedReturn,
  totalShares,
  availableShares,
  fundingProgress,
  isPropertyOwner = false,
}: PropertySidebarProps) {
  return (
    <div className='detail-sidebar'>
      <div className='sticky top-28 space-y-6'>
        {/* Investment Card */}
        <div className='bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-6'>
          <div className='space-y-2'>
            <p className='text-xs text-white/30 uppercase tracking-wider'>
              Share Price
            </p>
            <p className='text-3xl font-bold gradient-text'>
              ৳{price.toLocaleString()}
            </p>
          </div>

          {/* Funding Progress */}
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span className='text-white/40'>Funding Progress</span>
              <span className='text-white font-medium'>
                {fundingProgress}%
              </span>
            </div>
            <div className='w-full h-2 rounded-full bg-white/5'>
              <div
                className='h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-700'
                style={{ width: `${fundingProgress}%` }}
              />
            </div>
            <div className='flex justify-between text-xs text-white/30'>
              <span>
                ৳
                {(
                  ((totalShares - availableShares) * price) /
                  100000
                ).toFixed(1)}
                L raised
              </span>
              <span>
                ৳{((totalShares * price) / 100000).toFixed(1)}L target
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className='grid grid-cols-2 gap-3'>
            <div className='bg-white/[0.03] rounded-xl p-3'>
              <p className='text-[10px] text-white/30 uppercase tracking-wider mb-1'>
                Return
              </p>
              <p className='text-sm font-bold text-emerald-400'>
                {expectedReturn}
              </p>
            </div>
            <div className='bg-white/[0.03] rounded-xl p-3'>
              <p className='text-[10px] text-white/30 uppercase tracking-wider mb-1'>
                Min. Invest
              </p>
              <p className='text-sm font-bold text-white'>
                ৳{price.toLocaleString()}
              </p>
            </div>
          </div>

          {isPropertyOwner ? (
            <Button
              disabled
              className='w-full bg-white/5 text-white/40 rounded-xl py-6 text-sm font-semibold shadow-none mt-2 cursor-not-allowed'
            >
              Owner cannot invest
            </Button>
          ) : (
            <Link
              href={
                hasInvested
                  ? '/dashboard/investments'
                  : `/payment?propertyId=${propertyId}`
              }
            >
              <Button className='w-full bg-white/10 hover:bg-white/15 text-white rounded-xl py-6 text-sm font-semibold shadow-2xl shadow-black/20 group mt-2'>
                {hasInvested ? 'View Investment' : 'Invest Now'}
                <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
              </Button>
            </Link>
          )}

          <div className='flex items-center gap-2 justify-center text-xs text-white/20'>
            <Shield className='w-3 h-3 text-emerald-400' />
            <span>Secured & Verified Property</span>
          </div>
        </div>
      </div>
    </div>
  );
}
