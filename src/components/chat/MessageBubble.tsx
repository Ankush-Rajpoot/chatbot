import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Copy, Check } from 'lucide-react';
import { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
  isLast?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isLast }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start space-x-3 mb-4 ${
        message.isBot ? 'justify-start' : 'justify-end flex-row-reverse space-x-reverse'
      }`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          message.isBot 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
            : 'bg-slate-600 text-white'
        }`}
      >
        {message.isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>

      <div className={`flex flex-col max-w-xs lg:max-w-md ${message.isBot ? 'items-start' : 'items-end'}`}>
        <div
          className={`rounded-2xl px-4 py-2 group relative ${
            message.isBot
              ? 'bg-white border border-slate-200 text-slate-900'
              : 'bg-blue-600 text-white'
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
          
          {message.isBot && (
            <button
              onClick={() => copyToClipboard(message.content)}
              className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 hover:bg-slate-200 rounded-full p-1.5"
              title="Copy message"
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3 text-slate-600" />
              )}
            </button>
          )}
        </div>
        
        <span className="text-xs text-slate-500 mt-1 px-1">
          {formatTime(message.createdAt)}
        </span>
      </div>
    </motion.div>
  );
};