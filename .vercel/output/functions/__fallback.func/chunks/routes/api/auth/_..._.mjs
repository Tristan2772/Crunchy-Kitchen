import { d as defineEventHandler, s as schema } from '../../../nitro/nitro.mjs';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import 'drizzle-orm/sqlite-core';
import 'drizzle-orm';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@iconify/utils';
import 'consola';

const createAuth = () => {
  const url = process.env.TURSO_DATABASE_URL || "file:./local.db";
  const authToken = process.env.TURSO_AUTH_TOKEN;
  const client = createClient({ url, authToken });
  const db = drizzle(client, { schema });
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite"
    }),
    secret: process.env.BETTER_AUTH_SECRET || "dev-secret",
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    emailAndPassword: {
      enabled: true,
      autoSignIn: true
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7
      // 7 days
    }
  });
};
const _____ = defineEventHandler(async (event) => {
  const auth = createAuth();
  return auth.handler(event.node.req);
});

export { _____ as default };
//# sourceMappingURL=_..._.mjs.map
