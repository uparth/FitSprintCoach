# FitSprint Coach MVP Checklist

## Implemented

- Expo React Native TypeScript app scaffold
- Bottom tab navigation
- Local JSON storage through `expo-file-system`
- Zod validation for persisted data
- Seed task templates
- Backup JSON export/import
- Reset local data flow
- Onboarding with disclaimer and body assessment
- BMI, healthy weight range, goal, and milestone calculations
- BMR, TDEE, calorie target, safety bounds
- Protein, carbs, fat, fiber, and water targets
- Roadmap generation
- First sprint generation
- Walking and cycling progression
- Today check-in
- Sprint board with task statuses
- Template-to-backlog and backlog-to-sprint flow
- Velocity and coaching notes
- Sprint review and retrospective
- Next sprint generation after retrospective
- Progress views for weight, BMI, target projection, velocity, points, exercise minutes, nutrition actuals, and water
- Profile editing
- Weight logging
- Smoke tests for domain calculations and sprint generation

## Remaining Polish

- Run the Expo app under Node 18+ and verify on simulator/device
- Add real line charts when runtime verification is available
- Add reminder scheduling
- Expand template packs
- Add richer profile controls for units, activity level, pace, and sprint length after onboarding
- Add stronger import migration test coverage
- Add visual QA on small and large mobile screens

## Known Environment Requirement

The current shell used during implementation reports Node `v14.18.1`. Expo 51 requires Node 18 or newer. Use Node 20, then run:

```bash
npm start
```
