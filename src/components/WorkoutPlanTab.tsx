import React, { useState } from 'react';
import { WorkoutRoutine } from '../types';
import { Dumbbell, Plus, Trash2, Calendar, Clock, Flame, Check } from 'lucide-react';

interface WorkoutPlanTabProps {
  routines: WorkoutRoutine[];
  onToggleRoutine: (id: string) => void;
  onAddRoutine: (routine: WorkoutRoutine) => void;
  onDeleteRoutine: (id: string) => void;
}

export default function WorkoutPlanTab({
  routines,
  onToggleRoutine,
  onAddRoutine,
  onDeleteRoutine,
}: WorkoutPlanTabProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('30');
  const [calories, setCalories] = useState('200');
  const [category, setCategory] = useState<'Cardio' | 'Strength' | 'Flexibility' | 'HIIT'>('Cardio');
  const [day, setDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'>('Mon');

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddRoutine({
      id: `wr-${Date.now()}`,
      name,
      duration: parseInt(duration, 10) || 30,
      caloriesBurned: parseInt(calories, 10) || 200,
      category,
      completed: false,
      day,
    });

    setName('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Workout Plan</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Plan, organize, and track your weekly exercise routines to hit your physical targets.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Schedule Workout
        </button>
      </div>

      {/* Grid of Days */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {daysOfWeek.map((currentDay) => {
          const dayRoutines = routines.filter((r) => r.day === currentDay);

          return (
            <div
              key={currentDay}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 flex flex-col min-h-[240px] transition-all hover:shadow-md"
            >
              {/* Day Header */}
              <div className="border-b border-slate-50 dark:border-slate-800 pb-2.5 mb-3 flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                  {currentDay === 'Mon' ? 'Monday' : 
                   currentDay === 'Tue' ? 'Tuesday' : 
                   currentDay === 'Wed' ? 'Wednesday' : 
                   currentDay === 'Thu' ? 'Thursday' : 
                   currentDay === 'Fri' ? 'Friday' : 
                   currentDay === 'Sat' ? 'Saturday' : 'Sunday'}
                </span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/80 px-2 py-0.5 rounded-full">
                  {dayRoutines.length} items
                </span>
              </div>

              {/* Day's workouts */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[220px] pr-0.5">
                {dayRoutines.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-6 text-center">
                    <Dumbbell className="w-5 h-5 text-slate-200 dark:text-slate-800 mb-1" />
                    <span className="text-[10px] font-semibold text-slate-300 dark:text-slate-700">Rest Day</span>
                  </div>
                ) : (
                  dayRoutines.map((routine) => (
                    <div
                      key={routine.id}
                      className={`group relative p-3 rounded-2xl border transition-all duration-300 ${
                        routine.completed
                          ? 'bg-emerald-50/40 border-emerald-100/50 dark:bg-emerald-950/10 dark:border-emerald-900/10'
                          : 'bg-slate-50/50 border-slate-100 dark:bg-slate-950/30 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700'
                      }`}
                    >
                      {/* Checkbox circle & Content */}
                      <div className="flex gap-2.5 items-start">
                        <button
                          onClick={() => onToggleRoutine(routine.id)}
                          className={`w-4 h-4 rounded-full border shrink-0 mt-0.5 flex items-center justify-center transition-all cursor-pointer ${
                            routine.completed
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500'
                          }`}
                        >
                          {routine.completed && <Check className="w-2.5 h-2.5 stroke-[4]" />}
                        </button>

                        <div className="flex-1 min-w-0">
                          <span
                            className={`block text-xs font-bold leading-tight truncate ${
                              routine.completed
                                ? 'text-slate-400 line-through dark:text-slate-600'
                                : 'text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            {routine.name}
                          </span>

                          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[9px] text-slate-400 font-medium">
                            <span className="flex items-center gap-0.5 bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                              <Clock className="w-2.5 h-2.5 text-slate-300" />
                              {routine.duration}m
                            </span>
                            <span className="flex items-center gap-0.5 bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                              <Flame className="w-2.5 h-2.5 text-orange-400" />
                              {routine.caloriesBurned}c
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Hover delete button */}
                      <button
                        onClick={() => onDeleteRoutine(routine.id)}
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md text-slate-300 hover:text-rose-500 dark:text-slate-700 dark:hover:text-rose-400 cursor-pointer"
                        title="Delete routine"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Workout Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-scale-up">
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
              <Calendar className="text-emerald-500 w-5 h-5" />
              Schedule Workout Routine
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
              Create a custom fitness routine to build your structured schedule.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">
                  Workout Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm"
                  placeholder="e.g. Upper Body Squats, HIIT Cardio"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">
                    Day of Week
                  </label>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm"
                  >
                    {daysOfWeek.map((d) => (
                      <option key={d} value={d}>
                        {d === 'Mon' ? 'Monday' : 
                         d === 'Tue' ? 'Tuesday' : 
                         d === 'Wed' ? 'Wednesday' : 
                         d === 'Thu' ? 'Thursday' : 
                         d === 'Fri' ? 'Friday' : 
                         d === 'Sat' ? 'Saturday' : 'Sunday'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm"
                  >
                    <option value="Cardio">Cardio</option>
                    <option value="Strength">Strength</option>
                    <option value="Flexibility">Flexibility</option>
                    <option value="HIIT">HIIT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">
                    Est. Calories Burn
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  Schedule Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
