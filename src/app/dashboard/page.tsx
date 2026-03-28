'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Investment, Property } from '@/lib/api-types';
import { useQuery } from '@tanstack/react-query';
import gsap from 'gsap';
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  DollarSign,
  Eye,
  PlusCircle,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

const normalizeList = <T,>(payload: unknown): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === 'object') {
    const maybeData = (payload as { data?: unknown }).data;
    if (Array.isArray(maybeData)) {
      return maybeData as T[];
    }
  }

  return [];
};

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/20',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
  },
};

const statusStyles: Record<string, string> = {
  approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  under_review: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  draft: 'bg-white/5 text-white/40 border-white/10',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function DashboardPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, isLoading: isAuthLoading, accessToken } = useAuth();

  const { data: myProperties = [] } = useQuery({
    queryKey: ['dashboard-my-properties'],
    enabled: isAuthenticated && !isAuthLoading && !!accessToken,
    refetchOnMount: 'always',
    queryFn: async () => {
      const res = await api.get<{
        success: true;
        message: string;
        data: Property[] | { data?: Property[] };
      }>('/properties/my-properties', {
        params: { limit: 3 },
      });
      return normalizeList<Property>(res.data.data);
    },
  });

  const { data: recentInvestments = [] } = useQuery({
    queryKey: ['dashboard-recent-investments'],
    enabled: isAuthenticated && !isAuthLoading && !!accessToken,
    refetchOnMount: 'always',
    queryFn: async () => {
      const res = await api.get<{
        success: true;
        message: string;
        data: Investment[] | { data?: Investment[] };
      }>('/investments/my-investments');
      return normalizeList<Investment>(res.data.data);
    },
  });

  const totalInvested = recentInvestments.reduce(
    (sum, inv) => sum + inv.amount,
    0
  );
  const totalReturns = 0;
  const portfolioValue = totalInvested + totalReturns;

  const stats = [
    {
      label: 'Total Invested',
      value: `৳${totalInvested.toLocaleString()}`,
      change: 'Live',
      up: true,
      icon: Wallet,
      color: 'blue',
    },
    {
      label: 'Total Returns',
      value: `৳${totalReturns.toLocaleString()}`,
      change: 'Live',
      up: true,
      icon: TrendingUp,
      color: 'emerald',
    },
    {
      label: 'My Properties',
      value: String(myProperties.length),
      change: 'Live',
      up: true,
      icon: Building2,
      color: 'purple',
    },
    {
      label: 'Portfolio Value',
      value: `৳${portfolioValue.toLocaleString()}`,
      change: 'Live',
      up: true,
      icon: DollarSign,
      color: 'amber',
    },
  ];

  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dash-stat',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.dash-section',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.3,
        }
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className='space-y-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold font-heading'>Dashboard</h1>
          <p className='text-sm text-white/40 mt-1'>
            Welcome back, John! Here&apos;s your portfolio overview.
          </p>
        </div>
        <Link href='/dashboard/properties/create'>
          <Button className='bg-white/10 hover:bg-white/15 text-white rounded-xl text-sm group'>
            <PlusCircle className='w-4 h-4 mr-2' /> Create Property
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {stats.map((s) => {
          const Icon = s.icon;
          const c = colorMap[s.color];
          return (
            <div
              key={s.label}
              className='dash-stat bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.04] transition-all duration-300'
            >
              <div className='flex items-center justify-between mb-3'>
                <div
                  className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}
                >
                  <Icon className={`w-4 h-4 ${c.text}`} />
                </div>
                <span
                  className={`text-xs font-medium flex items-center gap-1 ${s.up ? 'text-emerald-400' : 'text-red-400'}`}
                >
                  {s.up ? (
                    <ArrowUpRight className='w-3 h-3' />
                  ) : (
                    <ArrowDownRight className='w-3 h-3' />
                  )}
                  {s.change}
                </span>
              </div>
              <p className='text-2xl font-bold font-heading'>{s.value}</p>
              <p className='text-xs text-white/30 mt-1'>{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className='grid lg:grid-cols-5 gap-6'>
        {/* Recent Investments */}
        <div className='dash-section lg:col-span-3 bg-white/[0.02] border border-white/5 rounded-2xl p-6'>
          <div className='flex items-center justify-between mb-5'>
            <h3 className='text-base font-bold'>Recent Investments</h3>
            <Link
              href='/dashboard/investments'
              className='text-xs text-blue-400 hover:text-blue-300 transition-colors'
            >
              View All
            </Link>
          </div>
          <div className='space-y-3'>
            {recentInvestments.slice(0, 3).map((inv) => (
              <div
                key={inv.id}
                className='flex items-center justify-between p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all'
              >
                <div className='flex items-center gap-3 min-w-0'>
                  <div className='w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0'>
                    <Building2 className='w-4 h-4 text-blue-400' />
                  </div>
                  <div className='min-w-0'>
                    <p className='text-sm font-medium text-white truncate'>
                      {inv.property?.title || 'Property'}
                    </p>
                    <p className='text-xs text-white/30'>
                      {inv.shares} shares ·{' '}
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className='text-right shrink-0 ml-4'>
                  <p className='text-sm font-bold text-white'>
                    ৳{inv.amount.toLocaleString()}
                  </p>
                  <p className='text-xs text-emerald-400 font-medium'>Live</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Properties Summary */}
        <div className='dash-section lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-2xl p-6'>
          <div className='flex items-center justify-between mb-5'>
            <h3 className='text-base font-bold'>My Properties</h3>
            <Link
              href='/dashboard/properties'
              className='text-xs text-blue-400 hover:text-blue-300 transition-colors'
            >
              View All
            </Link>
          </div>
          <div className='space-y-3'>
            {myProperties.slice(0, 3).map((p) => (
              <div
                key={p.id}
                className='p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all space-y-2'
              >
                <div className='flex items-center justify-between'>
                  <p className='text-sm font-medium text-white'>{p.title}</p>
                  <Badge
                    className={`text-[10px] ${statusStyles[(p.status || '').toLowerCase()] || statusStyles.draft}`}
                  >
                    {p.status === 'UNDER_REVIEW'
                      ? 'Under Review'
                      : (p.status || 'DRAFT').replace('_', ' ')}
                  </Badge>
                </div>
                <div className='flex items-center gap-4 text-xs text-white/30'>
                  <span className='flex items-center gap-1'>
                    <Eye className='w-3 h-3' />0
                  </span>
                  <span className='flex items-center gap-1'>
                    <BarChart3 className='w-3 h-3' />
                    {p.votes?.total ?? 0} votes
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
