import { ScrollView, Text } from "react-native";
import { AppCard } from "@/components/common/AppCard";
import { EmptyState } from "@/components/common/EmptyState";
import { ProgressBar } from "@/components/common/ProgressBar";
import { screenStyles } from "@/screens/styles";
import { useAppStore } from "@/store/useAppStore";

export function RoadmapScreen() {
  const roadmap = useAppStore((state) => state.roadmap);
  if (!roadmap) return <EmptyState text="Complete onboarding to generate a roadmap." />;

  return (
    <ScrollView style={screenStyles.screen} contentContainerStyle={screenStyles.content}>
      <Text style={screenStyles.title}>Roadmap</Text>
      <AppCard>
        <Text style={screenStyles.sectionTitle}>{roadmap.currentWeightKg} kg to {roadmap.goalWeightKg} kg</Text>
        <Text style={screenStyles.meta}>{roadmap.totalWeightToReduceKg} kg reduction across about {roadmap.estimatedSprints} sprints.</Text>
        <ProgressBar value={0.04} />
      </AppCard>
      {roadmap.sprints.slice(0, 12).map((sprint) => (
        <AppCard key={sprint.sprintNumber}>
          <Text style={screenStyles.sectionTitle}>Sprint {sprint.sprintNumber}: {sprint.phase}</Text>
          <Text style={screenStyles.body}>Target weight: {sprint.targetWeightKg} kg</Text>
          {sprint.milestone ? <Text style={screenStyles.meta}>{sprint.milestone}</Text> : null}
        </AppCard>
      ))}
    </ScrollView>
  );
}
