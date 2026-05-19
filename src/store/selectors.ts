import { AppData } from "@/domain/models";

export function selectActiveSprint(data: Pick<AppData, "sprints" | "settings">) {
  return data.sprints.find((sprint) => sprint.id === data.settings.selectedSprintId) ?? data.sprints.find((sprint) => sprint.status === "active");
}

export function selectTasksForSprint(data: Pick<AppData, "tasks">, sprintId?: string) {
  return data.tasks.filter((task) => task.sprintId === sprintId);
}

export function selectTodayNutrition(data: Pick<AppData, "nutritionTargets" | "settings" | "sprints">) {
  const sprint = selectActiveSprint(data);
  return data.nutritionTargets.find((target) => target.id === sprint?.nutritionTargetId);
}
