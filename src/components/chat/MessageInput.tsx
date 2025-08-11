import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "Type your message...",
}) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || disabled || isLoading) return;

    const messageText = message.trim();
    setMessage('');
    setIsLoading(true);

    try {
      await onSendMessage(messageText);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white p-4">
      <form onSubmit={handleSubmit} className="flex space-x-3">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            rows={1}
            className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{
              minHeight: '48px',
              maxHeight: '120px',
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = '48px';
              target.style.height = target.scrollHeight + 'px';
            }}
          />
          
          <button
            type="submit"
            disabled={!message.trim() || disabled || isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-2 text-xs text-slate-500 text-center">
        Press <kbd className="px-1 py-0.5 bg-slate-100 rounded">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-slate-100 rounded">Shift+Enter</kbd> for new line
      </div>
    </div>
  );
};