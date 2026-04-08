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

  const { data: recommendations = [], isLoading: isLoadingRecs } = useQuery({
    queryKey: ['ai-recommendations'],
    enabled: isAuthenticated && !isAuthLoading && !!accessToken,
    queryFn: async () => {
      try {
        const res = await api.get<{ success: true; data: Property[] | { data?: Property[] } }>('/ai/recommendations');
        return normalizeList<Property>(res.data.data);
      } catch (e) {
        return [];
      }
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
        {/* Recent Investments */}
        <div className='dash-section lg:col-span-3 bg-card border border-border rounded-2xl p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-base font-bold text-foreground'>Recent Investments</h3>
            <Link
              href='/dashboard/investments'
              className='text-xs text-blue-500 hover:text-blue-600 font-bold transition-colors'
            >
              View All
            </Link>
          </div>
          <div className='space-y-3'>
            {recentInvestments.slice(0, 3).map((inv) => (
              <div
                key={inv.id}
                className='flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all border border-transparent hover:border-border'
              >
                <div className='flex items-center gap-3 min-w-0'>
                  <div className='w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0'>
                    <Building2 className='w-4 h-4 text-blue-500' />
                  </div>
                  <div className='min-w-0'>
                    <p className='text-sm font-bold text-foreground truncate'>
                      {inv.property?.title || 'Property'}
                    </p>
                    <p className='text-[10px] text-muted-foreground uppercase tracking-widest font-medium mt-0.5'>
                      {inv.shares} shares ·{' '}
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className='text-right shrink-0 ml-4'>
                  <p className='text-sm font-bold text-foreground'>
                    ৳{inv.amount.toLocaleString()}
                  </p>
                  <p className='text-[10px] text-emerald-500 font-bold uppercase tracking-widest'>Live</p>
                </div>
              </div>
            ))}
            {recentInvestments.length === 0 && (
              <div className='py-8 text-center'>
                <p className='text-sm text-muted-foreground'>No recent investments found.</p>
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
              <TrendingUp className='w-3 h-3' /> +12.5%
            </div>
          </div>

          <div className='flex-1 min-h-[150px] relative mt-4'>
            <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="0" x2="400" y2="0" stroke="currentColor" className="text-border" strokeOpacity="0.2" strokeWidth="1" />
              <line x1="0" y1="50" x2="400" y2="50" stroke="currentColor" className="text-border" strokeOpacity="0.2" strokeWidth="1" />
              <line x1="0" y1="100" x2="400" y2="100" stroke="currentColor" className="text-border" strokeOpacity="0.2" strokeWidth="1" />
              <line x1="0" y1="150" x2="400" y2="150" stroke="currentColor" className="text-border" strokeOpacity="0.2" strokeWidth="1" />

              {/* Area */}
              <path
                d="M0,130 C40,120 80,140 120,100 C160,60 200,80 240,50 C280,20 320,40 360,10 L400,20 L400,150 L0,150 Z"
                fill="url(#chartGradient)"
              />

              {/* Line */}
              <path
                d="M0,130 C40,120 80,140 120,100 C160,60 200,80 240,50 C280,20 320,40 360,10 L400,20"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]"
              />

              {/* Points */}
              <circle cx="120" cy="100" r="4" fill="#3b82f6" />
              <circle cx="240" cy="50" r="4" fill="#3b82f6" />
              <circle cx="360" cy="10" r="6" fill="#10b981" />
            </svg>
          </div>

          <div className='flex justify-between mt-6 px-1'>
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => (
              <span key={m} className='text-[10px] text-muted-foreground font-bold uppercase tracking-widest'>{m}</span>
            ))}
          </div>
        </div>
      </div>

      <div className='grid lg:grid-cols-5 gap-6 mt-8'>
        {/* My Properties Summary */}
        <div className='dash-section lg:col-span-3 bg-card border border-border rounded-2xl p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-base font-bold text-foreground'>My Properties</h3>
            <Link
              href='/dashboard/properties'
              className='text-xs text-blue-500 hover:text-blue-600 font-bold transition-colors'
            >
              View All
            </Link>
          </div>
          <div className='grid sm:grid-cols-2 gap-4'>
            {myProperties.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className='p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all border border-transparent hover:border-border space-y-3'
              >
                <div className='flex items-center justify-between'>
                  <p className='text-sm font-bold text-foreground truncate'>{renderText(p.title)}</p>
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
                      <Eye className='w-3 h-3' />0
                    </span>
                    <span className='flex items-center gap-1'>
                      <BarChart3 className='w-3 h-3' />
                      {p.votes?.total ?? 0}
                    </span>
                  </div>
                  <div className='text-blue-500 font-bold'>
                    ৳{p.pricePerShare.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
            {myProperties.length === 0 && (
              <div className='col-span-2 py-8 text-center'>
                <p className='text-sm text-muted-foreground'>No properties listed yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className='dash-section lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm'>
          <h3 className='text-base font-bold text-foreground mb-6'>Recent Activity</h3>
          <div className='space-y-6'>
            {[
              { text: 'Dividend paid for Bashundhara project', time: '2 hours ago', icon: DollarSign, color: 'emerald' },
              { text: 'New comment on Banani Penthouse', time: '5 hours ago', icon: MessageSquare, color: 'blue' },
              { text: 'Investment milestone reached: ৳10Cr', time: '1 day ago', icon: Sparkles, color: 'amber' },
            ].map((act, i) => (
              <div key={i} className='flex gap-4'>
                <div className={`w-9 h-9 rounded-lg ${colorMap[act.color].bg} border ${colorMap[act.color].border} flex items-center justify-center shrink-0`}>
                  <act.icon className={`w-4 h-4 ${colorMap[act.color].text}`} />
                </div>
                <div className='flex flex-col'>
                  <p className='text-xs font-medium text-foreground leading-snug'>{act.text}</p>
                  <p className='text-[10px] text-muted-foreground uppercase tracking-widest font-medium mt-1'>{act.time}</p>
                </div>
              </div>
            ))}
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
