'use client';

import { Sparkles, Calendar, User, ArrowRight, Rss, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const blogPosts = [
  {
    id: 1,
    title: 'Why Fractional Real Estate is the Future of Wealth Building',
    excerpt: 'Traditional property investment used to require millions. Now, fractional ownership is changing the game for everyday investors...',
    author: 'Ahmed Raihan',
    date: 'April 5, 2026',
    readTime: '6 min read',
    category: 'Investing 101',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800',
  },
  {
    id: 2,
    title: 'Dhaka Real Estate Trends: What to Expect in Late 2026',
    excerpt: 'As urbanization expands towards areas like Purbachal and Bashundhara, we analyze the upcoming price surges and rental yield trends...',
    author: 'Sarah Islam',
    date: 'March 28, 2026',
    readTime: '8 min read',
    category: 'Market Trends',
    image: '/images/blog/dhaka_real_estate_trends_1775656000469.png',
  },
  {
    id: 3,
    title: '5 Tips for Selecting Your First Fractional Property',
    excerpt: 'Not all properties are created equal. Learn the key metadata indicators—location potential, developer track record, and return stats...',
    author: 'Tanvir Hossain',
    date: 'March 15, 2026',
    readTime: '5 min read',
    category: 'Guides',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800',
  },
  {
    id: 4,
    title: 'The Role of AI in Real Estate Valuation',
    excerpt: 'How machine learning algorithms are providing more accurate property assessments and predictive analytics for investors...',
    author: 'AI Insights Bot',
    date: 'March 10, 2026',
    readTime: '4 min read',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800',
  },
];

export default function BlogPage() {
  return (
    <div className='min-h-screen bg-background pt-32 pb-20'>
      <div className='container-custom'>
        {/* Header */}
        <div className='flex flex-wrap justify-between items-end gap-6 mb-16'>
          <div className='max-w-2xl'>
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6'>
              <Rss className='w-3 h-3 text-blue-400' />
              <span className='text-xs font-medium text-blue-400 uppercase tracking-wider'>Industry Insights</span>
            </div>
            <h1 className='text-4xl md:text-5xl font-bold font-heading mb-6'>
              Our <span className='gradient-text'>Blog</span> & News
            </h1>
            <p className='text-white/40 text-lg'>
              Stay updated with the latest trends, guides, and investment strategies in the Bangladeshi real estate market.
            </p>
          </div>
        </div>

        {/* Featured Post */}
        <div className='mb-20'>
          <Link href={`/blog/${blogPosts[0].id}`} className='group block relative rounded-[40px] overflow-hidden bg-card border border-white/5'>
            <div className='grid lg:grid-cols-2'>
              <div className='relative aspect-16/10 lg:aspect-auto overflow-hidden'>
                <Image 
                  src={blogPosts[0].image} 
                  alt={blogPosts[0].title} 
                  fill 
                  className='object-cover group-hover:scale-105 transition-transform duration-700'
                />
                <div className='absolute inset-0 bg-linear-to-r from-card via-transparent to-transparent hidden lg:block' />
              </div>
              <div className='p-8 md:p-12 lg:p-16 flex flex-col justify-center space-y-6'>
                <div className='flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-blue-400'>
                  <span className='px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20'>{blogPosts[0].category}</span>
                  <span className='flex items-center gap-1'><Clock className='w-3 h-3' />{blogPosts[0].readTime}</span>
                </div>
                <h2 className='text-3xl md:text-4xl font-bold font-heading group-hover:text-blue-400 transition-colors'>
                  {blogPosts[0].title}
                </h2>
                <p className='text-white/40 text-lg leading-relaxed'>
                  {blogPosts[0].excerpt}
                </p>
                <div className='flex items-center gap-3 pt-4 border-t border-white/5'>
                  <div className='w-10 h-10 rounded-full bg-white/5 flex items-center justify-center'>
                    <User className='w-5 h-5 text-white/40' />
                  </div>
                  <div>
                    <p className='text-sm font-bold text-white'>{blogPosts[0].author}</p>
                    <p className='text-[10px] text-white/30 uppercase'>{blogPosts[0].date}</p>
                  </div>
                  <div className='ml-auto'>
                    <div className='w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-300'>
                      <ArrowRight className='w-5 h-5 text-white' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Blog Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {blogPosts.slice(1).map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`} className='group bg-card border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-all duration-300 flex flex-col'>
              <div className='relative aspect-16/10 overflow-hidden'>
                <Image 
                  src={post.image} 
                  alt={post.title} 
                  fill 
                  className='object-cover group-hover:scale-105 transition-transform duration-700'
                />
                <div className='absolute top-4 left-4'>
                  <span className='px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-white border border-white/10'>
                    {post.category}
                  </span>
                </div>
              </div>
              <div className='p-6 space-y-4 flex-1 flex flex-col'>
                <div className='flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/30'>
                  <span className='flex items-center gap-1'><Calendar className='w-3 h-3' />{post.date}</span>
                  <span className='flex items-center gap-1'><Clock className='w-3 h-3' />{post.readTime}</span>
                </div>
                <h3 className='text-xl font-bold font-heading line-clamp-2 group-hover:text-blue-400 transition-colors'>
                  {post.title}
                </h3>
                <p className='text-white/40 text-sm line-clamp-3 leading-relaxed flex-1'>
                  {post.excerpt}
                </p>
                <div className='pt-6 border-t border-white/5 flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='w-6 h-6 rounded-full bg-white/10' />
                    <span className='text-xs font-medium text-white/60'>{post.author}</span>
                  </div>
                  <div className='text-blue-400 group-hover:translate-x-1 transition-transform'>
                    <ArrowRight className='w-5 h-5' />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className='mt-24 p-12 bg-linear-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/10 rounded-[40px] text-center space-y-6'>
          <h2 className='text-2xl md:text-3xl font-bold font-heading'>Subscribe to Our Newsletter</h2>
          <p className='text-white/40 max-w-xl mx-auto'>
            Get the latest real estate deals and industry insights delivered straight to your inbox.
          </p>
          <div className='flex flex-col sm:flex-row gap-3 max-w-md mx-auto'>
            <input 
              placeholder="Your email address" 
              className='flex-1 bg-white/5 border border-white/10 rounded-xl px-5 h-12 text-sm focus:border-blue-500/50 outline-none'
            />
            <button className='h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all'>
              Join Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
