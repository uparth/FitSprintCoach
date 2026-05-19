import { round } from "@/utils/numbers";

export function calculateWaterTarget(weightKg: number) {
  return round(weightKg * 33, 0);
}

export function calculateWorkoutDayWaterTarget(weightKg: number) {
  return calculateWaterTarget(weightKg) + 400;
}
