# Complete Setup Guide for Chatbot Application

## Overview
This guide will help you set up all the required services and connect them properly.

## 1. Nhost Setup

### Create Nhost Project:
1. Go to [Nhost Console](https://app.nhost.io)
2. Create a new project
3. Note down your:
   - Subdomain (e.g., `abcdef123456`)
   - Region (e.g., `us-east-1`)
   - Hasura endpoint will be: `https://abcdef123456.hasura.us-east-1.nhost.run/v1/graphql`

### Enable Authentication:
1. In Nhost console → Settings → Authentication
2. Enable "Email + Password" sign-in method
3. Set allowed redirect URLs to include your domain

## 2. Hasura Setup

### Access Hasura Console:
1. From Nhost dashboard, click "Open Hasura"
2. Or go directly to: `https://abcdef123456.hasura.us-east-1.nhost.run/console`

### Create Database Tables:
1. **Important**: Make sure you're accessing Hasura Console with **admin permissions**
2. Go to Data → SQL
3. **UNCHECK the "Read only" checkbox** at the bottom of the SQL editor
4. **CHECK the "Track this" checkbox** to track the new tables automatically
5. Run the SQL from `hasura-setup.sql`:
   - Open the `hasura-setup.sql` file in your project folder
   - Copy the entire SQL content from the file
   - In Hasura Console, paste the SQL into the SQL editor text area
   - **Make sure "Read only" is UNCHECKED and "Track this" is CHECKED**
   - Click "Run!" button to execute all the SQL commands
   - You should see success messages for each table creation and policy setup
6. This creates `chats` and `messages` tables with proper RLS

#### Troubleshooting "read-only transaction" Error:
If you get the error "cannot execute CREATE TABLE in a read-only transaction":

**Option A: Uncheck "Read only" Checkbox**
- Make sure you **UNCHECK the "Read only" checkbox** at the bottom of the SQL editor
- The "Read only" checkbox prevents any write operations to the database
- When unchecked, you can create tables and modify the database schema

**Option B: Use Raw SQL Tab (Alternative)**
- Instead of Data → SQL, go to Data tab
- Look for a "Raw SQL" or "Execute SQL" option
- Some Hasura versions have this in a different location

**Option C: Verify Admin Access**
- Ensure you're accessing Hasura Console with admin privileges
- If using Nhost, make sure you clicked "Open Hasura" from the Nhost dashboard
- Check that your Hasura admin secret is correct

**Option D: Execute Commands Step by Step**
If the bulk execution fails, use the separate SQL files:
1. Run `hasura-step1-tables.sql` - Creates the tables
2. Run `hasura-step2-rls.sql` - Creates indexes and enables RLS
3. Run `hasura-step3-policies.sql` - Creates security policies
(Each file contains smaller, focused SQL commands that are less likely to fail)

#### Detailed SQL Execution Steps:

**Step 2.1: Access the SQL Editor**
- In Hasura Console, click on the "Data" tab in the top navigation
- Click on "SQL" in the left sidebar (below the database tables list)
- You'll see a SQL editor with a text area and a "Run!" button

**Step 2.2: Copy the SQL Content**
- Open the `hasura-setup.sql` file from your project root directory
- Select all content (Ctrl+A) and copy (Ctrl+C)
- The file contains:
  ```sql
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
  -- ... and more SQL commands
  ```

**Step 2.3: Configure Checkboxes and Execute**
- Paste the copied SQL into the Hasura SQL editor text area
- **IMPORTANT: Look at the checkboxes at the bottom:**
  - **UNCHECK "Read only"** - This allows write operations
  - **CHECK "Track this"** - This automatically tracks new tables in Hasura
  - **"Cascade metadata"** can remain as is (usually checked by default)
- Review the SQL to ensure it's complete (should include CREATE TABLE, ALTER TABLE, CREATE POLICY statements)
- Click the "Run!" button (usually orange/blue colored)
- Wait for execution to complete

**Step 2.4: Verify Success**
- You should see output messages like:
  ```
  ✅ CREATE TABLE
  ✅ CREATE INDEX  
  ✅ ALTER TABLE
  ✅ CREATE POLICY
  ```
- If you see any errors, check the SQL syntax and try again
- After successful execution, you'll see `chats` and `messages` tables appear in the left sidebar under "public" schema

### Set up Permissions:
1. Go to Data → chats → Permissions
2. Add permissions for `user` role as described in `hasura-permissions.md`
3. Repeat for `messages` table

### Create Relationships:
1. In `chats` table → Relationships:
   - Array relationship: `messages` (chats.id → messages.chat_id)
2. In `messages` table → Relationships:
   - Object relationship: `chat` (messages.chat_id → chats.id)

### Create Hasura Action:
1. Go to Actions → Create Action
2. Follow the configuration in `hasura-action-config.md`
3. Set webhook URL to your n8n webhook (you'll get this in step 4)

## 3. OpenRouter Setup

### Get API Key:
1. Go to [OpenRouter](https://openrouter.ai)
2. Sign up/Sign in
3. Go to API Keys section
4. Create a new API key
5. Note: They offer free models like `meta-llama/llama-3.1-8b-instruct:free`

## 4. n8n Setup

### Option A: n8n Cloud (Recommended)
1. Go to [n8n Cloud](https://n8n.io/cloud/)
2. Create account and workspace

### Option B: Self-hosted
1. Install n8n: `npm install n8n -g`
2. Run: `n8n start`
3. Access at `http://localhost:5678`

### Import Workflow:
1. In n8n, go to Workflows → Import from File
2. Import `n8n-workflow.json`
3. Set environment variables in n8n:
   - `HASURA_ENDPOINT`: Your Hasura GraphQL endpoint
   - `HASURA_ADMIN_SECRET`: Your Hasura admin secret
   - `OPENROUTER_API_KEY`: Your OpenRouter API key

### Get Webhook URL:
1. In the workflow, click on "Webhook Trigger" node
2. Copy the webhook URL (e.g., `https://your-n8n.app.n8n.cloud/webhook/chatbot`)
3. Use this URL in your Hasura Action configuration

## 5. Frontend Configuration

### Environment Variables:
1. Copy `.env.example` to `.env`
2. Fill in the actual values from your services:

```env
VITE_NHOST_SUBDOMAIN=your-actual-nhost-subdomain
VITE_NHOST_REGION=us-east-1
VITE_HASURA_GRAPHQL_ENDPOINT=https://your-hasura-endpoint.hasura.app/v1/graphql
VITE_HASURA_WS_ENDPOINT=wss://your-hasura-endpoint.hasura.app/v1/graphql
```

### Install Dependencies:
```bash
npm install
```

### Development:
```bash
npm run dev
```

### Build for Production:
```bash
npm run build
```

## 6. Deployment to Netlify

### Prepare for Deployment:
1. Build the project: `npm run build`
2. The `dist/` folder contains your built app

### Deploy to Netlify:
1. Go to [Netlify](https://app.netlify.com)
2. Drag and drop your `dist/` folder, OR
3. Connect your Git repository for continuous deployment

### Set Environment Variables in Netlify:
1. Go to Site settings → Environment variables
2. Add all your `VITE_*` environment variables
3. Redeploy the site

### Configure Redirects:
1. Create `public/_redirects` file with content:
```
/*    /index.html   200
```
2. This ensures React Router works properly on Netlify

## 7. Testing the Complete Flow

### Test Authentication:
1. Sign up with a new email
2. Verify you're redirected to the chat interface

### Test Chat Creation:
1. Create a new chat
2. Verify it appears in the chat list

### Test Message Flow:
1. Send a message in a chat
2. Verify the message appears immediately
3. Verify the bot response arrives within a few seconds
4. Check that the response appears in real-time

### Verify Security:
1. Check that users can only see their own chats
2. Test that the n8n workflow validates chat ownership
3. Verify that direct API calls to OpenRouter are blocked

## 8. Troubleshooting

### Common Issues:

#### Messages not appearing:
- Check Hasura permissions for `messages` table
- Verify WebSocket connection in browser dev tools
- Check n8n workflow execution logs

#### Bot not responding:
- Verify Hasura Action is configured correctly
- Check n8n webhook is receiving requests
- Verify OpenRouter API key is working
- Check n8n execution logs

#### Authentication issues:
- Verify Nhost configuration
- Check JWT token in localStorage
- Verify Hasura receives proper headers

#### Build/Deploy issues:
- Ensure all environment variables are set
- Check that `_redirects` file is in place for Netlify
- Verify build completes without errors

## 9. Production Checklist

- [ ] All environment variables configured
- [ ] Database tables created with RLS enabled
- [ ] Hasura permissions set up correctly
- [ ] n8n workflow imported and tested
- [ ] OpenRouter API key working
- [ ] Authentication flow tested
- [ ] Real-time subscriptions working
- [ ] Chat ownership validation working
- [ ] App deployed to Netlify
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active

## Security Notes

- Never expose your Hasura admin secret to the frontend
- Always validate chat ownership in n8n before processing
- Use HTTPS for all external API calls
- Keep OpenRouter API key secure in n8n environment
- Implement rate limiting if needed
- Monitor API usage and costs

This setup ensures a secure, scalable chatbot application that meets all the assignment requirements!
