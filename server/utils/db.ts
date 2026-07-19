import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '~~/server/db/schema';

// 1. Get the runtime configuration object
const config = useRuntimeConfig();

// 2. Use the exposed variable (falling back to process.env if needed)
const poolConnection = mysql.createPool({
  uri: config.databaseUrl || process.env.DATABASE_URL,
});

export const db = drizzle(poolConnection, { 
  schema, 
  mode: 'default' 
});