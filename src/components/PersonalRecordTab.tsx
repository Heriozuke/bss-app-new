import React, { useState } from 'react';
import { PersonalRecord } from '../types';
import { Award, Plus, Trash2, Milestone, Calendar, TrendingUp, Sparkles, ShieldAlert, Zap } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface PersonalRecordTabProps {
  records: PersonalRecord[];
  onAddRecord: (record: PersonalRecord) => void;
  onDeleteRecord: (id: string) => void;
}

export default function PersonalRecordTab({
  records,
  onAddRecord,
  onDeleteRecord,
}: PersonalRecordTabProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [iconName, setIconName] = useState<string>('Award');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !value.trim()) return;

    onAddRecord({
      id: `pr-${Date.now()}`,
      title,
      value,
      date,
      iconName,
    });

    setTitle('');
    setValue('');
    setShowAddModal(false);
  };

  const getIconComponent = (name: string) => {
    const Icon = (LucideIcons as any)[name];
    if (!Icon) return <Award className="w-5 h-5 text-amber-500" />;
    return <Icon className="w-5 h-5 text-amber-500" />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Personal Records</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Store and commemorate your peak performance milestones, physical lifts, or endurance runs.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Log New Record
        </button>
      </div>

      {/* Grid of trophies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {records.map((rec) => (
          <div
            key={rec.id}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group relative flex flex-col justify-between overflow-hidden"
          >
            {/* Top row */}
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 border border-amber-100/30 dark:border-amber-900/10">
                {getIconComponent(rec.iconName)}
              </div>
              <button
                onClick={() => onDeleteRecord(rec.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-300 hover:text-rose-500 dark:text-slate-700 dark:hover:text-rose-400 transition-all cursor-pointer"
                title="Delete Record"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Record data */}
            <div>
              <span className="block text-2xl font-black text-slate-800 dark:text-slate-100 font-mono tracking-tight mb-1">
                {rec.value}
              </span>
              <span className="block text-xs font-bold text-slate-700 dark:text-slate-200 line-clamp-1">
                {rec.title}
              </span>
            </div>

            {/* Footer row */}
            <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {rec.date}
              </span>
              <span className="text-emerald-500 font-bold flex items-center gap-0.5">
                <Zap className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                Active Record
              </span>
            </div>

            {/* Glowing gold ring background highlight */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Motivational Trophy Case banner */}
      <div className="p-6 rounded-3xl bg-slate-900 dark:bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1 relative z-10 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse-slow" />
            <h3 className="text-base font-extrabold text-white">Your Hall of Achievements</h3>
          </div>
          <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
            Consistently testing your physical limitations pays off. Every logged lift or jog is a monument to your physical strength. Update them regularly to observe compound growth!
          </p>
        </div>
        <div className="flex items-center gap-3 relative z-10 bg-slate-800/60 dark:bg-slate-900/50 px-4 py-3 rounded-2xl border border-slate-700/50">
          <Award className="w-8 h-8 text-amber-400 shrink-0" />
          <div className="text-left">
            <span className="block text-xs font-black text-slate-200">Consistency Badge</span>
            <span className="block text-[10px] text-emerald-400 font-bold">Unlocks at 5 Records</span>
          </div>
        </div>

        {/* Dynamic abstract grid pattern in dark case */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]" />
      </div>

      {/* Add record modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-scale-up">
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
              <Award className="text-emerald-500 w-5 h-5" />
              Log Achievement Milestone
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
              Celebrate your personal fitness peak by recording your exact telemetry metrics.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">
                  Record Name / Description
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm"
                  placeholder="e.g. Max Bench Press, Fastest 5K Run, Deadlift"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">
                    Metric Value achieved
                  </label>
                  <input
                    type="text"
                    required
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm"
                    placeholder="e.g. 120 kg, 19:42 mins"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">
                    Achievement Icon
                  </label>
                  <select
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm"
                  >
                    <option value="Award">Trophy Badge</option>
                    <option value="TrendingUp">Trend Line</option>
                    <option value="Activity">Pulse Graph</option>
                    <option value="Flame">Fire Flame</option>
                    <option value="Milestone">Milestone Marker</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">
                  Achievement Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm"
                />
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
                  Log Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
