import React from 'react';
import { useQuery } from '@apollo/client';
import { Plus, MessageCircle, Clock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GET_CHATS } from '../../graphql/queries';
import { Chat } from '../../types';

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
  const { data, loading, error } = useQuery(GET_CHATS);

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
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-600">
        <p>Error loading chats</p>
      </div>
    );
  }

  const chats = data?.chats || [];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-200">
        <button
          onClick={onCreateChat}
          className="w-full bg-blue-600 text-white rounded-xl py-3 px-4 hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>New Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {chats.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-64 text-slate-500"
            >
              <MessageCircle className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium mb-2">No chats yet</p>
              <p className="text-sm text-center">Start a new conversation to get started</p>
            </motion.div>
          ) : (
            <div className="p-2 space-y-1">
              {chats.map((chat: Chat, index: number) => (
                <motion.button
                  key={chat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onSelectChat(chat)}
                  className={`w-full text-left p-4 rounded-xl transition-all hover:bg-slate-50 ${
                    selectedChatId === chat.id ? 'bg-blue-50 border-2 border-blue-200' : 'border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-900 truncate mb-1">
                        {chat.title}
                      </h3>
                      {chat.messages && chat.messages[0] && (
                        <p className="text-sm text-slate-600 truncate">
                          {chat.messages[0].is_bot ? '🤖 ' : ''}
                          {chat.messages[0].content}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-slate-500 ml-2">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(chat.updated_at)}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};