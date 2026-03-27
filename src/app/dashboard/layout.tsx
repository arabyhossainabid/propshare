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
      <div className='min-h-screen bg-[#0a0f1d] pt-24 pb-16'>
        <div className='container-custom'>
          <div className='flex gap-8'>
            <DashboardSidebar />
            <main className='flex-1 min-w-0'>{children}</main>
          </div>
        </div>
      </div>
    </AuthGate>
  );
}
