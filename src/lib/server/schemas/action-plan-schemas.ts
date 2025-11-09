// Tabel indikator_keberhasilan_detail sesuai permintaan user
export const indikatorKeberhasilanDetail = pgTable('indikator_keberhasilan_detail', {
  id: serial('id').primaryKey(),
  actionPlansId: integer('action_plans_id').notNull().references(() => actionPlans.id, { onDelete: 'cascade' }),
  urutan: integer('urutan').notNull(),
  deskripsi: text('deskripsi').notNull(),
}, (table) => {
  return {
    actionPlansIdIdx: index('indikator_keberhasilan_detail_action_plans_id_idx').on(table.actionPlansId),
    urutanIdx: index('indikator_keberhasilan_detail_urutan_idx').on(table.urutan),
  };
});

// Zod schemas for indikatorKeberhasilanDetail
export const insertIndikatorKeberhasilanDetailSchema = createInsertSchema(indikatorKeberhasilanDetail, {
  actionPlansId: z.number().int().min(1, 'Action plan wajib diisi'),
  urutan: z.number().int().min(1, 'Urutan wajib diisi'),
  deskripsi: z.string().min(1, 'Deskripsi wajib diisi'),
});
export const selectIndikatorKeberhasilanDetailSchema = createSelectSchema(indikatorKeberhasilanDetail);

// Types
export type IndikatorKeberhasilanDetail = typeof indikatorKeberhasilanDetail.$inferSelect;
export type NewIndikatorKeberhasilanDetail = typeof indikatorKeberhasilanDetail.$inferInsert;
// Tabel action_plan_pic sesuai permintaan user
export const actionPlanPic = pgTable('action_plan_pic', {
  id: serial('id').primaryKey(),
  actionPlansId: integer('action_plans_id').notNull().references(() => actionPlans.id, { onDelete: 'cascade' }),
  picId: integer('pic_id').notNull().references(() => instansi.id, { onDelete: 'cascade' }),
});

// Zod schemas for actionPlanPic
export const insertActionPlanPicSchema = createInsertSchema(actionPlanPic, {
  actionPlansId: z.number().int().min(1, 'Action plan wajib diisi'),
  picId: z.number().int().min(1, 'PIC wajib diisi'),
});
export const selectActionPlanPicSchema = createSelectSchema(actionPlanPic);

