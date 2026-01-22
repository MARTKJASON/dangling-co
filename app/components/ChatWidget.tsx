import { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Loader, Copy, Check } from 'lucide-react';

interface ChatWidgetProps {
  productName: string;
  productPrice: string;
  productImage: string;
}

export default function ChatWidget({
  productName,
  productPrice,
  productImage,
}: ChatWidgetProps) {
  const defaultMessage = `Hi! 👋

I'm interested in ordering the "${productName}".
Could you please let me know:
• Available customization options
• Final price
• Delivery time

Thank you! 😊`;

  const [message, setMessage] = useState(defaultMessage);
  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const [conversationToken, setConversationToken] = useState('');
  const [showSaveLink, setShowSaveLink] = useState(false);
  const [copied, setCopied] = useState(false);

  // Initialize device ID on mount
  useEffect(() => {
    let id = localStorage.getItem('chatDeviceId');
    if (!id) {
      id = `device_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem('chatDeviceId', id);
    }
    setDeviceId(id);
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    setStatus('Sending...');
    try {
      const inquiryMessage = `
Hi! I'm interested in ordering the "${productName}" (${productPrice}).

📸 Image: ${productImage}

Message:
${message}
`;

      const response = await fetch('/api/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inquiryMessage,
          deviceId: deviceId,
          email: email || null,
          productName: productName,
          productPrice: productPrice,
          productImage: productImage,
        }),
      });

      const data = await response.json();

      if (data.token) {
        setConversationToken(data.token);
        setShowSaveLink(true);
      }

      setStatus('Message sent! 📩');
      setMessage(defaultMessage);
      setEmail('');
      
      setTimeout(() => {
        setStatus('');
      }, 2000);
    } catch (err) {
      setStatus('Failed to send 😢');
      console.error(err);
    }

    setIsLoading(false);
    setTimeout(() => setStatus(''), 3000);
  };

  const copyToClipboard = () => {
    const link = `${window.location.origin}/chat/${conversationToken}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const closeWidget = () => {
    setIsOpen(false);
    setShowSaveLink(false);
  };

  return (
    <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50">
      {/* Chat Box */}
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-5rem)] mt-6 sm:w-100 bg-gradient-to-br from-[#faf7e5] to-[#f5e4c0] rounded-2xl shadow-2xl border-2 border-amber-200 overflow-hidden flex flex-col backdrop-blur-sm max-h-[85vh] sm:max-h-[90vh]">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-400 to-orange-400 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" />
              <div className="min-w-0">
                <h4 className="font-bold text-sm sm:text-lg text-white truncate">Chat About This</h4>
                <p className="text-xs sm:text-sm text-amber-50 opacity-90 truncate">{productName}</p>
              </div>
            </div>
            <button
              onClick={closeWidget}
              className="text-white hover:bg-orange-500 p-1 rounded-lg transition-all duration-200 flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 overflow-y-auto flex-1">
            {!showSaveLink ? (
              <>
                {/* Product Info */}
                <div className="p-3 sm:p-4 bg-white rounded-xl border-2 border-amber-100 flex gap-2 sm:gap-3 flex-shrink-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 bg-purple-50 rounded-lg overflow-hidden border border-purple-200">
                    <img 
                      src={productImage} 
                      alt={productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-xs sm:text-sm truncate">{productName}</p>
                    <p className="text-base sm:text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      {productPrice}
                    </p>
                  </div>
                </div>

                {/* Email Input */}
                <div className="flex flex-col gap-1 sm:gap-2">
                  <label className="text-xs sm:text-sm font-bold text-gray-700">Your Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-2 border-amber-200 p-2 sm:p-3 rounded-lg text-xs sm:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300 bg-white transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500">We'll email you updates</p>
                </div>

                {/* Message Textarea */}
                <div className="flex flex-col gap-1 sm:gap-2">
                  <label className="text-xs sm:text-sm font-bold text-gray-700">Your Message</label>
                  <textarea
                    rows={4}
                    className="w-full border-2 border-amber-200 p-2 sm:p-4 rounded-xl resize-none text-xs sm:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300 bg-white transition-all duration-200"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you'd like..."
                  />
                </div>

                {/* Status Message */}
                {status && (
                  <div className={`p-2 sm:p-3 rounded-lg text-center text-xs sm:text-sm font-semibold flex-shrink-0 ${
                    status.includes('sent') 
                      ? 'bg-green-100 text-green-700 border border-green-300' 
                      : status.includes('Failed')
                      ? 'bg-red-100 text-red-700 border border-red-300'
                      : 'bg-blue-100 text-blue-700 border border-blue-300'
                  }`}>
                    {status}
                  </div>
                )}

                {/* Send Button */}
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !message.trim()}
                  className={`w-full flex items-center justify-center gap-2 font-bold py-2 sm:py-3 px-4 rounded-xl transition-all duration-300 text-white shadow-lg text-sm sm:text-base flex-shrink-0 ${
                    isLoading || !message.trim()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 hover:shadow-xl hover:scale-105'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      Send
                    </>
                  )}
                </button>
              </>
            ) : (
              // Save Link Screen
              <div className="flex flex-col gap-3 sm:gap-4 items-center justify-center">
                <div className="text-3xl sm:text-4xl">🎉</div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 text-center">Message Sent!</h3>
                
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 sm:p-4 w-full">
                  <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">📌 Save link:</p>
                  <div className="flex gap-2 bg-white p-2 sm:p-3 rounded-lg border border-blue-100">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/chat/${conversationToken}`}
                      className="flex-1 text-xs text-blue-600 bg-transparent outline-none overflow-hidden truncate"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-semibold transition-all flex-shrink-0"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">✓ Use on any device</p>
                </div>

                {email && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 sm:p-4 w-full">
                    <p className="text-xs sm:text-sm text-green-700">✓ Updates sent to <strong className="break-all">{email}</strong></p>
                  </div>
                )}

                <button
                  onClick={closeWidget}
                  className="w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-2 sm:py-3 rounded-xl transition-all text-sm sm:text-base"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 font-bold ${
          isOpen
            ? 'bg-gray-600 hover:bg-gray-700'
            : 'bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-110'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        )}
      </button>
    </div>
  );
}