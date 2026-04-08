'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import {
  api,
  getApiErrorMessage,
  normalizeItem,
  normalizeList,
  renderText,
} from '@/lib/api';
import { Comment, Property, VoteSummary } from '@/lib/api-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft,
  BarChart3,
  Building2,
  Calendar,
  ChevronRight,
  Clock,
  MapPin,
  Send,
  ThumbsUp,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { PropertySidebar } from '@/components/properties/PropertySidebar';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { PropertyGallery } from '@/components/properties/PropertyGallery';

gsap.registerPlugin(ScrollTrigger);

const demoProperty = {
  id: '1',
  title: 'Aurora Waterfront Residences',
  description:
    "A premium 32-story residential tower with panoramic river views, featuring 200 luxury apartments, rooftop infinity pool, and commercial spaces on the first three floors. Located in the heart of Gulshan, Dhaka's most prestigious neighborhood.",
  location: 'Gulshan Circle-2, Dhaka',
  category: 'Residential',
  status: 'active',
  isPaid: true,
  price: 50000,
  totalShares: 300,
  availableShares: 84,
  totalInvested: 10800000,
  targetAmount: 15000000,
  expectedReturn: '22%',
  minInvestment: '৳50,000',
  duration: '36 months',
  images: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop',
  ],
  votes: 245,
  views: 3420,
  comments: [
    {
      id: 1,
      user: 'Rahim Ahmed',
      text: 'Great location and solid returns. I invested 10 shares last month.',
      date: '2 days ago',
      avatar: 'R',
    },
    {
      id: 2,
      user: 'Fatima Hassan',
      text: 'The management team is very transparent. Regular updates on construction progress.',
      date: '5 days ago',
      avatar: 'F',
    },
    {
      id: 3,
      user: 'Karim Uddin',
      text: '22% return is excellent for this market segment. Definitely worth considering.',
      date: '1 week ago',
      avatar: 'K',
    },
  ],
  features: [
    'Panoramic River Views',
    'Rooftop Infinity Pool',
    '24/7 Security & Concierge',
    'Underground Parking',
    'Smart Home Technology',
    'High-Speed Elevators',
    'Commercial Spaces',
    'Landscaped Gardens',
  ],
  milestones: [
    { title: 'Land Acquisition', status: 'completed', date: 'Jan 2024' },
    { title: 'Foundation Work', status: 'completed', date: 'Apr 2024' },
    { title: 'Structure Complete', status: 'in-progress', date: 'Dec 2025' },
    { title: 'Interior Finishing', status: 'pending', date: 'Jun 2026' },
    { title: 'Handover', status: 'pending', date: 'Dec 2026' },
  ],
};

