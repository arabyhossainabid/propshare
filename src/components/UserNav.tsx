'use client';

import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { User, LayoutDashboard, LogOut, Shield, Building2, Wallet, MessageSquare, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function UserNav() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/auth/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-xl bg-white/5 border border-white/10 p-0 overflow-hidden hover:bg-white/10 transition-all">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs uppercase">
              {user.name?.slice(0, 2) || 'U'}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-card border-white/10 text-white rounded-2xl shadow-3xl p-2" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 p-2">
            <p className="text-sm font-bold leading-none">{user.name}</p>
            <p className="text-xs leading-none text-white/40">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/5" />
        <DropdownMenuGroup className="p-1">
          <Link href="/dashboard">
            <DropdownMenuItem className="rounded-xl px-3 py-2.5 focus:bg-white/5 cursor-pointer gap-3">
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
              <span>Dashboard</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/properties">
            <DropdownMenuItem className="rounded-xl px-3 py-2.5 focus:bg-white/5 cursor-pointer gap-3">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>My Properties</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/properties/create">
            <DropdownMenuItem className="rounded-xl px-3 py-2.5 focus:bg-white/5 cursor-pointer gap-3">
              <PlusCircle className="w-4 h-4 text-blue-400" />
              <span>Create Property</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/investments">
            <DropdownMenuItem className="rounded-xl px-3 py-2.5 focus:bg-white/5 cursor-pointer gap-3">
              <Wallet className="w-4 h-4 text-purple-400" />
              <span>My Investments</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/messages">
            <DropdownMenuItem className="rounded-xl px-3 py-2.5 focus:bg-white/5 cursor-pointer gap-3">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Messages</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/profile">
            <DropdownMenuItem className="rounded-xl px-3 py-2.5 focus:bg-white/5 cursor-pointer gap-3">
              <User className="w-4 h-4 text-blue-400" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          {user.role === 'ADMIN' && (
            <Link href="/admin">
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 focus:bg-white/5 cursor-pointer gap-3 text-red-400">
                <Shield className="w-4 h-4" />
                <span>Admin Panel</span>
              </DropdownMenuItem>
            </Link>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-white/5" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="rounded-xl px-3 py-2.5 focus:bg-red-500/10 text-red-400 cursor-pointer gap-3 mb-1"
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
