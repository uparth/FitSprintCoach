import { Text, StyleSheet } from "react-native";
import { AppCard } from "@/components/common/AppCard";
import { colors } from "@/theme/colors";

export function EmptyState({ text }: { text: string }) {
  return (
    <AppCard>
      <Text style={styles.text}>{text}</Text>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  text: { color: colors.secondaryText, fontSize: 15 }
});
