"use client";

import React, { useEffect, useRef } from "react";
import { FileText, Clock, AlertTriangle, MessageSquare, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";

export default function TermsAndConditionsPage() {
    const pageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!pageRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(".terms-header", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
            gsap.fromTo(".terms-content", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 });
        }, pageRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={pageRef} className="min-h-screen bg-[#0a0f1d] pt-28 pb-32 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[200px]" />
            <div className="container-custom relative z-10">
                <div className="terms-header max-w-4xl mx-auto space-y-4 mb-20 text-center">
                    <div className="flex items-center justify-center gap-2 text-xs text-blue-400 font-bold uppercase tracking-widest mb-2">
                        <FileText className="w-3.5 h-3.5" /> Legal Framework
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-heading">Terms & <span className="gradient-text">Conditions</span></h1>
                    <div className="flex items-center justify-center gap-4 text-xs text-white/40 mt-6 pt-6 border-t border-white/5 mx-auto w-fit">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Updated: March 20, 2026</span>
                    </div>
                </div>

                <div className="terms-content max-w-3xl mx-auto space-y-16">
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-8 flex items-start gap-4">
                        <AlertTriangle className="w-6 h-6 text-amber-500 mt-1 shrink-0" />
                        <div className="space-y-2">
                            <h4 className="text-sm font-bold text-amber-500 uppercase tracking-widest">Important Disclaimer</h4>
                            <p className="text-xs text-white/50 leading-relaxed font-medium">
                                Real estate investments carry inherent risks. Fractional ownership does not guarantee returns. Past performance is not indicative of future results. Please read the full document carefully before investing.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-12">
                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3"><span className="text-blue-400 font-mono text-sm">01.</span> Acceptance of Terms</h2>
                            <p className="text-white/60 text-sm leading-relaxed">
                                By accessing or using PropShare Protocol&apos;s services, website, or mobile application, you agree to be bound by these Terms and Conditions. If you do not agree to all of these terms, do not use our services.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3"><span className="text-blue-400 font-mono text-sm">02.</span> Eligibility & Account</h2>
                            <p className="text-white/60 text-sm leading-relaxed">
                                To use our platform, you must be at least 18 years old and have the legal capacity to enter into binding contracts. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3"><span className="text-blue-400 font-mono text-sm">03.</span> Investment & Ownership</h2>
                            <p className="text-white/60 text-sm leading-relaxed">
                                All investments on PropShare Protocol are conducted via a digital registry of shares. Ownership of property shares does not grant you the right to occupy or modify the physical property; it grants you a pro-rata share in the rental income and capital appreciation of the asset.
                            </p>
                            <div className="grid md:grid-cols-2 gap-4 pt-4">
                                {[
                                    { title: "Share Distribution", text: "Shares are distributed based on the investment amount confirmed via receipt." },
                                    { title: "Exit Strategy", text: "Users can sell their shares through our internal marketplace or during the asset exit event." },
                                ].map((item, i) => (
                                    <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                                        <p className="text-xs font-bold text-white mb-2">{item.title}</p>
                                        <p className="text-xs text-white/40 leading-relaxed">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3"><span className="text-blue-400 font-mono text-sm">04.</span> Fees & Commissions</h2>
                            <p className="text-white/60 text-sm leading-relaxed">
                                PropShare Protocol charges a platform fee of 2.5% on each transaction and a management fee of 0.5% on annual rental distributions. These fees cover operational costs, audits, and asset management services.
                            </p>
                        </section>

                        <section className="space-y-4 border-t border-white/5 pt-12">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-6">
                                <div className="space-y-2 text-center md:text-left">
                                    <h3 className="text-lg font-bold text-white">Need Legal Clarification?</h3>
                                    <p className="text-xs text-white/40 leading-relaxed max-w-sm">
                                        If you have questions regarding our legal framework or investment structure, our compliance team is here to help.
                                    </p>
                                </div>
                                <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-10 py-6 h-auto text-sm font-bold font-heading group shadow-xl shadow-blue-600/20">
                                    <MessageSquare className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> CONTACT SUPPORT
                                </Button>
                            </div>
                        </section>
                    </div>

                    {/* Quick Verification Bar */}
                    <div className="bg-gradient-to-br from-blue-600/10 to-emerald-600/10 border border-blue-500/20 rounded-3xl p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            <p className="text-xs font-bold text-white uppercase tracking-widest">RERA COMPLIANT PROTOCOL</p>
                        </div>
                        <p className="text-[10px] text-white/40">LICENSE #2024-PS-008</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
