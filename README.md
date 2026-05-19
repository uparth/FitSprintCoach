# FitSprint Coach

FitSprint Coach is a local-first Expo React Native app for agile weight-loss planning. It turns onboarding data into a body assessment, nutrition targets, a sprint roadmap, daily check-ins, sprint tasks, review, retrospective, and local JSON backup/import.

## Requirements

- Node.js 18 or newer. Node 20 is recommended and matches `.nvmrc`.
- npm
- Expo CLI through the local `expo` dependency

## Run

```bash
npm install
npm start
```

If the local shell is on Node 14, Expo will fail before the app starts because modern Expo uses newer JavaScript syntax. Switch to Node 18+ first.

## Verification

```bash
npm run typecheck
npm test
```

The current smoke test covers the domain calculation spine: BMI, healthy range, calorie safety bounds, macros, water target, weekly loss estimate, and roadmap generation.

## Architecture

- `src/domain`: pure TypeScript health, sprint, velocity, coaching, and chart logic
- `src/storage`: local JSON file storage, schemas, seed templates, migrations, export/import
- `src/store`: Zustand app state and persistence actions
- `src/screens`: onboarding, Today, Roadmap, Sprint, Nutrition, Progress, Review, Retrospective, Settings
- `src/components`: reusable UI, health, sprint, and chart components

The MVP intentionally uses no cloud database or external backend.
