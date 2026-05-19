import { Text, StyleSheet } from "react-native";
import { AppCard } from "@/components/common/AppCard";
import { colors } from "@/theme/colors";

export function WaterTargetCard({ waterMl }: { waterMl: number }) {
  return (
    <AppCard>
      <Text style={styles.label}>Water target</Text>
      <Text style={styles.value}>{waterMl} ml</Text>
      <Text style={styles.note}>Add 300-500 ml on workout days if needed.</Text>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.secondaryText, fontSize: 13 },
  value: { color: colors.text, fontSize: 24, fontWeight: "800" },
  note: { color: colors.secondaryText, fontSize: 13 }
});
