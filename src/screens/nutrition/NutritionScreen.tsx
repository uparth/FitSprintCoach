import { ScrollView, Text } from "react-native";
import { AppCard } from "@/components/common/AppCard";
import { EmptyState } from "@/components/common/EmptyState";
import { MacroTargetRow } from "@/components/health/MacroTargetRow";
import { WaterTargetCard } from "@/components/health/WaterTargetCard";
import { screenStyles } from "@/screens/styles";
import { selectTodayNutrition } from "@/store/selectors";
import { useAppStore } from "@/store/useAppStore";

export function NutritionScreen() {
  const state = useAppStore();
  const nutrition = selectTodayNutrition(state);
  if (!nutrition) return <EmptyState text="No nutrition target yet." />;

  const weekCheckins = state.checkins.slice(0, 7);
  return (
    <ScrollView style={screenStyles.screen} contentContainerStyle={screenStyles.content}>
      <Text style={screenStyles.title}>Nutrition</Text>
      <AppCard>
        <Text style={screenStyles.sectionTitle}>Daily targets</Text>
        <MacroTargetRow label="Calories" value={`${nutrition.calories} kcal`} />
        <MacroTargetRow label="Protein" value={`${nutrition.proteinGrams} g`} />
        <MacroTargetRow label="Carbs" value={`${nutrition.carbsGrams} g`} />
        <MacroTargetRow label="Fat" value={`${nutrition.fatGrams} g`} />
        <MacroTargetRow label="Fiber" value={`${nutrition.fiberGrams} g`} />
      </AppCard>
      <WaterTargetCard waterMl={nutrition.waterMl} />
      <AppCard>
        <Text style={screenStyles.sectionTitle}>Weekly consistency</Text>
        <Text style={screenStyles.body}>{weekCheckins.length}/7 check-ins recorded this week.</Text>
        <Text style={screenStyles.meta}>Targets are practical guides. Use the closest repeatable version.</Text>
      </AppCard>
    </ScrollView>
  );
}
