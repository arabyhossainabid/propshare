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
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getApiErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';

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

const adminLinks = [
  { name: 'Admin Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'All Users', href: '/admin/users', icon: User },
  { name: 'Manage Properties', href: '/admin/properties', icon: Building2 },
  { name: 'Investments Log', href: '/admin/investments', icon: Wallet },
  { name: 'Platform Settings', href: '/admin/settings', icon: PlusCircle },
];

export default function DashboardSidebar({ 
  className = 'w-64 shrink-0 hidden lg:block',
  onLinkClick
}: {
  className?: string;
  onLinkClick?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const links = user?.role === 'ADMIN' ? [...adminLinks, ...sidebarLinks.slice(5)] : sidebarLinks;

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success('Signed out successfully');
      if (onLinkClick) onLinkClick();
      router.push('/');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const isLinkActive = (href: string) => {
    if (href === '/dashboard' || href === '/admin') {
      return pathname === href;
    }

    if (href === '/dashboard/properties') {
      return (
        pathname === href ||
        (pathname.startsWith('/dashboard/properties/') &&
          !pathname.startsWith('/dashboard/properties/create'))
      );
    }

    if (href === '/dashboard/properties/create') {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className={className}>
      <div className='sticky top-8 space-y-2 lg:h-[calc(100vh-7rem)] lg:overflow-y-auto no-scrollbar pb-6'>
        {/* User Card */}
        <div className='bg-white/2 border border-white/5 rounded-2xl p-4 mb-4'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-blue-400 flex items-center justify-center text-sm font-bold text-white uppercase overflow-hidden'>
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name || 'User'} className="w-full h-full object-cover" />
              ) : (
                user?.name ? user.name.slice(0, 2) : 'U'
              )}
            </div>
            <div className='overflow-hidden'>
              <p className='text-sm font-semibold text-white truncate'>{user?.name || 'Investor'}</p>
              <p className='text-xs text-white/30 capitalize truncate'>{user?.role?.toLowerCase() || 'Member'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className='space-y-1'>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = isLinkActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={onLinkClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                  ? 'bg-white/5 text-white border border-white/10'
                  : 'text-white/50 hover:text-white hover:bg-white/5 shadow-none'
                  }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white/30 group-hover:text-white/60'}`}
                />
                <span className='flex-1'>{link.name}</span>
                {isActive && (
                  <ChevronRight className='w-3 h-3 text-white/50' />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className='border-t border-white/5 pt-4 mt-4 space-y-1'>
          <button
            onClick={handleSignOut}
            className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all w-full'
          >
            <LogOut className='w-4 h-4' /> Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
