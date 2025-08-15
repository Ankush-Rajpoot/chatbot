import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { AppHeader } from './AppHeader';
import { ChatList } from '../chat/ChatList';
import { ChatArea } from '../chat/ChatArea';
import { CREATE_CHAT } from '../../graphql/mutations';
import { Chat } from '../../types';
import { Button } from '../ui/button';

export const AppLayout: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [createChat] = useMutation(CREATE_CHAT);

  const handleSelectChat = (chat: Chat) => {
    console.log('[AppLayout] Selected chat:', chat);
    setSelectedChat(chat);
    // Close sidebar on mobile after selecting a chat
    setIsSidebarOpen(false);
  };

  const handleCreateChat = async () => {
    console.log('[AppLayout] Creating new chat...');
    try {
      // Generate a cleaner chat title
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      const chatTitle = `New Chat ${timeString}`;

      const { data } = await createChat({
        variables: {
          title: chatTitle,
        },
        refetchQueries: ['GetChats'],
      });

      if (data?.insert_chats_one) {
        console.log('[AppLayout] New chat created:', data.insert_chats_one);
        setSelectedChat(data.insert_chats_one);
        // Close sidebar on mobile after creating a chat
        setIsSidebarOpen(false);
      }
    } catch (error) {
      console.error('[AppLayout] Error creating chat:', error);
    }
  };

  console.log('[AppLayout] Rendering layout...');
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-card">
      <AppHeader />
      
      <div className="flex-1 flex relative min-h-0">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden absolute top-3 left-3 z-50 bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-card shadow-lg transition-all duration-200 h-8 w-8"
        >
          {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>

        {/* Mobile Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <div
          className={`
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            md:translate-x-0 transition-all duration-300 ease-out
            fixed md:relative z-50 md:z-auto 
            w-72 sm:w-80 md:w-72 lg:w-80 xl:w-72 
            bg-card/95 backdrop-blur-md border-r border-border/50 
            h-full flex flex-col shadow-xl md:shadow-none
          `}
        >
          <ChatList
            onSelectChat={handleSelectChat}
            onCreateChat={handleCreateChat}
            selectedChatId={selectedChat?.id}
          />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 min-w-0">
          <ChatArea chat={selectedChat} />
        </div>
      </div>
    </div>
  );
};