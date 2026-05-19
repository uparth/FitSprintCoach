import { create } from "zustand";
import { AppData, DailyCheckIn, Profile, Retrospective, SprintTask, TaskStatus } from "@/domain/models";
import { buildBodyAssessment } from "@/domain/bmi";
import { generateSprint } from "@/domain/sprintPlanner";
import { calculateBMI } from "@/domain/bmi";
import { calculateRollingVelocity } from "@/domain/velocity";
import { emptyAppData, loadAppData, saveAppData } from "@/storage/repositories/appRepository";
import { migrateAppData } from "@/storage/migrations";
import { createId } from "@/utils/ids";
import { addDaysISO, nowISO, todayISO } from "@/utils/dates";

interface AppState extends AppData {
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  persist: () => Promise<void>;
  completeOnboarding: (profile: Profile) => Promise<void>;
  updateProfile: (profile: Profile) => Promise<void>;
  addWeightEntry: (weightKg: number, note?: string) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  addCheckIn: (checkin: Omit<DailyCheckIn, "id" | "date">) => Promise<void>;
  addRetrospective: (retro: Omit<Retrospective, "id">) => Promise<void>;
  addTemplateToBacklog: (templateId: string) => Promise<void>;
  addBacklogTaskToSprint: (taskId: string) => Promise<void>;
  importData: (data: AppData) => Promise<void>;
  resetData: () => Promise<void>;
}

function snapshot(state: AppState): AppData {
  return {
    profile: state.profile,
    bodyMetrics: state.bodyMetrics,
    nutritionTargets: state.nutritionTargets,
    exercisePlans: state.exercisePlans,
    templates: state.templates,
    backlog: state.backlog,
    roadmap: state.roadmap,
    sprints: state.sprints,
    tasks: state.tasks,
    checkins: state.checkins,
    retrospectives: state.retrospectives,
    settings: state.settings
  };
}

function replaceOrAppendById<T extends { id: string }>(items: T[], nextItem: T, id?: string) {
  const index = items.findIndex((item) => item.id === id || item.id === nextItem.id);
  if (index === -1) return [...items, nextItem];
  return items.map((item, itemIndex) => itemIndex === index ? nextItem : item);
}

