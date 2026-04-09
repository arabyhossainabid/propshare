'use client';

import { Button } from '@/components/ui/button';

import { useAuth } from '@/contexts/AuthContext';
import { getApiErrorMessage } from '@/lib/api';
import gsap from 'gsap';
import {
  ArrowRight,
  Building2,
  Lock,
  Mail,
  Shield,
  Sparkles,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { AuthInputField } from '@/components/auth/AuthInputField';
import { AuthSidebar } from '@/components/auth/AuthSidebar';

export default function LoginPage() {
  type FormErrors = { email?: string; password?: string; submit?: string };

  const router = useRouter();
  const { login } = useAuth();
  const pageRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        '.auth-left',
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
      );

      tl.fromTo(
        '.auth-card',
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      );

      tl.fromTo(
        '.auth-field',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' },
        '-=0.3'
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!formData.email) {
      newErrors.email = 'Please enter your email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Please enter your password';
    }

    return newErrors;
  };

  const updateField = (field: 'email' | 'password', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const loggedInUser = await login(formData.email, formData.password);
      toast.success('Login successful');
      router.replace(loggedInUser.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (error) {
      const errorMsg =
        getApiErrorMessage(error) || 'Email or password is incorrect';
      setErrors({ submit: errorMsg });
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={pageRef}
      className='min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden'
    >
      {/* Background effects */}
      <div className='absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-blue-600/8 blur-[150px]' />
      <div className='absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[120px]' />
      <div className='absolute inset-0 grid-pattern opacity-10' />

      <div className='relative z-10 w-full max-w-5xl grid lg:grid-cols-2 gap-0 lg:gap-0 h-full items-stretch'>
        <AuthSidebar
          titleStart="Welcome"
          titleHighlight="Back"
          subtitle="Sign in to your account to manage your investments, track returns, and discover new property opportunities."
          benefits={[
            {
              icon: Shield,
              text: 'Bank-grade encryption & security',
              iconBgClass: 'bg-blue-500/10 border border-blue-500/20',
              iconColorClass: 'text-blue-500',
            },
            {
              icon: Sparkles,
              text: '2,500+ active investors trust us',
              iconBgClass: 'bg-emerald-500/10 border border-emerald-500/20',
              iconColorClass: 'text-emerald-500',
            },
          ]}
        />

        {/* Right Side - Login Card */}
        <div className='auth-card bg-card border-l border-border rounded-r-[40px]'>
          <div className='p-8 md:p-10 shadow-3xl h-full flex flex-col justify-center'>
            {/* Mobile Logo */}
            <div className='flex lg:hidden items-center gap-3 mb-8'>
              <div className='w-12 h-12 rounded-2xl bg-linear-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-2xl shadow-blue-500/20'>
                <Building2 className='w-5 h-5 text-white' />
              </div>
              <span className='text-lg font-bold font-heading text-foreground'>
                Prop<span className='text-blue-500'>Share</span>
              </span>
            </div>

            <div className='space-y-2 mb-8'>
              <h2 className='text-2xl font-bold font-heading text-foreground'>Sign In</h2>
              <p className='text-sm text-muted-foreground'>
                Enter your credentials to access your account
              </p>
            </div>

            <div className='auth-field h-1 mb-5' />

            {/* Demo Logins */}
            <div className='auth-field grid grid-cols-2 gap-4 mb-6'>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  setFormData({ email: 'user@propshare.com', password: 'propshare123' });
                  toast.success('User credentials autofilled');
                }}
                className='border-border hover:bg-accent text-muted-foreground hover:text-foreground rounded-xl text-xs h-12'
              >
                <User className='w-4 h-4 mr-2 text-blue-500' />
                User Demo
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  setFormData({ email: 'admin@propshare.com', password: 'propshare123' });
                  toast.success('Admin credentials autofilled');
                }}
                className='border-border hover:bg-accent text-muted-foreground hover:text-foreground rounded-xl text-xs h-12'
              >
                <Shield className='w-4 h-4 mr-2 text-emerald-500' />
                Admin Demo
              </Button>
            </div>

            {/* Social Logins */}
            <div className='auth-field space-y-3 mb-8'>
              <Button
                type='button'
                onClick={async () => {
                  try {
                    const res = await fetch(`http://localhost:8080/api/v1/auth/sign-in/social`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        provider: "google",
                        callbackURL: "http://localhost:3000"
                      }),
                      credentials: "include"
                    });

                    const data = await res.json();
                    if (data.url) {
                      window.location.href = data.url;
                    } else {
                      toast.error(data.message || "Failed to initialize Google login");
                    }
                  } catch (error) {
                    console.error("Google Auth Error:", error);
                    toast.error("Failed to connect to authentication server");
                  }
                }}
                className='w-full bg-background hover:bg-muted text-foreground border border-border rounded-xl py-6 flex items-center justify-center gap-3 transition-all h-12 group shadow-sm'
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className='text-sm font-semibold'>Continue with Google</span>
              </Button>
            </div>

            <div className='auth-field flex items-center gap-4 mb-8'>
              <div className='flex-1 h-px bg-border' />
              <span className='text-[10px] text-muted-foreground/60 font-medium uppercase tracking-widest'>Or email login</span>
              <div className='flex-1 h-px bg-border' />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className='space-y-5'>
              {errors.submit && (
                <div className='auth-field p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 text-sm'>
                  <div className='w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center shrink-0 mt-0.5'>
                    <span className='text-destructive font-bold text-xs'>!</span>
                  </div>
                  <p className='text-destructive'>{errors.submit}</p>
                </div>
              )}

              <AuthInputField
                label="Email Address"
                icon={Mail}
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                error={errors.email}
                inputClassName="pl-12 h-14"
                iconClassName="left-4"
                errorClassName="text-xs"
              />

              <AuthInputField
                label="Password"
                icon={Lock}
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                error={errors.password}
                inputClassName="pl-12 pr-12 h-14"
                iconClassName="left-4"
                errorClassName="text-xs"
              />

              {/* Remember + Forgot */}
              <div className='auth-field flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <input
                    type='checkbox'
                    id='remember'
                    className='w-4 h-4 rounded border-border text-primary focus:ring-primary/30'
                  />
                  <label htmlFor='remember' className='text-sm text-muted-foreground'>
                    Remember me
                  </label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-blue-500 hover:text-blue-600 font-bold transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type='submit'
                disabled={isLoading}
                className='auth-field w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-14 text-sm font-semibold shadow-xl transition-all duration-300 group disabled:opacity-50'
              >
                {isLoading ? (
                  <div className='w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin' />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
                  </>
                )}
              </Button>
            </form>

            {/* Register Link */}
            <div className='auth-field text-center mt-8 pt-6 border-t border-border'>
              <p className='text-sm text-muted-foreground'>
                Don&apos;t have an account?{' '}
                <Link
                  href='/auth/register'
                  className='text-blue-600 hover:text-blue-500 font-bold transition-colors underline-offset-4 hover:underline'
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
