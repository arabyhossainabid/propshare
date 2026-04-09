'use client';

import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
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
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';

export default function InvestmentsPage() {
  const [filter, setFilter] = useState('all');
  const { isAuthenticated, isLoading: isAuthLoading, accessToken } = useAuth();
  const {
    data: investments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['my-investments'],
    enabled: isAuthenticated && !isAuthLoading,
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
          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
          : status === 'pending'
            ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
            : 'bg-blue-500/10 text-blue-600 border-blue-500/20',
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
        <h1 className='text-xl md:text-2xl font-bold font-heading text-foreground'>My Investments</h1>
        <p className='text-xs md:text-sm text-muted-foreground mt-1'>
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
              className='bg-card border border-border rounded-2xl p-6 shadow-sm group hover:border-blue-500/20 transition-all'
            >
              <div className='flex items-center gap-2 mb-3'>
                <div className='w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center'>
                  <Icon
                    className={`w-4 h-4 ${s.color === 'emerald' ? 'text-emerald-500' : s.color === 'red' ? 'text-red-500' : 'text-blue-500'}`}
                  />
                </div>
                <span className='text-[10px] text-muted-foreground uppercase tracking-widest font-bold'>
                  {s.label}
                </span>
              </div>
              <p className='text-2xl font-bold font-heading text-foreground'>{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className='flex items-center gap-2 flex-wrap'>
        <Filter className='w-4 h-4 text-muted-foreground shrink-0' />
        <div className='flex gap-2 flex-wrap'>
        {['all', 'pending', 'completed', 'active'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${filter === f ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:text-foreground'}`}
          >
            {f}
          </button>
        ))}
        </div>
      </div>

      {/* Investment Data Table — horizontally scrollable on mobile */}
      <div className='dash-section bg-card border border-border rounded-[32px] overflow-hidden shadow-2xl relative'>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Property Asset</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Category</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Shares</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Investment</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Status</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Acquisition Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading && Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-6"><div className="h-4 w-40 bg-muted rounded" /></td>
                  <td className="px-6 py-6"><div className="h-4 w-20 bg-muted rounded" /></td>
                  <td className="px-6 py-6"><div className="h-4 w-10 bg-muted rounded mx-auto" /></td>
                  <td className="px-6 py-6"><div className="h-4 w-20 bg-muted rounded ml-auto" /></td>
                  <td className="px-6 py-6"><div className="h-6 w-20 bg-muted rounded-full mx-auto" /></td>
                  <td className="px-6 py-6"><div className="h-4 w-24 bg-muted rounded ml-auto" /></td>
                </tr>
              ))}

              {!isLoading && filtered.map((inv) => (
                <tr key={inv.id} className="group hover:bg-accent/30 transition-colors cursor-pointer" onClick={() => window.location.href = `/properties/${inv.propertyId}`}>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Building2 className="w-4 h-4 text-blue-500" />
                      </div>
                      <span className="text-sm font-bold text-foreground group-hover:text-blue-500 transition-colors">{inv.property}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{inv.category}</span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className="text-sm font-bold text-foreground">{inv.shares}</span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="space-y-0.5">
                      <p className="text-sm font-black text-foreground">৳{inv.currentValue.toLocaleString()}</p>
                      <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">{inv.returnPct} Gain</p>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <Badge variant="outline" className={`text-[9px] uppercase tracking-widest h-6 px-3 rounded-full font-bold ${inv.statusColor}`}>
                      {inv.statusLabel}
                    </Badge>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <span className="text-xs font-medium text-muted-foreground">{inv.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!isLoading && filtered.length === 0 && (
            <div className='text-center py-20 bg-muted/10'>
              <div className='w-16 h-16 rounded-3xl bg-muted/50 flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-border'>
                <Filter className='w-6 h-6 text-muted-foreground/30' />
              </div>
              <p className='text-sm text-muted-foreground font-bold uppercase tracking-widest'>No records match your criteria</p>
            </div>
          )}
        </div>

        {/* Pagination Placeholder */}
        <div className="px-6 py-5 border-t border-border flex items-center justify-between bg-muted/10">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
            Showing <span className="text-foreground">{filtered.length}</span> of {investments.length} investments
          </p>
          <div className="flex gap-2">
            <Button variant="outline" className="h-8 rounded-lg px-3 text-[10px] font-bold uppercase tracking-widest" disabled>Prev</Button>
            <Button variant="outline" className="h-8 rounded-lg px-3 text-[10px] font-bold uppercase tracking-widest bg-primary text-white border-primary" disabled>1</Button>
            <Button variant="outline" className="h-8 rounded-lg px-3 text-[10px] font-bold uppercase tracking-widest" disabled>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
