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
        <div className='bg-card border border-border rounded-3xl p-6 space-y-6 shadow-xl'>
          <div className='space-y-2'>
            <p className='text-[10px] text-muted-foreground uppercase tracking-widest font-bold'>
              Share Price
            </p>
            <p className='text-3xl font-bold gradient-text'>
              ৳{price.toLocaleString()}
            </p>
          </div>

          {/* Funding Progress */}
          <div className='space-y-3'>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground font-medium'>Funding Progress</span>
              <span className='text-foreground font-bold'>
                {fundingProgress}%
              </span>
            </div>
            <div className='w-full h-2 rounded-full bg-muted overflow-hidden'>
              <div
                className='h-full rounded-full bg-linear-to-r from-blue-600 to-emerald-500 transition-all duration-700'
                style={{ width: `${fundingProgress}%` }}
              />
            </div>
            <div className='flex justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-widest'>
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
            <div className='bg-muted/30 border border-border/50 rounded-xl p-3'>
              <p className='text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1'>
                Return
              </p>
              <p className='text-sm font-bold text-emerald-500'>
                {expectedReturn}
              </p>
            </div>
            <div className='bg-muted/30 border border-border/50 rounded-xl p-3'>
              <p className='text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1'>
                Min. Invest
              </p>
              <p className='text-sm font-bold text-foreground'>
                ৳{price.toLocaleString()}
              </p>
            </div>
          </div>

          {isPropertyOwner ? (
            <Button
              disabled
              className='w-full bg-muted text-muted-foreground/60 rounded-xl py-6 text-sm font-semibold shadow-none mt-2 cursor-not-allowed'
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
              <Button className='w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-6 text-sm font-semibold shadow-xl shadow-primary/20 group mt-2'>
                {hasInvested ? 'View Investment' : 'Invest Now'}
                <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
              </Button>
            </Link>
          )}

          <div className='flex items-center gap-2 justify-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest'>
            <Shield className='w-3.5 h-3.5 text-emerald-500' />
            <span>Secured & Verified Asset</span>
          </div>
        </div>
      </div>
    </div>
  );
}
