import { Text, StyleSheet } from "react-native";
import { AppCard } from "@/components/common/AppCard";
import { colors } from "@/theme/colors";

export function BodyMetricCard({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <AppCard>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {note ? <Text style={styles.note}>{note}</Text> : null}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.secondaryText, fontSize: 13 },
  value: { color: colors.text, fontSize: 24, fontWeight: "800" },
  note: { color: colors.secondaryText, fontSize: 13 }
});
