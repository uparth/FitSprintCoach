import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TodayScreen } from "@/screens/today/TodayScreen";
import { RoadmapScreen } from "@/screens/roadmap/RoadmapScreen";
import { SprintScreen } from "@/screens/sprint/SprintScreen";
import { NutritionScreen } from "@/screens/nutrition/NutritionScreen";
import { ProgressScreen } from "@/screens/progress/ProgressScreen";
import { SettingsScreen } from "@/screens/settings/SettingsScreen";
import { colors } from "@/theme/colors";

export type BottomTabParamList = {
  Today: undefined;
  Roadmap: undefined;
  Sprint: undefined;
  Nutrition: undefined;
  Progress: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTintColor: colors.text,
        tabBarActiveTintColor: colors.healthGreen,
        tabBarInactiveTintColor: colors.secondaryText,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border }
      }}
    >
      <Tab.Screen name="Today" component={TodayScreen} />
      <Tab.Screen name="Roadmap" component={RoadmapScreen} />
      <Tab.Screen name="Sprint" component={SprintScreen} />
      <Tab.Screen name="Nutrition" component={NutritionScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
