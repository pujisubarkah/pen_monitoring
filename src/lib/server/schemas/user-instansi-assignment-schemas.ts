import { serial, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { penMonitoringSchema } from './base-schema';
import { users } from './user-schemas';
import { instansi } from './instansi-schemas';

// User Instansi Assignments table (junction table for many-to-many)
export const userInstansiAssignments = penMonitoringSchema.table('user_instansi_assignments', {
	id: serial('id').primaryKey(),
	user_id: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	instansi_id: integer('instansi_id').notNull().references(() => instansi.id, { onDelete: 'cascade' }),
	assigned_at: timestamp('assigned_at').notNull().defaultNow(),
	assigned_by: integer('assigned_by'), // super admin who assigned
}, (table) => ({
	userInstansiIdx: index('user_instansi_idx').on(table.user_id, table.instansi_id),
}));

// Zod schemas
export const insertUserInstansiAssignmentSchema = createInsertSchema(userInstansiAssignments, {
	user_id: z.number().int().positive(),
	instansi_id: z.number().int().positive(),
	assigned_by: z.number().int().positive().optional(),
});
export const selectUserInstansiAssignmentSchema = createSelectSchema(userInstansiAssignments);

// Types
export type UserInstansiAssignment = typeof userInstansiAssignments.$inferSelect;
export type NewUserInstansiAssignment = typeof userInstansiAssignments.$inferInsert;
