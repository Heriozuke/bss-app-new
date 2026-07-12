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
  | 'bss-absensi'
  | 'bss-payroll'
  | 'bss-settings'
  | 'bss-pkwt';

export interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNik: string;
  jabatan: string;
  penempatan: string;
  rekening: string;
  periodMonth: string; // "01" - "12"
  periodYear: string;  // e.g. "2026"
  
  attendanceHadir: number;
  attendanceSakit: number;
  attendanceIzin: number;
  attendanceAlpa: number;

  gajiPokok: number;
  tunjanganJabatan: number;
  tunjanganMakanTransport: number;
  tunjanganLainnya: number;
  
  potonganBpjsKesehatan: number;
  potonganBpjsKetenagakerjaan: number;
  potonganPPh21: number;
  potonganAbsensi: number;
  potonganLainnya: number;

  totalPenerimaan: number;
  totalPotongan: number;
  takeHomePay: number;
  createdAt: string;
  note?: string;
}

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
