import { ScrollView, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/core/navigation/RootNavigator";
import { AppButton } from "@/components/common/AppButton";
import { AppCard } from "@/components/common/AppCard";
import { EmptyState } from "@/components/common/EmptyState";
import { getRetroRecommendation } from "@/domain/scrumMasterRules";
import { getCompletionRate } from "@/domain/velocity";
import { screenStyles } from "@/screens/styles";
import { selectActiveSprint } from "@/store/selectors";
import { useAppStore } from "@/store/useAppStore";

type Props = NativeStackScreenProps<RootStackParamList, "SprintReview">;

export function SprintReviewScreen({ navigation }: Props) {
  const state = useAppStore();
  const sprint = selectActiveSprint(state);
  if (!sprint) return <EmptyState text="No active sprint to review." />;
  const sprintCheckins = state.checkins.filter((checkin) => checkin.sprintId === sprint.id);

  return (
    <ScrollView style={screenStyles.screen} contentContainerStyle={screenStyles.content}>
      <Text style={screenStyles.title}>Sprint Review</Text>
      <AppCard>
        <Text style={screenStyles.sectionTitle}>{sprint.name}</Text>
        <Text style={screenStyles.body}>{sprint.completedPoints}/{sprint.plannedPoints} points complete</Text>
        <Text style={screenStyles.meta}>Completion: {Math.round(getCompletionRate(sprint) * 100)}%</Text>
        <Text style={screenStyles.meta}>Check-ins: {sprintCheckins.length}</Text>
      </AppCard>
      <AppCard>
        <Text style={screenStyles.sectionTitle}>Recommendation</Text>
        <Text style={screenStyles.body}>{getRetroRecommendation(sprint, sprintCheckins)}</Text>
      </AppCard>
      <AppButton label="Start retrospective" onPress={() => navigation.navigate("Retrospective")} />
    </ScrollView>
  );
}
