# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start Next.js dev server (localhost:3000)
pnpm convex       # Start Convex dev server (run alongside pnpm dev)
pnpm build        # Production build
pnpm lint         # Run ESLint
```

Both `pnpm dev` and `pnpm convex` should run simultaneously during development.

## Architecture

**mixup.gg** is a gaming tournament platform built with:
- **Next.js 16** (App Router) + **React 19** with React Compiler
- **Convex** for real-time database, server functions, and webhooks
- **Clerk** for authentication (synced to Convex via webhooks)
- **Tailwind v4** + **CVA** for styling

### Data Flow

```
Clerk Auth → Webhook (convex/http.ts) → Convex Users Table
                                              ↓
Frontend ← ConvexProviderWithClerk ← useQuery/useMutation
```

Users authenticate via Clerk. Clerk webhooks (validated with Svix) sync user data to Convex. The `ConvexProviderWithClerk` wrapper automatically passes auth tokens to Convex queries/mutations.

### Key Directories

- `convex/` - Backend: schema definitions (`schema/`), domain-specific queries/mutations (`users.ts`, `tournaments.ts`), webhook handlers (`http.ts`)
- `src/app/` - Next.js pages (App Router)
- `src/components/ui/` - Shadcn-style Radix primitives with CVA variants
- `src/components/forms/` - Form components using React Hook Form + Zod
- `src/components/providers/` - Context providers (Convex, Clerk)
- `src/components/shared/` - Reusable components (EventCard, NotificationBell)
- `src/helpers/` - Utility functions (generateSlug, titleCase)
- `src/server/` - Server-side utilities (IGDB API integration)

### Path Aliases

- `@/*` → `src/*`
- `@/convex/*` → `convex/*`

### Form Pattern

Forms use React Hook Form with Zod validation and custom Field components:
- Define schema in a separate file (e.g., `tournamentFormSchema.ts`)
- Use `FieldGroup`, `FieldLabel`, `FieldError` from `@/components/ui/field`
- Submit to Convex mutations via `useMutation`

### Convex Conventions

- Schema tables defined in `convex/schema/` and imported into `convex/schema.ts`
- Queries and mutations in domain-specific files (`users.ts`, `tournaments.ts`)
- Generated types available from `convex/_generated/api`
- Internal functions use `internalMutation`/`internalQuery` for webhook handlers

### Database Schema

Tables in `convex/schema/`:

- `users` - User accounts synced from Clerk
- `tournaments` - Tournament metadata (name, slug, dates)
- `events` - Individual events within tournaments
- `entrants` - Participants in events
- `stages` - Tournament stages (pools, brackets, etc.)
- `groups` - Groups within stages
- `matches` - Individual matches
- `matchEvents` - Events within matches (scores, etc.)
- `progressions` - Rules for advancing between stages

### Environment Variables

Required in `.env.local`:

- Clerk credentials (`NEXT_PUBLIC_CLERK_*`, `CLERK_SECRET_KEY`)
- Convex URL (`NEXT_PUBLIC_CONVEX_URL`)
- IGDB/Twitch API tokens for game data
