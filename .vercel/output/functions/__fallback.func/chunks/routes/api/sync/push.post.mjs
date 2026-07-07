import { d as defineEventHandler, r as readBody, a as getTursoClient } from '../../../nitro/nitro.mjs';
import '@libsql/client';
import 'drizzle-orm/libsql';
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

const push_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { changes } = body;
  if (!changes || !Array.isArray(changes)) {
    return { success: false, error: "Invalid changes format" };
  }
  const db = getTursoClient();
  const results = [];
  for (const change of changes) {
    try {
      await applyChange(db, change);
      results.push({ id: change.id, success: true });
    } catch (error) {
      results.push({
        id: change.id,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
  return {
    success: results.every((r) => r.success),
    results,
    serverTime: (/* @__PURE__ */ new Date()).toISOString()
  };
});
async function applyChange(db, change) {
  const { tableName, operation, recordId, data } = change;
  console.log(`[Sync] ${operation} on ${tableName}:${recordId}`);
}

export { push_post as default };
//# sourceMappingURL=push.post.mjs.map
