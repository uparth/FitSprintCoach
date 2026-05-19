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
          <Text style={styles.label} numberOfLines={1}>{formatLabel(point.x)}</Text>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${(point.y / max) * 100}%` }]} />
          </View>
          <Text style={styles.value} numberOfLines={1}>{formatValue(point.y)}</Text>
        </View>
      ))}
    </View>
  );
}

function formatLabel(value: string | number) {
  const text = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text.slice(5);
  return text;
}

function formatValue(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  row: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  label: { color: colors.secondaryText, fontSize: 11, width: 48 },
  track: { backgroundColor: colors.mutedSurface, borderRadius: 4, flex: 1, height: 8, overflow: "hidden" },
  fill: { backgroundColor: colors.progressBlue, height: 8 },
  value: { color: colors.text, fontSize: 12, fontWeight: "700", textAlign: "right", width: 44 },
  empty: { color: colors.secondaryText, fontSize: 14 }
});
