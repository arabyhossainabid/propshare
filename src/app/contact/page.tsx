'use client';
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api, getApiErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('loading');
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    try {
      await api.post('/contacts', data);
      setFormState('success');
    } catch (error) {
      setFormState('idle');
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className='min-h-screen bg-background pt-32 pb-20'>
      <div className='container-custom'>
        <div className='max-w-4xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-16'>
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6'>
              <MessageSquare className='w-3 h-3 text-emerald-500' />
              <span className='text-xs font-medium text-emerald-500 uppercase tracking-wider'>Contact Us</span>
            </div>
            <h1 className='text-4xl md:text-5xl font-bold font-heading mb-6 text-foreground'>
              Let's Start a <span className='gradient-text'>Conversation</span>
            </h1>
            <p className='text-muted-foreground text-lg leading-relaxed'>
              Have questions about fractional investing or a specific property? Our experts are here to help.
            </p>
          </div>

          <div className='grid lg:grid-cols-5 gap-12'>
            {/* Contact Info */}
            <div className='lg:col-span-2 space-y-8'>
              <div className='space-y-6'>
                <div className='flex gap-4 p-6 bg-card border border-border rounded-2xl hover:border-blue-500/50 hover:shadow-xl transition-all group'>
                  <div className='w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform'>
                    <Mail className='w-5 h-5 text-blue-500' />
                  </div>
                  <div>
                    <h4 className='text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1'>Email Us</h4>
                    <p className='text-foreground font-bold'>support@propshare.com.bd</p>
                    <p className='text-xs text-blue-500 font-medium mt-1'>Response within 2 hours</p>
                  </div>
                </div>

                <div className='flex gap-4 p-6 bg-card border border-border rounded-2xl hover:border-emerald-500/50 hover:shadow-xl transition-all group'>
                  <div className='w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform'>
                    <Phone className='w-5 h-5 text-emerald-500' />
                  </div>
                  <div>
                    <h4 className='text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1'>Call Us</h4>
                    <p className='text-foreground font-bold'>+880 1700-000000</p>
                    <p className='text-xs text-emerald-500 font-medium mt-1'>Mon-Fri, 9am - 6pm</p>
                  </div>
                </div>

                <div className='flex gap-4 p-6 bg-card border border-border rounded-2xl hover:border-purple-500/50 hover:shadow-xl transition-all group'>
                  <div className='w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform'>
                    <MapPin className='w-5 h-5 text-purple-500' />
                  </div>
                  <div>
                    <h4 className='text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1'>Our Office</h4>
                    <p className='text-foreground font-bold'>Gulshan-2, Dhaka, Bangladesh</p>
                    <p className='text-xs text-purple-500 font-medium mt-1'>HQ & Innovation Lab</p>
                  </div>
                </div>
              </div>

              <div className='p-8 bg-linear-to-br from-blue-600/5 to-transparent border border-border rounded-3xl shadow-sm'>
                <div className='flex items-center gap-2 mb-6'>
                  <Clock className='w-4 h-4 text-blue-500' />
                  <span className='font-bold text-sm text-foreground uppercase tracking-widest'>Business Hours</span>
                </div>
                <div className='space-y-4 text-sm'>
                  <div className='flex justify-between items-center'>
                    <span className='text-muted-foreground'>Sunday - Thursday</span> 
                    <span className='text-foreground font-bold'>9:00 AM - 8:00 PM</span>
                  </div>
                  <div className='flex justify-between items-center border-t border-border pt-3'>
                    <span className='text-muted-foreground'>Friday</span> 
                    <span className='text-destructive font-bold'>Closed</span>
                  </div>
                  <div className='flex justify-between items-center border-t border-border pt-3'>
                    <span className='text-muted-foreground'>Saturday</span> 
                    <span className='text-foreground font-bold'>10:00 AM - 4:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className='lg:col-span-3'>
              <div className='bg-card border border-border rounded-[32px] p-8 md:p-10 shadow-2xl shadow-black/5'>
                {formState === 'success' ? (
                  <div className='h-[400px] flex flex-col items-center justify-center text-center space-y-6'>
                    <div className='w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center animate-bounce'>
                      <Send className='w-10 h-10 text-emerald-500' />
                    </div>
                    <div className='space-y-3'>
                      <h3 className='text-3xl font-bold text-foreground font-heading'>Message Sent!</h3>
                      <p className='text-muted-foreground max-w-xs'>We've received your inquiry and will get back to you within 24 hours.</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setFormState('idle')}
                      className='rounded-xl border-border px-8'
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className='grid md:grid-cols-2 gap-6'>
                      <div className='space-y-2'>
                        <label className='text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 block ml-1'>Full Name</label>
                        <Input 
                          name='name'
                          placeholder='e.g. Arab Hossain' 
                          required 
                          className='bg-muted/50 border-border rounded-xl h-14 px-5 focus:border-blue-500/50 text-foreground placeholder:text-muted-foreground/50'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label className='text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 block ml-1'>Email Address</label>
                        <Input 
                          name='email'
                          type='email' 
                          placeholder='name@example.com' 
                          required 
                          className='bg-muted/50 border-border rounded-xl h-14 px-5 focus:border-blue-500/50 text-foreground placeholder:text-muted-foreground/50'
                        />
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <label className='text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 block ml-1'>Subject</label>
                      <Input 
                        name='subject'
                        placeholder='How can we help?' 
                        required 
                        className='bg-muted/50 border-border rounded-xl h-14 px-5 focus:border-blue-500/50 text-foreground placeholder:text-muted-foreground/50'
                      />
                    </div>
                    <div className='space-y-2'>
                      <label className='text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 block ml-1'>Your Message</label>
                      <textarea 
                        name='message'
                        required 
                        rows={5}
                        placeholder='Detail your inquiry here...'
                        className='w-full bg-muted/50 border border-border rounded-xl p-5 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-blue-500/50 transition-all resize-none'
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={formState === 'loading'}
                      className='w-full h-15 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold group shadow-lg shadow-blue-500/25 transition-all text-lg'
                    >
                      {formState === 'loading' ? (
                        'Sending Message...'
                      ) : (
                        <>
                          Send Message
                          <Send className='w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform' />
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
