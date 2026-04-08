'use client';

import CategoriesPreview from '@/components/home/CategoriesPreview';
import CTA from '@/components/home/CTA';
import FAQs from '@/components/home/FAQs';
import FeaturedPreview from '@/components/home/FeaturedPreview';
import Features from '@/components/home/Features';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import Newsletter from '@/components/home/Newsletter';
import StatsBar from '@/components/home/StatsBar';
import Testimonials from '@/components/home/Testimonials';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export default function HomePage() {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['platform-summary'],
    queryFn: async () => {
      const res = await api.get<{
        success: true;
        message: string;
        data: Record<string, number>;
      }>('/properties/summary');
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const heroStats = [
    ...(typeof statsData?.totalRevenue === 'number'
      ? [
          {
            value: `৳${(statsData.totalRevenue / 10000000).toFixed(1)}Cr+`,
            label: 'Total Invested',
          },
        ]
      : []),
    ...(typeof statsData?.totalInvestors === 'number'
      ? [
          {
            value: `${statsData.totalInvestors.toLocaleString()}+`,
            label: 'Active Investors',
          },
        ]
      : []),
    ...(typeof statsData?.totalApprovedProperties === 'number'
      ? [
          {
            value: `${statsData.totalApprovedProperties}+`,
            label: 'Approved Properties',
          },
        ]
      : []),
  ];

  return (
    <div className='flex flex-col gap-0 overflow-x-hidden bg-background'>
      <Hero heroStats={isLoading ? [] : heroStats} />
      <StatsBar />
      <Features />
      <HowItWorks />
      <FeaturedPreview />
      <CategoriesPreview />
      <Testimonials />
      <FAQs />
      <Newsletter />
      <CTA />
    </div>
  );
}
