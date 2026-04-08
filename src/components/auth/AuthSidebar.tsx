import { Building2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface AuthSidebarProps {
  titleStart: string;
  titleHighlight: string;
  subtitle: string;
  benefits: {
    icon: React.ElementType;
    text: string;
    iconColorClass?: string;
    iconBgClass?: string;
  }[];
}

export function AuthSidebar({
  titleStart,
  titleHighlight,
  subtitle,
  benefits,
}: AuthSidebarProps) {
  return (
    <div className='auth-left hidden lg:flex flex-col justify-center pr-16 space-y-8'>
      <Link href='/' className='flex items-center gap-3'>
        <div className='w-12 h-12 rounded-xl bg-linear-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/20'>
          <Building2 className='w-6 h-6 text-white' />
        </div>
        <div className='flex flex-col'>
          <span className='text-xl font-bold tracking-tight font-heading text-foreground'>
            Prop<span className='text-blue-500'>Share</span>
          </span>
          <span className='text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60 -mt-0.5'>
            Protocol
          </span>
        </div>
      </Link>

      <div className='space-y-4'>
        <h1 className='text-4xl lg:text-5xl font-bold font-heading leading-tight text-foreground'>
          {titleStart} <span className='gradient-text'>{titleHighlight}</span>
        </h1>
        <p className='text-muted-foreground text-lg leading-relaxed max-w-md'>
          {subtitle}
        </p>
      </div>

      <div className='space-y-4 pt-4'>
        {benefits.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.text} className='flex items-center gap-3'>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  item.iconBgClass || 'bg-emerald-500/10 border border-emerald-500/20'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${item.iconColorClass || 'text-emerald-500'}`}
                />
              </div>
              <span className='text-sm text-muted-foreground'>{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
