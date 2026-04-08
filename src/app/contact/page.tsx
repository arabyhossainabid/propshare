'use client';

import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function ContactPage() {
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    setTimeout(() => setFormState('success'), 1500);
  };

  return (
    <div className='min-h-screen bg-background pt-32 pb-20'>
      <div className='container-custom'>
        <div className='max-w-4xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-16'>
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6'>
              <MessageSquare className='w-3 h-3 text-emerald-400' />
              <span className='text-xs font-medium text-emerald-400 uppercase tracking-wider'>Contact Us</span>
            </div>
            <h1 className='text-4xl md:text-5xl font-bold font-heading mb-6'>
              Let's Start a <span className='gradient-text'>Conversation</span>
            </h1>
            <p className='text-white/40 text-lg'>
              Have questions about fractional investing or a specific property? Our experts are here to help.
            </p>
          </div>

          <div className='grid lg:grid-cols-5 gap-12'>
            {/* Contact Info */}
            <div className='lg:col-span-2 space-y-8'>
              <div className='space-y-6'>
                <div className='flex gap-4 p-6 bg-card border border-white/5 rounded-2xl hover:border-blue-500/20 transition-all'>
                  <div className='w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0'>
                    <Mail className='w-5 h-5 text-blue-400' />
                  </div>
                  <div>
                    <h4 className='text-sm text-white/40 uppercase tracking-widest font-bold mb-1'>Email Us</h4>
                    <p className='text-white font-medium'>support@propshare.com.bd</p>
                    <p className='text-xs text-blue-400 mt-1'>Response within 2 hours</p>
                  </div>
                </div>

                <div className='flex gap-4 p-6 bg-card border border-white/5 rounded-2xl hover:border-blue-500/20 transition-all'>
                  <div className='w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0'>
                    <Phone className='w-5 h-5 text-emerald-400' />
                  </div>
                  <div>
                    <h4 className='text-sm text-white/40 uppercase tracking-widest font-bold mb-1'>Call Us</h4>
                    <p className='text-white font-medium'>+880 1700-000000</p>
                    <p className='text-xs text-emerald-400 mt-1'>Mon-Fri, 9am - 6pm</p>
                  </div>
                </div>

                <div className='flex gap-4 p-6 bg-card border border-white/5 rounded-2xl hover:border-blue-500/20 transition-all'>
                  <div className='w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0'>
                    <MapPin className='w-5 h-5 text-purple-400' />
                  </div>
                  <div>
                    <h4 className='text-sm text-white/40 uppercase tracking-widest font-bold mb-1'>Our Office</h4>
                    <p className='text-white font-medium'>Gulshan-2, Dhaka, Bangladesh</p>
                    <p className='text-xs text-purple-400 mt-1'>HQ & Innovation Lab</p>
                  </div>
                </div>
              </div>

              <div className='p-8 bg-linear-to-br from-blue-600/20 to-transparent border border-white/5 rounded-3xl'>
                <div className='flex items-center gap-2 mb-4'>
                  <Clock className='w-4 h-4 text-blue-400' />
                  <span className='font-bold text-sm'>Business Hours</span>
                </div>
                <div className='space-y-2 text-sm text-white/40'>
                  <div className='flex justify-between'><span>Sunday - Thursday:</span> <span className='text-white'>9:00 AM - 8:00 PM</span></div>
                  <div className='flex justify-between'><span>Friday:</span> <span className='text-white'>Closed</span></div>
                  <div className='flex justify-between'><span>Saturday:</span> <span className='text-white'>10:00 AM - 4:00 PM</span></div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className='lg:col-span-3'>
              <div className='bg-card border border-white/5 rounded-[32px] p-8 md:p-10 shadow-3xl shadow-black/40'>
                {formState === 'success' ? (
                  <div className='h-[400px] flex flex-col items-center justify-center text-center space-y-6'>
                    <div className='w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center'>
                      <Send className='w-10 h-10 text-emerald-400' />
                    </div>
                    <div className='space-y-2'>
                      <h3 className='text-2xl font-bold'>Message Sent Successfully!</h3>
                      <p className='text-white/40'>We've received your inquiry and will get back to you within 24 hours.</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setFormState('idle')}
                      className='rounded-xl border-white/10'
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className='grid md:grid-cols-2 gap-6'>
                      <div className='space-y-2'>
                        <label className='text-sm font-medium text-white/60 ml-1'>Full Name</label>
                        <Input 
                          placeholder='e.g. Arab Hossain' 
                          required 
                          className='bg-white/5 border-white/10 rounded-xl h-14 px-5 focus:border-blue-500/50'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label className='text-sm font-medium text-white/60 ml-1'>Email Address</label>
                        <Input 
                          type='email' 
                          placeholder='name@example.com' 
                          required 
                          className='bg-white/5 border-white/10 rounded-xl h-14 px-5 focus:border-blue-500/50'
                        />
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-white/60 ml-1'>Subject</label>
                      <Input 
                        placeholder='How can we help?' 
                        required 
                        className='bg-white/5 border-white/10 rounded-xl h-14 px-5 focus:border-blue-500/50'
                      />
                    </div>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-white/60 ml-1'>Your Message</label>
                      <textarea 
                        required 
                        rows={5}
                        placeholder='Detail your inquiry here...'
                        className='w-full bg-white/5 border border-white/10 rounded-xl p-5 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 transition-all resize-none'
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={formState === 'loading'}
                      className='w-full h-14 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold group'
                    >
                      {formState === 'loading' ? (
                        'Sending Message...'
                      ) : (
                        <>
                          Send Message
                          <Send className='w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform' />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
