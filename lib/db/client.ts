import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const databaseUrl = process.env.DATABASE_URL || "file:./crunchy-kitchen.db";
const authToken = process.env.DATABASE_AUTH_TOKEN;

const client = createClient({
  url: databaseUrl,
  authToken: authToken || undefined,
});

export const db = drizzle(client);

export { client as dbClient };