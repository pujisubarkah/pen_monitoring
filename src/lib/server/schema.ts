import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table
export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	instansiId: integer('instansi_id').references(() => instansi.id),
	role: text('role').notNull().default('user'), // 'admin' or 'user'
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Instansi table
export const instansi = pgTable('instansi', {
	id: integer('id').primaryKey(),
	instansiId: integer('instansi_id').notNull(),
	namaInstansi: text('nama_instansi').notNull(),
});

// Sessions table
export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Actions table
export const actions = pgTable('actions', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: text('title').notNull(),
	description: text('description'),
	targetDate: timestamp('target_date'),
	priority: text('priority').notNull().default('medium'), // 'low', 'medium', 'high'
	status: text('status').notNull().default('pending'), // 'pending', 'in_progress', 'completed', 'cancelled'
	assignedTo: text('assigned_to'),
	userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
	name: z.string().min(2, 'Nama minimal 2 karakter'),
	email: z.string().email('Format email tidak valid'),
	password: z.string().min(8, 'Password minimal 8 karakter'),
	instansiId: z.number().int().optional(),
	role: z.enum(['admin', 'user']).default('user'),
});

export const insertInstansiSchema = createInsertSchema(instansi, {
	instansiId: z.number().int(),
	namaInstansi: z.string().min(1, 'Nama instansi wajib diisi'),
});

export const insertActionSchema = createInsertSchema(actions, {
	title: z.string().min(1, 'Judul aksi wajib diisi'),
	description: z.string().optional(),
	targetDate: z.string().optional(),
	priority: z.enum(['low', 'medium', 'high']).default('medium'),
	status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).default('pending'),
	assignedTo: z.string().optional(),
	userId: z.string().uuid(),
});

export const selectUserSchema = createSelectSchema(users);
export const selectActionSchema = createSelectSchema(actions);
export const insertSessionSchema = createInsertSchema(sessions);
export const selectSessionSchema = createSelectSchema(sessions);
export const selectInstansiSchema = createSelectSchema(instansi);

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Action = typeof actions.$inferSelect;
export type NewAction = typeof actions.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Instansi = typeof instansi.$inferSelect;
export type NewInstansi = typeof instansi.$inferInsert;