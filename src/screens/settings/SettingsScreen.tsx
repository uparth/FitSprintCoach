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
  const [name, setName] = useState(profile?.name ?? "");
  const [age, setAge] = useState(profile?.age ? String(profile.age) : "");
  const [heightCm, setHeightCm] = useState(profile?.heightCm ? String(profile.heightCm) : "");
  const [goalWeightKg, setGoalWeightKg] = useState(profile?.goalWeightKg ? String(profile.goalWeightKg) : "");
  const [weightKg, setWeightKg] = useState(profile?.currentWeightKg ? String(profile.currentWeightKg) : "");
  const [weightNote, setWeightNote] = useState("");

  async function handleProfileSave() {
    if (!profile) return;
    await state.updateProfile({
      ...profile,
      name: name.trim() || profile.name,
      age: Number(age) || profile.age,
      heightCm: Number(heightCm) || profile.heightCm,
      goalWeightKg: Number(goalWeightKg) || profile.goalWeightKg
    });
    setMessage("Profile updated and current targets recalculated.");
  }

  async function handleWeightLog() {
    if (!weightKg) return;
    await state.addWeightEntry(Number(weightKg), weightNote || undefined);
    setMessage("Weight entry saved.");
  }

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
      {profile ? (
        <AppCard>
          <Text style={screenStyles.sectionTitle}>Edit profile</Text>
          <AppTextInput label="Name" value={name} onChangeText={setName} />
          <AppTextInput label="Age" keyboardType="numeric" value={age} onChangeText={setAge} />
          <AppTextInput label="Height cm" keyboardType="numeric" value={heightCm} onChangeText={setHeightCm} />
          <AppTextInput label="Goal weight kg" keyboardType="numeric" value={goalWeightKg} onChangeText={setGoalWeightKg} />
          <AppButton label="Save profile" variant="secondary" onPress={handleProfileSave} />
        </AppCard>
      ) : null}
      {profile ? (
        <AppCard>
          <Text style={screenStyles.sectionTitle}>Log weight</Text>
          <AppTextInput label="Current weight kg" keyboardType="numeric" value={weightKg} onChangeText={setWeightKg} />
          <AppTextInput label="Note" value={weightNote} onChangeText={setWeightNote} placeholder="Optional" />
          <AppButton label="Save weight" variant="secondary" onPress={handleWeightLog} />
        </AppCard>
      ) : null}
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
