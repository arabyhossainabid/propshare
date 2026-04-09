'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api, getApiErrorMessage } from '@/lib/api';
import { ArrowLeft, Mail, Send, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import gsap from 'gsap';

export default function ForgotPasswordPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      '.auth-card',
      { opacity: 0, y: 20, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setIsSent(true);
      toast.success('Reset link sent to your email');
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className='min-h-screen bg-background flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent'
    >
      <div className='auth-card w-full max-w-md'>
        <div className='bg-card border border-border rounded-3xl p-8 md:p-10 shadow-2xl shadow-blue-500/5 relative overflow-hidden group'>
          {/* Background Decorative Element */}
          <div className='absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors duration-700' />

          <div className='relative space-y-8'>
            {/* Header */}
            <div className='space-y-2'>
              <Link
                href="/auth/login"
                className='inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-blue-500 transition-colors mb-4'
              >
                <ArrowLeft className='w-3 h-3' />
                Back to Sign In
              </Link>
              <h1 className='text-3xl font-bold font-heading text-foreground'>
                Reset <span className='text-blue-500'>Password</span>
              </h1>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                {isSent
                  ? "We've sent a recovery link to your email address."
                  : "Enter your email and we'll send you a link to reset your password."}
              </p>
            </div>

            {isSent ? (
              <div className='py-8 text-center space-y-6'>
                <div className='w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto'>
                  <CheckCircle2 className='w-10 h-10 text-emerald-500' />
                </div>
                <div className='space-y-4'>
                  <p className='text-sm text-muted-foreground'>
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                  <Button
                    onClick={() => setIsSent(false)}
                    variant="outline"
                    className="border-border rounded-xl px-8"
                  >
                    Try Another Email
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='space-y-2'>
                  <label className='text-[10px] text-muted-foreground uppercase tracking-widest font-bold ml-1'>
                    Email Address
                  </label>
                  <div className='relative'>
                    <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60' />
                    <Input
                      type='email'
                      placeholder='you@example.com'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className='bg-muted/50 border-border rounded-xl pl-12 h-14 text-foreground focus-visible:ring-blue-500/30'
                    />
                  </div>
                </div>

                <Button
                  type='submit'
                  disabled={isLoading || !email}
                  className='w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-14 text-sm font-bold shadow-xl shadow-blue-500/20 transition-all group'
                >
                  {isLoading ? (
                    <Loader2 className='w-5 h-5 animate-spin' />
                  ) : (
                    <>
                      Send Reset Link
                      <Send className='w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform' />
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Footer */}
            <div className='text-center pt-4'>
              <p className='text-xs text-muted-foreground'>
                Need help? <Link href="/contact" className='text-blue-500 font-bold hover:underline'>Contact Support</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
