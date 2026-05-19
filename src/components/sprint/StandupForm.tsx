import { useState } from "react";
import { View } from "react-native";
import { AppButton } from "@/components/common/AppButton";
import { AppTextInput } from "@/components/common/AppTextInput";
import { DailyCheckIn } from "@/domain/models";
import { spacing } from "@/theme/spacing";

interface Props {
  sprintId: string;
  onSubmit: (checkin: Omit<DailyCheckIn, "id" | "date">) => void;
}

export function StandupForm({ sprintId, onSubmit }: Props) {
  const [yesterday, setYesterday] = useState("");
  const [today, setToday] = useState("");
  const [blockers, setBlockers] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [fiber, setFiber] = useState("");
  const [water, setWater] = useState("");
  const [minimumAction, setMinimumAction] = useState("");

  function handleSubmit() {
    onSubmit({
      sprintId,
      yesterday,
      today: minimumAction ? `${today} Minimum action: ${minimumAction}` : today,
      blockers: blockers.split(",").map((item) => item.trim()).filter(Boolean),
      caloriesActual: calories ? Number(calories) : undefined,
      proteinActualGrams: protein ? Number(protein) : undefined,
      carbsActualGrams: carbs ? Number(carbs) : undefined,
      fatActualGrams: fat ? Number(fat) : undefined,
      fiberActualGrams: fiber ? Number(fiber) : undefined,
      waterActualMl: water ? Number(water) : undefined,
      taskUpdates: []
    });
    setYesterday("");
    setToday("");
    setBlockers("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setFiber("");
    setWater("");
    setMinimumAction("");
  }

  return (
    <View style={{ gap: spacing.md }}>
      <AppTextInput label="Yesterday" value={yesterday} onChangeText={setYesterday} placeholder="What happened?" />
      <AppTextInput label="Today" value={today} onChangeText={setToday} placeholder="Small next action" />
      <AppTextInput label="Minimum action" value={minimumAction} onChangeText={setMinimumAction} placeholder="Walk 5 minutes or drink water" />
      <AppTextInput label="Blockers" value={blockers} onChangeText={setBlockers} placeholder="no_time, low_energy" />
      <AppTextInput label="Calories actual" keyboardType="numeric" value={calories} onChangeText={setCalories} placeholder="1900" />
      <AppTextInput label="Protein actual g" keyboardType="numeric" value={protein} onChangeText={setProtein} placeholder="115" />
      <AppTextInput label="Carbs actual g" keyboardType="numeric" value={carbs} onChangeText={setCarbs} placeholder="190" />
      <AppTextInput label="Fat actual g" keyboardType="numeric" value={fat} onChangeText={setFat} placeholder="60" />
      <AppTextInput label="Fiber actual g" keyboardType="numeric" value={fiber} onChangeText={setFiber} placeholder="25" />
      <AppTextInput label="Water actual ml" keyboardType="numeric" value={water} onChangeText={setWater} placeholder="2500" />
      <AppButton
        label="Save check-in"
        onPress={handleSubmit}
      />
    </View>
  );
}
