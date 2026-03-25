"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import gsap from "gsap";

const blogPosts = [
    { id: 1, title: "How Fractional Ownership is Changing Real Estate in Bangladesh", excerpt: "Commercial real estate was once reserved for high-net-worth individuals. Today, digitalization is opening doors for every investor with as little as ৳50,000.", category: "Market Trends", author: "Zahur Ahmed", date: "Mar 12, 2026", readTime: "8 min read", image: "https://images.unsplash.com/photo-1460472178825-e51c8623f418?q=80&w=1200&auto=format&fit=crop" },
    { id: 2, title: "Understanding ROI: Projecting Returns on Commercial Spaces", excerpt: "A guide to calculating potential yields, understanding risk factors, and why Gulshan-Banani remains a top investment zone.", category: "Guides", author: "Karim Chowdhury", date: "Mar 5, 2026", readTime: "12 min read", image: "https://images.unsplash.com/photo-1554224155-16964312f055?q=80&w=1200&auto=format&fit=crop" },
    { id: 3, title: "5 Red Flags to Watch for Before Buying Property Shares", excerpt: "Every investment has risks. Learn what to look for in verification documents and how PropShare's protocol protects our members.", category: "Resources", author: "Tasnim Rahman", date: "Feb 20, 2026", readTime: "10 min read", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop" },
    { id: 4, title: "The Future of Smart Buildings and Their Investment Value", excerpt: "How IoT, energy efficiency, and smart infrastructure are driving up rental yields in modern Dhaka offices.", category: "Innovation", author: "Zahur Ahmed", date: "Feb 15, 2026", readTime: "6 min read", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop" },
];

export default function BlogPage() {
    const pageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!pageRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(".blog-header", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
            gsap.fromTo(".blog-card", { opacity: 0, y: 40 }, { 
                opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out", 
                scrollTrigger: { trigger: ".blog-grid", start: "top 80%" } 
            });
        }, pageRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={pageRef} className="min-h-screen bg-[#0a0f1d] pt-28 pb-32 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[200px]" />
            <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-emerald-600/5 blur-[200px]" />

            <div className="container-custom relative z-10">
                {/* Header */}
                <div className="blog-header max-w-3xl space-y-4 mb-20 text-center mx-auto">
                    <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 py-1.5 px-4 mb-2">RESOURCES & INSIGHTS</Badge>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading">
                        Insights for the Modern <span className="gradient-text">Investor</span>
                    </h1>
                    <p className="text-lg text-white/40 leading-relaxed font-sans">
                        Stay informed about market trends, investment strategies, and the evolution of real estate in Bangladesh.
                    </p>
                </div>

                {/* Filter / Search Bar */}
                <div className="blog-header grid md:grid-cols-12 gap-4 mb-14 bg-white/[0.02] border border-white/5 p-4 rounded-3xl">
                    <div className="md:col-span-8 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <Input 
                            placeholder="Search articles, guides, or market reports..." 
                            className="bg-white/5 border-white/10 rounded-2xl pl-12 py-6 text-white placeholder:text-white/20 focus-visible:ring-blue-500/30" 
                        />
                    </div>
                    <div className="md:col-span-4 flex gap-2">
                        <select className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 text-white text-sm focus:ring-2 focus:ring-blue-500/30 outline-none appearance-none cursor-pointer">
                            <option value="all" className="bg-[#151c2e]">All Categories</option>
                            <option value="trends" className="bg-[#151c2e]">Market Trends</option>
                            <option value="guides" className="bg-[#151c2e]">Guides</option>
                            <option value="resources" className="bg-[#151c2e]">Resources</option>
                        </select>
                        <Button variant="outline" className="h-14 border-white/10 text-white hover:bg-white/5 px-6 rounded-2xl"><Filter className="w-4 h-4" /></Button>
                    </div>
                </div>

                {/* Featured Post */}
                <div className="blog-card grid lg:grid-cols-2 gap-8 mb-20 bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden group">
                    <div className="relative aspect-video lg:aspect-auto min-h-[350px]">
                        <Image src={blogPosts[0].image} fill alt={blogPosts[0].title} className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute top-6 left-6 flex gap-2">
                            <Badge className="bg-blue-600 text-white border-none py-1.5 px-3 uppercase tracking-widest text-[10px] h-6 flex items-center font-bold">LATEST</Badge>
                        </div>
                    </div>
                    <div className="p-8 lg:p-12 flex flex-col justify-center space-y-6">
                        <div className="flex items-center gap-3 text-xs text-white/40">
                            <span className="text-blue-400 font-bold uppercase tracking-widest">{blogPosts[0].category}</span>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span>{blogPosts[0].date}</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold font-heading group-hover:text-blue-400 transition-colors leading-tight">
                            {blogPosts[0].title}
                        </h2>
                        <p className="text-white/50 text-base leading-relaxed line-clamp-3">
                            {blogPosts[0].excerpt}
                        </p>
                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-blue-500/20">ZA</div>
                                <div><p className="text-sm font-bold text-white">{blogPosts[0].author}</p><p className="text-[10px] text-white/30">{blogPosts[0].readTime}</p></div>
                            </div>
                            <Button className="bg-transparent hover:bg-blue-600/10 text-blue-400 border border-blue-500/20 px-6 py-5 rounded-2xl transition-all group/btn h-auto">
                                Read More <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Blog Grid */}
                <div className="blog-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.slice(1).map((post) => (
                        <div key={post.id} className="blog-card group">
                            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white/5 border border-white/5 mb-6">
                                <Image src={post.image} fill alt={post.title} className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute top-4 left-4">
                                    <Badge className="bg-[#0a0f1d]/60 backdrop-blur-xl text-white/80 border border-white/10 text-[10px] py-1 px-3">{post.category}</Badge>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-[11px] text-white/30 uppercase tracking-widest font-bold">
                                    <span>{post.date}</span>
                                    <span className="w-1 h-1 rounded-full bg-white/20" />
                                    <span>{post.readTime}</span>
                                </div>
                                <h3 className="text-xl font-bold font-heading line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-sm text-white/40 leading-relaxed line-clamp-2">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center justify-between pt-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-[10px] font-bold text-blue-400">ZA</div>
                                        <p className="text-xs font-bold text-white/60">{post.author}</p>
                                    </div>
                                    <Link href={`/blog/${post.id}`} className="text-xs text-blue-400 font-bold flex items-center gap-2 hover:text-blue-300 transition-colors">
                                        READ <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Placeholder */}
                <div className="mt-20 flex justify-center">
                    <Button variant="outline" className="border-white/10 text-white/40 hover:text-white hover:bg-white/5 py-6 px-10 rounded-2xl h-auto">
                        Load More Articles
                    </Button>
                </div>
            </div>
        </div>
    );
}
