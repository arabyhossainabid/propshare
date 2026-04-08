'use client';

import { Building2, CheckCircle, Users, Target, Award } from 'lucide-react';
import Image from 'next/image';

const stats = [
  { label: 'Properties Managed', value: '450+' },
  { label: 'Active Investors', value: '12k+' },
  { label: 'Avg. Annual Yield', value: '14.2%' },
  { label: 'Total Volume', value: '৳500Cr+' },
];

const values = [
  {
    title: 'Transparency',
    description: 'We believe in full visibility. Every investment, every document, and every return is clearly tracked and accessible.',
    icon: CheckCircle,
  },
  {
    title: 'Accessibility',
    description: 'Making high-value real estate investing available to everyone through fractional ownership, starting as low as ৳5,000.',
    icon: Target,
  },
  {
    title: 'Innovation',
    description: 'Leveraging AI and blockchain-inspired transparency to modernize the traditional real estate market.',
    icon: Award,
  },
];

export default function AboutPage() {
  return (
    <div className='min-h-screen bg-background pt-32 pb-20'>
      <div className='container-custom'>
        {/* Hero Section */}
        <div className='max-w-3xl mb-20'>
          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6'>
            <Building2 className='w-3 h-3 text-blue-400' />
            <span className='text-xs font-medium text-blue-400 uppercase tracking-wider'>About PropShare</span>
          </div>
          <h1 className='text-4xl md:text-6xl font-bold font-heading mb-6'>
            The Future of <span className='gradient-text'>Property Investment</span>
          </h1>
          <p className='text-white/40 text-lg leading-relaxed'>
            PropShare is Bangladesh's pioneering fractional real estate platform. 
            We are on a mission to democratize real estate investing by allowing 
            individuals to co-own premium verified properties starting with small investments.
          </p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-24'>
          {stats.map((stat, i) => (
            <div key={i} className='bg-card border border-white/5 rounded-3xl p-8 text-center'>
              <div className='text-3xl font-bold text-white mb-2'>{stat.value}</div>
              <div className='text-xs text-white/30 uppercase tracking-widest'>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Our Mission */}
        <div className='grid lg:grid-cols-2 gap-16 items-center mb-32'>
          <div className='relative aspect-square rounded-[40px] overflow-hidden group'>
            <Image 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000" 
              alt="Our Office" 
              fill 
              className='object-cover grayscale hover:grayscale-0 transition-all duration-700'
            />
            <div className='absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent' />
          </div>
          <div className='space-y-8'>
            <h2 className='text-3xl md:text-4xl font-bold font-heading'>Our Mission</h2>
            <p className='text-white/40 text-lg'>
              To bridge the gap between small-scale investors and high-yield real estate 
              opportunities previously reserved for institutional investors. We use 
              technology to remove barriers to entry and provide a secure, transparent 
              liquidity layer for property assets.
            </p>
            <div className='space-y-6'>
              {values.map((v, i) => (
                <div key={i} className='flex gap-4 p-6 bg-white/2 border border-white/5 rounded-2xl hover:bg-white/5 transition-colors'>
                  <div className='w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0'>
                    <v.icon className='w-5 h-5 text-blue-400' />
                  </div>
                  <div>
                    <h4 className='font-bold text-white mb-1'>{v.title}</h4>
                    <p className='text-sm text-white/40'>{v.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Team */}
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold font-heading mb-4'>Meet Our Visionaries</h2>
          <p className='text-white/40 max-w-2xl mx-auto'>
            A diverse team of real estate experts, software engineers, and financial 
            strategists working together to redefine property ownership.
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='group'>
              <div className='relative aspect-3/4 rounded-3xl overflow-hidden mb-6'>
                <Image 
                  src={`https://images.unsplash.com/photo-${1500000000000 + i * 1000}?q=80&w=600`} 
                  alt="Team Member" 
                  fill 
                  className='object-cover group-hover:scale-105 transition-transform duration-500'
                />
              </div>
              <h4 className='text-xl font-bold'>Team Member Name {i}</h4>
              <p className='text-sm text-blue-400 uppercase tracking-widest mt-1'>Co-Founder & CEO</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
