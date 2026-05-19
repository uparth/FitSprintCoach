# FitSprint Coach App Specification

## 1. Product Summary

**App name:** FitSprint Coach  
**Tagline:** Agile fitness planning for steady weight loss.

FitSprint Coach is a minimalist, local-first mobile app that helps a user lose weight and build healthy habits using an agile/Scrum-inspired system. The user acts as the Product Owner of their health goal. The app acts as a Scrum Master and coach by planning realistic health sprints, detecting overcommitment, helping remove blockers, and encouraging consistency without guilt.

The app should support:

- Weight and height based body assessment
- Ideal/healthy weight range calculation
- Weight reduction target calculation
- Calorie and macronutrient planning
- Water intake planning
- Walking and indoor cycling progression from beginner to advanced
- Automatic sprint roadmap generation
- Predefined health task templates
- Daily standup/check-in
- Scrum Master style coaching
- Sprint review and retrospective
- Progress charts
- Fully local JSON storage on the phone
- No paid external database

## 2. Product Principles

1. **Local-first:** All user data is stored on the phone in JSON files.
2. **Small realistic goals:** The app should prefer achievable weekly plans over aggressive plans.
3. **Agile health system:** Use backlog, sprint planning, sprint board, velocity, review, and retrospective.
4. **Scrum Master behavior:** The app should guide, question, adjust, and protect consistency.
5. **No shame:** Missed goals are treated as data, not failure.
6. **Simple home health:** The initial focus is walking, indoor cycling, home-cooked food, water, protein, fiber, and consistency.
7. **Minimal design:** Quiet, subtle, and focused rather than loud or gym-like.

## 3. Target User

The primary user:

- Wants to lose weight and look healthier
- Prefers home-cooked food
- Wants simple exercise like walking and indoor cycling
- Has difficulty with motivation, discipline, and consistency
- Needs a system that plans small goals and adapts weekly
- Wants private local data storage, not cloud dependency

## 4. Health And Safety Guardrails

The app is not a medical device and should not present itself as a doctor, dietitian, or clinical treatment tool.

The app should show a brief disclaimer during onboarding:

> FitSprint Coach provides general fitness and nutrition estimates. It is not medical advice. Consult a qualified healthcare professional before starting a weight-loss plan if you have a medical condition, are pregnant, have a history of eating disorders, take medication affecting weight or blood sugar, or plan aggressive weight loss.

Safety rules:

- Do not recommend extreme calorie targets.
- Do not recommend losing weight faster than a safe configured limit.
- Prefer gradual loss.
- Encourage the user to consult a professional if BMI is underweight, weight target is too low, or calorie targets become too restrictive.
- If the user is already within a healthy BMI range, frame the goal as recomposition, fitness, habit building, or maintenance instead of weight loss.

Recommended evidence basis:

- CDC adult BMI categories and healthy weight range
- NIH/NIDDK style calorie planning concepts
- CDC guidance that gradual weight loss is more sustainable
- Dietary Guidelines macronutrient ranges
- CDC/ACSM physical activity guidance for adults

## 5. App Name

Primary name:

**FitSprint Coach**

Why this name works:

- **Fit** clearly signals fitness and health.
- **Sprint** clearly signals agile cycles.
- **Coach** signals guidance and accountability.

Alternative names:

- AgileFit Coach
- HealthSprint
- LeanSprint Coach
- FitLoop
- SprintWell

Use **FitSprint Coach** unless the user later chooses another name.

## 6. Core App Modules

### 6.1 Onboarding

Collect:

- Name or nickname
- Age
- Sex
- Height
- Current weight
- Goal weight, optional
- Preferred units: kg/cm or lb/ft/in
- Activity level
- Preferred sprint length, default 7 days
- Preferred weight-loss pace:
  - Gentle
  - Standard
  - Ambitious
- Available walking days
- Available cycling days
- Indoor bike availability
- Reminder preference
- Food preference notes, optional
- Health warning acknowledgement

Output:

- Body assessment
- Suggested healthy target range
- Suggested first milestone
- Nutrition targets
- Exercise starting level
- Initial sprint roadmap

### 6.2 Body Assessment

The app should calculate:

- BMI
- BMI category
- Healthy weight range for the user's height
- Suggested target weight
- Weight to reduce
- First milestone target

