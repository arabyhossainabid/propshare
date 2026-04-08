'use client';

import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { User, LayoutDashboard, LogOut, Shield, Building2, Wallet, MessageSquare, PlusCircle, FolderTree, Star } from 'lucide-react';
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
        <Button variant="ghost" className="relative h-10 w-10 rounded-xl bg-muted border border-border p-0 overflow-hidden hover:bg-accent transition-all ring-offset-background focus-visible:ring-2 focus-visible:ring-ring">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs uppercase">
              {user.name?.slice(0, 2) || 'U'}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 bg-card border border-border text-foreground rounded-2xl shadow-2xl p-2" align="end" sideOffset={10} forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 p-3 bg-muted/30 rounded-xl mb-1">
            <p className="text-sm font-bold leading-none text-foreground">{user.name}</p>
            <p className="text-[10px] leading-none text-muted-foreground uppercase tracking-widest font-medium mt-1">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/50 my-1" />
        <DropdownMenuGroup className="space-y-1">
          {user.role === 'ADMIN' ? (
            <>
              <Link href="/admin">
                <DropdownMenuItem className="rounded-xl px-4 py-3 focus:bg-accent focus:text-accent-foreground cursor-pointer gap-3 transition-colors">
                  <LayoutDashboard className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Admin Dashboard</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/admin/users">
                <DropdownMenuItem className="rounded-xl px-4 py-3 focus:bg-accent focus:text-accent-foreground cursor-pointer gap-3 transition-colors">
                  <User className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium">User Management</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/admin/properties">
                <DropdownMenuItem className="rounded-xl px-4 py-3 focus:bg-accent focus:text-accent-foreground cursor-pointer gap-3 transition-colors">
                  <Building2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium">Asset Catalog</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/admin/categories">
                <DropdownMenuItem className="rounded-xl px-4 py-3 focus:bg-accent focus:text-accent-foreground cursor-pointer gap-3 transition-colors">
                  <FolderTree className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">Taxonomy</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/admin/investments">
                <DropdownMenuItem className="rounded-xl px-4 py-3 focus:bg-accent focus:text-accent-foreground cursor-pointer gap-3 transition-colors">
                  <Wallet className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">Financial Transactions</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/admin/messages">
                <DropdownMenuItem className="rounded-xl px-4 py-3 focus:bg-accent focus:text-accent-foreground cursor-pointer gap-3 transition-colors">
                  <MessageSquare className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm font-medium">Support Center</span>
                </DropdownMenuItem>
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard">
                <DropdownMenuItem className="rounded-xl px-4 py-3 focus:bg-accent focus:text-accent-foreground cursor-pointer gap-3 transition-colors">
                  <LayoutDashboard className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Investor Dashboard</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/dashboard/properties">
                <DropdownMenuItem className="rounded-xl px-4 py-3 focus:bg-accent focus:text-accent-foreground cursor-pointer gap-3 transition-colors">
                  <Building2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium">Portfolio Assets</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/dashboard/investments">
                <DropdownMenuItem className="rounded-xl px-4 py-3 focus:bg-accent focus:text-accent-foreground cursor-pointer gap-3 transition-colors">
                  <Wallet className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">Allocations</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/dashboard/profile">
                <DropdownMenuItem className="rounded-xl px-4 py-3 focus:bg-accent focus:text-accent-foreground cursor-pointer gap-3 transition-colors">
                  <User className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Account Settings</span>
                </DropdownMenuItem>
              </Link>
            </>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-border/50 my-1" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="rounded-xl px-4 py-3 focus:bg-destructive/10 text-destructive focus:text-destructive cursor-pointer gap-3 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
