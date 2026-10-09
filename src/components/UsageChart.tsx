'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowDownRight } from 'lucide-react';
import { Timeframe, UsageDataPoint } from '@/types/crypto';
import gsap from 'gsap';

interface UsageChartProps {
  dataPoints: UsageDataPoint[];
}

export const UsageChart: React.FC<UsageChartProps> = ({ dataPoints }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('Last Week');
  const [activeIdx, setActiveIdx] = useState<number>(2); // Default to 'Sep' (index 2) as in reference
  const containerRef = useRef<HTMLDivElement>(null);
  const chartSvgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const activePoint = dataPoints[activeIdx] || dataPoints[2];

  // Chart dimensions
  const svgWidth = 650;
  const svgHeight = 220;
  const paddingLeft = 55;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartW = svgWidth - paddingLeft - paddingRight;
  const chartH = svgHeight - paddingTop - paddingBottom;

  // Maximum value for scaling
  const maxVal = 16000;
  const minVal = 0;

  // Calculate coordinates for points
  const getX = (index: number) => paddingLeft + (index / (dataPoints.length - 1)) * chartW;
  const getY = (val: number) => paddingTop + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

  // Smooth Bezier Curve generator
  const createSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    let path = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 5;
      const cp1y = p1.y + (p2.y - p0.y) / 5;
      const cp2x = p2.x - (p3.x - p1.x) / 5;
      const cp2y = p2.y - (p3.y - p1.y) / 5;

      path += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
    return path;
  };

  const profitsPoints = dataPoints.map((d, i) => ({ x: getX(i), y: getY(d.profits) }));
  const depositsPoints = dataPoints.map((d, i) => ({ x: getX(i), y: getY(d.deposits) }));
  const assetsPoints = dataPoints.map((d, i) => ({ x: getX(i), y: getY(d.assets) }));

  const profitsPath = createSmoothPath(profitsPoints);
  const depositsPath = createSmoothPath(depositsPoints);
  const assetsPath = createSmoothPath(assetsPoints);

  // Active pin coordinates
  const activeX = getX(activeIdx);
  const activeProfitY = getY(activePoint.profits);
  const activeDepositY = getY(activePoint.deposits);

  // GSAP animation for initial load and active indicator changes
  useEffect(() => {
    if (tooltipRef.current) {
      gsap.fromTo(
        tooltipRef.current,
        { scale: 0.9, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 0.25, ease: 'power2.out' }
      );
    }
  }, [activeIdx]);

  return (
    <div
      ref={containerRef}
      className="bg-[#121418] border border-[#1e2128] rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 w-full shadow-lg relative overflow-hidden"
    >
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        {/* Left: Estimated Usage Stat */}
        <div>
          <span className="text-xs text-zinc-400 font-medium block">
            Estimated Usage
          </span>
          <div className="flex items-center gap-2.5 mt-1">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
              1,343,453
            </span>
            <div className="flex items-center gap-0.5 text-[11px] font-semibold text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
              <ArrowDownRight className="w-3 h-3 text-red-400" />
              <span>-2.32%</span>
            </div>
          </div>
        </div>

        {/* Right: Timeframe Switcher & Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          {/* Timeframe Pills */}
          <div className="flex items-center gap-4 text-xs">
            {(['Today', 'Last Week', 'Last Month'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`relative pb-1 font-medium transition-colors duration-200 ${
                  timeframe === tf ? 'text-white font-semibold' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tf}
                {timeframe === tf && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Chart Legend */}
          <div className="flex items-center gap-3.5 text-xs text-zinc-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#36d399]" />
              <span className="text-[11px] text-zinc-400">Assets</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#7c7bf2]" />
              <span className="text-[11px] text-zinc-400">Profits</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#d4f434]" />
              <span className="text-[11px] text-zinc-400">Deposits</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Chart Canvas */}
      <div className="relative w-full h-[220px] sm:h-[240px] md:h-[260px] select-none">
        <svg
          ref={chartSvgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Soft subtle glow filters */}
            <filter id="glow-purple" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-lime" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Subtle Gradient Area for Chart */}
            <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c7bf2" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#7c7bf2" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="limeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d4f434" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#d4f434" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Guides and Y-Axis Labels */}
          {[
            { label: '$15k', val: 15000 },
            { label: '$10k', val: 10000 },
            { label: '$5k', val: 5000 },
            { label: '$1k', val: 1000 },
          ].map((grid) => {
            const y = getY(grid.val);
            return (
              <g key={grid.label}>
                <text
                  x={paddingLeft - 12}
                  y={y + 4}
                  textAnchor="end"
                  fill="#6b7280"
                  fontSize="11"
                  fontFamily="inherit"
                  className="font-medium"
                >
                  {grid.label}
                </text>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#1c1f26"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {/* Area Fills */}
          <path
            d={`${profitsPath} L ${svgWidth - paddingRight},${svgHeight - paddingBottom} L ${paddingLeft},${svgHeight - paddingBottom} Z`}
            fill="url(#purpleGradient)"
          />
          <path
            d={`${depositsPath} L ${svgWidth - paddingRight},${svgHeight - paddingBottom} L ${paddingLeft},${svgHeight - paddingBottom} Z`}
            fill="url(#limeGradient)"
          />

          {/* Assets Path (Muted Dark Green/Cyan) */}
          <path
            d={assetsPath}
            fill="none"
            stroke="#203328"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Spline Curve 1: Profits (Purple) */}
          <path
            d={profitsPath}
            fill="none"
            stroke="#7c7bf2"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Spline Curve 2: Deposits (Neon Lime) */}
          <path
            d={depositsPath}
            fill="none"
            stroke="#d4f434"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Vertical Guide Line for Active Month */}
          <line
            x1={activeX}
            y1={paddingTop - 5}
            x2={activeX}
            y2={svgHeight - paddingBottom}
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeOpacity="0.25"
            strokeDasharray="2 2"
          />

          {/* Active Data Nodes (Luminous Circles) */}
          {/* Purple Node */}
          <circle
            cx={activeX}
            cy={activeProfitY}
            r="4.5"
            fill="#7c7bf2"
            stroke="#ffffff"
            strokeWidth="2"
            filter="url(#glow-purple)"
            className="transition-all duration-300"
          />

          {/* Lime Node */}
          <circle
            cx={activeX}
            cy={activeDepositY}
            r="4.5"
            fill="#d4f434"
            stroke="#ffffff"
            strokeWidth="2"
            filter="url(#glow-lime)"
            className="transition-all duration-300"
          />

          {/* X-Axis Month Labels & Clickable Hit Areas */}
          {dataPoints.map((d, i) => {
            const x = getX(i);
            const isSelected = i === activeIdx;

            return (
              <g
                key={d.month}
                onClick={() => setActiveIdx(i)}
                className="cursor-pointer group"
              >
                {/* Transparent hit area for easy hover/click */}
                <rect
                  x={x - 25}
                  y={paddingTop}
                  width="50"
                  height={svgHeight - paddingTop}
                  fill="transparent"
                />
                <text
                  x={x}
                  y={svgHeight - 12}
                  textAnchor="middle"
                  fill={isSelected ? '#ffffff' : '#6b7280'}
                  fontSize={isSelected ? '12' : '11'}
                  fontWeight={isSelected ? '700' : '500'}
                  className="transition-all duration-200 group-hover:fill-white"
                >
                  {d.month}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Interactive Floating Tooltip Popover (Positioned dynamically on activeX) */}
        <div
          ref={tooltipRef}
          style={{
            left: `${(activeX / svgWidth) * 100}%`,
            top: `${(Math.min(activeProfitY, activeDepositY) / svgHeight) * 100 - 32}%`,
            transform: 'translate(-50%, -50%)',
          }}
          className="absolute z-20 pointer-events-none transition-all duration-300 ease-out"
        >
          {/* White Tooltip Box matching reference design */}
          <div className="relative bg-white text-black px-3.5 py-2 rounded-xl shadow-2xl border border-zinc-200 min-w-[140px]">
            <p className="text-[10px] font-semibold text-zinc-500 mb-0.5">
              {activePoint.fullDate}
            </p>
            <div className="flex flex-col text-xs font-bold leading-snug">
              <span className="text-zinc-900">
                Price: <span className="font-extrabold">{activePoint.priceFormatted}</span>
              </span>
              <span className="text-zinc-900">
                Vol: <span className="font-extrabold">{activePoint.volFormatted}</span>
              </span>
            </div>

            {/* Little Bottom Arrow Pointer */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-zinc-200" />
          </div>
        </div>
      </div>
    </div>
  );
};
