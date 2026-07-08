import { MonthlyStat, WorkoutRoutine, Meal, FitnessTask, PersonalRecord } from './types';

export const INITIAL_MONTHLY_STATS: MonthlyStat[] = [
  { month: 'Jan', running: 50, cycling: 25, yoga: 45 },
  { month: 'Feb', running: 60, cycling: 40, yoga: 95 },
  { month: 'Mar', running: 60, cycling: 25, yoga: 40 },
  { month: 'Apr', running: 110, cycling: 75, yoga: 40 },
  { month: 'May', running: 110, cycling: 40, yoga: 10 },
  { month: 'Jun', running: 75, cycling: 40, yoga: 10 },
  { month: 'Jul', running: 110, cycling: 25, yoga: 80 },
  { month: 'Aug', running: 95, cycling: 60, yoga: 25 },
  { month: 'Sep', running: 95, cycling: 60, yoga: 45 },
  { month: 'Oct', running: 110, cycling: 25, yoga: 45 },
  { month: 'Nov', running: 110, cycling: 105, yoga: 45 },
  { month: 'Dec', running: 110, cycling: 60, yoga: 45 },
];

export const INITIAL_WORKOUT_ROUTINES: WorkoutRoutine[] = [
  { id: 'wr-1', name: 'Cardio Kickboxing', duration: 45, category: 'Cardio', completed: true, day: 'Mon', caloriesBurned: 350 },
  { id: 'wr-2', name: 'Leg Day & Squats', duration: 50, category: 'Strength', completed: false, day: 'Tue', caloriesBurned: 400 },
  { id: 'wr-3', name: 'Core Crusher HIIT', duration: 30, category: 'HIIT', completed: false, day: 'Wed', caloriesBurned: 300 },
  { id: 'wr-4', name: 'Yin Yoga & Flow', duration: 40, category: 'Flexibility', completed: true, day: 'Thu', caloriesBurned: 180 },
  { id: 'wr-5', name: 'Full Body Powerlifting', duration: 60, category: 'Strength', completed: false, day: 'Fri', caloriesBurned: 450 },
  { id: 'wr-6', name: 'Outdoor Trail Run', duration: 45, category: 'Cardio', completed: false, day: 'Sat', caloriesBurned: 380 },
  { id: 'wr-7', name: 'Sunday Active Stretch', duration: 25, category: 'Flexibility', completed: false, day: 'Sun', caloriesBurned: 120 },
];

export const INITIAL_DIET_MEALS: Meal[] = [
  {
    id: 'meal-1',
    name: 'Avocado & Egg Sourdough Toast',
    calories: 380,
    protein: 18,
    carbs: 32,
    fat: 16,
    category: 'Breakfast',
    logged: true,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'meal-2',
    name: 'Grilled Salmon with Asparagus',
    calories: 520,
    protein: 42,
    carbs: 12,
    fat: 26,
    category: 'Lunch',
    logged: false,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'meal-3',
    name: 'High-Protein Quinoa Salad',
    calories: 450,
    protein: 24,
    carbs: 58,
    fat: 14,
    category: 'Dinner',
    logged: false,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'meal-4',
    name: 'Greek Yogurt Berry Parfait',
    calories: 220,
    protein: 15,
    carbs: 28,
    fat: 4,
    category: 'Snack',
    logged: true,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400',
  },
];

export const INITIAL_FITNESS_TASKS: FitnessTask[] = [
  { id: 'task-1', title: 'Drink 3 Liters of Water', completed: true, category: 'hydration', value: '2.2L / 3.0L' },
  { id: 'task-2', title: 'Complete daily 45-min workout', completed: false, category: 'workout', value: '0/1 Done' },
  { id: 'task-3', title: 'Keep daily calorie intake under 2000 kcal', completed: true, category: 'nutrition', value: '1,450 kcal' },
  { id: 'task-4', title: 'Sleep for 8 Hours before 11 PM', completed: false, category: 'sleep', value: 'Target: 8h' },
  { id: 'task-5', title: 'Perform 10-minute dynamic stretching', completed: false, category: 'other' },
];

export const INITIAL_PERSONAL_RECORDS: PersonalRecord[] = [
  { id: 'pr-1', title: 'Longest Running Distance', value: '12.4 km', date: '2026-06-25', iconName: 'TrendingUp' },
  { id: 'pr-2', title: 'Max Squat Weight', value: '110 kg', date: '2026-07-02', iconName: 'Award' },
  { id: 'pr-3', title: 'Consecutive Water Streak', value: '14 Days', date: '2026-07-06', iconName: 'Activity' },
  { id: 'pr-4', title: 'Max Calories Burned in 1 Workout', value: '620 kcal', date: '2026-05-18', iconName: 'Flame' },
];
