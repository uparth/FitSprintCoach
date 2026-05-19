import { ScrollView, Text } from "react-native";
import { AppCard } from "@/components/common/AppCard";
import { NutritionAdherenceChart } from "@/components/charts/NutritionAdherenceChart";
import { VelocityChart } from "@/components/charts/VelocityChart";
import { WeightChart } from "@/components/charts/WeightChart";
import {
  buildBMITrend,
  buildCaloriesActual,
  buildCompletedPointsTrend,
  buildCyclingMinutes,
  buildFiberActual,
  buildPlannedPointsTrend,
  buildProteinActual,
  buildTargetWeightProjection,
  buildVelocityTrend,
  buildWalkingMinutes,
  buildWaterAdherence,
  buildWeightTrend
} from "@/domain/charts";
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
        <Text style={screenStyles.sectionTitle}>Target projection</Text>
        <WeightChart data={buildTargetWeightProjection(state)} />
      </AppCard>
      <AppCard>
        <Text style={screenStyles.sectionTitle}>Sprint velocity</Text>
        <VelocityChart data={buildVelocityTrend(state)} />
      </AppCard>
      <AppCard>
        <Text style={screenStyles.sectionTitle}>Planned points</Text>
        <VelocityChart data={buildPlannedPointsTrend(state)} />
      </AppCard>
      <AppCard>
        <Text style={screenStyles.sectionTitle}>Completed points</Text>
        <VelocityChart data={buildCompletedPointsTrend(state)} />
      </AppCard>
      <AppCard>
        <Text style={screenStyles.sectionTitle}>Walking minutes</Text>
        <VelocityChart data={buildWalkingMinutes(state)} />
      </AppCard>
      <AppCard>
        <Text style={screenStyles.sectionTitle}>Cycling minutes</Text>
        <VelocityChart data={buildCyclingMinutes(state)} />
      </AppCard>
      <AppCard>
        <Text style={screenStyles.sectionTitle}>Calories actual</Text>
        <NutritionAdherenceChart data={buildCaloriesActual(state)} />
      </AppCard>
      <AppCard>
        <Text style={screenStyles.sectionTitle}>Protein actual</Text>
        <NutritionAdherenceChart data={buildProteinActual(state)} />
      </AppCard>
      <AppCard>
        <Text style={screenStyles.sectionTitle}>Fiber actual</Text>
        <NutritionAdherenceChart data={buildFiberActual(state)} />
      </AppCard>
      <AppCard>
        <Text style={screenStyles.sectionTitle}>Water adherence</Text>
        <NutritionAdherenceChart data={buildWaterAdherence(state)} />
      </AppCard>
    </ScrollView>
  );
}
