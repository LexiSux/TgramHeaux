# AdultConnectHub - Escort Directory & Personals Platform

## Overview
AdultConnectHub is a comprehensive escort directory and adult classifieds platform featuring tiered subscriptions, cryptocurrency payments (Love Coins/Titty Bank), and professional moderation tools. The platform supports three user types: Models, Classified Users, and Admins.

## Core Features

### User Tiers & Limits
- **Free Tier**: 1 listing, 2 images, 24hr bump/available cooldown
- **Basic Tier** ($20/mo): 3 listings, 5 images, 12hr cooldown, can highlight
- **VIP Tier** ($50/mo): 10 listings, 15 images, 4hr bump/6hr available cooldown, can highlight, feature, special
- **Elite Tier** ($100/mo): Unlimited listings, 30 images, 1hr bump/2hr available cooldown, all features including slideshow

### Listing Upgrade Features
- **Bump**: Move listing to top of feed (tier-based cooldowns)
- **Available Now**: 4-hour indicator with amber badge (auto-disables after 4 hours)
- **Highlight**: Yellow background emphasis (paid upgrade, 50 tokens)
- **Special**: Special badge/ribbon (paid upgrade, 75 tokens)
- **Slideshow**: Featured image rotation (Elite tier only, 100 tokens)
- **Paid Listing**: Premium placement (150 tokens)

### Love Coins System
Platform currency (mock Bitcoin integration for now):
- Purchase via Bitcoin (mock payment flow)
- Used for tier upgrades, bumps, and listing enhancements
- Transaction history tracking
- Balance displayed in user profile

### Moderation System
- User-driven content flagging
- Admin review workflow (approve/reject with notes)
- Audit logging for all admin actions
- Reactive moderation (respond to user reports)

## Technology Stack

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL (via Replit Database)
- **ORM**: Drizzle ORM
- **Authentication**: Replit Auth (OIDC) with session-based auth
- **File Upload**: Multer + Mock Bunny.net CDN (hash-based deduplication)

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack Query v5
- **UI Components**: Shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom dark-first theme

### Design System
- Dark-first theme (deep charcoal backgrounds)
- Rose/purple accent colors for premium feel
- Image-dominant grid layouts (4-5 columns desktop, 2-3 mobile)
- High contrast for readability
- Responsive design with mobile-first approach

## Database Schema

### Core Tables
- **users**: User accounts with Replit Auth integration (id, email, firstName, lastName, role, tier, loveCoins, etc.)
- **sessions**: Session storage for Replit Auth
- **listings**: User listings (title, description, category, images, status, upgrade flags, etc.)
- **media**: Deduplicated media files (fileHash, cdnUrl, uploaderId)
- **upgradePurchases**: Listing upgrade purchases
- **transactions**: Love Coins transaction history
- **flaggedContent**: Content moderation flags
- **bitcoinPayments**: Bitcoin payment tracking (mock)
- **adminActions**: Admin action audit log
- **favorites**: User saved listings
- **communityPosts**: Community forum posts
- **communityReplies**: Post replies

## API Routes

### Authentication
- `GET /api/login` - Initiate Replit Auth flow
- `GET /api/callback` - Auth callback
- `GET /api/logout` - Logout
- `GET /api/auth/user` - Get current user

### Listings
- `POST /api/listings` - Create listing
- `GET /api/listings` - Get active listings
- `GET /api/listings/available-now` - Get available now listings
- `GET /api/listings/:id` - Get listing by ID
- `GET /api/listings/slug/:slug` - Get listing by slug
- `PATCH /api/listings/:id` - Update listing
- `GET /api/my-listings` - Get user's listings
- `POST /api/listings/:id/bump` - Bump listing
- `POST /api/listings/:id/available-now` - Toggle available now

### Media
- `POST /api/media/upload` - Upload media files (multipart/form-data)

### Upgrades
- `POST /api/upgrades/purchase` - Purchase listing upgrade

### Payments
- `POST /api/payments/bitcoin/create` - Create Bitcoin payment
- `GET /api/payments/bitcoin/:id` - Get payment status
- `POST /api/payments/bitcoin/:id/complete` - Complete payment (mock)
- `GET /api/transactions` - Get transaction history

### Favorites
- `POST /api/favorites/:listingId` - Add favorite
- `DELETE /api/favorites/:listingId` - Remove favorite
- `GET /api/favorites` - Get user favorites

### Moderation
- `POST /api/flag-content` - Flag content for review
- `GET /api/admin/flags` - Get pending flags (admin only)
- `POST /api/admin/flags/:id/review` - Review flag (admin only)

### Community
- `POST /api/community/posts` - Create post
- `GET /api/community/posts` - Get posts
- `POST /api/community/posts/:postId/replies` - Create reply
- `GET /api/community/posts/:postId/replies` - Get replies

## User Roles

### Classified Users
- Can create classifieds/personals
- Limited listings based on tier
- Access to community features
- Can purchase tier upgrades

### Models
- Full listing management
- Professional profile features
- Advanced upgrade options
- Analytics dashboard

### Admins
- Content moderation tools
- User management
- System configuration
- Audit logs access

## Recent Changes (Current Session)
- Integrated Replit Auth for authentication
- Built comprehensive storage layer with tier-based business logic
- Created API routes for all core features
- Implemented mock media upload with deduplication
- Updated schema for sessions, media, upgrades, moderation
- Applied dark-first design system colors

## Development Commands
- `npm run dev` - Start development server (Express + Vite)
- `npm run db:push` - Sync database schema
- `npm run build` - Build production bundle

## Environment Variables
Required:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key
- `REPLIT_DOMAINS` - Comma-separated domains for auth
- `REPL_ID` - Replit project ID

Optional (for production Bunny.net):
- `BUNNY_STORAGE_API_KEY`
- `BUNNY_STORAGE_ZONE`
- `BUNNY_CDN_HOSTNAME`
- `BUNNY_STORAGE_REGION`

## Next Steps
1. Build user dashboards (Model, Classified, Admin)
2. Create listing detail page with image gallery
3. Implement tier upgrade UI
4. Add community forum pages
5. Build admin moderation interface
6. Add end-to-end testing
7. Replace mock Bitcoin payment with real integration
8. Integrate production Bunny.net CDN
