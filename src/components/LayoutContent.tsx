'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { usePathname } from 'next/navigation';

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');

  return (
    <>
      <Navbar />
      <main className='min-h-screen'>{children}</main>
      {!isDashboard && <Footer />}
    </>
  );
}
