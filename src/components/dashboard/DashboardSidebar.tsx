'use client';

import {
  Building2,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  PlusCircle,
  User,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sidebarLinks = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Properties', href: '/dashboard/properties', icon: Building2 },
  {
    name: 'Create Property',
    href: '/dashboard/properties/create',
    icon: PlusCircle,
  },
  { name: 'My Investments', href: '/dashboard/investments', icon: Wallet },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className='w-64 shrink-0 hidden lg:block'>
      <div className='sticky top-28 space-y-2'>
        {/* User Card */}
        <div className='bg-white/[0.02] border border-white/5 rounded-2xl p-4 mb-4'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-sm font-bold text-white'>
              JD
            </div>
            <div>
              <p className='text-sm font-semibold text-white'>John Doe</p>
              <p className='text-xs text-white/30'>Member</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className='space-y-1'>
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href !== '/dashboard' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-white/30 group-hover:text-white/60'}`}
                />
                <span className='flex-1'>{link.name}</span>
                {isActive && (
                  <ChevronRight className='w-3 h-3 text-blue-400/50' />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className='border-t border-white/5 pt-4 mt-4 space-y-1'>
          <button className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all w-full'>
            <LogOut className='w-4 h-4' /> Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
