import { Pressable, StyleSheet, Text, View } from "react-native";
import { SprintTask, TaskStatus } from "@/domain/models";
import { AppCard } from "@/components/common/AppCard";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

const statuses: TaskStatus[] = ["done", "partial", "blocked", "skipped"];

export function TaskCard({ task, onStatus }: { task: SprintTask; onStatus: (status: TaskStatus) => void }) {
  return (
    <AppCard>
      <View style={styles.header}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.points}>{task.points} pts</Text>
      </View>
      <Text style={styles.meta}>
        {task.completedCount}/{task.targetCount} complete{task.estimatedMinutes ? ` · ${task.estimatedMinutes} min` : ""}
      </Text>
      <Text style={styles.done}>{task.definitionOfDone}</Text>
      <Text style={styles.fallback}>Fallback: {task.fallback}</Text>
      <View style={styles.actions}>
        {statuses.map((status) => (
          <Pressable key={status} onPress={() => onStatus(status)} style={styles.action}>
            <Text style={styles.actionText}>{status.replace("_", " ")}</Text>
          </Pressable>
        ))}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", gap: spacing.sm },
  title: { color: colors.text, flex: 1, fontSize: 16, fontWeight: "800" },
  points: { color: colors.progressBlue, fontSize: 13, fontWeight: "800" },
  meta: { color: colors.secondaryText, fontSize: 12 },
  done: { color: colors.text, fontSize: 14, lineHeight: 20 },
  fallback: { color: colors.secondaryText, fontSize: 13 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.sm },
  action: { backgroundColor: colors.mutedSurface, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 6 },
  actionText: { color: colors.text, fontSize: 12, fontWeight: "700", textTransform: "capitalize" }
});
