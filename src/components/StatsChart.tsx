import React, { useState } from 'react';
import { MonthlyStat } from '../types';
import { Calendar, Plus, ChevronDown, Check } from 'lucide-react';

interface StatsChartProps {
  stats: MonthlyStat[];
  onAddStat: (stat: MonthlyStat) => void;
}

export default function StatsChart({ stats, onAddStat }: StatsChartProps) {
  const [timeframe, setTimeframe] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Yearly');
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showLogModal, setShowLogModal] = useState(false);

  // Form states
  const [formMonth, setFormMonth] = useState('Jan');
  const [formRunning, setFormRunning] = useState('60');
  const [formCycling, setFormCycling] = useState('45');
  const [formYoga, setFormYoga] = useState('30');

  // Multipliers/filters depending on selected timeframe (for high interactive play)
  const adjustedStats = stats.map((s) => {
    if (timeframe === 'Weekly') {
      return {
        ...s,
        running: Math.round(s.running * 0.15),
        cycling: Math.round(s.cycling * 0.12),
        yoga: Math.round(s.yoga * 0.1),
      };
    } else if (timeframe === 'Monthly') {
      return {
        ...s,
        running: Math.round(s.running * 0.5),
        cycling: Math.round(s.cycling * 0.45),
        yoga: Math.round(s.yoga * 0.4),
      };
    }
    return s;
  });

  // SVG dimensions
  const viewWidth = 900;
  const viewHeight = 280;
  const paddingLeft = 40;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = viewWidth - paddingLeft - paddingRight;
  const chartHeight = viewHeight - paddingTop - paddingBottom;
  const maxVal = 120;

  // Compute SVG coordinates for each point
  const getCoordinates = (type: 'running' | 'cycling' | 'yoga') => {
    return adjustedStats.map((stat, i) => {
      const x = paddingLeft + (i / (adjustedStats.length - 1)) * chartWidth;
      const val = stat[type];
      const y = paddingTop + chartHeight - (val / maxVal) * chartHeight;
      return { x, y, value: val, month: stat.month };
    });
  };

  const runningCoords = getCoordinates('running');
  const cyclingCoords = getCoordinates('cycling');
  const yogaCoords = getCoordinates('yoga');

  // Convert coordinate array to SVG path (straight lines or nice smooth bezier paths)
  const getPathString = (coords: { x: number; y: number }[]) => {
    return coords.reduce((acc, coord, i) => {
      if (i === 0) return `M ${coord.x} ${coord.y}`;
      return `${acc} L ${coord.x} ${coord.y}`;
    }, '');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStat({
      month: formMonth,
      running: parseInt(formRunning, 10) || 0,
      cycling: parseInt(formCycling, 10) || 0,
      yoga: parseInt(formYoga, 10) || 0,
    });
    setShowLogModal(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:shadow-md">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Workout Statistic</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Lorem ipsum dolor sit amet, consectetur</p>
        </div>

        {/* Legend indicators & Timeframe selector */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Running Indicator (Green) */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#2dc84c]"></span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">45%</span>
              <span className="text-[10px] font-medium text-slate-400">Running</span>
            </div>
          </div>

          {/* Cycling Indicator (Orange) */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff9f43]"></span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">28%</span>
              <span className="text-[10px] font-medium text-slate-400">Cycling</span>
            </div>
          </div>

          {/* Yoga Indicator (Blue) */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#00a8ff]"></span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">27%</span>
              <span className="text-[10px] font-medium text-slate-400">Yoga</span>
            </div>
          </div>

          {/* Timeframe Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 rounded-xl transition-all border border-slate-100 dark:border-slate-800 cursor-pointer"
            >
              <span>{timeframe}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-1.5 w-32 z-30 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-1 overflow-hidden animate-fade-in">
                {(['Weekly', 'Monthly', 'Yearly'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTimeframe(t);
                      setShowDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                      timeframe === t ? 'text-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span>{t}</span>
                    {timeframe === t && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Log Workout Button */}
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all shadow-md shadow-emerald-500/15 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log</span>
          </button>
        </div>
      </div>

      {/* Interactive Chart Area */}
      <div className="relative w-full overflow-x-auto select-none" style={{ minHeight: '300px' }}>
        <div style={{ minWidth: '800px', position: 'relative' }}>
          <svg className="w-full h-auto" viewBox={`0 0 ${viewWidth} ${viewHeight}`}>
            {/* Grid Lines (Horizontal) */}
            {[0, 30, 60, 90, 120].map((val, idx) => {
              const y = paddingTop + chartHeight - (val / maxVal) * chartHeight;
              return (
                <g key={idx}>
                  {/* Grid Line */}
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={viewWidth - paddingRight}
                    y2={y}
                    className="stroke-slate-100 dark:stroke-slate-800/80"
                    strokeWidth="1"
                    strokeDasharray={val === 0 ? '' : '4 4'}
                  />
                  {/* Axis Label */}
                  <text
                    x={paddingLeft - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-slate-400 dark:fill-slate-500 font-mono text-[10px] font-medium"
                  >
                    {timeframe === 'Weekly' ? Math.round(val * 0.15) : timeframe === 'Monthly' ? Math.round(val * 0.5) : val}
                  </text>
                </g>
              );
            })}

            {/* Vertical column active-area bars (for intuitive hovering) */}
            {adjustedStats.map((stat, i) => {
              const x = paddingLeft + (i / (adjustedStats.length - 1)) * chartWidth;
              const barWidth = chartWidth / adjustedStats.length;

              return (
                <g key={i}>
                  {/* Invisible Hover Anchor */}
                  <rect
                    x={x - barWidth / 2}
                    y={paddingTop}
                    width={barWidth}
                    height={chartHeight}
                    fill="transparent"
                    className="cursor-crosshair"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />

                  {/* Active Month Column Guide Line */}
                  {hoveredIndex === i && (
                    <line
                      x1={x}
                      y1={paddingTop}
                      x2={x}
                      y2={paddingTop + chartHeight}
                      className="stroke-emerald-400/50 dark:stroke-emerald-500/30"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Month labels */}
                  <text
                    x={x}
                    y={viewHeight - 10}
                    textAnchor="middle"
                    className={`font-semibold text-[10px] transition-colors ${
                      hoveredIndex === i ? 'fill-emerald-500 font-bold' : 'fill-slate-400 dark:fill-slate-500'
                    }`}
                  >
                    {stat.month}
                  </text>
                </g>
              );
            })}

            {/* Render Paths */}
            <path
              d={getPathString(runningCoords)}
              fill="none"
              stroke="#2dc84c"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-500"
            />
            <path
              d={getPathString(cyclingCoords)}
              fill="none"
              stroke="#ff9f43"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-500"
            />
            <path
              d={getPathString(yogaCoords)}
              fill="none"
              stroke="#00a8ff"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-500"
            />

            {/* Circles / Dots for active nodes */}
            {runningCoords.map((coord, i) => (
              <circle
                key={`run-${i}`}
                cx={coord.x}
                cy={coord.y}
                r={hoveredIndex === i ? "6" : "4.5"}
                className="stroke-[#2dc84c] stroke-[3] fill-white dark:fill-slate-900 transition-all cursor-pointer"
              />
            ))}
            {cyclingCoords.map((coord, i) => (
              <circle
                key={`cyc-${i}`}
                cx={coord.x}
                cy={coord.y}
                r={hoveredIndex === i ? "6" : "4.5"}
                className="stroke-[#ff9f43] stroke-[3] fill-white dark:fill-slate-900 transition-all cursor-pointer"
              />
            ))}
            {yogaCoords.map((coord, i) => (
              <circle
                key={`yog-${i}`}
                cx={coord.x}
                cy={coord.y}
                r={hoveredIndex === i ? "6" : "4.5"}
                className="stroke-[#00a8ff] stroke-[3] fill-white dark:fill-slate-900 transition-all cursor-pointer"
              />
            ))}
          </svg>

          {/* Floating Tooltip details */}
          {hoveredIndex !== null && (
            <div
              className="absolute z-20 bg-slate-950/95 text-white rounded-2xl p-3 shadow-2xl border border-slate-800 text-[11px] pointer-events-none transition-all duration-150 animate-scale-up"
              style={{
                left: `${runningCoords[hoveredIndex].x + 10}px`,
                top: `${Math.min(100, runningCoords[hoveredIndex].y - 40)}px`,
              }}
            >
              <div className="font-bold border-b border-slate-800 pb-1 mb-1.5 flex items-center justify-between gap-4">
                <span>{adjustedStats[hoveredIndex].month} Statistics</span>
                <span className="text-[9px] text-emerald-400 uppercase tracking-widest">{timeframe}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-6">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2dc84c]"></span>
                    Running:
                  </span>
                  <span className="font-bold text-slate-100">{runningCoords[hoveredIndex].value} cal</span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff9f43]"></span>
                    Cycling:
                  </span>
                  <span className="font-bold text-slate-100">{cyclingCoords[hoveredIndex].value} cal</span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00a8ff]"></span>
                    Yoga:
                  </span>
                  <span className="font-bold text-slate-100">{yogaCoords[hoveredIndex].value} cal</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Log Workout Data Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-scale-up">
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
              <Calendar className="text-emerald-500 w-5 h-5" />
              Log Fitness Activity
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
              Enter calories burned for Running, Cycling, or Yoga for a specific month.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                    Target Month
                  </label>
                  <select
                    value={formMonth}
                    onChange={(e) => setFormMonth(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    {stats.map((s) => (
                      <option key={s.month} value={s.month}>
                        {s.month}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                    Running (Calories)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="150"
                    value={formRunning}
                    onChange={(e) => setFormRunning(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                    Cycling (Calories)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="150"
                    value={formCycling}
                    onChange={(e) => setFormCycling(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                    Yoga (Calories)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="150"
                    value={formYoga}
                    onChange={(e) => setFormYoga(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all animate-pulse-slow"
                >
                  Log Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
