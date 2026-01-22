'use client';
import { useState, useEffect } from 'react';
import { Send, Loader } from 'lucide-react';

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
        setSuccessMessage('✅ Message sent!');
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
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-700">⏳ Loading conversation...</p>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error || 'Conversation not found.'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      {/* Header */}
      <div className="w-full max-w-3xl bg-amber-400 text-white rounded-t-xl p-6 shadow-md">
        <h1 className="text-2xl font-bold">{conversation.productName}</h1>
        <p className="text-lg font-semibold">{conversation.productPrice}</p>
      </div>

      {/* Conversation Area */}
      <div className="w-full max-w-3xl flex-1 bg-white rounded-b-xl shadow-md p-6 mt-2 flex flex-col">
        {/* Original Message */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-xs text-blue-700 font-bold mb-1">Your Message</p>
          <p className="text-gray-800">{conversation.userMessage}</p>
          <p className="text-xs text-gray-500 mt-2">{new Date(conversation.createdAt).toLocaleString()}</p>
        </div>

        {/* Replies */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {conversation.messages.length > 0 ? (
            conversation.messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-lg border-2 ${
                  msg.sender === 'admin'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <p className={`text-xs font-bold mb-1 ${msg.sender === 'admin' ? 'text-green-700' : 'text-blue-700'}`}>
                  {msg.sender === 'admin' ? '💬 Reply From Us' : '💬 Your Reply'}
                </p>
                <p className="text-gray-800">{msg.text}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(msg.timestamp).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-6">⏳ Waiting for reply...</p>
          )}
        </div>

        {/* Reply Input */}
        <div className="flex flex-col gap-2">
          {successMessage && <p className="text-green-600 text-center">{successMessage}</p>}
          <textarea
            rows={3}
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full border-2 border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-300"
          />
          <button
            onClick={sendReply}
            disabled={isSending || !replyMessage.trim()}
            className={`w-full py-2 px-4 rounded-lg text-white font-bold ${
              isSending || !replyMessage.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-amber-400 hover:bg-amber-500'
            }`}
          >
            {isSending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                Sending...
              </span>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
