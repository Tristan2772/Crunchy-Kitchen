import { getTursoClient } from "../../utils/turso"
import { gt } from "drizzle-orm"
import { families, familyMembers } from "../../db/schema"

// Pull changes from server since last sync
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const since = query.since ? new Date(query.since as string) : new Date(0)
  
  const db = getTursoClient()
  
  // Get updated families
  const updatedFamilies = await db
    .select()
    .from(families)
    .where(gt(families.updatedAt, since))
  
  // Get updated family members
  const updatedMembers = await db
    .select()
    .from(familyMembers)
    .where(gt(familyMembers.joinedAt, since))
  
  return {
    changes: {
      families: updatedFamilies,
      familyMembers: updatedMembers,
    },
    serverTime: new Date().toISOString(),
  }
})
