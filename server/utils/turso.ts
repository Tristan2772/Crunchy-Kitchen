import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import * as schema from "../db/schema"

// Create Turso client for server-side
export function getTursoClient() {
  // Use process.env directly for Vercel/build compatibility
  // useRuntimeConfig is not available during build or in all contexts
  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN
  
  if (!url) {
    throw new Error("TURSO_DATABASE_URL not configured")
  }
  
  const client = createClient({
    url,
    authToken,
  })
  
  return drizzle(client, { schema })
}

// Export db instance (for server routes) - lazy init to avoid build-time errors
let _db: ReturnType<typeof drizzle> | null = null
export const tursoDb = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    if (!_db) {
      _db = getTursoClient()
    }
    return _db[prop as keyof typeof _db]
  },
})
