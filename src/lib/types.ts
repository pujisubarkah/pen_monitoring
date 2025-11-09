import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { pilar } from './server/schemas/pilar-schemas';
import { kegiatan } from './server/schemas/kegiatan-schemas';
import { instansi } from './server/schemas/instansi-schemas';
import { actionPlans, actionPlanProgress, actionPlanSchedule, target } from './server/schemas/action-plan-schemas';
import { users, sessions, userProfile } from './server/schemas/user-schemas';

export type Pilar = InferSelectModel<typeof pilar>;
export type NewPilar = InferInsertModel<typeof pilar>;

export type Kegiatan = InferSelectModel<typeof kegiatan>;
export type NewKegiatan = InferInsertModel<typeof kegiatan>;

export type Instansi = InferSelectModel<typeof instansi>;
export type NewInstansi = InferInsertModel<typeof instansi>;

export type ActionPlan = InferSelectModel<typeof actionPlans>;
export type NewActionPlan = InferInsertModel<typeof actionPlans>;

export type ActionPlanProgress = InferSelectModel<typeof actionPlanProgress>;
export type NewActionPlanProgress = InferInsertModel<typeof actionPlanProgress>;

export type ActionPlanSchedule = InferSelectModel<typeof actionPlanSchedule>;
export type NewActionPlanSchedule = InferInsertModel<typeof actionPlanSchedule>;

export type Target = InferSelectModel<typeof target>;
export type NewTarget = InferInsertModel<typeof target>;

// Type untuk data lengkap dengan relations
export type ActionPlanWithRelations = ActionPlan & {
  kegiatan?: Kegiatan & { pilar?: Pilar };
  actionPlanProgresses: ActionPlanProgress[];
  actionPlanSchedules: ActionPlanSchedule[];
  targets: Target[];
};