import { users } from '~~/server/db/schema';
import { db } from '~~/server/utils/db';
import { eq, or } from 'drizzle-orm'; // 1. Import 'or' from Drizzle
import bcrypt from 'bcryptjs';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  // 2. Accept 'identifier' instead of just 'username'
  const { identifier, password } = body;
console.log("identifier",identifier);

  // Basic validation check
  if (!identifier || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Identifier (Username/Email) and password are required.',
    });
  }

  try {
    const cleanIdentifier = identifier.trim();

    // 3. Look up the user by matching the identifier against BOTH username and email columns
    const [foundUser] = await db
      .select()
      .from(users)
      .where(
        or(
          eq(users.username, cleanIdentifier),
          eq(users.email, cleanIdentifier.toLowerCase())
        )
      )
      .limit(1);

    // 4. Verify user exists and check password hash matches
    if (!foundUser || !bcrypt.compareSync(password.trim(), foundUser.password)) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Invalid credentials provided.',
      });
    }

    // 5. Establish session
    await setUserSession(event, {
      user: {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        fullName: foundUser.fullName,
        department: foundUser.department,
        role: foundUser.role,
      },
    });

    return { 
      success: true,
      message: 'Logged in successfully!'
    };

  } catch (error: any) {
    if (error.statusCode) throw error;

    console.error('❌ Login Failure Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'An error occurred during authentication.',
    });
  }
});