export const useAppStore = create<AppState>((set, get) => ({
  ...emptyAppData,
  isHydrated: false,
  hydrate: async () => {
    const data = await loadAppData();
    set({ ...data, isHydrated: true });
  },
  persist: async () => {
    await saveAppData(snapshot(get()));
  },
  completeOnboarding: async (profileInput) => {
    const assessment = buildBodyAssessment(profileInput.currentWeightKg, profileInput.heightCm, profileInput.goalWeightKg);
    const profile: Profile = {
      ...profileInput,
      goalWeightKg: assessment.goalWeightKg,
      updatedAt: nowISO()
    };
    const generated = generateSprint(profile, 1, get().templates);
    const next: Partial<AppState> = {
      profile,
      bodyMetrics: [
        {
          id: `metric_${todayISO()}`,
          date: todayISO(),
          weightKg: profile.currentWeightKg,
          bmi: calculateBMI(profile.currentWeightKg, profile.heightCm),
          waistCm: null,
          note: "Initial entry"
        }
      ],
      roadmap: generated.roadmap,
      sprints: [generated.sprint],
      tasks: generated.tasks,
      nutritionTargets: [generated.nutritionTarget],
      exercisePlans: [generated.exercisePlan],
      settings: { schemaVersion: 1, hasCompletedOnboarding: true, selectedSprintId: generated.sprint.id }
    };
    set(next);
    await get().persist();
  },
  updateProfile: async (profileInput) => {
    const assessment = buildBodyAssessment(profileInput.currentWeightKg, profileInput.heightCm, profileInput.goalWeightKg);
    const profile: Profile = {
      ...profileInput,
      goalWeightKg: assessment.goalWeightKg,
      updatedAt: nowISO()
    };
    const activeSprint = get().sprints.find((sprint) => sprint.id === get().settings.selectedSprintId);
    const nextSprintNumber = activeSprint?.weekNumber ?? 1;
    const generated = generateSprint(profile, nextSprintNumber, get().templates, undefined, activeSprint?.startDate);
    set({
      profile,
      roadmap: generated.roadmap,
      nutritionTargets: replaceOrAppendById(get().nutritionTargets, generated.nutritionTarget, activeSprint?.nutritionTargetId),
      exercisePlans: replaceOrAppendById(get().exercisePlans, generated.exercisePlan, activeSprint?.exercisePlanId)
    });
    await get().persist();
  },
  addWeightEntry: async (weightKg, note) => {
    const profile = get().profile;
    if (!profile) return;
    const date = todayISO();
    const updatedProfile: Profile = {
      ...profile,
      currentWeightKg: weightKg,
      updatedAt: nowISO()
    };
    const entry = {
      id: `metric_${date}_${Date.now()}`,
      date,
      weightKg,
      bmi: calculateBMI(weightKg, profile.heightCm),
      waistCm: null,
      note
    };
    const generatedRoadmap = generateSprint(updatedProfile, 1, get().templates).roadmap;
    set({
      profile: updatedProfile,
      roadmap: generatedRoadmap,
      bodyMetrics: [entry, ...get().bodyMetrics]
    });
    await get().persist();
  },
  updateTaskStatus: async (taskId, status) => {
    const tasks = get().tasks.map((task) => {
      if (task.id !== taskId) return task;
      const completedCount = status === "done" ? task.targetCount : task.completedCount;
      return { ...task, status, completedCount };
    });
    const activeSprint = get().sprints.find((sprint) => sprint.id === get().settings.selectedSprintId);
    const completedPoints = activeSprint
      ? tasks.filter((task) => activeSprint.taskIds.includes(task.id) && task.status === "done").reduce((sum, task) => sum + task.points, 0)
      : 0;
    const sprints = get().sprints.map((sprint) => sprint.id === activeSprint?.id ? { ...sprint, completedPoints } : sprint);
    set({ tasks, sprints });
    await get().persist();
  },
  addCheckIn: async (checkin) => {
    const fullCheckin: DailyCheckIn = { ...checkin, id: createId("checkin"), date: todayISO() };
    set({ checkins: [fullCheckin, ...get().checkins] });
    await get().persist();
  },
  addTemplateToBacklog: async (templateId) => {
    const template = get().templates.find((item) => item.id === templateId);
    if (!template) return;
    const task: SprintTask = {
      id: createId("backlog_task"),
      templateId: template.id,
      sprintId: "backlog",
      title: template.title,
      category: template.category,
      points: template.points,
      estimatedMinutes: template.estimatedMinutes,
      targetCount: template.frequency.target,
      completedCount: 0,
      status: "todo",
      definitionOfDone: template.definitionOfDone,
      fallback: template.fallback
    };
    set({ backlog: [task, ...get().backlog] });
    await get().persist();
  },
  addBacklogTaskToSprint: async (taskId) => {
    const sprint = get().sprints.find((item) => item.id === get().settings.selectedSprintId);
    const backlogTask = get().backlog.find((task) => task.id === taskId);
    if (!sprint || !backlogTask) return;
    const task: SprintTask = {
      ...backlogTask,
      id: createId("task"),
      sprintId: sprint.id,
      completedCount: 0,
      status: "todo"
    };
    set({
      backlog: get().backlog.filter((item) => item.id !== taskId),
      tasks: [...get().tasks, task],
      sprints: get().sprints.map((item) =>
        item.id === sprint.id
          ? { ...item, taskIds: [...item.taskIds, task.id], plannedPoints: item.plannedPoints + task.points }
          : item
      )
    });
    await get().persist();
  },
  addRetrospective: async (retro) => {
    const profile = get().profile;
    const closedSprint = get().sprints.find((sprint) => sprint.id === retro.sprintId);
    const completedSprints = get().sprints.map((sprint) => sprint.id === retro.sprintId ? { ...sprint, status: "completed" as const } : sprint);
    const velocity = calculateRollingVelocity(completedSprints);
    const nextSprintNumber = completedSprints.length + 1;
    const nextStartDate = closedSprint ? addDaysISO(closedSprint.endDate, 1) : undefined;
    const generated = profile ? generateSprint(profile, nextSprintNumber, get().templates, velocity || undefined, nextStartDate) : undefined;
    set({
      retrospectives: [{ ...retro, id: createId("retro") }, ...get().retrospectives],
      roadmap: generated?.roadmap ?? get().roadmap,
      sprints: generated ? [...completedSprints, generated.sprint] : completedSprints,
      tasks: generated ? [...get().tasks, ...generated.tasks] : get().tasks,
      nutritionTargets: generated ? [...get().nutritionTargets, generated.nutritionTarget] : get().nutritionTargets,
      exercisePlans: generated ? [...get().exercisePlans, generated.exercisePlan] : get().exercisePlans,
      settings: generated ? { ...get().settings, selectedSprintId: generated.sprint.id } : get().settings
    });
    await get().persist();
  },
  importData: async (data) => {
    set({ ...migrateAppData(data), isHydrated: true });
    await get().persist();
  },
  resetData: async () => {
    set({ ...emptyAppData, isHydrated: true });
    await get().persist();
  }
}));
