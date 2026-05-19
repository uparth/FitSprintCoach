import { ExerciseActivityPlan, Profile } from "@/domain/models";

const walkingLevels: Record<number, ExerciseActivityPlan> = {
  1: { level: 1, sessionsPerWeek: 4, minutesPerSession: 10, intensity: "easy" },
  2: { level: 2, sessionsPerWeek: 4, minutesPerSession: 15, intensity: "easy" },
  3: { level: 3, sessionsPerWeek: 4, minutesPerSession: 20, intensity: "easy" },
  4: { level: 4, sessionsPerWeek: 5, minutesPerSession: 28, intensity: "brisk" },
  5: { level: 5, sessionsPerWeek: 5, minutesPerSession: 40, intensity: "brisk" },
  6: { level: 6, sessionsPerWeek: 5, minutesPerSession: 45, intensity: "intervals" }
};

const cyclingLevels: Record<number, ExerciseActivityPlan> = {
  1: { level: 1, sessionsPerWeek: 3, minutesPerSession: 8, intensity: "easy" },
  2: { level: 2, sessionsPerWeek: 3, minutesPerSession: 12, intensity: "easy" },
  3: { level: 3, sessionsPerWeek: 3, minutesPerSession: 15, intensity: "steady" },
  4: { level: 4, sessionsPerWeek: 3, minutesPerSession: 20, intensity: "steady" },
  5: { level: 5, sessionsPerWeek: 4, minutesPerSession: 28, intensity: "steady" },
  6: { level: 6, sessionsPerWeek: 4, minutesPerSession: 30, intensity: "intervals" }
};

export function getInitialWalkingLevel(profile: Pick<Profile, "walkingDays" | "activityLevel">) {
  if (profile.activityLevel === "sedentary" || profile.walkingDays <= 3) return 1;
  if (profile.activityLevel === "light") return 2;
  return 3;
}

export function getInitialCyclingLevel(profile: Pick<Profile, "cyclingDays" | "hasIndoorBike" | "activityLevel">) {
  if (!profile.hasIndoorBike || profile.cyclingDays === 0) return 0;
  if (profile.activityLevel === "sedentary" || profile.cyclingDays <= 2) return 1;
  return 2;
}

export function generateWalkingPlan(level: number, sprintNumber: number) {
  const recoveryWeek = sprintNumber % 4 === 0;
  const plan = walkingLevels[Math.min(6, Math.max(1, level))];
  return recoveryWeek && plan.level > 1
    ? { ...walkingLevels[plan.level - 1], level: plan.level }
    : plan;
}

export function generateCyclingPlan(level: number, sprintNumber: number) {
  if (level <= 0) return undefined;
  const recoveryWeek = sprintNumber % 4 === 0;
  const plan = cyclingLevels[Math.min(6, Math.max(1, level))];
  return recoveryWeek && plan.level > 1
    ? { ...cyclingLevels[plan.level - 1], level: plan.level }
    : plan;
}

export function progressExerciseLevel(previousPlan: ExerciseActivityPlan, completionRate: number) {
  if (completionRate >= 0.85) return Math.min(6, previousPlan.level + 1);
  if (completionRate < 0.5) return Math.max(1, previousPlan.level - 1);
  return previousPlan.level;
}

export function createFallbackWorkout(activityType: "walking" | "cycling" | "recovery") {
  if (activityType === "cycling") return "Cycle for 5 minutes at easy pace.";
  if (activityType === "walking") return "Walk for 5 minutes.";
  return "Stretch gently for 3 minutes.";
}
