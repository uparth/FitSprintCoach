import { DailyCheckIn, NutritionTarget, Sprint } from "@/domain/models";
import { calculateRollingVelocity, getCompletionRate } from "@/domain/velocity";

export function getOvercommitmentNote(sprint: Sprint, velocity: number) {
  if (velocity > 0 && sprint.plannedPoints > velocity * 1.25) {
    return `This sprint looks heavy. Your recent velocity is ${velocity} points. Planning ${sprint.plannedPoints} may be too much.`;
  }
  return "Sprint scope looks realistic. Keep the next action small and clear.";
}

export function getBlockerInsights(checkins: DailyCheckIn[]) {
  const counts = new Map<string, number>();
  checkins.forEach((checkin) => checkin.blockers.forEach((blocker) => counts.set(blocker, (counts.get(blocker) ?? 0) + 1)));
  return Array.from(counts.entries())
    .filter(([, count]) => count >= 3)
    .map(([blocker]) => blocker);
}

export function getSkippedTaskInsights(checkins: DailyCheckIn[]) {
  const counts = new Map<string, number>();
  checkins.forEach((checkin) => {
    checkin.taskUpdates
      .filter((update) => update.status === "skipped" || update.status === "blocked")
      .forEach((update) => counts.set(update.taskId, (counts.get(update.taskId) ?? 0) + 1));
  });
  return Array.from(counts.entries())
    .filter(([, count]) => count >= 2)
    .map(([taskId]) => taskId);
}

export function getNutritionAdherenceInsight(checkins: DailyCheckIn[], target?: NutritionTarget) {
  if (!target) return undefined;
  const recent = checkins.slice(0, 4);
  if (recent.length < 3) return undefined;

  const proteinMisses = recent.filter((checkin) =>
    typeof checkin.proteinActualGrams === "number" && checkin.proteinActualGrams < target.proteinGrams * 0.8
  ).length;
  if (proteinMisses >= 2) return "Protein is the weakest link this week. Add one simple protein anchor meal.";

  const calorieMisses = recent.filter((checkin) =>
    typeof checkin.caloriesActual === "number" && checkin.caloriesActual > target.calories + 200
  ).length;
  if (calorieMisses >= 2) return "Calories are drifting above target. Use a home-food or portion template today.";

  const fiberMisses = recent.filter((checkin) =>
    typeof checkin.fiberActualGrams === "number" && checkin.fiberActualGrams < target.fiberGrams * 0.75
  ).length;
  if (fiberMisses >= 2) return "Fiber has been low. Add fruit, salad, dal, beans, or vegetables to one meal.";

  return undefined;
}

export function getDailyCoachNote(today: string, sprint?: Sprint, checkins: DailyCheckIn[] = [], nutritionTarget?: NutritionTarget) {
  const blockers = getBlockerInsights(checkins);
  if (blockers.length > 0) return `${blockers[0]} keeps showing up. Choose the fallback version today and protect consistency.`;
  const skippedTasks = getSkippedTaskInsights(checkins);
  if (skippedTasks.length > 0) return "One task has been skipped more than once. Use its fallback version today and keep the sprint moving.";
  const nutritionInsight = getNutritionAdherenceInsight(checkins, nutritionTarget);
  if (nutritionInsight) return nutritionInsight;
  if (!sprint) return "Start with the smallest useful action: water, a short walk, or a simple home meal.";
  if (getCompletionRate(sprint) < 0.5 && checkins.length > 2) return "Yesterday is data, not failure. Today, choose the smallest restart action.";
  return `For ${today}, keep it simple: one movement task, water, and one nutrition win.`;
}

export function getRetroRecommendation(sprint: Sprint, checkins: DailyCheckIn[]) {
  const blockers = getBlockerInsights(checkins);
  if (blockers.length > 0) return `${blockers[0]} appeared repeatedly. Reduce scope or move that habit to an easier time next sprint.`;
  const skippedTasks = getSkippedTaskInsights(checkins);
  if (skippedTasks.length > 0) return "A task was skipped repeatedly. Keep the habit, but plan its fallback version first next sprint.";
  const completion = getCompletionRate(sprint);
  if (completion > 0.9) return "You completed most of the sprint. Keep the next sprint similar with one small increase.";
  if (completion < 0.5) return "Make the next sprint smaller and use fallback tasks from day one.";
  return "Keep points similar and adjust the tasks that felt hardest.";
}

export function getNextSprintRecommendation(sprints: Sprint[], checkins: DailyCheckIn[]) {
  const velocity = calculateRollingVelocity(sprints);
  const blockers = getBlockerInsights(checkins);
  if (blockers.length > 0) return `Plan around ${blockers[0]} and keep the point budget near ${velocity || 12}.`;
  return `Use a point budget near ${velocity || 12} and keep the sprint focused on repeatable habits.`;
}
