import { Text, StyleSheet, View } from "react-native";
import { SprintTask, TaskStatus } from "@/domain/models";
import { TaskCard } from "@/components/sprint/TaskCard";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

const columns: Array<{ title: string; statuses: TaskStatus[] }> = [
  { title: "To Do", statuses: ["todo", "in_progress"] },
  { title: "Done", statuses: ["done"] },
  { title: "Blocked", statuses: ["blocked", "skipped"] },
  { title: "Adjusted", statuses: ["partial", "adjusted"] }
];

export function SprintBoard({ tasks, onStatus }: { tasks: SprintTask[]; onStatus: (taskId: string, status: TaskStatus) => void }) {
  return (
    <View style={styles.wrap}>
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => column.statuses.includes(task.status));
        return (
          <View key={column.title} style={styles.column}>
            <Text style={styles.title}>{column.title}</Text>
            {columnTasks.length === 0 ? <Text style={styles.empty}>No tasks</Text> : null}
            {columnTasks.map((task) => <TaskCard key={task.id} task={task} onStatus={(status) => onStatus(task.id, status)} />)}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  column: { gap: spacing.sm },
  title: { color: colors.text, fontSize: 17, fontWeight: "800" },
  empty: { color: colors.secondaryText, fontSize: 14 }
});
