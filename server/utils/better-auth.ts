import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { getTursoClient } from "./turso"

// Get database client
const db = getTursoClient()

// Configure Better Auth
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  socialProviders: {
    // Add Google, Apple later for mobile
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
})

// Export auth handler for API routes
export type Auth = typeof auth
