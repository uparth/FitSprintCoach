import { buildBodyAssessment } from "@/domain/bmi";
import { calculateCalorieTarget, estimateWeeklyWeightLoss } from "@/domain/caloriePlanner";
import { generateCyclingPlan, generateWalkingPlan, getInitialCyclingLevel, getInitialWalkingLevel } from "@/domain/exerciseProgression";
import { buildMacroTarget } from "@/domain/macroPlanner";
import { ExercisePlan, NutritionTarget, Profile, Roadmap, Sprint, SprintPhase, SprintTask, TaskTemplate } from "@/domain/models";
import { calculateWaterTarget } from "@/domain/waterPlanner";
import { addDaysISO, nowISO, todayISO } from "@/utils/dates";
import { createId } from "@/utils/ids";
import { round } from "@/utils/numbers";

export function calculateSprintsNeeded(currentWeightKg: number, goalWeightKg: number, weeklyLossTargetKg: number, sprintLengthDays: number) {
  const loss = Math.max(0, currentWeightKg - goalWeightKg);
  const weeks = weeklyLossTargetKg > 0 ? Math.ceil(loss / weeklyLossTargetKg) : 0;
  return Math.max(1, Math.ceil((weeks * 7) / sprintLengthDays));
}

function getPhase(index: number, total: number): SprintPhase {
  const pct = index / total;
  if (pct <= 0.2) return "foundation";
  if (pct <= 0.45) return "build";
  if (pct <= 0.7) return "capacity";
  if (pct < 1) return "refine";
  return "maintain";
}

export function generateRoadmap(profile: Profile): Roadmap {
  const assessment = buildBodyAssessment(profile.currentWeightKg, profile.heightCm, profile.goalWeightKg);
  const calorie = calculateCalorieTarget(profile);
  const weeklyLossTargetKg = Math.max(0.2, estimateWeeklyWeightLoss(calorie.deficit));
  const estimatedSprints = calculateSprintsNeeded(profile.currentWeightKg, assessment.goalWeightKg, weeklyLossTargetKg, profile.sprintLengthDays);
  const totalLoss = Math.max(0, profile.currentWeightKg - assessment.goalWeightKg);
  const sprints = Array.from({ length: estimatedSprints }, (_, idx) => {
    const sprintNumber = idx + 1;
    const targetLoss = totalLoss * (sprintNumber / estimatedSprints);
    const targetWeightKg = round(profile.currentWeightKg - targetLoss, 1);
    return {
      sprintNumber,
      phase: getPhase(sprintNumber, estimatedSprints),
      targetWeightKg,
      milestone: sprintNumber === 1 ? `First milestone: ${assessment.firstMilestoneKg} kg` : undefined
    };
  });

  return {
    id: createId("roadmap"),
    currentWeightKg: profile.currentWeightKg,
    goalWeightKg: assessment.goalWeightKg,
    totalWeightToReduceKg: round(totalLoss, 1),
    weeklyLossTargetKg,
    estimatedWeeks: Math.ceil((estimatedSprints * profile.sprintLengthDays) / 7),
    estimatedSprints,
    sprints,
    createdAt: nowISO()
  };
}

export function buildNutritionTarget(profile: Profile, sprintNumber: number, startDate: string): NutritionTarget {
  const calorie = calculateCalorieTarget(profile);
  const macros = buildMacroTarget(profile, calorie.calories);
  return {
    id: `nutrition_week_${sprintNumber}`,
    startDate,
    endDate: addDaysISO(startDate, profile.sprintLengthDays - 1),
    calories: calorie.calories,
    ...macros,
    waterMl: calculateWaterTarget(profile.currentWeightKg),
    source: "generated",
    warnings: calorie.warnings
  };
}

export function buildExercisePlan(profile: Profile, sprintId: string, sprintNumber: number): ExercisePlan {
  const walkingLevel = Math.min(6, getInitialWalkingLevel(profile) + Math.floor((sprintNumber - 1) / 3));
  const cyclingLevel = Math.min(6, getInitialCyclingLevel(profile) + Math.floor((sprintNumber - 1) / 4));
  return {
    id: `exercise_week_${sprintNumber}`,
    sprintId,
    walking: generateWalkingPlan(walkingLevel, sprintNumber),
    cycling: generateCyclingPlan(cyclingLevel, sprintNumber)
  };
}

export function generateSprintTasks(sprint: Sprint, templates: TaskTemplate[]): SprintTask[] {
  const wanted = ["walking", "cycling", "water", "protein", "home_food"];
  return templates
    .filter((template) => wanted.includes(template.category))
    .slice(0, 5)
    .map((template) => ({
      id: `task_${template.id}_${sprint.weekNumber}`,
      templateId: template.id,
      sprintId: sprint.id,
      title: template.title,
      category: template.category,
      points: template.points,
      estimatedMinutes: template.estimatedMinutes,
      targetCount: template.frequency.target,
      completedCount: 0,
      status: "todo",
      definitionOfDone: template.definitionOfDone,
      fallback: template.fallback
    }));
}

export function generateSprint(profile: Profile, sprintNumber: number, templates: TaskTemplate[], previousVelocity?: number, startDateOverride?: string) {
  const roadmap = generateRoadmap(profile);
  const roadmapSprint = roadmap.sprints[Math.min(sprintNumber - 1, roadmap.sprints.length - 1)];
  const startDate = startDateOverride ?? todayISO();
  const sprintId = `sprint_${String(sprintNumber).padStart(3, "0")}`;
  const nutritionTarget = buildNutritionTarget(profile, sprintNumber, startDate);
  const exercisePlan = buildExercisePlan(profile, sprintId, sprintNumber);
  const plannedPoints = previousVelocity ? Math.max(8, Math.round(previousVelocity * 1.1)) : 12;
  const sprint: Sprint = {
    id: sprintId,
    weekNumber: sprintNumber,
    name: `${roadmapSprint.phase[0].toUpperCase()}${roadmapSprint.phase.slice(1)} Week ${sprintNumber}`,
    goal: "Build consistency with movement, home food, water, and one nutrition focus.",
    phase: roadmapSprint.phase,
    startDate,
    endDate: addDaysISO(startDate, profile.sprintLengthDays - 1),
    targetWeightKg: roadmapSprint.targetWeightKg,
    plannedPoints,
    completedPoints: 0,
    nutritionTargetId: nutritionTarget.id,
    exercisePlanId: exercisePlan.id,
    taskIds: [],
    status: sprintNumber === 1 ? "active" : "planned"
  };
  const tasks = generateSprintTasks(sprint, templates);
  sprint.taskIds = tasks.map((task) => task.id);
  return { roadmap, sprint, tasks, nutritionTarget, exercisePlan };
}

export function adjustSprintByVelocity(sprint: Sprint, velocity: number): Sprint {
  if (velocity > 0 && sprint.plannedPoints > velocity * 1.25) {
    return { ...sprint, plannedPoints: Math.round(velocity * 1.15) };
  }
  return sprint;
}

export function createRecoverySprint(profile: Profile, templates: TaskTemplate[]) {
  const generated = generateSprint(profile, 1, templates, 8);
  return {
    ...generated,
    sprint: {
      ...generated.sprint,
      name: "Recovery Week",
      goal: "Protect consistency with the smallest useful habits.",
      phase: "foundation" as SprintPhase,
      plannedPoints: 8
    }
  };
}
