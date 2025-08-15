import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Copy, Check } from 'lucide-react';
import { Message } from '../../types';
import { Button } from '../ui/button';

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
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mb-4"
    >
      {message.is_bot ? (
        // Bot Message - Left Side
        <div className="flex items-start space-x-2.5 justify-start">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-primary via-accent to-primary text-primary-foreground flex items-center justify-center shadow-lg ring-2 ring-primary/20"
          >
            <Bot className="h-4 w-4" />
          </motion.div>
          <div className="flex flex-col max-w-[75%] lg:max-w-[60%]">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card/90 backdrop-blur-sm border border-border/50 text-card-foreground rounded-xl rounded-tl-md px-3 py-2.5 group relative shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                {message.content}
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(message.content)}
                className="absolute -right-1.5 -top-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-background/80 hover:bg-accent/80 rounded-full h-6 w-6 shadow-md"
                title="Copy message"
              >
                {copied ? (
                  <Check className="h-2.5 w-2.5 text-green-400" />
                ) : (
                  <Copy className="h-2.5 w-2.5 text-muted-foreground" />
                )}
              </Button>
            </motion.div>
            <span className="text-xs text-muted-foreground mt-1.5 ml-1 opacity-70">
              {formatTime(message.created_at)}
            </span>
          </div>
        </div>
      ) : (
        // User Message - Right Side (Icon-Message order)
        <div className="flex items-start space-x-2.5 justify-end">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center shadow-lg ring-2 ring-primary/30"
          >
            <User className="h-4 w-4" />
          </motion.div>
          <div className="flex flex-col max-w-[75%] lg:max-w-[60%] items-end">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-xl rounded-tl-md px-3 py-2.5 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                {message.content}
              </p>
            </motion.div>
            <span className="text-xs text-muted-foreground mt-1.5 mr-1 opacity-70">
              {formatTime(message.created_at)}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};