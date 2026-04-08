'use client';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { api, normalizeList } from '@/lib/api';
import { User } from '@/lib/api-types';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Search, User as UserIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const { data: usersData = [], isLoading } = useQuery({
    queryKey: ['admin-users', search, roleFilter],
    queryFn: async () => {
      const res = await api.get('/admin/users', {
        params: {
          search: search || undefined,
          role: roleFilter === 'all' ? undefined : roleFilter.toUpperCase(),
        },
      });
      return normalizeList<User>(res?.data?.data);
    },
  });

  const filteredUsers = useMemo(() => {
    if (roleFilter === 'all') return usersData;
    const normalizedRole = roleFilter.toUpperCase();
    return usersData.filter((u) => u.role === normalizedRole);
  }, [usersData, roleFilter]);

  return (
    <div className='space-y-6 pb-12'>
      <div>
        <h1 className='text-3xl font-bold font-heading text-foreground'>Account Registry</h1>
        <p className='text-sm text-muted-foreground mt-1 font-medium'>
          Manage platform participants, permissions, and status.
        </p>
      </div>

      {/* Search + Filter */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60' />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search registry by name or email...'
            className='bg-muted/40 border-border rounded-2xl pl-12 h-12 text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-blue-500/30 font-medium'
          />
        </div>
        <div className='flex gap-2 p-1 bg-muted/60 rounded-xl'>
          {['all', 'user', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${roleFilter === r ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className='bg-card border border-border rounded-2xl overflow-hidden shadow-sm'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-muted/30 border-b border-border'>
                <th className='text-left text-[10px] text-foreground/70 uppercase tracking-widest font-black px-4 py-4'>
                  Participant
                </th>
                <th className='text-left text-[10px] text-foreground/70 uppercase tracking-widest font-black px-4 py-4'>
                  Role Class
                </th>
                <th className='text-left text-[10px] text-foreground/70 uppercase tracking-widest font-black px-4 py-4'>
                  Verification
                </th>
                <th className='text-left text-[10px] text-foreground/70 uppercase tracking-widest font-black px-4 py-4'>
                  Registered
                </th>
                <th className='text-left text-[10px] text-foreground/70 uppercase tracking-widest font-black px-4 py-4'>
                  Assets
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className='px-8 py-20 text-center'>
                    <Loader2 className='w-8 h-8 animate-spin mx-auto text-blue-500 opacity-50' />
                    <p className='text-xs text-muted-foreground mt-4 font-bold uppercase tracking-widest'>
                      Synchronizing Registry...
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className='hover:bg-muted/30 transition-all'
                  >
                    <td className='px-4 py-5'>
                      <div className='flex items-center gap-4'>
                        <div className='w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-600 overflow-hidden shadow-sm shrink-0'>
                          {u.avatar ? (
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            <UserIcon className='w-4 h-4' />
                          )}
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p className='text-sm font-bold text-foreground truncate'>
                            {u.name}
                          </p>
                          <p className='text-[10px] text-muted-foreground truncate font-medium'>
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className='px-4 py-5'>
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-bold px-2 py-0.5 ${u.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' : 'bg-muted text-muted-foreground border-border'}`}
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className='px-4 py-5'>
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-bold px-2 py-0.5 border ${u.isActive !== false ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}
                      >
                        {u.isActive !== false ? 'VERIFIED' : 'SUSPENDED'}
                      </Badge>
                    </td>
                    <td className='px-4 py-5 text-[10px] text-muted-foreground font-bold uppercase tracking-tight'>
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                        : '-'}
                    </td>
                    <td className='px-4 py-5'>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-foreground">
                          {u._count?.investments ?? 0}
                        </span>
                        <span className="text-[9px] text-muted-foreground font-black tracking-tighter">ASSETS</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
