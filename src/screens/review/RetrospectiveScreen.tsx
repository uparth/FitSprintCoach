import { useState } from "react";
import { ScrollView, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/app/navigation/RootNavigator";
import { AppButton } from "@/components/common/AppButton";
import { AppCard } from "@/components/common/AppCard";
import { AppTextInput } from "@/components/common/AppTextInput";
import { EmptyState } from "@/components/common/EmptyState";
import { getRetroRecommendation } from "@/domain/scrumMasterRules";
import { screenStyles } from "@/screens/styles";
import { selectActiveSprint } from "@/store/selectors";
import { useAppStore } from "@/store/useAppStore";

function splitList(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

type Props = NativeStackScreenProps<RootStackParamList, "Retrospective">;

export function RetrospectiveScreen({ navigation }: Props) {
  const state = useAppStore();
  const sprint = selectActiveSprint(state);
  const [worked, setWorked] = useState("");
  const [didNotWork, setDidNotWork] = useState("");
  const [blockers, setBlockers] = useState("");
  const [keep, setKeep] = useState("");
  const [change, setChange] = useState("");

  if (!sprint) return <EmptyState text="No active sprint to close." />;
  const sprintCheckins = state.checkins.filter((checkin) => checkin.sprintId === sprint.id);

  return (
    <ScrollView style={screenStyles.screen} contentContainerStyle={screenStyles.content}>
      <Text style={screenStyles.title}>Retrospective</Text>
      <AppCard>
        <AppTextInput label="Worked" value={worked} onChangeText={setWorked} placeholder="walking after dinner" />
        <AppTextInput label="Did not work" value={didNotWork} onChangeText={setDidNotWork} placeholder="cycling at night" />
        <AppTextInput label="Blockers" value={blockers} onChangeText={setBlockers} placeholder="late_work, low_energy" />
        <AppTextInput label="Continue" value={keep} onChangeText={setKeep} placeholder="walk after dinner" />
        <AppTextInput label="Change" value={change} onChangeText={setChange} placeholder="cycle before shower" />
      </AppCard>
      <AppButton
        label="Close sprint"
        onPress={async () => {
          await state.addRetrospective({
            sprintId: sprint.id,
            worked: splitList(worked),
            didNotWork: splitList(didNotWork),
            blockers: splitList(blockers),
            continue: splitList(keep),
            change: splitList(change),
            nextSprintRecommendation: getRetroRecommendation(sprint, sprintCheckins)
          });
          navigation.navigate("Main");
        }}
      />
    </ScrollView>
  );
}
