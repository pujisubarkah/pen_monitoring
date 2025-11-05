import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { actionPlans, planActivities, planPics, planSchedules, instansi, planProgress } from './server/schema';

export type Instansi = InferSelectModel<typeof instansi>;
export type NewInstansi = InferInsertModel<typeof instansi>;

export type ActionPlan = InferSelectModel<typeof actionPlans>;
export type NewActionPlan = InferInsertModel<typeof actionPlans>;

export type PlanActivity = InferSelectModel<typeof planActivities>;
export type NewPlanActivity = InferInsertModel<typeof planActivities>;

export type PlanPic = InferSelectModel<typeof planPics>;
export type NewPlanPic = InferInsertModel<typeof planPics>;

export type PlanSchedule = InferSelectModel<typeof planSchedules>;
export type NewPlanSchedule = InferInsertModel<typeof planSchedules>;

export type PlanProgress = InferSelectModel<typeof planProgress>;
export type NewPlanProgress = InferInsertModel<typeof planProgress>;

// Type untuk data lengkap dengan relations
export type ActionPlanWithRelations = ActionPlan & {
  activities: PlanActivity[];
  pics: (PlanPic & { instansi?: Instansi })[];
  schedules: PlanSchedule[];
  progress: PlanProgress[];
};