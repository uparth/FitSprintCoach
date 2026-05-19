import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

export function SectionHeader({ title, meta }: { title: string; meta?: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {meta ? <Text style={styles.meta}>{meta}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  title: { color: colors.text, fontSize: 17, fontWeight: "800" },
  meta: { color: colors.secondaryText, fontSize: 12, lineHeight: 17 }
});
