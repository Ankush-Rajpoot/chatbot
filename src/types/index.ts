export interface User {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  title: string;
  user_id: string; // Changed from userId to match database
  created_at: string; // Changed to match database
  updated_at: string; // Changed to match database
  messages?: Message[]; // Made optional since it might not always be included
}

export interface Message {
  id: string;
  chat_id: string; // Changed from chatId to match database
  user_id: string; // Changed from userId to match database
  content: string;
  is_bot: boolean; // Changed from isBot to match database
  created_at: string; // Changed to match database
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}