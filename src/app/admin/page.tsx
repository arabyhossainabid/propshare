/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { api, normalizeItem } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import gsap from 'gsap';
import {
  ArrowUpRight,
  Building2,
  Calendar,
  DollarSign,
  Info,
  Users,
  Wallet,
} from 'lucide-react';
import { useEffect, useRef } from 'react';

interface AdminStats {
  counters: {
    totalUsers: number;
    totalProperties: number;
    pendingReview: number;
    approvedProperties: number;
    totalCategories: number;
    totalInvestments: number;
    totalRevenue: number;
  };
  recentProperties: any[];
}

const colorMap: Record<string, { bg: string; text: string; border: string; shadow: string }> = {
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-600',
    border: 'border-blue-500/20',
    shadow: 'shadow-blue-500/5',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-600',
    border: 'border-emerald-500/20',
    shadow: 'shadow-emerald-500/5',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-600',
    border: 'border-purple-500/20',
    shadow: 'shadow-purple-500/5',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-600',
    border: 'border-amber-500/20',
    shadow: 'shadow-amber-500/5',
  },
};

export default function AdminPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const { data: statsData, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    enabled: isAuthenticated && !isAuthLoading,
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return normalizeItem<AdminStats>(res?.data?.data);
    },
  });

  const stats = [
    {
      label: 'Total Users',
      value: String(statsData?.counters?.totalUsers ?? 0),
      icon: Users,
      color: 'blue',
    },
    {
      label: 'Total Properties',
      value: String(statsData?.counters?.totalProperties ?? 0),
      icon: Building2,
      color: 'purple',
    },
    {
      label: 'Total Investments',
      value: String(statsData?.counters?.totalInvestments ?? 0),
      icon: Wallet,
      color: 'emerald',
    },
    {
      label: 'Revenue',
      value: `৳${(statsData?.counters?.totalRevenue ?? 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'amber',
    },
  ];

  useEffect(() => {
    if (!pageRef.current || isLoading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.admin-stat',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
      gsap.fromTo(
        '.admin-section',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.out',
          delay: 0.1,
        }
      );
    }, pageRef);
    return () => ctx.revert();
  }, [isLoading]);

  return (
    <div ref={pageRef} className='space-y-8 h-full px-4 md:px-0 mb-12'>
      <div>
        <h1 className='text-3xl font-bold font-heading text-foreground'>Admin Dashboard</h1>
        <p className='text-sm text-muted-foreground mt-1'>
          Platform overview and management controls.
        </p>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {stats.map((s) => {
          const Icon = s.icon;
          const c = colorMap[s.color];
          return (
            <div
              key={s.label}
              className='admin-stat bg-card border border-border rounded-2xl p-5 hover:bg-accent/50 transition-all duration-300 shadow-sm'
            >
              <div className='flex items-center justify-between mb-4'>
                <div
                  className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}
                >
                  <Icon className={`w-4 h-4 ${c.text}`} />
                </div>
                <span className='text-xs text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1'>
                  <ArrowUpRight className='w-3 h-3' />
                  Live
                </span>
              </div>
              <p className='text-2xl font-bold font-heading text-foreground'>{s.value}</p>
              <p className='text-[10px] text-foreground/60 font-black uppercase tracking-widest mt-1'>{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className='grid lg:grid-cols-5 gap-6'>
        {/* Recent Properties Activity */}
        <div className='admin-section lg:col-span-3 bg-card border border-border rounded-2xl p-6 shadow-sm'>
          <h3 className='text-base font-bold text-foreground mb-6'>Recent Property Listings</h3>
          <div className='space-y-3'>
            {(statsData?.recentProperties || []).map((p: any) => (
              <div
                key={p.id}
                className='flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-all border border-transparent hover:border-border'
              >
                <div className='w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0'>
                  <Building2 className='w-4 h-4 text-blue-500' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-bold text-foreground truncate'>{p.title}</p>
                  <p className='text-[10px] text-muted-foreground uppercase tracking-widest font-medium mt-0.5'>
                    by {p.author?.name} ·{' '}
                    {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge className='bg-muted text-muted-foreground border-border text-[9px] uppercase tracking-widest px-2 py-0.5'>
                  {p.category?.name}
                </Badge>
              </div>
            ))}
            {(!statsData?.recentProperties ||
              statsData.recentProperties.length === 0) && (
              <div className='text-center py-12'>
                <p className='text-sm text-muted-foreground'>No recent activity found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className='admin-section lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-base font-bold text-foreground'>Platform Health</h3>
            <Badge className='bg-amber-500/10 text-amber-500 border-amber-500/20 text-[9px] uppercase tracking-widest px-2 py-0.5'>
              {statsData?.counters?.pendingReview ?? 0} pending
            </Badge>
          </div>
          <div className='space-y-4'>
            <div className='flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-transparent hover:border-border transition-all'>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center'>
                  <Calendar className='w-4 h-4 text-amber-500' />
                </div>
                <span className='text-sm font-medium text-foreground'>Pending Review</span>
              </div>
              <span className='text-sm font-bold text-foreground'>
                {statsData?.counters?.pendingReview ?? 0}
              </span>
            </div>
            <div className='flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-transparent hover:border-border transition-all'>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center'>
                  <Info className='w-4 h-4 text-emerald-500' />
                </div>
                <span className='text-sm font-medium text-foreground'>Approved Assets</span>
              </div>
              <span className='text-sm font-bold text-foreground'>
                {statsData?.counters?.approvedProperties ?? 0}
              </span>
            </div>
            <div className='flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-transparent hover:border-border transition-all'>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center'>
                  <Building2 className='w-4 h-4 text-purple-500' />
                </div>
                <span className='text-sm font-medium text-foreground'>Market Growth</span>
              </div>
              <span className='text-sm font-bold text-foreground'>
                {statsData?.counters?.totalProperties ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
