"use client";

import React, { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, Wallet, DollarSign, ArrowUpRight, TrendingUp, Eye, Clock, CheckCircle, AlertCircle } from "lucide-react";
import gsap from "gsap";

const adminStats = [
    { label: "Total Users", value: "2,547", change: "+124 this month", icon: Users, color: "blue" },
    { label: "Total Properties", value: "156", change: "+12 this month", icon: Building2, color: "purple" },
    { label: "Total Investments", value: "৳4.2Cr", change: "+18.5%", icon: Wallet, color: "emerald" },
    { label: "Revenue", value: "৳8.4L", change: "+22%", icon: DollarSign, color: "amber" },
];

const recentActivity = [
    { action: "New user registered", user: "Rahim Khan", time: "2 min ago", type: "user" },
    { action: "Property submitted for review", user: "Fatima Akter", time: "15 min ago", type: "property" },
    { action: "Investment of ৳5,00,000", user: "Karim Uddin", time: "1 hour ago", type: "investment" },
    { action: "Property approved", user: "Admin", time: "2 hours ago", type: "approval" },
    { action: "New user registered", user: "Sakib Ahmed", time: "3 hours ago", type: "user" },
];

const pendingReviews = [
    { title: "Tech Co-working Hub", submittedBy: "Fatima Akter", date: "Mar 22", category: "Co-working" },
    { title: "Luxury Beach Villa", submittedBy: "Rahim Khan", date: "Mar 21", category: "Vacation" },
    { title: "Downtown Office Space", submittedBy: "Nadia Islam", date: "Mar 20", category: "Commercial" },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
    purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
};

export default function AdminPage() {
    const pageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!pageRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(".admin-stat", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" });
            gsap.fromTo(".admin-section", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out", delay: 0.3 });
        }, pageRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={pageRef} className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold font-heading">Admin Dashboard</h1>
                <p className="text-sm text-white/40 mt-1">Platform overview and management controls.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {adminStats.map((s) => {
                    const Icon = s.icon;
                    const c = colorMap[s.color];
                    return (
                        <div key={s.label} className="admin-stat bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.04] transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}><Icon className={`w-4 h-4 ${c.text}`} /></div>
                                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1"><ArrowUpRight className="w-3 h-3" />{s.change}</span>
                            </div>
                            <p className="text-2xl font-bold font-heading">{s.value}</p>
                            <p className="text-xs text-white/30 mt-1">{s.label}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
                {/* Recent Activity */}
                <div className="admin-section lg:col-span-3 bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                    <h3 className="text-base font-bold mb-5">Recent Activity</h3>
                    <div className="space-y-3">
                        {recentActivity.map((a, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-all">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a.type === "user" ? "bg-blue-500/10" : a.type === "property" ? "bg-purple-500/10" : a.type === "investment" ? "bg-emerald-500/10" : "bg-amber-500/10"}`}>
                                    {a.type === "user" ? <Users className="w-3 h-3 text-blue-400" /> : a.type === "property" ? <Building2 className="w-3 h-3 text-purple-400" /> : a.type === "investment" ? <Wallet className="w-3 h-3 text-emerald-400" /> : <CheckCircle className="w-3 h-3 text-amber-400" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white">{a.action}</p>
                                    <p className="text-xs text-white/30">{a.user} · {a.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pending Reviews */}
                <div className="admin-section lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-base font-bold">Pending Reviews</h3>
                        <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]">{pendingReviews.length} pending</Badge>
                    </div>
                    <div className="space-y-3">
                        {pendingReviews.map((p) => (
                            <div key={p.title} className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all space-y-2">
                                <p className="text-sm font-medium text-white">{p.title}</p>
                                <div className="flex items-center justify-between text-xs text-white/30">
                                    <span>{p.submittedBy}</span>
                                    <span>{p.date}</span>
                                </div>
                                <Badge className="bg-white/5 text-white/40 border-white/5 text-[10px]">{p.category}</Badge>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
