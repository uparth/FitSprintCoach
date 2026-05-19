import { ScrollView, Text } from "react-native";
import { AppCard } from "@/components/common/AppCard";
import { EmptyState } from "@/components/common/EmptyState";
import { AppButton } from "@/components/common/AppButton";
import { SprintBoard } from "@/components/sprint/SprintBoard";
import { ScrumMasterNote } from "@/components/sprint/ScrumMasterNote";
import { VelocityBadge } from "@/components/sprint/VelocityBadge";
import { getOvercommitmentNote } from "@/domain/scrumMasterRules";
import { calculateRollingVelocity, getCompletionRate } from "@/domain/velocity";
import { screenStyles } from "@/screens/styles";
import { selectActiveSprint, selectTasksForSprint } from "@/store/selectors";
import { useAppStore } from "@/store/useAppStore";

export function SprintScreen({ navigation }: any) {
  const state = useAppStore();
  const sprint = selectActiveSprint(state);
  const tasks = selectTasksForSprint(state, sprint?.id);
  if (!sprint) return <EmptyState text="No sprint generated yet." />;

  const velocity = calculateRollingVelocity(state.sprints);
  return (
    <ScrollView style={screenStyles.screen} contentContainerStyle={screenStyles.content}>
      <Text style={screenStyles.title}>{sprint.name}</Text>
      <ScrumMasterNote note={getOvercommitmentNote(sprint, velocity)} />
      <AppCard>
        <Text style={screenStyles.sectionTitle}>{sprint.goal}</Text>
        <Text style={screenStyles.meta}>{sprint.startDate} to {sprint.endDate}</Text>
        <Text style={screenStyles.body}>{sprint.completedPoints}/{sprint.plannedPoints} points complete</Text>
        <Text style={screenStyles.meta}>Completion rate: {Math.round(getCompletionRate(sprint) * 100)}%</Text>
        <VelocityBadge points={velocity || sprint.completedPoints} />
      </AppCard>
      <SprintBoard tasks={tasks} onStatus={state.updateTaskStatus} />
      <AppButton label="Review sprint" variant="secondary" onPress={() => navigation.navigate("SprintReview")} />
    </ScrollView>
  );
}
