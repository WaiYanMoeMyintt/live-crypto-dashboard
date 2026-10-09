'use client';

import React, { useState } from 'react';
import { CryptoIcon } from '../CryptoIcon';
import { TickerData } from '@/hooks/useBinanceLive';
import { Activity, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { ProPriceFlowChart } from '../ProPriceFlowChart';

interface TradingGridViewProps {
  tickers: Record<string, TickerData>;
}

interface DefaultPairInfo {
  symbol: string;
  fallbackPrice: number;
  fallbackChange: number;
  high: number;
  low: number;
  vol: string;
}

const DEFAULT_PAIRS: DefaultPairInfo[] = [
  { symbol: 'BTC', fallbackPrice: 86292.02, fallbackChange: 1.49, high: 87220, low: 83888, vol: '3.15B' },
  { symbol: 'ETH', fallbackPrice: 2726.37, fallbackChange: 1.06, high: 2780, low: 2690, vol: '1.48B' },
  { symbol: 'SOL', fallbackPrice: 184.60, fallbackChange: 4.82, high: 188.5, low: 175.2, vol: '980M' },
  { symbol: 'BNB', fallbackPrice: 632.10, fallbackChange: 0.95, high: 645, low: 625, vol: '410M' },
  { symbol: 'XRP', fallbackPrice: 1.84, fallbackChange: 1.82, high: 1.92, low: 1.76, vol: '820M' },
  { symbol: 'DOGE', fallbackPrice: 0.1850, fallbackChange: 3.75, high: 0.194, low: 0.178, vol: '640M' },
  { symbol: 'ADA', fallbackPrice: 0.7250, fallbackChange: 11.09, high: 0.758, low: 0.650, vol: '380M' },
  { symbol: 'AVAX', fallbackPrice: 26.80, fallbackChange: 2.33, high: 28.2, low: 25.4, vol: '310M' },
  { symbol: 'LINK', fallbackPrice: 18.40, fallbackChange: 1.49, high: 19.1, low: 17.8, vol: '290M' },
  { symbol: 'SUI', fallbackPrice: 2.85, fallbackChange: 5.69, high: 2.98, low: 2.65, vol: '420M' },
  { symbol: 'NEAR', fallbackPrice: 5.16, fallbackChange: 8.01, high: 5.38, low: 4.75, vol: '290M' },
  { symbol: 'ALGO', fallbackPrice: 0.2450, fallbackChange: 2.15, high: 0.258, low: 0.236, vol: '145M' },
];

const SPARKLINE_POINTS: Record<string, number[]> = {
  BTC: [20, 24, 18, 28, 35, 30, 42, 45, 52, 50, 58, 62],
  ETH: [18, 22, 20, 26, 30, 28, 36, 40, 44, 48, 52, 55],
  SOL: [12, 18, 16, 25, 35, 32, 42, 48, 55, 58, 60, 64],
  BNB: [25, 28, 26, 30, 32, 35, 36, 40, 42, 45, 46, 48],
  XRP: [22, 25, 20, 28, 32, 30, 38, 42, 46, 50, 52, 54],
  DOGE: [15, 20, 18, 26, 38, 36, 45, 52, 56, 60, 58, 62],
  ADA: [16, 20, 18, 24, 30, 36, 42, 48, 54, 58, 60, 64],
  AVAX: [24, 22, 26, 30, 28, 35, 40, 44, 46, 50, 52, 55],
  LINK: [28, 30, 27, 32, 36, 38, 42, 46, 50, 52, 54, 56],
  SUI: [10, 16, 22, 28, 34, 42, 48, 52, 56, 58, 60, 63],
  NEAR: [18, 22, 25, 30, 35, 40, 45, 50, 54, 58, 60, 62],
  ALGO: [15, 17, 18, 20, 22, 25, 28, 30, 32, 34, 36, 38],
};

// Generates smooth SVG spline path from data points
function createSmoothPath(points: number[], width: number, height: number): { linePath: string; areaPath: string } {
  if (!points || points.length === 0) return { linePath: '', areaPath: '' };

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const paddingY = 4;
  const usableH = height - paddingY * 2;

  const coords = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * width;
    const y = height - paddingY - ((val - min) / range) * usableH;
    return { x, y };
  });

  if (coords.length === 1) return { linePath: `M ${coords[0].x} ${coords[0].y}`, areaPath: '' };

  let linePath = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const curr = coords[i];
    const next = coords[i + 1];
    const mx = (curr.x + next.x) / 2;
    linePath += ` Q ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}, ${mx.toFixed(1)} ${((curr.y + next.y) / 2).toFixed(1)}`;
  }
  linePath += ` L ${coords[coords.length - 1].x.toFixed(1)} ${coords[coords.length - 1].y.toFixed(1)}`;

  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;
  return { linePath, areaPath };
}

