import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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
import { colors } from "@/theme/colors";

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
  const [walkingDays, setWalkingDays] = useState("4");
  const [cyclingDays, setCyclingDays] = useState("3");
  const [sprintLengthDays, setSprintLengthDays] = useState("7");
  const [healthAcknowledged, setHealthAcknowledged] = useState(false);

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
    sprintLengthDays: Number(sprintLengthDays) || 7,
    units: "metric",
    walkingDays: Number(walkingDays) || 0,
    cyclingDays: hasIndoorBike === "yes" ? Number(cyclingDays) || 0 : 0,
    hasIndoorBike: hasIndoorBike === "yes",
    remindersEnabled: false,
    healthAcknowledged,
    createdAt: nowISO(),
    updatedAt: nowISO()
  };

  const assessment = buildBodyAssessment(profileDraft.currentWeightKg, profileDraft.heightCm, profileDraft.goalWeightKg);
  const calories = calculateCalorieTarget({ ...profileDraft, goalWeightKg: assessment.goalWeightKg });
  const macros = buildMacroTarget({ ...profileDraft, goalWeightKg: assessment.goalWeightKg }, calories.calories);
  const validationMessage = getValidationMessage(profileDraft);
  const canStart = !validationMessage && healthAcknowledged;

  return (
    <ScrollView style={screenStyles.screen} contentContainerStyle={screenStyles.content}>
      <Text style={screenStyles.title}>FitSprint Coach</Text>
      <AppCard>
        <Text style={screenStyles.sectionTitle}>Health note</Text>
        <Text style={screenStyles.meta}>
          FitSprint Coach provides general fitness and nutrition estimates. It is not medical advice. Consult a qualified healthcare professional before starting a weight-loss plan if you have a medical condition, are pregnant, have a history of eating disorders, take medication affecting weight or blood sugar, or plan aggressive weight loss.
        </Text>
        <Pressable style={styles.acknowledgement} onPress={() => setHealthAcknowledged((value) => !value)}>
          <View style={[styles.checkbox, healthAcknowledged && styles.checkboxChecked]} />
          <Text style={screenStyles.meta}>I understand and want to continue.</Text>
        </Pressable>
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
        <AppTextInput label="Walking days/week" keyboardType="numeric" value={walkingDays} onChangeText={setWalkingDays} />
        <AppTextInput label="Cycling days/week" keyboardType="numeric" value={cyclingDays} onChangeText={setCyclingDays} editable={hasIndoorBike === "yes"} />
        <AppTextInput label="Sprint length days" keyboardType="numeric" value={sprintLengthDays} onChangeText={setSprintLengthDays} />
      </View>

      <View style={styles.grid}>
        <BodyMetricCard label="BMI" value={`${assessment.bmi}`} note={assessment.category} />
        <BodyMetricCard label="Healthy range" value={`${assessment.healthyRange.minKg}-${assessment.healthyRange.maxKg} kg`} />
        <BodyMetricCard label="Weight to reduce" value={`${assessment.weightToReduceKg} kg`} />
        <BodyMetricCard label="Daily calories" value={`${calories.calories}`} note={calories.warnings[0]} />
        <BodyMetricCard label="Macros" value={`${macros.proteinGrams}P ${macros.carbsGrams}C ${macros.fatGrams}F`} note={`${macros.fiberGrams}g fiber`} />
        <BodyMetricCard label="Water" value={`${calculateWaterTarget(profileDraft.currentWeightKg)} ml`} />
        <BodyMetricCard label="First milestone" value={`${assessment.firstMilestoneKg} kg`} />
      </View>

      {validationMessage ? <Text style={styles.warning}>{validationMessage}</Text> : null}
      {!healthAcknowledged ? <Text style={styles.warning}>Please acknowledge the health note before starting.</Text> : null}
      <AppButton label="Start first sprint" variant={canStart ? "primary" : "secondary"} onPress={() => {
        if (canStart) completeOnboarding({ ...profileDraft, goalWeightKg: assessment.goalWeightKg });
      }} />
    </ScrollView>
  );
}

function getValidationMessage(profile: Profile) {
  if (!profile.name.trim()) return "Enter a name or nickname.";
  if (profile.age < 18 || profile.age > 100) return "Enter an adult age between 18 and 100.";
  if (profile.heightCm < 120 || profile.heightCm > 230) return "Enter height in cm between 120 and 230.";
  if (profile.currentWeightKg < 35 || profile.currentWeightKg > 300) return "Enter weight in kg between 35 and 300.";
  if (profile.goalWeightKg && profile.goalWeightKg >= profile.currentWeightKg) return "For weight loss, goal weight should be below current weight.";
  if (profile.sprintLengthDays < 3 || profile.sprintLengthDays > 30) return "Sprint length should be between 3 and 30 days.";
  if (profile.walkingDays < 0 || profile.walkingDays > 7 || profile.cyclingDays < 0 || profile.cyclingDays > 7) return "Exercise days should be between 0 and 7.";
  return undefined;
}

const styles = StyleSheet.create({
  form: { gap: spacing.md },
  grid: { gap: spacing.md },
  acknowledgement: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  checkbox: {
    borderColor: colors.border,
    borderRadius: 4,
    borderWidth: 1,
    height: 18,
    width: 18
  },
  checkboxChecked: { backgroundColor: colors.healthGreen, borderColor: colors.healthGreen },
  warning: { color: colors.softRed, fontSize: 13, lineHeight: 19 }
});
