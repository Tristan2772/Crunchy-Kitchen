import { d as defineEventHandler, g as getQuery, a as getTursoClient, f as families, b as familyMembers } from '../../../nitro/nitro.mjs';
import { gt } from 'drizzle-orm';
import '@libsql/client';
import 'drizzle-orm/libsql';
import 'drizzle-orm/sqlite-core';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@iconify/utils';
import 'consola';

const pull_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const since = query.since ? new Date(query.since) : /* @__PURE__ */ new Date(0);
  const db = getTursoClient();
  const updatedFamilies = await db.select().from(families).where(gt(families.updatedAt, since));
  const updatedMembers = await db.select().from(familyMembers).where(gt(familyMembers.joinedAt, since));
  return {
    changes: {
      families: updatedFamilies,
      familyMembers: updatedMembers
    },
    serverTime: (/* @__PURE__ */ new Date()).toISOString()
  };
});

export { pull_get as default };
//# sourceMappingURL=pull.get.mjs.map
