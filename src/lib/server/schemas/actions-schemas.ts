import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './user-schemas';

// Actions table
export const actions = pgTable('actions', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: text('title').notNull(),
	description: text('description'),
	targetDate: timestamp('target_date'),
	priority: text('priority').notNull().default('medium'), // 'low', 'medium', 'high'
	status: text('status').notNull().default('pending'), // 'pending', 'in_progress', 'completed', 'cancelled'
	assignedTo: text('assigned_to'),
	userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Zod schemas for actions
export const insertActionSchema = createInsertSchema(actions, {
	title: z.string().min(1, 'Judul aksi wajib diisi'),
	description: z.string().optional(),
	targetDate: z.string().optional(),
	priority: z.enum(['low', 'medium', 'high']).default('medium'),
	status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).default('pending'),
	assignedTo: z.string().optional(),
	userId: z.number().int(),
});
export const selectActionSchema = createSelectSchema(actions);

// Types
export type Action = typeof actions.$inferSelect;
export type NewAction = typeof actions.$inferInsert;