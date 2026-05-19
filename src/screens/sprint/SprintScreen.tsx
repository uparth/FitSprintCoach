import { useMemo, useState } from "react";
import { ScrollView, Text } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabParamList } from "@/core/navigation/BottomTabs";
import { RootStackParamList } from "@/core/navigation/RootNavigator";
import { AppCard } from "@/components/common/AppCard";
import { EmptyState } from "@/components/common/EmptyState";
import { AppButton } from "@/components/common/AppButton";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { SprintBoard } from "@/components/sprint/SprintBoard";
import { ScrumMasterNote } from "@/components/sprint/ScrumMasterNote";
import { VelocityBadge } from "@/components/sprint/VelocityBadge";
import { getOvercommitmentNote } from "@/domain/scrumMasterRules";
import { calculateRollingVelocity, getCompletionRate } from "@/domain/velocity";
import { TaskCategory } from "@/domain/models";
import { screenStyles } from "@/screens/styles";
import { selectActiveSprint, selectTasksForSprint } from "@/store/selectors";
import { useAppStore } from "@/store/useAppStore";

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, "Sprint">,
  NativeStackScreenProps<RootStackParamList>
>;

export function SprintScreen({ navigation }: Props) {
  const state = useAppStore();
  const [templateCategory, setTemplateCategory] = useState<TemplateFilter>("movement");
  const sprint = selectActiveSprint(state);
  const tasks = selectTasksForSprint(state, sprint?.id);
  const visibleTemplates = useMemo(
    () => state.templates.filter((template) => templateGroups[templateCategory].includes(template.category)).slice(0, 6),
    [state.templates, templateCategory]
  );
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
      <SegmentedControl
        value={templateCategory}
        onChange={setTemplateCategory}
        options={[
          { label: "Move", value: "movement" },
          { label: "Food", value: "nutrition" },
          { label: "Reset", value: "recovery" }
        ]}
      />
      {visibleTemplates.map((template) => (
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

type TemplateFilter = "movement" | "nutrition" | "recovery";

const templateGroups: Record<TemplateFilter, TaskCategory[]> = {
  movement: ["walking", "cycling"],
  nutrition: ["home_food", "calories", "protein", "fiber", "water"],
  recovery: ["sleep", "mindset", "recovery"]
};