BMI formula:

```text
BMI = weightKg / (heightMeters * heightMeters)
```

Healthy BMI range for most adults:

```text
18.5 to 24.9
```

Healthy weight range:

```text
minHealthyWeightKg = 18.5 * heightMeters^2
maxHealthyWeightKg = 24.9 * heightMeters^2
```

Suggested target logic:

- If user enters a goal weight inside healthy range, use it.
- If user enters a goal weight below healthy range, warn and suggest min healthy weight or a safer milestone.
- If current weight is above healthy range, suggest the upper end of healthy range as long-term goal.
- For the first milestone, suggest 5% of current body weight reduction or a smaller achievable milestone.

### 6.3 Calorie Planning

The app should estimate:

- BMR
- TDEE
- Daily calorie target for weight loss
- Maintenance calories at current weight
- Estimated maintenance calories at goal weight

Use Mifflin-St Jeor equation:

```text
Male:
BMR = 10 * weightKg + 6.25 * heightCm - 5 * age + 5

Female:
BMR = 10 * weightKg + 6.25 * heightCm - 5 * age - 161
```

Activity multipliers:

```text
sedentary:      1.2
light:          1.375
moderate:       1.55
active:         1.725
very_active:    1.9
```

```text
TDEE = BMR * activityMultiplier
```

Deficit by pace:

```text
gentle:    250 kcal/day
standard:  400-500 kcal/day
ambitious: 600-750 kcal/day, only if safe
```

Safety bounds:

- Do not produce calorie targets below safe minimum thresholds.
- Suggested default minimums:
  - Female: 1200 kcal/day
  - Male: 1500 kcal/day
- If calculated target falls below minimum, clamp to minimum and warn that timeline may be longer.
- Consider a configurable `minimumCalories` field in profile settings.

### 6.4 Macronutrient Planning

The app should calculate:

- Protein grams/day
- Fat grams/day
- Carbohydrate grams/day
- Fiber grams/day

Suggested approach:

Protein:

```text
proteinGrams = targetWeightKg * proteinMultiplier
```

Default protein multipliers:

```text
beginner / general weight loss: 1.4 g/kg target body weight
active / higher satiety:        1.6 g/kg target body weight
advanced:                       1.8 g/kg target body weight
```

Fat:

```text
fatCalories = dailyCalories * 0.25 to 0.30
fatGrams = fatCalories / 9
```

Carbs:

```text
remainingCalories = dailyCalories - proteinCalories - fatCalories
carbGrams = remainingCalories / 4
```

Fiber:

```text
fiberGrams = max(25, dailyCalories / 1000 * 14)
```

Macro calories:

```text
proteinCalories = proteinGrams * 4
carbCalories = carbGrams * 4
fatCalories = fatGrams * 9
```

The app should show macros as practical targets, not strict perfection requirements.

### 6.5 Water Planning

Calculate daily water target:

```text
waterMl = weightKg * 30 to 35
```

Suggested default:

```text
waterMl = weightKg * 33
```

Add optional exercise adjustment:

```text
+ 300 to 500 ml on workout days
```

Clamp or warn for very high calculated values. Let the user customize water target.

### 6.6 Agile Roadmap Planner

The app should generate a full sprint roadmap from current weight to goal weight.

Inputs:

- Current weight
- Goal weight
- Weekly loss target
- Sprint length
- User activity level
- Walking availability
- Cycling availability
- Calorie target
- Macro targets
- Water target

Outputs:

- Total weight to reduce
- Estimated number of weeks
- Estimated number of sprints
- Target weight per sprint
- Nutrition target per sprint
- Walking plan per sprint
- Cycling plan per sprint
- Sprint tasks
- Milestones

Example:

```text
Current weight: 92 kg
Goal weight: 78 kg
Weight to reduce: 14 kg
Target pace: 0.5 kg/week
Sprint length: 7 days
Estimated roadmap: 28 sprints
```

Sprint roadmap phases:

1. **Foundation**
   - Build consistency
   - Short walking/cycling sessions
   - Home-cooked food
   - Water target

2. **Build**
   - Increase walking and cycling duration
   - Improve protein and fiber consistency
   - Add calorie target consistency

