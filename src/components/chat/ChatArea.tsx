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

  const { data: subscriptionData, error: subscriptionError } = useSubscription(MESSAGES_SUBSCRIPTION, {
    variables: { chatId: chat?.id },
    skip: !chat?.id,
    fetchPolicy: 'no-cache', // Disable caching for subscriptions
    onSubscriptionData: ({ subscriptionData }) => {
      console.log('[ChatArea] 🔔 Subscription update received:', subscriptionData.data);
      if (subscriptionData.data?.messages) {
        console.log('[ChatArea] 📬 Messages from subscription:', subscriptionData.data.messages.length);
        const botMessages = subscriptionData.data.messages.filter((msg: any) => msg.is_bot);
        if (botMessages.length > 0) {
          console.log('[ChatArea] 🤖 Bot messages detected:', botMessages);
        }
      }
    },
    onError: (error) => {
      console.error('[ChatArea] ❌ Subscription error:', error);
      console.error('[ChatArea] ❌ Subscription error details:', JSON.stringify(error, null, 2));
    },
  });

  const [createMessage] = useMutation(CREATE_MESSAGE);
  const [sendMessageAction] = useMutation(SEND_MESSAGE_ACTION);

  // Log subscription error if it exists
  useEffect(() => {
    if (subscriptionError) {
      console.error('[ChatArea] ❌ Subscription error in useEffect:', subscriptionError);
    }
  }, [subscriptionError]);

  const rawMessages: Message[] = subscriptionData?.messages || messagesData?.messages || [];
  // Sort messages by created_at in ascending order (oldest first)
  const messages = [...rawMessages].sort((a: Message, b: Message) => {
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    console.log('[ChatArea] Scrolled to bottom. Messages:', messages);
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!chat) return;
    console.log('[ChatArea] 🚀 Starting message send flow...');
    console.log('[ChatArea] Chat ID:', chat.id);
    console.log('[ChatArea] Message content:', content);

    try {
      // First, create the user message
      console.log('[ChatArea] 📝 Step 1: Saving user message to database...');
      const userMsgRes = await createMessage({
        variables: {
          chatId: chat.id,
          content,
          isBot: false,
        },
      });
      console.log('[ChatArea] ✅ User message saved successfully:', userMsgRes);

      // Then trigger the chatbot via Hasura Action
      console.log('[ChatArea] 🤖 Step 2: Triggering AI response via Hasura Action...');
      console.log('[ChatArea] Action variables:', { chatId: chat.id, message: content });
      
      const botRes = await sendMessageAction({
        variables: {
          chatId: chat.id,
          message: content,
        },
      });
      console.log('[ChatArea] 🎉 Hasura Action response:', botRes);
      
      if (botRes.data?.sendMessage?.success) {
        console.log('[ChatArea] ✅ AI response successful:', botRes.data.sendMessage.message);
        console.log('[ChatArea] 🤖 AI response content:', botRes.data.sendMessage.response);
        
        // If we get a valid AI response, save it as a bot message
        if (botRes.data.sendMessage.response && botRes.data.sendMessage.response !== "{{ $json[0].choices[0].message.content }}" && botRes.data.sendMessage.response !== "{{ $node['Call OpenRouter AI'].json[0].choices[0].message.content }}") {
          console.log('[ChatArea] 💾 Saving bot response to database...');
          try {
            const saveBotRes = await createMessage({
              variables: {
                chatId: chat.id,
                content: botRes.data.sendMessage.response,
                isBot: true,
              },
            });
            console.log('[ChatArea] ✅ Bot message saved successfully:', saveBotRes);
          } catch (saveError) {
            console.error('[ChatArea] ❌ Error saving bot message:', saveError);
          }
        } else {
          console.error('[ChatArea] ❌ Invalid AI response - template not processed:', botRes.data.sendMessage.response);
        }
      } else {
        console.error('[ChatArea] ❌ AI response failed:', botRes.data?.sendMessage);
      }
    } catch (error: any) {
      console.error('[ChatArea] 💥 Error in message send flow:', error);
      
      // Check if it's a GraphQL error
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        console.error('[ChatArea] 📋 GraphQL Errors:', error.graphQLErrors);
        error.graphQLErrors.forEach((gqlError: any, index: number) => {
          console.error(`[ChatArea] GraphQL Error ${index + 1}:`, {
            message: gqlError.message,
            locations: gqlError.locations,
            path: gqlError.path,
            extensions: gqlError.extensions
          });
        });
      }
      
      // Check if it's a network error
      if (error.networkError) {
        console.error('[ChatArea] 🌐 Network Error:', error.networkError);
        if (error.networkError.result) {
          console.error('[ChatArea] Network Error Details:', error.networkError.result);
        }
      }
      
      // Check the full error structure
      console.error('[ChatArea] 🔍 Full Error Object:', JSON.stringify(error, null, 2));
      
      // Show error message or toast here
      alert(`Error sending message: ${error.message || 'Unknown error'}`);
    }
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background to-card/20 p-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-sm"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative mb-6"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary via-accent to-primary rounded-2xl flex items-center justify-center mx-auto shadow-2xl ring-4 ring-primary/20">
              <MessageCircle className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-background animate-bounce"></div>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-3"
          >
            Welcome to AI Chat
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-muted-foreground leading-relaxed"
          >
            Select a chat or create a new one to start an intelligent conversation
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 flex justify-center space-x-1.5"
          >
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background h-full max-h-full overflow-hidden">
      {/* Chat Header */}
      <div className="flex-shrink-0 bg-card border-b border-border px-3 sm:px-5 py-2.5 sm:py-3">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2.5"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
            <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm sm:text-base font-semibold text-foreground truncate">{chat.title}</h1>
            <p className="text-xs text-muted-foreground">AI Assistant</p>
          </div>
        </motion.div>
      </div>

      {/* Messages Area - Properly Scrollable */}
      <div className="flex-1 overflow-y-auto overscroll-contain chat-area-scroll px-3 sm:px-5 py-3 sm:py-4">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-full min-h-[200px]"
            >
              <div className="text-center">
                <MessageCircle className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">
                  Start the conversation
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Send a message to begin chatting with the AI
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {messages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isLast={index === messages.length - 1}
                />
              ))}
              <div ref={messagesEndRef} className="h-1" />
            </div>
          )}
        </div>
      </div>

      {/* Message Input - Fixed at bottom */}
      <div className="flex-shrink-0">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};