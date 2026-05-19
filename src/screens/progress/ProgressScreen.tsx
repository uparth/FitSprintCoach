import { ScrollView, Text } from "react-native";
import { AppCard } from "@/components/common/AppCard";
import { NutritionAdherenceChart } from "@/components/charts/NutritionAdherenceChart";
import { VelocityChart } from "@/components/charts/VelocityChart";
import { WeightChart } from "@/components/charts/WeightChart";
import { buildBMITrend, buildVelocityTrend, buildWaterAdherence, buildWeightTrend } from "@/domain/charts";
import { screenStyles } from "@/screens/styles";
import { useAppStore } from "@/store/useAppStore";

export function ProgressScreen() {
  const state = useAppStore();
  return (
    <ScrollView style={screenStyles.screen} contentContainerStyle={screenStyles.content}>
      <Text style={screenStyles.title}>Progress</Text>
      <AppCard>
        <Text style={screenStyles.sectionTitle}>Weight trend</Text>
        <WeightChart data={buildWeightTrend(state)} />
      </AppCard>
      <AppCard>
        <Text style={screenStyles.sectionTitle}>BMI trend</Text>
        <WeightChart data={buildBMITrend(state)} />
      </AppCard>
      <AppCard>
        <Text style={screenStyles.sectionTitle}>Sprint velocity</Text>
        <VelocityChart data={buildVelocityTrend(state)} />
      </AppCard>
      <AppCard>
        <Text style={screenStyles.sectionTitle}>Water adherence</Text>
        <NutritionAdherenceChart data={buildWaterAdherence(state)} />
      </AppCard>
    </ScrollView>
  );
}
