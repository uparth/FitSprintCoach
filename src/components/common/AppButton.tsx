import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "@/theme/colors";
import { radii } from "@/theme/radii";
import { spacing } from "@/theme/spacing";

interface Props {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
}

export function AppButton({ label, onPress, variant = "primary" }: Props) {
  return (
    <Pressable onPress={onPress} style={[styles.button, styles[variant]]}>
      <Text style={[styles.text, variant !== "primary" && styles.secondaryText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  primary: { backgroundColor: colors.healthGreen, borderColor: colors.healthGreen },
  secondary: { backgroundColor: colors.surface, borderColor: colors.border },
  danger: { backgroundColor: colors.surface, borderColor: colors.softRed },
  text: { color: colors.surface, fontSize: 15, fontWeight: "700" },
  secondaryText: { color: colors.text }
});
