import React from 'react';
import { useSignOut } from '@nhost/react';
import { LogOut, Settings, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

export const AppHeader: React.FC = () => {
  const { signOut } = useSignOut();

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-card/80 backdrop-blur-md border-b border-border/50 px-3 sm:px-5 py-3 shadow-sm"
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center space-x-2.5"
        >
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-r from-primary via-accent to-primary rounded-lg flex items-center justify-center shadow-lg">
              <MessageCircle className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-card animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              AI Chatbot
            </h1>
            <p className="text-xs text-muted-foreground">Powered by AI</p>
          </div>
        </motion.div>

        <div className="flex items-center space-x-2.5">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg hover:bg-accent/50 transition-all duration-200"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={signOut}
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};