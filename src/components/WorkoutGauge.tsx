import React, { useState } from 'react';
import { Target, Trophy } from 'lucide-react';

interface WorkoutGaugeProps {
  percent: number;
  onSetPercent: (newPercent: number) => void;
}

export default function WorkoutGauge({ percent, onSetPercent }: WorkoutGaugeProps) {
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [tempPercent, setTempPercent] = useState(percent.toString());

  const totalTicks = 42;
  const activeTicks = Math.round((percent / 100) * totalTicks);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(tempPercent, 10);
    if (!isNaN(val) && val >= 0 && val <= 100) {
      onSetPercent(val);
      setShowTargetModal(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-between h-full transition-all duration-300 hover:shadow-md">
      <div className="w-full text-left">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Workout Progress</h3>
      </div>

      {/* Tick gauge container */}
      <div className="relative flex items-center justify-center w-56 h-56 mt-4">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          {Array.from({ length: totalTicks }).map((_, index) => {
            // Angle spans from 135 to 405 degrees (clockwise, leaving a nice 90-deg gap at bottom)
            const angleDeg = 135 + (index / (totalTicks - 1)) * 270;
            const angleRad = (angleDeg * Math.PI) / 180;

            // Gauge tick start & end coordinates
            const rInner = 68;
            const x1 = 100 + rInner * Math.cos(angleRad);
            const y1 = 100 + rInner * Math.sin(angleRad);

            const rOuter = 82;
            const x2 = 100 + rOuter * Math.cos(angleRad);
            const y2 = 100 + rOuter * Math.sin(angleRad);

            const isActive = index < activeTicks;

            return (
              <line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className="transition-all duration-300"
                stroke={isActive ? '#2dc84c' : '#e2e8f0'}
                strokeWidth={isActive ? '3' : '1.5'}
                style={{
                  stroke: isActive ? '#2dc84c' : undefined,
                  opacity: isActive ? 1 : 0.4
                }}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-baseline justify-center">
            <span className="text-5xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
              {percent}
            </span>
            <span className="text-lg font-bold text-emerald-500 dark:text-emerald-400 ml-0.5">%</span>
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" />
            Active
          </span>
        </div>
      </div>

      {/* Description & Interactive Set Target Button */}
      <div className="text-center mt-4 w-full px-2">
        <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
        </p>
        <button
          onClick={() => {
            setTempPercent(percent.toString());
            setShowTargetModal(true);
          }}
          className="w-full py-3 px-4 rounded-xl text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <Target className="w-4 h-4" />
          Set Target
        </button>
      </div>

      {/* Target Input Modal */}
      {showTargetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative animate-scale-up">
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
              <Target className="text-emerald-500 w-5 h-5" />
              Adjust Target Progress
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
              Enter a percentage target (0% to 100%) to update your active progress.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Target Achieved (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={tempPercent}
                    onChange={(e) => setTempPercent(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                    placeholder="e.g. 81"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowTargetModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  Save Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
