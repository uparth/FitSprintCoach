export type Sex = "male" | "female";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";
export type Pace = "gentle" | "standard" | "ambitious";
export type Units = "metric" | "imperial";
export type SprintPhase = "foundation" | "build" | "capacity" | "refine" | "maintain";
export type TaskStatus = "todo" | "in_progress" | "done" | "partial" | "skipped" | "blocked" | "adjusted";
export type TaskCategory =
  | "walking"
  | "cycling"
  | "home_food"
  | "calories"
  | "protein"
  | "fiber"
  | "water"
  | "sleep"
  | "mindset"
  | "recovery";

export interface Profile {
  id: string;
  name: string;
  age: number;
  sex: Sex;
  heightCm: number;
  currentWeightKg: number;
  goalWeightKg?: number;
  activityLevel: ActivityLevel;
  preferredPace: Pace;
  sprintLengthDays: number;
  units: Units;
  walkingDays: number;
  cyclingDays: number;
  hasIndoorBike: boolean;
  remindersEnabled: boolean;
  foodNotes?: string;
  healthAcknowledged: boolean;
  minimumCalories?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BodyMetricEntry {
  id: string;
  date: string;
  weightKg: number;
  bmi: number;
  waistCm?: number | null;
  note?: string;
}

export interface NutritionTarget {
  id: string;
  startDate: string;
  endDate: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  waterMl: number;
  source: "generated" | "custom";
  warnings: string[];
}

export interface ExercisePlan {
  id: string;
  sprintId: string;
  walking: ExerciseActivityPlan;
  cycling?: ExerciseActivityPlan;
}

export interface ExerciseActivityPlan {
  level: number;
  sessionsPerWeek: number;
  minutesPerSession: number;
  intensity: "easy" | "steady" | "brisk" | "intervals";
}

export interface Frequency {
  type: "daily" | "weekly";
  target: number;
}

export interface TaskTemplate {
  id: string;
  title: string;
  category: TaskCategory;
  points: number;
  frequency: Frequency;
  difficulty: "easy" | "medium" | "hard";
  estimatedMinutes: number;
  definitionOfDone: string;
  fallback: string;
  blockers: string[];
  tags: string[];
  packIds: string[];
}

export interface SprintTask {
  id: string;
  templateId?: string;
  sprintId: string;
  title: string;
  category: TaskCategory;
  points: number;
  targetCount: number;
  completedCount: number;
  status: TaskStatus;
  definitionOfDone: string;
  fallback: string;
}

export interface Sprint {
  id: string;
  weekNumber: number;
  name: string;
  goal: string;
  phase: SprintPhase;
  startDate: string;
  endDate: string;
  targetWeightKg: number;
  plannedPoints: number;
  completedPoints: number;
  nutritionTargetId: string;
  exercisePlanId: string;
  taskIds: string[];
  status: "planned" | "active" | "completed" | "archived";
}

export interface RoadmapSprint {
  sprintNumber: number;
  phase: SprintPhase;
  targetWeightKg: number;
  milestone?: string;
}

export interface Roadmap {
  id: string;
  currentWeightKg: number;
  goalWeightKg: number;
  totalWeightToReduceKg: number;
  weeklyLossTargetKg: number;
  estimatedWeeks: number;
  estimatedSprints: number;
  sprints: RoadmapSprint[];
  createdAt: string;
}

export interface DailyCheckIn {
  id: string;
  date: string;
  sprintId: string;
  yesterday: string;
  today: string;
  blockers: string[];
  caloriesActual?: number;
  proteinActualGrams?: number;
  carbsActualGrams?: number;
  fatActualGrams?: number;
  fiberActualGrams?: number;
  waterActualMl?: number;
  taskUpdates: Array<{ taskId: string; status: TaskStatus; note?: string }>;
}

export interface Retrospective {
  id: string;
  sprintId: string;
  worked: string[];
  didNotWork: string[];
  blockers: string[];
  continue: string[];
  change: string[];
  nextSprintRecommendation: string;
}

export interface AppSettings {
  schemaVersion: number;
  hasCompletedOnboarding: boolean;
  selectedSprintId?: string;
}

export interface AppData {
  profile?: Profile;
  bodyMetrics: BodyMetricEntry[];
  nutritionTargets: NutritionTarget[];
  exercisePlans: ExercisePlan[];
  templates: TaskTemplate[];
  backlog: SprintTask[];
  roadmap?: Roadmap;
  sprints: Sprint[];
  tasks: SprintTask[];
  checkins: DailyCheckIn[];
  retrospectives: Retrospective[];
  settings: AppSettings;
}
