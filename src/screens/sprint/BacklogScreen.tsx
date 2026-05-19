import { ScrollView, Text } from "react-native";
import { EmptyState } from "@/components/common/EmptyState";
import { screenStyles } from "@/screens/styles";
import { useAppStore } from "@/store/useAppStore";

export function BacklogScreen() {
  const backlog = useAppStore((state) => state.backlog);
  if (backlog.length === 0) return <EmptyState text="Backlog is empty. Use templates to add future tasks." />;
  return (
    <ScrollView style={screenStyles.screen} contentContainerStyle={screenStyles.content}>
      <Text style={screenStyles.title}>Backlog</Text>
      {backlog.map((task) => <Text key={task.id} style={screenStyles.body}>{task.title}</Text>)}
    </ScrollView>
  );
}
