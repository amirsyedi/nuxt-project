import { users } from '~~/server/db/schema';
import { db } from '~~/server/utils/db';
// import { hashPassword } from '~~/server/utils/crypto';

// Dynamically infer the structural type expected by Drizzle for inserts
type NewUserRequest = typeof users.$inferInsert;

export default defineEventHandler(async (event) => {
  // Pass the type to readBody so TypeScript infers the properties
  const body = await readBody<NewUserRequest>(event);

  const { username, email, password, fullName, department } = body;

  // 1. Ensure no required fields are blank or missing
  if (!username || !email || !password || !fullName || !department) {
    throw createError({
      statusCode: 400,
      statusMessage: 'All fields (username, email, password, fullName, department) are required.',
    });
  }

  try {
    // 2. Securely hash the password string using our crypto utility
    // const hashedPassword = hashPassword(password);

    // 3. Save the new user row into your MySQL instance
    await db.insert(users).values({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: password.trim(),
      fullName: fullName.trim(),
      department: department.trim(),
    });

    return { 
      success: true, 
      message: 'User account created successfully!' 
    };

  } catch (error: any) {
    // 4. Critical Debug Log: Prints the exact underlying error message inside your terminal
    console.error('❌ Database Write Failure:', error);

    // 5. Handle duplicate constraints gracefully (e.g., username or email matches an existing row)
    if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Username or Email is already registered.',
      });
    }

    // 6. Generic error fallback, appending the direct database message for effortless debugging
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Database registration failed: ${error.message || error}`,
    });
  }
});