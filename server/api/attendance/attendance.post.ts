import { attendance } from '~~/server/db/schema';
import { db } from '~~/server/utils/db';

// Dynamically infer the structural type expected by Drizzle for inserts
type NewAttendanceRequest = typeof attendance.$inferInsert;

export default defineEventHandler(async (event) => {
  // Pass the type to readBody so TypeScript infers the properties
  const body = await readBody<NewAttendanceRequest>(event);

  if (!body) {
    throw createError({ statusCode: 400, statusMessage: 'Request body is completely empty.' });
  }

  const { userId, activityType, logTime, gpsCoordinates, distance } = body;

  // 2. Pinpoint exactly which fields are missing or empty
  const missingFields = [];
  if (userId === undefined || userId === null) missingFields.push('userId');
  if (!activityType) missingFields.push('activityType');
  if (!logTime) missingFields.push('logTime');
  if (!gpsCoordinates) missingFields.push('gpsCoordinates');
  if (distance === undefined || distance === null || distance === '') missingFields.push('distance');

  // 3. Throw a specific error telling you exactly what failed
  if (missingFields.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: `Missing required fields: ${missingFields.join(', ')}`,
    });
  }

  try {
    // 2. Save the new attendance row into your MySQL instance
    await db.insert(attendance).values({
      userId,
      activityType: activityType.trim(),
      logTime: new Date(logTime), // Ensures the incoming string is parsed as a valid Date object for the timestamp column
      gpsCoordinates: gpsCoordinates.trim(),
      distance: distance.trim(),
    });

    return { 
      success: true, 
      message: 'Attendance logged successfully!' 
    };

  } catch (error: any) {
    // 3. Critical Debug Log: Prints the exact underlying error message inside your terminal
    console.error('❌ Database Write Failure:', error);

    // 4. Handle foreign key constraint failure (e.g., if a non-existent userId is provided)
    if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.errno === 1452) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid user ID. User does not exist.',
      });
    }

    // 5. Generic error fallback, appending the direct database message for effortless debugging
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Database insert failed: ${error.message || error}`,
    });
  }
});