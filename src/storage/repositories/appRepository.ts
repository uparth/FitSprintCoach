import { AppData } from "@/domain/models";
import { migrateAppData } from "@/storage/migrations";
import { appDataSchema, bodyMetricSchema, checkinSchema, exercisePlanSchema, nutritionTargetSchema, profileSchema, retrospectiveSchema, roadmapSchema, settingsSchema, sprintSchema, sprintTaskSchema, taskTemplateSchema } from "@/storage/schemas";
import { seedTemplates } from "@/storage/seedTemplates";
import { deleteJsonFile, readJsonFile, writeJsonFile } from "@/storage/jsonStore";
import { z } from "zod";

const files = {
  profile: "profile.json",
  bodyMetrics: "body_metrics.json",
  nutritionTargets: "nutrition_targets.json",
  exercisePlans: "exercise_plans.json",
  templates: "templates.json",
  backlog: "backlog.json",
  roadmap: "roadmap.json",
  sprints: "sprints.json",
  tasks: "tasks.json",
  checkins: "checkins.json",
  retrospectives: "retrospectives.json",
  settings: "settings.json"
};

export const emptyAppData: AppData = {
  bodyMetrics: [],
  nutritionTargets: [],
  exercisePlans: [],
  templates: seedTemplates,
  backlog: [],
  sprints: [],
  tasks: [],
  checkins: [],
  retrospectives: [],
  settings: { schemaVersion: 1, hasCompletedOnboarding: false }
};

export async function loadAppData(): Promise<AppData> {
  const data: AppData = {
    profile: await readJsonFile(files.profile, profileSchema.optional(), undefined),
    bodyMetrics: await readJsonFile(files.bodyMetrics, z.array(bodyMetricSchema), []),
    nutritionTargets: await readJsonFile(files.nutritionTargets, z.array(nutritionTargetSchema), []),
    exercisePlans: await readJsonFile(files.exercisePlans, z.array(exercisePlanSchema), []),
    templates: await readJsonFile(files.templates, z.array(taskTemplateSchema), seedTemplates),
    backlog: await readJsonFile(files.backlog, z.array(sprintTaskSchema), []),
    roadmap: await readJsonFile(files.roadmap, roadmapSchema.optional(), undefined),
    sprints: await readJsonFile(files.sprints, z.array(sprintSchema), []),
    tasks: await readJsonFile(files.tasks, z.array(sprintTaskSchema), []),
    checkins: await readJsonFile(files.checkins, z.array(checkinSchema), []),
    retrospectives: await readJsonFile(files.retrospectives, z.array(retrospectiveSchema), []),
    settings: await readJsonFile(files.settings, settingsSchema, emptyAppData.settings)
  };
  return migrateAppData(appDataSchema.parse(data));
}

export async function saveAppData(data: AppData): Promise<void> {
  const valid = appDataSchema.parse(data);
  await Promise.all([
    valid.profile ? writeJsonFile(files.profile, valid.profile) : deleteJsonFile(files.profile),
    writeJsonFile(files.bodyMetrics, valid.bodyMetrics),
    writeJsonFile(files.nutritionTargets, valid.nutritionTargets),
    writeJsonFile(files.exercisePlans, valid.exercisePlans),
    writeJsonFile(files.templates, valid.templates),
    writeJsonFile(files.backlog, valid.backlog),
    valid.roadmap ? writeJsonFile(files.roadmap, valid.roadmap) : deleteJsonFile(files.roadmap),
    writeJsonFile(files.sprints, valid.sprints),
    writeJsonFile(files.tasks, valid.tasks),
    writeJsonFile(files.checkins, valid.checkins),
    writeJsonFile(files.retrospectives, valid.retrospectives),
    writeJsonFile(files.settings, valid.settings)
  ]);
}

export async function exportBackup(data: AppData) {
  return JSON.stringify(appDataSchema.parse(data), null, 2);
}

export async function importBackup(raw: string) {
  return appDataSchema.parse(JSON.parse(raw));
}
