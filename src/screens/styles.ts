import { StyleSheet } from "react-native";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

export const screenStyles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: { gap: spacing.lg, padding: spacing.lg, paddingBottom: spacing.xxl },
  title: { color: colors.text, fontSize: 26, fontWeight: "900" },
  sectionTitle: { color: colors.text, fontSize: 17, fontWeight: "800" },
  body: { color: colors.text, fontSize: 15, lineHeight: 22 },
  meta: { color: colors.secondaryText, fontSize: 13, lineHeight: 19 },
  row: { flexDirection: "row", gap: spacing.md }
});
