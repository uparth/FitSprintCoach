import { StyleSheet, Text, View } from "react-native";
import { ChartPoint } from "@/domain/charts";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

export function SimpleBarChart({ data }: { data: ChartPoint[] }) {
  const max = Math.max(1, ...data.map((point) => point.y));
  return (
    <View style={styles.wrap}>
      {data.length === 0 ? <Text style={styles.empty}>No data yet</Text> : null}
      {data.slice(-8).map((point) => (
        <View key={`${point.x}`} style={styles.row}>
          <Text style={styles.label}>{point.x}</Text>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${(point.y / max) * 100}%` }]} />
          </View>
          <Text style={styles.value}>{point.y}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  row: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  label: { color: colors.secondaryText, fontSize: 11, width: 72 },
  track: { backgroundColor: colors.mutedSurface, borderRadius: 4, flex: 1, height: 8, overflow: "hidden" },
  fill: { backgroundColor: colors.progressBlue, height: 8 },
  value: { color: colors.text, fontSize: 12, fontWeight: "700", width: 46 },
  empty: { color: colors.secondaryText, fontSize: 14 }
});