export default function PropertyDetailPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [commentText, setCommentText] = useState('');

  const propertyId = String(params.id);
  const isLegacyNumericPropertyId = /^\d+$/.test(propertyId);

  const {
    data: propertyData,
    isLoading: isLoadingProperty,
    isError: isErrorProperty,
  } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      try {
        const res = await api.get<{
          success: true;
          message: string;
          data: Property | { data?: Property };
        }>(`/properties/${propertyId}`);
        return normalizeItem<Property>(res.data.data);
      } catch (primaryError) {
        // fallback: if direct property fetch fails (auth/404), try load from list
        try {
          const listRes = await api.get<{
            success: true;
            message: string;
            data: Property[] | { data?: Property[] };
          }>('/properties', { params: { limit: 500 } });
          const allProperties = normalizeList<Property>(listRes.data.data);
          const fallback = allProperties.find((p) => String(p.id) === propertyId);
          if (fallback) return fallback;
        } catch {
          // ignore fallback error, rethrow primary below
        }
        throw primaryError;
      }
    },
    enabled: Boolean(propertyId) && !isLegacyNumericPropertyId,
  });

  const { data: voteSummary } = useQuery({
    queryKey: ['property-votes', propertyId],
    queryFn: async () => {
      const res = await api.get<{
        success: true;
        message: string;
        data: VoteSummary | { data?: VoteSummary };
      }>(`/votes/${propertyId}`);
      return normalizeItem<VoteSummary>(res.data.data);
    },
  });

  const { data: relatedProperties = [] } = useQuery({
    queryKey: ['related-properties', propertyData?.categoryId],
    queryFn: async () => {
      const res = await api.get<{
        success: true;
        message: string;
        data: Property[] | { data?: Property[] };
      }>('/properties?limit=3', {
        params: { categoryId: propertyData?.categoryId }
      });
      return normalizeList<Property>(res.data.data).filter(p => String(p.id) !== propertyId).slice(0, 3);
    },
    enabled: Boolean(propertyData?.categoryId),
  });

  const { data: myVote } = useQuery({
    queryKey: ['my-vote', propertyId],
    queryFn: async () => {
      const res = await api.get<{
        success: true;
        message: string;
        data: { voteType: 'UPVOTE' | 'DOWNVOTE' } | null;
      }>(`/votes/${propertyId}/my-vote`);
      if (res.data.data === null) {
        return null;
      }
      return normalizeItem<{ voteType: 'UPVOTE' | 'DOWNVOTE' }>(res.data.data);
    },
    retry: false,
  });

  const { data: hasInvested = false } = useQuery({
    queryKey: ['has-invested', propertyId],
    queryFn: async () => {
      const res = await api.get<{
        success: true;
        message: string;
        data: boolean;
      }>(`/investments/check/${propertyId}`);
      return res.data.data;
    },
    enabled: !!propertyId,
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['property-comments', propertyId],
    queryFn: async () => {
      const res = await api.get<{
        success: true;
        message: string;
        data: Comment[] | { data?: Comment[] };
      }>(`/comments/${propertyId}`);
      return normalizeList<Comment>(res.data.data);
    },
  });

  const voteMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/votes/${propertyId}`, { voteType: 'UPVOTE' });
    },
    onSuccess: async () => {
      setHasVoted(true);
      await queryClient.invalidateQueries({
        queryKey: ['property-votes', propertyId],
      });
      await queryClient.invalidateQueries({
        queryKey: ['my-vote', propertyId],
      });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      await api.post(`/comments/${propertyId}`, { content });
    },
    onSuccess: async () => {
      setCommentText('');
      toast.success('Comment added');
      await queryClient.invalidateQueries({
        queryKey: ['property-comments', propertyId],
      });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const property = {
    ...demoProperty,
    ...propertyData,
    // Always keep the route id as source of truth for navigation/actions.
    id: propertyId,
    title: propertyData?.title || demoProperty.title,
    description: propertyData?.description || demoProperty.description,
    location: propertyData?.location || demoProperty.location,
    category: propertyData?.category?.name || demoProperty.category,
    price: propertyData?.pricePerShare || demoProperty.price,
    totalShares: propertyData?.totalShares || demoProperty.totalShares,
    availableShares:
      propertyData?.availableShares ?? demoProperty.availableShares,
    expectedReturn: propertyData?.expectedReturn
      ? `${propertyData.expectedReturn}%`
      : demoProperty.expectedReturn,
    images: propertyData?.images?.length
      ? propertyData.images
      : demoProperty.images,
    comments:
      comments.length > 0
        ? comments.map((c, index) => ({
            id: c.id || `comment-${index}`,
            user: c.user?.name || 'User',
            text: c.content,
            date: new Date(c.createdAt).toLocaleDateString(),
            avatar: (c.user?.name || 'U').slice(0, 1).toUpperCase(),
          }))
        : [],
  };

  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.detail-header',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.detail-gallery',
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
      );
      gsap.fromTo(
        '.detail-sidebar',
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 }
      );
      gsap.fromTo(
        '.detail-section',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.detail-content', start: 'top 80%' },
        }
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const fundingProgress = Math.round(
    (((property.totalShares - property.availableShares) * property.price) /
      (property.totalShares * property.price)) *
      100
  );

  const fallbackVotes =
    typeof property.votes === 'number'
      ? property.votes
      : (property.votes?.total ?? 0);
  const voteCount = voteSummary?.total ?? fallbackVotes;

  if (isLegacyNumericPropertyId) {
    return (
      <div className='min-h-screen bg-background pt-24 pb-20'>
        <div className='container-custom'>
          <div className='max-w-xl mx-auto bg-white/2 border border-white/10 rounded-2xl p-6 text-center space-y-4'>
            <h1 className='text-2xl font-bold font-heading'>
              Invalid Property Link
            </h1>
            <p className='text-white/50'>
              This property URL is outdated. Please open a property from the
              list to continue.
            </p>
            <Link href='/properties'>
              <Button className='bg-white/10 hover:bg-white/15 text-white rounded-xl px-6'>
                Browse Properties
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingProperty) {
    return (
      <div className='min-h-screen bg-background pt-24 pb-20'>
        <div className='container-custom'>
          <div className='space-y-4 animate-pulse'>
            <div className='h-8 w-1/3 rounded bg-white/[0.07]' />
            <div className='h-64 w-full rounded-2xl bg-white/5' />
            <div className='h-6 w-2/3 rounded bg-white/6' />
            <div className='h-24 w-full rounded-xl bg-white/5' />
          </div>
        </div>
      </div>
    );
  }

  if (isErrorProperty && !propertyData) {
    return (
      <div className='min-h-screen bg-background pt-24 pb-20'>
        <div className='container-custom'>
          <div className='max-w-xl mx-auto bg-white/2 border border-white/10 rounded-2xl p-6 text-center space-y-4'>
            <h1 className='text-2xl font-bold font-heading'>
              Property Unavailable
            </h1>
            <p className='text-white/50'>
              This property is either not published yet or not accessible to your account.
              Please check in Properties list or contact support.
            </p>
            <Link href='/properties'>
              <Button className='bg-white/10 hover:bg-white/15 text-white rounded-xl px-6'>
                Back to Properties
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className='min-h-screen bg-background pt-24 pb-20'>
      <div className='container-custom'>
        {/* Back + Breadcrumb */}
        <div className='detail-header flex items-center gap-2 text-sm text-white/40 mb-8'>
          <Link
            href='/properties'
            className='hover:text-white/60 transition-colors flex items-center gap-1'
          >
            <ArrowLeft className='w-4 h-4' /> Properties
          </Link>
          <ChevronRight className='w-3 h-3' />
          <span className='text-white/60'>{renderText(property.title)}</span>
        </div>

        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Gallery */}
            <PropertyGallery
              property={property}
              viewCount={voteCount}
              isLiked={isLiked}
              setIsLiked={setIsLiked}
              activeImage={activeImage}
              setActiveImage={setActiveImage}
            />

            <div className='detail-content space-y-8'>
              {/* Title + Meta */}
              <div className='detail-section space-y-4'>
                <h1 className='text-3xl md:text-4xl font-bold font-heading'>
                  {renderText(property.title)}
                </h1>
                <div className='flex flex-wrap items-center gap-4 text-sm text-white/40'>
                  <span className='flex items-center gap-1'>
                    <MapPin className='w-4 h-4' />
                    {renderText(property.location)}
                  </span>
                  <span className='flex items-center gap-1'>
                    <Calendar className='w-4 h-4' />
                    {property.duration}
                  </span>
                  <span className='flex items-center gap-1'>
                    <Users className='w-4 h-4' />
                    {property.totalShares - property.availableShares} investors
                  </span>
                </div>
                <p className='text-white/50 leading-relaxed'>
                  {renderText(property.description)}
                </p>
              </div>

              {/* Key Metrics */}
              <div className='detail-section grid grid-cols-2 md:grid-cols-4 gap-3'>
                {[
                  {
                    label: 'Expected Return',
                    value: property.expectedReturn,
                    icon: TrendingUp,
                    color: 'emerald',
                  },
                  {
                    label: 'Share Price',
                    value: `৳${property.price.toLocaleString()}`,
                    icon: BarChart3,
                    color: 'blue',
                  },
                  {
                    label: 'Available',
                    value: `${property.availableShares} shares`,
                    icon: Building2,
                    color: 'purple',
                  },
                  {
                    label: 'Duration',
                    value: property.duration,
                    icon: Clock,
                    color: 'amber',
                  },
                ].map((m) => {
                  const Icon = m.icon;
                  const colors: Record<string, string> = {
                    emerald: 'text-emerald-400 bg-emerald-500/10',
                    blue: 'text-blue-400 bg-blue-500/10',
                    purple: 'text-purple-400 bg-purple-500/10',
                    amber: 'text-amber-400 bg-amber-500/10',
                  };
                  const c = colors[m.color] || colors.blue;
                  return (
                    <div
                      key={m.label}
                      className='bg-white/2 border border-white/5 rounded-2xl p-4 space-y-2'
                    >
                      <div className='flex items-center gap-2'>
                        <div
                          className={`w-8 h-8 rounded-lg ${c.split(' ')[1]} flex items-center justify-center`}
                        >
                          <Icon className={`w-4 h-4 ${c.split(' ')[0]}`} />
                        </div>
                      </div>
                      <p className='text-xs text-white/30 uppercase tracking-wider'>
                        {m.label}
                      </p>
                      <p className={`text-lg font-bold ${c.split(' ')[0]}`}>
                        {m.value}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Vote + Comments */}
              <div className='detail-section bg-white/2 border border-white/5 rounded-3xl p-8'>
                <div className='flex items-center justify-between mb-6'>
                  <h3 className='text-lg font-bold'>
                    Community ({property.comments.length})
                  </h3>
                  <button
                    onClick={() => {
                      if (!hasVoted && !myVote?.voteType) {
                        voteMutation.mutate();
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      hasVoted || myVote?.voteType === 'UPVOTE'
                        ? 'bg-white/5 text-white border border-white/10'
                        : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <ThumbsUp
                      className={`w-4 h-4 ${hasVoted || myVote?.voteType === 'UPVOTE' ? 'fill-blue-400' : ''}`}
                    />
                    {voteCount}
                  </button>
                </div>

                {/* Comment Input */}
                <div className='flex gap-3 mb-6'>
                  <div className='w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 text-sm font-bold text-white'>
                    {(user?.name || 'U').slice(0, 1).toUpperCase()}
                  </div>
                  <div className='flex-1 flex gap-2'>
                    <Input
                      placeholder='Share your thoughts on this property...'
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className='bg-white/5 border-white/10 rounded-xl py-5 text-white placeholder:text-white/20 focus-visible:ring-blue-500/30'
                    />
                    <Button
                      onClick={() => {
                        if (!commentText.trim()) return;
                        commentMutation.mutate(commentText.trim());
                      }}
                      className='bg-white/10 hover:bg-white/15 text-white rounded-xl px-4 shrink-0'
                    >
                      <Send className='w-4 h-4' />
                    </Button>
                  </div>
                </div>

                {/* Comments List */}
                <div className='space-y-4'>
                  {property.comments.map((c, index) => (
                    <div key={`${c.id}-${index}`} className='flex gap-3'>
                      <div className='w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 text-sm font-bold text-purple-400'>
                        {c.avatar}
                      </div>
                      <div className='flex-1 space-y-1'>
                        <div className='flex items-center gap-2'>
                          <span className='text-sm font-semibold text-white'>
                            {renderText(c.user)}
                          </span>
                          <span className='text-xs text-white/30'>
                            {c.date}
                          </span>
                        </div>
                        <p className='text-sm text-white/50'>
                         {renderText(c.text)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <PropertySidebar
            propertyId={propertyId}
            hasInvested={hasInvested}
            price={property.price}
            expectedReturn={property.expectedReturn}
            totalShares={property.totalShares}
            availableShares={property.availableShares}
            fundingProgress={fundingProgress}
            isPropertyOwner={Boolean(
              user && propertyData?.author?.id && user.id === propertyData.author.id
            )}
          />
        </div>

        {/* Related Properties */}
        {relatedProperties.length > 0 && (
          <div className='detail-section mt-24 border-t border-white/5 pt-16'>
            <div className='flex items-center justify-between mb-8'>
              <div>
                <h2 className='text-3xl font-bold font-heading'>
                  Similar <span className='gradient-text'>Opportunities</span>
                </h2>
                <p className='text-white/40 mt-2'>Explore other investments in the {renderText(property.category)} category.</p>
              </div>
              <Link href={`/properties?categoryId=${propertyData?.categoryId || ''}`}>
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-xl">
                  View All
                </Button>
              </Link>
            </div>
            <div className='grid md:grid-cols-3 gap-6'>
              {relatedProperties.map(p => (
                <PropertyCard key={p.id} property={p} viewMode="grid" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
