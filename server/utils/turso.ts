import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import * as schema from "../db/schema"

// Create Turso client for server-side
export function getTursoClient() {
  const config = useRuntimeConfig()
  
  const url = config.turso?.databaseUrl || process.env.TURSO_DATABASE_URL
  const authToken = config.turso?.authToken || process.env.TURSO_AUTH_TOKEN
  
  if (!url) {
    throw new Error("TURSO_DATABASE_URL not configured")
  }
  
  const client = createClient({
    url,
    authToken,
  })
  
  return drizzle(client, { schema })
}

// Export db instance (for server routes)
export const tursoDb = getTursoClient()
