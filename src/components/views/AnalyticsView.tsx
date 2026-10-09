'use client';

import React from 'react';
import { CryptoIcon } from '../CryptoIcon';
import { TickerData } from '@/hooks/useBinanceLive';
import { TrendingUp, TrendingDown, Flame, BarChart2, Globe } from 'lucide-react';

interface AnalyticsViewProps {
  tickers: Record<string, TickerData>;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tickers }) => {
  const tickerList = Object.values(tickers);

  const gainers = [...tickerList].sort((a, b) => b.change24h - a.change24h).slice(0, 4);
  const losers = [...tickerList].sort((a, b) => a.change24h - b.change24h).slice(0, 4);

  return (
    <div className="flex flex-col gap-5 w-full animate-in fade-in duration-300">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#121418] border border-[#1e2128] rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400 font-semibold">Crypto Market Cap</span>
            <Globe className="w-4 h-4 text-[#d4f434]" />
          </div>
          <div className="text-2xl font-extrabold text-white font-sans">$3.14 Trillion</div>
          <span className="text-xs font-semibold text-[#4ade80]">+2.84% in 24h</span>
        </div>

        <div className="bg-[#121418] border border-[#1e2128] rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400 font-semibold">24h Global Volume</span>
            <BarChart2 className="w-4 h-4 text-[#7c7bf2]" />
          </div>
          <div className="text-2xl font-extrabold text-white font-sans">$148.6 Billion</div>
          <span className="text-xs font-semibold text-zinc-400">Normal liquidity</span>
        </div>

        <div className="bg-[#121418] border border-[#1e2128] rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400 font-semibold">Fear & Greed Index</span>
            <Flame className="w-4 h-4 text-[#f59e0b]" />
          </div>
          <div className="text-2xl font-extrabold text-[#d4f434] font-sans">78 / 100</div>
          <span className="text-xs font-semibold text-zinc-400">Extreme Greed</span>
        </div>
      </div>

      {/* Gainers and Losers Split Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Top Gainers */}
        <div className="bg-[#121418] border border-[#1e2128] rounded-3xl p-5 shadow-lg">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#4ade80]" /> Top 24h Gainers
          </h3>
          <div className="space-y-2.5">
            {gainers.map((coin) => (
              <div key={coin.symbol} className="flex items-center justify-between p-2.5 rounded-xl bg-[#161820] hover:bg-[#1a1d26] transition-colors">
                <div className="flex items-center gap-2.5">
                  <CryptoIcon symbol={coin.symbol} size={28} />
                  <span className="font-bold text-sm text-white">{coin.symbol}/USDT</span>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-white">${coin.price >= 1 ? coin.price.toFixed(2) : coin.price.toFixed(4)}</div>
                  <div className="text-xs font-bold text-[#4ade80]">+{coin.change24h.toFixed(2)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="bg-[#121418] border border-[#1e2128] rounded-3xl p-5 shadow-lg">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
            <TrendingDown className="w-4 h-4 text-[#f87171]" /> Top 24h Dips
          </h3>
          <div className="space-y-2.5">
            {losers.map((coin) => (
              <div key={coin.symbol} className="flex items-center justify-between p-2.5 rounded-xl bg-[#161820] hover:bg-[#1a1d26] transition-colors">
                <div className="flex items-center gap-2.5">
                  <CryptoIcon symbol={coin.symbol} size={28} />
                  <span className="font-bold text-sm text-white">{coin.symbol}/USDT</span>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-white">${coin.price >= 1 ? coin.price.toFixed(2) : coin.price.toFixed(4)}</div>
                  <div className="text-xs font-bold text-[#f87171]">{coin.change24h.toFixed(2)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
