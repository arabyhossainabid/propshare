import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api, normalizeList, renderText } from '@/lib/api';
import { Property } from '@/lib/api-types';
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Eye,
  MapPin,
  Share2,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const fallbackImage =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop';

interface PropertyCardProps {
  property: Property;
  viewMode?: 'grid' | 'list';
}

export function PropertyCard({ property, viewMode = 'grid' }: PropertyCardProps) {
  const fundedPercentage = (p: Property) => {
    const available = p.availableShares ?? p.totalShares;
    return Math.round(((p.totalShares - available) / p.totalShares) * 100);
  };

  if (viewMode === 'list') {
    return (
      <Link
        href={`/properties/${property.id}`}
        className='prop-card group cursor-pointer'
      >
        <div className='bg-card rounded-2xl border border-border overflow-hidden hover:border-border/60 transition-all duration-500 flex flex-col md:flex-row'>
          <div className='relative w-full md:w-72 aspect-16/10 md:aspect-auto overflow-hidden shrink-0'>
            <Image
              src={property.images?.[0] || fallbackImage}
              alt={property.title}
              fill
              className='object-cover group-hover:scale-105 transition-transform duration-700'
            />
            <div className='absolute top-3 left-3'>
              <Badge className='bg-black/50 backdrop-blur-xl text-white border-white/10 text-xs'>
                {renderText(property.category?.name) || 'Property'}
              </Badge>
            </div>
          </div>
          <div className='flex-1 p-6 flex flex-col justify-between gap-4'>
            <div>
              <h3 className='text-lg font-bold text-foreground group-hover:text-blue-500 transition-colors'>
                {renderText(property.title)}
              </h3>
              <p className='text-sm text-muted-foreground flex items-center gap-1.5 mt-1'>
                <MapPin className='w-3.5 h-3.5' />
                {renderText(property.location)}
              </p>
            </div>
            <div className='flex flex-wrap items-center gap-6'>
              <div>
                <p className='text-[10px] text-muted-foreground/60 uppercase tracking-wider'>
                  Value
                </p>
                <p className='text-sm font-bold text-foreground'>
                  ৳
                  {(
                    (property.pricePerShare * property.totalShares) /
                    100000
                  ).toFixed(0)}
                  L
                </p>
              </div>
              <div>
                <p className='text-[10px] text-muted-foreground/60 uppercase tracking-wider'>
                  Min. Investment
                </p>
                <p className='text-sm font-bold text-blue-500'>
                  ৳{property.pricePerShare.toLocaleString()}
                </p>
              </div>
              <div>
                <p className='text-[10px] text-muted-foreground/60 uppercase tracking-wider'>
                  Funded
                </p>
                <p className='text-sm font-bold text-emerald-500'>
                  {fundedPercentage(property)}%
                </p>
              </div>
              <div className='ml-auto'>
                <Button className='bg-secondary hover:bg-secondary/80 text-foreground rounded-xl transition-all duration-300'>
                  Invest Now
                  <ArrowUpRight className='w-4 h-4 ml-2' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/properties/${property.id}`}
      className='prop-card property-card group cursor-pointer'
    >
      <div className='bg-card rounded-3xl border border-border overflow-hidden hover:border-border/60 hover:shadow-2xl transition-all duration-700 h-full'>
        <div className='relative aspect-16/10 overflow-hidden'>
          <Image
            src={property.images?.[0] || fallbackImage}
            alt={property.title}
            fill
            className='object-cover group-hover:scale-105 transition-transform duration-700'
          />
          <div className='absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60' />
          
          <div className='absolute top-4 left-4 right-4 flex items-center justify-between'>
            <div className='flex gap-2'>
              <Badge className='bg-black/50 backdrop-blur-xl text-white border-white/10 text-xs'>
                {renderText(property.category?.name) || 'Property'}
              </Badge>
              {property.isFeatured && (
                <Badge className='bg-amber-500/20 text-amber-500 border-amber-500/30 text-xs'>
                  <Sparkles className='w-3 h-3 mr-1' />
                  Featured
                </Badge>
              )}
            </div>
            <div className='flex gap-2'>
              <button className='w-8 h-8 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors'>
                <Share2 className='w-3.5 h-3.5 text-white' />
              </button>
            </div>
          </div>
          <div className='absolute bottom-4 left-4'>
            <Badge className='bg-emerald-500/20 text-emerald-500 border-emerald-500/30'>
              <TrendingUp className='w-3 h-3 mr-1' />
              High Yield
            </Badge>
          </div>
        </div>
        <div className='p-6 space-y-4'>
          <div className="min-h-[140px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">
                {property.category?.name || 'Asset'}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(property.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            </div>
            <h3 className='text-lg font-bold text-foreground group-hover:text-blue-500 transition-colors duration-300 line-clamp-1'>
              {renderText(property.title)}
            </h3>
            <p className='text-sm text-muted-foreground flex items-center gap-1.5 mt-1.5'>
              <MapPin className='w-3.5 h-3.5 text-blue-500/50' />
              {renderText(property.location)}
            </p>
            <p className="text-xs text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
              {renderText(property.description) || 'A premium institutional-grade investment opportunity in a prime location with high growth potential.'}
            </p>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div className='bg-muted/30 rounded-2xl p-4 border border-border/50'>
              <p className='text-[9px] text-muted-foreground uppercase tracking-widest font-black'>
                Value
              </p>
              <p className='text-sm font-black text-foreground mt-1'>
                ৳
                {(
                  (property.pricePerShare * property.totalShares) /
                  10000000
                ).toFixed(1)}
                Cr
              </p>
            </div>
            <div className='bg-muted/30 rounded-2xl p-4 border border-border/50'>
              <p className='text-[9px] text-muted-foreground uppercase tracking-widest font-black'>
                Min. Invest
              </p>
              <p className='text-sm font-black text-blue-500 mt-1'>
                ৳{property.pricePerShare.toLocaleString()}
              </p>
            </div>
          </div>

          <div className='space-y-2.5'>
            <div className='flex items-center justify-between text-[11px] font-bold uppercase tracking-tight'>
              <span className='text-muted-foreground'>Funding Status</span>
              <span className='text-emerald-500'>
                {fundedPercentage(property)}% Complete
              </span>
            </div>
            <div className='w-full bg-muted rounded-full h-1.5 overflow-hidden'>
              <div
                className='bg-linear-to-r from-blue-600 to-emerald-400 h-1.5 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                style={{ width: `${fundedPercentage(property)}%` }}
              />
            </div>
            <div className='flex items-center justify-between text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest pt-1'>
              <span className="flex items-center gap-1.5">
                <Users className="w-3 h-3" />
                {property.totalShares - (property.availableShares ?? property.totalShares)} Backers
              </span>
              <span className='flex items-center gap-3'>
                <span className="flex items-center gap-1">
                  <Eye className='w-3 h-3' />
                  {property.viewCount || 0}
                </span>
                <span className="flex items-center gap-1">
                  <ArrowUpRight className='w-3 h-3 text-emerald-500' />
                  {(property as any)._count?.votes ?? 0}
                </span>
              </span>
            </div>
          </div>
          
          <Button className='w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-6 transition-all duration-300 group/btn shadow-xl shadow-blue-500/20 border-0 text-xs font-black uppercase tracking-widest'>
            View Details
            <ArrowRight className='w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform' />
          </Button>
        </div>
      </div>
    </Link>
  );
}
