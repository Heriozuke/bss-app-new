import React, { useState } from 'react';
import { FitnessTask } from '../types';
import { CheckSquare, Plus, Trash2, Droplet, Dumbbell, Apple, Moon, Sparkles, PlusCircle } from 'lucide-react';

interface TaskTabProps {
  tasks: FitnessTask[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: FitnessTask) => void;
  onDeleteTask: (id: string) => void;
}

export default function TaskTab({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
}: TaskTabProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<FitnessTask['category']>('other');
  const [newValue, setNewValue] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      id: `task-${Date.now()}`,
      title: newTitle,
      completed: false,
      category: newCategory,
      value: newValue.trim() ? newValue.trim() : undefined,
    });

    setNewTitle('');
    setNewValue('');
  };

  const categories = [
    { value: 'all', label: 'All Tasks' },
    { value: 'hydration', label: 'Hydration', icon: Droplet, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' },
    { value: 'workout', label: 'Workouts', icon: Dumbbell, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' },
    { value: 'nutrition', label: 'Nutrition', icon: Apple, color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/20' },
    { value: 'sleep', label: 'Sleep Quality', icon: Moon, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20' },
    { value: 'other', label: 'Other', icon: Sparkles, color: 'text-pink-500 bg-pink-50 dark:bg-pink-950/20' },
  ];

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'all') return true;
    return t.category === filter;
  });

  const getCategoryStyles = (cat: FitnessTask['category']) => {
    const found = categories.find((c) => c.value === cat);
    return found ? { icon: found.icon, color: found.color } : { icon: Sparkles, color: 'text-slate-500 bg-slate-50' };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      {/* List column (2 cols wide) */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Fitness Checklist</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Complete daily fitness milestones to stay aligned with training goals and keep streaks active.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                filter === cat.value
                  ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-950 shadow-md shadow-slate-900/10'
                  : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {cat.icon && <cat.icon className="w-3.5 h-3.5" />}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Task Items */}
        <div className="space-y-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center justify-center">
              <CheckSquare className="w-8 h-8 text-slate-200 dark:text-slate-800 mb-2" />
              <span className="text-xs font-bold text-slate-400 dark:text-slate-600">No active checklist items found.</span>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const { icon: CatIcon, color: catColor } = getCategoryStyles(task.category);

              return (
                <div
                  key={task.id}
                  className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                    task.completed
                      ? 'bg-slate-50/50 border-slate-100/50 dark:bg-slate-950/20 dark:border-slate-800/50'
                      : 'bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm'
                  }`}
                >
                  {/* Left Content */}
                  <div className="flex items-center gap-4 min-w-0">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className={`w-5 h-5 rounded-lg border shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                        task.completed
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20'
                          : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500'
                      }`}
                    >
                      {task.completed && (
                        <svg className="w-3 h-3 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    <div className="min-w-0">
                      <span
                        className={`block text-xs font-bold leading-tight ${
                          task.completed
                            ? 'text-slate-400 line-through dark:text-slate-600'
                            : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {task.title}
                      </span>
                      {task.value && (
                        <span className="text-[10px] font-semibold text-emerald-500 dark:text-emerald-400 font-mono mt-0.5 block">
                          {task.value}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Tags / Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className={`p-2 rounded-xl text-xs font-bold shrink-0 ${catColor}`}>
                      <CatIcon className="w-3.5 h-3.5" />
                    </div>

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-300 hover:text-rose-500 dark:text-slate-700 dark:hover:text-rose-400 transition-all cursor-pointer"
                      title="Remove checklist item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add form (1 col wide) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm h-fit">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
          <PlusCircle className="text-emerald-500 w-5 h-5 animate-pulse-slow" />
          Create Fitness Task
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
          Schedule customized daily milestones with specific tracking goals.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">
              Task Title / Goal
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm"
              placeholder="e.g. Abs session, Drink water"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">
              Category Group
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm"
            >
              <option value="hydration">Hydration</option>
              <option value="workout">Workout</option>
              <option value="nutrition">Nutrition</option>
              <option value="sleep">Sleep Quality</option>
              <option value="other">Other Activity</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">
              Target Value (Optional)
            </label>
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm"
              placeholder="e.g. 3.0 Liters, 45 mins"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/25 cursor-pointer mt-2"
          >
            Schedule Daily Milestone
          </button>
        </form>
      </div>
    </div>
  );
}
