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
  Info,
  MapPin,
  Send,
  ThumbsUp,
  TrendingUp,
  Users,
  Zap,
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
    images:
      propertyData?.images && propertyData.images.length > 0
        ? propertyData.images
        : [
            'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop',
          ],
    problemStatement: propertyData?.problemStatement,
    proposedSolution: propertyData?.proposedSolution,
    viewCount: propertyData?.viewCount || 0,
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
          <div className='max-w-xl mx-auto bg-card border border-border rounded-2xl p-6 text-center space-y-4'>
            <h1 className='text-2xl font-bold font-heading text-foreground'>
              Invalid Property Link
            </h1>
            <p className='text-muted-foreground'>
              This property URL is outdated. Please open a property from the
              list to continue.
            </p>
            <Link href='/properties'>
              <Button className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6'>
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
            <div className='h-8 w-1/3 rounded bg-muted' />
            <div className='h-64 w-full rounded-2xl bg-muted' />
            <div className='h-6 w-2/3 rounded bg-muted' />
            <div className='h-24 w-full rounded-xl bg-muted' />
          </div>
        </div>
      </div>
    );
  }

  if (isErrorProperty && !propertyData) {
    return (
      <div className='min-h-screen bg-background pt-24 pb-20'>
        <div className='container-custom'>
          <div className='max-w-xl mx-auto bg-card border border-border rounded-2xl p-6 text-center space-y-4'>
            <h1 className='text-2xl font-bold font-heading text-foreground'>
              Property Unavailable
            </h1>
            <p className='text-muted-foreground'>
              This property is either not published yet or not accessible to your account.
              Please check in Properties list or contact support.
            </p>
            <Link href='/properties'>
              <Button className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6'>
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
        <div className='detail-header flex items-center gap-2 text-sm text-muted-foreground mb-8'>
          <Link
            href='/properties'
            className='hover:text-foreground transition-colors flex items-center gap-1'
          >
            <ArrowLeft className='w-4 h-4' /> Properties
          </Link>
          <ChevronRight className='w-3 h-3' />
          <span className='text-foreground'>{renderText(property.title)}</span>
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
                <h1 className='text-3xl md:text-4xl font-bold font-heading text-foreground'>
                  {renderText(property.title)}
                </h1>
                <div className='flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-medium'>
                  <span className='flex items-center gap-1.5'>
                    <MapPin className='w-4 h-4 text-blue-500' />
                    {renderText(property.location)}
                  </span>
                  <span className='flex items-center gap-1.5'>
                    <Calendar className='w-4 h-4 text-blue-500' />
                    {property.duration}
                  </span>
                  <span className='flex items-center gap-1.5'>
                    <Users className='w-4 h-4 text-blue-500' />
                    {property.totalShares - property.availableShares} investors
                  </span>
                </div>
                <p className='text-muted-foreground leading-relaxed text-lg'>
                  {renderText(property.description)}
                </p>

                {(property.problemStatement || property.proposedSolution) && (
                  <div className='pt-6 border-t border-border/50 space-y-6'>
                    {property.problemStatement && (
                      <div className='space-y-2'>
                        <h4 className='text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2'>
                          <Info className='w-4 h-4 text-blue-500' />
                          Investment Thesis
                        </h4>
                        <p className='text-muted-foreground italic leading-relaxed'>
                          &quot;{renderText(property.problemStatement)}&quot;
                        </p>
                      </div>
                    )}
                    {property.proposedSolution && (
                      <div className='space-y-2'>
                        <h4 className='text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2'>
                          <Zap className='w-4 h-4 text-emerald-500' />
                          Proposed Solution
                        </h4>
                        <p className='text-muted-foreground leading-relaxed'>
                          {renderText(property.proposedSolution)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
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
                    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
                    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
                    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
                    amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
                  };
                  const c = colors[m.color] || colors.blue;
                  return (
                    <div
                      key={m.label}
                      className='bg-card border border-border rounded-2xl p-5 space-y-3'
                    >
                      <div className='flex items-center gap-2'>
                        <div
                          className={`w-9 h-9 rounded-xl ${c.split(' ')[1]} ${c.split(' ')[2]} border flex items-center justify-center`}
                        >
                          <Icon className={`w-4 h-4 ${c.split(' ')[0]}`} />
                        </div>
                      </div>
                      <p className='text-[10px] text-muted-foreground uppercase tracking-widest font-bold'>
                        {m.label}
                      </p>
                      <p className={`text-xl font-bold ${c.split(' ')[0]}`}>
                        {m.value}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Vote + Comments */}
              <div className='detail-section bg-card border border-border rounded-3xl p-8 shadow-sm'>
                <div className='flex items-center justify-between mb-8'>
                  <h3 className='text-xl font-bold text-foreground'>
                    Community Discussion ({property.comments.length})
                  </h3>
                  <button
                    onClick={() => {
                      if (!hasVoted && !myVote?.voteType) {
                        voteMutation.mutate();
                      }
                    }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      hasVoted || myVote?.voteType === 'UPVOTE'
                        ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                        : 'bg-muted text-muted-foreground border border-border hover:bg-muted/80'
                    }`}
                  >
                    <ThumbsUp
                      className={`w-4 h-4 ${hasVoted || myVote?.voteType === 'UPVOTE' ? 'fill-blue-500' : ''}`}
                    />
                    {voteCount}
                  </button>
                </div>

                {/* Comment Input */}
                <div className='flex gap-4 mb-8'>
                  <div className='w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-sm font-bold text-blue-500'>
                    {(user?.name || 'U').slice(0, 1).toUpperCase()}
                  </div>
                  <div className='flex-1 flex gap-3'>
                    <Input
                      placeholder='Share your thoughts on this property...'
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className='bg-background border-border rounded-xl h-14 pl-5 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-blue-500/30'
                    />
                    <Button
                      onClick={() => {
                        if (!commentText.trim()) return;
                        commentMutation.mutate(commentText.trim());
                      }}
                      className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-5 h-14 shrink-0 shadow-lg shadow-primary/20'
                    >
                      <Send className='w-5 h-5' />
                    </Button>
                  </div>
                </div>

                {/* Comments List */}
                <div className='space-y-6'>
                  {property.comments.map((c, index) => (
                    <div key={`${c.id}-${index}`} className='flex gap-4'>
                      <div className='w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 text-sm font-bold text-purple-500'>
                        {c.avatar}
                      </div>
                      <div className='flex-1 space-y-1.5'>
                        <div className='flex items-center gap-2'>
                          <span className='text-sm font-bold text-foreground'>
                            {renderText(c.user)}
                          </span>
                          <span className='text-[10px] text-muted-foreground uppercase tracking-widest font-bold'>
                            {c.date}
                          </span>
                        </div>
                        <p className='text-sm text-muted-foreground leading-relaxed'>
                         {renderText(c.text)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {property.comments.length === 0 && (
                    <div className='text-center py-8 border-2 border-dashed border-border rounded-2xl'>
                      <p className='text-sm text-muted-foreground'>Be the first to share your thoughts!</p>
                    </div>
                  )}
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
          <div className='detail-section mt-24 border-t border-border pt-16'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10'>
              <div>
                <h2 className='text-3xl font-bold font-heading text-foreground'>
                  Similar <span className='gradient-text'>Opportunities</span>
                </h2>
                <p className='text-muted-foreground mt-2'>Explore other investments in the {renderText(property.category)} category.</p>
              </div>
              <Link href={`/properties?categoryId=${propertyData?.categoryId || ''}`}>
                <Button variant="outline" className="border-border text-foreground hover:bg-accent rounded-xl px-6 py-6 h-auto">
                  View All Properties
                </Button>
              </Link>
            </div>
            <div className='grid md:grid-cols-3 gap-8'>
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
