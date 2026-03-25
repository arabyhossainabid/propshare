"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    MapPin,
    TrendingUp,
    Users,
    Calendar,
    Heart,
    Share2,
    Star,
    MessageSquare,
    ThumbsUp,
    Eye,
    Shield,
    Clock,
    BarChart3,
    Building2,
    ArrowRight,
    ChevronRight,
    Lock,
    Unlock,
    Send,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const demoProperty = {
    id: "1",
    title: "Aurora Waterfront Residences",
    description:
        "A premium 32-story residential tower with panoramic river views, featuring 200 luxury apartments, rooftop infinity pool, and commercial spaces on the first three floors. Located in the heart of Gulshan, Dhaka's most prestigious neighborhood.",
    location: "Gulshan Circle-2, Dhaka",
    category: "Residential",
    status: "active",
    isPaid: true,
    price: 50000,
    totalShares: 300,
    availableShares: 84,
    totalInvested: 10800000,
    targetAmount: 15000000,
    expectedReturn: "22%",
    minInvestment: "৳50,000",
    duration: "36 months",
    images: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
    ],
    votes: 245,
    views: 3420,
    comments: [
        { id: 1, user: "Rahim Ahmed", text: "Great location and solid returns. I invested 10 shares last month.", date: "2 days ago", avatar: "R" },
        { id: 2, user: "Fatima Hassan", text: "The management team is very transparent. Regular updates on construction progress.", date: "5 days ago", avatar: "F" },
        { id: 3, user: "Karim Uddin", text: "22% return is excellent for this market segment. Definitely worth considering.", date: "1 week ago", avatar: "K" },
    ],
    features: [
        "Panoramic River Views",
        "Rooftop Infinity Pool",
        "24/7 Security & Concierge",
        "Underground Parking",
        "Smart Home Technology",
        "High-Speed Elevators",
        "Commercial Spaces",
        "Landscaped Gardens",
    ],
    milestones: [
        { title: "Land Acquisition", status: "completed", date: "Jan 2024" },
        { title: "Foundation Work", status: "completed", date: "Apr 2024" },
        { title: "Structure Complete", status: "in-progress", date: "Dec 2025" },
        { title: "Interior Finishing", status: "pending", date: "Jun 2026" },
        { title: "Handover", status: "pending", date: "Dec 2026" },
    ],
};

