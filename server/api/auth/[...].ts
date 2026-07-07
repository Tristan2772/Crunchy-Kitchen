import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import * as schema from "../../db/schema"

// Create auth instance inline (avoids import issues)
const createAuth = () => {
  const url = process.env.TURSO_DATABASE_URL || "file:./local.db"
  const authToken = process.env.TURSO_AUTH_TOKEN
  
  const client = createClient({ url, authToken })
  const db = drizzle(client, { schema })
  
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
    }),
    secret: process.env.BETTER_AUTH_SECRET || "dev-secret",
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
    },
  })
}

// Catch-all handler for Better Auth endpoints
export default defineEventHandler(async (event) => {
  const auth = createAuth()
  return auth.handler(event.node.req)
})
