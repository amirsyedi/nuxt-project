import { attendance } from '~~/server/db/schema';
import { db } from '~~/server/utils/db';
import { eq, desc } from 'drizzle-orm';

// This exact line is required by Nuxt!
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const userId = Number(query.userId);

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing userId' });
  }

  try {
    const logs = await db.select()
      .from(attendance)
      .where(eq(attendance.userId, userId))
      .orderBy(desc(attendance.logTime));

    // Return must be an object or array, not just a bare function
    return logs;

  } catch (error: any) {
    console.error('❌ Failed to fetch logs:', error);
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});