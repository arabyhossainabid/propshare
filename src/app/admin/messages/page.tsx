'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api, getApiErrorMessage, normalizeList } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Mail, MessageSquare, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

type ContactMessage = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  userId?: string;
};

type ContactReply = {
  id: string;
  senderRole: 'ADMIN' | 'USER';
  message: string;
  createdAt: string;
  senderName?: string;
};

export default function AdminMessagesPage() {
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
    const endpoints = [
      `/contacts/my-messages/${contactId}`,
      `/contacts/${contactId}`,
      `/contact/${contactId}`,
    ];

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
    data: messages = [],
    isLoading: isLoadingMessages,
    isError: isErrorMessages,
  } = useQuery({
    queryKey: ['admin-contact-messages'],
    refetchInterval: 5000,
    queryFn: async () => {
      const res = await api.get('/contacts');
      return normalizeList<ContactMessage>(res.data?.data);
    },
  });

  const selectedMessage = useMemo(
    () => messages.find((m) => m.id === selectedMessageId) || null,
    [messages, selectedMessageId]
  );

  const {
    data: replies = [],
    isLoading: isLoadingReplies,
    isError: isErrorReplies,
  } = useQuery({
    queryKey: ['admin-contact-replies', selectedMessageId],
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
      toast.success('Thread deleted');
      setSelectedMessageId(null);
      await queryClient.invalidateQueries({
        queryKey: ['admin-contact-messages'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['admin-contact-replies'],
      });
    },
    onError: (error) => {
      const status = (error as { response?: { status?: number } })?.response
        ?.status;
      const message = getApiErrorMessage(error);

      toast.error(status ? `Delete failed (${status}): ${message}` : message);
      console.error('Admin contact delete failed', {
        status,
        selectedMessageId,
        error,
      });
    },
  });

  return (
    <div className='space-y-8 pb-12'>
      <div>
        <h1 className='text-3xl font-bold font-heading text-foreground'>Institutional Inbox</h1>
        <p className='text-sm text-muted-foreground mt-1 font-medium'>
          Monitor and respond to stakeholder inquiries in real-time.
        </p>
      </div>

      <div className='grid lg:grid-cols-3 gap-6'>
        {/* Inbox Sidebar */}
        <div className='lg:col-span-1 rounded-3xl border border-border bg-card overflow-hidden shadow-sm flex flex-col'>
          <div className='px-6 py-4 border-b border-border bg-muted/30 text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Mail className='w-4 h-4 text-blue-500' /> Inbound Queue
            </div>
            <Badge variant="outline" className="bg-muted text-foreground border-border text-[10px] font-bold">
              {messages.length}
            </Badge>
          </div>

          <div className='max-h-[600px] overflow-auto divide-y divide-border'>
            {isLoadingMessages && (
              <div className='p-12 text-center text-muted-foreground text-sm font-medium animate-pulse'>
                <Loader2 className='w-6 h-6 animate-spin mx-auto mb-3 opacity-40' />
                Fetching...
              </div>
            )}

            {!isLoadingMessages && isErrorMessages && (
              <div className='p-8 text-center text-muted-foreground text-sm font-medium'>
                Synchronization failure.
              </div>
            )}

            {!isLoadingMessages &&
              !isErrorMessages &&
              messages.length === 0 && (
                <div className='p-12 text-center text-muted-foreground text-sm font-bold uppercase tracking-widest opacity-40'>
                  Queue Empty
                </div>
              )}

            {messages.map((message) => {
              const isActive = selectedMessageId === message.id;
              return (
                <button
                  key={message.id}
                  onClick={() => setSelectedMessageId(message.id)}
                  className={`w-full text-left px-6 py-5 transition-all duration-300 ${
                    isActive
                      ? 'bg-blue-500/5 border-l-4 border-l-blue-500 relative'
                      : 'hover:bg-muted/30 border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <p className='text-sm text-foreground font-bold truncate'>
                      {message.name}
                    </p>
                    <span className='text-[9px] text-muted-foreground/60 font-bold uppercase tracking-tighter'>
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className='text-xs text-muted-foreground truncate font-medium'>
                    {message.message}
                  </p>
                  {isActive && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Conversation View */}
        <div className='lg:col-span-2 rounded-3xl border border-border bg-card overflow-hidden shadow-sm flex flex-col min-h-[500px]'>
          <div className='px-6 py-4 border-b border-border bg-muted/30 text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-2'>
            <MessageSquare className='w-4 h-4 text-emerald-500' /> Activity Stream
          </div>

          {!selectedMessage && (
            <div className='flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4 opacity-40'>
               <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center border-2 border-dashed border-border">
                  <Mail className="w-8 h-8 text-muted-foreground" />
               </div>
               <p className='text-sm text-muted-foreground font-bold uppercase tracking-widest'>
                Select an inquiry to initiate dialogue
              </p>
            </div>
          )}

          {selectedMessage && (
            <div className='flex flex-col h-full'>
              {/* Message Header */}
              <div className='p-8 bg-muted/10 border-b border-border'>
                <div className='flex items-start justify-between gap-6'>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl font-bold text-blue-600 shadow-sm shrink-0">
                      {selectedMessage.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <p className='text-xl font-bold text-foreground'>
                        {selectedMessage.name}
                      </p>
                      <p className='text-xs text-muted-foreground mt-1 font-bold uppercase tracking-widest flex items-center gap-2'>
                         Primary Participant · Received <span className="text-foreground">{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => {
                        if (confirm('Terminate this conversation thread?')) {
                          deleteThreadMutation.mutate();
                        }
                      }}
                      disabled={deleteThreadMutation.isPending}
                      className='h-11 px-4 border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-xl transition-all font-bold uppercase tracking-widest text-[10px]'
                    >
                      {deleteThreadMutation.isPending ? (
                        <Loader2 className='w-4 h-4 animate-spin' />
                      ) : (
                        <Trash2 className='w-4 h-4' />
                      )}
                      <span className="ml-2">Purge</span>
                    </Button>
                  </div>
                </div>
                <div className='mt-8 p-6 bg-background border border-border rounded-2xl shadow-sm'>
                  <p className='text-base text-foreground/80 leading-relaxed font-normal'>
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* Replies Area */}
              <div className='flex-1 p-8 space-y-6 overflow-auto max-h-[400px]'>
                <div className="flex items-center gap-4 mb-2">
                   <div className="h-px bg-border flex-1" />
                   <span className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest whitespace-nowrap">Correspondence Log</span>
                   <div className="h-px bg-border flex-1" />
                </div>
                
                {isLoadingReplies && (
                   <div className="text-center py-8">
                     <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500 opacity-40" />
                   </div>
                )}

                {!isLoadingReplies && isErrorReplies && (
                  <p className='text-sm text-muted-foreground/60 font-medium text-center italic'>
                    Security barrier detected. Synchronization latent.
                  </p>
                )}

                {replies.map((reply) => {
                  const isAdmin = reply.senderRole === 'ADMIN';
                  return (
                    <div
                      key={reply.id}
                      className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                    >
                      <div className={`max-w-[85%] rounded-2xl p-5 border shadow-sm ${
                        isAdmin
                          ? 'bg-primary text-primary-foreground border-primary rounded-tr-none'
                          : 'bg-muted/40 border-border rounded-tl-none'
                      }`}>
                        <p className='text-sm leading-relaxed font-medium'>
                          {reply.message}
                        </p>
                      </div>
                      <div className={`flex items-center gap-2 mt-2 px-1 ${isAdmin ? 'flex-row-reverse' : ''}`}>
                         <span className='text-[9px] text-muted-foreground/60 font-bold uppercase tracking-widest'>
                          {isAdmin ? 'System Operator' : (reply.senderName || 'Stakeholder')}
                        </span>
                        <span className="w-0.5 h-0.5 rounded-full bg-border" />
                        <span className='text-[9px] text-muted-foreground/40 font-medium'>
                          {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {replies.length === 0 && !isLoadingReplies && (
                   <div className="text-center py-12 opacity-30">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">End of Transcript</p>
                   </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