3. **Capacity**
   - Reach 150+ minutes weekly moderate activity when appropriate
   - Maintain calorie and macro targets
   - Detect plateaus

4. **Refine**
   - Adjust calories as weight changes
   - Use retrospectives to fix blockers
   - Add optional higher-intensity cycling intervals only when ready

5. **Maintain**
   - Transition from loss target to maintenance target
   - Keep weekly movement and home food routines

### 6.7 Exercise Progression

The app should create walking and indoor cycling plans from beginner to advanced.

Use gradual progression:

- Start from user's current comfort level.
- Increase total weekly volume slowly.
- Add recovery weeks.
- Do not increase duration and intensity aggressively at the same time.
- Offer fallback workouts.

Walking levels:

```text
Level 1: 5-10 min easy walk, 3-4x/week
Level 2: 10-15 min walk, 4x/week
Level 3: 20 min walk, 4x/week
Level 4: 25-30 min brisk walk, 4-5x/week
Level 5: 35-45 min walk, 5x/week
Level 6: Optional hills, intervals, or longer weekend walk
```

Indoor cycling levels:

```text
Level 1: 5-8 min easy ride, 2-3x/week
Level 2: 10-12 min easy ride, 3x/week
Level 3: 15 min steady ride, 3x/week
Level 4: 20 min steady ride, 3x/week
Level 5: 25-30 min ride, 3-4x/week
Level 6: Optional beginner intervals, 1x/week
```

Fallback examples:

- Walk 5 minutes
- Cycle 5 minutes
- Stretch 3 minutes
- Do one lap around the house
- Complete water target only

### 6.8 Template Library

The app should include predefined templates so the user can quickly add tasks to backlog or current sprint.

Template categories:

- Walking
- Indoor Cycling
- Home Food
- Calories
- Protein
- Fiber
- Water
- Sleep
- Mindset
- Recovery

Each template should include:

- Title
- Category
- Suggested points
- Frequency
- Difficulty
- Estimated time
- Definition of done
- Fallback version
- Blockers
- Tags

Example template:

```json
{
  "id": "template_cycle_15_easy",
  "title": "Cycle 15 minutes easy pace",
  "category": "cycling",
  "points": 3,
  "frequency": {
    "type": "weekly",
    "target": 3
  },
  "difficulty": "easy",
  "estimatedMinutes": 15,
  "definitionOfDone": "Complete 15 minutes on the exercise bike at a comfortable pace.",
  "fallback": "Cycle for 5 minutes.",
  "blockers": ["low_energy", "no_time", "boredom"],
  "tags": ["exercise", "bike", "beginner"]
}
```

Template packs:

- Beginner Week
- Low Motivation Week
- Busy Work Week
- Food Reset Week
- Walking Focus
- Cycling Focus
- Protein Focus
- Water Focus
- Recovery Week
- Plateau Reset

### 6.9 Scrum Master Coach

The app should generate short, practical coaching notes.

Rule examples:

- If planned points > 125% of recent velocity, suggest reducing sprint scope.
- If completion < 50% last sprint, suggest a smaller sprint.
- If completion > 90% for two consecutive sprints, suggest a small increase.
- If a task is skipped twice in one sprint, suggest fallback version.
- If a blocker appears three or more times, surface it in retrospective.
- If evening cycling is skipped often, suggest morning/lunch experiment.
- If protein target is missed often, suggest easier home food templates.
- If calorie target is missed often, suggest food prep and portion templates.
- If weight does not move for several weeks, suggest reviewing calorie adherence and water/sodium fluctuations.

Tone examples:

- "This sprint looks heavy. Your recent velocity is 9 points. Planning 18 may be too much."
- "Yesterday is data, not failure. Today, choose the smallest restart action."
- "Cycling is often skipped at night. Try a 10-minute ride before shower tomorrow."
- "Your protein target is the weakest link this week. Add one simple protein habit."
- "You completed 85% of planned points. Keep the next sprint similar."

## 7. Information Architecture

Use bottom tab navigation with these main tabs:

```text
Today
Roadmap
Sprint
Nutrition
Progress
Settings
```

Optional: Put Backlog inside Sprint or as a separate tab if the UI needs more agile visibility.

### 7.1 Today

Purpose: Daily execution.

Sections:

