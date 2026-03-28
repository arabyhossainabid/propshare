'use client';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { api, normalizeList } from '@/lib/api';
import { User } from '@/lib/api-types';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Search, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

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

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold font-heading'>User Management</h1>
        <p className='text-sm text-white/40 mt-1'>
          Manage platform users, roles, and access control.
        </p>
      </div>

      {/* Search + Filter */}
      <div className='flex flex-col sm:flex-row gap-3'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20' />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search users...'
            className='bg-white/5 border-white/10 rounded-xl pl-10 py-5 text-white placeholder:text-white/20 focus-visible:ring-blue-500/30'
          />
        </div>
        <div className='flex gap-2'>
          {['all', 'user', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${roleFilter === r ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className='bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-white/5'>
                <th className='text-left text-xs text-white/30 uppercase tracking-wider font-medium px-6 py-4'>
                  User
                </th>
                <th className='text-left text-xs text-white/30 uppercase tracking-wider font-medium px-6 py-4'>
                  Role
                </th>
                <th className='text-left text-xs text-white/30 uppercase tracking-wider font-medium px-6 py-4'>
                  Status
                </th>
                <th className='text-left text-xs text-white/30 uppercase tracking-wider font-medium px-6 py-4'>
                  Joined
                </th>
                <th className='text-left text-xs text-white/30 uppercase tracking-wider font-medium px-6 py-4'>
                  Investments
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className='px-6 py-12 text-center'>
                    <Loader2 className='w-6 h-6 animate-spin mx-auto text-blue-500' />
                    <p className='text-xs text-white/20 mt-2'>
                      Fetching users...
                    </p>
                  </td>
                </tr>
              ) : (
                usersData.map((u) => (
                  <tr
                    key={u.id}
                    className='border-b border-white/[0.03] hover:bg-white/[0.02] transition-all'
                  >
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-xs font-bold text-white overflow-hidden'>
                          {u.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            <UserIcon className='w-4 h-4' />
                          )}
                        </div>
                        <div className='min-w-0'>
                          <p className='text-sm font-medium text-white truncate'>
                            {u.name}
                          </p>
                          <p className='text-xs text-white/30 truncate'>
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <Badge
                        className={`text-[10px] ${u.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-white/5 text-white/40 border-white/10'}`}
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className='px-6 py-4'>
                      <Badge
                        className={`text-[10px] ${u.isActive !== false ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}
                      >
                        {u.isActive !== false ? 'Active' : 'Suspended'}
                      </Badge>
                    </td>
                    <td className='px-6 py-4 text-xs text-white/40'>
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className='px-6 py-4 text-sm text-white font-medium'>
                      {u._count?.investments ?? 0}
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
