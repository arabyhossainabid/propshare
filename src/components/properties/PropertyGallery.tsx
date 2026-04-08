import { Badge } from '@/components/ui/badge';
import { Eye, Heart, Lock, Share2, Unlock } from 'lucide-react';
import Image from 'next/image';

interface PropertyGalleryProps {
  property: {
    images: string[];
    title: string;
    category: string;
    isPaid?: boolean;
  };
  viewCount: number;
  isLiked: boolean;
  setIsLiked: (val: boolean) => void;
  activeImage: number;
  setActiveImage: (idx: number) => void;
}

export function PropertyGallery({
  property,
  viewCount,
  isLiked,
  setIsLiked,
  activeImage,
  setActiveImage,
}: PropertyGalleryProps) {
  return (
    <div className='detail-gallery space-y-3'>
      <div className='relative aspect-video rounded-3xl overflow-hidden shadow-2xl'>
        <Image
          src={property.images[activeImage]}
          alt={property.title}
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent' />
        {/* Actions */}
        <div className='absolute top-4 right-4 flex gap-2'>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`w-10 h-10 rounded-xl backdrop-blur-xl flex items-center justify-center transition-all ${
              isLiked
                ? 'bg-red-500/20 border border-red-500/30'
                : 'bg-black/20 border border-white/10 hover:bg-black/40'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${
                isLiked ? 'text-red-400 fill-red-400' : 'text-white'
              }`}
            />
          </button>
          <button className='w-10 h-10 rounded-xl bg-black/20 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-black/40 transition-all'>
            <Share2 className='w-4 h-4 text-white' />
          </button>
        </div>
        {/* Status Badges */}
        <div className='absolute top-4 left-4 flex gap-2'>
          <Badge className='bg-blue-500/20 text-blue-400 border border-blue-500/30 backdrop-blur-md uppercase tracking-widest text-[10px] h-7 px-3'>
            {property.category}
          </Badge>
          <Badge
            className={`backdrop-blur-md uppercase tracking-widest text-[10px] h-7 px-3 border ${
              property.isPaid
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30'
            }`}
          >
            {property.isPaid ? (
              <>
                <Lock className='w-3 h-3 mr-1.5' /> Premium
              </>
            ) : (
              <>
                <Unlock className='w-3 h-3 mr-1.5' /> Public
              </>
            )}
          </Badge>
        </div>
        {/* View count */}
        <div className='absolute bottom-4 left-6 flex items-center gap-2 text-sm text-white font-medium'>
          <Eye className='w-4 h-4' /> {viewCount.toLocaleString()} <span className="opacity-80">views</span>
        </div>
      </div>
      {/* Thumbnails */}
      <div className='flex gap-3'>
        {property.images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveImage(i)}
            className={`relative w-24 h-16 rounded-xl overflow-hidden transition-all ${
              activeImage === i
                ? 'ring-2 ring-blue-500 opacity-100'
                : 'opacity-50 hover:opacity-75'
            }`}
          >
            <Image src={img} alt={`View ${i + 1}`} fill className='object-cover' />
          </button>
        ))}
      </div>
    </div>
  );
}
