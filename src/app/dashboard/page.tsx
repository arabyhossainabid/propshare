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
    <div ref={pageRef} className='max-w-7xl mx-auto space-y-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold font-heading'>Dashboard</h1>
          <p className='text-sm text-white/40 mt-1'>
            Welcome back, {renderText(isAuthenticated ? user?.name : 'Guest')}! Here&apos;s your portfolio overview.
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
              className='dash-stat bg-white/2 border border-white/5 rounded-2xl p-5 hover:bg-white/4 transition-all duration-300'
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
        <div className='dash-section lg:col-span-3 bg-white/2 border border-white/5 rounded-2xl p-6'>
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
                className='flex items-center justify-between p-4 rounded-xl bg-white/2 hover:bg-white/4 transition-all'
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

        {/* Portfolio Chart (SVG) */}
        <div className='dash-section lg:col-span-2 bg-white/2 border border-white/5 rounded-2xl p-6 flex flex-col'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h3 className='text-base font-bold'>Performance</h3>
              <p className='text-[10px] text-white/30 uppercase tracking-widest'>Net Portfolio Growth</p>
            </div>
            <div className='flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold'>
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
              <line x1="0" y1="0" x2="400" y2="0" stroke="white" strokeOpacity="0.05" strokeWidth="1" />
              <line x1="0" y1="50" x2="400" y2="50" stroke="white" strokeOpacity="0.05" strokeWidth="1" />
              <line x1="0" y1="100" x2="400" y2="100" stroke="white" strokeOpacity="0.05" strokeWidth="1" />
              <line x1="0" y1="150" x2="400" y2="150" stroke="white" strokeOpacity="0.05" strokeWidth="1" />

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
                className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
              />

              {/* Points */}
              <circle cx="120" cy="100" r="4" fill="#3b82f6" />
              <circle cx="240" cy="50" r="4" fill="#3b82f6" />
              <circle cx="360" cy="10" r="6" fill="#10b981" />
            </svg>
          </div>

          <div className='flex justify-between mt-6 px-1'>
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => (
              <span key={m} className='text-[10px] text-white/20 font-medium uppercase tracking-tighter'>{m}</span>
            ))}
          </div>
        </div>
      </div>

      <div className='grid lg:grid-cols-5 gap-6 mt-8'>
        {/* My Properties Summary */}
        <div className='dash-section lg:col-span-3 bg-white/2 border border-white/5 rounded-2xl p-6'>
          <div className='flex items-center justify-between mb-5'>
            <h3 className='text-base font-bold'>My Properties</h3>
            <Link
              href='/dashboard/properties'
              className='text-xs text-blue-400 hover:text-blue-300 transition-colors'
            >
              View All
            </Link>
          </div>
          <div className='grid sm:grid-cols-2 gap-4'>
            {myProperties.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className='p-4 rounded-xl bg-white/2 hover:bg-white/4 transition-all space-y-3'
              >
                <div className='flex items-center justify-between'>
                  <p className='text-sm font-semibold text-white truncate'>{renderText(p.title)}</p>
                  <Badge
                    className={`text-[9px] px-2 py-0 h-4 ${statusStyles[(p.status || '').toLowerCase()] || statusStyles.draft}`}
                  >
                    {p.status === 'UNDER_REVIEW'
                      ? 'Review'
                      : (p.status || 'DRAFT').replace('_', ' ')}
                  </Badge>
                </div>
                <div className='flex items-center justify-between text-xs'>
                  <div className='flex items-center gap-3 text-white/30'>
                    <span className='flex items-center gap-1'>
                      <Eye className='w-3 h-3' />0
                    </span>
                    <span className='flex items-center gap-1'>
                      <BarChart3 className='w-3 h-3' />
                      {p.votes?.total ?? 0}
                    </span>
                  </div>
                  <div className='text-blue-400 font-bold tracking-tighter'>
                    ৳{p.pricePerShare.toLocaleString()} / share
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Activity Feed */}
        <div className='dash-section lg:col-span-2 bg-white/2 border border-white/5 rounded-2xl p-6'>
          <h3 className='text-base font-bold mb-5'>Recent Activity</h3>
          <div className='space-y-4'>
            {[
              { text: 'Dividend paid for Bashundhara project', time: '2 hours ago', icon: DollarSign, color: 'emerald' },
              { text: 'New comment on Banani Penthouse', time: '5 hours ago', icon: MessageSquare, color: 'blue' },
              { text: 'Investment milestone reached: ৳10Cr', time: '1 day ago', icon: Sparkles, color: 'amber' },
            ].map((act, i) => (
              <div key={i} className='flex gap-3'>
                <div className={`w-8 h-8 rounded-lg ${colorMap[act.color].bg} border ${colorMap[act.color].border} flex items-center justify-center shrink-0`}>
                  <act.icon className={`w-3 h-3 ${colorMap[act.color].text}`} />
                </div>
                <div>
                  <p className='text-xs text-white/80'>{act.text}</p>
                  <p className='text-[10px] text-white/30 mt-0.5'>{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className='dash-section mt-8 bg-linear-to-br from-blue-900/10 to-purple-900/10 border border-blue-500/10 rounded-3xl p-6 relative overflow-hidden'>
        <div className='absolute top-0 right-0 p-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl' />
        <div className='flex items-center gap-2 mb-6 relative z-10'>
          <div className='w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400'>
            <Sparkles className='w-4 h-4' />
          </div>
          <h3 className='text-lg font-bold text-white'>AI Recommendations for you</h3>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10'>
          {isLoadingRecs ? (
            <p className="text-white/40 text-sm">Analyzing your profile to find the best matches...</p>
          ) : recommendations.length > 0 ? (
            recommendations.slice(0, 3).map((p) => (
              <Link key={p.id} href={`/properties/${p.id}`} className='bg-card border border-white/5 hover:border-blue-500/30 transition-all rounded-xl p-4'>
                <div className='text-sm font-semibold truncate'>{renderText(p.title)}</div>
                <div className='text-xs text-white/40 mt-1 flex justify-between'>
                  <span>{renderText(p.category?.name) || 'Property'}</span>
                  <span className='text-blue-400'>৳{p.pricePerShare || 0}</span>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-white/40 text-sm">No new recommendations right now. Keep exploring properties to get smarter matches!</p>
          )}
        </div>
      </div>
    </div>
  );
}
