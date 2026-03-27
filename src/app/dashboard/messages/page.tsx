'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api, getApiErrorMessage, normalizeList } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, MessageCircle, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

type ContactMessage = {
  id: string;
  message: string;
  createdAt: string;
};

type ContactReply = {
  id: string;
  senderRole: 'ADMIN' | 'USER';
  message: string;
  createdAt: string;
  senderName?: string;
};

export default function DashboardMessagesPage() {
  const queryClient = useQueryClient();
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );

  const shouldTryFallback = (error: unknown) => {
    const statusCode = (error as { response?: { status?: number } })?.response
      ?.status;
    return statusCode === 404;
  };

  const deleteThreadWithFallback = async (contactId: string) => {
    const endpoints = [`/contacts/${contactId}`, `/contact/${contactId}`];

    let lastError: unknown = null;
    for (const endpoint of endpoints) {
      try {
        await api.delete(endpoint);
        return;
      } catch (error) {
        lastError = error;
        if (!shouldTryFallback(error)) {
          throw error;
        }
      }
    }

    throw lastError;
  };

  const {
    data: myMessages = [],
    isLoading: isLoadingMessages,
    isError: isErrorMessages,
  } = useQuery({
    queryKey: ['dashboard-contact-messages'],
    refetchInterval: 5000,
    queryFn: async () => {
      const res = await api.get('/contacts/my-messages');
      return normalizeList<ContactMessage>(res.data?.data);
    },
  });

  const selectedMessage = useMemo(
    () => myMessages.find((m) => m.id === selectedMessageId) || null,
    [myMessages, selectedMessageId]
  );

  const {
    data: replies = [],
    isLoading: isLoadingReplies,
    isError: isErrorReplies,
  } = useQuery({
    queryKey: ['dashboard-contact-replies', selectedMessageId],
    enabled: Boolean(selectedMessageId),
    refetchInterval: selectedMessageId ? 3000 : false,
    queryFn: async () => {
      const res = await api.get(`/contacts/${selectedMessageId}/replies`);
      return normalizeList<ContactReply>(res.data?.data);
    },
  });

  const deleteThreadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedMessageId) throw new Error('Select a message first');
      await deleteThreadWithFallback(selectedMessageId);
    },
    onSuccess: async () => {
      toast.success('Message deleted');
      setSelectedMessageId(null);
      await queryClient.invalidateQueries({
        queryKey: ['dashboard-contact-messages'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['dashboard-contact-replies'],
      });
    },
    onError: (error) => {
      const status = (error as { response?: { status?: number } })?.response
        ?.status;
      const message = getApiErrorMessage(error);
      toast.error(status ? `Delete failed (${status}): ${message}` : message);
    },
  });

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold font-heading'>Messages</h1>
        <p className='text-sm text-white/40 mt-1'>
          See admin replies to your contact messages.
        </p>
      </div>

      <div className='grid lg:grid-cols-3 gap-4'>
        <div className='lg:col-span-1 rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden'>
          <div className='px-4 py-3 border-b border-white/5 text-sm text-white/70'>
            My Contact Messages
          </div>

          <div className='max-h-[560px] overflow-auto'>
            {isLoadingMessages && (
              <div className='p-6 text-center text-white/40 text-sm'>
                <Loader2 className='w-5 h-5 animate-spin mx-auto mb-2' />
                Loading messages...
              </div>
            )}

            {!isLoadingMessages && isErrorMessages && (
              <div className='p-6 text-center text-white/40 text-sm'>
                Could not load your messages.
              </div>
            )}

            {!isLoadingMessages &&
              !isErrorMessages &&
              myMessages.length === 0 && (
                <div className='p-6 text-center text-white/40 text-sm'>
                  You have no contact messages yet.
                </div>
              )}

            {myMessages.map((message) => {
              const isActive = selectedMessageId === message.id;
              return (
                <button
                  key={message.id}
                  onClick={() => setSelectedMessageId(message.id)}
                  className={`w-full text-left px-4 py-3 border-b border-white/[0.04] transition-colors ${
                    isActive
                      ? 'bg-blue-600/10 border-blue-500/20'
                      : 'hover:bg-white/[0.03]'
                  }`}
                >
                  <p className='text-sm text-white font-medium truncate'>
                    Message
                  </p>
                  <p className='text-xs text-white/40 truncate mt-1'>
                    {message.message}
                  </p>
                  <p className='text-xs text-white/40 truncate mt-1'>
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className='lg:col-span-2 rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden'>
          <div className='px-4 py-3 border-b border-white/5 text-sm text-white/70 flex items-center gap-2'>
            <MessageCircle className='w-4 h-4 text-emerald-400' /> Conversation
          </div>

          {!selectedMessage && (
            <div className='p-8 text-center text-white/40 text-sm'>
              Select a message to view replies.
            </div>
          )}

          {selectedMessage && (
            <div className='p-4 space-y-4'>
              <div className='rounded-xl border border-white/10 bg-white/[0.03] p-4'>
                <div className='flex items-center justify-between gap-3'>
                  <p className='text-sm text-white font-semibold'>
                    Your Message
                  </p>
                  <div className='flex items-center gap-2'>
                    <Badge className='bg-white/10 text-white/80 border-white/20'>
                      Your Message
                    </Badge>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => deleteThreadMutation.mutate()}
                      disabled={deleteThreadMutation.isPending}
                      className='h-8 border-red-400/30 text-red-300 hover:bg-red-500/10'
                    >
                      {deleteThreadMutation.isPending ? (
                        <Loader2 className='w-4 h-4 animate-spin' />
                      ) : (
                        <Trash2 className='w-4 h-4' />
                      )}
                    </Button>
                  </div>
                </div>
                <p className='text-sm text-white/70 mt-3'>
                  {selectedMessage.message}
                </p>
              </div>

              <div className='space-y-2 max-h-[320px] overflow-auto pr-1'>
                {!isLoadingReplies && isErrorReplies && (
                  <p className='text-sm text-white/40'>
                    Could not load replies. Please try again.
                  </p>
                )}

                {replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`rounded-xl p-3 border ${
                      reply.senderRole === 'ADMIN'
                        ? 'bg-blue-500/10 border-blue-400/20'
                        : 'bg-white/[0.03] border-white/10'
                    }`}
                  >
                    <div className='flex items-center justify-between gap-2'>
                      <p className='text-xs text-white/60'>
                        {reply.senderRole === 'ADMIN' ? 'Admin' : 'You'}
                        {reply.senderName ? ` • ${reply.senderName}` : ''}
                      </p>
                      <p className='text-[11px] text-white/30'>
                        {new Date(reply.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p className='text-sm text-white/80 mt-1'>
                      {reply.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
