import { ScrollView, Text } from "react-native";
import { AppCard } from "@/components/common/AppCard";
import { AppButton } from "@/components/common/AppButton";
import { screenStyles } from "@/screens/styles";
import { useAppStore } from "@/store/useAppStore";

export function TemplateLibraryScreen() {
  const templates = useAppStore((state) => state.templates);
  const addTemplateToBacklog = useAppStore((state) => state.addTemplateToBacklog);
  return (
    <ScrollView style={screenStyles.screen} contentContainerStyle={screenStyles.content}>
      <Text style={screenStyles.title}>Templates</Text>
      {templates.map((template) => (
        <AppCard key={template.id}>
          <Text style={screenStyles.sectionTitle}>{template.title}</Text>
          <Text style={screenStyles.meta}>{template.category} · {template.points} points · {template.frequency.target}x/{template.frequency.type}</Text>
          <Text style={screenStyles.body}>{template.definitionOfDone}</Text>
          <Text style={screenStyles.meta}>Fallback: {template.fallback}</Text>
          <AppButton label="Add to backlog" variant="secondary" onPress={() => addTemplateToBacklog(template.id)} />
        </AppCard>
      ))}
    </ScrollView>
  );
}
