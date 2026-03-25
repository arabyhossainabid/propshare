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
    User,
    Phone,
    Github,
    Check,
    Shield,
    TrendingUp,
    Users,
} from "lucide-react";
import gsap from "gsap";

export default function RegisterPage() {
    const pageRef = useRef<HTMLDivElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false,
    });

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
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out" },
                "-=0.3"
            );
        }, pageRef);

        return () => ctx.revert();
    }, []);

    // Animate step change
    useEffect(() => {
        gsap.fromTo(
            ".step-content",
            { opacity: 0, x: 30 },
            { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }
        );
    }, [currentStep]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentStep === 1) {
            setCurrentStep(2);
        } else {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 2000);
        }
    };

    const passwordStrength = () => {
        const pwd = formData.password;
        if (!pwd) return { score: 0, label: "", color: "" };
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;

        const strengths = [
            { score: 1, label: "Weak", color: "bg-red-500" },
            { score: 2, label: "Fair", color: "bg-amber-500" },
            { score: 3, label: "Good", color: "bg-blue-500" },
            { score: 4, label: "Strong", color: "bg-emerald-500" },
        ];
        return strengths[score - 1] || { score: 0, label: "", color: "" };
    };

    return (
        <div
            ref={pageRef}
            className="min-h-screen bg-[#0a0f1d] flex items-center justify-center p-6 relative overflow-hidden"
        >
            {/* Background */}
            <div className="absolute top-[15%] right-[5%] w-[600px] h-[600px] rounded-full bg-purple-600/5 blur-[150px]" />
            <div className="absolute bottom-[15%] left-[5%] w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[120px]" />
            <div className="absolute inset-0 grid-pattern opacity-20" />

            <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 gap-0">
                {/* Left Side */}
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
                            Start Your{" "}
                            <span className="gradient-text">Investment Journey</span>
                        </h1>
                        <p className="text-white/40 text-lg leading-relaxed max-w-md">
                            Create your account in just 2 minutes and unlock access
                            to premium real estate investment opportunities.
                        </p>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-4 pt-4">
                        {[
                            { icon: Shield, text: "Verified & RERA-compliant properties" },
                            { icon: TrendingUp, text: "15-25% average annual returns" },
                            { icon: Users, text: "Join 2,500+ smart investors" },
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.text} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                        <Icon className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <span className="text-sm text-white/50">{item.text}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Side - Register Card */}
                <div className="auth-card">
                    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-10 shadow-3xl">
                        {/* Mobile Logo */}
                        <div className="flex lg:hidden items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold font-heading">
                                Prop<span className="text-blue-500">Share</span>
                            </span>
                        </div>

                        {/* Steps Indicator */}
                        <div className="auth-field flex items-center gap-3 mb-8">
                            {[1, 2].map((step) => (
                                <div key={step} className="flex items-center gap-3 flex-1">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 ${
                                            currentStep >= step
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                                : "bg-white/5 text-white/30 border border-white/10"
                                        }`}
                                    >
                                        {currentStep > step ? (
                                            <Check className="w-3.5 h-3.5" />
                                        ) : (
                                            step
                                        )}
                                    </div>
                                    {step < 2 && (
                                        <div className="flex-1 h-0.5 rounded-full bg-white/5">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${
                                                    currentStep > 1
                                                        ? "bg-blue-500 w-full"
                                                        : "bg-transparent w-0"
                                                }`}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="space-y-1 mb-6">
                            <h2 className="text-2xl font-bold font-heading">
                                {currentStep === 1 ? "Personal Info" : "Secure Your Account"}
                            </h2>
                            <p className="text-sm text-white/40">
                                {currentStep === 1
                                    ? "Tell us about yourself to get started"
                                    : "Create a strong password to protect your investments"}
                            </p>
                        </div>

                        {/* Social Login (Step 1 only) */}
                        {currentStep === 1 && (
                            <>
                                <div className="auth-field grid grid-cols-2 gap-3 mb-5">
                                    <Button
                                        variant="outline"
                                        className="border-white/10 text-white hover:bg-white/5 rounded-xl h-11"
                                    >
                                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Google
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-white/10 text-white hover:bg-white/5 rounded-xl h-11"
                                    >
                                        <Github className="w-4 h-4 mr-2" />
                                        GitHub
                                    </Button>
                                </div>
                                <div className="auth-field relative mb-5">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/5" />
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="px-4 text-xs text-white/20 bg-[#0d1220] uppercase tracking-wider">
                                            or
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="step-content">
                                {currentStep === 1 ? (
                                    <>
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div className="auth-field space-y-2">
                                                <label className="text-xs text-white/40 uppercase tracking-wider font-medium">
                                                    First Name
                                                </label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                    <Input
                                                        required
                                                        placeholder="John"
                                                        value={formData.firstName}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, firstName: e.target.value })
                                                        }
                                                        className="bg-white/5 border-white/10 rounded-xl pl-10 py-5 text-white placeholder:text-white/20 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/30"
                                                    />
                                                </div>
                                            </div>
                                            <div className="auth-field space-y-2">
                                                <label className="text-xs text-white/40 uppercase tracking-wider font-medium">
                                                    Last Name
                                                </label>
                                                <Input
                                                    required
                                                    placeholder="Doe"
                                                    value={formData.lastName}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, lastName: e.target.value })
                                                    }
                                                    className="bg-white/5 border-white/10 rounded-xl py-5 text-white placeholder:text-white/20 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/30"
                                                />
                                            </div>
                                        </div>

                                        <div className="auth-field space-y-2 mb-4">
                                            <label className="text-xs text-white/40 uppercase tracking-wider font-medium">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                <Input
                                                    type="email"
                                                    required
                                                    placeholder="you@example.com"
                                                    value={formData.email}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, email: e.target.value })
                                                    }
                                                    className="bg-white/5 border-white/10 rounded-xl pl-10 py-5 text-white placeholder:text-white/20 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/30"
                                                />
                                            </div>
                                        </div>

                                        <div className="auth-field space-y-2">
                                            <label className="text-xs text-white/40 uppercase tracking-wider font-medium">
                                                Phone Number
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                <Input
                                                    placeholder="+880 1XXXXXXXXX"
                                                    value={formData.phone}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, phone: e.target.value })
                                                    }
                                                    className="bg-white/5 border-white/10 rounded-xl pl-10 py-5 text-white placeholder:text-white/20 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/30"
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="space-y-2 mb-4">
                                            <label className="text-xs text-white/40 uppercase tracking-wider font-medium">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                    placeholder="Min. 8 characters"
                                                    value={formData.password}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, password: e.target.value })
                                                    }
                                                    className="bg-white/5 border-white/10 rounded-xl pl-10 pr-10 py-5 text-white placeholder:text-white/20 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/30"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>

                                            {/* Password Strength */}
                                            {formData.password && (
                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className="flex gap-1 flex-1">
                                                        {[1, 2, 3, 4].map((i) => (
                                                            <div
                                                                key={i}
                                                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                                                    i <= passwordStrength().score
                                                                        ? passwordStrength().color
                                                                        : "bg-white/5"
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-[10px] text-white/40 uppercase tracking-wider">
                                                        {passwordStrength().label}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <label className="text-xs text-white/40 uppercase tracking-wider font-medium">
                                                Confirm Password
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                <Input
                                                    type="password"
                                                    required
                                                    placeholder="Re-enter your password"
                                                    value={formData.confirmPassword}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, confirmPassword: e.target.value })
                                                    }
                                                    className="bg-white/5 border-white/10 rounded-xl pl-10 py-5 text-white placeholder:text-white/20 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/30"
                                                />
                                                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Terms */}
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                id="terms"
                                                required
                                                checked={formData.agreeTerms}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, agreeTerms: e.target.checked })
                                                }
                                                className="w-4 h-4 mt-0.5 rounded bg-white/5 border-white/10 text-blue-600 focus:ring-blue-500/30"
                                            />
                                            <label htmlFor="terms" className="text-xs text-white/40 leading-relaxed">
                                                I agree to the{" "}
                                                <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                                                    Terms of Service
                                                </Link>{" "}
                                                and{" "}
                                                <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                                                    Privacy Policy
                                                </Link>
                                            </label>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-2">
                                {currentStep === 2 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setCurrentStep(1)}
                                        className="border-white/10 text-white hover:bg-white/5 rounded-xl py-5 px-6"
                                    >
                                        Back
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-5 text-sm font-semibold shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 group disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : currentStep === 1 ? (
                                        <>
                                            Continue
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    ) : (
                                        <>
                                            Create Account
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>

                        {/* Login Link */}
                        <div className="text-center mt-6 pt-5 border-t border-white/5">
                            <p className="text-sm text-white/40">
                                Already have an account?{" "}
                                <Link
                                    href="/auth/login"
                                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
