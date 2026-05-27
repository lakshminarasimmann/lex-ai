'use client';

import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface GaugeChartProps {
  score: number;
  label?: string;
}

export default function GaugeChart({ score, label = 'Risk Score' }: GaugeChartProps) {
  // Determine color based on risk score
  const getColor = (s: number) => {
    if (s <= 25) return '#10b981'; // Green (low)
    if (s <= 50) return '#f59e0b'; // Amber (medium)
    if (s <= 75) return '#f97316'; // Orange (high)
    return '#ef4444'; // Red (critical)
  };

  const getRiskLabel = (s: number) => {
    if (s <= 25) return 'LOW RISK';
    if (s <= 50) return 'MEDIUM RISK';
    if (s <= 75) return 'HIGH RISK';
    return 'CRITICAL RISK';
  };

  const chartColor = getColor(score);
  const data = [{ value: score, fill: chartColor }];

  return (
    <div className="flex flex-col items-center justify-center w-full h-[220px] relative select-none">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="80%"
          innerRadius="80%"
          outerRadius="110%"
          barSize={12}
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background={{ fill: 'rgba(255,255,255,0.05)' }}
            dataKey="value"
            cornerRadius={6}
          />
        </RadialBarChart>
      </ResponsiveContainer>

      {/* Central Metrics Overlays */}
      <div className="absolute inset-x-0 bottom-[20%] flex flex-col items-center justify-center text-center">
        <span className="text-5xl font-black tracking-tight text-white">{score}</span>
        <span className="text-xs font-extrabold tracking-widest mt-1" style={{ color: chartColor }}>
          {getRiskLabel(score)}
        </span>
        {label && <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mt-3 font-semibold">{label}</span>}
      </div>
    </div>
  );
}
