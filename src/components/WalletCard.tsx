'use client';

import React, { useState } from 'react';
import { RotateCw, ChevronDown, ArrowUp } from 'lucide-react';
import { WalletInfo } from '@/types/crypto';

interface WalletCardProps {
  wallet: WalletInfo;
  onRefresh?: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  wallet,
  onRefresh,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState('Tether USDT');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currencies = ['Tether USDT', 'Bitcoin BTC', 'Ethereum ETH', 'Solana SOL'];

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 800);
  };


  // Sparkline points for wallet chart
  const points = wallet.chartPoints;
  const svgWidth = 320;
  const svgHeight = 70;
  const paddingLeft = 35;
  const paddingRight = 20;
  const paddingTop = 15;
  const paddingBottom = 15;

  const minVal = 28;
  const maxVal = 40;
  const chartW = svgWidth - paddingLeft - paddingRight;
  const chartH = svgHeight - paddingTop - paddingBottom;

  const getX = (idx: number) => paddingLeft + (idx / (points.length - 1)) * chartW;
  const getY = (val: number) => paddingTop + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

  // Build SVG path
  let path = '';
  const coords = points.map((p, i) => ({ x: getX(i), y: getY(p) }));

  if (coords.length > 0) {
    path = `M ${coords[0].x},${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i === 0 ? 0 : i - 1];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 4;
      const cp1y = p1.y + (p2.y - p0.y) / 4;
      const cp2x = p2.x - (p3.x - p1.x) / 4;
      const cp2y = p2.y - (p3.y - p1.y) / 4;

      path += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
  }

  // Peak/pin point (last point or highest point)
  const pinIdx = coords.length - 2;
  const pinCoord = coords[pinIdx] || coords[coords.length - 1];

  return (
    <div className="bg-[#121418] border border-[#1e2128] rounded-2xl md:rounded-3xl p-4 sm:p-5 w-full shadow-lg flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <h2 className="text-base font-bold tracking-tight text-white font-sans">
          Wallet
        </h2>

        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <span>{wallet.lastUpdated}</span>
          <button
            onClick={handleRefresh}
            className="w-6 h-6 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors"
            title="Refresh Wallet Balance"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#d4f434]' : 'text-zinc-400'}`} />
          </button>
        </div>
      </div>

      {/* Currency Selector Pill with Dropdown */}
      <div className="relative mb-2">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181a22] hover:bg-[#222530] border border-white/5 text-xs font-semibold text-white transition-colors"
        >
          <span className="w-4 h-4 rounded-full bg-[#26a17b] text-white flex items-center justify-center text-[10px] font-bold">
            ₮
          </span>
          <span>{selectedCurrency}</span>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-9 left-0 z-30 bg-[#181a22] border border-white/10 rounded-xl py-1 shadow-xl min-w-[140px]">
            {currencies.map((curr) => (
              <button
                key={curr}
                onClick={() => {
                  setSelectedCurrency(curr);
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-white/5 flex items-center justify-between"
              >
                <span>{curr}</span>
                {selectedCurrency === curr && <span className="w-1.5 h-1.5 rounded-full bg-[#d4f434]" />}
              </button>
            ))}
          </div>
        )}
      </div>


      {/* Balance & Growth Badge */}
      <div className="flex items-center gap-2.5 my-1">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
          {wallet.balance}
        </span>
        <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-[#1d2b1a] text-[#4ade80] text-xs font-bold border border-[#4ade80]/20">
          <ArrowUp className="w-3 h-3 stroke-[2.5]" />
          <span>{wallet.percentageChange}%</span>
        </div>
      </div>

      {/* Revenue Subtitle */}
      <div className="flex items-center gap-1 text-xs text-zinc-400 mb-2">
        <span>Your Revenue is <strong className="text-zinc-200 font-semibold">{wallet.revenueWeek}</strong> The Week</span>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-500 cursor-pointer" />
      </div>

      {/* Bottom Sparkline Mini Chart */}
      <div className="relative w-full h-20 pt-1 select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Wallet Chart Gradient */}
            <linearGradient id="walletGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#828830" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#828830" stopOpacity="0.0" />
            </linearGradient>
            <filter id="walletGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Left Y-axis ticks */}
          <text x={10} y={getY(34) + 4} fill="#6b7280" fontSize="10" fontWeight="500">
            34k
          </text>
          <text x={10} y={getY(30) + 4} fill="#6b7280" fontSize="10" fontWeight="500">
            30k
          </text>

          {/* Area Fill */}
          <path
            d={`${path} L ${svgWidth - paddingRight},${svgHeight - paddingBottom} L ${paddingLeft},${svgHeight - paddingBottom} Z`}
            fill="url(#walletGradient)"
          />

          {/* Line Path */}
          <path
            d={path}
            fill="none"
            stroke="#9ba939"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Glowing Pin Point */}
          <circle
            cx={pinCoord.x}
            cy={pinCoord.y}
            r="4"
            fill="#d4f434"
            stroke="#ffffff"
            strokeWidth="2"
            filter="url(#walletGlow)"
          />
        </svg>

        {/* Floating Price Pill Marker */}
        <div
          style={{
            left: `${(pinCoord.x / svgWidth) * 100}%`,
            top: `${(pinCoord.y / svgHeight) * 100}%`,
            transform: 'translate(-50%, -130%)',
          }}
          className="absolute z-10 pointer-events-none"
        >
          <div className="bg-white text-black px-2 py-0.5 rounded-full shadow-lg text-[10px] font-extrabold whitespace-nowrap border border-zinc-200">
            {wallet.currentPinValue}
          </div>
        </div>
      </div>
    </div>
  );
};