// Types
export type ActionPlanPic = typeof actionPlanPic.$inferSelect;
export type NewActionPlanPic = typeof actionPlanPic.$inferInsert;
import { pgTable, text, timestamp, integer, varchar, index, numeric, serial, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { kegiatan } from './kegiatan-schemas';
import { instansi } from './instansi-schemas';

// Tabel Utama Action Plans (update sesuai permintaan user)
export const actionPlans = pgTable('action_plans', {
  id: serial('id').primaryKey(),
  kegiatanId: integer('kegiatan_id').notNull(),
  output: text('output'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  status: varchar('status', { length: 20 }),
}, (table) => {
  return {
    statusIdx: index('status_idx').on(table.status),
    kegiatanIdIdx: index('action_plans_kegiatan_id_idx').on(table.kegiatanId),
  };
});

// Tabel Action Plan Progress (menggantikan rencanaPic)
export const actionPlanProgress = pgTable('action_plan_progress', {
  id: serial('id').primaryKey(),
  actionPlanPicId: integer('action_plan_pic_id').notNull().references(() => actionPlanPic.id, { onDelete: 'cascade' }),
  periode: varchar('periode', { length: 20 }).notNull(),
  capaian: integer('capaian').default(0),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => {
  return {
    actionPlanPicIdIdx: index('action_plan_progress_action_plan_pic_id_idx').on(table.actionPlanPicId),
    periodeIdx: index('action_plan_progress_periode_idx').on(table.periode),
  };
});

// Tabel Target
export const target = pgTable('target', {
  id: serial('id').primaryKey(),
  actionPlansId: integer('action_plans_id').notNull().references(() => actionPlans.id, { onDelete: 'cascade' }),
  tahun: integer('tahun').notNull(),
  nilaiTarget: numeric('nilai_target'),
  satuan: varchar('satuan', { length: 50 }),
  keterangan: text('keterangan'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => {
  return {
    actionPlansIdIdx: index('target_action_plans_id_idx').on(table.actionPlansId),
    tahunIdx: index('target_tahun_idx').on(table.tahun),
  };
});

// Tabel Action Plan Schedule
export const actionPlanSchedule = pgTable('action_plan_schedule', {
  id: serial('id').primaryKey(),
  actionPlansId: integer('action_plans_id').notNull().references(() => actionPlans.id, { onDelete: 'cascade' }),

  // Periode Pendek
  okt: boolean('okt').default(false),
  nov: boolean('nov').default(false),
  des: boolean('des').default(false),

  // Periode Menengah
  tw1: boolean('tw1').default(false),
  tw2: boolean('tw2').default(false),
  tw3: boolean('tw3').default(false),
  tw4: boolean('tw4').default(false),

  // Periode Panjang
  tahun2027: boolean('tahun_2027').default(false),
  tahun2028: boolean('tahun_2028').default(false),
  tahun2029: boolean('tahun_2029').default(false),

  createdAt: timestamp('created_at').defaultNow(),
}, (table) => {
  return {
    actionPlansIdIdx: index('action_plan_schedule_action_plans_id_idx').on(table.actionPlansId),
  };
});

// Zod schemas for action plans
export const insertActionPlanSchema = createInsertSchema(actionPlans, {
  kegiatanId: z.number().int().min(1, 'Kegiatan wajib dipilih'),
  output: z.string().optional(),
  status: z.string().optional(),
});
export const selectActionPlanSchema = createSelectSchema(actionPlans);

// Zod schemas for actionPlanProgress
export const insertActionPlanProgressSchema = createInsertSchema(actionPlanProgress, {
  actionPlanPicId: z.number().int().min(1, 'Action Plan PIC wajib diisi'),
  periode: z.string().min(1, 'Periode wajib diisi'),
  capaian: z.number().optional(),
});
export const selectActionPlanProgressSchema = createSelectSchema(actionPlanProgress);

// Zod schemas for target
export const insertTargetSchema = createInsertSchema(target, {
  actionPlansId: z.number().int().min(1, 'Action plan wajib dipilih'),
  tahun: z.number().int().min(2000, 'Tahun tidak valid'),
  nilaiTarget: z.number().optional(),
  satuan: z.string().optional(),
  keterangan: z.string().optional(),
});
export const selectTargetSchema = createSelectSchema(target);

// Zod schemas for actionPlanSchedule
export const insertActionPlanScheduleSchema = createInsertSchema(actionPlanSchedule, {
  actionPlansId: z.number().int().min(1, 'Action plan wajib dipilih'),
  okt: z.boolean().optional(),
  nov: z.boolean().optional(),
  des: z.boolean().optional(),
  tw1: z.boolean().optional(),
  tw2: z.boolean().optional(),
  tw3: z.boolean().optional(),
  tw4: z.boolean().optional(),
  tahun2027: z.boolean().optional(),
  tahun2028: z.boolean().optional(),
  tahun2029: z.boolean().optional(),
});
export const selectActionPlanScheduleSchema = createSelectSchema(actionPlanSchedule);

// Types
export type ActionPlan = typeof actionPlans.$inferSelect;
export type NewActionPlan = typeof actionPlans.$inferInsert;
export type ActionPlanProgress = typeof actionPlanProgress.$inferSelect;
export type NewActionPlanProgress = typeof actionPlanProgress.$inferInsert;
export type Target = typeof target.$inferSelect;
export type NewTarget = typeof target.$inferInsert;
export type ActionPlanSchedule = typeof actionPlanSchedule.$inferSelect;
export type NewActionPlanSchedule = typeof actionPlanSchedule.$inferInsert;