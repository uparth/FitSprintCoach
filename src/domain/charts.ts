import { AppData } from "@/domain/models";

export interface ChartPoint {
  x: string | number;
  y: number;
}

export function buildWeightTrend(data: Pick<AppData, "bodyMetrics">): ChartPoint[] {
  return data.bodyMetrics.map((metric) => ({ x: metric.date, y: metric.weightKg }));
}

export function buildBMITrend(data: Pick<AppData, "bodyMetrics">): ChartPoint[] {
  return data.bodyMetrics.map((metric) => ({ x: metric.date, y: metric.bmi }));
}

export function buildVelocityTrend(data: Pick<AppData, "sprints">): ChartPoint[] {
  return data.sprints.map((sprint) => ({ x: sprint.weekNumber, y: sprint.completedPoints }));
}

export function buildPlannedVsCompleted(data: Pick<AppData, "sprints">) {
  return data.sprints.map((sprint) => ({ x: sprint.weekNumber, planned: sprint.plannedPoints, completed: sprint.completedPoints }));
}

export function buildWaterAdherence(data: Pick<AppData, "checkins">): ChartPoint[] {
  return data.checkins.map((checkin) => ({ x: checkin.date, y: checkin.waterActualMl ?? 0 }));
}
