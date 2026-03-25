"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Building2,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Github,
    Sparkles,
    Shield,
} from "lucide-react";
import gsap from "gsap";

export default function LoginPage() {
    const pageRef = useRef<HTMLDivElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!pageRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.fromTo(
                ".auth-left",
                { opacity: 0, x: -60 },
                { opacity: 1, x: 0, duration: 1, ease: "power3.out" }
            );

            tl.fromTo(
                ".auth-card",
                { opacity: 0, y: 40, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" },
                "-=0.6"
            );

            tl.fromTo(
                ".auth-field",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" },
                "-=0.3"
            );
        }, pageRef);

        return () => ctx.revert();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <div
            ref={pageRef}
            className="min-h-screen bg-[#0a0f1d] flex items-center justify-center p-6 relative overflow-hidden"
        >
            {/* Background effects */}
            <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-blue-600/8 blur-[150px]" />
            <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[120px]" />
            <div className="absolute inset-0 grid-pattern opacity-20" />

            <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 gap-0 lg:gap-0">
                {/* Left Side - Branding */}
                <div className="auth-left hidden lg:flex flex-col justify-center pr-16 space-y-8">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold tracking-tight font-heading">
                                Prop<span className="text-blue-500">Share</span>
                            </span>
                            <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 -mt-0.5">
                                Protocol
                            </span>
                        </div>
                    </Link>

                    <div className="space-y-4">
                        <h1 className="text-4xl lg:text-5xl font-bold font-heading leading-tight">
                            Welcome{" "}
                            <span className="gradient-text">Back</span>
                        </h1>
                        <p className="text-white/40 text-lg leading-relaxed max-w-md">
                            Sign in to your account to manage your investments,
                            track returns, and discover new property opportunities.
                        </p>
                    </div>

                    {/* Trust badges */}
                    <div className="space-y-4 pt-4">
                        {[
                            { icon: Shield, text: "Bank-grade encryption & security" },
                            { icon: Sparkles, text: "2,500+ active investors trust us" },
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.text} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                                        <Icon className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <span className="text-sm text-white/50">{item.text}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Side - Login Card */}
                <div className="auth-card">
                    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-10 shadow-3xl">
                        {/* Mobile Logo */}
                        <div className="flex lg:hidden items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold font-heading">
                                Prop<span className="text-blue-500">Share</span>
                            </span>
                        </div>

                        <div className="space-y-2 mb-8">
                            <h2 className="text-2xl font-bold font-heading">Sign In</h2>
                            <p className="text-sm text-white/40">
                                Enter your credentials to access your account
                            </p>
                        </div>

                        {/* Social Login */}
                        <div className="auth-field grid grid-cols-2 gap-3 mb-6">
                            <Button
                                variant="outline"
                                className="border-white/10 text-white hover:bg-white/5 rounded-xl h-12 group"
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </Button>
                            <Button
                                variant="outline"
                                className="border-white/10 text-white hover:bg-white/5 rounded-xl h-12 group"
                            >
                                <Github className="w-5 h-5 mr-2" />
                                GitHub
                            </Button>
                        </div>

                        {/* Divider */}
                        <div className="auth-field relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/5" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-4 text-xs text-white/20 bg-[#0d1220] uppercase tracking-wider">
                                    or continue with email
                                </span>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="auth-field space-y-2">
                                <label className="text-xs text-white/40 uppercase tracking-wider font-medium">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <Input
                                        type="email"
                                        required
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                        className="bg-white/5 border-white/10 rounded-xl pl-11 py-6 text-white placeholder:text-white/20 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/30"
                                    />
                                </div>
                            </div>

                            <div className="auth-field space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs text-white/40 uppercase tracking-wider font-medium">
                                        Password
                                    </label>
                                    <Link
                                        href="/auth/forgot-password"
                                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={(e) =>
                                            setFormData({ ...formData, password: e.target.value })
                                        }
                                        className="bg-white/5 border-white/10 rounded-xl pl-11 pr-11 py-6 text-white placeholder:text-white/20 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/30"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember me */}
                            <div className="auth-field flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="w-4 h-4 rounded bg-white/5 border-white/10 text-blue-600 focus:ring-blue-500/30"
                                />
                                <label htmlFor="remember" className="text-sm text-white/40">
                                    Remember me for 30 days
                                </label>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="auth-field w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-6 text-sm font-semibold shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 group disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Register Link */}
                        <div className="auth-field text-center mt-8 pt-6 border-t border-white/5">
                            <p className="text-sm text-white/40">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="/auth/register"
                                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                >
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
