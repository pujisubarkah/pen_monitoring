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

// Zod schema for userProfile
export const insertUserProfileSchema = createInsertSchema(userProfile, {
  nama: z.string().min(1, 'Nama wajib diisi'),
  email: z.string().email('Format email tidak valid'),
  no_hp: z.string().optional(),
  jabatan: z.string().optional(),
  unit_kerja: z.string().optional(),
  alamat_kantor: z.string().optional(),
});
export const selectUserProfileSchema = createSelectSchema(userProfile);

// Types
export type UserProfile = typeof userProfile.$inferSelect;
export type NewUserProfile = typeof userProfile.$inferInsert;
import { pgTable, text, timestamp, uuid, integer, serial, varchar, index, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Pilar table
export const pilar = pgTable('koperasi_pilar', {
  id: serial('id').primaryKey(),
  nama_pilar: text('nama_pilar').notNull(),
});

// Zod schema for Pilar
export const insertPilarSchema = createInsertSchema(pilar, {
  nama_pilar: z.string().min(1, 'Nama pilar wajib diisi'),
});
export const selectPilarSchema = createSelectSchema(pilar);

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

// Instansi table
export const instansi = pgTable('instansi', {
	id: integer('id').primaryKey(),
	instansiId: integer('instansi_id').notNull(),
	namaInstansi: text('nama_instansi').notNull(),
});

// Sessions table
export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
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
	userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Tabel Utama Action Plans
export const actionPlans = pgTable('action_plans', {
  id: serial('id').primaryKey(),
  pilar: varchar('pilar', { length: 500 }).notNull(),
  output: text('output'),
  indikatorKeberhasilan: text('indikator_keberhasilan'),
  status: varchar('status', { length: 20 }).default('draft').$type<'draft' | 'active' | 'completed'>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => {
  return {
    statusIdx: index('status_idx').on(table.status),
  };
});

// Tabel Kegiatan
export const planActivities = pgTable('plan_activities', {
  id: serial('id').primaryKey(),
  actionPlanId: integer('action_plan_id').notNull().references(() => actionPlans.id, { onDelete: 'cascade' }),
  kegiatan: text('kegiatan').notNull(),
  urutan: integer('urutan').default(1),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => {
  return {
    actionPlanIdIdx: index('plan_activities_action_plan_id_idx').on(table.actionPlanId),
  };
});

// Tabel PIC
export const planPics = pgTable('plan_pics', {
  id: serial('id').primaryKey(),
  actionPlanId: integer('action_plan_id').notNull().references(() => actionPlans.id, { onDelete: 'cascade' }),
  instansiId: integer('instansi_id').references(() => instansi.id),
  namaPic: varchar('nama_pic', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => {
  return {
    actionPlanIdIdx: index('plan_pics_action_plan_id_idx').on(table.actionPlanId),
    instansiIdIdx: index('plan_pics_instansi_id_idx').on(table.instansiId),
  };
});

// Tabel Jadwal
export const planSchedules = pgTable('plan_schedules', {
  id: serial('id').primaryKey(),
  actionPlanId: integer('action_plan_id').notNull().references(() => actionPlans.id, { onDelete: 'cascade' }),
  periode: varchar('periode', { length: 20 }).notNull().$type<'pendek' | 'menengah' | 'panjang'>(),
  
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
    actionPlanIdIdx: index('plan_schedules_action_plan_id_idx').on(table.actionPlanId),
    periodeIdx: index('periode_idx').on(table.periode),
  };
});

// Tabel Progress (Opsional)
export const planProgress = pgTable('plan_progress', {
  id: serial('id').primaryKey(),
  actionPlanId: integer('action_plan_id').notNull().references(() => actionPlans.id, { onDelete: 'cascade' }),
  progressPercentage: integer('progress_percentage').default(0),
  catatan: text('catatan'),
  status: varchar('status', { length: 20 }).default('on_track').$type<'on_track' | 'delayed' | 'completed' | 'cancelled'>(),
  reportedBy: varchar('reported_by', { length: 255 }),
  reportedAt: timestamp('reported_at').defaultNow(),
}, (table) => {
  return {
    actionPlanIdIdx: index('plan_progress_action_plan_id_idx').on(table.actionPlanId),
  };
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
	name: z.string().min(2, 'Nama minimal 2 karakter'),
	email: z.string().email('Format email tidak valid'),
	password: z.string().min(8, 'Password minimal 8 karakter'),
	instansi_id: z.number().int().optional(),
	role: z.enum(['admin', 'user']).default('user'),
	is_active: z.boolean().default(true),
	is_verified: z.boolean().default(false),
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
	userId: z.number().int(),
});

export const selectUserSchema = createSelectSchema(users);
export const selectActionSchema = createSelectSchema(actions);
export const insertSessionSchema = createInsertSchema(sessions, {
	id: z.string(),
	userId: z.number().int(),
	expiresAt: z.date(),
});
export const selectSessionSchema = createSelectSchema(sessions);
export const selectInstansiSchema = createSelectSchema(instansi);

// Zod schemas for action plans
export const insertActionPlanSchema = createInsertSchema(actionPlans, {
  pilar: z.string().min(1, 'Pilar wajib diisi'),
  output: z.string().optional(),
  indikatorKeberhasilan: z.string().optional(),
  status: z.enum(['draft', 'active', 'completed']).default('draft'),
});

export const insertPlanActivitySchema = createInsertSchema(planActivities, {
  actionPlanId: z.number().int(),
  kegiatan: z.string().min(1, 'Kegiatan wajib diisi'),
  urutan: z.number().int().default(1),
});

export const insertPlanPicSchema = createInsertSchema(planPics, {
  actionPlanId: z.number().int(),
  instansiId: z.number().int().optional(),
  namaPic: z.string().optional(),
});

export const insertPlanScheduleSchema = createInsertSchema(planSchedules, {
  actionPlanId: z.number().int(),
  periode: z.enum(['pendek', 'menengah', 'panjang']),
  okt: z.boolean().default(false),
  nov: z.boolean().default(false),
  des: z.boolean().default(false),
  tw1: z.boolean().default(false),
  tw2: z.boolean().default(false),
  tw3: z.boolean().default(false),
  tw4: z.boolean().default(false),
  tahun2027: z.boolean().default(false),
  tahun2028: z.boolean().default(false),
  tahun2029: z.boolean().default(false),
});

export const insertPlanProgressSchema = createInsertSchema(planProgress, {
  actionPlanId: z.number().int(),
  progressPercentage: z.number().int().min(0).max(100).default(0),
  catatan: z.string().optional(),
  status: z.enum(['on_track', 'delayed', 'completed', 'cancelled']).default('on_track'),
  reportedBy: z.string().optional(),
});

export const selectActionPlanSchema = createSelectSchema(actionPlans);
export const selectPlanActivitySchema = createSelectSchema(planActivities);
export const selectPlanPicSchema = createSelectSchema(planPics);
export const selectPlanScheduleSchema = createSelectSchema(planSchedules);
export const selectPlanProgressSchema = createSelectSchema(planProgress);

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Action = typeof actions.$inferSelect;
export type NewAction = typeof actions.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Instansi = typeof instansi.$inferSelect;
export type NewInstansi = typeof instansi.$inferInsert;

// Action Plan Types
export type ActionPlan = typeof actionPlans.$inferSelect;
export type NewActionPlan = typeof actionPlans.$inferInsert;
export type PlanActivity = typeof planActivities.$inferSelect;
export type NewPlanActivity = typeof planActivities.$inferInsert;
export type PlanPic = typeof planPics.$inferSelect;
export type NewPlanPic = typeof planPics.$inferInsert;
export type PlanSchedule = typeof planSchedules.$inferSelect;
export type NewPlanSchedule = typeof planSchedules.$inferInsert;
export type PlanProgress = typeof planProgress.$inferSelect;
export type NewPlanProgress = typeof planProgress.$inferInsert;