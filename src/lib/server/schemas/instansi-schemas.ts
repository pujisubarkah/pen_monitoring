import { pgTable, integer, serial, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Instansi table
export const instansi = pgTable('instansi', {
	id: integer('id').primaryKey(),
	instansiId: integer('instansi_id').notNull(),
	namaInstansi: varchar('nama_instansi', { length: 255 }).notNull(),
});

// Zod schemas for instansi
export const insertInstansiSchema = createInsertSchema(instansi, {
	instansiId: z.number().int(),
	namaInstansi: z.string().min(1, 'Nama instansi wajib diisi'),
});
export const selectInstansiSchema = createSelectSchema(instansi);

// Types
export type Instansi = typeof instansi.$inferSelect;
export type NewInstansi = typeof instansi.$inferInsert;