- Scrum Master note
- Daily standup
- Today's sprint tasks
- Calories/macros/water targets
- Walk/cycle plan
- Minimum viable action

### 7.2 Roadmap

Purpose: Long-term plan.

Sections:

- Current weight
- Goal weight
- Weight to reduce
- Estimated number of sprints
- Milestones
- Sprint timeline
- Current phase

### 7.3 Sprint

Purpose: Agile weekly planning and task board.

Sections:

- Current sprint goal
- Sprint dates
- Planned points
- Completed points
- Velocity check
- Sprint board
  - To Do
  - In Progress
  - Done
  - Blocked
  - Adjusted
- Backlog
- Template library
- Sprint planning

### 7.4 Nutrition

Purpose: Daily intake targets and simple adherence.

Sections:

- Daily calorie target
- Protein target
- Carbs target
- Fat target
- Fiber target
- Water target
- Home-cooked meal tracker
- Weekly nutrition consistency

### 7.5 Progress

Purpose: Charts and trend visibility.

Charts:

- Weight trend
- BMI trend
- Target weight projection
- Sprint velocity
- Planned vs completed points
- Walking minutes per week
- Cycling minutes per week
- Calories target adherence
- Protein target adherence
- Fiber target adherence
- Water adherence

### 7.6 Settings

Purpose: Profile and local data management.

Sections:

- Profile
- Units
- Goal settings
- Sprint length
- Reminder preferences
- Data export
- Data import
- Reset local data
- Disclaimer

## 8. Minimalist Design Specification

Visual feel:

- Minimal
- Calm
- Subtle
- Health-focused
- Not loud
- Not gamified aggressively

Palette:

```text
Background:     #F7F7F4
Surface:        #FFFFFF
Muted surface:  #F0F2ED
Text:           #232927
Secondary text: #6C746F
Border:         #E2E4DF
Health green:   #7A9B76
Progress blue:  #7E9AA8
Warning amber:  #C9A86A
Soft red:       #C98282
```

Typography:

- Use system font, Inter, Geist, or similar.
- Screen title: 24-28
- Section title: 16-18
- Body: 14-16
- Metadata: 12-13

UI rules:

- Use subtle borders, not heavy shadows.
- Cards should be compact with 8px border radius or less.
- Use thin progress bars.
- Use simple line icons.
- Avoid neon colors, giant streaks, and guilt-based visuals.
- Avoid cluttered dashboards.
- Make daily check-in extremely fast.

## 9. Frontend Architecture

Recommended stack:

```text
React Native + Expo
TypeScript
React Navigation
Zustand
React Hook Form
Zod
expo-file-system
react-native-svg
Victory Native or react-native-svg-charts
date-fns
```

Suggested folder structure:

```text
src/
  app/
    App.tsx
    providers/
      AppProviders.tsx
    navigation/
      RootNavigator.tsx
      BottomTabs.tsx

  screens/
    onboarding/
      OnboardingScreen.tsx
      BodyAssessmentScreen.tsx
      GoalSetupScreen.tsx
    today/
      TodayScreen.tsx
    roadmap/
      RoadmapScreen.tsx
    sprint/
      SprintScreen.tsx
      SprintPlanningScreen.tsx
      BacklogScreen.tsx
      TemplateLibraryScreen.tsx
    nutrition/
      NutritionScreen.tsx
    progress/
      ProgressScreen.tsx
    review/
      SprintReviewScreen.tsx
      RetrospectiveScreen.tsx
    settings/
      SettingsScreen.tsx
      DataScreen.tsx

  components/
    common/
      AppButton.tsx
      AppCard.tsx
      AppTextInput.tsx
      EmptyState.tsx
      SegmentedControl.tsx
      ProgressBar.tsx
    health/
      BodyMetricCard.tsx
      MacroTargetRow.tsx
      WaterTargetCard.tsx
    sprint/
      SprintBoard.tsx
      TaskCard.tsx
      VelocityBadge.tsx
      ScrumMasterNote.tsx
      StandupForm.tsx
    charts/
      WeightChart.tsx
      VelocityChart.tsx
      ExerciseMinutesChart.tsx
      NutritionAdherenceChart.tsx

  domain/
    models.ts
    bmi.ts
    caloriePlanner.ts
    macroPlanner.ts
    waterPlanner.ts
    exerciseProgression.ts
    sprintPlanner.ts
    velocity.ts
    scrumMasterRules.ts
    charts.ts

  store/
    useAppStore.ts
    selectors.ts

  storage/
    jsonStore.ts
    repositories/
      profileRepository.ts
      sprintRepository.ts
      checkinRepository.ts
      templateRepository.ts
    migrations.ts
    seedTemplates.ts
    exportImport.ts

  theme/
    colors.ts
    typography.ts
    spacing.ts
    radii.ts

  utils/
    dates.ts
    ids.ts
    numbers.ts
```

