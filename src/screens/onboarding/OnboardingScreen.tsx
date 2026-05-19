import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AppButton } from "@/components/common/AppButton";
import { AppCard } from "@/components/common/AppCard";
import { AppTextInput } from "@/components/common/AppTextInput";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { BodyMetricCard } from "@/components/health/BodyMetricCard";
import { buildBodyAssessment } from "@/domain/bmi";
import { ActivityLevel, Pace, Profile, Sex } from "@/domain/models";
import { calculateCalorieTarget } from "@/domain/caloriePlanner";
import { buildMacroTarget } from "@/domain/macroPlanner";
import { calculateWaterTarget } from "@/domain/waterPlanner";
import { useAppStore } from "@/store/useAppStore";
import { nowISO } from "@/utils/dates";
import { createId } from "@/utils/ids";
import { screenStyles } from "@/screens/styles";
import { spacing } from "@/theme/spacing";

export function OnboardingScreen() {
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const [name, setName] = useState("Parth");
  const [age, setAge] = useState("34");
  const [sex, setSex] = useState<Sex>("male");
  const [heightCm, setHeightCm] = useState("175");
  const [weightKg, setWeightKg] = useState("92");
  const [goalKg, setGoalKg] = useState("78");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("light");
  const [pace, setPace] = useState<Pace>("standard");
  const [hasIndoorBike, setHasIndoorBike] = useState<"yes" | "no">("yes");

  const profileDraft: Profile = {
    id: createId("user"),
    name,
    age: Number(age) || 34,
    sex,
    heightCm: Number(heightCm) || 175,
    currentWeightKg: Number(weightKg) || 92,
    goalWeightKg: Number(goalKg) || undefined,
    activityLevel,
    preferredPace: pace,
    sprintLengthDays: 7,
    units: "metric",
    walkingDays: 4,
    cyclingDays: hasIndoorBike === "yes" ? 3 : 0,
    hasIndoorBike: hasIndoorBike === "yes",
    remindersEnabled: false,
    healthAcknowledged: true,
    createdAt: nowISO(),
    updatedAt: nowISO()
  };

  const assessment = buildBodyAssessment(profileDraft.currentWeightKg, profileDraft.heightCm, profileDraft.goalWeightKg);
  const calories = calculateCalorieTarget({ ...profileDraft, goalWeightKg: assessment.goalWeightKg });
  const macros = buildMacroTarget({ ...profileDraft, goalWeightKg: assessment.goalWeightKg }, calories.calories);

  return (
    <ScrollView style={screenStyles.screen} contentContainerStyle={screenStyles.content}>
      <Text style={screenStyles.title}>FitSprint Coach</Text>
      <AppCard>
        <Text style={screenStyles.sectionTitle}>Health note</Text>
        <Text style={screenStyles.meta}>
          FitSprint Coach provides general fitness and nutrition estimates. It is not medical advice. Consult a qualified healthcare professional before starting a weight-loss plan if you have a medical condition, are pregnant, have a history of eating disorders, take medication affecting weight or blood sugar, or plan aggressive weight loss.
        </Text>
      </AppCard>

      <View style={styles.form}>
        <AppTextInput label="Name" value={name} onChangeText={setName} />
        <AppTextInput label="Age" keyboardType="numeric" value={age} onChangeText={setAge} />
        <SegmentedControl value={sex} onChange={setSex} options={[{ label: "Male", value: "male" }, { label: "Female", value: "female" }]} />
        <AppTextInput label="Height cm" keyboardType="numeric" value={heightCm} onChangeText={setHeightCm} />
        <AppTextInput label="Current weight kg" keyboardType="numeric" value={weightKg} onChangeText={setWeightKg} />
        <AppTextInput label="Goal weight kg" keyboardType="numeric" value={goalKg} onChangeText={setGoalKg} />
        <SegmentedControl value={activityLevel} onChange={setActivityLevel} options={[{ label: "Light", value: "light" }, { label: "Moderate", value: "moderate" }, { label: "Sedentary", value: "sedentary" }]} />
        <SegmentedControl value={pace} onChange={setPace} options={[{ label: "Gentle", value: "gentle" }, { label: "Standard", value: "standard" }, { label: "Ambitious", value: "ambitious" }]} />
        <SegmentedControl value={hasIndoorBike} onChange={setHasIndoorBike} options={[{ label: "Bike yes", value: "yes" }, { label: "Bike no", value: "no" }]} />
      </View>

      <View style={styles.grid}>
        <BodyMetricCard label="BMI" value={`${assessment.bmi}`} note={assessment.category} />
        <BodyMetricCard label="Healthy range" value={`${assessment.healthyRange.minKg}-${assessment.healthyRange.maxKg} kg`} />
        <BodyMetricCard label="Daily calories" value={`${calories.calories}`} note={calories.warnings[0]} />
        <BodyMetricCard label="Macros" value={`${macros.proteinGrams}P ${macros.carbsGrams}C ${macros.fatGrams}F`} note={`${macros.fiberGrams}g fiber`} />
        <BodyMetricCard label="Water" value={`${calculateWaterTarget(profileDraft.currentWeightKg)} ml`} />
        <BodyMetricCard label="First milestone" value={`${assessment.firstMilestoneKg} kg`} />
      </View>

      <AppButton label="Start first sprint" onPress={() => completeOnboarding({ ...profileDraft, goalWeightKg: assessment.goalWeightKg })} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.md },
  grid: { gap: spacing.md }
});
