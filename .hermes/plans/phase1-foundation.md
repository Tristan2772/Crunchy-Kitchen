# Crunchy Kitchen - Phase 1: Foundation

## Goal
Nuxt 4 + Ionic + Tailwind v4 + DaisyUI + Better Auth + Database working together.
Local-first with remote sync when online.

## Tech Stack Decisions

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Nuxt 4 + @nuxtjs/ionic | Mobile apps + web |
| Styling | Tailwind v4 + DaisyUI | User preference |
| Auth | Better Auth | Multi-user support for family sharing |
| Local DB | SQLite (better-sqlite3) | Reliable local storage |
| Remote DB | Turso | Sync target, works with SQLite |
| Sync | Custom sync layer | Queue changes, resolve conflicts |
| Platform | Capacitor | iOS/Android builds |

## Architecture

```
┌─────────────────────────────────────────┐
│           Nuxt 4 + Ionic App            │
│  ┌───────────────────────────────────┐  │
│  │     Pages (Vue SFCs)              │  │
│  │     - Login/Register              │  │
│  │     - Dashboard (placeholder)     │  │
│  │     - Profile                     │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │     Local SQLite                  │  │
│  │     - Users                       │  │
│  │     - Families                    │  │
│  │     - Sync Queue                  │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │     Sync Engine                   │  │
│  │     - Detect online/offline       │  │
│  │     - Queue local changes         │  │
│  │     - Push to Turso when online   │  │
│  │     - Pull server changes         │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    │
                    ▼
              ┌───────────┐
              │   Turso   │
              │  (Remote) │
              └───────────┘
```

## File Structure

```
crunchy-kitchen/
├── app/                          # Nuxt 4 app directory
│   ├── assets/css/
│   │   └── main.css              # Tailwind + DaisyUI
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.vue
│   │   │   └── RegisterForm.vue
│   │   └── sync/
│   │       └── SyncBanner.vue    # "Possibly out of sync" banner
│   ├── composables/
│   │   ├── useAuth.ts            # Better Auth integration
│   │   ├── useSync.ts            # Sync engine
│   │   └── useLocalDb.ts         # SQLite local operations
│   ├── layouts/
│   │   └── default.vue
│   ├── pages/
│   │   ├── index.vue             # Landing → redirect based on auth
│   │   ├── login.vue
│   │   ├── register.vue
│   │   └── dashboard.vue         # Protected
│   ├── stores/
│   │   ├── auth.ts               # Pinia auth store
│   │   └── sync.ts               # Sync state
│   ├── plugins/
│   │   └── sync.client.ts        # Online/offline detection
│   ├── app.vue
│   ├── ionic.config.ts           # Ionic configuration
│   └── nuxt.config.ts
├── server/                       # Nitro server routes
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...].ts          # Better Auth handler
│   │   └── sync/
│   │       ├── pull.get.ts       # Get server changes
│   │       └── push.post.ts      # Push local changes
│   ├── utils/
│   │   ├── better-auth.ts       # Auth setup
│   │   └── turso.ts             # Turso client
│   └── db/
│       └── schema.ts            # Drizzle schema
├── mobile/                       # Capacitor config
│   ├── android/                  # Generated
│   ├── ios/                      # Generated
│   └── capacitor.config.ts
├── drizzle.config.ts
├── package.json
└── .env.example
```

## Database Schema

### Local SQLite + Turso (same schema)

```sql
-- Users (Better Auth manages core, we extend)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Families
CREATE TABLE families (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  max_members INTEGER DEFAULT 1,
  subscription_tier TEXT DEFAULT 'free', -- 'free', 'couple', 'family'
  subscription_status TEXT DEFAULT 'active',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Family Members (junction)
CREATE TABLE family_members (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT DEFAULT 'member', -- 'owner', 'member'
  joined_at INTEGER NOT NULL,
  FOREIGN KEY (family_id) REFERENCES families(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Sync Queue (local only)
CREATE TABLE sync_queue (
  id TEXT PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  operation TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  data JSON,
  created_at INTEGER NOT NULL,
  synced_at INTEGER
);
```

## Task Checklist

### Setup
- [ ] Initialize Nuxt 4 project
- [ ] Install @nuxtjs/ionic
- [ ] Configure Tailwind v4 + DaisyUI
- [ ] Setup Capacitor for mobile

### Auth
- [ ] Install Better Auth
- [ ] Configure auth endpoints
- [ ] Create login page
- [ ] Create register page
- [ ] Create auth middleware

### Database
- [ ] Install Drizzle + libsql/client
- [ ] Create schema
- [ ] Setup local SQLite
- [ ] Setup Turso connection
- [ ] Migration files

### Sync Engine
- [ ] Create sync composable
- [ ] Detect online/offline
- [ ] Queue local changes
- [ ] Pull server changes
- [ ] Push local changes
- [ ] Conflict resolution (server wins)

### UI
- [ ] Sync banner component
- [ ] Dashboard placeholder
- [ ] Profile page (join family)

## Pricing Logic (for Phase 2)

| Family Size | Price | Tier |
|-------------|-------|------|
| 1 person | Free | free |
| 2 people | $2.99/mo | couple |
| 3+ people | $2.50/person | family |

## Questions Resolved

1. **Database**: SQLite local + Turso remote, custom sync layer
2. **Ionic**: @nuxtjs/ionic module for simpler setup
3. **Local dev**: SQLite file (no Docker needed)

## Next Phase Gates

Phase 1 complete when:
- [ ] User can register/login
- [ ] User can see dashboard
- [ ] Offline banner appears when disconnected
- [ ] Data syncs between devices (via Turso)
- [ ] Join family flow works