State management:

- Use Zustand for app state.
- Keep domain calculations pure and testable.
- Store persisted entities as JSON files.
- Load JSON files on app start.
- Save after meaningful changes.
- Use migrations for future schema changes.

## 10. Backend Architecture

There is no cloud backend for the MVP.

The backend is local application logic plus JSON file storage.

Architecture:

```text
UI Layer
↓
State Store
↓
Domain Services
↓
Repository Layer
↓
JSON File Store
↓
Phone File System
```

Local data folder:

```text
fitsprint-coach/
  profile.json
  body_metrics.json
  nutrition_targets.json
  exercise_plans.json
  templates.json
  backlog.json
  roadmap.json
  sprints.json
  checkins.json
  retrospectives.json
  settings.json
  schema_version.json
```

Use `expo-file-system` to read/write these files.

Required storage features:

- Initialize files on first launch.
- Seed templates on first launch.
- Read all files into state during app startup.
- Write atomically where possible.
- Validate JSON shape with Zod.
- Export all files as a single backup JSON.
- Import backup JSON after validation.
- Maintain schema version for migrations.

## 11. Data Models

### 11.1 Profile

```json
{
  "id": "user_001",
  "name": "Parth",
  "age": 34,
  "sex": "male",
  "heightCm": 175,
  "currentWeightKg": 92,
  "goalWeightKg": 78,
  "activityLevel": "light",
  "preferredPace": "standard",
  "sprintLengthDays": 7,
  "units": "metric",
  "createdAt": "2026-05-19T00:00:00.000Z",
  "updatedAt": "2026-05-19T00:00:00.000Z"
}
```

### 11.2 Body Metric Entry

```json
{
  "id": "metric_2026_05_19",
  "date": "2026-05-19",
  "weightKg": 92,
  "bmi": 30.04,
  "waistCm": null,
  "note": "Initial entry"
}
```

### 11.3 Nutrition Target

```json
{
  "id": "nutrition_week_001",
  "startDate": "2026-05-19",
  "endDate": "2026-05-25",
  "calories": 1900,
  "proteinGrams": 130,
  "carbsGrams": 190,
  "fatGrams": 60,
  "fiberGrams": 30,
  "waterMl": 2800,
  "source": "generated"
}
```

### 11.4 Exercise Plan

```json
{
  "id": "exercise_week_001",
  "sprintId": "sprint_001",
  "walking": {
    "level": 1,
    "sessionsPerWeek": 4,
    "minutesPerSession": 10,
    "intensity": "easy"
  },
  "cycling": {
    "level": 1,
    "sessionsPerWeek": 3,
    "minutesPerSession": 8,
    "intensity": "easy"
  }
}
```

### 11.5 Task Template

```json
{
  "id": "template_walk_10_easy",
  "title": "Walk 10 minutes",
  "category": "walking",
  "points": 2,
  "frequency": {
    "type": "weekly",
    "target": 4
  },
  "difficulty": "easy",
  "estimatedMinutes": 10,
  "definitionOfDone": "Complete a 10-minute easy walk.",
  "fallback": "Walk for 5 minutes.",
  "blockers": ["no_time", "low_energy", "weather"],
  "tags": ["exercise", "walking", "beginner"]
}
```

### 11.6 Sprint

```json
{
  "id": "sprint_001",
  "weekNumber": 1,
  "name": "Foundation Week 1",
  "goal": "Start with easy movement, home food, and water consistency.",
  "phase": "foundation",
  "startDate": "2026-05-19",
  "endDate": "2026-05-25",
  "targetWeightKg": 91.5,
  "plannedPoints": 12,
  "completedPoints": 0,
  "nutritionTargetId": "nutrition_week_001",
  "exercisePlanId": "exercise_week_001",
  "taskIds": ["task_walk_10_4x", "task_cycle_8_3x", "task_water_5x"],
  "status": "active"
}
```

