import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BottomTabs } from "@/core/navigation/BottomTabs";
import { OnboardingScreen } from "@/screens/onboarding/OnboardingScreen";
import { SprintReviewScreen } from "@/screens/review/SprintReviewScreen";
import { RetrospectiveScreen } from "@/screens/review/RetrospectiveScreen";
import { useAppStore } from "@/store/useAppStore";
import { colors } from "@/theme/colors";

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  SprintReview: undefined;
  Retrospective: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const hasCompletedOnboarding = useAppStore((state) => state.settings.hasCompletedOnboarding);

  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.background }, headerShadowVisible: false, headerTintColor: colors.text }}>
      {!hasCompletedOnboarding ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ title: "FitSprint Coach" }} />
      ) : (
        <>
          <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
          <Stack.Screen name="SprintReview" component={SprintReviewScreen} options={{ title: "Sprint Review" }} />
          <Stack.Screen name="Retrospective" component={RetrospectiveScreen} options={{ title: "Retrospective" }} />
        </>
      )}
    </Stack.Navigator>
  );
}
