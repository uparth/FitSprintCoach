import { Text, StyleSheet, View } from "react-native";
import { colors } from "@/theme/colors";

export function MacroTargetRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between", paddingVertical: 10 },
  label: { color: colors.secondaryText, fontSize: 15 },
  value: { color: colors.text, fontSize: 15, fontWeight: "700" }
});
