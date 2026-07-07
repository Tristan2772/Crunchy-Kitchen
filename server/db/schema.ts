import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

// Users - Better Auth manages core auth, we extend with profile data
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
})

// Sessions - Better Auth managed
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
})

// Accounts - Better Auth managed (OAuth linking)
export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
})

// Verification tokens - Better Auth managed
export const verifications = sqliteTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
})

// Families - Subscription-based groups
export const families = sqliteTable("families", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  maxMembers: integer("max_members").default(1).notNull(),
  subscriptionTier: text("subscription_tier").default("free").notNull(), // 'free', 'couple', 'family'
  subscriptionStatus: text("subscription_status").default("active").notNull(), // 'active', 'paused', 'cancelled'
  subscriptionExpiry: integer("subscription_expiry", { mode: "timestamp" }),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
})

// Family Members - Junction table
export const familyMembers = sqliteTable("family_members", {
  id: text("id").primaryKey(),
  familyId: text("family_id").notNull().references(() => families.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role").default("member").notNull(), // 'owner', 'member'
  joinedAt: integer("joined_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
})

// Sync Queue - Local only, tracks pending changes
export const syncQueue = sqliteTable("sync_queue", {
  id: text("id").primaryKey(),
  tableName: text("table_name").notNull(), // 'families', 'family_members', etc.
  recordId: text("record_id").notNull(),
  operation: text("operation").notNull(), // 'INSERT', 'UPDATE', 'DELETE'
  data: text("data"), // JSON stringified record
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  syncedAt: integer("synced_at", { mode: "timestamp" }),
})

// Device sync state - Tracks last sync per device
export const syncState = sqliteTable("sync_state", {
  id: text("id").primaryKey().default("default"),
  lastSyncedAt: integer("last_synced_at", { mode: "timestamp" }),
  version: integer("version").default(0),
})