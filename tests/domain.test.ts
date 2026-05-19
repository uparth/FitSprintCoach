import assert from "assert";
import { buildBodyAssessment, calculateBMI, getHealthyWeightRange } from "../src/domain/bmi";
import { applyCalorieSafetyBounds, estimateWeeklyWeightLoss } from "../src/domain/caloriePlanner";
import { buildMacroTarget } from "../src/domain/macroPlanner";
import { calculateWaterTarget } from "../src/domain/waterPlanner";
import { generateRoadmap, generateSprint } from "../src/domain/sprintPlanner";
import { getNutritionAdherenceInsight, getSkippedTaskInsights } from "../src/domain/scrumMasterRules";
import { buildBackupJson, parseBackupJson, validateBackupJson } from "../src/storage/exportImport";
import { seedTemplates } from "../src/storage/seedTemplates";
import { AppData, Profile, TaskCategory } from "../src/domain/models";

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

const generatedSprint = generateSprint(profile, 2, seedTemplates, 12, "2026-05-26");
assert.equal(generatedSprint.sprint.startDate, "2026-05-26");
assert.equal(generatedSprint.sprint.endDate, "2026-06-01");
assert.ok(generatedSprint.tasks.some((task) => task.estimatedMinutes));
assert.ok(generatedSprint.tasks.some((task) => task.category === "cycling"));

const noBikeSprint = generateSprint({ ...profile, hasIndoorBike: false, cyclingDays: 0 }, 1, seedTemplates);
assert.equal(noBikeSprint.tasks.some((task) => task.category === "cycling"), false);
assert.ok(noBikeSprint.tasks.some((task) => task.category === "water"));
assert.ok(noBikeSprint.tasks.some((task) => task.category === "protein"));

const templateCategories = new Set(seedTemplates.map((template) => template.category));
["walking", "cycling", "home_food", "calories", "protein", "fiber", "water", "sleep", "mindset", "recovery"].forEach((category) => {
  assert.ok(templateCategories.has(category as TaskCategory));
});

assert.deepEqual(getSkippedTaskInsights([
  { id: "c1", date: "2026-05-19", sprintId: "s1", yesterday: "", today: "", blockers: [], taskUpdates: [{ taskId: "t1", status: "skipped" }] },
  { id: "c2", date: "2026-05-20", sprintId: "s1", yesterday: "", today: "", blockers: [], taskUpdates: [{ taskId: "t1", status: "blocked" }] }
]), ["t1"]);

assert.equal(getNutritionAdherenceInsight([
  { id: "c1", date: "2026-05-19", sprintId: "s1", yesterday: "", today: "", blockers: [], proteinActualGrams: 60, taskUpdates: [] },
  { id: "c2", date: "2026-05-20", sprintId: "s1", yesterday: "", today: "", blockers: [], proteinActualGrams: 70, taskUpdates: [] },
  { id: "c3", date: "2026-05-21", sprintId: "s1", yesterday: "", today: "", blockers: [], proteinActualGrams: 120, taskUpdates: [] }
], generatedSprint.nutritionTarget), "Protein is the weakest link this week. Add one simple protein anchor meal.");

const backupData: AppData = {
  profile,
  bodyMetrics: [],
  nutritionTargets: [generatedSprint.nutritionTarget],
  exercisePlans: [generatedSprint.exercisePlan],
  templates: seedTemplates,
  backlog: [],
  roadmap: generatedSprint.roadmap,
  sprints: [generatedSprint.sprint],
  tasks: generatedSprint.tasks,
  checkins: [],
  retrospectives: [],
  settings: { schemaVersion: 1, hasCompletedOnboarding: true, selectedSprintId: generatedSprint.sprint.id }
};
const backupJson = buildBackupJson(backupData);
assert.equal(parseBackupJson(backupJson).profile?.id, "user_test");
assert.equal(parseBackupJson(JSON.stringify({ ...backupData, settings: { ...backupData.settings, schemaVersion: 0 } })).settings.schemaVersion, 1);
assert.equal(validateBackupJson("{bad json").ok, false);

console.log("Domain smoke tests passed.");
