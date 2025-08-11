import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { motion } from 'framer-motion';
import { AppHeader } from './AppHeader';
import { ChatList } from '../chat/ChatList';
import { ChatArea } from '../chat/ChatArea';
import { CREATE_CHAT } from '../../graphql/mutations';
import { Chat } from '../../types';

export const AppLayout: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [createChat] = useMutation(CREATE_CHAT);

  const handleSelectChat = (chat: Chat) => {
    console.log('[AppLayout] Selected chat:', chat);
    setSelectedChat(chat);
  };

  const handleCreateChat = async () => {
    console.log('[AppLayout] Creating new chat...');
    try {
      const { data } = await createChat({
        variables: {
          title: `New Chat ${new Date().toLocaleString()}`,
        },
        refetchQueries: ['GetChats'],
      });

      if (data?.insert_chats_one) {
        console.log('[AppLayout] New chat created:', data.insert_chats_one);
        setSelectedChat(data.insert_chats_one);
      }
    } catch (error) {
      console.error('[AppLayout] Error creating chat:', error);
    }
  };

  console.log('[AppLayout] Rendering layout...');
  return (
    <div className="h-screen flex flex-col bg-slate-100">
      <AppHeader />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-80 bg-white border-r border-slate-200 flex flex-col"
        >
          <ChatList
            onSelectChat={handleSelectChat}
            onCreateChat={handleCreateChat}
            selectedChatId={selectedChat?.id}
          />
        </motion.div>

        {/* Main Chat Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex-1 flex flex-col"
        >
          <ChatArea chat={selectedChat} />
        </motion.div>
      </div>
    </div>
  );
};