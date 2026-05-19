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
  const [water, setWater] = useState("");

  return (
    <View style={{ gap: spacing.md }}>
      <AppTextInput label="Yesterday" value={yesterday} onChangeText={setYesterday} placeholder="What happened?" />
      <AppTextInput label="Today" value={today} onChangeText={setToday} placeholder="Small next action" />
      <AppTextInput label="Blockers" value={blockers} onChangeText={setBlockers} placeholder="no_time, low_energy" />
      <AppTextInput label="Water actual ml" keyboardType="numeric" value={water} onChangeText={setWater} placeholder="2500" />
      <AppButton
        label="Save check-in"
        onPress={() => onSubmit({
          sprintId,
          yesterday,
          today,
          blockers: blockers.split(",").map((item) => item.trim()).filter(Boolean),
          waterActualMl: water ? Number(water) : undefined,
          taskUpdates: []
        })}
      />
    </View>
  );
}
