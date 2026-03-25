"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Download, Building2 } from "lucide-react";

export default function PaymentSuccessPage() {
    return (
        <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-600/10 blur-[200px]" />

            <div className="relative z-10 text-center max-w-lg space-y-8">
                <div className="w-24 h-24 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto animate-pulse-glow">
                    <CheckCircle className="w-12 h-12 text-emerald-400" />
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl md:text-4xl font-bold font-heading">
                        Payment <span className="text-emerald-400">Successful!</span>
                    </h1>
                    <p className="text-white/40 leading-relaxed">
                        Your investment has been processed successfully. Shares have been credited to your portfolio and you will start receiving returns from the next payout cycle.
                    </p>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4 text-left">
                    <div className="flex justify-between text-sm"><span className="text-white/40">Transaction ID</span><span className="text-white font-mono">TXN-PS28X7KM</span></div>
                    <div className="flex justify-between text-sm"><span className="text-white/40">Status</span><span className="text-emerald-400 font-medium">Confirmed</span></div>
                    <div className="flex justify-between text-sm"><span className="text-white/40">Amount</span><span className="text-white font-bold">৳5,10,000</span></div>
                    <div className="flex justify-between text-sm"><span className="text-white/40">Shares</span><span className="text-white font-medium">10 Shares</span></div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" className="flex-1 border-white/10 text-white hover:bg-white/5 rounded-xl py-5"><Download className="w-4 h-4 mr-2" /> Receipt</Button>
                    <Link href="/dashboard/investments" className="flex-1">
                        <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-5 group">
                            View Investments <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                <Link href="/" className="text-xs text-white/30 hover:text-white/50 transition-colors">← Back to Home</Link>
            </div>
        </div>
    );
}
