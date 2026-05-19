import { round } from "@/utils/numbers";

export type BMICategory = "underweight" | "healthy" | "overweight" | "obese";

export function calculateBMI(weightKg: number, heightCm: number) {
  const heightMeters = heightCm / 100;
  return round(weightKg / (heightMeters * heightMeters), 1);
}

export function getBMICategory(bmi: number): BMICategory {
  if (bmi < 18.5) return "underweight";
  if (bmi <= 24.9) return "healthy";
  if (bmi <= 29.9) return "overweight";
  return "obese";
}

export function getHealthyWeightRange(heightCm: number) {
  const heightMeters = heightCm / 100;
  return {
    minKg: round(18.5 * heightMeters * heightMeters, 1),
    maxKg: round(24.9 * heightMeters * heightMeters, 1)
  };
}

export function getWeightToReduce(currentWeightKg: number, goalWeightKg: number) {
  return Math.max(0, round(currentWeightKg - goalWeightKg, 1));
}

export function suggestGoalWeight(currentWeightKg: number, heightCm: number, enteredGoalWeightKg?: number) {
  const range = getHealthyWeightRange(heightCm);
  if (enteredGoalWeightKg && enteredGoalWeightKg >= range.minKg && enteredGoalWeightKg <= range.maxKg) {
    return { goalWeightKg: enteredGoalWeightKg, warning: undefined };
  }
  if (enteredGoalWeightKg && enteredGoalWeightKg < range.minKg) {
    return {
      goalWeightKg: range.minKg,
      warning: "Your entered goal is below the healthy BMI range. Use the lower healthy range as a safer target."
    };
  }
  if (currentWeightKg > range.maxKg) return { goalWeightKg: range.maxKg, warning: undefined };
  return {
    goalWeightKg: currentWeightKg,
    warning: "You are already within the healthy BMI range. Focus on maintenance, recomposition, and habits."
  };
}

export function suggestFirstMilestone(currentWeightKg: number, goalWeightKg: number) {
  const fivePercentLoss = currentWeightKg * 0.05;
  const remainingLoss = Math.max(0, currentWeightKg - goalWeightKg);
  const milestoneLoss = Math.min(fivePercentLoss, remainingLoss, 5);
  return round(currentWeightKg - milestoneLoss, 1);
}

export function buildBodyAssessment(currentWeightKg: number, heightCm: number, enteredGoalWeightKg?: number) {
  const bmi = calculateBMI(currentWeightKg, heightCm);
  const healthyRange = getHealthyWeightRange(heightCm);
  const suggested = suggestGoalWeight(currentWeightKg, heightCm, enteredGoalWeightKg);
  return {
    bmi,
    category: getBMICategory(bmi),
    healthyRange,
    goalWeightKg: suggested.goalWeightKg,
    weightToReduceKg: getWeightToReduce(currentWeightKg, suggested.goalWeightKg),
    firstMilestoneKg: suggestFirstMilestone(currentWeightKg, suggested.goalWeightKg),
    warning: suggested.warning
  };
}
