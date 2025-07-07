# Agentor - Professional Services Marketplace

## Project Overview

Agentor is a modern marketplace platform connecting professional service providers (agents) with clients. Built with Next.js 15, it features a robust tech stack for real-time communication, content management, and secure authentication.

## Tech Stack

- **Frontend & Backend**: Next.js 15 (App Router)
- **Authentication**: Clerk
- **Content Management**: Sanity.io
- **Real-time Communication**: PartyKit (Pending Implementation)
- **Database**: Supabase (For message storage)
- **Styling**: Tailwind CSS

## Current Progress

### ✅ Completed Features

1. **Authentication System (Clerk)**
   - User registration and login
   - OAuth providers integration
   - Protected routes and middleware
   - Session management

2. **Content Management (Sanity)**
   - Schema setup for profiles and content
   - Integration with Next.js
   - Content validation and type safety

3. **Onboarding System**
   - Dual onboarding flow (Client/Agent)
   - Profile creation and validation
   - Form state management
   - Data persistence in Sanity

### 🏗️ Complete Project Structure

````
agentor/
├── app/
│   ├── _template/
│   │   ├── components/
│   │   │   └── [Template components]
│   │   ├── content/
│   │   ├── images/
│   │   └── styles/
│   │
│   ├── api/
│   │   └── protected/
│   │       └── [Protected API routes]
│   │
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── components/
│   │
│   ├── onboarding/
│   │   ├── page.tsx                    # User type selection page
│   │   ├── layout.tsx
│   │   │
│   │   ├── agent-profile/
│   │   │   ├── actions.ts              # Server actions for agent profile
│   │   │   ├── agent-profile-form.tsx  # Agent profile form component
│   │   │   └── page.tsx
│   │   │
│   │   ├── client-profile/
│   │   │   ├── actions.ts              # Server actions for client profile
│   │   │   ├── client-profile-form.tsx # Client profile form component
│   │   │   └── page.tsx
│   │   │
│   │   └── constants/
│   │       ├── agent-options.ts        # Agent form options
│   │       ├── client-options.ts       # Client form options
│   │       ├── timezone-options.ts     # Shared timezone options
│   │       └── types.ts                # Shared type definitions
│   │
│   ├── sign-in/
│   │   └── [[...sign-in]]/
│   │       └── page.tsx                # Clerk sign-in page
│   │
│   ├── fonts/
│   │   └── [Font files]
│   │
│   ├── layout.tsx                      # Root layout
│   └── page.tsx                        # Home page
│
├── components/
│   ├── ui/                             # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── [Other UI components]
│   │
│   ├── forms/                          # Shared form components
│   │   ├── form-field.tsx
│   │   └── [Other form components]
│   │
│   └── shared/                         # Shared components
│       ├── header.tsx
│       ├── footer.tsx
│       └── [Other shared components]
│
├── lib/
│   ├── sanity/                         # Sanity configuration
│   │   ├── config.ts
│   │   ├── schemas/                    # Sanity schemas
│   │   │   ├── agent.ts
│   │   │   ├── client.ts
│   │   │   └── [Other schemas]
│   │   └── client.ts
│   │
│   ├── clerk/                          # Clerk configuration
│   │   └── config.ts
│   │
│   └── utils/                          # Utility functions
│       ├── validation.ts
│       └── helpers.ts
│
├── types/
│   ├── sanity.ts                       # Sanity type definitions
│   ├── clerk.ts                        # Clerk type definitions
│   └── common.ts                       # Common type definitions
│
├── public/
│   ├── images/
│   │   └── [Image assets]
│   └── icons/
│       └── [Icon assets]
│
|-- party/
|   |__index.ts
|
|-- sanity/
|   |--- lib/
|   |--- schematypes/
|   |___ env.ts
|   |___ structure.ts
|
|
├── styles/
│   └── globals.css                     # Global styles
│
├── middleware.ts                        # Next.js middleware
├── next.config.js                      # Next.js configuration
├── postcss.config.js                   # PostCSS configuration
├── tailwind.config.js                  # Tailwind configuration
├── tsconfig.json                       # TypeScript configuration
├── package.json                        # Project dependencies
└── README.md                           # Project documentation

## 🚀 Upcoming Features

### 1. Messaging System (PartyKit Integration)

- **Core Requirements**:
  - 1-1 messaging between users (client-agent, client-client, agent-agent)
  - Text and image message support
  - Message persistence in Supabase
  - Real-time updates via PartyKit
  - Private chat rooms
  - Message history loading

### 2. Communication Channels

- Service-specific chat rooms
- Topic-based discussion channels
- Public and private channel support
- Member management and permissions

### 3. Technical Implementation Plan

#### Phase 1: Basic Messaging

- [ ] Set up PartyKit server
- [ ] Integrate Clerk authentication with PartyKit
- [ ] Create basic chat UI components
- [ ] Implement 1-1 messaging
- [ ] Add text message support

#### Phase 2: Enhanced Features

- [ ] Add image upload and sharing
- [ ] Implement Supabase message storage
- [ ] Add message history loading
- [ ] Create chat room management system
- [ ] Add typing indicators and online status

#### Phase 3: Communication Channels

