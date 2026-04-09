'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api, getApiErrorMessage, normalizeItem } from '@/lib/api';
import { Property } from '@/lib/api-types';
import { useMutation, useQuery } from '@tanstack/react-query';
import gsap from 'gsap';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  CreditCard,
  Info,
  Landmark,
  Lock,
  MapPin,
  Shield,
  Smartphone,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

type PaymentMethod = 'card' | 'bkash' | 'nagad' | 'bank';

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('propertyId') || '';
  const isLegacyNumericPropertyId = /^\d+$/.test(propertyId);
  const pageRef = useRef<HTMLDivElement>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [shares, setShares] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const transactionId = 'TXN-PS28X7KM';

  const fallbackProperty = {
    title: 'Luxury Waterfront Apartment',
    location: 'Gulshan, Dhaka',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600&auto=format&fit=crop',
    pricePerShare: 50000,
    totalShares: 300,
    availableShares: 84,
    category: 'Residential',
    expectedReturn: '22%',
  };

  const { data: propertyData, isLoading: isLoadingProperty } = useQuery({
    queryKey: ['checkout-property', propertyId],
    queryFn: async () => {
      const res = await api.get<{
        success: true;
        message: string;
        data: Property | { data?: Property };
      }>(`/properties/${propertyId}`);
      return normalizeItem<Property>(res.data.data);
    },
    enabled: Boolean(propertyId) && !isLegacyNumericPropertyId,
  });

  const property = {
    title: propertyData?.title || fallbackProperty.title,
    location: propertyData?.location || fallbackProperty.location,
    image: propertyData?.images?.[0] || fallbackProperty.image,
    pricePerShare:
      propertyData?.pricePerShare || fallbackProperty.pricePerShare,
    totalShares: propertyData?.totalShares || fallbackProperty.totalShares,
    availableShares:
      propertyData?.availableShares ?? fallbackProperty.availableShares,
    category: propertyData?.category?.name || fallbackProperty.category,
    expectedReturn: propertyData?.expectedReturn
      ? `${propertyData.expectedReturn}%`
      : fallbackProperty.expectedReturn,
  };

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      if (!propertyId) throw new Error('Missing propertyId');
      if (isLegacyNumericPropertyId) {
        throw new Error(
          'Invalid property link. Please open a property from the properties page and try again.'
        );
      }
      const normalizedShares = Math.max(1, Math.floor(Number(shares) || 1));
      const res = await api.post<{
        success: true;
        message: string;
        data: { url: string } | string;
      }>(`/investments/checkout/${propertyId}`, { shares: normalizedShares });

      const payload = res.data.data;
      if (typeof payload === 'string') return payload;
      return payload.url;
    },
    onSuccess: (url) => {
      if (!url) {
        toast.error('Checkout URL not returned');
        return;
      }
      setIsComplete(true);
      window.location.href = url;
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const totalAmount = shares * property.pricePerShare;
  const platformFee = Math.round(totalAmount * 0.02);
  const grandTotal = totalAmount + platformFee;

  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.payment-header',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.payment-left',
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
      );

      gsap.fromTo(
        '.payment-right',
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!propertyId) {
      toast.error('Missing property reference');
      return;
    }

    if (isLegacyNumericPropertyId) {
      toast.error(
        'Invalid property link detected. Please choose a property again.'
      );
      return;
    }

    setIsProcessing(true);
    checkoutMutation.mutate(undefined, {
      onSettled: () => setIsProcessing(false),
    });
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/.{1,4}/g);
    return matches ? matches.join(' ') : v;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/[^0-9]/g, '');
    if (v.length >= 2) return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    return v;
  };

  // Success Screen
  if (isComplete) {
    return (
      <div
        ref={pageRef}
        className='min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden'
      >
        <div className='absolute inset-0 grid-pattern opacity-10' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-600/10 blur-[200px]' />

        <div className='success-content relative z-10 text-center max-w-lg space-y-8'>
          <div className='w-24 h-24 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10'>
            <CheckCircle className='w-12 h-12 text-emerald-500' />
          </div>

          <div className='space-y-3'>
            <h1 className='text-3xl md:text-4xl font-bold font-heading text-foreground'>
              Investment <span className='text-emerald-500'>Successful!</span>
            </h1>
            <p className='text-muted-foreground leading-relaxed'>
              Congratulations! You have successfully invested in{' '}
              <span className='text-foreground font-medium'>{property.title}</span>.
              Your {shares} shares have been credited to your portfolio.
            </p>
          </div>

          <div className='bg-card border border-border rounded-2xl p-6 space-y-4 text-left shadow-sm'>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Transaction ID</span>
              <span className='text-foreground font-mono'>{transactionId}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Shares Purchased</span>
              <span className='text-foreground font-medium'>{shares} Shares</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Total Amount</span>
              <span className='text-emerald-500 font-bold'>
                ৳{grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <div className='flex flex-col sm:flex-row gap-3'>
            <Link href='/properties' className='flex-1'>
              <Button
                variant='outline'
                className='w-full border-border text-foreground hover:bg-accent rounded-xl py-5 h-auto'
              >
                Browse More
              </Button>
            </Link>
            <Link href='/dashboard' className='flex-1'>
              <Button className='w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-5 h-auto group'>
                Go to Dashboard
                <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className='min-h-screen bg-background pt-28 pb-20'>
      <div className='absolute inset-0 grid-pattern opacity-10' />
      <div className='absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[150px]' />

      <div className='container-custom relative z-10'>
        {/* Header */}
        <div className='payment-header mb-12'>
          <Link
            href='/properties'
            className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6'
          >
            <ArrowLeft className='w-4 h-4' />
            Back to Properties
          </Link>
          <h1 className='text-3xl md:text-4xl font-bold font-heading text-foreground'>
            Complete Your <span className='gradient-text'>Investment</span>
          </h1>
          <p className='text-muted-foreground mt-2'>
            Review your investment details and choose a payment method.
          </p>
          {isLoadingProperty && (
            <p className='text-xs text-blue-500/80 mt-2'>
              Loading property details...
            </p>
          )}
        </div>

        <div className='grid lg:grid-cols-5 gap-8'>
          {/* Left - Payment Form */}
          <div className='payment-left lg:col-span-3 space-y-6'>
            {/* Share Selection */}
            <div className='bg-card border border-border rounded-3xl p-8 shadow-sm'>
              <h3 className='text-lg font-bold mb-6 flex items-center gap-2 text-foreground'>
                <div className='w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center'>
                  <span className='text-sm font-bold text-blue-500'>1</span>
                </div>
                Select Shares
              </h3>

              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>
                    Number of Shares
                  </span>
                  <span className='text-sm text-muted-foreground'>
                    Available:{' '}
                    <span className='text-foreground font-medium'>
                      {property.availableShares}
                    </span>
                  </span>
                </div>

                <div className='flex items-center gap-4'>
                  <button
                    onClick={() => setShares(Math.max(1, shares - 1))}
                    className='w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors text-xl font-bold'
                  >
                    -
                  </button>
                  <div className='flex-1'>
                    <Input
                      type='number'
                      min={1}
                      max={property.availableShares}
                      value={shares}
                      onChange={(e) =>
                        setShares(
                          Math.min(
                            property.availableShares,
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        )
                      }
                      className='bg-muted border-border rounded-xl py-5 text-center text-2xl font-bold text-foreground focus-visible:ring-blue-500/30'
                    />
                  </div>
                  <button
                    onClick={() =>
                      setShares(Math.min(property.availableShares, shares + 1))
                    }
                    className='w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors text-xl font-bold'
                  >
                    +
                  </button>
                </div>

                {/* Quick amounts */}
                <div className='flex gap-2'>
                  {[5, 10, 25, 50].map((amount) => (
                    <button
                      key={amount}
                      onClick={() =>
                        setShares(Math.min(property.availableShares, amount))
                      }
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border ${
                        shares === amount
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20'
                          : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground border-border'
                      }`}
                    >
                      {amount}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className='bg-card border border-border rounded-3xl p-8 shadow-sm'>
              <h3 className='text-lg font-bold mb-6 flex items-center gap-2 text-foreground'>
                <div className='w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center'>
                  <span className='text-sm font-bold text-blue-500'>2</span>
                </div>
                Payment Method
              </h3>

              {/* Method Selection */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-6'>
                {(
                  [
                    { id: 'card', icon: CreditCard, label: 'Card' },
                    { id: 'bkash', icon: Smartphone, label: 'bKash' },
                    { id: 'nagad', icon: Wallet, label: 'Nagad' },
                    { id: 'bank', icon: Landmark, label: 'Bank' },
                  ] as {
                    id: PaymentMethod;
                    icon: React.ElementType;
                    label: string;
                  }[]
                ).map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${
                        paymentMethod === method.id
                          ? 'bg-blue-500/10 border-blue-500/30 shadow-lg shadow-blue-500/10'
                          : 'bg-muted border-border hover:bg-accent hover:border-border/80'
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          paymentMethod === method.id
                            ? 'text-blue-500'
                            : 'text-muted-foreground'
                        }`}
                      />
                      <span
                        className={`text-xs font-bold uppercase tracking-widest ${
                          paymentMethod === method.id
                            ? 'text-blue-500'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {method.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Payment Form Content */}
              <form onSubmit={handlePayment} className='space-y-4'>
                {paymentMethod === 'card' && (
                  <>
                    <div className='space-y-2'>
                      <label className='text-xs text-muted-foreground uppercase tracking-wider font-bold'>
                        Card Number
                      </label>
                      <div className='relative'>
                        <CreditCard className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50' />
                        <Input
                          required
                          placeholder='4242 4242 4242 4242'
                          value={cardData.number}
                          onChange={(e) =>
                            setCardData({
                              ...cardData,
                              number: formatCardNumber(e.target.value),
                            })
                          }
                          maxLength={19}
                          className='bg-muted border-border rounded-xl pl-11 py-5 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-blue-500/30 font-mono tracking-wider'
                        />
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <label className='text-xs text-muted-foreground uppercase tracking-wider font-bold'>
                        Cardholder Name
                      </label>
                      <Input
                        required
                        placeholder='John Doe'
                        value={cardData.name}
                        onChange={(e) =>
                          setCardData({ ...cardData, name: e.target.value })
                        }
                        className='bg-muted border-border rounded-xl py-5 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-blue-500/30'
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-3'>
                      <div className='space-y-2'>
                        <label className='text-xs text-muted-foreground uppercase tracking-wider font-bold'>
                          Expiry Date
                        </label>
                        <Input
                          required
                          placeholder='MM/YY'
                          value={cardData.expiry}
                          onChange={(e) =>
                            setCardData({
                              ...cardData,
                              expiry: formatExpiry(e.target.value),
                            })
                          }
                          maxLength={5}
                          className='bg-muted border-border rounded-xl py-5 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-blue-500/30 font-mono'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label className='text-xs text-muted-foreground uppercase tracking-wider font-bold'>
                          CVV
                        </label>
                        <Input
                          required
                          type='password'
                          placeholder='•••'
                          value={cardData.cvv}
                          onChange={(e) =>
                            setCardData({
                              ...cardData,
                              cvv: e.target.value.replace(/\D/g, ''),
                            })
                          }
                          maxLength={4}
                          className='bg-muted border-border rounded-xl py-5 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-blue-500/30 font-mono'
                        />
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod === 'bkash' && (
                  <div className='space-y-4'>
                    <div className='bg-rose-500/5 border border-rose-500/20 rounded-2xl p-5 text-center space-y-3'>
                      <div className='w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mx-auto'>
                        <Smartphone className='w-8 h-8 text-rose-500' />
                      </div>
                      <h4 className='text-base font-bold text-foreground'>
                        Pay with bKash
                      </h4>
                      <p className='text-xs text-muted-foreground'>
                        Enter your bKash number to receive a payment prompt
                      </p>
                    </div>
                    <div className='space-y-2'>
                      <label className='text-xs text-muted-foreground uppercase tracking-wider font-bold'>
                        bKash Number
                      </label>
                      <div className='relative'>
                        <Smartphone className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50' />
                        <Input
                          required
                          placeholder='01XXXXXXXXX'
                          className='bg-muted border-border rounded-xl pl-11 py-5 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-blue-500/30'
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'nagad' && (
                  <div className='space-y-4'>
                    <div className='bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 text-center space-y-3'>
                      <div className='w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto'>
                        <Wallet className='w-8 h-8 text-amber-500' />
                      </div>
                      <h4 className='text-base font-bold text-foreground'>
                        Pay with Nagad
                      </h4>
                      <p className='text-xs text-muted-foreground'>
                        Enter your Nagad number to receive a payment prompt
                      </p>
                    </div>
                    <div className='space-y-2'>
                      <label className='text-xs text-muted-foreground uppercase tracking-wider font-bold'>
                        Nagad Number
                      </label>
                      <div className='relative'>
                        <Wallet className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50' />
                        <Input
                          required
                          placeholder='01XXXXXXXXX'
                          className='bg-muted border-border rounded-xl pl-11 py-5 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-blue-500/30'
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div className='space-y-4'>
                    <div className='bg-card border border-border rounded-2xl p-5 space-y-3'>
                      <div className='flex items-center gap-3 mb-2'>
                        <div className='w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center'>
                          <Landmark className='w-5 h-5 text-blue-500' />
                        </div>
                        <div>
                          <h4 className='text-sm font-bold text-foreground'>
                            Bank Transfer
                          </h4>
                          <p className='text-xs text-muted-foreground'>
                            Transfer to our bank account
                          </p>
                        </div>
                      </div>
                      <div className='space-y-2.5 text-sm border-t border-border pt-3'>
                        <div className='flex justify-between'>
                          <span className='text-muted-foreground'>Bank Name</span>
                          <span className='text-foreground font-mono font-bold'>
                            Dutch-Bangla Bank
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-muted-foreground'>Account No</span>
                          <span className='text-foreground font-mono font-bold'>
                            1234 5678 9012
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-muted-foreground'>Branch</span>
                          <span className='text-foreground font-mono font-bold'>
                            Gulshan, Dhaka
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3'>
                      <AlertCircle className='w-4 h-4 shrink-0 mt-0.5' />
                      <span>
                        Bank transfers may take 1-2 business days to process.
                      </span>
                    </div>
                  </div>
                )}

                {/* Security Notice */}
                <div className='flex items-center gap-3 pt-4 px-1'>
                  <Lock className='w-4 h-4 text-emerald-500 shrink-0' />
                  <span className='text-xs text-muted-foreground'>
                    Your payment is secured with 256-bit SSL encryption
                  </span>
                </div>

                {/* Submit */}
                <Button
                  type='submit'
                  disabled={isProcessing}
                  className='w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-7 h-auto text-sm font-bold uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all duration-300 group disabled:opacity-70'
                >
                  {isProcessing ? (
                    <div className='flex items-center gap-3'>
                      <div className='w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin' />
                      <span>Processing Payment...</span>
                    </div>
                  ) : (
                    <>
                      <Shield className='w-4 h-4 mr-2' />
                      Pay ৳{grandTotal.toLocaleString()}
                      <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Right - Order Summary */}
          <div className='payment-right lg:col-span-2'>
            <div className='bg-card border border-border rounded-3xl p-8 sticky top-28 space-y-6 shadow-sm'>
              <h3 className='text-lg font-bold text-foreground'>Order Summary</h3>

              {/* Property Card */}
              <div className='flex gap-4'>
                <div className='relative w-24 h-20 rounded-xl overflow-hidden shrink-0'>
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className='object-cover'
                  />
                </div>
                <div className='flex-1 min-w-0'>
                  <Badge className='bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px] mb-1'>
                    {property.category}
                  </Badge>
                  <h4 className='text-sm font-bold text-foreground truncate'>
                    {property.title}
                  </h4>
                  <p className='text-xs text-muted-foreground flex items-center gap-1 mt-0.5'>
                    <MapPin className='w-3 h-3' />
                    {property.location}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className='border-t border-border' />

              {/* Breakdown */}
              <div className='space-y-3'>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Price per Share</span>
                  <span className='text-foreground font-medium'>
                    ৳{property.pricePerShare.toLocaleString()}
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Number of Shares</span>
                  <span className='text-foreground font-medium'>× {shares}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Subtotal</span>
                  <span className='text-foreground font-medium'>
                    ৳{totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground flex items-center gap-1'>
                    Platform Fee (2%)
                    <Info className='w-3 h-3' />
                  </span>
                  <span className='text-muted-foreground'>
                    ৳{platformFee.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className='border-t border-border pt-4'>
                <div className='flex justify-between items-center'>
                  <span className='text-base font-bold text-foreground'>Total</span>
                  <span className='text-2xl font-bold gradient-text'>
                    ৳{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Expected Returns */}
              <div className='bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 space-y-2'>
                <div className='flex items-center gap-2'>
                  <TrendingUp className='w-4 h-4 text-emerald-500' />
                  <span className='text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider'>
                    Expected Returns
                  </span>
                </div>
                <p className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>
                  {property.expectedReturn}{' '}
                  <span className='text-sm font-normal text-muted-foreground'>
                    per annum
                  </span>
                </p>
                <p className='text-xs text-muted-foreground'>
                  Est. monthly income: ৳
                  {Math.round(
                    (totalAmount * parseFloat(property.expectedReturn)) /
                      100 /
                      12
                  ).toLocaleString()}
                </p>
              </div>

              {/* Trust */}
              <div className='flex items-center gap-3 text-xs text-muted-foreground justify-center pt-2'>
                <Shield className='w-4 h-4 text-emerald-500' />
                <span>Secure &amp; Verified Investment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className='min-h-screen bg-background' />}>
      <PaymentPageContent />
    </Suspense>
  );
}
