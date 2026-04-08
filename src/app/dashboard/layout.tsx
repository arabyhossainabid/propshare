'use client';

import AuthGate from '@/components/AuthGate';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate requiredRole='USER'>
      <div className='min-h-screen bg-background pt-20'>
        <div className='max-w-7xl mx-auto px-6 md:px-8 lg:px-12 flex'>
          <DashboardSidebar />
          <div className='flex-1 min-w-0 h-[calc(100vh-5rem)] overflow-y-auto no-scrollbar'>
            <main className='py-6 md:py-8 lg:py-10 pl-8'>
              {children}
            </main>
          </div>
        </div>
      </div>
    </AuthGate>
  );
}
