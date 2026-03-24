"use client";

import React from "react";
import Link from "next/link";
import { Globe, Lock } from "lucide-react";

export default function CTA() {
    return (
        <section className="py-20 px-6 bg-[#0a0f1d] relative">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/3 rounded-2xl blur-[150px] pointer-events-none" />

            <div className="max-w-7xl mx-auto bg-linear-to-br from-[#151c2e] to-[#0a0f1d] rounded-2xl p-10 md:p-14 relative overflow-hidden text-center border border-white/10 shadow-[0_80px_160px_rgba(0,0,0,0.8)]">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '64px 64px' }} />
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-600/15 rounded-2xl blur-[120px] pointer-events-none" />
                <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-emerald-500/5 rounded-2xl blur-[120px] pointer-events-none" />

                <div className="relative z-10 space-y-10">
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-5xl font-bold font-heading text-white leading-none tracking-tighter">
                            Establish Your <br /> Wealth <span className="text-blue-500">Position.</span>
                        </h2>
                        <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                            Join 45,000+ institutional level participants. Secure fractional ownership in Tier-1 commercial assets via the global registry.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-6 pt-2">
                        <Link href="/auth/register" className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-blue-500 transition-all shadow-3xl shadow-blue-500/40 active:scale-95 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                            <span className="relative z-10">Initialize Registry</span>
                        </Link>
                        <Link href="/contact" className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-white/10 transition-all backdrop-blur-3xl active:scale-95 group">
                            <span className="relative z-10 group-hover:text-blue-400 transition-colors">Protocol Inquiry</span>
                        </Link>
                    </div>

                    <div className="flex items-center justify-center gap-6 pt-12">
                        <div className="w-12 h-px bg-white/5" />
                        <p className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.5em] flex items-center gap-3">
                            <Lock size={14} /> SECURED GLOBAL LEDGER
                        </p>
                        <div className="w-12 h-px bg-white/5" />
                    </div>
                </div>
            </div>
        </section>
    );
}
