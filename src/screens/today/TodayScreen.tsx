import { ScrollView, Text } from "react-native";
import { AppCard } from "@/components/common/AppCard";
import { EmptyState } from "@/components/common/EmptyState";
import { MacroTargetRow } from "@/components/health/MacroTargetRow";
import { WaterTargetCard } from "@/components/health/WaterTargetCard";
import { ScrumMasterNote } from "@/components/sprint/ScrumMasterNote";
import { StandupForm } from "@/components/sprint/StandupForm";
import { TaskCard } from "@/components/sprint/TaskCard";
import { getDailyCoachNote } from "@/domain/scrumMasterRules";
import { screenStyles } from "@/screens/styles";
import { selectActiveSprint, selectTasksForSprint, selectTodayNutrition } from "@/store/selectors";
import { useAppStore } from "@/store/useAppStore";
import { todayISO } from "@/utils/dates";

export function TodayScreen() {
  const state = useAppStore();
  const sprint = selectActiveSprint(state);
  const tasks = selectTasksForSprint(state, sprint?.id);
  const nutrition = selectTodayNutrition(state);
  const note = getDailyCoachNote(todayISO(), sprint, state.checkins);

  if (!sprint) return <EmptyState text="No active sprint yet." />;

  return (
    <ScrollView style={screenStyles.screen} contentContainerStyle={screenStyles.content}>
      <Text style={screenStyles.title}>Today</Text>
      <ScrumMasterNote note={note} />
      <AppCard>
        <Text style={screenStyles.sectionTitle}>Daily standup</Text>
        <StandupForm sprintId={sprint.id} onSubmit={state.addCheckIn} />
      </AppCard>
      {nutrition ? (
        <AppCard>
          <Text style={screenStyles.sectionTitle}>Nutrition targets</Text>
          <MacroTargetRow label="Calories" value={`${nutrition.calories} kcal`} />
          <MacroTargetRow label="Protein" value={`${nutrition.proteinGrams} g`} />
          <MacroTargetRow label="Carbs" value={`${nutrition.carbsGrams} g`} />
          <MacroTargetRow label="Fat" value={`${nutrition.fatGrams} g`} />
          <MacroTargetRow label="Fiber" value={`${nutrition.fiberGrams} g`} />
        </AppCard>
      ) : null}
      {nutrition ? <WaterTargetCard waterMl={nutrition.waterMl} /> : null}
      <Text style={screenStyles.sectionTitle}>Sprint tasks</Text>
      {tasks.map((task) => <TaskCard key={task.id} task={task} onStatus={(status) => state.updateTaskStatus(task.id, status)} />)}
    </ScrollView>
  );
}
