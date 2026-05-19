import { DailyCheckIn, Sprint } from "@/domain/models";
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

export function getDailyCoachNote(today: string, sprint?: Sprint, checkins: DailyCheckIn[] = []) {
  const blockers = getBlockerInsights(checkins);
  if (blockers.length > 0) return `${blockers[0]} keeps showing up. Choose the fallback version today and protect consistency.`;
  if (!sprint) return "Start with the smallest useful action: water, a short walk, or a simple home meal.";
  if (getCompletionRate(sprint) < 0.5 && checkins.length > 2) return "Yesterday is data, not failure. Today, choose the smallest restart action.";
  return `For ${today}, keep it simple: one movement task, water, and one nutrition win.`;
}

export function getRetroRecommendation(sprint: Sprint, checkins: DailyCheckIn[]) {
  const blockers = getBlockerInsights(checkins);
  if (blockers.length > 0) return `${blockers[0]} appeared repeatedly. Reduce scope or move that habit to an easier time next sprint.`;
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
