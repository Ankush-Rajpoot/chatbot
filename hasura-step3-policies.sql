-- Step 3: Create RLS Policies
-- Run this after RLS is enabled
-- Updated to use current_setting for Nhost/Hasura compatibility

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
