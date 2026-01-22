import { useState, useEffect } from 'react';
import { Send, Loader, ArrowLeft } from 'lucide-react';

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

export default function AdminReplyPage({ token }: { token: string }) {
  const [conversation, setConversation] = useState<ConversationData | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadConversation();
  }, [token]);

  const loadConversation = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/getConversation?token=${token}`);
      const data = await response.json();

      if (!data.success) {
        setError('Conversation not found');
        return;
      }

      setConversation(data.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load conversation');
    } finally {
      setIsLoading(false);
    }
  };

  const sendReply = async () => {
    if (!replyMessage.trim() || !conversation) return;

    setIsSending(true);
    try {
      const response = await fetch('/api/addReply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          message: replyMessage,
          sender: 'admin',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setReplyMessage('');
        setSuccessMessage('✅ Reply sent to customer!');
        await loadConversation();
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to send reply');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-700">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center p-6 bg-white rounded-2xl shadow-lg border-2 border-blue-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">❌ {error || 'Not Found'}</h1>
          <p className="text-gray-600">The conversation could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <a href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back
          </a>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border-2 border-blue-300">
                <img
                  src={conversation.productImage}
                  alt={conversation.productName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{conversation.productName}</h1>
                <p className="text-blue-100">
                  {conversation.email ? `From: ${conversation.email}` : 'No email provided'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Conversation */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-6 mb-6">
          <h2 className="font-bold text-lg text-gray-900 mb-6">Conversation History</h2>

          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {/* Original Message */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-xs text-blue-600 font-semibold mb-2">👤 CUSTOMER MESSAGE</p>
              <p className="text-gray-700 whitespace-pre-wrap">{conversation.userMessage}</p>
              <p className="text-xs text-gray-500 mt-3">
                {new Date(conversation.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Replies */}
            {conversation.messages.length > 0 ? (
              conversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-xl p-4 ${
                    msg.sender === 'admin'
                      ? 'bg-green-50 border-2 border-green-200 ml-4'
                      : 'bg-blue-50 border-2 border-blue-200'
                  }`}
                >
                  <p
                    className={`text-xs font-semibold mb-2 ${
                      msg.sender === 'admin' ? 'text-green-600' : 'text-blue-600'
                    }`}
                  >
                    {msg.sender === 'admin' ? '💬 YOUR REPLY' : '💬 CUSTOMER REPLY'}
                  </p>
                  <p className="text-gray-700 whitespace-pre-wrap">{msg.text}</p>
                  <p className="text-xs text-gray-500 mt-3">
                    {new Date(msg.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No replies yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Reply Form */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Send Reply to Customer</h3>

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border-2 border-green-300 text-green-700 rounded-lg font-semibold text-sm">
              {successMessage}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <textarea
              rows={5}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply to the customer..."
              className="w-full border-2 border-blue-200 p-4 rounded-xl resize-none text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300 bg-white transition-all duration-200"
            />

            <div className="flex gap-3">
              <button
                onClick={sendReply}
                disabled={isSending || !replyMessage.trim()}
                className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition-all duration-300 text-white shadow-lg ${
                  isSending || !replyMessage.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl'
                }`}
              >
                {isSending ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Reply
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>💡 Note:</strong> This reply will be saved and the customer will see it when they visit their conversation page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}