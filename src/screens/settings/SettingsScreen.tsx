import { useState } from "react";
import { Alert, ScrollView, Text } from "react-native";
import { AppButton } from "@/components/common/AppButton";
import { AppCard } from "@/components/common/AppCard";
import { AppTextInput } from "@/components/common/AppTextInput";
import { buildBackupJson, parseBackupJson } from "@/storage/exportImport";
import { useAppStore } from "@/store/useAppStore";
import { screenStyles } from "@/screens/styles";

export function SettingsScreen() {
  const state = useAppStore();
  const [backup, setBackup] = useState("");
  const [message, setMessage] = useState("");
  const profile = state.profile;

  async function handleImport() {
    try {
      await state.importData(parseBackupJson(backup));
      setMessage("Backup imported.");
    } catch {
      setMessage("Import failed. Check that the backup JSON is valid.");
    }
  }

  function confirmReset() {
    Alert.alert("Reset local data?", "This clears the local FitSprint Coach JSON files and returns to onboarding.", [
      { text: "Cancel", style: "cancel" },
      { text: "Reset", style: "destructive", onPress: state.resetData }
    ]);
  }

  return (
    <ScrollView style={screenStyles.screen} contentContainerStyle={screenStyles.content}>
      <Text style={screenStyles.title}>Settings</Text>
      <AppCard>
        <Text style={screenStyles.sectionTitle}>Profile</Text>
        <Text style={screenStyles.body}>{profile?.name ?? "No profile"}</Text>
        <Text style={screenStyles.meta}>{profile ? `${profile.currentWeightKg} kg · goal ${profile.goalWeightKg} kg · ${profile.preferredPace}` : "Complete onboarding first."}</Text>
      </AppCard>
      <AppCard>
        <Text style={screenStyles.sectionTitle}>Data export</Text>
        <AppButton label="Generate backup JSON" variant="secondary" onPress={() => setBackup(buildBackupJson(state))} />
        <AppTextInput label="Backup JSON" multiline value={backup} onChangeText={setBackup} placeholder="Backup JSON appears here or paste one to import" />
        <AppButton label="Import backup JSON" variant="secondary" onPress={handleImport} />
        {message ? <Text style={screenStyles.meta}>{message}</Text> : null}
      </AppCard>
      <AppCard>
        <Text style={screenStyles.sectionTitle}>Disclaimer</Text>
        <Text style={screenStyles.meta}>FitSprint Coach provides general fitness and nutrition estimates. It is not medical advice.</Text>
      </AppCard>
      <AppButton label="Reset local data" variant="danger" onPress={confirmReset} />
    </ScrollView>
  );
}
