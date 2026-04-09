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
        <h1 className='text-2xl font-bold font-heading text-foreground'>Profile Settings</h1>
        <p className='text-sm text-muted-foreground mt-1'>
          Manage your personal information and preferences.
        </p>
      </div>

      {/* Avatar Section */}
      <div className='bg-card border border-border rounded-2xl p-6 shadow-sm'>
        <div className='flex items-center gap-6'>
          <div className='relative'>
            {profile.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar}
                alt='Avatar'
                className='w-20 h-20 rounded-2xl object-cover ring-2 ring-blue-500/20 shadow-lg'
              />
            ) : (
              <div className='w-20 h-20 rounded-2xl bg-linear-to-br from-blue-600 to-blue-400 flex items-center justify-center text-2xl font-bold text-white shadow-lg'>
                {profile.name.slice(0, 1).toUpperCase() || 'U'}
              </div>
            )}
            <button
              onClick={() => setShowAvatarUpload(true)}
              className='absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center border-4 border-card hover:scale-110 transition-transform shadow-lg'
            >
              <Camera className='w-4 h-4' />
            </button>
          </div>
          <div>
            <h3 className='text-lg font-bold text-foreground'>{profile.name || 'User'}</h3>
            <p className='text-sm text-muted-foreground font-medium'>Verified Member</p>
            <div className='flex items-center gap-1.5 mt-1.5'>
              <Shield className='w-3.5 h-3.5 text-emerald-500' />
              <span className='text-[10px] text-emerald-600 font-bold uppercase tracking-widest'>
                Verified Investor
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Upload Modal */}
      {showAvatarUpload && (
        <div className='bg-card border border-border rounded-2xl p-6 space-y-4 shadow-2xl relative z-20'>
          <div className='flex items-center justify-between'>
            <h3 className='text-base font-bold text-foreground'>Upload New Avatar</h3>
            <button
              onClick={() => setShowAvatarUpload(false)}
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              <X className='w-5 h-5' />
            </button>
          </div>
          <ImageUploader
            label='Profile Avatar'
            placeholder='Click or drag to upload your avatar'
            onImageUpload={async (url) => {
              setProfile((prev) => ({ ...prev, avatar: url }));
              setShowAvatarUpload(false);
              // Auto-save avatar to DB immediately after upload
              try {
                await api.patch('/auth/update-profile', { avatar: url });
                toast.success('Profile picture updated successfully!');
                refreshUser();
              } catch {
                toast.error('Failed to save avatar. Please try clicking Save Changes.');
              }
            }}
            previewHeight={200}
            previewWidth={200}
          />
        </div>
      )}

      {/* Personal Info */}
      <div className='bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm'>
        <h3 className='text-base font-bold text-foreground'>Personal Information</h3>
        <div className='grid md:grid-cols-2 gap-6'>
          {[
            { label: 'Full Name', key: 'name', icon: User },
            { label: 'Email', key: 'email', icon: Mail, type: 'email' },
            { label: 'Phone', key: 'phone', icon: Phone },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.key} className='space-y-2'>
                <label className='text-[10px] text-muted-foreground uppercase tracking-widest font-bold'>
                  {f.label}
                </label>
                <div className='relative'>
                   <div className='absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-muted flex items-center justify-center overflow-hidden'>
                    <Icon className='w-4 h-4 text-blue-500/60' />
                   </div>
                  <Input
                    value={
                      (profile[f.key as keyof typeof profile] as string) || ''
                    }
                    disabled={f.key === 'email'}
                    onChange={(e) =>
                      setProfile({ ...profile, [f.key]: e.target.value })
                    }
                    className='bg-muted/30 border-border rounded-xl pl-12 h-12 text-foreground focus-visible:ring-blue-500/30'
                  />
                </div>
              </div>
            );
          })}
        </div>
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-10 h-12 text-sm font-bold shadow-lg shadow-primary/20 transition-all'
        >
          {updateMutation.isPending && (
            <Loader2 className='w-4 h-4 mr-2 animate-spin' />
          )}
          Save Changes
        </Button>
      </div>

      {/* Danger Zone */}
      <div className='bg-red-500/5 border border-red-500/10 rounded-2xl p-8 space-y-6 shadow-sm'>
        <div className="space-y-1">
          <h3 className='text-base font-bold text-red-500 uppercase tracking-widest'>Danger Zone</h3>
          <p className='text-xs text-muted-foreground font-medium'>
            Once you delete your account, there is no going back. All your investment history será permanently erased.
          </p>
        </div>
        <Button
          variant='outline'
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
          className='border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded-xl px-8 h-12 text-xs font-bold uppercase tracking-widest transition-all'
        >
          Permanently Delete Account
        </Button>
      </div>
    </div>
  );
}