### 11.7 Sprint Task

```json
{
  "id": "task_walk_10_4x",
  "templateId": "template_walk_10_easy",
  "sprintId": "sprint_001",
  "title": "Walk 10 minutes",
  "category": "walking",
  "points": 2,
  "targetCount": 4,
  "completedCount": 0,
  "status": "todo",
  "definitionOfDone": "Complete a 10-minute easy walk.",
  "fallback": "Walk for 5 minutes."
}
```

### 11.8 Daily Check-In

```json
{
  "id": "checkin_2026_05_19",
  "date": "2026-05-19",
  "sprintId": "sprint_001",
  "yesterday": "Started the sprint.",
  "today": "Walk 10 minutes and drink water target.",
  "blockers": ["low_energy"],
  "caloriesActual": 1950,
  "proteinActualGrams": 115,
  "carbsActualGrams": 200,
  "fatActualGrams": 62,
  "fiberActualGrams": 24,
  "waterActualMl": 2500,
  "taskUpdates": [
    {
      "taskId": "task_walk_10_4x",
      "status": "done",
      "note": "Walked after dinner."
    }
  ]
}
```

### 11.9 Retrospective

```json
{
  "id": "retro_sprint_001",
  "sprintId": "sprint_001",
  "worked": ["Walking after dinner was easy."],
  "didNotWork": ["Cycling at night felt hard."],
  "blockers": ["low_energy", "late_work"],
  "continue": ["Keep walking after dinner."],
  "change": ["Move cycling to morning."],
  "nextSprintRecommendation": "Keep points similar and move cycling earlier."
}
```

## 12. Domain Services

Implement these as pure TypeScript modules.

### 12.1 `bmi.ts`

Functions:

- `calculateBMI(weightKg, heightCm)`
- `getBMICategory(bmi)`
- `getHealthyWeightRange(heightCm)`
- `getWeightToReduce(currentWeightKg, goalWeightKg)`
- `suggestGoalWeight(currentWeightKg, heightCm)`
- `suggestFirstMilestone(currentWeightKg, goalWeightKg)`

### 12.2 `caloriePlanner.ts`

Functions:

- `calculateBMR(profile)`
- `calculateTDEE(profile)`
- `getDeficitForPace(preferredPace)`
- `calculateCalorieTarget(profile)`
- `applyCalorieSafetyBounds(target, profile)`
- `estimateWeeklyWeightLoss(deficitPerDay)`
- `recalculateAfterWeightChange(profile, newWeightKg)`

### 12.3 `macroPlanner.ts`

Functions:

- `calculateProteinTarget(profile, calorieTarget)`
- `calculateFatTarget(calorieTarget)`
- `calculateCarbTarget(calorieTarget, proteinGrams, fatGrams)`
- `calculateFiberTarget(calorieTarget)`
- `buildMacroTarget(profile, calorieTarget)`

### 12.4 `waterPlanner.ts`

Functions:

- `calculateWaterTarget(weightKg)`
- `calculateWorkoutDayWaterTarget(weightKg)`

### 12.5 `exerciseProgression.ts`

Functions:

- `getInitialWalkingLevel(profile)`
- `getInitialCyclingLevel(profile)`
- `generateWalkingPlan(level, sprintNumber)`
- `generateCyclingPlan(level, sprintNumber)`
- `progressExerciseLevel(previousPlan, completionRate)`
- `createFallbackWorkout(activityType)`

### 12.6 `sprintPlanner.ts`

Functions:

- `calculateSprintsNeeded(currentWeightKg, goalWeightKg, weeklyLossTargetKg, sprintLengthDays)`
- `generateRoadmap(profile)`
- `generateSprint(profile, sprintNumber, previousVelocity?)`
- `generateSprintTasks(sprint, templates)`
- `adjustSprintByVelocity(sprint, velocity)`
- `createRecoverySprint(profile)`

### 12.7 `velocity.ts`

Functions:

