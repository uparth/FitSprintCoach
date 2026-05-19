import { TaskTemplate } from "@/domain/models";

export const seedTemplates: TaskTemplate[] = [
  {
    id: "template_walk_10_easy",
    title: "Walk 10 minutes",
    category: "walking",
    points: 2,
    frequency: { type: "weekly", target: 4 },
    difficulty: "easy",
    estimatedMinutes: 10,
    definitionOfDone: "Complete a 10-minute easy walk.",
    fallback: "Walk for 5 minutes.",
    blockers: ["no_time", "low_energy", "weather"],
    tags: ["exercise", "walking", "beginner"],
    packIds: ["beginner_week", "walking_focus", "low_motivation_week"]
  },
  {
    id: "template_cycle_8_easy",
    title: "Cycle 8 minutes easy pace",
    category: "cycling",
    points: 2,
    frequency: { type: "weekly", target: 3 },
    difficulty: "easy",
    estimatedMinutes: 8,
    definitionOfDone: "Complete 8 minutes on the exercise bike at a comfortable pace.",
    fallback: "Cycle for 5 minutes.",
    blockers: ["low_energy", "no_time", "boredom"],
    tags: ["exercise", "bike", "beginner"],
    packIds: ["beginner_week", "cycling_focus"]
  },
  {
    id: "template_water_target",
    title: "Hit water target",
    category: "water",
    points: 2,
    frequency: { type: "weekly", target: 5 },
    difficulty: "easy",
    estimatedMinutes: 1,
    definitionOfDone: "Reach the planned water target for the day.",
    fallback: "Drink one full glass of water.",
    blockers: ["forgot", "travel"],
    tags: ["hydration", "daily"],
    packIds: ["beginner_week", "water_focus"]
  },
  {
    id: "template_protein_anchor",
    title: "Add one protein anchor meal",
    category: "protein",
    points: 3,
    frequency: { type: "weekly", target: 5 },
    difficulty: "easy",
    estimatedMinutes: 15,
    definitionOfDone: "Include a clear protein source in one home-cooked meal.",
    fallback: "Add curd, eggs, paneer, dal, chicken, tofu, or sprouts to one meal.",
    blockers: ["no_prep", "low_appetite"],
    tags: ["nutrition", "protein", "home_food"],
    packIds: ["beginner_week", "protein_focus", "food_reset_week"]
  },
  {
    id: "template_home_food",
    title: "Choose home-cooked food",
    category: "home_food",
    points: 3,
    frequency: { type: "weekly", target: 5 },
    difficulty: "easy",
    estimatedMinutes: 20,
    definitionOfDone: "Eat a planned home-cooked meal instead of ordering impulsively.",
    fallback: "Assemble the simplest available home meal.",
    blockers: ["late_work", "cravings", "no_groceries"],
    tags: ["nutrition", "home_food"],
    packIds: ["beginner_week", "busy_work_week", "food_reset_week"]
  },
  {
    id: "template_fiber_plate",
    title: "Add fiber to one meal",
    category: "fiber",
    points: 2,
    frequency: { type: "weekly", target: 5 },
    difficulty: "easy",
    estimatedMinutes: 5,
    definitionOfDone: "Add vegetables, fruit, beans, or whole grains to one meal.",
    fallback: "Add one fruit or simple salad.",
    blockers: ["no_prep", "forgot"],
    tags: ["nutrition", "fiber"],
    packIds: ["food_reset_week"]
  }
];
