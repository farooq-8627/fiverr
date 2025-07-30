# Agentor - Professional Services Marketplace

A modern marketplace platform connecting professional service providers (agents) with clients seeking automation and technical services. Built with Next.js 15 and designed for scalability and real-time collaboration.

## 🚀 Features

### Current Implementation

- ✅ **User Authentication** - Secure authentication via Clerk with OAuth support
- ✅ **Dual User Types** - Separate onboarding flows for Agents and Clients
- ✅ **Profile Management** - Comprehensive profile creation and management
- ✅ **Content Management** - Sanity.io integration for structured content
- ✅ **Social Feed** - Post creation, media sharing, and engagement features
- ✅ **Company Profiles** - Business entity management and associations
- ✅ **Project Showcases** - Portfolio management for agents and project requirements for clients

### Planned Features

- 🚧 **Real-time Messaging** - Direct messaging and communication channels
- 🚧 **Service Marketplace** - Service listing and discovery platform
- 🚧 **Project Collaboration** - Real-time project management tools
- 🚧 **Advanced Search** - AI-powered service and talent discovery

## 🛠 Tech Stack

### Core Technologies

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **CMS**: Sanity.io
- **Database**: Supabase (for real-time features)
- **Real-time**: PartyKit (planned)

### UI & Animations

- **Components**: Radix UI primitives
- **Icons**: Lucide React, Phosphor Icons
- **Animations**: Framer Motion
- **3D Elements**: Spline (React Spline)
- **Particles**: TSParticles

### Development Tools

- **Build Tool**: Turbopack (Next.js)
- **Type Safety**: Zod validation
- **Forms**: React Hook Form
- **File Upload**: React Dropzone
- **Toast Notifications**: Sonner

## 📁 Project Structure

```
agentor/
├── app/                          # Next.js App Router
│   ├── agents/                   # Agent discovery pages
│   ├── api/                      # API routes
│   │   └── protected/           # Protected API endpoints
│   ├── clientprojects/          # Client project listings
│   ├── clients/                 # Client discovery pages
│   ├── companies/               # Company profile pages
│   ├── dashboard/               # User dashboard
│   │   └── [username]/         # Dynamic user profiles
│   ├── feed/                    # Social feed interface
│   ├── onboarding/              # User onboarding flows
│   │   ├── agent-profile/      # Agent-specific onboarding
│   │   ├── client-profile/     # Client-specific onboarding
│   │   └── constants/          # Onboarding configuration
│   ├── sign-in/                # Authentication pages
│   ├── studio/                 # Sanity Studio
│   └── user-details/           # User profile management
│
├── components/                   # React components
│   ├── blocks/                  # Page sections and layouts
│   ├── cards/                   # Card components
│   │   └── Feed/               # Social feed cards
│   ├── Dashboard/               # Dashboard components
│   │   ├── Edit/               # Profile editing
│   │   └── ProfileCards/       # Profile display cards
│   ├── LandingComponents/       # Marketing pages
│   ├── modals/                  # Modal dialogs
│   ├── Onboarding/              # Onboarding components
│   │   ├── AgentProfile/       # Agent onboarding
│   │   ├── ClientProfile/      # Client onboarding
│   │   ├── Forms/              # Shared form components
│   │   └── UserProfile/        # Base profile components
│   ├── Root/                    # Global components
│   ├── shared/                  # Reusable components
│   ├── Skelitons/              # Loading skeletons
│   └── UI/                     # Base UI components
│
├── hooks/                       # Custom React hooks
├── lib/                         # Utility libraries
│   ├── actions/                # Server actions
│   ├── context/                # React contexts
│   └── queries/                # Data fetching utilities
│
├── party/                       # PartyKit server (planned)
├── public/                      # Static assets
├── sanity/                      # Sanity CMS configuration
│   ├── lib/                    # Sanity utilities
│   └── schemaTypes/            # Content schemas
├── scripts/                     # Utility scripts
└── types/                       # TypeScript definitions
```

## 🗄 Data Architecture

### User Types

The platform supports two primary user types:

#### Agents (Service Providers)

- **Automation Expertise**: Technical skills and specializations
- **Business Details**: Pricing, availability, and service offerings
- **Project Portfolio**: Showcase of completed work
- **Communication Preferences**: Meeting and collaboration settings

#### Clients (Service Seekers)

- **Automation Needs**: Required services and technical requirements
- **Project Details**: Scope, timeline, and budget information
- **Company Information**: Business context and goals
- **Communication Preferences**: Preferred interaction methods

### Content Management

Powered by Sanity.io with structured schemas for:

- **User Profiles**: Comprehensive user information and preferences
- **Company Profiles**: Business entity management
- **Project Portfolios**: Work showcases and case studies
- **Social Posts**: Feed content with media support
- **Comments & Reactions**: Social engagement features

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Clerk account for authentication
- Sanity.io project for content management

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd agentor
   ```

2. **Install dependencies**

```bash
   npm install
```

3. **Environment Setup**
   Create a `.env.local` file:

```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Sanity CMS
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
   NEXT_PUBLIC_SANITY_DATASET=your_sanity_dataset
   SANITY_API_TOKEN=your_sanity_token

   # Future integrations
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_PARTYKIT_HOST=your_partykit_host
```

4. **Set up Sanity Studio**

   ```bash
   # Install Sanity CLI globally (if not already installed)
   npm install -g @sanity/cli

   # Initialize Sanity project (follow prompts)
   sanity init
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Access the application**
   - Main app: `http://localhost:3000`
   - Sanity Studio: `http://localhost:3000/studio`

### Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database management scripts
npm run sync-users              # Sync Clerk users with Sanity
npm run sync-profiles           # Sync user profiles
npm run migrate:user-roles      # Migrate user role data
npm run migrate-profiles        # Migrate profile IDs
npm run delete-all-documents    # Clear all Sanity documents
npm run delete-client-profiles  # Remove client profiles
npm run delete-client-projects  # Remove client projects
```

## 🔐 Authentication & Security

### Clerk Integration

- OAuth providers support (Google, GitHub, etc.)
- Session management and middleware protection
- Public metadata for onboarding completion tracking
- Protected API routes and middleware configuration

### Security Features

- Content Security Policy headers
- XSS protection
- Frame options security
- Input validation with Zod schemas
- Server-side authentication checks

## 📱 User Experience

### Onboarding Flow

1. **User Type Selection**: Choose between Agent or Client profile
2. **Profile Creation**: Multi-step form with validation
3. **Skill/Needs Assessment**: Specialized questionnaires
4. **Project Information**: Portfolio or requirements entry
5. **Business Details**: Pricing, availability, and preferences

### Dashboard Features

- **Profile Management**: Edit and update user information
- **Social Feed**: Create posts, share media, engage with content
- **Project Showcase**: Display work portfolio or project requirements
- **Company Integration**: Link and manage business profiles

## 🔮 Roadmap

### Phase 1: Messaging System (In Progress)

- Direct messaging between users
- Real-time chat with PartyKit
- Message persistence with Supabase
- File and image sharing capabilities

### Phase 2: Marketplace Features

- Service listing and discovery
- Advanced search and filtering
- Rating and review system
- Proposal and contract management

### Phase 3: Collaboration Tools

- Project management interface
- Real-time collaboration features
- Video conferencing integration
- Advanced notification system

### Phase 4: AI Integration

- Smart matching algorithms
- Automated service recommendations
- Content generation assistance
- Intelligent project scoping

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Implement proper error handling
- Add appropriate type definitions
- Test thoroughly before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:

- Create an issue in the repository
- Check existing documentation
- Review the codebase examples

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
