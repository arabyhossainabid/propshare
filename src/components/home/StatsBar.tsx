'use client';

import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Building2, MapPin, TrendingUp, Users } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    ring: 'ring-blue-500/20',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    ring: 'ring-emerald-500/20',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    ring: 'ring-amber-500/20',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    ring: 'ring-purple-500/20',
  },
};

export default function StatsBar() {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    data: summary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['platform-summary'],
    queryFn: async () => {
      const res = await api.get<{
        success: true;
        message: string;
        data: {
          totalApprovedProperties: number;
          totalCategories: number;
          totalSuccessfulInvestments: number;
          totalInvestors: number;
          totalRevenue: number;
        };
      }>('/properties/summary');
      return res.data.data;
    },
  });

  const displayStats = useMemo(
    () => [
      {
        icon: Building2,
        value: summary?.totalApprovedProperties || 0,
        suffix: '+',
        label: 'Premium Properties',
        color: 'blue',
      },
      {
        icon: Users,
        value: summary?.totalInvestors || 0,
        suffix: '+',
        label: 'Active Investors',
        color: 'emerald',
      },
      {
        icon: TrendingUp,
        value: summary?.totalSuccessfulInvestments || 0,
        suffix: '+',
        label: 'Successful Investments',
        color: 'amber',
      },
      {
        icon: MapPin,
        value: summary?.totalCategories || 0,
        suffix: '',
        label: 'Categories',
        color: 'purple',
      },
    ],
    [summary]
  );

  useEffect(() => {
    if (!containerRef.current || isLoading || !summary) return;

    const ctx = gsap.context(() => {
      // Animate stat items
      gsap.fromTo(
        '.stat-item',
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 90%',
          },
        }
      );

      // Count up animations
      displayStats.forEach((stat, index) => {
        const el = containerRef.current?.querySelectorAll('.stat-value')[
          index
        ] as HTMLElement;
        if (!el) return;

        const obj = { value: 0 };
        gsap.to(obj, {
          value: stat.value,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 90%',
          },
          onUpdate: () => {
            el.textContent = `${Math.floor(obj.value).toLocaleString()}${stat.suffix}`;
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isLoading, summary, displayStats]);

  if (isError || (!isLoading && !summary)) {
    return null;
  }

  return (
    <section className='relative z-10 -mt-12'>
      <div className='container-custom'>
        <div
          ref={containerRef}
          className='glass rounded-2xl lg:rounded-3xl p-5 md:p-8 lg:p-10 gradient-border'
        >
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            {displayStats.map((stat) => {
              const Icon = stat.icon;
              const colors = colorMap[stat.color];
              return (
                <div
                  key={stat.label}
                  className='stat-item flex flex-col items-center text-center space-y-2 lg:space-y-3 group cursor-default'
                >
                  <div
                    className={`w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl ${colors.bg} flex items-center justify-center ring-1 ${colors.ring} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${colors.text}`} />
                  </div>
                  <div>
                    <p className='stat-value text-xl sm:text-2xl md:text-3xl font-bold font-heading text-foreground'>
                      0
                    </p>
                    <p className='text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mt-1'>
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
