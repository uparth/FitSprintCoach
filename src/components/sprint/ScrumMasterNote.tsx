import { Text, StyleSheet } from "react-native";
import { AppCard } from "@/components/common/AppCard";
import { colors } from "@/theme/colors";

export function ScrumMasterNote({ note }: { note: string }) {
  return (
    <AppCard>
      <Text style={styles.label}>Scrum Master</Text>
      <Text style={styles.note}>{note}</Text>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.secondaryText, fontSize: 13, fontWeight: "700" },
  note: { color: colors.text, fontSize: 15, lineHeight: 21 }
});
