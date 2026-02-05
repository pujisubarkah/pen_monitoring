import { text, serial } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { penMonitoringSchema } from './base-schema';

// Pilar table
export const pilar = penMonitoringSchema.table('koperasi_pilar', {
  id: serial('id').primaryKey(),
  nama_pilar: text('nama_pilar').notNull(),
});

// Zod schemas for Pilar
export const insertPilarSchema = createInsertSchema(pilar, {
  nama_pilar: z.string().min(1, 'Nama pilar wajib diisi'),
});
export const selectPilarSchema = createSelectSchema(pilar);

// Types
export type Pilar = typeof pilar.$inferSelect;
export type NewPilar = typeof pilar.$inferInsert;