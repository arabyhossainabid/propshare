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
        <div className='bg-muted/30 border border-border rounded-2xl p-4 mb-4'>
          <div className='flex items-center gap-3'>
            <div className='w-11 h-11 rounded-xl bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20'>
              <ShieldCheck className='w-5 h-5 text-white' />
            </div>
            <div>
              <p className='text-sm font-bold text-foreground'>Admin Panel</p>
              <p className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground'>Super Admin</p>
            </div>
          </div>
        </div>

        <nav className='space-y-1.5'>
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
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 group border ${
                  isActive 
                    ? 'bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${isActive ? 'text-primary-foreground' : 'text-muted-foreground/60 group-hover:text-foreground'}`}
                />
                <span className='flex-1'>{link.name}</span>
                {isActive && (
                  <ChevronRight className='w-3.5 h-3.5 text-primary-foreground/70' />
                )}
              </Link>
            );
          })}
        </nav>

        <div className='border-t border-border pt-4 mt-4'>
          <button
            onClick={handleSignOut}
            className='flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest text-destructive hover:bg-destructive/10 transition-all w-full group'
          >
            <LogOut className='w-4 h-4 group-hover:-translate-x-1 transition-transform' /> Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
