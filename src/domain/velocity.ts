import { Sprint } from "@/domain/models";
import { round } from "@/utils/numbers";

export function calculateSprintVelocity(sprint: Sprint) {
  return sprint.completedPoints;
}

export function getCompletionRate(sprint: Sprint) {
  if (sprint.plannedPoints <= 0) return 0;
  return round(sprint.completedPoints / sprint.plannedPoints, 2);
}

export function calculateRollingVelocity(sprints: Sprint[], windowSize = 3) {
  const completed = sprints.filter((sprint) => sprint.status === "completed").slice(-windowSize);
  if (completed.length === 0) return 0;
  return round(completed.reduce((sum, sprint) => sum + calculateSprintVelocity(sprint), 0) / completed.length, 0);
}

export function getRecommendedPointBudget(previousSprints: Sprint[]) {
  const velocity = calculateRollingVelocity(previousSprints);
  if (velocity === 0) return 12;
  return Math.max(6, Math.round(velocity * 1.15));
}
