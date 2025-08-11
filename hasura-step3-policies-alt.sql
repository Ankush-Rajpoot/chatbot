-- Step 3 Alternative: Create RLS Policies (Alternative Version)
-- Use this if the main version doesn't work
-- This version uses a simpler approach compatible with most Nhost setups

-- RLS Policies for chats table
CREATE POLICY "Users can view their own chats" ON public.chats
    FOR SELECT USING (user_id = (current_setting('request.jwt.claims')::json->>'x-hasura-user-id')::uuid);

CREATE POLICY "Users can insert their own chats" ON public.chats
    FOR INSERT WITH CHECK (user_id = (current_setting('request.jwt.claims')::json->>'x-hasura-user-id')::uuid);

CREATE POLICY "Users can update their own chats" ON public.chats
    FOR UPDATE USING (user_id = (current_setting('request.jwt.claims')::json->>'x-hasura-user-id')::uuid);

CREATE POLICY "Users can delete their own chats" ON public.chats
    FOR DELETE USING (user_id = (current_setting('request.jwt.claims')::json->>'x-hasura-user-id')::uuid);

-- RLS Policies for messages table
CREATE POLICY "Users can view messages in their chats" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE chats.id = messages.chat_id 
            AND chats.user_id = (current_setting('request.jwt.claims')::json->>'x-hasura-user-id')::uuid
        )
    );

CREATE POLICY "Users can insert messages in their chats" ON public.messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE chats.id = messages.chat_id 
            AND chats.user_id = (current_setting('request.jwt.claims')::json->>'x-hasura-user-id')::uuid
        )
    );

CREATE POLICY "Bots can insert messages" ON public.messages
    FOR INSERT WITH CHECK (is_bot = true);
