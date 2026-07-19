import { mysqlTable, int, varchar, timestamp } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  username: varchar('username', { length: 100 }).notNull().unique(), // Added
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),          // Added
  fullName: varchar('full_name', { length: 255 }).notNull(),         // Added
  department: varchar('department', { length: 150 }).notNull(),       // Added
  createdAt: timestamp('created_at').defaultNow().notNull(),
});