- [ ] Design and implement channel system
- [ ] Add channel discovery and joining
- [ ] Create channel moderation tools
- [ ] Implement channel-specific features
- [ ] Add advanced permission system

## Required Integrations

### PartyKit Integration

1. **Authentication**
   - Integrate Clerk user sessions with PartyKit
   - Handle user presence and permissions
   - Secure room access

2. **Message Handling**
   - Real-time message broadcasting
   - Message persistence
   - Image upload and processing
   - Typing indicators
   - Read receipts

3. **Room Management**
   - Create/join private rooms
   - Handle room permissions
   - Manage room participants

### Supabase Integration

1. **Database Schema**

   ```sql
   -- Messages table
   messages (
     id: uuid
     room_id: uuid
     sender_id: string
     content: text
     type: enum (text, image)
     created_at: timestamp
     updated_at: timestamp
   )

   -- Rooms table
   rooms (
     id: uuid
     type: enum (direct, channel)
     name: string
     created_by: string
     created_at: timestamp
   )

   -- Room participants
   room_participants (
     room_id: uuid
     user_id: string
     role: enum (admin, member)
     joined_at: timestamp
   )
````

2. **Message Sync**
   - Real-time message syncing between PartyKit and Supabase
   - Message history retrieval
   - Pagination and infinite scrolling

## Environment Variables

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=

# PartyKit (Coming soon)
NEXT_PUBLIC_PARTYKIT_HOST=
PARTYKIT_SECRET_KEY=

# Supabase (Coming soon)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Contributing

We welcome contributions! Please see our contributing guidelines for more details.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📱 Messaging System Architecture

### Overview

The messaging system is designed as a standalone module that can be easily integrated into any project. It combines PartyKit for real-time features with Supabase for data persistence.

### Features

- 1-1 Direct Messaging
- Group Channels (Admin Created)
- Public/Private Channels
- Message Types Support (Text, Images)
- Real-time Updates
- Message History
- User Presence
- Channel Discovery
- Message Search

### Database Schema (Supabase)

```sql
-- Users table (synced with Clerk)
create table public.users (
  id uuid references auth.users primary key,
  email text unique,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Channels table
create table public.channels (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  type text check (type in ('public', 'private')) not null,
  created_by uuid references public.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  metadata jsonb default '{}'::jsonb,
  is_direct boolean default false
);

-- Channel members
create table public.channel_members (
  channel_id uuid references public.channels(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  role text check (role in ('admin', 'moderator', 'member')) not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_read_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (channel_id, user_id)
);

-- Messages table
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  channel_id uuid references public.channels(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  content text,
  type text check (type in ('text', 'image', 'file')) not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_deleted boolean default false,
  parent_id uuid references public.messages(id)
);

-- Message reactions
create table public.message_reactions (
  message_id uuid references public.messages(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  reaction text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (message_id, user_id, reaction)
);

-- User presence
create table public.user_presence (
  user_id uuid references public.users(id) on delete cascade primary key,
  last_seen_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text check (status in ('online', 'offline', 'away')) not null,
  metadata jsonb default '{}'::jsonb
);

-- Channel invites
create table public.channel_invites (
  id uuid default gen_random_uuid() primary key,
  channel_id uuid references public.channels(id) on delete cascade,
  invited_by uuid references public.users(id) on delete cascade,
  invited_user uuid references public.users(id) on delete cascade,
  status text check (status in ('pending', 'accepted', 'rejected')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone
);
```

### Directory Structure for Messaging Module

```
messaging-module/
├── components/
│   ├── Channel/
│   │   ├── ChannelHeader.tsx
│   │   ├── ChannelList.tsx
│   │   ├── ChannelMembers.tsx
│   │   └── CreateChannel.tsx
│   │
│   ├── Chat/
│   │   ├── ChatInput.tsx
│   │   ├── MessageList.tsx
│   │   ├── Message.tsx
│   │   └── MessageActions.tsx
│   │
│   └── shared/
│       ├── UserPresence.tsx
│       └── FileUpload.tsx
│
├── hooks/
│   ├── useChannel.ts
│   ├── useMessages.ts
│   ├── usePresence.ts
│   └── useRealtime.ts
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── queries.ts
│   │   └── types.ts
│   │
│   └── partykit/
│       ├── client.ts
│       ├── room.ts
│       └── types.ts
│
├── utils/
│   ├── messageParser.ts
│   ├── fileHandler.ts
│   └── permissions.ts
│
└── config.ts
```

### Integration Guide

1. **Database Setup**

```bash
# Run Supabase migrations
supabase migration up

# Set up row level security
supabase policy apply
```

2. **Environment Variables**

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_PARTYKIT_HOST=your_partykit_host
```

3. **Module Installation**

```bash
npm install @your-org/messaging-module
```

4. **Basic Usage**

```typescript
import { MessagingProvider, ChannelList, ChatWindow } from '@your-org/messaging-module';

function App() {
  return (
    <MessagingProvider>
      <ChannelList />
      <ChatWindow />
    </MessagingProvider>
  );
}
```

### Security Features

- Row Level Security (RLS) in Supabase
- Message encryption
- Rate limiting
- User permissions
- Content moderation

### Performance Optimizations

- Message pagination
- Lazy loading
- Image optimization
- Connection pooling
- Caching strategies
