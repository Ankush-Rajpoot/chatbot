import React, { useEffect, useRef } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { MessageCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { GET_MESSAGES } from '../../graphql/queries';
import { CREATE_MESSAGE, SEND_MESSAGE_ACTION } from '../../graphql/mutations';
import { MESSAGES_SUBSCRIPTION } from '../../graphql/subscriptions';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { Chat, Message } from '../../types';

interface ChatAreaProps {
  chat: Chat | null;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ chat }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { data: messagesData, loading } = useQuery(GET_MESSAGES, {
    variables: { chatId: chat?.id },
    skip: !chat?.id,
    onCompleted: (data) => {
      console.log('[ChatArea] Messages loaded:', data);
    },
    onError: (error) => {
      console.error('[ChatArea] Error loading messages:', error);
    },
  });

  const { data: subscriptionData } = useSubscription(MESSAGES_SUBSCRIPTION, {
    variables: { chatId: chat?.id },
    skip: !chat?.id,
    onSubscriptionData: ({ subscriptionData }) => {
      console.log('[ChatArea] Subscription update:', subscriptionData.data);
    },
    onError: (error) => {
      console.error('[ChatArea] Subscription error:', error);
    },
  });

  const [createMessage] = useMutation(CREATE_MESSAGE);
  const [sendMessageAction] = useMutation(SEND_MESSAGE_ACTION);

  const messages: Message[] = subscriptionData?.messages || messagesData?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    console.log('[ChatArea] Scrolled to bottom. Messages:', messages);
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!chat) return;
    console.log('[ChatArea] Sending message:', content);

    try {
      // First, create the user message
      const userMsgRes = await createMessage({
        variables: {
          chatId: chat.id,
          content,
          isBot: false,
        },
      });
      console.log('[ChatArea] User message saved:', userMsgRes);

      // Then trigger the chatbot via Hasura Action
      const botRes = await sendMessageAction({
        variables: {
          chatId: chat.id,
          message: content,
        },
      });
      console.log('[ChatArea] Bot action triggered:', botRes);
    } catch (error) {
      console.error('[ChatArea] Error sending message:', error);
      // Show error message or toast here
    }
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <MessageCircle className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-600 mb-2">
            Welcome to AI Chat
          </h2>
          <p className="text-slate-500">
            Select a chat or create a new one to start conversing
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-3"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">{chat.title}</h1>
            <p className="text-sm text-slate-600">AI Assistant</p>
          </div>
        </motion.div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-full"
          >
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">
                Start the conversation
              </h3>
              <p className="text-slate-500">
                Send a message to begin chatting with the AI
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                isLast={index === messages.length - 1}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};