export default function PropertyDetailPage() {
    const params = useParams();
    const pageRef = useRef<HTMLDivElement>(null);
    const [activeImage, setActiveImage] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [voteCount, setVoteCount] = useState(demoProperty.votes);
    const [commentText, setCommentText] = useState("");
    const property = demoProperty;

    useEffect(() => {
        if (!pageRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(".detail-header", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
            gsap.fromTo(".detail-gallery", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1, ease: "power3.out", delay: 0.2 });
            gsap.fromTo(".detail-sidebar", { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out", delay: 0.3 });
            gsap.fromTo(".detail-section", { opacity: 0, y: 40 }, {
                opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out",
                scrollTrigger: { trigger: ".detail-content", start: "top 80%" },
            });
        }, pageRef);
        return () => ctx.revert();
    }, []);

    const fundingProgress = Math.round((property.totalInvested / property.targetAmount) * 100);

    return (
        <div ref={pageRef} className="min-h-screen bg-[#0a0f1d] pt-24 pb-20">
            <div className="container-custom">
                {/* Back + Breadcrumb */}
                <div className="detail-header flex items-center gap-2 text-sm text-white/40 mb-8">
                    <Link href="/properties" className="hover:text-white/60 transition-colors flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" /> Properties
                    </Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-white/60">{property.title}</span>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Gallery */}
                        <div className="detail-gallery space-y-3">
                            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden">
                                <Image src={property.images[activeImage]} alt={property.title} fill className="object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d]/60 via-transparent to-transparent" />
                                {/* Actions */}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button onClick={() => setIsLiked(!isLiked)} className={`w-10 h-10 rounded-xl backdrop-blur-xl flex items-center justify-center transition-all ${isLiked ? "bg-red-500/20 border border-red-500/30" : "bg-black/30 border border-white/10"}`}>
                                        <Heart className={`w-4 h-4 ${isLiked ? "text-red-400 fill-red-400" : "text-white"}`} />
                                    </button>
                                    <button className="w-10 h-10 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 flex items-center justify-center">
                                        <Share2 className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                                {/* Status Badges */}
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 backdrop-blur-xl">{property.category}</Badge>
                                    <Badge className={`backdrop-blur-xl ${property.isPaid ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"}`}>
                                        {property.isPaid ? <><Lock className="w-3 h-3 mr-1" /> Premium</> : <><Unlock className="w-3 h-3 mr-1" /> Free</>}
                                    </Badge>
                                </div>
                                {/* View count */}
                                <div className="absolute bottom-4 left-4 flex items-center gap-2 text-sm text-white/60">
                                    <Eye className="w-4 h-4" /> {property.views.toLocaleString()} views
                                </div>
                            </div>
                            {/* Thumbnails */}
                            <div className="flex gap-3">
                                {property.images.map((img, i) => (
                                    <button key={i} onClick={() => setActiveImage(i)} className={`relative w-24 h-16 rounded-xl overflow-hidden transition-all ${activeImage === i ? "ring-2 ring-blue-500 opacity-100" : "opacity-50 hover:opacity-75"}`}>
                                        <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="detail-content space-y-8">
                            {/* Title + Meta */}
                            <div className="detail-section space-y-4">
                                <h1 className="text-3xl md:text-4xl font-bold font-heading">{property.title}</h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-white/40">
                                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{property.location}</span>
                                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{property.duration}</span>
                                    <span className="flex items-center gap-1"><Users className="w-4 h-4" />{property.totalShares - property.availableShares} investors</span>
                                </div>
                                <p className="text-white/50 leading-relaxed">{property.description}</p>
                            </div>

                            {/* Key Metrics */}
                            <div className="detail-section grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { label: "Expected Return", value: property.expectedReturn, icon: TrendingUp, color: "emerald" },
                                    { label: "Share Price", value: `৳${property.price.toLocaleString()}`, icon: BarChart3, color: "blue" },
                                    { label: "Available", value: `${property.availableShares} shares`, icon: Building2, color: "purple" },
                                    { label: "Duration", value: property.duration, icon: Clock, color: "amber" },
                                ].map((m) => {
                                    const Icon = m.icon;
                                    const colors: Record<string, string> = { emerald: "text-emerald-400 bg-emerald-500/10", blue: "text-blue-400 bg-blue-500/10", purple: "text-purple-400 bg-purple-500/10", amber: "text-amber-400 bg-amber-500/10" };
                                    const c = colors[m.color] || colors.blue;
                                    return (
                                        <div key={m.label} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-8 h-8 rounded-lg ${c.split(" ")[1]} flex items-center justify-center`}><Icon className={`w-4 h-4 ${c.split(" ")[0]}`} /></div>
                                            </div>
                                            <p className="text-xs text-white/30 uppercase tracking-wider">{m.label}</p>
                                            <p className={`text-lg font-bold ${c.split(" ")[0]}`}>{m.value}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Features */}
                            <div className="detail-section bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                                <h3 className="text-lg font-bold mb-4">Property Features</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {property.features.map((f) => (
                                        <div key={f} className="flex items-center gap-2 text-sm text-white/50">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                            {f}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Milestones */}
                            <div className="detail-section bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                                <h3 className="text-lg font-bold mb-6">Development Timeline</h3>
                                <div className="space-y-4">
                                    {property.milestones.map((m, i) => (
                                        <div key={m.title} className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${m.status === "completed" ? "bg-emerald-500/10 border border-emerald-500/20" : m.status === "in-progress" ? "bg-blue-500/10 border border-blue-500/20" : "bg-white/5 border border-white/5"}`}>
                                                {m.status === "completed" ? <div className="w-2 h-2 rounded-full bg-emerald-400" /> : m.status === "in-progress" ? <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /> : <div className="w-2 h-2 rounded-full bg-white/20" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-sm font-medium ${m.status === "completed" ? "text-white" : m.status === "in-progress" ? "text-blue-400" : "text-white/40"}`}>{m.title}</p>
                                                <p className="text-xs text-white/30">{m.date}</p>
                                            </div>
                                            <Badge className={`text-[10px] ${m.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : m.status === "in-progress" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-white/5 text-white/30 border-white/5"}`}>
                                                {m.status === "in-progress" ? "In Progress" : m.status === "completed" ? "Done" : "Upcoming"}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Vote + Comments */}
                            <div className="detail-section bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold">Community ({property.comments.length})</h3>
                                    <button
                                        onClick={() => { if (!hasVoted) { setHasVoted(true); setVoteCount(voteCount + 1); } }}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${hasVoted ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"}`}
                                    >
                                        <ThumbsUp className={`w-4 h-4 ${hasVoted ? "fill-blue-400" : ""}`} />
                                        {voteCount}
                                    </button>
                                </div>

                                {/* Comment Input */}
                                <div className="flex gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 text-sm font-bold text-blue-400">Y</div>
                                    <div className="flex-1 flex gap-2">
                                        <Input
                                            placeholder="Share your thoughts on this property..."
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            className="bg-white/5 border-white/10 rounded-xl py-5 text-white placeholder:text-white/20 focus-visible:ring-blue-500/30"
                                        />
                                        <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-4 shrink-0">
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Comments List */}
                                <div className="space-y-4">
                                    {property.comments.map((c) => (
                                        <div key={c.id} className="flex gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 text-sm font-bold text-purple-400">{c.avatar}</div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-white">{c.user}</span>
                                                    <span className="text-xs text-white/30">{c.date}</span>
                                                </div>
                                                <p className="text-sm text-white/50">{c.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="detail-sidebar">
                        <div className="sticky top-28 space-y-6">
                            {/* Investment Card */}
                            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-6">
                                <div className="space-y-2">
                                    <p className="text-xs text-white/30 uppercase tracking-wider">Share Price</p>
                                    <p className="text-3xl font-bold gradient-text">৳{property.price.toLocaleString()}</p>
                                </div>

                                {/* Funding Progress */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/40">Funding Progress</span>
                                        <span className="text-white font-medium">{fundingProgress}%</span>
                                    </div>
                                    <div className="w-full h-2 rounded-full bg-white/5">
                                        <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-700" style={{ width: `${fundingProgress}%` }} />
                                    </div>
                                    <div className="flex justify-between text-xs text-white/30">
                                        <span>৳{(property.totalInvested / 100000).toFixed(1)}L raised</span>
                                        <span>৳{(property.targetAmount / 100000).toFixed(1)}L target</span>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white/[0.03] rounded-xl p-3">
                                        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Return</p>
                                        <p className="text-sm font-bold text-emerald-400">{property.expectedReturn}</p>
                                    </div>
                                    <div className="bg-white/[0.03] rounded-xl p-3">
                                        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Min. Invest</p>
                                        <p className="text-sm font-bold text-white">{property.minInvestment}</p>
                                    </div>
                                </div>

                                <Link href="/payment">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-6 text-sm font-semibold shadow-2xl shadow-blue-500/20 group mt-2">
                                        Invest Now
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>

                                <div className="flex items-center gap-2 justify-center text-xs text-white/20">
                                    <Shield className="w-3 h-3 text-emerald-400" />
                                    <span>Secured & RERA Verified</span>
                                </div>
                            </div>

                            {/* Similar Properties */}
                            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                <h4 className="text-sm font-bold mb-4">Similar Properties</h4>
                                <div className="space-y-3">
                                    {[
                                        { title: "Skyline Business Hub", return: "18%", price: "৳75,000" },
                                        { title: "Green Valley Homes", return: "20%", price: "৳25,000" },
                                        { title: "Metro Tech Park", return: "24%", price: "৳40,000" },
                                    ].map((p) => (
                                        <Link key={p.title} href="/properties/2" className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
                                            <div>
                                                <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{p.title}</p>
                                                <p className="text-xs text-white/30">{p.price}/share</p>
                                            </div>
                                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">{p.return}</Badge>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
