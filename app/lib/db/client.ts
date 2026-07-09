import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import env from "../../lib/env";

const databaseUrl = env.TURSO_DATABASE_URL;
const authToken = env.TURSO_AUTH_TOKEN;

const client = createClient({
  url: databaseUrl,
  authToken: authToken || undefined,
});

export const db = drizzle(client);

export { client as dbClient };
