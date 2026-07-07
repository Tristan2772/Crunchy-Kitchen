# Crunchy Kitchen

Kitchen inventory and meal planning app built with Nuxt 4 + Ionic.

## Phase 1: Foundation ✅

- Nuxt 4 + Vue 3 + TypeScript
- Tailwind CSS v4 + DaisyUI
- Better Auth (email/password)
- Local SQLite + Turso remote sync
- Offline-aware with sync banner

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your Turso credentials

# Run dev server
npm run dev
```

## Project Structure

```
app/
  components/     # Vue components
    auth/         # Login/Register forms
    sync/         # Sync banner
  composables/    # useAuth, useSync
  layouts/        # default, auth
  pages/          # Routes
  plugins/        # Sync detection
  stores/         # Pinia stores
server/
  api/            # API routes
    auth/         # Better Auth handler
    sync/         # Pull/push endpoints
  db/             # Drizzle schema
  utils/          # Turso client
mobile/
  capacitor.config.ts  # Mobile config
```

## Database

Uses Drizzle ORM with SQLite locally and Turso remotely.

```bash
# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Open studio
npm run db:studio
```

## Mobile Builds

```bash
# Add platforms
npm run mobile:add-android
npm run mobile:add-ios

# Sync web assets
npm run mobile:sync

# Open in IDE
npm run mobile:open-android
npm run mobile:open-ios
```

## Next Phases

- **Phase 2**: Family sharing + subscriptions
- **Phase 3**: Receipt scanning + inventory
- **Phase 4**: Cookbook + meal planning
- **Phase 5**: Shopping list + meal tracker
