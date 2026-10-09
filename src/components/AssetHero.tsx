'use client';

import React, { useState } from 'react';
import { Plus, Eye, Sparkles } from 'lucide-react';
import { ThreeCryptoCanvas } from './ThreeCryptoCanvas';

interface AssetHeroProps {
  name?: string;
  symbol?: string;
  livePrice?: string;
  change24h?: number;
  direction?: 'up' | 'down' | 'neutral';
  onTradeClick?: () => void;
}

export const AssetHero: React.FC<AssetHeroProps> = ({
  name = 'Ripple',
  symbol = 'XRP',
  livePrice,
  change24h,
  direction = 'neutral',
  onTradeClick,
}) => {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [show3DModal, setShow3DModal] = useState(false);

  return (
    <div className="flex flex-col gap-3.5 py-1">
      {/* Top Part: Coin Identity & 3D Interactive Badge */}
      <div className="flex items-center gap-3">
        {/* Ripple XRP Icon */}
        <div
          onClick={() => setShow3DModal(true)}
          className="relative group w-10 h-10 rounded-full bg-[#15171e] border border-white/10 flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300 hover:scale-105 hover:border-[#d4f434]/50 shrink-0"
          title="Click to view interactive 3D Model"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {/* XRP Signature Cross */}
            <path d="M4 4L9.5 9.5M20 4L14.5 9.5M4 20L9.5 14.5M20 20L14.5 14.5" />
          </svg>
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#d4f434] text-black text-[8px] font-bold rounded-full flex items-center justify-center shadow-md">
            3D
          </span>
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white font-sans">
              {name}
            </h1>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 uppercase tracking-wider">
              {symbol}
            </span>
            {livePrice && (
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors duration-300 ${
                direction === 'up'
                  ? 'bg-[#182613] text-[#4ade80] border border-[#2ea043]/30'
                  : direction === 'down'
                  ? 'bg-[#281414] text-[#f87171] border border-[#f87171]/30'
                  : 'bg-white/5 text-zinc-300'
              }`}>
                {livePrice} {change24h !== undefined && `(${change24h >= 0 ? '+' : ''}${change24h.toFixed(2)}%)`}
              </span>
            )}
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
            Real-time ledger & settlement protocol
          </p>
        </div>
      </div>

      {/* Bottom Part: Action Buttons (Add Liquidity, Watchlist, Trade) */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Add Liquidity Button */}
        <button
          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181a22] hover:bg-[#232632] border border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-all duration-200 shadow-sm whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-transform group-hover:rotate-90 duration-200" />
          <span>Add Liquidity</span>
        </button>

        {/* Watchlist Button */}
        <button
          onClick={() => setInWatchlist(!inWatchlist)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 shadow-sm whitespace-nowrap ${
            inWatchlist
              ? 'bg-[#d4f434]/15 border-[#d4f434]/40 text-[#d4f434]'
              : 'bg-[#181a22] hover:bg-[#232632] border-white/10 text-zinc-300 hover:text-white'
          }`}
        >
          {inWatchlist ? <Eye className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-zinc-400" />}
          <span>{inWatchlist ? 'Watchlisted' : 'Watchlist'}</span>
        </button>

        {/* Trade Button (Vibrant Lime Accent) */}
        <button
          onClick={onTradeClick}
          className="relative group px-5 py-1.5 rounded-full bg-[#d4f434] hover:bg-[#bfe025] text-black font-semibold text-xs transition-all duration-200 shadow-[0_0_15px_rgba(212,244,52,0.35)] hover:shadow-[0_0_20px_rgba(212,244,52,0.5)] active:scale-95 whitespace-nowrap"
        >
          <span className="relative z-10 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Trade
          </span>
        </button>
      </div>


      {/* 3D Asset Inspection Modal / Overlay */}
      {show3DModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative bg-[#12141a] border border-[#262a36] rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d4f434] animate-pulse" />
                <h3 className="text-base font-bold text-white">Three.js Interactive Asset</h3>
              </div>
              <button
                onClick={() => setShow3DModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-zinc-300 hover:text-white flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400 text-center mb-2">
              Move your mouse to rotate and inspect the 3D token with real-time PBR lighting.
            </p>

            <div className="w-full h-64 flex items-center justify-center bg-[#0a0b0e] rounded-2xl border border-white/5 overflow-hidden">
              <ThreeCryptoCanvas coinName={name} symbol={symbol} className="w-full h-full" />
            </div>

            <div className="flex items-center justify-between w-full mt-4 text-xs text-zinc-400 px-1">
              <span>Token: {symbol}</span>
              <span className="text-[#d4f434]">WebGL Shading: Active</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
