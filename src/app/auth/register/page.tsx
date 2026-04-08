'use client';

import { Button } from '@/components/ui/button';

import { AuthInputField } from '@/components/auth/AuthInputField';
import { AuthSidebar } from '@/components/auth/AuthSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { getApiErrorMessage } from '@/lib/api';
import gsap from 'gsap';
import {
  ArrowRight,
  Building2,
  Check,
  Lock,
  Mail,
  Phone,
  Shield,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  type FormState = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    agreeTerms: boolean;
  };

  type FormErrors = Partial<Record<keyof FormState, string>> & {
    submit?: string;
  };

  const router = useRouter();
  const { register } = useAuth();
  const pageRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
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
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
        '-=0.3'
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  // Animate step change
  useEffect(() => {
    gsap.fromTo(
      '.step-content',
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }
    );
  }, [currentStep]);

  const setField = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep1 = () => {
    const newErrors: FormErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = 'Please enter your first name';
    if (!formData.lastName.trim())
      newErrors.lastName = 'Please enter your last name';
    if (!formData.email) newErrors.email = 'Please enter your email';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Please enter a valid email';
    if (!formData.phone.trim())
      newErrors.phone = 'Please enter your phone number';
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors: FormErrors = {};
    if (!formData.password) newErrors.password = 'Please enter a password';
    else if (formData.password.length < 8)
      newErrors.password = 'Use at least 8 characters';

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeTerms)
      newErrors.agreeTerms = 'Please accept the terms to continue';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (currentStep === 1) {
      const step1Errors = validateStep1();
      if (Object.keys(step1Errors).length > 0) {
        setErrors(step1Errors);
        return;
      }
      setCurrentStep(2);
    } else {
      const step2Errors = validateStep2();
      if (Object.keys(step2Errors).length > 0) {
        setErrors(step2Errors);
        return;
      }

      setIsLoading(true);
      try {
        await register({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          password: formData.password,
          phone: formData.phone.trim(),
        });
        toast.success('Registration successful. Please login.');
        router.push('/auth/login');
      } catch (error) {
        const errorMsg =
          getApiErrorMessage(error) || 'Could not create account. Try again.';
        setErrors({ submit: errorMsg });
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const passwordStrength = () => {
    const pwd = formData.password;
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    const strengths = [
      { score: 1, label: 'Weak', color: 'bg-red-500' },
      { score: 2, label: 'Fair', color: 'bg-amber-500' },
      { score: 3, label: 'Good', color: 'bg-blue-500' },
      { score: 4, label: 'Strong', color: 'bg-emerald-500' },
    ];
    return strengths[score - 1] || { score: 0, label: '', color: '' };
  };

  return (
    <div
      ref={pageRef}
      className='min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden'
    >
      {/* Background */}
      <div className='absolute top-[15%] right-[5%] w-[600px] h-[600px] rounded-full bg-purple-600/5 blur-[150px]' />
      <div className='absolute bottom-[15%] left-[5%] w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[120px]' />
      <div className='absolute inset-0 grid-pattern opacity-20' />

      <div className='relative z-10 w-full max-w-5xl grid lg:grid-cols-2 gap-0'>
        <AuthSidebar
          titleStart='Start Your'
          titleHighlight='Investment Journey'
          subtitle='Create your account in just 2 minutes and unlock access to premium real estate investment opportunities.'
          benefits={[
            { icon: Shield, text: 'Verified & RERA-compliant properties' },
            { icon: TrendingUp, text: '15-25% average annual returns' },
            { icon: Users, text: 'Join 2,500+ smart investors' },
          ]}
        />

        {/* Right Side - Register Card */}
        <div className='auth-card bg-card border-l border-border rounded-r-[40px]'>
          <div className='p-8 md:p-10 shadow-3xl h-full flex flex-col justify-center'>
            {/* Mobile Logo */}
            <div className='flex lg:hidden items-center gap-3 mb-6'>
              <div className='w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-blue-400 flex items-center justify-center'>
                <Building2 className='w-5 h-5 text-white' />
              </div>
              <span className='text-lg font-bold font-heading text-foreground'>
                Prop<span className='text-blue-500'>Share</span>
              </span>
            </div>

            {/* Steps Indicator */}
            <div className='auth-field flex items-center gap-3 mb-8'>
              {[1, 2].map((step) => (
                <div key={step} className='flex items-center gap-3 flex-1'>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 ${
                      currentStep >= step
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-muted text-muted-foreground border border-border'
                    }`}
                  >
                    {currentStep > step ? (
                      <Check className='w-3.5 h-3.5' />
                    ) : (
                      step
                    )}
                  </div>
                  {step < 2 && (
                    <div className='flex-1 h-px rounded-full bg-border'>
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          currentStep > 1
                            ? 'bg-blue-500 w-full'
                            : 'bg-transparent w-0'
                        }`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className='space-y-1 mb-6'>
              <h2 className='text-2xl font-bold font-heading text-foreground'>
                {currentStep === 1 ? 'Personal Info' : 'Secure Your Account'}
              </h2>
              <p className='text-sm text-muted-foreground'>
                {currentStep === 1
                  ? 'Tell us about yourself to get started'
                  : 'Create a strong password to protect your investments'}
              </p>
            </div>

            {/* Social Logins */}
            {currentStep === 1 && (
              <div className='auth-field space-y-3 mb-8'>
                <Button
                  type='button'
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
                  <span className='text-sm font-semibold'>Sign up with Google</span>
                </Button>
                <div className='flex items-center gap-4 py-2'>
                  <div className='flex-1 h-px bg-border' />
                  <span className='text-[10px] text-muted-foreground/60 font-medium uppercase tracking-widest'>Or email register</span>
                  <div className='flex-1 h-px bg-border' />
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className='space-y-4'>
              {errors.submit && (
                <div className='auth-field p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 text-sm mb-4'>
                  <div className='w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center shrink-0 mt-0.5'>
                    <span className='text-destructive font-bold text-xs'>!</span>
                  </div>
                  <p className='text-destructive'>{errors.submit}</p>
                </div>
              )}
              <div className='step-content'>
                {currentStep === 1 ? (
                  <>
                    <div className='grid grid-cols-2 gap-3 mb-4'>
                      <AuthInputField
                        label='First Name'
                        icon={User}
                        placeholder='John'
                        value={formData.firstName}
                        onChange={(e) => setField('firstName', e.target.value)}
                        error={errors.firstName}
                        inputClassName='h-12'
                      />
                      <AuthInputField
                        label='Last Name'
                        icon={User}
                        placeholder='Doe'
                        value={formData.lastName}
                        onChange={(e) => setField('lastName', e.target.value)}
                        error={errors.lastName}
                        inputClassName='h-12'
                      />
                    </div>

                    <div className='mb-4'>
                      <AuthInputField
                        label='Email Address'
                        icon={Mail}
                        type='email'
                        placeholder='you@example.com'
                        value={formData.email}
                        onChange={(e) => setField('email', e.target.value)}
                        error={errors.email}
                        inputClassName='h-12'
                      />
                    </div>

                    <AuthInputField
                      label='Phone Number'
                      icon={Phone}
                      placeholder='+880 1XXXXXXXXX'
                      value={formData.phone}
                      onChange={(e) => setField('phone', e.target.value)}
                      error={errors.phone}
                      inputClassName='h-12'
                    />
                  </>
                ) : (
                  <>
                    <div className='mb-4'>
                      <AuthInputField
                        label='Password'
                        icon={Lock}
                        type='password'
                        placeholder='Min. 8 characters'
                        value={formData.password}
                        onChange={(e) => setField('password', e.target.value)}
                        error={errors.password}
                        inputClassName='h-12'
                      />

                      {/* Password Strength */}
                      {formData.password && !errors.password && (
                        <div className='flex items-center gap-2 mt-2'>
                          <div className='flex gap-1 flex-1'>
                            {[1, 2, 3, 4].map((i) => (
                              <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                  i <= passwordStrength().score
                                    ? passwordStrength().color
                                    : 'bg-muted'
                                }`}
                              />
                            ))}
                          </div>
                          <span className='text-[10px] text-muted-foreground uppercase tracking-widest'>
                            {passwordStrength().label}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className='mb-4'>
                      <AuthInputField
                        label='Confirm Password'
                        icon={Lock}
                        type='password'
                        placeholder='Re-enter your password'
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setField('confirmPassword', e.target.value)
                        }
                        error={errors.confirmPassword}
                        inputClassName='h-12'
                        rightElement={
                          formData.confirmPassword &&
                          formData.password === formData.confirmPassword ? (
                            <Check className='w-4 h-4 text-emerald-500' />
                          ) : undefined
                        }
                      />
                    </div>

                    {/* Terms */}
                    <div className='flex flex-col gap-1'>
                      <div className='flex items-start gap-3'>
                        <input
                          type='checkbox'
                          id='terms'
                          checked={formData.agreeTerms}
                          onChange={(e) =>
                            setField('agreeTerms', e.target.checked)
                          }
                          className='w-4 h-4 mt-0.5 rounded border-border text-primary focus:ring-primary/30'
                        />
                        <label
                          htmlFor='terms'
                          className='text-xs text-muted-foreground leading-relaxed'
                        >
                          I agree to the{' '}
                          <Link
                            href='/terms'
                            className='text-foreground font-bold hover:text-blue-500'
                          >
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link
                            href='/privacy'
                            className='text-foreground font-bold hover:text-blue-500'
                          >
                            Privacy Policy
                          </Link>
                        </label>
                      </div>
                      {errors.agreeTerms && (
                        <p className='text-[10px] text-destructive pl-7'>
                          {errors.agreeTerms}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Buttons */}
              <div className='flex gap-3 pt-2'>
                {currentStep === 2 && (
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setCurrentStep(1)}
                    className='border-border text-foreground hover:bg-accent rounded-xl h-14 px-6'
                  >
                    Back
                  </Button>
                )}
                <Button
                  type='submit'
                  disabled={isLoading}
                  className='flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-14 text-sm font-semibold shadow-xl transition-all duration-300 group disabled:opacity-50'
                >
                  {isLoading ? (
                    <div className='w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin' />
                  ) : currentStep === 1 ? (
                    <>
                      Continue
                      <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Login Link */}
            <div className='text-center mt-6 pt-5 border-t border-border'>
              <p className='text-sm text-muted-foreground'>
                Already have an account?{' '}
                <Link
                  href='/auth/login'
                  className='text-blue-600 hover:text-blue-500 font-bold transition-colors underline-offset-4 hover:underline'
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
