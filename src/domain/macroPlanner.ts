import { Profile } from "@/domain/models";
import { round } from "@/utils/numbers";

export function calculateProteinTarget(profile: Pick<Profile, "goalWeightKg" | "currentWeightKg">, proteinMultiplier = 1.4) {
  return round((profile.goalWeightKg ?? profile.currentWeightKg) * proteinMultiplier, 0);
}

export function calculateFatTarget(calorieTarget: number, fatRatio = 0.28) {
  return round((calorieTarget * fatRatio) / 9, 0);
}

export function calculateCarbTarget(calorieTarget: number, proteinGrams: number, fatGrams: number) {
  const remainingCalories = calorieTarget - proteinGrams * 4 - fatGrams * 9;
  return round(Math.max(0, remainingCalories / 4), 0);
}

export function calculateFiberTarget(calorieTarget: number) {
  return round(Math.max(25, (calorieTarget / 1000) * 14), 0);
}

export function buildMacroTarget(profile: Profile, calorieTarget: number) {
  const proteinGrams = calculateProteinTarget(profile);
  const fatGrams = calculateFatTarget(calorieTarget);
  const carbsGrams = calculateCarbTarget(calorieTarget, proteinGrams, fatGrams);
  const fiberGrams = calculateFiberTarget(calorieTarget);
  return { proteinGrams, fatGrams, carbsGrams, fiberGrams };
}
