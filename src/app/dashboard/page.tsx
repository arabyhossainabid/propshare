'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { api, getApiErrorMessage, normalizeList, renderText } from '@/lib/api';
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
  MessageSquare,
  PlusCircle,
  TrendingUp,
  Wallet,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';



const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-500',
    border: 'border-blue-500/20',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-500',
    border: 'border-emerald-500/20',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-500',
    border: 'border-purple-500/20',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-500',
    border: 'border-amber-500/20',
  },
};

const statusStyles: Record<string, string> = {
  approved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  under_review: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  draft: 'bg-muted text-muted-foreground/60 border-border',
  rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
};

export default function DashboardPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, isLoading: isAuthLoading, accessToken, user } = useAuth();

  const { data: myProperties = [] } = useQuery({
    queryKey: ['dashboard-my-properties'],
    enabled: isAuthenticated && !isAuthLoading,
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
    enabled: isAuthenticated && !isAuthLoading,
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

  const { data: recommendations = [], isLoading: isLoadingRecs } = useQuery({
    queryKey: ['ai-recommendations'],
    enabled: isAuthenticated && !isAuthLoading,
    queryFn: async () => {
      try {
        const res = await api.get<{ success: true; data: Property[] | { data?: Property[] } }>('/ai/recommendations');
        return normalizeList<Property>(res.data.data);
      } catch (e) {
        return [];
      }
    },
  });

  const { data: dashboardStats } = useQuery({
    queryKey: ['dashboard-stats'],
    enabled: isAuthenticated && !isAuthLoading,
    queryFn: async () => {
      const res = await api.get<{
        success: true;
        data: {
          totalInvested: number;
          totalProperties: number;
          propertiesCreated: number;
          estimatedProfit: number;
          activeInvestments: number;
          investedPropertiesCount: number;
        };
      }>('/dashboard/user/stats');
      return res.data.data;
    },
  });

  const { data: chartData } = useQuery({
    queryKey: ['dashboard-charts'],
    enabled: isAuthenticated && !isAuthLoading,
    queryFn: async () => {
      const res = await api.get<{
        success: true;
        data: {
          portfolioDistribution: { label: string; value: number }[];
          investmentTrend: { label: string; value: number }[];
        };
      }>('/dashboard/user/charts');
      return res.data.data;
    },
  });

  const stats = [
    {
      label: 'Invested Capital',
      value: `৳${(dashboardStats?.totalInvested || 0).toLocaleString()}`,
      change: 'Portfolio',
      up: true,
      icon: Wallet,
      color: 'blue',
    },
    {
      label: 'Estimated Returns',
      value: `৳${Math.round(dashboardStats?.estimatedProfit || 0).toLocaleString()}`,
      change:
        dashboardStats?.totalInvested && dashboardStats.totalInvested > 0
          ? `+${((dashboardStats.estimatedProfit / dashboardStats.totalInvested) * 100).toFixed(1)}%`
          : '+0%',
      up: true,
      icon: TrendingUp,
      color: 'emerald',
    },
    {
      label: 'Properties Added',
      value: String(Math.max(dashboardStats?.propertiesCreated || 0, myProperties.length)),
      change: 'Lifetime',
      up: true,
      icon: PlusCircle,
      color: 'purple',
    },
    {
      label: 'Total Investments',
      value: String(dashboardStats?.investedPropertiesCount || 0),
      change: 'Active',
      up: true,
      icon: Building2,
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
    <div ref={pageRef} className='max-w-7xl mx-auto space-y-8 h-full px-4 md:px-0 mb-12'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold font-heading text-foreground'>Dashboard</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Welcome back, {renderText(isAuthenticated ? user?.name : 'Guest')}! Here&apos;s your portfolio overview.
          </p>
        </div>
        <Link href='/dashboard/properties/create'>
          <Button className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-6 px-6 shadow-lg shadow-primary/20'>
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
              className='dash-stat bg-card border border-border rounded-2xl p-5 hover:bg-accent/50 transition-all duration-300 shadow-sm'
            >
              <div className='flex items-center justify-between mb-4'>
                <div
                  className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}
                >
                  <Icon className={`w-4 h-4 ${c.text}`} />
                </div>
                <span
                  className={`text-xs font-bold flex items-center gap-1 ${s.up ? 'text-emerald-500' : 'text-red-500'}`}
                >
                  {s.up ? (
                    <ArrowUpRight className='w-3 h-3' />
                  ) : (
                    <ArrowDownRight className='w-3 h-3' />
                  )}
                  {s.change}
                </span>
              </div>
              <p className='text-2xl font-bold font-heading text-foreground'>{s.value}</p>
              <p className='text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1'>{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className='grid lg:grid-cols-5 gap-6'>
        {/* Recent Investments / Portfolio Assets */}
        <div className='dash-section lg:col-span-3 bg-card border border-border rounded-2xl p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-base font-bold text-foreground'>Portfolio Assets</h3>
            <Link
              href='/dashboard/investments'
              className='text-xs text-blue-500 hover:text-blue-600 font-bold transition-colors'
            >
              View All Investments
            </Link>
          </div>
          <div className='space-y-3'>
            {recentInvestments.length > 0 ? (
              // Grouping by property to show "Assets" instead of just "Transactions"
              Object.values(
                recentInvestments.reduce((acc: any, inv: any) => {
                  const pid = inv.propertyId;
                  if (!acc[pid]) {
                    acc[pid] = { ...inv, totalShares: 0, totalAmount: 0 };
                  }
                  acc[pid].totalShares += inv.shares;
                  acc[pid].totalAmount += inv.amount;
                  return acc;
                }, {})
              ).slice(0, 4).map((asset: any) => (
                <Link
                  key={asset.id}
                  href={`/properties/${asset.propertyId}`}
                  className='flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all border border-transparent hover:border-border'
                >
                  <div className='flex items-center gap-3 min-w-0'>
                    <div className='w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0'>
                      <Building2 className='w-4 h-4 text-blue-500' />
                    </div>
                    <div className='min-w-0'>
                      <p className='text-sm font-bold text-foreground truncate'>
                        {asset.property?.title || 'Property Asset'}
                      </p>
                      <p className='text-[10px] text-muted-foreground uppercase tracking-widest font-medium mt-0.5'>
                        {asset.totalShares} Shares Owned · {asset.property?.location || 'Unknown Location'}
                      </p>
                    </div>
                  </div>
                  <div className='text-right shrink-0 ml-4'>
                    <p className='text-sm font-bold text-foreground'>
                      ৳{asset.totalAmount.toLocaleString()}
                    </p>
                    <p className='text-[10px] text-emerald-500 font-bold uppercase tracking-widest'>Net Invesment</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className='py-12 text-center border-2 border-dashed border-border rounded-2xl'>
                <Wallet className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                <p className='text-sm text-muted-foreground font-medium'>No assets in your portfolio yet.</p>
                <Link href="/properties" className="text-xs text-blue-500 font-bold mt-2 inline-block hover:underline">Start Investing</Link>
              </div>
            )}
          </div>
        </div>

        {/* Portfolio Chart (SVG) */}
        <div className='dash-section lg:col-span-2 bg-card border border-border rounded-2xl p-6 flex flex-col shadow-sm'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h3 className='text-base font-bold text-foreground'>Performance</h3>
              <p className='text-[10px] text-muted-foreground uppercase tracking-widest font-medium'>Net Portfolio Growth</p>
            </div>
            <div className='flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-bold'>
              <TrendingUp className='w-3 h-3' /> +
              {dashboardStats?.totalInvested && dashboardStats.totalInvested > 0
                ? ((dashboardStats.estimatedProfit / dashboardStats.totalInvested) * 100).toFixed(1)
                : '0'}
              %
            </div>
          </div>

          <div className='flex-1 min-h-[150px] relative mt-4'>
            {chartData?.investmentTrend && chartData.investmentTrend.length > 0 ? (
              <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d={`M0,150 ${chartData.investmentTrend.map((d: any, i: number) => 
                    `L${(i * 400) / Math.max(chartData.investmentTrend.length - 1, 1)},${150 - (d.value / Math.max(...chartData.investmentTrend.map((v: any) => v.value), 1)) * 130}`
                  ).join(' ')} L400,150 Z`}
                  fill="url(#chartGradient)"
                />
                <path
                  d={`M0,${150 - (chartData.investmentTrend[0]?.value / Math.max(...chartData.investmentTrend.map((v: any) => v.value), 1)) * 130} ${chartData.investmentTrend.map((d: any, i: number) => 
                    `L${(i * 400) / Math.max(chartData.investmentTrend.length - 1, 1)},${150 - (d.value / Math.max(...chartData.investmentTrend.map((v: any) => v.value), 1)) * 130}`
                  ).join(' ')}`}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                />
              </svg>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                <BarChart3 className="w-8 h-8 text-muted-foreground/20" />
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Waiting for investment data</p>
              </div>
            )}
          </div>

          <div className='flex justify-between mt-6 px-1'>
            {(chartData?.investmentTrend?.length ? chartData.investmentTrend : [{label: 'Jan'}, {label: 'Jun'}]).map((m: any) => (
              <span key={typeof m === 'string' ? m : m.label} className='text-[10px] text-muted-foreground font-bold uppercase tracking-widest'>
                {typeof m === 'string' ? m : m.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className='grid lg:grid-cols-5 gap-6 mt-8'>
        {/* My Properties Summary */}
        <div className='dash-section lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-base font-bold text-foreground'>My Listed Properties</h3>
            <Link
              href='/dashboard/properties'
              className='text-xs text-blue-500 hover:text-blue-600 font-bold transition-colors'
            >
              Manage Listings
            </Link>
          </div>
          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {myProperties.length > 0 ? myProperties.slice(0, 4).map((p) => (
              <Link
                key={p.id}
                href={`/dashboard/properties/${p.id}`}
                className='p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all border border-transparent hover:border-border space-y-3 group'
              >
                <div className='flex items-center justify-between'>
                  <p className='text-sm font-bold text-foreground truncate group-hover:text-blue-500 transition-colors'>{renderText(p.title)}</p>
                  <Badge
                    className={`text-[9px] px-2 py-0 h-4 uppercase tracking-widest ${statusStyles[(p.status || '').toLowerCase()] || statusStyles.draft}`}
                  >
                    {p.status === 'UNDER_REVIEW'
                      ? 'Review'
                      : (p.status || 'DRAFT').replace('_', ' ')}
                  </Badge>
                </div>
                <div className='flex items-center justify-between text-xs'>
                  <div className='flex items-center gap-3 text-muted-foreground'>
                    <span className='flex items-center gap-1'>
                      <Eye className='w-3 h-3' />{p.viewCount || 0}
                    </span>
                    <span className='flex items-center gap-1'>
                      <MessageSquare className='w-3 h-3' />
                      {((p as any)._count?.comments) ?? 0}
                    </span>
                  </div>
                  <div className='text-blue-500 font-bold'>
                    ৳{p.pricePerShare.toLocaleString()}
                  </div>
                </div>
              </Link>
            )) : (
              <div className='col-span-4 py-12 text-center border-2 border-dashed border-border rounded-2xl'>
                <Building2 className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                <p className='text-sm text-muted-foreground font-medium'>You haven&apos;t listed any properties yet.</p>
                <Link href="/dashboard/properties/create" className="text-xs text-blue-500 font-bold mt-2 inline-block hover:underline">List a Property</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className='dash-section mt-8 bg-muted/30 border border-border rounded-3xl p-8 relative overflow-hidden'>
        <div className='absolute top-0 right-0 p-8 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl' />
        <div className='flex items-center gap-2 mb-8 relative z-10'>
          <div className='w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500'>
            <Sparkles className='w-5 h-5' />
          </div>
          <div>
            <h3 className='text-lg font-bold text-foreground'>Smart Recommendations</h3>
            <p className='text-xs text-muted-foreground mt-0.5'>Personalized for your investment style</p>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10'>
          {isLoadingRecs ? (
            <p className="text-muted-foreground text-sm col-span-3">Analyzing your profile to find the best matches...</p>
          ) : recommendations.length > 0 ? (
            recommendations.slice(0, 3).map((p) => (
              <Link key={p.id} href={`/properties/${p.id}`} className='bg-card border border-border hover:border-blue-500/50 hover:shadow-lg transition-all rounded-2xl p-5 group'>
                <div className='text-sm font-bold text-foreground truncate group-hover:text-blue-500 transition-colors'>{renderText(p.title)}</div>
                <div className='text-[10px] text-muted-foreground mt-2 flex justify-between uppercase tracking-widest font-bold'>
                  <span>{renderText(p.category?.name) || 'Property'}</span>
                  <span className='text-blue-500'>৳{p.pricePerShare.toLocaleString()}</span>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-muted-foreground text-sm col-span-3">No new recommendations right now. Keep exploring properties to get smarter matches!</p>
          )}
        </div>
      </div>
    </div>
  );
}
