-- Run this if tables already exist but policies/indexes are missing

-- Create indexes for better performance (will skip if they exist)
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON public.chats(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON public.messages(user_id);

-- Enable RLS (Row Level Security) - safe to run multiple times
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own chats" ON public.chats;
DROP POLICY IF EXISTS "Users can insert their own chats" ON public.chats;
DROP POLICY IF EXISTS "Users can update their own chats" ON public.chats;
DROP POLICY IF EXISTS "Users can delete their own chats" ON public.chats;
DROP POLICY IF EXISTS "Users can view messages in their chats" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages in their chats" ON public.messages;
DROP POLICY IF EXISTS "Bots can insert messages" ON public.messages;

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
