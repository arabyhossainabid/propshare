'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { api, getApiErrorMessage, normalizeItem } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Building2,
  CheckCircle,
  Clock,
  Globe,
  Headphones,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

gsap.registerPlugin(ScrollTrigger);

const contactInfo = [
  {
    icon: MapPin,
    title: 'Head Office',
    details: ['Road 11, Block E', 'Banani, Dhaka 1213', 'Bangladesh'],
    color: 'blue',
  },
  {
    icon: Phone,
    title: 'Phone Numbers',
    details: ['+880 1XXXXXXXXX (Sales)', '+880 1XXXXXXXXX (Support)'],
    color: 'emerald',
  },
  {
    icon: Mail,
    title: 'Email Us',
    details: [
      'hello@propshare.com',
      'support@propshare.com',
      'invest@propshare.com',
    ],
    color: 'purple',
  },
  {
    icon: Clock,
    title: 'Office Hours',
    details: [
      'Monday - Friday: 9AM - 6PM',
      'Saturday: 10AM - 4PM',
      'Sunday: Closed',
    ],
    color: 'amber',
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/20',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
  },
};

const quickActions = [
  {
    icon: Headphones,
    title: 'Live Chat Support',
    description: 'Chat with our team in real-time for instant help.',
    cta: 'Start Chat',
    color: 'blue',
  },
  {
    icon: Building2,
    title: 'Schedule Visit',
    description: 'Visit our office for a personal consultation.',
    cta: 'Book Appointment',
    color: 'emerald',
  },
  {
    icon: Globe,
    title: 'Join Community',
    description: 'Connect with 2,500+ investors in our community.',
    cta: 'Join Now',
    color: 'purple',
  },
];

