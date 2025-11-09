import { pgTable, text, timestamp, integer, serial, varchar, index, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// User Profile table
export const userProfile = pgTable('user_profiles', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull(),
  nama: varchar('nama', { length: 255 }),
  email: varchar('email', { length: 255 }),
  no_hp: varchar('no_hp', { length: 50 }),
  jabatan: varchar('jabatan', { length: 255 }),
  unit_kerja: varchar('unit_kerja', { length: 255 }),
  alamat_kantor: text('alamat_kantor'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Users table
export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	role: text('role').notNull().default('user'), // 'admin' or 'user'
	is_active: boolean('is_active').notNull().default(true),
	created_at: timestamp('created_at').notNull().defaultNow(),
	updated_at: timestamp('updated_at').notNull().defaultNow(),
	instansi_id: integer('instansi_id'),
	is_verified: boolean('is_verified').notNull().default(false),
});

// Sessions table
export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Zod schemas for userProfile
export const insertUserProfileSchema = createInsertSchema(userProfile, {
  nama: z.string().min(1, 'Nama wajib diisi'),
  email: z.string().email('Format email tidak valid'),
  no_hp: z.string().optional(),
  jabatan: z.string().optional(),
  unit_kerja: z.string().optional(),
  alamat_kantor: z.string().optional(),
});
export const selectUserProfileSchema = createSelectSchema(userProfile);

// Zod schemas for users
export const insertUserSchema = createInsertSchema(users, {
	name: z.string().min(2, 'Nama minimal 2 karakter'),
	email: z.string().email('Format email tidak valid'),
	password: z.string().min(8, 'Password minimal 8 karakter'),
	instansi_id: z.number().int().optional(),
	role: z.enum(['admin', 'user']).default('user'),
	is_active: z.boolean().default(true),
	is_verified: z.boolean().default(false),
});
export const selectUserSchema = createSelectSchema(users);

// Zod schemas for sessions
export const insertSessionSchema = createInsertSchema(sessions, {
	id: z.string(),
	userId: z.number().int(),
	expiresAt: z.date(),
});
export const selectSessionSchema = createSelectSchema(sessions);

// Types
export type UserProfile = typeof userProfile.$inferSelect;
export type NewUserProfile = typeof userProfile.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;