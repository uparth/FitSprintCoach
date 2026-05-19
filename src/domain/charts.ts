import { AppData, TaskCategory } from "@/domain/models";

export interface ChartPoint {
  x: string | number;
  y: number;
}

function byXAsc(a: ChartPoint, b: ChartPoint) {
  return String(a.x).localeCompare(String(b.x));
}

export function buildWeightTrend(data: Pick<AppData, "bodyMetrics">): ChartPoint[] {
  return data.bodyMetrics.map((metric) => ({ x: metric.date, y: metric.weightKg })).sort(byXAsc);
}

export function buildBMITrend(data: Pick<AppData, "bodyMetrics">): ChartPoint[] {
  return data.bodyMetrics.map((metric) => ({ x: metric.date, y: metric.bmi })).sort(byXAsc);
}

export function buildVelocityTrend(data: Pick<AppData, "sprints">): ChartPoint[] {
  return data.sprints.map((sprint) => ({ x: sprint.weekNumber, y: sprint.completedPoints }));
}

export function buildPlannedVsCompleted(data: Pick<AppData, "sprints">) {
  return data.sprints.map((sprint) => ({ x: sprint.weekNumber, planned: sprint.plannedPoints, completed: sprint.completedPoints }));
}

export function buildTargetWeightProjection(data: Pick<AppData, "roadmap">): ChartPoint[] {
  return data.roadmap?.sprints.map((sprint) => ({ x: sprint.sprintNumber, y: sprint.targetWeightKg })) ?? [];
}

export function buildPlannedPointsTrend(data: Pick<AppData, "sprints">): ChartPoint[] {
  return data.sprints.map((sprint) => ({ x: sprint.weekNumber, y: sprint.plannedPoints }));
}

export function buildCompletedPointsTrend(data: Pick<AppData, "sprints">): ChartPoint[] {
  return data.sprints.map((sprint) => ({ x: sprint.weekNumber, y: sprint.completedPoints }));
}

function buildExerciseMinutes(data: Pick<AppData, "sprints" | "tasks">, category: TaskCategory): ChartPoint[] {
  return data.sprints.map((sprint) => {
    const minutes = data.tasks
      .filter((task) => task.sprintId === sprint.id && task.category === category)
      .reduce((sum, task) => sum + (task.estimatedMinutes ?? 0) * task.completedCount, 0);
    return { x: sprint.weekNumber, y: minutes };
  });
}

export function buildWalkingMinutes(data: Pick<AppData, "sprints" | "tasks">): ChartPoint[] {
  return buildExerciseMinutes(data, "walking");
}

export function buildCyclingMinutes(data: Pick<AppData, "sprints" | "tasks">): ChartPoint[] {
  return buildExerciseMinutes(data, "cycling");
}

export function buildCaloriesActual(data: Pick<AppData, "checkins">): ChartPoint[] {
  return data.checkins.map((checkin) => ({ x: checkin.date, y: checkin.caloriesActual ?? 0 })).sort(byXAsc);
}

export function buildProteinActual(data: Pick<AppData, "checkins">): ChartPoint[] {
  return data.checkins.map((checkin) => ({ x: checkin.date, y: checkin.proteinActualGrams ?? 0 })).sort(byXAsc);
}

export function buildFiberActual(data: Pick<AppData, "checkins">): ChartPoint[] {
  return data.checkins.map((checkin) => ({ x: checkin.date, y: checkin.fiberActualGrams ?? 0 })).sort(byXAsc);
}

export function buildWaterAdherence(data: Pick<AppData, "checkins">): ChartPoint[] {
  return data.checkins.map((checkin) => ({ x: checkin.date, y: checkin.waterActualMl ?? 0 })).sort(byXAsc);
}
