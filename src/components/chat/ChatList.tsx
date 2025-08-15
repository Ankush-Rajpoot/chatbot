import React from 'react';
import { useQuery } from '@apollo/client';
import { Plus, MessageCircle, Clock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GET_CHATS } from '../../graphql/queries';
import { Chat } from '../../types';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface ChatListProps {
  onSelectChat: (chat: Chat) => void;
  onCreateChat: () => void;
  selectedChatId?: string;
}

export const ChatList: React.FC<ChatListProps> = ({
  onSelectChat,
  onCreateChat,
  selectedChatId,
}) => {
  const { data, loading, error } = useQuery(GET_CHATS, {
    onCompleted: (data) => {
      console.log('[ChatList] Chats loaded:', data);
    },
    onError: (error) => {
      console.error('[ChatList] Error loading chats:', error);
    },
  });

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    console.log('[ChatList] Loading chats...');
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    console.error('[ChatList] Error loading chats:', error);
    return (
      <div className="flex items-center justify-center h-64 text-destructive">
        <p className="text-sm px-4">Error loading chats: {error.message}</p>
      </div>
    );
  }

  const chats = data?.chats || [];
  // Sort chats by updated_at in descending order (newest first)
  const sortedChats = [...chats].sort((a: Chat, b: Chat) => {
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });
  console.log('[ChatList] Rendered chats:', sortedChats);

  return (
    <div className="flex flex-col h-full max-h-full">
      {/* Header with New Chat Button */}
      <div className="flex-shrink-0 p-2.5 sm:p-3 border-b border-border/50">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={onCreateChat}
            className="
              w-full bg-gradient-to-r from-primary to-primary/90 text-primary-foreground 
              rounded-xl py-2 px-3 hover:from-primary/90 hover:to-primary/80 
              transition-all duration-200 flex items-center justify-center space-x-2 
              text-sm font-medium shadow-lg hover:shadow-xl
            "
          >
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </Button>
        </motion.div>
      </div>

      {/* Chat List - Scrollable */}
      <div className="flex-1 overflow-y-auto overscroll-contain chat-list-scroll">
        <div className="h-full">
          <AnimatePresence>
            {sortedChats.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-muted-foreground p-3"
              >
                <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10 mb-2 sm:mb-3" />
                <p className="text-sm sm:text-base font-medium mb-1">No chats yet</p>
                <p className="text-xs text-center">Start a new conversation to get started</p>
              </motion.div>
            ) : (
              <div className="p-1.5 sm:p-2 space-y-1">
                {sortedChats.map((chat: Chat, index: number) => (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={`
                        cursor-pointer transition-all duration-200 hover:shadow-lg
                        ${selectedChatId === chat.id 
                          ? 'bg-accent/80 border-primary/50 shadow-md ring-2 ring-primary/20' 
                          : 'bg-card/50 border-border/50 hover:bg-accent/30 hover:border-border'
                        }
                        backdrop-blur-sm
                      `}
                      onClick={() => onSelectChat(chat)}
                    >
                      <div className="p-2.5 sm:p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0 pr-2">
                            <h3 className="font-semibold text-foreground truncate mb-1.5 text-sm">
                              {chat.title}
                            </h3>
                            {chat.messages && chat.messages[0] && (
                              <p className="text-xs text-muted-foreground truncate flex items-center space-x-1">
                                {chat.messages[0].is_bot ? (
                                  <span className="flex-shrink-0 w-3 h-3 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                                    <MessageCircle className="h-1.5 w-1.5 text-primary-foreground" />
                                  </span>
                                ) : (
                                  <span className="flex-shrink-0 w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                                    <span className="text-xs text-primary-foreground">U</span>
                                  </span>
                                )}
                                <span className="truncate">{chat.messages[0].content}</span>
                              </p>
                            )}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground ml-1 flex-shrink-0">
                            <Clock className="h-2.5 w-2.5 mr-0.5 opacity-60" />
                            <span className="hidden sm:inline text-xs">{formatTime(chat.updated_at)}</span>
                            <span className="sm:hidden text-xs">{formatTime(chat.updated_at).split(' ')[0]}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};