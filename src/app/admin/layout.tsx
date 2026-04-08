'use client';

import AuthGate from '@/components/AuthGate';
import AdminSidebar from '@/components/admin/AdminSidebar';
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, ShieldCheck } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <AuthGate requiredRole='ADMIN'>
      <div className='min-h-screen bg-background pt-20'>
        <div className='max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex flex-col lg:flex-row'>
          
          {/* Mobile Drawer Trigger (Only visible on small screens) */}
          <div className='lg:hidden py-4 border-b border-border mb-6 flex items-center justify-start'>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant='outline' className='bg-background hover:bg-accent border-border text-foreground rounded-xl gap-2 font-bold uppercase tracking-widest text-[10px]'>
                  <Menu className='w-4 h-4' />
                  <span>Administrative Console</span>
                </Button>
              </SheetTrigger>
              <SheetContent side='left' className='w-80 bg-background border-r border-border p-6 pt-12 overflow-y-auto no-scrollbar'>
                 <SheetTitle className="sr-only">Admin Dashboard Navigation</SheetTitle>
                 <AdminSidebar 
                  className='w-full' 
                  onLinkClick={() => setIsMobileMenuOpen(false)} 
                 />
              </SheetContent>
            </Sheet>
          </div>

          <AdminSidebar className='w-64 shrink-0 hidden lg:block' />
          
          <div className='flex-1 min-w-0 lg:h-[calc(100vh-5rem)] lg:overflow-y-auto no-scrollbar lg:pl-8'>
            <main className='pb-10 lg:py-10 bg-background'>
              {children}
            </main>
          </div>
        </div>
      </div>
    </AuthGate>
  );
}
