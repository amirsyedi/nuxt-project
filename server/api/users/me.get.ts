// server/api/users/me.get.ts
import { users } from '~~/server/db/schema';
import { db } from '~~/server/utils/db';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  // 1. Retrieve the encrypted session data via nuxt-auth-utils
  const session = await getUserSession(event);

  // 2. Safeguard check: If there is no active session, throw a 401 Unauthorized error
  if (!session?.user?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Sila log masuk untuk mengakses maklumat ini.',
    });
  }

  try {
    // 3. Query the specific user row using Drizzle.
    // We explicitly select the columns needed to avoid accidentally exposing password hashes.
    const [foundUser] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        fullName: users.fullName,
        department: users.department,
        role: users.role, // Mapping Engine looks for this property as a fallback
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    // 4. Guard against missing database records
    if (!foundUser) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Profil pengguna tidak ditemui di dalam sistem.',
      });
    }

    // 5. Return the clean raw data object
    return foundUser;

  } catch (error: any) {
    // Pass through our custom H3 errors (401, 404) safely
    if (error.statusCode) throw error;

    // Log unexpected issues like DB connection drops to the console
    console.error('❌ Error fetching current user profile:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Ralat sistem semasa memuatkan maklumat profil.',
    });
  }
});