import { ScrollView, Text } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabParamList } from "@/app/navigation/BottomTabs";
import { RootStackParamList } from "@/app/navigation/RootNavigator";
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

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, "Sprint">,
  NativeStackScreenProps<RootStackParamList>
>;

export function SprintScreen({ navigation }: Props) {
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
      <Text style={screenStyles.sectionTitle}>Backlog</Text>
      {state.backlog.length === 0 ? (
        <AppCard>
          <Text style={screenStyles.meta}>No backlog items yet. Add a template below when you want an optional habit ready for planning.</Text>
        </AppCard>
      ) : null}
      {state.backlog.map((task) => (
        <AppCard key={task.id}>
          <Text style={screenStyles.sectionTitle}>{task.title}</Text>
          <Text style={screenStyles.meta}>{task.category} · {task.points} points</Text>
          <AppButton label="Add to current sprint" variant="secondary" onPress={() => state.addBacklogTaskToSprint(task.id)} />
        </AppCard>
      ))}
      <Text style={screenStyles.sectionTitle}>Template library</Text>
      {state.templates.map((template) => (
        <AppCard key={template.id}>
          <Text style={screenStyles.sectionTitle}>{template.title}</Text>
          <Text style={screenStyles.meta}>{template.category} · {template.points} points · {template.frequency.target}x/{template.frequency.type}</Text>
          <Text style={screenStyles.body}>{template.fallback}</Text>
          <AppButton label="Add to backlog" variant="secondary" onPress={() => state.addTemplateToBacklog(template.id)} />
        </AppCard>
      ))}
      <AppButton label="Review sprint" variant="secondary" onPress={() => navigation.navigate("SprintReview")} />
    </ScrollView>
  );
}
