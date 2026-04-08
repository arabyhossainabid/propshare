'use client';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { api, normalizeList } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, Search, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';

type AdminInvestment = {
  id: string;
  amount: number;
  shares: number;
  status: string;
  createdAt: string;
  user?: {
    name?: string;
    email?: string;
  };
  property?: {
    title?: string;
  };
};

const statusStyles: Record<string, string> = {
  confirmed: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  success: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  completed: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  failed: 'bg-red-500/10 text-red-600 border-red-500/20',
  cancelled: 'bg-red-500/10 text-red-600 border-red-500/20',
};

export default function AdminInvestmentsPage() {
  const [search, setSearch] = useState('');
  const {
    data: investments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin-investments'],
    queryFn: async () => {
      const res = await api.get<{
        success: true;
        message: string;
        data: { data?: AdminInvestment[] } | AdminInvestment[];
      }>('/admin/investments', {
        params: { limit: 200 },
      });

      return normalizeList<AdminInvestment>(res.data.data);
    },
    refetchOnMount: 'always',
  });

  const filtered = investments.filter((i) => {
    const userName = i.user?.name || 'Unknown Investor';
    const propertyTitle = i.property?.title || 'Unknown Property';
    return (
      userName.toLowerCase().includes(search.toLowerCase()) ||
      propertyTitle.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalVolume = filtered.reduce((sum, i) => sum + (i.amount || 0), 0);
  const successfulRounds = filtered.filter(
    (i) => i.status?.toLowerCase() === 'success' || i.status?.toLowerCase() === 'confirmed'
  ).length;
  const pendingRounds = filtered.filter(
    (i) => i.status?.toLowerCase() === 'pending'
  ).length;

  const showTable = !isLoading && !isError && filtered.length > 0;

  return (
    <div className='space-y-8 pb-12'>
      <div className='flex flex-col sm:flex-row items-center justify-between gap-6'>
        <div>
          <h1 className='text-3xl font-bold font-heading text-foreground'>
            Capital Flow
          </h1>
          <p className='text-sm text-muted-foreground mt-1 font-medium'>
            Global ledger of platform-wide asset subscriptions.
          </p>
        </div>
        <div className='flex gap-2'>
          <Badge className='bg-primary/10 text-primary border-primary/20 text-[11px] font-bold px-4 py-1.5 shadow-sm'>
            TOTAL VOLUME: ৳{totalVolume.toLocaleString()}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
        {[
          {
            label: 'Open Subscriptions',
            value: pendingRounds.toString(),
            icon: ClockIcon,
            color: 'amber',
          },
          {
            label: 'Settled Tranches',
            value: successfulRounds.toString(),
            icon: TrendingUp,
            color: 'emerald',
          },
          {
            label: 'Historical Data',
            value: filtered.length.toString(),
            icon: ArrowUpRight,
            color: 'blue',
          },
        ].map((s, i) => {
          const Icon = s.icon;
          const colors: Record<string, string> = {
            emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
            amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
            blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
          };
          const c = colors[s.color] || colors.blue;
          return (
            <div
              key={i}
              className='bg-card border border-border rounded-2xl p-6 shadow-sm group hover:border-border/60 transition-all cursor-default'
            >
              <div className='flex items-center gap-3 mb-4'>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${c}`}>
                   <Icon className="w-5 h-5" />
                </div>
                <span className='text-[10px] text-muted-foreground uppercase tracking-widest font-bold'>
                  {s.label}
                </span>
              </div>
              <p className='text-3xl font-bold font-heading text-foreground'>{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Search + Filter */}
      <div className='relative group'>
        <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60' />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Locate transactions by participant or asset reference...'
          className='bg-card border-border rounded-xl h-14 pl-12 text-foreground focus-visible:ring-blue-500/30 shadow-sm'
        />
      </div>

      {isLoading && (
        <div className='space-y-4'>
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={`admin-investment-skeleton-${idx}`}
              className='bg-card border border-border rounded-2xl h-24 animate-pulse'
            />
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <div className='text-center py-24 bg-muted/20 border border-dashed border-border rounded-3xl'>
          <p className='text-muted-foreground text-sm font-bold uppercase tracking-widest'>
            Connectivity error. Registry synchronization failed.
          </p>
        </div>
      )}

      {/* Investments List */}
      {showTable && (
        <div className='bg-card border border-border rounded-2xl overflow-hidden shadow-sm'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='bg-muted/30 border-b border-border'>
                  <th className='text-left text-[10px] text-muted-foreground uppercase tracking-widest font-bold px-8 py-5'>
                    Beneficiary
                  </th>
                  <th className='text-left text-[10px] text-muted-foreground uppercase tracking-widest font-bold px-8 py-5'>
                    Asset Underwriter
                  </th>
                  <th className='text-left text-[10px] text-muted-foreground uppercase tracking-widest font-bold px-8 py-5'>
                    Valuation
                  </th>
                  <th className='text-left text-[10px] text-muted-foreground uppercase tracking-widest font-bold px-8 py-5'>
                    Status
                  </th>
                  <th className='text-left text-[10px] text-muted-foreground uppercase tracking-widest font-bold px-8 py-5'>
                    Settled Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((inv) => (
                  <tr
                    key={inv.id}
                    className='hover:bg-muted/30 transition-all'
                  >
                    <td className='px-8 py-5'>
                      <div className='flex items-center gap-4'>
                        <div className='w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-600 shadow-sm'>
                          {(inv.user?.name || 'U').slice(0, 1).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className='text-sm font-bold text-foreground truncate'>
                            {inv.user?.name || 'Unknown Principal'}
                          </p>
                          <p className='text-[10px] text-muted-foreground truncate font-medium'>
                            {inv.user?.email || 'N/A ELECTRONIC MAIL'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className='px-8 py-5'>
                      <p className='text-sm font-bold text-foreground max-w-[200px] truncate'>
                        {inv.property?.title || 'Undefined Asset'}
                      </p>
                      <p className='text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1'>
                        {inv.shares} Fractional Shares
                      </p>
                    </td>
                    <td className='px-8 py-5'>
                      <p className='text-sm font-black text-foreground'>
                        ৳{(inv.amount || 0).toLocaleString()}
                      </p>
                      <p className='text-[10px] text-muted-foreground font-mono mt-1'>
                        #{inv.id.slice(-8).toUpperCase()}
                      </p>
                    </td>
                    <td className='px-8 py-5'>
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-bold px-2 py-0.5 border ${statusStyles[inv.status?.toLowerCase()] || 'bg-muted text-muted-foreground border-border'}`}
                      >
                        {inv.status?.toUpperCase()}
                      </Badge>
                    </td>
                    <td className='px-8 py-5 text-xs text-muted-foreground font-medium'>
                      {new Date(inv.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <div className='text-center py-24 bg-muted/20 border border-dashed border-border rounded-3xl'>
          <p className='text-muted-foreground text-sm font-bold uppercase tracking-widest'>No transaction records identified in current scope.</p>
        </div>
      )}
    </div>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <circle cx='12' cy='12' r='10' />
      <polyline points='12 6 12 12 16 14' />
    </svg>
  );
}