export default function ContactPage() {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: contactCms } = useQuery({
    queryKey: ['cms-contact'],
    queryFn: async () => {
      try {
        const res = await api.get<{
          success: true;
          message: string;
          data: { title?: string; content?: string; updatedAt?: string } | null;
        }>('/content/contact');

        return normalizeItem<{
          title?: string;
          content?: string;
          updatedAt?: string;
        }>(res.data.data);
      } catch {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  const contactMutation = useMutation({
    mutationFn: async () => {
      await api.post('/contacts', {
        name: formData.name,
        email: formData.email,
        subject: formData.subject || undefined,
        message: formData.message,
      });
    },
    onSuccess: async () => {
      setIsSubmitted(true);
      toast.success('Message sent successfully');
      await queryClient.invalidateQueries({
        queryKey: ['dashboard-contact-messages'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['admin-contact-messages'],
      });
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      }, 3000);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.page-header',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.quick-action',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.3,
        }
      );

      gsap.fromTo(
        '.contact-info-item',
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.contact-main',
            start: 'top 85%',
          },
        }
      );

      gsap.fromTo(
        '.contact-form-wrapper',
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.contact-main',
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate();
  };

  return (
    <div ref={sectionRef} className='min-h-screen bg-[#0a0f1d] pt-28 pb-20'>
      <div className='container-custom'>
        {/* Page Header */}
        <div className='page-header text-center space-y-4 mb-16'>
          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mx-auto'>
            <MessageSquare className='w-3 h-3 text-cyan-400' />
            <span className='text-xs font-medium text-cyan-400 uppercase tracking-wider'>
              Get in Touch
            </span>
          </div>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold font-heading'>
            {contactCms?.title ? (
              <>
                {contactCms.title.split(' ').slice(0, -1).join(' ') ||
                  contactCms.title}{' '}
                <span className='gradient-text'>
                  {contactCms.title.split(' ').slice(-1).join(' ')}
                </span>
              </>
            ) : (
              <>
                Contact <span className='gradient-text'>Our Team</span>
              </>
            )}
          </h1>
          <p className='text-white/40 text-lg max-w-2xl mx-auto'>
            {contactCms?.content ||
              'Have questions about investing with PropShare? Our team of experts is here to help you make informed decisions.'}
          </p>
          {contactCms?.updatedAt && (
            <p className='text-xs text-white/30'>
              Updated: {new Date(contactCms.updatedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className='grid md:grid-cols-3 gap-4 mb-20'>
          {quickActions.map((action) => {
            const Icon = action.icon;
            const colors = colorMap[action.color];
            return (
              <div
                key={action.title}
                className='quick-action group cursor-pointer'
              >
                <div className='bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 h-full flex flex-col'>
                  <div
                    className={`w-12 h-12 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <h3 className='text-base font-bold text-white mb-2'>
                    {action.title}
                  </h3>
                  <p className='text-sm text-white/40 mb-4 flex-1'>
                    {action.description}
                  </p>
                  <Button
                    variant='outline'
                    className='w-full border-white/10 text-white hover:bg-white/5 rounded-xl text-sm'
                  >
                    {action.cta}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Contact Section */}
        <div className='contact-main grid lg:grid-cols-5 gap-8'>
          {/* Info Cards */}
          <div className='lg:col-span-2 space-y-4'>
            <h2 className='text-2xl font-bold font-heading mb-6'>
              Reach Out <span className='gradient-text'>Directly</span>
            </h2>
            {contactInfo.map((info) => {
              const Icon = info.icon;
              const colors = colorMap[info.color];
              return (
                <div key={info.title} className='contact-info-item group'>
                  <div className='flex items-start gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300'>
                    <div
                      className={`w-12 h-12 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div>
                      <h3 className='text-sm font-semibold text-white mb-1.5'>
                        {info.title}
                      </h3>
                      {info.details.map((detail) => (
                        <p key={detail} className='text-sm text-white/40'>
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Map Placeholder */}
            <div className='bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden h-48 flex items-center justify-center'>
              <div className='text-center space-y-2'>
                <MapPin className='w-8 h-8 text-white/10 mx-auto' />
                <p className='text-xs text-white/20'>Interactive Map</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className='contact-form-wrapper lg:col-span-3'>
            <div className='bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-3xl p-8 md:p-10'>
              <h2 className='text-2xl font-bold font-heading mb-2'>
                Send us a <span className='gradient-text'>Message</span>
              </h2>
              <p className='text-sm text-white/40 mb-8'>
                Fill out the form below and we&apos;ll get back to you within 24
                hours.
              </p>

              {isSubmitted ? (
                <div className='text-center py-16 space-y-4'>
                  <div className='w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mx-auto'>
                    <CheckCircle className='w-10 h-10 text-emerald-400' />
                  </div>
                  <h3 className='text-xl font-bold text-white'>
                    Message Sent Successfully!
                  </h3>
                  <p className='text-white/40'>
                    Thank you for reaching out. We&apos;ll respond within 24
                    hours.
                  </p>
                  {isAuthenticated && (
                    <div className='pt-2'>
                      <Link
                        href={
                          user?.role === 'ADMIN'
                            ? '/admin/messages'
                            : '/dashboard/messages'
                        }
                      >
                        <Button
                          variant='outline'
                          className='border-white/10 text-white hover:bg-white/5 rounded-xl'
                        >
                          Open Message Inbox
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className='space-y-5'>
                  <div className='grid md:grid-cols-2 gap-5'>
                    <div className='space-y-2'>
                      <label className='text-xs text-white/40 uppercase tracking-wider font-medium'>
                        Full Name *
                      </label>
                      <Input
                        required
                        placeholder='John Doe'
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className='bg-white/5 border-white/10 rounded-xl py-5 text-white placeholder:text-white/20 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/30'
                      />
                    </div>
                    <div className='space-y-2'>
                      <label className='text-xs text-white/40 uppercase tracking-wider font-medium'>
                        Email Address *
                      </label>
                      <Input
                        type='email'
                        required
                        placeholder='john@example.com'
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className='bg-white/5 border-white/10 rounded-xl py-5 text-white placeholder:text-white/20 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/30'
                      />
                    </div>
                  </div>

                  <div className='grid md:grid-cols-2 gap-5'>
                    <div className='space-y-2'>
                      <label className='text-xs text-white/40 uppercase tracking-wider font-medium'>
                        Phone Number
                      </label>
                      <Input
                        placeholder='+880 1XXXXXXXXX'
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className='bg-white/5 border-white/10 rounded-xl py-5 text-white placeholder:text-white/20 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/30'
                      />
                    </div>
                    <div className='space-y-2'>
                      <label className='text-xs text-white/40 uppercase tracking-wider font-medium'>
                        Subject *
                      </label>
                      <Input
                        required
                        placeholder='How can we help?'
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        className='bg-white/5 border-white/10 rounded-xl py-5 text-white placeholder:text-white/20 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/30'
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <label className='text-xs text-white/40 uppercase tracking-wider font-medium'>
                      Message *
                    </label>
                    <textarea
                      required
                      placeholder='Tell us about your investment goals or ask any questions...'
                      rows={6}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className='w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 outline-none resize-none transition-all'
                    />
                  </div>

                  <Button
                    type='submit'
                    disabled={contactMutation.isPending}
                    className='w-full bg-white/10 hover:bg-white/15 text-white rounded-2xl py-6 text-sm font-semibold shadow-2xl shadow-black/20 hover:shadow-black/20 transition-all duration-300 group'
                  >
                    {contactMutation.isPending ? 'Sending...' : 'Send Message'}
                    <Send className='w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform' />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
