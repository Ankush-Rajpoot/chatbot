-- Hasura Database Setup
-- Run these commands in your Hasura Console -> Data -> SQL

-- Create chats table
CREATE TABLE public.chats (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create messages table
CREATE TABLE public.messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    chat_id uuid NOT NULL,
    user_id uuid NOT NULL,
    content text NOT NULL,
    is_bot boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_chats_user_id ON public.chats(user_id);
CREATE INDEX idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX idx_messages_user_id ON public.messages(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chats table
CREATE POLICY "Users can view their own chats" ON public.chats
    FOR SELECT USING (current_setting('request.jwt.claims', true)::json->>'x-hasura-user-id' = user_id::text);

CREATE POLICY "Users can insert their own chats" ON public.chats
    FOR INSERT WITH CHECK (current_setting('request.jwt.claims', true)::json->>'x-hasura-user-id' = user_id::text);

CREATE POLICY "Users can update their own chats" ON public.chats
    FOR UPDATE USING (current_setting('request.jwt.claims', true)::json->>'x-hasura-user-id' = user_id::text);

CREATE POLICY "Users can delete their own chats" ON public.chats
    FOR DELETE USING (current_setting('request.jwt.claims', true)::json->>'x-hasura-user-id' = user_id::text);

-- RLS Policies for messages table
CREATE POLICY "Users can view messages in their chats" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE chats.id = messages.chat_id 
            AND current_setting('request.jwt.claims', true)::json->>'x-hasura-user-id' = chats.user_id::text
        )
    );

CREATE POLICY "Users can insert messages in their chats" ON public.messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE chats.id = messages.chat_id 
            AND current_setting('request.jwt.claims', true)::json->>'x-hasura-user-id' = chats.user_id::text
        )
    );

CREATE POLICY "Bots can insert messages" ON public.messages
    FOR INSERT WITH CHECK (is_bot = true);
