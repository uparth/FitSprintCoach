import { z } from "zod";

const frequencySchema = z.object({
  type: z.enum(["daily", "weekly"]),
  target: z.number()
});

export const taskTemplateSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.enum(["walking", "cycling", "home_food", "calories", "protein", "fiber", "water", "sleep", "mindset", "recovery"]),
  points: z.number(),
  frequency: frequencySchema,
  difficulty: z.enum(["easy", "medium", "hard"]),
  estimatedMinutes: z.number(),
  definitionOfDone: z.string(),
  fallback: z.string(),
  blockers: z.array(z.string()),
  tags: z.array(z.string()),
  packIds: z.array(z.string())
});

export const sprintTaskSchema = z.object({
  id: z.string(),
  templateId: z.string().optional(),
  sprintId: z.string(),
  title: z.string(),
  category: taskTemplateSchema.shape.category,
  points: z.number(),
  estimatedMinutes: z.number().optional(),
  targetCount: z.number(),
  completedCount: z.number(),
  status: z.enum(["todo", "in_progress", "done", "partial", "skipped", "blocked", "adjusted"]),
  definitionOfDone: z.string(),
  fallback: z.string()
});

export const profileSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number(),
  sex: z.enum(["male", "female"]),
  heightCm: z.number(),
  currentWeightKg: z.number(),
  goalWeightKg: z.number().optional(),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very_active"]),
  preferredPace: z.enum(["gentle", "standard", "ambitious"]),
  sprintLengthDays: z.number(),
  units: z.enum(["metric", "imperial"]),
  walkingDays: z.number(),
  cyclingDays: z.number(),
  hasIndoorBike: z.boolean(),
  remindersEnabled: z.boolean(),
  foodNotes: z.string().optional(),
  healthAcknowledged: z.boolean(),
  minimumCalories: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const bodyMetricSchema = z.object({
  id: z.string(),
  date: z.string(),
  weightKg: z.number(),
  bmi: z.number(),
  waistCm: z.number().nullable().optional(),
  note: z.string().optional()
});

export const nutritionTargetSchema = z.object({
  id: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  calories: z.number(),
  proteinGrams: z.number(),
  carbsGrams: z.number(),
  fatGrams: z.number(),
  fiberGrams: z.number(),
  waterMl: z.number(),
  source: z.enum(["generated", "custom"]),
  warnings: z.array(z.string())
});

export const exercisePlanSchema = z.object({
  id: z.string(),
  sprintId: z.string(),
  walking: z.object({ level: z.number(), sessionsPerWeek: z.number(), minutesPerSession: z.number(), intensity: z.enum(["easy", "steady", "brisk", "intervals"]) }),
  cycling: z.object({ level: z.number(), sessionsPerWeek: z.number(), minutesPerSession: z.number(), intensity: z.enum(["easy", "steady", "brisk", "intervals"]) }).optional()
});

export const sprintSchema = z.object({
  id: z.string(),
  weekNumber: z.number(),
  name: z.string(),
  goal: z.string(),
  phase: z.enum(["foundation", "build", "capacity", "refine", "maintain"]),
  startDate: z.string(),
  endDate: z.string(),
  targetWeightKg: z.number(),
  plannedPoints: z.number(),
  completedPoints: z.number(),
  nutritionTargetId: z.string(),
  exercisePlanId: z.string(),
  taskIds: z.array(z.string()),
  status: z.enum(["planned", "active", "completed", "archived"])
});

export const roadmapSchema = z.object({
  id: z.string(),
  currentWeightKg: z.number(),
  goalWeightKg: z.number(),
  totalWeightToReduceKg: z.number(),
  weeklyLossTargetKg: z.number(),
  estimatedWeeks: z.number(),
  estimatedSprints: z.number(),
  sprints: z.array(z.object({
    sprintNumber: z.number(),
    phase: z.enum(["foundation", "build", "capacity", "refine", "maintain"]),
    targetWeightKg: z.number(),
    milestone: z.string().optional()
  })),
  createdAt: z.string()
});

export const checkinSchema = z.object({
  id: z.string(),
  date: z.string(),
  sprintId: z.string(),
  yesterday: z.string(),
  today: z.string(),
  blockers: z.array(z.string()),
  caloriesActual: z.number().optional(),
  proteinActualGrams: z.number().optional(),
  carbsActualGrams: z.number().optional(),
  fatActualGrams: z.number().optional(),
  fiberActualGrams: z.number().optional(),
  waterActualMl: z.number().optional(),
  taskUpdates: z.array(z.object({ taskId: z.string(), status: sprintTaskSchema.shape.status, note: z.string().optional() }))
});

export const retrospectiveSchema = z.object({
  id: z.string(),
  sprintId: z.string(),
  worked: z.array(z.string()),
  didNotWork: z.array(z.string()),
  blockers: z.array(z.string()),
  continue: z.array(z.string()),
  change: z.array(z.string()),
  nextSprintRecommendation: z.string()
});

export const settingsSchema = z.object({
  schemaVersion: z.number(),
  hasCompletedOnboarding: z.boolean(),
  selectedSprintId: z.string().optional()
});

export const appDataSchema = z.object({
  profile: profileSchema.optional(),
  bodyMetrics: z.array(bodyMetricSchema),
  nutritionTargets: z.array(nutritionTargetSchema),
  exercisePlans: z.array(exercisePlanSchema),
  templates: z.array(taskTemplateSchema),
  backlog: z.array(sprintTaskSchema),
  roadmap: roadmapSchema.optional(),
  sprints: z.array(sprintSchema),
  tasks: z.array(sprintTaskSchema),
  checkins: z.array(checkinSchema),
  retrospectives: z.array(retrospectiveSchema),
  settings: settingsSchema
});
