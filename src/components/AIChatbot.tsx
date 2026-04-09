'use client';

import React, { useState, useEffect, useRef } from 'react';
import { api, getApiErrorMessage } from '@/lib/api';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import gsap from 'gsap';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    {
      role: 'ai',
      text: 'Hi! I am the PropShare AI Assistant. How can I help you with your investment journey today?'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  //  Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chats, isLoading]);

  //  GSAP animation when open
  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        '.chatbot-window',
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power3.out' }
      );
    }
  }, [isOpen]);

  //  FIXED toggle (no double click issue)
  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  //  Send message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = message.trim();
    setMessage('');
    setChats((prev) => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const res = await api.post<any>('/ai/chat', { message: userMsg });

      const aiReply =
        res.data?.reply ||
        res.data?.message ||
        res.data ||
        'I am sorry, I received an empty response.';

      setChats((prev) => [...prev, { role: 'ai', text: aiReply }]);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || getApiErrorMessage(err);

      setChats((prev) => [
        ...prev,
        { role: 'ai', text: errorMsg }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[500px] bg-card border border-white/10 rounded-2xl shadow-3xl flex flex-col overflow-hidden backdrop-blur-xl">

          {/* Header */}
          <div className="p-4 bg-background border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm">PropShare AI</h4>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar scroll-smooth"
          >
            {chats.map((chat, idx) => (
              <div
                key={idx}
                className={`flex ${chat.role === 'user'
                  ? 'justify-end'
                  : 'justify-start'
                  }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${chat.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-white/5 text-white/80 rounded-tl-sm border border-white/5'
                    }`}
                >
                  {typeof chat.text === 'object' && chat.text !== null
                    ? (chat.text as any).text ||
                    JSON.stringify(chat.text)
                    : String(chat.text)}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/5 p-3 rounded-2xl rounded-tl-sm text-white/50 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form 
            onSubmit={handleSend}
            className="p-4 bg-background border-t border-white/5 relative"
          >
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { label: 'Top Yields', icon: '📈' },
                { label: 'How to buy?', icon: '🏠' },
                { label: 'Risks?', icon: '🛡️' },
              ].map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => {
                    setMessage(s.label);
                    // Optional: auto-send if you want
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/60 hover:bg-white/10 hover:text-white transition-all flex items-center gap-1.5"
                >
                  <span>{s.icon}</span>
                  {s.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask anything..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
              />

              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-blue-400 hover:text-blue-300 disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className="w-14 h-14 bg-linear-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/20 hover:scale-110 active:scale-95 transition-all duration-300 border border-white/10 group"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white group-hover:animate-pulse" />
        )}
      </button>
    </div>
  );
}