export const TradingGridView: React.FC<TradingGridViewProps> = ({ tickers }) => {
  const [selectedPair, setSelectedPair] = useState('BTC');

  return (
    <div className="flex flex-col gap-5 w-full animate-in fade-in duration-300">
      {/* 1. Full Binance Futures Pro Candlestick Price Flow Engine */}
      <ProPriceFlowChart
        initialSymbol={`${selectedPair}USDT`}
        tickers={tickers}
        isStandalone={true}
      />

      {/* 2. Multi-Market Grid Cards */}
      <div className="bg-[#121418] border border-[#1e2128] rounded-3xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#d4f434]/15 border border-[#d4f434]/30 flex items-center justify-center">
              <Activity className="w-4 h-4 text-[#d4f434]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Multi-Market Grid Ticker
              </h3>
              <span className="text-[11px] text-zinc-400 block -mt-0.5">
                Live Binance Spot & Perpetual stream
              </span>
            </div>
          </div>
          <span className="text-xs text-zinc-400 hidden sm:inline-flex items-center gap-1">
            Click any market to switch candlestick chart <ArrowUpRight className="w-3.5 h-3.5 text-[#d4f434]" />
          </span>
        </div>

        {/* 12 Market Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {DEFAULT_PAIRS.map((pair) => {
            const ticker = tickers[pair.symbol];
            const price = ticker && ticker.price > 0 ? ticker.price : pair.fallbackPrice;
            const change = ticker && ticker.change24h !== undefined ? ticker.change24h : pair.fallbackChange;
            const isSelected = selectedPair === pair.symbol;
            const isPositive = change >= 0;

            const trendPoints = SPARKLINE_POINTS[pair.symbol] || [20, 25, 30, 35, 40, 45, 50, 55];
            const { linePath, areaPath } = createSmoothPath(trendPoints, 120, 36);

            return (
              <div
                key={pair.symbol}
                onClick={() => setSelectedPair(pair.symbol)}
                className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                  isSelected
                    ? 'bg-[#181b24] border-[#d4f434]/60 shadow-[0_0_20px_rgba(212,244,52,0.14)] ring-1 ring-[#d4f434]/30'
                    : 'bg-[#121418] border-[#1e2128] hover:bg-[#161821] hover:border-white/15'
                }`}
              >
                {/* Top Row: Coin Icon + Pair + Change badge */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <CryptoIcon symbol={pair.symbol} size={24} />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-white group-hover:text-[#d4f434] transition-colors">
                        {pair.symbol}/USDT
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md flex items-center gap-0.5 ${
                      isPositive
                        ? 'bg-[#0ecb81]/15 text-[#0ecb81]'
                        : 'bg-[#f84960]/15 text-[#f84960]'
                    }`}
                  >
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isPositive ? '+' : ''}{change.toFixed(2)}%
                  </span>
                </div>

                {/* Mid Row: Price Display */}
                <div className="font-mono text-sm sm:text-base font-extrabold text-zinc-100 mt-1 mb-2">
                  ${price >= 1 ? price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : price.toFixed(4)}
                </div>

                {/* Bottom: Smooth SVG Spline Sparkline Chart */}
                <div className="h-9 w-full relative">
                  <svg viewBox="0 0 120 36" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={`grad-${pair.symbol}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={isPositive ? '#0ecb81' : '#f84960'} stopOpacity="0.35" />
                        <stop offset="100%" stopColor={isPositive ? '#0ecb81' : '#f84960'} stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Area fill */}
                    {areaPath && (
                      <path
                        d={areaPath}
                        fill={`url(#grad-${pair.symbol})`}
                      />
                    )}

                    {/* Smooth Spline Curve */}
                    {linePath && (
                      <path
                        d={linePath}
                        fill="none"
                        stroke={isPositive ? '#0ecb81' : '#f84960'}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    )}

                    {/* Pulsing endpoint marker */}
                    <circle
                      cx="120"
                      cy="4"
                      r="2"
                      fill={isPositive ? '#0ecb81' : '#f84960'}
                      className="animate-ping"
                      opacity="0.75"
                    />
                    <circle
                      cx="120"
                      cy="4"
                      r="2"
                      fill={isPositive ? '#0ecb81' : '#f84960'}
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
