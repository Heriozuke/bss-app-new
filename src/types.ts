export type TabType =
  | 'dashboard-light'
  | 'dashboard-dark'
  | 'workout-statistic'
  | 'workout-plan'
  | 'distance-map'
  | 'diet-food-menu'
  | 'personal-record'
  | 'task'
  | 'bss-dashboard'
  | 'bss-karyawan'
  | 'bss-absensi';

export interface MonthlyStat {
  month: string;
  running: number;
  cycling: number;
  yoga: number;
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  duration: number; // in minutes
  category: 'Cardio' | 'Strength' | 'Flexibility' | 'HIIT';
  completed: boolean;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  caloriesBurned: number;
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  logged: boolean;
  image: string;
}

export interface FitnessTask {
  id: string;
  title: string;
  completed: boolean;
  category: 'hydration' | 'workout' | 'nutrition' | 'sleep' | 'other';
  value?: string;
}

export interface PersonalRecord {
  id: string;
  title: string;
  value: string;
  date: string;
  iconName: string; // lucide icon name
}
