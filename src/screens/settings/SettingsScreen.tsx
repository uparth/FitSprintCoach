import { useEffect, useState } from "react";
import { Alert, ScrollView, Text } from "react-native";
import { AppButton } from "@/components/common/AppButton";
import { AppCard } from "@/components/common/AppCard";
import { AppTextInput } from "@/components/common/AppTextInput";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { ActivityLevel, Pace, Sex, Units } from "@/domain/models";
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
  const [sex, setSex] = useState<Sex>(profile?.sex ?? "male");
  const [units, setUnits] = useState<Units>(profile?.units ?? "metric");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(profile?.activityLevel ?? "light");
  const [preferredPace, setPreferredPace] = useState<Pace>(profile?.preferredPace ?? "standard");
  const [sprintLengthDays, setSprintLengthDays] = useState(profile?.sprintLengthDays ? String(profile.sprintLengthDays) : "7");
  const [walkingDays, setWalkingDays] = useState(profile?.walkingDays ? String(profile.walkingDays) : "4");
  const [cyclingDays, setCyclingDays] = useState(profile?.cyclingDays ? String(profile.cyclingDays) : "3");
  const [hasIndoorBike, setHasIndoorBike] = useState<"yes" | "no">(profile?.hasIndoorBike ? "yes" : "no");
  const [remindersEnabled, setRemindersEnabled] = useState<"yes" | "no">(profile?.remindersEnabled ? "yes" : "no");
  const [weightKg, setWeightKg] = useState(profile?.currentWeightKg ? String(profile.currentWeightKg) : "");
  const [weightNote, setWeightNote] = useState("");

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setAge(String(profile.age));
    setHeightCm(String(profile.heightCm));
    setGoalWeightKg(profile.goalWeightKg ? String(profile.goalWeightKg) : "");
    setSex(profile.sex);
    setUnits(profile.units);
    setActivityLevel(profile.activityLevel);
    setPreferredPace(profile.preferredPace);
    setSprintLengthDays(String(profile.sprintLengthDays));
    setWalkingDays(String(profile.walkingDays));
    setCyclingDays(String(profile.cyclingDays));
    setHasIndoorBike(profile.hasIndoorBike ? "yes" : "no");
    setRemindersEnabled(profile.remindersEnabled ? "yes" : "no");
    setWeightKg(String(profile.currentWeightKg));
  }, [profile]);

  async function handleProfileSave() {
    if (!profile) return;
    await state.updateProfile({
      ...profile,
      name: name.trim() || profile.name,
      age: Number(age) || profile.age,
      sex,
      heightCm: Number(heightCm) || profile.heightCm,
      goalWeightKg: Number(goalWeightKg) || profile.goalWeightKg,
      activityLevel,
      preferredPace,
      sprintLengthDays: Number(sprintLengthDays) || profile.sprintLengthDays,
      units,
      walkingDays: Number(walkingDays) || profile.walkingDays,
      cyclingDays: Number(cyclingDays) || 0,
      hasIndoorBike: hasIndoorBike === "yes",
      remindersEnabled: remindersEnabled === "yes"
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
          <Text style={screenStyles.meta}>Sex</Text>
          <SegmentedControl value={sex} onChange={setSex} options={[{ label: "Male", value: "male" }, { label: "Female", value: "female" }]} />
          <AppTextInput label="Height cm" keyboardType="numeric" value={heightCm} onChangeText={setHeightCm} />
          <AppTextInput label="Goal weight kg" keyboardType="numeric" value={goalWeightKg} onChangeText={setGoalWeightKg} />
          <Text style={screenStyles.meta}>Units</Text>
          <SegmentedControl value={units} onChange={setUnits} options={[{ label: "Metric", value: "metric" }, { label: "Imperial", value: "imperial" }]} />
          <Text style={screenStyles.meta}>Activity</Text>
          <SegmentedControl
            value={activityLevel}
            onChange={setActivityLevel}
            options={[
              { label: "Sedentary", value: "sedentary" },
              { label: "Light", value: "light" },
              { label: "Moderate", value: "moderate" }
            ]}
          />
          <SegmentedControl
            value={activityLevel}
            onChange={setActivityLevel}
            options={[
              { label: "Active", value: "active" },
              { label: "Very active", value: "very_active" }
            ]}
          />
          <Text style={screenStyles.meta}>Pace</Text>
          <SegmentedControl
            value={preferredPace}
            onChange={setPreferredPace}
            options={[
              { label: "Gentle", value: "gentle" },
              { label: "Standard", value: "standard" },
              { label: "Ambitious", value: "ambitious" }
            ]}
          />
          <AppTextInput label="Sprint length days" keyboardType="numeric" value={sprintLengthDays} onChangeText={setSprintLengthDays} />
          <AppTextInput label="Walking days/week" keyboardType="numeric" value={walkingDays} onChangeText={setWalkingDays} />
          <AppTextInput label="Cycling days/week" keyboardType="numeric" value={cyclingDays} onChangeText={setCyclingDays} />
          <Text style={screenStyles.meta}>Indoor bike</Text>
          <SegmentedControl value={hasIndoorBike} onChange={setHasIndoorBike} options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }]} />
          <Text style={screenStyles.meta}>Reminders</Text>
          <SegmentedControl value={remindersEnabled} onChange={setRemindersEnabled} options={[{ label: "On", value: "yes" }, { label: "Off", value: "no" }]} />
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
