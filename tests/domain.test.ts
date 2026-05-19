import assert from "assert";
import { buildBodyAssessment, calculateBMI, getHealthyWeightRange } from "../src/domain/bmi";
import { applyCalorieSafetyBounds, estimateWeeklyWeightLoss } from "../src/domain/caloriePlanner";
import { buildMacroTarget } from "../src/domain/macroPlanner";
import { calculateWaterTarget } from "../src/domain/waterPlanner";
import { generateRoadmap } from "../src/domain/sprintPlanner";
import { Profile } from "../src/domain/models";

const profile: Profile = {
  id: "user_test",
  name: "Parth",
  age: 34,
  sex: "male",
  heightCm: 175,
  currentWeightKg: 92,
  goalWeightKg: 78,
  activityLevel: "light",
  preferredPace: "standard",
  sprintLengthDays: 7,
  units: "metric",
  walkingDays: 4,
  cyclingDays: 3,
  hasIndoorBike: true,
  remindersEnabled: false,
  healthAcknowledged: true,
  createdAt: "2026-05-19T00:00:00.000Z",
  updatedAt: "2026-05-19T00:00:00.000Z"
};

assert.equal(calculateBMI(92, 175), 30);
assert.deepEqual(getHealthyWeightRange(175), { minKg: 56.7, maxKg: 76.3 });

const assessment = buildBodyAssessment(92, 175, 50);
assert.equal(assessment.goalWeightKg, 56.7);
assert.ok(assessment.warning);

assert.equal(applyCalorieSafetyBounds(1200, { sex: "male" }).calories, 1500);
assert.equal(buildMacroTarget(profile, 1900).proteinGrams, 109);
assert.equal(calculateWaterTarget(92), 3036);

const roadmap = generateRoadmap(profile);
assert.ok(roadmap.estimatedSprints > 1);
assert.equal(roadmap.sprints[0].phase, "foundation");
assert.equal(estimateWeeklyWeightLoss(450), 0.41);

console.log("Domain smoke tests passed.");
