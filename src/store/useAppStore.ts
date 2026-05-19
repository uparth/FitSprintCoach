import { create } from "zustand";
import { AppData, DailyCheckIn, Profile, Retrospective, SprintTask, TaskStatus } from "@/domain/models";
import { buildBodyAssessment } from "@/domain/bmi";
import { generateSprint } from "@/domain/sprintPlanner";
import { calculateBMI } from "@/domain/bmi";
import { emptyAppData, loadAppData, saveAppData } from "@/storage/repositories/appRepository";
import { createId } from "@/utils/ids";
import { nowISO, todayISO } from "@/utils/dates";

interface AppState extends AppData {
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  persist: () => Promise<void>;
  completeOnboarding: (profile: Profile) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  addCheckIn: (checkin: Omit<DailyCheckIn, "id" | "date">) => Promise<void>;
  addRetrospective: (retro: Omit<Retrospective, "id">) => Promise<void>;
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
  addRetrospective: async (retro) => {
    set({
      retrospectives: [{ ...retro, id: createId("retro") }, ...get().retrospectives],
      sprints: get().sprints.map((sprint) => sprint.id === retro.sprintId ? { ...sprint, status: "completed" } : sprint)
    });
    await get().persist();
  },
  importData: async (data) => {
    set({ ...data, isHydrated: true });
    await get().persist();
  },
  resetData: async () => {
    set({ ...emptyAppData, isHydrated: true });
    await get().persist();
  }
}));
