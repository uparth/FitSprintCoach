# FitSprint Coach MVP Checklist

## Implemented

- Expo React Native TypeScript app scaffold
- Bottom tab navigation
- Local JSON storage through `expo-file-system`
- Zod validation for persisted data
- Seed task templates
- Backup JSON export/import
- Backup JSON sharing
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

## Acceptance Criteria Status

- [x] User can onboard with height, weight, age, sex, activity level, and goal.
- [x] App calculates BMI, healthy weight range, weight to reduce, calorie target, protein, carbs, fat, fiber, and water.
- [x] App generates a realistic sprint roadmap.
- [x] App generates current sprint tasks for walking, cycling when available, nutrition, and water.
- [x] User can check in daily.
- [x] User can mark tasks as done, partial, skipped, blocked, or adjusted.
- [x] App calculates sprint velocity.
- [x] App gives Scrum Master style notes.
- [x] User can complete sprint review and retrospective.
- [x] App creates progress charts from local data.
- [x] All data persists locally as JSON on phone.
- [x] User can export/import local data.
- [x] App does not require a paid database or external server.

## Remaining Polish

- Complete simulator/device walkthrough. Metro starts under Node 20, but iOS simulator launch is blocked until full Xcode is installed.
- Add real line charts when runtime verification is available
- Add real reminder scheduling
- Add visual QA on small and large mobile screens

## Known Environment Requirement

The default shell may report Node `v14.18.1`. Expo 51 requires Node 18 or newer. Node 20 is installed through nvm and works for this project:

```bash
source ~/.nvm/nvm.sh
nvm use 20
npm start
```
