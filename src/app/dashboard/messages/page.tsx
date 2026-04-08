'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { api, getApiErrorMessage, normalizeList } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, MessageCircle, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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
  const { isAuthenticated, isLoading: isAuthLoading, accessToken } = useAuth();
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );

  const shouldTryFallback = (error: unknown) => {
    const statusCode = (error as { response?: { status?: number } })?.response
      ?.status;
    return statusCode === 404;
  };

  const deleteThreadWithFallback = async (contactId: string) => {
    const endpoints = [
      `/contacts/my-messages/${contactId}`,
      `/contacts/my-messages/delete/${contactId}`,
      `/contacts/${contactId}`,
      `/contacts/${contactId}/delete`,
      `/contact/${contactId}`,
      `/contact/${contactId}/delete`,
    ];

    let lastError: unknown = null;

    for (const endpoint of endpoints) {
      try {
        const response = await api.delete(endpoint);
        console.debug('[deleteThreadWithFallback] deleted', { endpoint, response });
        return;
      } catch (error) {
        const status = (error as { response?: { status?: number } })?.response
          ?.status;

        // For 403, stop fallback and surfacing permission issue.
        if (status === 403) {
          throw new Error(
            `Forbidden access during delete at ${endpoint}. You may not have permission to delete this message.`
          );
        }

        lastError = error;

        // Only fallback on 404
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
    enabled: isAuthenticated && !isAuthLoading && !!accessToken,
    refetchInterval: 5000,
    queryFn: async () => {
      const res = await api.get('/contacts/my-messages');
      return normalizeList<ContactMessage>(res.data?.data);
    },
  });

  useEffect(() => {
    if (!myMessages.some((m) => m.id === selectedMessageId)) {
      setSelectedMessageId(null);
    }
  }, [myMessages, selectedMessageId]);

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
    enabled:
      isAuthenticated &&
      !isAuthLoading &&
      !!accessToken &&
      Boolean(selectedMessageId),
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
    onMutate: async () => {
      if (!selectedMessageId) return;
      await queryClient.cancelQueries({ queryKey: ['dashboard-contact-messages'] });
      const previousMessages = queryClient.getQueryData<ContactMessage[]>(['dashboard-contact-messages']);
      if (previousMessages) {
        queryClient.setQueryData<ContactMessage[]>(['dashboard-contact-messages'],
          previousMessages.filter((m) => m.id !== selectedMessageId)
        );
      }
      return { previousMessages };
    },
    onSuccess: async () => {
      toast.success('Message deleted');
      setSelectedMessageId(null);
      await queryClient.invalidateQueries({ queryKey: ['dashboard-contact-messages'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard-contact-replies'] });
    },
    onError: (error, _variables, context) => {
      const status = (error as { response?: { status?: number } })?.response?.status;
      const message = getApiErrorMessage(error);
      toast.error(status ? `Delete failed (${status}): ${message}` : message);
      if (context?.previousMessages) {
        queryClient.setQueryData(['dashboard-contact-messages'], context.previousMessages);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-contact-messages'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-contact-replies'] });
    },
  });

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold font-heading text-foreground'>Messages</h1>
        <p className='text-sm text-muted-foreground mt-1'>
          See administrative responses to your inquiries.
        </p>
      </div>

      <div className='grid lg:grid-cols-3 gap-6'>
        {/* Left Sidebar: Message List */}
        <div className='lg:col-span-1 border border-border bg-card rounded-2xl overflow-hidden shadow-sm'>
          <div className='px-5 py-4 border-b border-border bg-muted/30'>
             <h3 className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2'>
              <MessageCircle className='w-4 h-4 text-blue-500' />
              My Conversations ({myMessages.length})
            </h3>
          </div>

          <div className='max-h-[560px] overflow-auto divide-y divide-border/50'>
            {isLoadingMessages && (
              <div className='p-12 text-center text-muted-foreground text-xs font-bold uppercase tracking-widest'>
                <Loader2 className='w-6 h-6 animate-spin mx-auto mb-3 text-blue-500' />
                Synchronizing...
              </div>
            )}

            {!isLoadingMessages && isErrorMessages && (
              <div className='p-8 text-center text-red-400 text-xs font-bold uppercase tracking-widest'>
                Network Error
              </div>
            )}

            {!isLoadingMessages &&
              !isErrorMessages &&
              myMessages.length === 0 && (
                <div className='p-12 text-center text-muted-foreground text-xs border-dashed border-2 border-border m-4 rounded-xl'>
                   <p className='font-bold uppercase tracking-widest opacity-40'>No History</p>
                </div>
              )}

            {myMessages.map((message) => {
              const isActive = selectedMessageId === message.id;
              return (
                <button
                  key={message.id}
                  onClick={() => setSelectedMessageId(message.id)}
                  className={`w-full text-left px-5 py-4 transition-all group relative ${
                    isActive
                      ? 'bg-blue-600/5'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  {isActive && <div className='absolute left-0 top-0 bottom-0 w-1 bg-blue-600' />}
                  <div className='flex justify-between items-start mb-1'>
                     <p className={`text-sm font-bold transition-colors ${isActive ? 'text-blue-600' : 'text-foreground'}`}>
                      Inquiry
                    </p>
                    <span className='text-[10px] text-muted-foreground font-bold'>
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className='text-xs text-muted-foreground truncate leading-relaxed'>
                    {message.message}
                  </p>
                  <p className='text-[9px] text-muted-foreground/40 font-bold uppercase tracking-widest mt-2'>
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Conversation Details */}
        <div className='lg:col-span-2 border border-border bg-card rounded-2xl overflow-hidden shadow-sm flex flex-col h-[620px]'>
          <div className='px-5 py-4 border-b border-border bg-muted/30 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
               <div className='w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center'>
                 <MessageCircle className='w-4 h-4 text-emerald-500' />
               </div>
               <h3 className='text-sm font-bold text-foreground'>Conversation Details</h3>
            </div>
            {selectedMessage && (
               <Badge variant="outline" className="border-blue-500/20 text-blue-600 uppercase tracking-widest text-[9px] py-0.5">
                  Live Support
               </Badge>
            )}
          </div>

          {!selectedMessage && (
            <div className='flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4'>
              <div className='w-16 h-16 rounded-2xl bg-muted flex items-center justify-center opacity-40 grayscale'>
                 <MessageCircle className='w-8 h-8' />
              </div>
              <p className='text-xs font-bold uppercase tracking-widest text-muted-foreground/60'>
                Select an inquiry thread to view replies
              </p>
            </div>
          )}

          {selectedMessage && (
            <div className='flex-1 p-6 space-y-6 overflow-auto no-scrollbar'>
              {/* Original User Message */}
              <div className='flex justify-end'>
                <div className='max-w-[85%] space-y-2'>
                  <div className='bg-primary text-primary-foreground p-4 rounded-2xl rounded-tr-none shadow-lg shadow-primary/10'>
                    <p className='text-sm leading-relaxed font-medium'>
                      {selectedMessage.message}
                    </p>
                  </div>
                  <p className='text-[9px] text-muted-foreground font-bold uppercase tracking-widest text-right px-1'>
                    You • {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Replies */}
              <div className='space-y-6'>
                {isLoadingReplies && (
                  <div className='flex justify-center py-4'>
                    <Loader2 className='w-5 h-5 animate-spin text-blue-500' />
                  </div>
                )}

                {replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`flex ${reply.senderRole === 'ADMIN' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className='max-w-[85%] space-y-2'>
                      <div className={`p-4 rounded-2xl shadow-sm border ${
                        reply.senderRole === 'ADMIN'
                          ? 'bg-muted border-border rounded-tl-none'
                          : 'bg-primary text-primary-foreground border-primary rounded-tr-none'
                      }`}>
                        <p className='text-sm leading-relaxed'>
                          {reply.message}
                        </p>
                      </div>
                      <p className={`text-[9px] text-muted-foreground font-bold uppercase tracking-widest px-1 ${
                        reply.senderRole === 'ADMIN' ? 'text-left' : 'text-right'
                      }`}>
                        {reply.senderRole === 'ADMIN' ? 'Admin' : 'You'}
                        {reply.senderName ? ` • ${reply.senderName}` : ''}
                        {' • '}{new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
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