- `calculateSprintVelocity(sprint)`
- `calculateRollingVelocity(sprints, windowSize)`
- `getCompletionRate(sprint)`
- `getRecommendedPointBudget(previousSprints)`

### 12.8 `scrumMasterRules.ts`

Functions:

- `getOvercommitmentNote(sprint, velocity)`
- `getDailyCoachNote(today, sprint, checkins)`
- `getBlockerInsights(checkins)`
- `getRetroRecommendation(sprint, checkins)`
- `getNextSprintRecommendation(sprints, checkins)`

## 13. Charts

Use local JSON history to build charts.

Charts required for MVP:

1. Weight trend
2. BMI trend
3. Target weight projection
4. Sprint velocity
5. Planned vs completed points
6. Walking minutes per week
7. Cycling minutes per week
8. Calories target vs actual
9. Protein consistency
10. Fiber consistency
11. Water consistency

Chart design:

- Thin lines
- Muted colors
- Minimal labels
- No visual clutter
- Show trend, not judgment

## 14. MVP Implementation Phases

### Phase 1: Project Setup

- Create Expo React Native TypeScript app.
- Add navigation.
- Add theme tokens.
- Add JSON storage layer.
- Add local seed templates.

### Phase 2: Onboarding And Calculations

- Build profile form.
- Implement BMI calculator.
- Implement calorie planner.
- Implement macro planner.
- Implement water planner.
- Show assessment summary.

### Phase 3: Roadmap And Sprint Generation

- Generate roadmap.
- Generate first sprint.
- Generate walking and cycling plans.
- Generate nutrition targets per sprint.
- Save roadmap and sprints to JSON.

### Phase 4: Today And Check-In

- Build Today screen.
- Show daily standup.
- Show task check-in.
- Track calories/macros/water actuals.
- Save daily check-ins.

### Phase 5: Sprint Board And Templates

- Build sprint board.
- Build template library.
- Add template to backlog.
- Add backlog task to sprint.
- Update task statuses.

### Phase 6: Scrum Master Coach

- Implement velocity.
- Implement overcommitment warnings.
- Implement blocker detection.
- Implement fallback suggestions.
- Implement next sprint recommendation.

### Phase 7: Progress And Review

- Build progress charts.
- Build sprint review.
- Build retrospective.
- Generate next sprint from retrospective and velocity.

### Phase 8: Data Export And Import

- Export all JSON files as one backup JSON.
- Import and validate backup JSON.
- Add schema version and migration support.

## 15. Acceptance Criteria

The MVP is complete when:

- User can onboard with height, weight, age, sex, activity level, and goal.
- App calculates BMI, healthy weight range, weight to reduce, calorie target, protein, carbs, fat, fiber, and water.
- App generates a realistic sprint roadmap.
- App generates current sprint tasks for walking, cycling, nutrition, and water.
- User can check in daily.
- User can mark tasks as done, partial, skipped, blocked, or adjusted.
- App calculates sprint velocity.
- App gives Scrum Master style notes.
- User can complete sprint review and retrospective.
- App creates progress charts from local data.
- All data persists locally as JSON on phone.
- User can export/import local data.
- App does not require a paid database or external server.

## 16. Non-Goals For MVP

Do not build these in the first version unless explicitly requested:

- Cloud sync
- Social features
- Barcode scanner
- Detailed food database
- Wearable integration
- AI chat coach
- Meal photo recognition
- Payment/subscription system
- Complex strength training programming

## 17. Future Enhancements

Possible later features:

- Optional encrypted cloud backup
- Apple Health / Google Fit integration
- Food recipe templates
- Grocery list generator
- Meal prep planner
- Adaptive calorie adjustment from weight trend
- Plateau detection
- Optional AI coach using local data export
- Widgets
- Reminder scheduling
- Wearable step sync

## 18. Build Instruction For Codex

When building this app, prioritize this order:

1. Create the Expo TypeScript app.
2. Implement local JSON storage first.
3. Implement pure calculation modules with tests.
4. Build onboarding and assessment.
5. Generate roadmap and first sprint.
6. Build Today screen and check-in.
7. Build Sprint board and templates.
8. Build Progress charts.
9. Add export/import.
10. Polish minimalist UI.

Keep the first implementation small, working, and local-first. Avoid adding cloud services, complex databases, or large external systems.

