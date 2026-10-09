'use client';

import React, { useState } from 'react';

interface CryptoIconProps {
  symbol: string;
  name?: string;
  size?: number;
  className?: string;
}

// Map custom/legacy symbols to standard ticker symbol names for icon lookups
const SYMBOL_MAP: Record<string, string> = {
  ALG: 'algo',
  ALGO: 'algo',
  BTC: 'btc',
  ETH: 'eth',
  SOL: 'sol',
  BNB: 'bnb',
  XRP: 'xrp',
  DOGE: 'doge',
  ADA: 'ada',
  AVAX: 'avax',
  LINK: 'link',
  DOT: 'dot',
  NEAR: 'near',
  SUI: 'sui',
  APT: 'apt',
  SHIB: 'shib',
  PEPE: 'pepe',
  LTC: 'ltc',
  UNI: 'uni',
  ATOM: 'atom',
  RENDER: 'rndr',
  TAO: 'tao',
  FET: 'fet',
  INJ: 'inj',
  HBAR: 'hbar',
  TON: 'ton',
  USDT: 'usdt',
  NULS: 'nuls',
};

export const CryptoIcon: React.FC<CryptoIconProps> = ({
  symbol,
  name,
  size = 28,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const cleanSymbol = (SYMBOL_MAP[symbol.toUpperCase()] || symbol.toLowerCase()).trim();

  // Vector SVG renderers for crisp instant rendering
  const renderVectorSvg = () => {
    const sym = symbol.toUpperCase();
    switch (sym) {
      case 'BTC':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-full bg-[#f7931a] flex items-center justify-center text-white font-bold shadow-sm shrink-0"
          >
            <span style={{ fontSize: size * 0.52 }} className="leading-none select-none">₿</span>
          </div>
        );
      case 'ETH':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-full bg-[#34384b] flex items-center justify-center text-white shadow-sm shrink-0"
          >
            <svg viewBox="0 0 24 24" style={{ width: size * 0.6, height: size * 0.6 }} className="fill-current">
              <path d="M12 2L4 12.5L12 17L20 12.5L12 2ZM12 18.5L4 14L12 22L20 14L12 18.5Z" />
            </svg>
          </div>
        );
      case 'SOL':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-full bg-[#1e2337] flex items-center justify-center text-[#14f195] shadow-sm shrink-0"
          >
            <svg viewBox="0 0 24 24" style={{ width: size * 0.58, height: size * 0.58 }} className="fill-current">
              <path d="M4 17.5L6.5 15H20L17.5 17.5H4ZM4 12L6.5 9.5H20L17.5 12H4ZM4 6.5L6.5 4H20L17.5 6.5H4Z" />
            </svg>
          </div>
        );
      case 'BNB':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-full bg-[#f3ba2f] flex items-center justify-center text-black shadow-sm shrink-0"
          >
            <svg viewBox="0 0 24 24" style={{ width: size * 0.58, height: size * 0.58 }} className="fill-black">
              <path d="M12 3L6.5 8.5L8.6 10.6L12 7.2L15.4 10.6L17.5 8.5L12 3ZM3 12L5.1 9.9L7.2 12L5.1 14.1L3 12ZM12 16.8L8.6 13.4L6.5 15.5L12 21L17.5 15.5L15.4 13.4L12 16.8ZM16.8 12L18.9 9.9L21 12L18.9 14.1L16.8 12ZM12 14.2L14.2 12L12 9.8L9.8 12L12 14.2Z" />
            </svg>
          </div>
        );
      case 'XRP':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-full bg-[#1e2229] border border-white/10 flex items-center justify-center text-white shadow-sm shrink-0"
          >
            <svg viewBox="0 0 24 24" style={{ width: size * 0.55, height: size * 0.55 }} className="fill-none stroke-white" strokeWidth="2.4">
              <path d="M5 5L9 9M19 5L15 9M5 19L9 15M19 19L15 15" strokeLinecap="round" />
            </svg>
          </div>
        );
      case 'DOGE':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-full bg-[#c2a633] flex items-center justify-center text-white font-extrabold shadow-sm shrink-0"
          >
            <span style={{ fontSize: size * 0.52 }} className="leading-none select-none">Ð</span>
          </div>
        );
      case 'ADA':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-full bg-[#0033ad] flex items-center justify-center text-white shadow-sm shrink-0"
          >
            <svg viewBox="0 0 24 24" style={{ width: size * 0.6, height: size * 0.6 }} className="fill-white">
              <circle cx="12" cy="12" r="3.5" />
              <circle cx="12" cy="4" r="1.5" />
              <circle cx="12" cy="20" r="1.5" />
              <circle cx="4" cy="12" r="1.5" />
              <circle cx="20" cy="12" r="1.5" />
              <circle cx="6.5" cy="6.5" r="1.2" />
              <circle cx="17.5" cy="17.5" r="1.2" />
              <circle cx="6.5" cy="17.5" r="1.2" />
              <circle cx="17.5" cy="6.5" r="1.2" />
            </svg>
          </div>
        );
      case 'AVAX':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-full bg-[#e84142] flex items-center justify-center text-white shadow-sm shrink-0"
          >
            <svg viewBox="0 0 24 24" style={{ width: size * 0.55, height: size * 0.55 }} className="fill-white">
              <path d="M12 3L2 21H7.5L12 12.5L16.5 21H22L12 3Z" />
            </svg>
          </div>
        );
      case 'LINK':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-full bg-[#375bd2] flex items-center justify-center text-white shadow-sm shrink-0"
          >
            <svg viewBox="0 0 24 24" style={{ width: size * 0.55, height: size * 0.55 }} className="fill-white">
              <path d="M12 2L4 7V17L12 22L20 17V7L12 2ZM12 4.5L18 8.2V15.8L12 19.5L6 15.8V8.2L12 4.5Z" />
            </svg>
          </div>
        );
      case 'ALG':
      case 'ALGO':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-full bg-black border border-white/20 flex items-center justify-center text-white shadow-sm shrink-0"
          >
            <svg viewBox="0 0 24 24" style={{ width: size * 0.55, height: size * 0.55 }} className="fill-none stroke-white" strokeWidth="2.2">
              <path d="M7 19L14 5M12 19L17 11" strokeLinecap="round" />
            </svg>
          </div>
        );
      case 'NEAR':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-full bg-[#111114] border border-white/10 flex items-center justify-center text-white font-extrabold shadow-sm shrink-0"
          >
            <svg viewBox="0 0 24 24" style={{ width: size * 0.55, height: size * 0.55 }} className="fill-white">
              <path d="M7 5H9.5L14.5 15.5V5H17V19H14.5L9.5 8.5V19H7V5Z" />
            </svg>
          </div>
        );
      case 'SUI':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-full bg-[#4da2ff] flex items-center justify-center text-white shadow-sm shrink-0"
          >
            <svg viewBox="0 0 24 24" style={{ width: size * 0.55, height: size * 0.55 }} className="fill-white">
              <path d="M12 3C8 8 6 12 6 15C6 18.3 8.7 21 12 21C15.3 21 18 18.3 18 15C18 12 16 8 12 3Z" />
            </svg>
          </div>
        );
      case 'TAO':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-full bg-[#181920] border border-white/10 flex items-center justify-center text-white shadow-sm shrink-0"
          >
            <svg viewBox="0 0 24 24" style={{ width: size * 0.55, height: size * 0.55 }} className="fill-white">
              <rect x="5" y="5" width="6" height="6" rx="1" />
              <rect x="13" y="5" width="6" height="6" rx="1" />
              <rect x="9" y="13" width="6" height="6" rx="1" />
            </svg>
          </div>
        );
      case 'RENDER':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-full bg-[#e51b24] flex items-center justify-center text-white font-extrabold shadow-sm shrink-0"
          >
            <span style={{ fontSize: size * 0.5 }} className="leading-none select-none">R</span>
          </div>
        );
      case 'DOT':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-full bg-[#e6007a] flex items-center justify-center text-white shadow-sm shrink-0"
          >
            <svg viewBox="0 0 24 24" style={{ width: size * 0.6, height: size * 0.6 }} className="fill-white">
              <circle cx="12" cy="7" r="3.5" />
              <circle cx="12" cy="17" r="3.5" />
            </svg>
          </div>
        );
      case 'TON':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-full bg-[#0098ea] flex items-center justify-center text-white shadow-sm shrink-0"
          >
            <svg viewBox="0 0 24 24" style={{ width: size * 0.55, height: size * 0.55 }} className="fill-white">
              <path d="M4 6L20 4L12 20L10 13L4 6Z" />
            </svg>
          </div>
        );
      case 'NULS':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-full bg-[#76b82a] flex items-center justify-center text-white font-bold shadow-sm shrink-0"
          >
            <span style={{ fontSize: size * 0.5 }} className="leading-none">N</span>
          </div>
        );
      case 'XMG':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-full bg-[#18b1d4] flex items-center justify-center text-white font-bold shadow-sm shrink-0"
          >
            <span style={{ fontSize: size * 0.5 }} className="leading-none">M</span>
          </div>
        );
      case 'USDT':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-full bg-[#26a17b] flex items-center justify-center text-white font-bold shadow-sm shrink-0"
          >
            <span style={{ fontSize: size * 0.52 }} className="leading-none">₮</span>
          </div>
        );
      default:
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-full bg-[#252834] flex items-center justify-center text-white font-bold shadow-sm shrink-0"
          >
            <span style={{ fontSize: size * 0.48 }} className="leading-none">
              {sym.slice(0, 1)}
            </span>
          </div>
        );
    }
  };

  if (imgError) {
    return <div className={`inline-flex shrink-0 ${className}`}>{renderVectorSvg()}</div>;
  }

  const primaryCdnUrl = `https://assets.coincap.io/assets/icons/${cleanSymbol}@2x.png`;

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 shadow-sm ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={primaryCdnUrl}
        alt={`${name || symbol} logo`}
        width={size}
        height={size}
        className="w-full h-full object-cover rounded-full"
        onError={() => setImgError(true)}
        loading="lazy"
      />
    </div>
  );
};
