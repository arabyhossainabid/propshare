"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 px-6 md:px-12 bg-[#0a0f1d] overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/4 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[160px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] bg-blue-500/2 rounded-full blur-[200px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10 text-center lg:text-left">
                <div className="space-y-12">
                    <div className="space-y-8">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading text-white tracking-tighter">
                            Invest in <span className="text-blue-500">Wealth.</span> <br />
                            Digitally <span className="text-slate-600">Secured.</span>
                        </h1>

                        <p className="text-slate-500 text-base md:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                            Unlock institutional-grade commercial real estate. Build your portfolio with premium fractional assets and earn verified monthly yield on the global ledger.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 pt-10 justify-center lg:justify-start">
                        <Link href="/ideas" className="bg-blue-600 text-white px-6 py-5 rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-4 group active:scale-95 relative overflow-hidden">
                            <div className="absolute bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                            <span className="relative z-10">Explore Registry</span>
                            <ArrowRight size={22} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                        </Link>
                        <Link href="/auth/register" className="bg-white/5 border border-white/10 text-white px-6 py-5 rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all flex items-center justify-center gap-4 active:scale-95 group">
                            <span className="group-hover:text-blue-400 transition-colors">Establish Account</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-12 lg:gap-16 pt-14 border-t border-white/5 justify-center lg:justify-start">
                        <div className="space-y-1">
                            <p className="text-2xl font-bold text-white tracking-tighter">$120M+</p>
                            <p className="text-[8px] text-slate-600 uppercase tracking-[0.3em] font-bold">Registry Volume</p>
                        </div>
                        <div className="w-px h-12 bg-white/5" />
                        <div className="space-y-1">
                            <p className="text-2xl font-bold text-white tracking-tighter">45K+</p>
                            <p className="text-[8px] text-slate-600 uppercase tracking-[0.3em] font-bold">Active Nodes</p>
                        </div>
                        <div className="w-px h-12 bg-white/5" />
                        <div className="space-y-1">
                            <p className="text-2xl font-bold text-white tracking-tighter">12.4%</p>
                            <p className="text-[8px] text-slate-600 uppercase tracking-[0.3em] font-bold">Locked APY</p>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:block relative group">
                    <div className="relative z-10 rounded-3xl overflow-hidden border-4 border-white/2 shadow-[0_50px_150px_rgba(0,0,0,0.6)] transform rotate-3 group-hover:rotate-0 transition-all duration-1000 scale-105">
                        <img
                            src="https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=1200&auto=format&fit=crop"
                            alt="Premium Institutional Property"
                            className="w-full h-auto aspect-4/5 object-cover group-hover:scale-110 transition-transform duration-[3s]"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-[#0a0f1d] via-transparent to-transparent opacity-80" />
                    </div>

                    {/* Floating Metric Card */}
                    <div className="absolute -bottom-12 -left-12 z-20 bg-[#151c2e]/90 backdrop-blur-3xl border border-white/10 p-4 rounded-2xl shadow-3xl animate-bounce-slow group-hover:shadow-blue-500/20 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center border border-blue-500/20 shadow-inner">
                                <TrendingUp size={32} />
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-xs text-slate-600 font-bold uppercase tracking-[0.3em]">Sector Performance</p>
                                <p className="font-bold text-white text-xl tracking-tighter">+14.2% YoY</p>
                            </div>
                        </div>
                    </div>

                    {/* Background Decoration */}
                    <div className="absolute -inset-10 bg-blue-600/5 rounded-3xl blur-[100px] -z-10 group-hover:bg-blue-600/15 transition-all duration-1000" />
                </div>
            </div>
        </section>
    );
}
