'use client';

import { Badge } from '@/components/ui/badge';
import { api, normalizeList } from '@/lib/api';
import { Investment } from '@/lib/api-types';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowUpRight,
  Building2,
  Calendar,
  DollarSign,
  Filter,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function InvestmentsPage() {
  const [filter, setFilter] = useState('all');
  const {
    data: investments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['my-investments'],
    queryFn: async () => {
      const res = await api.get<{
        success: true;
        message: string;
        data: Investment[] | { data?: Investment[] };
      }>('/investments/my-investments');
      return normalizeList<Investment>(res.data.data);
    },
    refetchOnMount: 'always',
  });

  const rows = investments.map((inv) => {
    const totalAmount = inv.amount;
    const currentValue = inv.amount;
    const status = (inv.status || 'pending').toLowerCase();
    return {
      id: inv.id,
      propertyId: inv.propertyId,
      property: inv.property?.title || 'Property',
      category: inv.property?.category?.name || 'Category',
      shares: inv.shares,
      totalAmount,
      currentValue,
      returnPct: '+0%',
      date: new Date(inv.createdAt).toLocaleDateString(),
      status: status,
      statusLabel:
        status === 'completed'
          ? 'Completed'
          : status === 'pending'
            ? 'Pending'
            : 'Active',
      statusColor:
        status === 'completed'
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          : status === 'pending'
            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            : 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      nextPayout: '-',
    };
  });

  const totalInvested = rows.reduce((s, i) => s + i.totalAmount, 0);
  const totalCurrentValue = rows.reduce((s, i) => s + i.currentValue, 0);
  const totalGain = totalCurrentValue - totalInvested;

  const filtered =
    filter === 'all' ? rows : rows.filter((i) => i.status === filter);

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold font-heading'>My Investments</h1>
        <p className='text-sm text-white/40 mt-1'>
          Track and manage all your property investments.
        </p>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        {[
          {
            label: 'Total Invested',
            value: `৳${(totalInvested / 100000).toFixed(1)}L`,
            icon: DollarSign,
            color: 'blue',
          },
          {
            label: 'Current Value',
            value: `৳${(totalCurrentValue / 100000).toFixed(1)}L`,
            icon: TrendingUp,
            color: 'emerald',
          },
          {
            label: 'Total Gain',
            value: `৳${(totalGain / 1000).toFixed(0)}K`,
            icon: ArrowUpRight,
            color: totalGain >= 0 ? 'emerald' : 'red',
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className='bg-white/[0.02] border border-white/5 rounded-2xl p-5'
            >
              <div className='flex items-center gap-2 mb-2'>
                <Icon
                  className={`w-4 h-4 ${s.color === 'emerald' ? 'text-emerald-400' : s.color === 'red' ? 'text-red-400' : 'text-blue-400'}`}
                />
                <span className='text-xs text-white/30 uppercase tracking-wider'>
                  {s.label}
                </span>
              </div>
              <p className='text-2xl font-bold font-heading'>{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className='flex items-center gap-2'>
        <Filter className='w-4 h-4 text-white/20' />
        {['all', 'pending', 'completed', 'active'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${filter === f ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Investment List */}
      <div className='space-y-3'>
        {isLoading &&
          Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={`skeleton-${idx}`}
              className='bg-white/[0.02] border border-white/5 rounded-2xl p-5 animate-pulse'
            >
              <div className='flex items-center justify-between gap-4'>
                <div className='flex items-center gap-4 flex-1'>
                  <div className='w-12 h-12 rounded-xl bg-white/[0.06]' />
                  <div className='space-y-2 flex-1'>
                    <div className='h-4 w-1/3 rounded bg-white/[0.07]' />
                    <div className='h-3 w-1/2 rounded bg-white/[0.05]' />
                  </div>
                </div>
                <div className='h-9 w-28 rounded-xl bg-white/[0.08]' />
              </div>
            </div>
          ))}

        {isError && (
          <div className='text-center py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl'>
            <p className='text-white/30 text-sm'>
              Could not load investments. Please try again.
            </p>
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className='text-center py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl'>
            <p className='text-white/20 text-sm'>No investments found.</p>
          </div>
        )}

        {!isLoading &&
          !isError &&
          filtered.map((inv) => (
            <Link
              href={`/properties/${inv.propertyId}`}
              key={inv.id}
              className='block'
            >
              <div className='bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.04] transition-all group'>
                <div className='flex items-center justify-between gap-4'>
                  <div className='flex items-center gap-4 min-w-0'>
                    <div className='w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0'>
                      <Building2 className='w-5 h-5 text-blue-400' />
                    </div>
                    <div className='min-w-0'>
                      <div className='flex items-center gap-2'>
                        <p className='text-sm font-semibold text-white group-hover:text-blue-400 transition-colors'>
                          {inv.property}
                        </p>
                        <Badge
                          className={`text-[10px] border ${inv.statusColor}`}
                        >
                          {inv.statusLabel}
                        </Badge>
                      </div>
                      <div className='flex items-center gap-3 mt-1 text-xs text-white/30'>
                        <span>{inv.category}</span>
                        <span>{inv.shares} shares</span>
                        <span className='flex items-center gap-1'>
                          <Calendar className='w-3 h-3' />
                          {inv.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='text-right shrink-0'>
                    <p className='text-sm font-bold text-white'>
                      ৳{inv.currentValue.toLocaleString()}
                    </p>
                    <p
                      className={`text-xs font-semibold ${inv.returnPct.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}
                    >
                      {inv.returnPct}
                    </p>
                    <p className='text-[10px] text-white/20 mt-0.5'>
                      Next: {inv.nextPayout}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
