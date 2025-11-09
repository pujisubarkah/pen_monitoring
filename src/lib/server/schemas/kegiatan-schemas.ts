import { pgTable, integer, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { pilar } from './pilar-schemas';

// Kegiatan table
export const kegiatan = pgTable('kegiatan', {
  id: integer('id').primaryKey(),
  pilarId: integer('pilar_id').notNull().references(() => pilar.id, { onDelete: 'cascade' }),
  namaKegiatan: varchar('nama_kegiatan', { length: 500 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  urutan: integer('urutan').notNull(),
}, (table) => {
  return {
    pilarIdIdx: index('kegiatan_pilar_id_idx').on(table.pilarId),
  };
});

// Zod schemas for kegiatan
export const insertKegiatanSchema = createInsertSchema(kegiatan, {
  pilarId: z.number().int().min(1, 'Pilar wajib dipilih'),
  namaKegiatan: z.string().min(1, 'Nama kegiatan wajib diisi'),
  urutan: z.number().int().min(1, 'Urutan wajib diisi'),
});
export const selectKegiatanSchema = createSelectSchema(kegiatan);

// Types
export type Kegiatan = typeof kegiatan.$inferSelect;
export type NewKegiatan = typeof kegiatan.$inferInsert;