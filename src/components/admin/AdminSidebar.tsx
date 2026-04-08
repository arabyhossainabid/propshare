'use client';

import {
  Building2,
  ChevronRight,
  FolderTree,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  ShieldCheck,
  Star,
  Users,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getApiErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';

const adminLinks = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Properties', href: '/admin/properties', icon: Building2 },
  { name: 'Categories', href: '/admin/categories', icon: FolderTree },
  { name: 'Investments', href: '/admin/investments', icon: Wallet },
  { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { name: 'Featured', href: '/admin/featured', icon: Star },
];

interface AdminSidebarProps {
  className?: string;
  onLinkClick?: () => void;
}

export default function AdminSidebar({ className = 'w-64 shrink-0 hidden lg:block', onLinkClick }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

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

  const handleLinkClick = () => {
    if (onLinkClick) onLinkClick();
  };

  return (
    <aside className={className}>
      <div className='sticky top-28 space-y-2'>
        {/* Admin Badge */}
        <div className='bg-linear-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-4 mb-4'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-purple-500 flex items-center justify-center'>
              <ShieldCheck className='w-5 h-5 text-white' />
            </div>
            <div>
              <p className='text-sm font-semibold text-white'>Admin Panel</p>
              <p className='text-xs text-white/30'>Super Admin</p>
            </div>
          </div>
        </div>

        <nav className='space-y-1'>
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href !== '/admin' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive ? 'bg-white/5 text-white border border-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
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

        <div className='border-t border-white/5 pt-4 mt-4'>
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
