import { Text, StyleSheet } from "react-native";
import { colors } from "@/theme/colors";

export function VelocityBadge({ points }: { points: number }) {
  return <Text style={styles.badge}>Velocity {points}</Text>;
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.mutedSurface,
    borderRadius: 4,
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 4
  }
});
