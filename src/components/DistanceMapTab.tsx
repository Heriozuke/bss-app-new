import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, MapPin, Navigation, Compass, Flame, Timer, Milestone } from 'lucide-react';

export default function DistanceMapTab() {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [distance, setDistance] = useState(0.0);
  const [calories, setCalories] = useState(0);
  const [mapProgress, setMapProgress] = useState(0); // 0 to 100 along the path
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
        setDistance((prev) => parseFloat((prev + 0.015).toFixed(3)));
        setCalories((prev) => prev + 1);
        setMapProgress((prev) => (prev + 0.5) % 100);
      }, 100); // accelerated demo pace
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleStop = () => {
    setIsRunning(false);
    setSeconds(0);
    setDistance(0);
    setCalories(0);
    setMapProgress(0);
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Mock Map Path Coordinate Generator for a organic loop
  // Center is around (150, 150)
  const pathPoints = [
    { x: 50, y: 150 },
    { x: 80, y: 80 },
    { x: 160, y: 50 },
    { x: 250, y: 70 },
    { x: 280, y: 140 },
    { x: 220, y: 220 },
    { x: 140, y: 240 },
    { x: 70, y: 200 },
  ];

  // Simple interpolation along the path for the runner's dot
  const getRunnerCoords = (progress: number) => {
    const segmentCount = pathPoints.length;
    const totalProgress = progress / 100;
    const exactIndex = totalProgress * segmentCount;
    const startIndex = Math.floor(exactIndex) % segmentCount;
    const endIndex = (startIndex + 1) % segmentCount;
    const segmentProgress = exactIndex - Math.floor(exactIndex);

    const startPoint = pathPoints[startIndex];
    const endPoint = pathPoints[endIndex];

    const x = startPoint.x + (endPoint.x - startPoint.x) * segmentProgress;
    const y = startPoint.y + (endPoint.y - startPoint.y) * segmentProgress;

    return { x, y };
  };

  const runnerPos = getRunnerCoords(mapProgress);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Map visualization (Large column) */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <MapPin className="text-emerald-500 w-5 h-5" />
              Active Run Route Tracker
            </h3>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-xl">
              Park Loop A
            </span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Real-time simulated GPS loop trail representing your run cadence and coordinates.
          </p>
        </div>

        {/* SVG Trail Map Grid */}
        <div className="relative border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950/40 my-6 overflow-hidden flex items-center justify-center p-4">
          <svg className="w-full max-w-[320px] aspect-square" viewBox="0 0 300 300">
            {/* Background Map Grid Pattern */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-900" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Custom Landscape graphics */}
            <circle cx="160" cy="150" r="45" fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-800/50" strokeWidth="10" strokeDasharray="5 5" />
            <rect x="30" y="30" width="50" height="40" rx="8" fill="currentColor" className="text-emerald-100/30 dark:text-emerald-950/10" />
            <rect x="210" y="220" width="60" height="40" rx="8" fill="currentColor" className="text-emerald-100/30 dark:text-emerald-950/10" />

            {/* Route Trail */}
            <path
              d="M 50 150 Q 80 80 160 50 T 280 140 T 140 240 Z"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="dark:stroke-slate-800"
            />
            {/* Inner trail outline */}
            <path
              d="M 50 150 Q 80 80 160 50 T 280 140 T 140 240 Z"
              fill="none"
              stroke="#10b981"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-70"
            />

            {/* Animated Runner Indicator */}
            <g transform={`translate(${runnerPos.x}, ${runnerPos.y})`}>
              {/* Ripple Ring */}
              <circle r="14" fill="#10b981" className="opacity-25 animate-ping" />
              {/* Solid circle wrapper */}
              <circle r="8" fill="#10b981" className="stroke-white stroke-[2]" />
              {/* Mini Arrow */}
              <circle r="3" fill="white" />
            </g>

            {/* Starting marker */}
            <g transform="translate(50, 150)">
              <circle r="4" fill="#f59e0b" className="stroke-white stroke-[1.5]" />
              <text x="8" y="4" className="text-[10px] font-black fill-amber-500 font-sans">START</text>
            </g>
          </svg>
        </div>

        {/* Action button controls */}
        <div className="flex gap-4">
          <button
            onClick={handleStartPause}
            className={`flex-1 py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
              isRunning
                ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/10'
                : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/10'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-white" /> Pause Session
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" /> Resume Workout
              </>
            )}
          </button>
          <button
            onClick={handleStop}
            className="px-5 py-3.5 rounded-2xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-500 dark:bg-slate-800 dark:hover:bg-slate-700/80 dark:text-slate-300 transition-all cursor-pointer flex items-center justify-center"
            title="Reset Trail"
          >
            <Square className="w-4 h-4 fill-slate-500 dark:fill-slate-300" />
          </button>
        </div>
      </div>

      {/* Tracker metrics (1 column) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Navigation className="text-emerald-500 w-5 h-5 animate-spin-slow" />
            Workout Telemetry
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Real-time biometric and telemetry calculations of your active jog.
          </p>
        </div>

        {/* Telemetry rows */}
        <div className="space-y-4 my-6">
          {/* Card 1: Stopwatch */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100/50 dark:border-slate-800/50 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duration</span>
              <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-mono">
                {formatTime(seconds)}
              </span>
            </div>
          </div>

          {/* Card 2: Distance */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100/50 dark:border-slate-800/50 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500">
              <Milestone className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Distance Covered</span>
              <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-mono">
                {distance.toFixed(2)} km
              </span>
            </div>
          </div>

          {/* Card 3: Calories */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100/50 dark:border-slate-800/50 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-500">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Calories Burned</span>
              <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-mono">
                {calories} kcal
              </span>
            </div>
          </div>
        </div>

        {/* Motivational advice */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/40 dark:border-emerald-900/10 text-center">
          <div className="flex justify-center mb-1">
            <Compass className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold leading-relaxed">
            {isRunning 
              ? 'Great pace! Keep your chin up and maintain breathing.'
              : 'Press Start to begin jogging and track your cadence.'}
          </p>
        </div>
      </div>
    </div>
  );
}
