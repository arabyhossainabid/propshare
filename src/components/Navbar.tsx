'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Menu, Sparkles, User } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { UserNav } from '@/components/UserNav';
import { ThemeToggle } from '@/components/ThemeToggle';

const publicLinks = [
  { name: 'Home', href: '/' },
  { name: 'Properties', href: '/properties' },
  { name: 'Categories', href: '/categories' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const authLinks = [
  { name: 'Home', href: '/' },
  { name: 'Properties', href: '/properties' },
  { name: 'Categories', href: '/categories' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Blog', href: '/blog' },
];

export default function Navbar() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = isAuthenticated ? authLinks : publicLinks;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`navbar fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? 'bg-background/80 backdrop-blur-2xl border-b border-border shadow-2xl shadow-black/20'
        : 'bg-transparent'
        }`}
    >
      <div className='max-w-7xl mx-auto px-6 md:px-8 lg:px-12'>
        <div className='flex items-center justify-between h-20'>
          {/* Logo */}
          <Link href='/' className='flex items-center gap-4 group'>
            <div className='relative'>
              <div className='absolute inset-0 bg-blue-500/20 blur-2xl rounded-full group-hover:bg-blue-500/30 transition-all duration-500' />
              <img src='/logo.svg' alt='PropShare' className='w-8 h-8 relative z-10 transition-transform duration-500 group-hover:scale-110' />
            </div>
            <span className='text-2xl font-bold tracking-tight font-heading leading-none text-foreground'>
              Prop<span className='text-blue-500'>Share</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden lg:flex items-center gap-1'>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className='relative px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 group'
              >
                <span className='relative z-10'>{link.name}</span>
                <span className='absolute inset-0 rounded-xl bg-accent/0 group-hover:bg-accent transition-all duration-300' />
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className='hidden lg:flex items-center gap-4'>
            <ThemeToggle />
            {isLoading ? (
              <div className='flex gap-3'>
                <div className='w-24 h-10 bg-muted animate-pulse rounded-xl' />
              </div>
            ) : isAuthenticated ? (
              <UserNav />
            ) : (
              <div className='flex items-center gap-3'>
                <Link href='/auth/login'>
                  <Button
                    variant='ghost'
                    className='text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl text-sm'
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href='/auth/register'>
                  <Button className='bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 shadow-lg transition-all duration-300 text-sm group'>
                    Get Started
                    <ArrowRight className='w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform' />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <div className="flex items-center gap-2 lg:hidden">
              <ThemeToggle />
              <SheetTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-foreground hover:bg-accent rounded-xl'
                >
                  <Menu className='w-5 h-5' />
                </Button>
              </SheetTrigger>
            </div>
            <SheetContent
              side='right'
              className='bg-background border-l border-border w-80 p-0'
            >
              <SheetTitle className="sr-only">Main Menu</SheetTitle>
              <div className='flex flex-col h-full'>
                {/* Mobile Header */}
                <div className='flex items-center justify-between p-6 border-b border-border'>
                  <Link href='/' className='flex items-center gap-3' onClick={() => setIsOpen(false)}>
                    <img src='/logo.svg' alt='PropShare' className='w-11 h-11 transition-transform' />
                    <span className='text-xl font-bold font-heading text-foreground'>
                      Prop<span className='text-blue-500'>Share</span>
                    </span>
                  </Link>
                </div>

                {/* Mobile Links */}
                <div className='flex-1 p-6 space-y-1'>
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className='flex items-center justify-between px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-300'
                    >
                      <span className='text-sm font-medium'>{link.name}</span>
                      <ArrowRight className='w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity' />
                    </Link>
                  ))}
                </div>

                {/* Mobile CTA */}
                <div className='p-6 border-t border-border space-y-3'>
                  {isLoading ? (
                    <div className='space-y-3'>
                      <div className='w-full h-12 bg-muted animate-pulse rounded-xl' />
                      <div className='w-full h-12 bg-muted animate-pulse rounded-xl' />
                    </div>
                  ) : isAuthenticated ? (
                    <>
                      <Link
                        href={user?.role === 'ADMIN' ? '/admin' : '/dashboard'}
                        onClick={() => setIsOpen(false)}
                      >
                        <Button
                          variant='outline'
                          className='w-full rounded-xl border-border text-foreground hover:bg-accent h-12 gap-2'
                        >
                          <div className='w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 overflow-hidden'>
                            {user?.avatar ? (
                              <img src={user.avatar} alt={user.name || 'User'} className="w-full h-full object-cover" />
                            ) : (
                              <User className='w-3.5 h-3.5 text-blue-400' />
                            )}
                          </div>
                          {user?.role === 'ADMIN'
                            ? user?.name || 'Admin Panel'
                            : user?.name || 'Dashboard'}
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href='/auth/login' onClick={() => setIsOpen(false)}>
                        <Button
                          variant='outline'
                          className='w-full rounded-xl border-border text-foreground hover:bg-accent h-12'
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Link
                        href='/auth/register'
                        onClick={() => setIsOpen(false)}
                      >
                        <Button className='w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 shadow-lg'>
                          <Sparkles className='w-4 h-4 mr-4' />
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
