'use client';

import { ImageUploader } from '@/components/ImageUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Camera, Loader2, Mail, Phone, Shield, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '', // Changed from bio
    avatar: '',
  });

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '', // Changed from bio
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const [showAvatarUpload, setShowAvatarUpload] = useState(false);

  const updateMutation = useMutation({
    mutationFn: async (payload: Partial<typeof profile>) => {
      await api.patch('/auth/update-profile', payload);
    },
    onSuccess: () => {
      toast.success('Profile updated successfully');
      refreshUser();
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        toast.error(
          'Profile update API not found on backend (/auth/update-profile). Please restart/update backend server.'
        );
        return;
      }

      toast.error(getApiErrorMessage(error));
    },
  });

  const handleSave = () => {
    const updatePayload: {
      name?: string;
      phone?: string;
      avatar?: string;
    } = {};

    if (profile.name.trim()) {
      updatePayload.name = profile.name.trim();
    }

    if (profile.phone.trim()) {
      updatePayload.phone = profile.phone.trim();
    }

    if (profile.avatar) {
      updatePayload.avatar = profile.avatar;
    }

    updateMutation.mutate(updatePayload);
  };

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-2xl font-bold font-heading'>Profile Settings</h1>
        <p className='text-sm text-white/40 mt-1'>
          Manage your personal information and preferences.
        </p>
      </div>

      {/* Avatar Section */}
      <div className='bg-white/[0.02] border border-white/5 rounded-2xl p-6'>
        <div className='flex items-center gap-6'>
          <div className='relative'>
            {profile.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar}
                alt='Avatar'
                className='w-20 h-20 rounded-2xl object-cover'
              />
            ) : (
              <div className='w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-2xl font-bold text-white'>
                {profile.name.slice(0, 1).toUpperCase() || 'U'}
              </div>
            )}
            <button
              onClick={() => setShowAvatarUpload(true)}
              className='absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border-2 border-[#0a0f1d] hover:bg-white/15'
            >
              <Camera className='w-3 h-3 text-white' />
            </button>
          </div>
          <div>
            <h3 className='text-lg font-bold'>{profile.name || 'User'}</h3>
            <p className='text-sm text-white/40'>Verified Member</p>
            <div className='flex items-center gap-1 mt-1'>
              <Shield className='w-3 h-3 text-emerald-400' />
              <span className='text-xs text-emerald-400'>
                Verified Investor
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Upload Modal */}
      {showAvatarUpload && (
        <div className='bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4'>
          <div className='flex items-center justify-between'>
            <h3 className='text-base font-bold'>Upload New Avatar</h3>
            <button
              onClick={() => setShowAvatarUpload(false)}
              className='text-white/40 hover:text-white'
            >
              <X className='w-4 h-4' />
            </button>
          </div>
          <ImageUploader
            label='Profile Avatar'
            placeholder='Click or drag to upload your avatar'
            onImageUpload={(url) => {
              setProfile({ ...profile, avatar: url });
              setShowAvatarUpload(false);
              toast.success('Avatar selected. Click Save Changes to update.');
            }}
            previewHeight={200}
            previewWidth={200}
          />
        </div>
      )}

      {/* Personal Info */}
      <div className='bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-5'>
        <h3 className='text-base font-bold'>Personal Information</h3>
        <div className='grid md:grid-cols-2 gap-4'>
          {[
            { label: 'Full Name', key: 'name', icon: User },
            { label: 'Email', key: 'email', icon: Mail, type: 'email' },
            { label: 'Phone', key: 'phone', icon: Phone }, // Added Phone input field
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.key} className='space-y-2'>
                <label className='text-xs text-white/40 uppercase tracking-wider font-medium'>
                  {f.label}
                </label>
                <div className='relative'>
                  <Icon className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20' />
                  <Input
                    value={
                      (profile[f.key as keyof typeof profile] as string) || ''
                    }
                    disabled={f.key === 'email'}
                    onChange={(e) =>
                      setProfile({ ...profile, [f.key]: e.target.value })
                    }
                    className='bg-white/5 border-white/10 rounded-xl pl-10 py-5 text-white focus-visible:ring-blue-500/30'
                  />
                </div>
              </div>
            );
          })}
        </div>
        {/* Removed Bio textarea */}
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className='bg-white/10 hover:bg-white/15 text-white rounded-xl px-8 text-sm'
        >
          {updateMutation.isPending && (
            <Loader2 className='w-4 h-4 mr-2 animate-spin' />
          )}
          Save Changes
        </Button>
      </div>

      {/* Danger Zone */}
      <div className='bg-red-500/5 border border-red-500/10 rounded-2xl p-6 space-y-4'>
        <h3 className='text-base font-bold text-red-500'>Danger Zone</h3>
        <p className='text-xs text-white/40'>
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <Button
          variant='destructive'
          onClick={async () => {
            if (
              window.confirm(
                'Are you sure you want to delete your account? This action cannot be undone.'
              )
            ) {
              try {
                await api.delete('/auth/delete-account');
                toast.success('Account deleted');
                window.location.href = '/';
              } catch (error) {
                toast.error(getApiErrorMessage(error));
              }
            }
          }}
          className='bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border-red-500/20 rounded-xl px-8 text-sm transition-all duration-300'
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
}
