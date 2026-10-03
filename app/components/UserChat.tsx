'use client';
import { useState, useEffect } from 'react';
import { Send, Loader2, AlertCircle, Check } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'admin';
  timestamp: string;
}

interface ConversationData {
  token: string;
  email: string | null;
  productName: string;
  productPrice: string;
  productImage: string;
  userMessage: string;
  messages: Message[];
  createdAt: string;
}

export default function UserChat({ token }: { token?: string | null }) {
  const [conversation, setConversation] = useState<ConversationData | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setError('No valid token provided.');
      setIsLoading(false);
      return;
    }

    const loadConversation = async () => {
      try {
        const response = await fetch(`/api/getConversation?token=${token}`);
        const data = await response.json();
        if (!data.success) {
          setError('Conversation not found.');
          return;
        }
        setConversation(data.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load conversation.');
      } finally {
        setIsLoading(false);
      }
    };

    loadConversation();
    const interval = setInterval(loadConversation, 5000);
    return () => clearInterval(interval);
  }, [token]);

  const sendReply = async () => {
    if (!replyMessage.trim() || !conversation || !token) return;

    setIsSending(true);
    try {
      const response = await fetch('/api/addReply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          message: replyMessage,
          sender: 'user',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setReplyMessage('');
        setSuccessMessage('Message sent');
        const updatedResponse = await fetch(`/api/getConversation?token=${token}`);
        const updatedData = await updatedResponse.json();
        setConversation(updatedData.data);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to send message.');
    } finally {
      setIsSending(false);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-100 flex justify-center items-center px-4" role="status">
        <div className="flex items-center gap-3 text-ink-600">
          <Loader2 className="w-5 h-5 animate-spin text-peri-600" aria-hidden="true" />
          <p className="text-[15px]">Loading conversation…</p>
        </div>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="min-h-screen bg-cream-100 flex justify-center items-center px-4">
        <div role="alert" className="flex items-center gap-3 px-4 py-3 bg-cherry-100 text-cherry-700 rounded-field">
          <AlertCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
          <p className="text-[15px]">{error || 'Conversation not found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center px-4 py-6 sm:py-10">
      <div className="w-full max-w-2xl flex-1 flex flex-col bg-white rounded-card border border-cream-300 shadow-rest overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 px-5 py-4 border-b border-cream-200">
          {conversation.productImage && (
            <img
              src={conversation.productImage}
              alt=""
              className="w-14 h-14 rounded-field object-cover bg-cream-200 flex-shrink-0"
            />
          )}
          <div className="min-w-0">
            <h1 className="font-display text-xl font-semibold text-ink-900 line-clamp-1">{conversation.productName}</h1>
            <p className="text-[15px] font-bold text-ink-900 tabular-nums">{conversation.productPrice}</p>
          </div>
        </div>

        {/* Conversation */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-5 space-y-3 bg-cream-50" aria-live="polite">
          {/* Original message */}
          <div className="flex flex-col items-end">
            <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-br-md bg-peri-600 text-white">
              <p className="text-[15px] whitespace-pre-wrap break-words">{conversation.userMessage}</p>
            </div>
            <p className="text-xs text-ink-600 mt-1">
              You · {new Date(conversation.createdAt).toLocaleString()}
            </p>
          </div>

          {conversation.messages.length > 0 ? (
            conversation.messages.map((msg) => {
              const fromShop = msg.sender === 'admin';
              return (
                <div key={msg.id} className={`flex flex-col ${fromShop ? 'items-start' : 'items-end'}`}>
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                      fromShop
                        ? 'rounded-bl-md bg-white border border-cream-300 text-ink-900'
                        : 'rounded-br-md bg-peri-600 text-white'
                    }`}
                  >
                    <p className="text-[15px] whitespace-pre-wrap break-words">{msg.text}</p>
                  </div>
                  <p className="text-xs text-ink-600 mt-1">
                    {fromShop ? 'Dangling Co.' : 'You'} · {new Date(msg.timestamp).toLocaleString()}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-center text-sm text-ink-600 py-6">Waiting for a reply from the shop…</p>
          )}
        </div>

        {/* Reply input */}
        <div className="border-t border-cream-200 px-4 sm:px-5 py-4 space-y-2">
          {successMessage && (
            <p className="flex items-center gap-1.5 text-sm font-semibold text-sage-800" role="status">
              <Check className="w-4 h-4" aria-hidden="true" />
              {successMessage}
            </p>
          )}
          <div className="flex items-end gap-2">
            <label htmlFor="chat-reply" className="sr-only">Your message</label>
            <textarea
              id="chat-reply"
              rows={2}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your message…"
              className="field resize-none flex-1"
            />
            <button
              type="button"
              onClick={sendReply}
              disabled={isSending || !replyMessage.trim()}
              className="btn btn-primary"
            >
              {isSending ? (
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="w-5 h-5" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">{isSending ? 'Sending…' : 'Send'}</span>
              <span className="sr-only sm:hidden">{isSending ? 'Sending' : 'Send'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
