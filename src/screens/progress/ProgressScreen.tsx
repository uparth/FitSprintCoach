import { ScrollView, Text } from "react-native";
import { AppCard } from "@/components/common/AppCard";
import { SectionHeader } from "@/components/common/SectionHeader";
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
        <SectionHeader title="Weight trend" meta="Recent body metric entries" />
        <WeightChart data={buildWeightTrend(state)} />
      </AppCard>
      <AppCard>
        <SectionHeader title="BMI trend" />
        <WeightChart data={buildBMITrend(state)} />
      </AppCard>
      <AppCard>
        <SectionHeader title="Target projection" meta="Generated roadmap targets" />
        <WeightChart data={buildTargetWeightProjection(state)} />
      </AppCard>
      <AppCard>
        <SectionHeader title="Sprint velocity" />
        <VelocityChart data={buildVelocityTrend(state)} />
      </AppCard>
      <AppCard>
        <SectionHeader title="Planned points" />
        <VelocityChart data={buildPlannedPointsTrend(state)} />
      </AppCard>
      <AppCard>
        <SectionHeader title="Completed points" />
        <VelocityChart data={buildCompletedPointsTrend(state)} />
      </AppCard>
      <AppCard>
        <SectionHeader title="Walking minutes" />
        <VelocityChart data={buildWalkingMinutes(state)} />
      </AppCard>
      <AppCard>
        <SectionHeader title="Cycling minutes" />
        <VelocityChart data={buildCyclingMinutes(state)} />
      </AppCard>
      <AppCard>
        <SectionHeader title="Calories actual" />
        <NutritionAdherenceChart data={buildCaloriesActual(state)} />
      </AppCard>
      <AppCard>
        <SectionHeader title="Protein actual" />
        <NutritionAdherenceChart data={buildProteinActual(state)} />
      </AppCard>
      <AppCard>
        <SectionHeader title="Fiber actual" />
        <NutritionAdherenceChart data={buildFiberActual(state)} />
      </AppCard>
      <AppCard>
        <SectionHeader title="Water adherence" />
        <NutritionAdherenceChart data={buildWaterAdherence(state)} />
      </AppCard>
    </ScrollView>
  );
}
