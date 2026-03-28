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
      className='min-h-screen bg-[#0a0f1d] flex items-center justify-center p-6 relative overflow-hidden'
    >
      {/* Background effects */}
      <div className='absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-blue-600/8 blur-[150px]' />
      <div className='absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[120px]' />
      <div className='absolute inset-0 grid-pattern opacity-20' />

      <div className='relative z-10 w-full max-w-5xl grid lg:grid-cols-2 gap-0 lg:gap-0'>
        <AuthSidebar
          titleStart="Welcome"
          titleHighlight="Back"
          subtitle="Sign in to your account to manage your investments, track returns, and discover new property opportunities."
          benefits={[
            {
              icon: Shield,
              text: 'Bank-grade encryption & security',
              iconBgClass: 'bg-blue-500/10 border border-blue-500/20',
              iconColorClass: 'text-blue-400',
            },
            {
              icon: Sparkles,
              text: '2,500+ active investors trust us',
              iconBgClass: 'bg-blue-500/10 border border-blue-500/20',
              iconColorClass: 'text-blue-400',
            },
          ]}
        />

        {/* Right Side - Login Card */}
        <div className='auth-card'>
          <div className='bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-10 shadow-3xl'>
            {/* Mobile Logo */}
            <div className='flex lg:hidden items-center gap-3 mb-8'>
              <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center'>
                <Building2 className='w-5 h-5 text-white' />
              </div>
              <span className='text-lg font-bold font-heading'>
                Prop<span className='text-blue-500'>Share</span>
              </span>
            </div>

            <div className='space-y-2 mb-8'>
              <h2 className='text-2xl font-bold font-heading'>Sign In</h2>
              <p className='text-sm text-white/40'>
                Enter your credentials to access your account
              </p>
            </div>

            <div className='auth-field h-1 mb-5' />

            {/* Form */}
            <form onSubmit={handleSubmit} className='space-y-5'>
              {errors.submit && (
                <div className='auth-field p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-sm'>
                  <div className='w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5'>
                    <span className='text-red-400 font-bold text-xs'>!</span>
                  </div>
                  <p className='text-red-400'>{errors.submit}</p>
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
                inputClassName="pl-11 py-6"
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
                inputClassName="pl-11 pr-11 py-6"
                iconClassName="left-4"
                errorClassName="text-xs"
              />

              {/* Remember me */}
              <div className='auth-field flex items-center'>
                <div className='flex items-center gap-3'>
                  <input
                    type='checkbox'
                    id='remember'
                    className='w-4 h-4 rounded bg-white/5 border-white/10 text-blue-600 focus:ring-blue-500/30'
                  />
                  <label htmlFor='remember' className='text-sm text-white/40'>
                    Remember me
                  </label>
                </div>
              </div>

              <Button
                type='submit'
                disabled={isLoading}
                className='auth-field w-full bg-white/10 hover:bg-white/15 text-white rounded-xl py-6 text-sm font-semibold shadow-2xl shadow-black/20 hover:shadow-black/20 transition-all duration-300 group disabled:opacity-50'
              >
                {isLoading ? (
                  <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
                  </>
                )}
              </Button>
            </form>

            {/* Register Link */}
            <div className='auth-field text-center mt-8 pt-6 border-t border-white/5'>
              <p className='text-sm text-white/40'>
                Don&apos;t have an account?{' '}
                <Link
                  href='/auth/register'
                  className='text-blue-400 hover:text-blue-300 font-medium transition-colors'
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
