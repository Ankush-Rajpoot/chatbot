import React from 'react';
import { useSignOut, useUserData } from '@nhost/react';
import { LogOut, Settings, User } from 'lucide-react';
import { motion } from 'framer-motion';

export const AppHeader: React.FC = () => {
  const { signOut } = useSignOut();
  const user = useUserData();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-slate-200 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">ChatBot</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <User className="h-4 w-4" />
            <span>{user?.displayName || user?.email}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
              <Settings className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleSignOut}
              className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};