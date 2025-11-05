import { relations } from 'drizzle-orm';
import { actionPlans, planActivities, planPics, planSchedules, planProgress, instansi } from './server/schema';

export const instansiRelations = relations(instansi, ({ many }) => ({
  planPics: many(planPics),
}));

export const actionPlansRelations = relations(actionPlans, ({ many }) => ({
  activities: many(planActivities),
  pics: many(planPics),
  schedules: many(planSchedules),
  progress: many(planProgress),
}));

export const planActivitiesRelations = relations(planActivities, ({ one }) => ({
  actionPlan: one(actionPlans, {
    fields: [planActivities.actionPlanId],
    references: [actionPlans.id],
  }),
}));

export const planPicsRelations = relations(planPics, ({ one }) => ({
  actionPlan: one(actionPlans, {
    fields: [planPics.actionPlanId],
    references: [actionPlans.id],
  }),
  instansi: one(instansi, {
    fields: [planPics.instansiId],
    references: [instansi.id],
  }),
}));

export const planSchedulesRelations = relations(planSchedules, ({ one }) => ({
  actionPlan: one(actionPlans, {
    fields: [planSchedules.actionPlanId],
    references: [actionPlans.id],
  }),
}));

export const planProgressRelations = relations(planProgress, ({ one }) => ({
  actionPlan: one(actionPlans, {
    fields: [planProgress.actionPlanId],
    references: [actionPlans.id],
  }),
}));