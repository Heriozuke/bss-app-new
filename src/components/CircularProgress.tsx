import React from 'react';
import * as LucideIcons from 'lucide-react';

interface CircularProgressProps {
  percent: number; // 0 to 100
  color: string;   // hex or Tailwind color
  iconName: keyof typeof LucideIcons;
  label: string;
  value: string;
  subtitle: string;
}

export default function CircularProgress({
  percent,
  color,
  iconName,
  label,
  value,
  subtitle,
}: CircularProgressProps) {
  const Icon = LucideIcons[iconName] as React.ComponentType<any>;

  // SVG Ring Calculations
  const radius = 28;
  const strokeWidth = 4;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-6 transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
      {/* Icon and Progress Circle */}
      <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
        <svg className="absolute w-full h-full -rotate-90">
          {/* Background Ring */}
          <circle
            className="text-slate-100 dark:text-slate-800"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={normalizedRadius}
            cx="32"
            cy="32"
          />
          {/* Active Ring */}
          <circle
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx="32"
            cy="32"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Solid Circle with Icon */}
        <div 
          className="w-11 h-11 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: `${color}cc` }} // translucent colored background
        >
          {Icon ? <Icon className="w-5 h-5 animate-pulse-slow" /> : null}
        </div>
      </div>

      {/* Info labels */}
      <div className="flex flex-col min-w-0">
        <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight truncate">
          {value}
        </span>
        <span className="text-sm font-medium text-slate-400 dark:text-slate-500 truncate mt-1">
          {subtitle}
        </span>
      </div>
    </div>
  );
}
