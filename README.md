# AI Chatbot Application - Internship Assessment

A modern, full-stack chatbot application built for the internship assessment. Features real-time chat, AI-powered responses, and secure authentication.

## 🚀 Features

- **Authentication**: Email-based sign-up/sign-in with Nhost Auth
- **Real-time Chat**: Live messaging with GraphQL subscriptions
- **AI Integration**: Chatbot powered by OpenRouter AI models
- **Secure Architecture**: Row-level security and proper permissions
- **Modern UI**: Responsive design with Tailwind CSS and Framer Motion
- **Type Safety**: Full TypeScript implementation

## 🏗️ Architecture

```
Frontend (React) 
    ↓ GraphQL
Hasura (Database + API)
    ↓ Actions/Webhooks
n8n (Workflow Automation)
    ↓ API Calls
OpenRouter (AI Models)
```

### Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Authentication**: Nhost Auth
- **Database**: PostgreSQL with Hasura
- **Real-time**: GraphQL Subscriptions (WebSockets)
- **AI**: OpenRouter API (via n8n workflows)
- **Deployment**: Netlify

## 📋 Requirements Checklist

- ✅ Email Sign In/Sign Up using Nhost Auth
- ✅ Chat system using Hasura GraphQL queries, mutations, and subscriptions
- ✅ Chatbot powered by n8n connected to Hasura Actions → OpenRouter
- ✅ Row-Level Security (RLS) for data protection
- ✅ GraphQL-only communication (no direct REST API calls)
- ✅ Proper authentication and role permissions
- ✅ Real-time updates via subscriptions

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Nhost account
- n8n instance (cloud or self-hosted)
- OpenRouter API key

### 1. Quick Start
```bash
# Clone and install dependencies
git clone <your-repo>
cd chatbot
npm install

# Set up environment variables
cp .env.example .env
# Fill in your actual service URLs and keys

# Start development server
npm run dev
```

### 2. Complete Setup
Follow the detailed setup guide in `SETUP_GUIDE.md` for:
- Nhost project configuration
- Hasura database setup and permissions
- n8n workflow import and configuration
- OpenRouter API integration
- Netlify deployment

### 3. Quick Deploy
```bash
# Run deployment script
./deploy.ps1

# Or manually:
npm run build
# Deploy dist/ folder to Netlify
```

## � Security Features

- **Row-Level Security**: Users can only access their own chats and messages
- **Authentication Guards**: All routes protected by authentication
- **Chat Ownership Validation**: n8n validates user owns chat before processing
- **Secure API Keys**: All external API keys stored securely in n8n environment
- **No Direct API Calls**: All external APIs accessed through secure n8n workflows

## � Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── chat/           # Chat interface components  
│   └── layout/         # Layout components
├── graphql/
│   ├── queries.ts      # GraphQL queries
│   ├── mutations.ts    # GraphQL mutations
│   └── subscriptions.ts # GraphQL subscriptions
├── lib/
│   ├── apollo.ts       # Apollo Client configuration
│   └── nhost.ts        # Nhost client setup
└── types/              # TypeScript type definitions
```

## 🔧 Configuration Files

- `hasura-setup.sql` - Database schema and RLS policies
- `hasura-permissions.md` - Hasura permission configuration
- `hasura-action-config.md` - Hasura Action setup guide
- `n8n-workflow.json` - Complete n8n workflow configuration
- `SETUP_GUIDE.md` - Comprehensive setup instructions

## 🚀 Deployment

The application is deployed on Netlify with the following configuration:
- Automatic builds from Git repository
- Environment variables configured in Netlify dashboard
- Single-page application routing with `_redirects` file
- HTTPS enabled for secure WebSocket connections

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Chat creation and listing
- [ ] Message sending and receiving
- [ ] Real-time message updates
- [ ] Bot response generation
- [ ] Data isolation between users
- [ ] Responsive design on mobile/desktop

### Key Flows to Verify
1. **Authentication Flow**: Sign up → Email verification → Login → Chat access
2. **Chat Flow**: Create chat → Send message → Receive bot response → Real-time updates
3. **Security Flow**: Try accessing other users' chats (should be blocked)

## 📈 Performance Considerations

- Optimistic UI updates for better user experience
- Message pagination for large chat histories
- Connection retry logic for WebSocket failures
- Efficient Apollo Client caching
- Image optimization and lazy loading

## � Future Enhancements

- File upload and sharing
- Voice messages
- Chat themes and customization  
- Multiple AI model selection
- Chat export functionality
- Admin dashboard
- Usage analytics

## 🐛 Troubleshooting

Common issues and solutions are documented in `SETUP_GUIDE.md`. Key debugging steps:

1. Check browser console for errors
2. Verify all environment variables are set
3. Test GraphQL queries in Hasura console
4. Check n8n workflow execution logs
5. Validate OpenRouter API key and quota

## 📄 License

This project is created for internship assessment purposes.