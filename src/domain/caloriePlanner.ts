import { ActivityLevel, Pace, Profile } from "@/domain/models";
import { round } from "@/utils/numbers";

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9
};

export function calculateBMR(profile: Pick<Profile, "sex" | "heightCm" | "age" | "currentWeightKg">) {
  const base = 10 * profile.currentWeightKg + 6.25 * profile.heightCm - 5 * profile.age;
  return round(profile.sex === "male" ? base + 5 : base - 161, 0);
}

export function calculateTDEE(profile: Pick<Profile, "activityLevel" | "sex" | "heightCm" | "age" | "currentWeightKg">) {
  return round(calculateBMR(profile) * activityMultipliers[profile.activityLevel], 0);
}

export function getDeficitForPace(preferredPace: Pace) {
  if (preferredPace === "gentle") return 250;
  if (preferredPace === "ambitious") return 650;
  return 450;
}

export function applyCalorieSafetyBounds(target: number, profile: Pick<Profile, "sex" | "minimumCalories">) {
  const defaultMinimum = profile.sex === "male" ? 1500 : 1200;
  const minimum = profile.minimumCalories ?? defaultMinimum;
  if (target < minimum) {
    return {
      calories: minimum,
      warning: `Calorie target was clamped to ${minimum} kcal/day for safety. Timeline may be longer.`
    };
  }
  return { calories: round(target, 0), warning: undefined };
}

export function calculateCalorieTarget(profile: Profile) {
  const tdee = calculateTDEE(profile);
  const deficit = getDeficitForPace(profile.preferredPace);
  const bounded = applyCalorieSafetyBounds(tdee - deficit, profile);
  return {
    bmr: calculateBMR(profile),
    tdee,
    deficit,
    calories: bounded.calories,
    warnings: bounded.warning ? [bounded.warning] : []
  };
}

export function estimateWeeklyWeightLoss(deficitPerDay: number) {
  return round((deficitPerDay * 7) / 7700, 2);
}

export function recalculateAfterWeightChange(profile: Profile, newWeightKg: number) {
  return calculateCalorieTarget({ ...profile, currentWeightKg: newWeightKg });
}
