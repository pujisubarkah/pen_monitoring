import { relations } from 'drizzle-orm';
import { pilar } from './server/schemas/pilar-schemas';
import { kegiatan } from './server/schemas/kegiatan-schemas';
import { instansi } from './server/schemas/instansi-schemas';
import { actionPlans, target, actionPlanPic, indikatorKeberhasilanDetail, actionPlanProgress, actionPlanSchedule } from './server/schemas/action-plan-schemas';

export const pilarRelations = relations(pilar, ({ many }) => ({
  kegiatans: many(kegiatan),
}));

export const kegiatanRelations = relations(kegiatan, ({ one, many }) => ({
  pilar: one(pilar, {
    fields: [kegiatan.pilarId],
    references: [pilar.id],
  }),
  actionPlans: many(actionPlans),
}));

export const instansiRelations = relations(instansi, ({ many }) => ({
  actionPlanPics: many(actionPlanPic),
}));

export const actionPlansRelations = relations(actionPlans, ({ one, many }) => ({
  kegiatan: one(kegiatan, {
    fields: [actionPlans.kegiatanId],
    references: [kegiatan.id],
  }),
  actionPlanPics: many(actionPlanPic),
  actionPlanProgresses: many(actionPlanProgress),
  actionPlanSchedules: many(actionPlanSchedule),
  targets: many(target),
  indikatorKeberhasilanDetails: many(indikatorKeberhasilanDetail),
}));

export const actionPlanPicRelations = relations(actionPlanPic, ({ one, many }) => ({
  actionPlan: one(actionPlans, {
    fields: [actionPlanPic.actionPlansId],
    references: [actionPlans.id],
  }),
  instansi: one(instansi, {
    fields: [actionPlanPic.picId],
    references: [instansi.id],
  }),
  actionPlanProgresses: many(actionPlanProgress),
}));

export const actionPlanProgressRelations = relations(actionPlanProgress, ({ one }) => ({
  actionPlanPic: one(actionPlanPic, {
    fields: [actionPlanProgress.actionPlanPicId],
    references: [actionPlanPic.id],
  }),
}));

export const actionPlanScheduleRelations = relations(actionPlanSchedule, ({ one }) => ({
  actionPlan: one(actionPlans, {
    fields: [actionPlanSchedule.actionPlansId],
    references: [actionPlans.id],
  }),
}));

export const indikatorKeberhasilanDetailRelations = relations(indikatorKeberhasilanDetail, ({ one }) => ({
  actionPlan: one(actionPlans, {
    fields: [indikatorKeberhasilanDetail.actionPlansId],
    references: [actionPlans.id],
  }),
}));