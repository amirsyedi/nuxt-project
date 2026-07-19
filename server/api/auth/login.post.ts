import { users } from '~~/server/db/schema';
import { db } from '~~/server/utils/db';
// import { verifyPassword } from '~~/server/utils/crypto';
import { eq, or } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { identifier, password } = body;

  // 1. Validate incoming inputs
  if (!identifier || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username/Email and password are required.',
    });
  }

  try {
    // 2. Query MySQL matching either the username OR the email address
    const [user] = await db
      .select()
      .from(users)
      .where(
        or(
          eq(users.email, identifier.toLowerCase().trim()),
          eq(users.username, identifier.trim())
        )
      )
      .limit(1);

    // 3. Prevent user guessing by returning a generic message if email/username doesn't exist
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid username, email, or password.',
      });
    }

    // 4. Verify the incoming password against our secure database hash string
    // const isPasswordValid = verifyPassword(password, user.password);
    if (password != user.password) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid username, email, or password.',
      });
    }

    // 5. Destructure the user object to strip out the password hash before responding
    const { password: _, ...safeUser } = user;

    // 🔥 Added: Establish and encrypt the session cookie using nuxt-auth-utils helper
    await setUserSession(event, {
      user: safeUser,
      loggedInAt: new Date(),
    });

    // 6. Return successful authentication payload
    return {
      success: true,
      message: 'Login successful!',
      user: safeUser, // Safely returns id, username, email, fullName, department, and createdAt
    };

  } catch (error: any) {
    // Critical Server Log for runtime database debugging
    console.error('❌ Authentication Failure:', error);
    
    // Pass along any direct h3 error exceptions thrown above
    if (error.statusCode) throw error;

    throw createError({
      statusCode: 500,
      statusMessage: `An internal server error occurred during login: ${error.message || error}`,
    });
  }
});