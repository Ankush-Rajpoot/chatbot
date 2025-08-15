import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

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
    console.log('[MessageInput] Submitting message:', messageText);
    setMessage('');
    setIsLoading(true);

    try {
      await onSendMessage(messageText);
      console.log('[MessageInput] Message sent successfully');
    } catch (error) {
      console.error('[MessageInput] Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      console.log('[MessageInput] Enter pressed, submitting message');
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-border/50 bg-card/80 backdrop-blur-md p-2.5 sm:p-3">
      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onSubmit={handleSubmit} 
        className="flex space-x-2"
      >
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              console.log('[MessageInput] Message input changed:', e.target.value);
            }}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            rows={1}
            className="
              w-full resize-none rounded-xl border border-input/50 bg-background/80 backdrop-blur-sm
              px-3 py-2.5 pr-10 
              text-sm text-foreground placeholder:text-muted-foreground 
              focus:ring-2 focus:ring-primary/50 focus:border-primary/50 
              disabled:opacity-50 disabled:cursor-not-allowed 
              transition-all duration-200 shadow-sm hover:shadow-md
            "
            style={{
              minHeight: '40px',
              maxHeight: '100px',
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = '40px';
              target.style.height = target.scrollHeight + 'px';
              console.log('[MessageInput] Textarea resized:', target.style.height);
            }}
          />
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              type="submit"
              disabled={!message.trim() || disabled || isLoading}
              className="
                absolute right-1.5 top-1/2 transform -translate-y-1/2 
                h-7 w-7 p-0 rounded-lg
                bg-gradient-to-r from-primary to-primary/80 
                hover:from-primary/90 hover:to-primary/70
                disabled:opacity-50 transition-all duration-200
                shadow-lg hover:shadow-xl
              "
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
            </Button>
          </motion.div>
        </div>
      </motion.form>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-1.5 text-xs text-muted-foreground/70 text-center"
      >
        <span className="hidden sm:inline">Press </span>
        <kbd className="px-1.5 py-0.5 bg-muted/50 rounded text-muted-foreground text-xs font-mono">Enter</kbd>
        <span className="hidden sm:inline"> to send, </span>
        <span className="sm:hidden"> send, </span>
        <kbd className="px-1.5 py-0.5 bg-muted/50 rounded text-muted-foreground text-xs font-mono">Shift+Enter</kbd>
        <span className="hidden sm:inline"> for new line</span>
        <span className="sm:hidden"> new line</span>
      </motion.div>
    </div>
  );
};