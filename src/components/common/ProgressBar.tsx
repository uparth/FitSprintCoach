import { StyleSheet, View } from "react-native";
import { colors } from "@/theme/colors";

export function ProgressBar({ value }: { value: number }) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.min(100, Math.max(0, value * 100))}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { backgroundColor: colors.mutedSurface, borderRadius: 4, height: 6, overflow: "hidden" },
  fill: { backgroundColor: colors.progressBlue, height: 6 }
});
