'use client';

import React, { useEffect, useState } from 'react';

interface GaugeChartProps {
  score: number;
  label?: string;
}

export default function GaugeChart({ score, label = 'Risk Score' }: GaugeChartProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const getColor = (s: number) => {
    if (s <= 25) return '#10B981';
    if (s <= 50) return '#F59E0B';
    if (s <= 75) return '#f97316';
    return '#EF4444';
  };

  const getRiskLabel = (s: number) => {
    if (s <= 25) return 'LOW';
    if (s <= 50) return 'MEDIUM';
    if (s <= 75) return 'HIGH';
    return 'CRITICAL';
  };

  const chartColor = getColor(score);
  const riskLabel = getRiskLabel(score);

  // SVG arc calculation for the dial
  const radius = 80;
  const strokeWidth = 8;
  const center = 100;
  const startAngle = -210;
  const endAngle = 30;
  const totalAngle = endAngle - startAngle; // 240 degrees
  const scoreAngle = startAngle + (animatedScore / 100) * totalAngle;

  const polarToCartesian = (angle: number, r: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    };
  };

  const describeArc = (start: number, end: number, r: number) => {
    const s = polarToCartesian(start, r);
    const e = polarToCartesian(end, r);
    const largeArcFlag = end - start <= 180 ? 0 : 1;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${e.x} ${e.y}`;
  };

  // Segment boundaries for colored zones
  const segments = [
    { start: startAngle, end: startAngle + totalAngle * 0.25, color: '#10B981', label: 'Low' },
    { start: startAngle + totalAngle * 0.25, end: startAngle + totalAngle * 0.5, color: '#F59E0B', label: 'Med' },
    { start: startAngle + totalAngle * 0.5, end: startAngle + totalAngle * 0.75, color: '#f97316', label: 'High' },
    { start: startAngle + totalAngle * 0.75, end: endAngle, color: '#EF4444', label: 'Crit' },
  ];

  // Needle endpoint
  const needleEnd = polarToCartesian(scoreAngle, radius - 15);

  return (
    <div className="flex flex-col items-center justify-center w-full h-[240px] relative select-none">
      <svg viewBox="0 0 200 140" className="w-full max-w-[280px]">
        {/* Background track */}
        <path
          d={describeArc(startAngle, endAngle, radius)}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Risk zone segments */}
        {segments.map((seg, i) => (
          <path
            key={i}
            d={describeArc(seg.start, seg.end, radius)}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            opacity={0.15}
          />
        ))}

        {/* Active score arc */}
        <path
          d={describeArc(startAngle, scoreAngle, radius)}
          fill="none"
          stroke={chartColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 6px ${chartColor}40)`,
          }}
        />

        {/* Needle */}
        <line
          x1={center}
          y1={center}
          x2={needleEnd.x}
          y2={needleEnd.y}
          stroke={chartColor}
          strokeWidth={2.5}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 4px ${chartColor}60)`,
          }}
        />

        {/* Center dot */}
        <circle cx={center} cy={center} r={4} fill={chartColor} />
        <circle cx={center} cy={center} r={2} fill="#090B0F" />

        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const angle = startAngle + (tick / 100) * totalAngle;
          const outer = polarToCartesian(angle, radius + 6);
          const inner = polarToCartesian(angle, radius + 2);
          return (
            <line
              key={tick}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* Score display */}
      <div className="absolute bottom-4 flex flex-col items-center justify-center text-center">
        <span className="text-5xl font-black tracking-tight text-[#F8FAFC] font-display tabular-nums">
          {animatedScore}
        </span>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="risk-dot" style={{ background: chartColor, boxShadow: `0 0 8px ${chartColor}60` }} />
          <span className="text-[11px] font-bold tracking-[0.15em] uppercase" style={{ color: chartColor }}>
            {riskLabel} RISK
          </span>
        </div>
        {label && (
          <span className="text-[10px] text-[#667085] uppercase tracking-wider mt-2 font-semibold font-label">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
