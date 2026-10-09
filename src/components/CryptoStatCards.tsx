'use client';

import React from 'react';
import { CryptoCardData } from '@/types/crypto';
import { CryptoIcon } from './CryptoIcon';

interface CryptoStatCardsProps {
  cards: CryptoCardData[];
  onCardClick?: (card: CryptoCardData) => void;
}

export const CryptoStatCards: React.FC<CryptoStatCardsProps> = ({
  cards,
  onCardClick,
}) => {
  // Generate smooth SVG wave path from sparkline points
  const generateSparklinePath = (points: number[]) => {
    if (!points || points.length === 0) return '';
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 120;
    const height = 32;

    const coords = points.map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * (height - 10) - 5;
      return { x, y };
    });

    let path = `M ${coords[0].x},${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i === 0 ? 0 : i - 1];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }

    return path;
  };

  // Harmonious, curated color palettes matching reference design
  const getCardThemeStyles = (theme: CryptoCardData['theme']) => {
    switch (theme) {
      case 'btc':
        return {
          bg: 'bg-gradient-to-b from-[#6b7f43] to-[#4e5e2f] border-[#7d9350]/30',
          text: 'text-[#121a08]',
          subtext: 'text-[#253314]',
          stroke: '#1b260e',
          glow: 'shadow-[0_4px_20px_rgba(107,127,67,0.25)]',
        };
      case 'bnb':
        return {
          bg: 'bg-gradient-to-b from-[#9d8935] to-[#796924] border-[#b49e3d]/30',
          text: 'text-[#1c1704]',
          subtext: 'text-[#382e09]',
          stroke: '#292106',
          glow: 'shadow-[0_4px_20px_rgba(157,137,53,0.25)]',
        };
      case 'usdt':
        return {
          bg: 'bg-gradient-to-b from-[#9e5a42] to-[#793f2c] border-[#b8694d]/30',
          text: 'text-[#1d0e07]',
          subtext: 'text-[#3d1e11]',
          stroke: '#2c1409',
          glow: 'shadow-[0_4px_20px_rgba(158,90,66,0.25)]',
        };
      case 'sol':
        return {
          bg: 'bg-gradient-to-b from-[#4e598f] to-[#38416d] border-[#616eb0]/30',
          text: 'text-[#0a0d1e]',
          subtext: 'text-[#1c234a]',
          stroke: '#121633',
          glow: 'shadow-[0_4px_20px_rgba(78,89,143,0.25)]',
        };
      default:
        return {
          bg: 'bg-[#181a20] border-white/10',
          text: 'text-white',
          subtext: 'text-zinc-400',
          stroke: '#ffffff',
          glow: 'shadow-none',
        };
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full">
      {cards.map((card) => {
        const theme = getCardThemeStyles(card.theme);
        const pathData = generateSparklinePath(card.sparkline);

        return (
          <div
            key={card.id}
            onClick={() => onCardClick?.(card)}
            className={`group relative overflow-hidden rounded-2xl p-3 sm:p-3.5 border transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 cursor-pointer select-none ${theme.bg} ${theme.glow}`}
          >
            {/* Top Highlight Subtle Inner Line */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-white/25 pointer-events-none" />

            {/* Top Row: Coin Icon + Name + Symbol */}
            <div className="flex items-center gap-2">
              <CryptoIcon symbol={card.symbol} name={card.name} size={26} />
              <div className="flex flex-col min-w-0">
                <span className={`text-xs sm:text-[13px] font-extrabold tracking-tight leading-tight truncate ${theme.text}`}>
                  {card.name}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider leading-none ${theme.subtext}`}>
                  {card.symbol}
                </span>
              </div>
            </div>

            {/* Middle: Sparkline SVG */}
            <div className="w-full h-8 my-1 sm:my-1.5 flex items-center justify-center">
              <svg
                viewBox="0 0 120 32"
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id={`card-grad-${card.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={theme.stroke} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={theme.stroke} stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area Fill */}
                <path
                  d={`${pathData} L 120,32 L 0,32 Z`}
                  fill={`url(#card-grad-${card.id})`}
                />
                {/* Sparkline Stroke */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={theme.stroke}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Bottom Row: Amount / Balance */}
            <div className="flex items-center justify-between mt-0.5">
              <span className={`text-xs sm:text-sm font-black font-mono tracking-tight ${theme.text}`}>
                {card.amount}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
