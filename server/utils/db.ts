import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '~~/server/db/schema';

const poolConnection = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

// PASS "mode: 'default'" right alongside your schema object
export const db = drizzle(poolConnection, { 
  schema, 
  mode: 'default' 
});