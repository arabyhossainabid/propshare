"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowRight, RefreshCcw, MessageSquare } from "lucide-react";

export default function PaymentCancelPage() {
    return (
        <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-600/5 blur-[200px]" />

            <div className="relative z-10 text-center max-w-lg space-y-8">
                <div className="w-24 h-24 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                    <XCircle className="w-12 h-12 text-red-400" />
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl md:text-4xl font-bold font-heading">
                        Payment <span className="text-red-400">Failed</span>
                    </h1>
                    <p className="text-white/40 leading-relaxed">
                        Your payment was not completed. This could be due to insufficient funds, a cancelled transaction, or a temporary processing error. No amount has been deducted from your account.
                    </p>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-3 text-left">
                    <h4 className="text-sm font-bold text-white mb-2">Common Reasons</h4>
                    {["Insufficient balance in your account", "Transaction was cancelled by user", "Payment gateway timeout", "Card/mobile wallet declined"].map((r) => (
                        <div key={r} className="flex items-center gap-2 text-sm text-white/40"><div className="w-1 h-1 rounded-full bg-red-400/50" />{r}</div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/payment" className="flex-1">
                        <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 rounded-xl py-5"><RefreshCcw className="w-4 h-4 mr-2" /> Try Again</Button>
                    </Link>
                    <Link href="/contact" className="flex-1">
                        <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-5 group">
                            <MessageSquare className="w-4 h-4 mr-2" /> Contact Support
                        </Button>
                    </Link>
                </div>

                <Link href="/properties" className="text-xs text-white/30 hover:text-white/50 transition-colors">← Browse Properties</Link>
            </div>
        </div>
    );
}
