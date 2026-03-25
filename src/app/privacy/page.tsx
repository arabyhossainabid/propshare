"use client";

import React, { useEffect, useRef } from "react";
import { Shield, Clock, Eye, AlertCircle, ChevronRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";

export default function PrivacyPolicyPage() {
    const pageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!pageRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(".policy-header", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
            gsap.fromTo(".policy-content", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 });
        }, pageRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={pageRef} className="min-h-screen bg-[#0a0f1d] pt-28 pb-32 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[200px]" />
            <div className="container-custom relative z-10">
                <div className="policy-header max-w-4xl mx-auto space-y-4 mb-20">
                    <div className="flex items-center gap-2 text-xs text-blue-400 font-bold uppercase tracking-widest mb-2">
                        <Shield className="w-3.5 h-3.5" /> Data Protection
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-heading">Privacy <span className="gradient-text">Policy</span></h1>
                    <div className="flex items-center gap-4 text-xs text-white/40 mt-6 pt-6 border-t border-white/5">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Effective: March 20, 2026</span>
                        <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Version 2.4.1</span>
                    </div>
                </div>

                <div className="policy-content max-w-4xl mx-auto grid md:grid-cols-4 gap-12">
                    {/* Navigation Sidebar */}
                    <aside className="md:col-span-1 hidden md:block">
                        <div className="sticky top-28 space-y-2">
                            {["Introduction", "Information We Collect", "How We Use Information", "Data Sharing", "Your Choices", "Updates to Policy"].map((item, i) => (
                                <button key={i} className={`flex items-center justify-between w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition-all ${i === 0 ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" : "text-white/40 hover:text-white hover:bg-white/5"}`}>
                                    {item}
                                    {i === 0 && <ChevronRight className="w-3 h-3 text-blue-400" />}
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Content Section */}
                    <div className="md:col-span-3 space-y-12">
                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3"><span className="text-blue-400 font-mono text-sm">01.</span> Introduction</h2>
                            <p className="text-white/60 text-sm leading-relaxed">
                                At PropShare Protocol, we value the trust you place in us when you share your personal data. This Privacy Policy describes how we collect, use, and protect your information across our website and mobile platform. Our goal is to provide a safe and secure environment for fractional real estate investment while maintaining complete transparency regarding data handling.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3"><span className="text-blue-400 font-mono text-sm">02.</span> Information We Collect</h2>
                            <p className="text-white/60 text-sm leading-relaxed">
                                We collect information that is necessary for providing our services. This includes:
                            </p>
                            <ul className="space-y-3">
                                {[
                                    { title: "Personal Identifiers", text: "Full name, email address, phone number, and national ID (for verification)." },
                                    { title: "Financial Information", text: "Bank account details, mobile wallet numbers, and transaction history." },
                                    { title: "Technical Data", text: "IP address, browser type, device information, and platform usage metrics." },
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 ring-1 ring-white/[0.03]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                        <div>
                                            <p className="text-xs font-bold text-white uppercase tracking-widest mb-1">{item.title}</p>
                                            <p className="text-xs text-white/40 leading-relaxed">{item.text}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3"><span className="text-blue-400 font-mono text-sm">03.</span> Data Security & Storage</h2>
                            <div className="p-6 rounded-3xl bg-blue-600/5 border border-blue-500/20 space-y-4">
                                <AlertCircle className="w-6 h-6 text-blue-400" />
                                <p className="text-sm text-white/80 leading-relaxed font-medium">
                                    We employ industry-standard encryption protocols (SSL/TLS) for data in transit and AES-256 for data at rest. Your sensitive financial data is never stored directly on our servers; it is handled by PCI-DSS compliant payment gateways.
                                </p>
                            </div>
                            <p className="text-white/60 text-sm leading-relaxed">
                                Our platform architecture is built with a &quot;Privacy by Design&quot; approach, ensuring that and data access is granted only to authorized personnel through multi-factor authentication.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3"><span className="text-blue-400 font-mono text-sm">04.</span> Your Rights</h2>
                            <p className="text-white/60 text-sm leading-relaxed">
                                Under local data protection laws, you have the right to access, rectify, or delete your personal data. You can exercise these rights through your account dashboard or by contacting our support team.
                            </p>
                        </section>

                        <div className="pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="text-center sm:text-left space-y-1">
                                <p className="text-xs text-white/30">Questions about this policy?</p>
                                <p className="text-sm text-blue-400 font-semibold">privacy@propshare.com</p>
                            </div>
                            <Button className="bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 px-8 py-5 h-auto text-xs font-bold font-heading group">
                                <Share2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> SHARE POLICY
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
