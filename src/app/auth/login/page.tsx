"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Mail,
    Lock,
    ArrowRight,
    ShieldCheck,
    Eye,
    EyeOff,
    Building2
} from "lucide-react";
import { toast } from "react-hot-toast";
import { authService } from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authService.login(formData);
            const { token } = response.data;

            if (typeof window !== "undefined") {
                localStorage.setItem("auth_token", token);
            }

            toast.success("Identity Verified. Redirecting to Terminal...");
            router.push("/dashboard");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Authentication transmission failure.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center py-20 px-4 md:px-8 relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-md w-full space-y-12 relative z-10">
                <div className="text-center space-y-6">
                    <Link href="/" className="inline-flex items-center gap-3 transition-transform hover:scale-105 active:scale-95">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 font-bold text-2xl rotate-3">
                            <Building2 size={28} />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tighter">Prop<span className="text-blue-500">Share</span></span>
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold text-white font-heading tracking-tight leading-tight">Secure Access</h1>
                        <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em]">Institutional Authentication Protocol</p>
                    </div>
                </div>

                <div className="bg-[#151c2e] rounded-3xl border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.5)] p-6 md:p-10 space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl pointer-events-none" />

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em] block ml-1">Registry Email</label>
                            <div className="relative group/input">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-blue-500 transition-colors" size={20} />
                                <input
                                    required
                                    type="email"
                                    placeholder="name@institution.com"
                                    className="w-full bg-[#0a0f1d] border border-white/5 rounded-2xl py-4 pl-16 pr-6 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium text-sm shadow-inner"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em] block">Encrypted Password</label>
                                <Link href="/auth/forgot-password" className="text-blue-500 hover:text-white transition-colors font-bold text-[9px] uppercase tracking-[0.2em] opacity-50 cursor-not-allowed pointer-events-none">Forgot?</Link>
                            </div>
                            <div className="relative group/input">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-blue-500 transition-colors" size={20} />
                                <input
                                    required
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full bg-[#0a0f1d] border border-white/5 rounded-2xl py-4 pl-16 pr-16 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium text-sm shadow-inner"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors p-1"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-900 disabled:text-slate-700 text-white rounded-2xl py-4 font-bold text-[10px] uppercase tracking-[0.3em] transition-all shadow-2xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-4 relative overflow-hidden group-hover:shadow-blue-500/40"
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            {loading ? "Decrypting..." : (
                                <>
                                    Establish Session <ArrowRight size={20} className="transition-transform group-hover:translate-x-2" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="pt-8 border-t border-white/5 text-center space-y-6">
                        <div className="flex items-center justify-center gap-3 text-slate-600 font-bold text-[9px] uppercase tracking-[0.3em] bg-white/2 py-2 px-4 rounded-xl border border-white/5">
                            <ShieldCheck size={16} className="text-emerald-500" /> Layer-7 Protection Configured
                        </div>
                        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">
                            Nesting in PropShare Registry?{" "}
                            <Link href="/auth/register" className="text-blue-500 hover:text-white transition-colors underline underline-offset-4 ml-1">Register Access</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
