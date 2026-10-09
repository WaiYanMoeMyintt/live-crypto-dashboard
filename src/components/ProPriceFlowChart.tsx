'use client';

import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import {
  Star,
  ChevronDown,
  RefreshCw,
  Radio,
  Sliders,
  Maximize2,
  Minimize2,
  TrendingUp,
  TrendingDown,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ExternalLink,
  BookOpen,
  FileText,
  ShieldCheck,
  BarChart3,
  Scale,
  Zap,
  Layers,
} from 'lucide-react';
import { CryptoIcon } from './CryptoIcon';
import { useBinanceKlineStream } from '@/hooks/useBinanceKlineStream';
import { TickerData } from '@/hooks/useBinanceLive';
import { getCryptoInfo } from '@/data/cryptoInfoData';

interface ProPriceFlowChartProps {
  initialSymbol?: string;
  tickers?: Record<string, TickerData>;
  onClose?: () => void;
  isStandalone?: boolean;
}

const TIMEFRAMES = [
  { id: '1s', label: '1s' },
  { id: '15m', label: '15m' },
  { id: '1h', label: '1H' },
  { id: '4h', label: '4H' },
  { id: '1d', label: '1D' },
  { id: '1w', label: '1W' },
];

const TOP_MOVERS_MOCK = [
  { pair: 'BTCUSDT', tag: 'New 24hr High', change: 2.34, time: '14:14:27', isRise: true },
  { pair: 'SOLUSDT', tag: 'New 7-Day High', change: 5.17, time: '14:13:32', isRise: true },
  { pair: 'DOGEUSDT', tag: '[Small] 2h Rise', change: 3.09, time: '14:12:58', isRise: true },
  { pair: 'AVAXUSDT', tag: 'Rally', change: 6.85, time: '14:11:35', isRise: true },
  { pair: 'XRPUSDT', tag: 'Pullback', change: -1.42, time: '14:10:56', isRise: false },
  { pair: 'PEPEUSDT', tag: 'New 24hr High', change: 11.25, time: '14:10:36', isRise: true },
  { pair: 'NEARUSDT', tag: '[Small] 1h Rise', change: 4.12, time: '14:09:12', isRise: true },
  { pair: 'SUIUSDT', tag: 'New 7-Day High', change: 8.45, time: '14:08:45', isRise: true },
];

export const ProPriceFlowChart: React.FC<ProPriceFlowChartProps> = ({
  initialSymbol = 'BTCUSDT',
  tickers = {},
  onClose,
  isStandalone = false,
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState(initialSymbol);
  const [interval, setInterval] = useState('1h');
  const [chartMode, setChartMode] = useState<'Original' | 'TradingView' | 'Depth'>('Original');
  const [activeTab, setActiveTab] = useState<'chart' | 'info' | 'tradingData'>('chart');
  const [rightPanelTab, setRightPanelTab] = useState<'topMovers' | 'trades'>('topMovers');
  const [moverFilter, setMoverFilter] = useState<'All' | 'Rise' | 'Fall' | 'Pullback' | 'Rally'>('All');
  const [isSymbolDropdownOpen, setIsSymbolDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Interactive Zoom & Pan State
  const [zoomCandleCount, setZoomCandleCount] = useState<number>(50); // visible candle window
  const [scrollOffset, setScrollOffset] = useState<number>(0); // 0 means latest candle at right edge
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [dragStartOffset, setDragStartOffset] = useState<number>(0);

  // Crosshair state
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [hoveredCandleIdx, setHoveredCandleIdx] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Binance live kline hook
  const {
    candles: rawCandles,
    ma7: fullMa7,
    ma25: fullMa25,
    ma99: fullMa99,
    currentCandle,
    high24h,
    low24h,
    volumeTotal,
    volumeQuoteTotal,
    isLoading,
    isConnected,
  } = useBinanceKlineStream(selectedSymbol, interval, true);

  const baseSymbol = selectedSymbol.replace('USDT', '').toUpperCase();
  const coinInfo = useMemo(() => getCryptoInfo(baseSymbol), [baseSymbol]);

  // Active symbol ticker from live feed
  const activeTicker = tickers[baseSymbol] || {
    symbol: baseSymbol,
    price: currentCandle?.close || (baseSymbol === 'BTC' ? 86273.87 : baseSymbol === 'ETH' ? 2704.19 : 184.6),
    change24h: 1.47,
    high24h: high24h || 87220,
    low24h: low24h || 83888,
    volumeBase: volumeTotal || 45800,
    volumeQuote: volumeQuoteTotal || 3150210000,
    direction: 'up',
  };

  // Sliced candles based on zoom and scroll offset
  const { visibleCandles, visibleMa7, visibleMa25, visibleMa99 } = useMemo(() => {
    if (rawCandles.length === 0) {
      return { visibleCandles: [], visibleMa7: [], visibleMa25: [], visibleMa99: [] };
    }

    const total = rawCandles.length;
    const windowSize = Math.min(Math.max(zoomCandleCount, 15), total);
    
    // Clamp offset so right edge doesn't go negative and left doesn't overshoot
    const maxOffset = total - windowSize;
    const safeOffset = Math.min(Math.max(scrollOffset, 0), maxOffset);

    const endIdx = total - safeOffset;
    const startIdx = Math.max(0, endIdx - windowSize);

    return {
      visibleCandles: rawCandles.slice(startIdx, endIdx),
      visibleMa7: fullMa7.slice(startIdx, endIdx),
      visibleMa25: fullMa25.slice(startIdx, endIdx),
      visibleMa99: fullMa99.slice(startIdx, endIdx),
    };
  }, [rawCandles, fullMa7, fullMa25, fullMa99, zoomCandleCount, scrollOffset]);

  // SVG Chart Dimensions
  const svgWidth = 860;
  const svgHeight = 440;
  const paddingLeft = 12;
  const paddingRight = 75;
  const paddingTop = 28;
  const chartBottom = 330;
  const volumeTop = 345;
  const volumeBottom = 422;

  // Min and Max prices for visible chart scaling
  const { minPrice, priceRange, peakIdx, troughIdx } = useMemo(() => {
    if (visibleCandles.length === 0) return { minPrice: 100, priceRange: 100, peakIdx: 0, troughIdx: 0 };
    let min = Infinity;
    let max = -Infinity;
    let pIdx = 0;
    let tIdx = 0;

    visibleCandles.forEach((c, idx) => {
      if (c.high > max) {
        max = c.high;
        pIdx = idx;
      }
      if (c.low < min) {
        min = c.low;
        tIdx = idx;
      }
    });

    const pad = (max - min) * 0.08 || 1;
    return {
      minPrice: min - pad,
      maxPrice: max + pad,
      priceRange: max - min + pad * 2,
      peakIdx: pIdx,
      troughIdx: tIdx,
    };
  }, [visibleCandles]);

  const maxVolume = useMemo(() => {
    if (visibleCandles.length === 0) return 100;
    return Math.max(...visibleCandles.map((c) => c.volume)) * 1.15 || 100;
  }, [visibleCandles]);

  // Coordinate mapper functions
  const getX = useCallback(
    (idx: number) => {
      const total = Math.max(visibleCandles.length - 1, 1);
      const usableW = svgWidth - paddingLeft - paddingRight;
      return paddingLeft + (idx / total) * usableW;
    },
    [visibleCandles.length, svgWidth, paddingLeft, paddingRight]
  );

  const getY = useCallback(
    (price: number) => {
      const usableH = chartBottom - paddingTop;
      return chartBottom - ((price - minPrice) / priceRange) * usableH;
    },
    [chartBottom, paddingTop, minPrice, priceRange]
  );

  const getPriceFromY = useCallback(
    (y: number) => {
      const usableH = chartBottom - paddingTop;
      const normalized = (chartBottom - y) / usableH;
      return minPrice + normalized * priceRange;
    },
    [chartBottom, paddingTop, minPrice, priceRange]
  );

  const getVolY = (vol: number) => {
    const usableH = volumeBottom - volumeTop;
    return volumeBottom - (vol / maxVolume) * usableH;
  };

  // Generate Smooth SVG Path for Moving Average Lines
  const createMaPath = (maValues: (number | null)[]) => {
    const validPoints: { x: number; y: number }[] = [];
    maValues.forEach((val, idx) => {
      if (val !== null) {
        validPoints.push({ x: getX(idx), y: getY(val) });
      }
    });

    if (validPoints.length === 0) return '';
    let path = `M ${validPoints[0].x.toFixed(1)},${validPoints[0].y.toFixed(1)}`;
    for (let i = 1; i < validPoints.length; i++) {
      path += ` L ${validPoints[i].x.toFixed(1)},${validPoints[i].y.toFixed(1)}`;
    }
    return path;
  };

  const ma7Path = createMaPath(visibleMa7);
  const ma25Path = createMaPath(visibleMa25);
  const ma99Path = createMaPath(visibleMa99);

  // Mouse drag to pan handlers
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartOffset(scrollOffset);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Convert to SVG coordinate system
    const scaleX = svgWidth / rect.width;
    const scaleY = svgHeight / rect.height;
    const svgX = clientX * scaleX;
    const svgY = clientY * scaleY;

    setCursorPos({ x: svgX, y: svgY });

    // Identify hovered candle index
    if (visibleCandles.length > 0) {
      const usableW = svgWidth - paddingLeft - paddingRight;
      const relativeX = Math.max(0, Math.min(svgX - paddingLeft, usableW));
      const idx = Math.round((relativeX / usableW) * (visibleCandles.length - 1));
      setHoveredCandleIdx(idx);
    }

    // Handle horizontal dragging/panning
    if (isDragging) {
      const deltaPixels = e.clientX - dragStartX;
      const candleDelta = Math.round((deltaPixels / rect.width) * zoomCandleCount);
      const newOffset = dragStartOffset + candleDelta;
      const maxOffset = rawCandles.length - visibleCandles.length;
      setScrollOffset(Math.min(Math.max(newOffset, 0), Math.max(0, maxOffset)));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Native non-passive wheel listener to completely stop window/modal scrolling when zooming chart
  useEffect(() => {
    const el = chartContainerRef.current;
    if (!el) return;

    const onWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.deltaY < 0) {
        // Zoom in (fewer candles)
        setZoomCandleCount((prev) => Math.max(15, prev - 4));
      } else {
        // Zoom out (more candles)
        setZoomCandleCount((prev) => Math.min(rawCandles.length || 70, prev + 4));
      }
    };

    el.addEventListener('wheel', onWheelNative, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheelNative);
    };
  }, [rawCandles.length]);

  // Touch drag handlers for mobile RWD
  const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStartX(e.touches[0].clientX);
      setDragStartOffset(scrollOffset);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!isDragging || e.touches.length !== 1 || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const deltaPixels = e.touches[0].clientX - dragStartX;
    const candleDelta = Math.round((deltaPixels / rect.width) * zoomCandleCount);
    const newOffset = dragStartOffset + candleDelta;
    const maxOffset = rawCandles.length - visibleCandles.length;
    setScrollOffset(Math.min(Math.max(newOffset, 0), Math.max(0, maxOffset)));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Reset zoom & pan to latest
  const handleResetZoom = () => {
    setZoomCandleCount(50);
    setScrollOffset(0);
  };

  // Listen to Escape key for fullscreen exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Active or Hovered Candle for top stats bar
  const activeCandle =
    hoveredCandleIdx !== null && visibleCandles[hoveredCandleIdx]
      ? visibleCandles[hoveredCandleIdx]
      : currentCandle || visibleCandles[visibleCandles.length - 1];

  const candleChange = activeCandle ? ((activeCandle.close - activeCandle.open) / activeCandle.open) * 100 : 0;
  const candleRange = activeCandle ? ((activeCandle.high - activeCandle.low) / activeCandle.low) * 100 : 0;

  const activePrice = activeTicker.price;
  const livePriceY = getY(activePrice);
  const cursorPrice = cursorPos ? getPriceFromY(cursorPos.y) : null;

  const availablePairs = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT', 'AVAXUSDT', 'LINKUSDT', 'NEARUSDT', 'SUIUSDT'];

  const filteredMovers = TOP_MOVERS_MOCK.filter((m) => {
    if (moverFilter === 'Rise') return m.isRise;
    if (moverFilter === 'Fall') return !m.isRise;
    if (moverFilter === 'Pullback') return m.tag.includes('Pullback');
    if (moverFilter === 'Rally') return m.tag.includes('Rally');
    return true;
  });

  return (
    <div
      ref={containerRef}
      className={`bg-[#0e1015] border border-[#1e222b] rounded-3xl shadow-2xl overflow-hidden w-full flex flex-col transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-[100] w-screen h-screen rounded-none p-4 sm:p-6 bg-[#0c0d12] overflow-y-auto'
          : isStandalone
          ? 'ring-1 ring-[#d4f434]/20'
          : ''
      }`}
    >
      {/* 1. Top Market Bar (Pair Name, Live Price, 24h Stats, Funding Rate) */}
      <div className="bg-[#12141a] border-b border-[#1b1e26] p-3 sm:p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-3 select-none">
        {/* Left: Star + Pair Dropdown + Large Price */}
        <div className="flex items-center gap-3.5 flex-wrap">
          <button className="text-zinc-500 hover:text-[#d4f434] transition-colors" title="Favorite market">
            <Star className="w-4 h-4 fill-none hover:fill-[#d4f434]" />
          </button>

          {/* Pair Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSymbolDropdownOpen(!isSymbolDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181a22] hover:bg-[#222530] border border-white/10 text-white font-bold text-sm transition-all shadow-sm"
            >
              <CryptoIcon symbol={baseSymbol} size={22} />
              <span>{selectedSymbol}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 font-normal uppercase">
                Perp
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {isSymbolDropdownOpen && (
              <div className="absolute top-10 left-0 z-50 bg-[#161822] border border-white/10 rounded-2xl p-2 shadow-2xl min-w-[170px] animate-in fade-in duration-150">
                <div className="text-[10px] font-semibold text-zinc-400 uppercase px-2 py-1">
                  Select Market Pair
                </div>
                {availablePairs.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setSelectedSymbol(p);
                      setIsSymbolDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      selectedSymbol === p
                        ? 'bg-[#d4f434]/15 text-[#d4f434] font-semibold'
                        : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CryptoIcon symbol={p.replace('USDT', '')} size={18} />
                      <span>{p}</span>
                    </div>
                    {selectedSymbol === p && <span className="w-1.5 h-1.5 rounded-full bg-[#d4f434]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Large Live Price & 24h Change */}
          <div className="flex items-baseline gap-2.5">
            <span
              className={`font-mono text-xl sm:text-2xl font-extrabold tracking-tight transition-colors duration-200 ${
                activeTicker.direction === 'down' ? 'text-[#f84960]' : 'text-[#0ecb81]'
              }`}
            >
              {activePrice >= 1
                ? activePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : activePrice.toFixed(4)}
            </span>
            <span
              className={`text-xs font-bold font-mono ${
                activeTicker.change24h >= 0 ? 'text-[#0ecb81]' : 'text-[#f84960]'
              }`}
            >
              {activeTicker.change24h >= 0 ? '+' : ''}
              {activeTicker.change24h.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Right: Key Metrics (Mark, Index, Funding 8h, 24h High/Low, 24h Volume) */}
        <div className="flex items-center gap-4 sm:gap-6 text-xs overflow-x-auto pb-1 xl:pb-0">
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Mark Price</span>
            <span className="font-mono text-zinc-200 font-bold">
              ${activePrice >= 1 ? activePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : activePrice.toFixed(4)}
            </span>
          </div>

          <div>
            <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Funding (8h)</span>
            <span className="font-mono text-[#f3ba2f] font-bold">
              0.01000% <span className="text-zinc-400 font-normal">/ 00:14:32</span>
            </span>
          </div>

          <div>
            <span className="text-zinc-500 block text-[10px] uppercase font-semibold">24h High</span>
            <span className="font-mono text-zinc-200 font-bold">
              ${(high24h || activePrice * 1.04).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div>
            <span className="text-zinc-500 block text-[10px] uppercase font-semibold">24h Low</span>
            <span className="font-mono text-zinc-200 font-bold">
              ${(low24h || activePrice * 0.96).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div>
            <span className="text-zinc-500 block text-[10px] uppercase font-semibold">24h Vol(USDT)</span>
            <span className="font-mono text-[#d4f434] font-bold">
              ${((volumeQuoteTotal || 3150210000) / 1000000).toFixed(2)}M
            </span>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center text-xs ml-2 transition-colors"
              title="Close chart overlay"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 2. Core Navigation Tabs (Chart | Info | Trading Data) */}
      <div className="bg-[#111319] border-b border-[#1b1e26] px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs select-none">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('chart')}
            className={`py-1 text-xs font-bold transition-all relative flex items-center gap-1.5 ${
              activeTab === 'chart' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Chart</span>
            {activeTab === 'chart' && (
              <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#d4f434] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`py-1 text-xs font-bold transition-all relative flex items-center gap-1.5 ${
              activeTab === 'info' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Info</span>
            {activeTab === 'info' && (
              <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#d4f434] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('tradingData')}
            className={`py-1 text-xs font-bold transition-all relative flex items-center gap-1.5 ${
              activeTab === 'tradingData' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Trading Data</span>
            {activeTab === 'tradingData' && (
              <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#d4f434] rounded-full" />
            )}
          </button>
        </div>

        {/* Right Tools & Fullscreen Core JS Logic */}
        <div className="flex items-center gap-3 text-zinc-400 text-xs">
          <span className="flex items-center gap-1.5 text-[11px] hidden sm:flex">
            <Radio className={`w-3 h-3 ${isConnected ? 'text-[#0ecb81] animate-pulse' : 'text-zinc-500'}`} />
            {isConnected ? 'Binance Stream Live' : 'Connecting Stream'}
          </span>

          <button
            onClick={handleResetZoom}
            className="p-1 rounded bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors flex items-center gap-1 text-[10px]"
            title="Reset zoom & pan view"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">Reset View</span>
          </button>

          <button
            onClick={() => setZoomCandleCount((prev) => Math.max(15, prev - 6))}
            className="p-1 rounded bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setZoomCandleCount((prev) => Math.min(rawCandles.length || 70, prev + 6))}
            className="p-1 rounded bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button className="hover:text-white transition-colors p-1" title="Indicator Settings">
            <Sliders className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 rounded bg-white/5 hover:bg-[#d4f434]/20 hover:text-[#d4f434] text-zinc-300 transition-colors"
            title={isFullscreen ? 'Exit Full Screen (Esc)' : 'Full Screen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 3. Tab Body Routing */}
      {activeTab === 'chart' ? (
        <>
          {/* Chart Toolbar (Timeframes, Chart Type, MA Badges) */}
          <div className="bg-[#101217] border-b border-[#1b1e26] px-3 sm:px-4 py-2 flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs select-none">
            {/* Left: Timeframe Switcher & Chart Modes */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1 bg-[#090a0d] p-0.5 rounded-full border border-white/5">
                {TIMEFRAMES.map((tf) => (
                  <button
                    key={tf.id}
                    onClick={() => setInterval(tf.id)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                      interval === tf.id
                        ? 'bg-[#d4f434] text-black shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>

              {/* View Modes */}
              <div className="flex items-center gap-1">
                {(['Original', 'TradingView', 'Depth'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setChartMode(mode)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      chartMode === mode ? 'bg-white/10 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Technical MA Indicator Values */}
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <div className="flex items-center gap-1 text-[#f3ba2f]">
                <span className="w-2 h-0.5 bg-[#f3ba2f]" />
                <span>MA(7): {visibleMa7[visibleMa7.length - 1]?.toFixed(2) || '---'}</span>
              </div>
              <div className="flex items-center gap-1 text-[#e91e63]">
                <span className="w-2 h-0.5 bg-[#e91e63]" />
                <span>MA(25): {visibleMa25[visibleMa25.length - 1]?.toFixed(2) || '---'}</span>
              </div>
              <div className="flex items-center gap-1 text-[#9c27b0]">
                <span className="w-2 h-0.5 bg-[#9c27b0]" />
                <span>MA(99): {visibleMa99[visibleMa99.length - 1]?.toFixed(2) || '---'}</span>
              </div>
            </div>
          </div>

          {/* Live Candle Header Info on Active/Hover Bar */}
          {activeCandle && (
            <div className="bg-[#0b0c10] px-4 py-1.5 border-b border-[#181a20] flex items-center gap-4 text-[11px] font-mono overflow-x-auto text-zinc-400 select-none">
              <span className="text-zinc-300 font-sans">
                {new Date(activeCandle.time).toLocaleString('en-US', {
                  month: 'numeric',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span>
                Open: <strong className="text-zinc-200">{activeCandle.open >= 1 ? activeCandle.open.toFixed(2) : activeCandle.open.toFixed(4)}</strong>
              </span>
              <span>
                High: <strong className="text-zinc-200">{activeCandle.high >= 1 ? activeCandle.high.toFixed(2) : activeCandle.high.toFixed(4)}</strong>
              </span>
              <span>
                Low: <strong className="text-zinc-200">{activeCandle.low >= 1 ? activeCandle.low.toFixed(2) : activeCandle.low.toFixed(4)}</strong>
              </span>
              <span>
                Close: <strong className="text-zinc-200">{activeCandle.close >= 1 ? activeCandle.close.toFixed(2) : activeCandle.close.toFixed(4)}</strong>
              </span>
              <span>
                Change:{' '}
                <strong className={candleChange >= 0 ? 'text-[#0ecb81]' : 'text-[#f84960]'}>
                  {candleChange >= 0 ? '+' : ''}
                  {candleChange.toFixed(2)}%
                </strong>
              </span>
              <span>
                Range: <strong className="text-zinc-300">{candleRange.toFixed(2)}%</strong>
              </span>
              <span className="text-zinc-500 hidden xl:inline text-[10px]">
                (Scroll mouse wheel to Zoom • Drag to Pan)
              </span>
            </div>
          )}

          {/* Main Chart Canvas & Right Side Panel Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 w-full">
            {/* Left 9 Cols: Candlestick Engine or Depth Engine */}
            <div
              ref={chartContainerRef}
              className="lg:col-span-9 relative w-full h-[360px] sm:h-[400px] lg:h-[450px] bg-[#0c0d12] border-r border-[#1a1d24] select-none cursor-crosshair overflow-hidden touch-none"
            >
              {isLoading && rawCandles.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0c0d12]/80 z-20">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#d4f434]" />
                    <span>Streaming Binance live candles...</span>
                  </div>
                </div>
              ) : null}

              {chartMode === 'Depth' ? (
                /* Depth Chart View */
                <div className="w-full h-full p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="text-[#0ecb81] font-bold">Cumulative Bids (Buy Depth)</span>
                    <span className="font-mono text-white font-bold">${activePrice.toLocaleString()} Mid Market</span>
                    <span className="text-[#f84960] font-bold">Cumulative Asks (Sell Depth)</span>
                  </div>

                  {/* SVG Market Depth visualization */}
                  <svg viewBox="0 0 800 320" className="w-full h-[280px]">
                    <defs>
                      <linearGradient id="bidGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0ecb81" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#0ecb81" stopOpacity="0.02" />
                      </linearGradient>
                      <linearGradient id="askGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f84960" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#f84960" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>

                    {/* Bids Green Area */}
                    <path
                      d="M 20 280 L 20 40 Q 180 80 380 270 L 380 280 Z"
                      fill="url(#bidGrad)"
                      stroke="#0ecb81"
                      strokeWidth="2"
                    />

                    {/* Asks Red Area */}
                    <path
                      d="M 420 280 L 420 270 Q 620 80 780 30 L 780 280 Z"
                      fill="url(#askGrad)"
                      stroke="#f84960"
                      strokeWidth="2"
                    />

                    {/* Mid Line */}
                    <line x1="400" y1="20" x2="400" y2="280" stroke="#333" strokeDasharray="3 3" />
                    <text x="400" y="295" textAnchor="middle" fill="#888" fontSize="11" fontFamily="monospace">
                      Spread: 0.01 USDT (0.00%)
                    </text>
                  </svg>

                  <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
                    <span>${(activePrice * 0.97).toFixed(2)}</span>
                    <span>${activePrice.toFixed(2)}</span>
                    <span>${(activePrice * 1.03).toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                /* Original / TradingView Candlestick SVG */
                <svg
                  ref={svgRef}
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onMouseLeave={() => {
                    handleMouseUp();
                    setCursorPos(null);
                    setHoveredCandleIdx(null);
                  }}
                >
                  <defs>
                    <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d4f434" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#d4f434" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid Lines & Y-Axis Labels */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                    const price = minPrice + priceRange * ratio;
                    const y = getY(price);
                    return (
                      <g key={ratio}>
                        <line
                          x1={paddingLeft}
                          y1={y}
                          x2={svgWidth - paddingRight}
                          y2={y}
                          stroke="#161922"
                          strokeWidth="1"
                          strokeDasharray="3 3"
                        />
                        <text
                          x={svgWidth - paddingRight + 6}
                          y={y + 3.5}
                          fill="#6b7280"
                          fontSize="10"
                          fontFamily="monospace"
                          className="font-medium"
                        >
                          {price >= 1 ? price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : price.toFixed(4)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Volume Separator Line & Label */}
                  <line
                    x1={paddingLeft}
                    y1={volumeTop - 5}
                    x2={svgWidth - paddingRight}
                    y2={volumeTop - 5}
                    stroke="#1a1d26"
                    strokeWidth="1"
                  />
                  <text x={paddingLeft + 4} y={volumeTop + 10} fill="#6b7280" fontSize="9" fontFamily="monospace">
                    Vol({baseSymbol})
                  </text>

                  {/* Moving Average Lines (MA7, MA25, MA99) */}
                  {ma99Path && <path d={ma99Path} fill="none" stroke="#9c27b0" strokeWidth="1.5" strokeOpacity="0.85" />}
                  {ma25Path && <path d={ma25Path} fill="none" stroke="#e91e63" strokeWidth="1.5" strokeOpacity="0.85" />}
                  {ma7Path && <path d={ma7Path} fill="none" stroke="#f3ba2f" strokeWidth="1.5" strokeOpacity="0.9" />}

                  {/* Candlesticks Rendering */}
                  {visibleCandles.map((candle, idx) => {
                    const x = getX(idx);
                    const isBullish = candle.close >= candle.open;
                    const color = isBullish ? '#0ecb81' : '#f84960';

                    const highY = getY(candle.high);
                    const lowY = getY(candle.low);
                    const openY = getY(candle.open);
                    const closeY = getY(candle.close);

                    const bodyTop = Math.min(openY, closeY);
                    const bodyHeight = Math.max(Math.abs(closeY - openY), 1.5);
                    const candleW = Math.max((svgWidth / visibleCandles.length) * 0.65, 4);

                    // Volume bar calculations
                    const volY = getVolY(candle.volume);
                    const volHeight = Math.max(volumeBottom - volY, 1);

                    return (
                      <g key={candle.time}>
                        {/* Candlestick Wick (High to Low vertical line) */}
                        <line
                          x1={x}
                          y1={highY}
                          x2={x}
                          y2={lowY}
                          stroke={color}
                          strokeWidth="1.2"
                        />

                        {/* Candlestick Body Rectangle */}
                        <rect
                          x={x - candleW / 2}
                          y={bodyTop}
                          width={candleW}
                          height={bodyHeight}
                          fill={color}
                          rx="0.5"
                        />

                        {/* Sub-chart: Volume Bar */}
                        <rect
                          x={x - candleW / 2}
                          y={volY}
                          width={candleW}
                          height={volHeight}
                          fill={color}
                          opacity={0.65}
                          rx="0.5"
                        />
                      </g>
                    );
                  })}

                  {/* Peak Callout Badge */}
                  {visibleCandles[peakIdx] && (
                    <g transform={`translate(${getX(peakIdx)}, ${getY(visibleCandles[peakIdx].high) - 8})`}>
                      <text textAnchor="middle" fill="#0ecb81" fontSize="9" fontFamily="monospace" fontWeight="bold">
                        ▲ {visibleCandles[peakIdx].high >= 1 ? visibleCandles[peakIdx].high.toFixed(2) : visibleCandles[peakIdx].high.toFixed(4)}
                      </text>
                    </g>
                  )}

                  {/* Trough Callout Badge */}
                  {visibleCandles[troughIdx] && (
                    <g transform={`translate(${getX(troughIdx)}, ${getY(visibleCandles[troughIdx].low) + 14})`}>
                      <text textAnchor="middle" fill="#f84960" fontSize="9" fontFamily="monospace" fontWeight="bold">
                        ▼ {visibleCandles[troughIdx].low >= 1 ? visibleCandles[troughIdx].low.toFixed(2) : visibleCandles[troughIdx].low.toFixed(4)}
                      </text>
                    </g>
                  )}

                  {/* Live Price Horizontal Line & Right Pulsing Badge */}
                  <line
                    x1={paddingLeft}
                    y1={livePriceY}
                    x2={svgWidth - paddingRight}
                    y2={livePriceY}
                    stroke={activeTicker.direction === 'down' ? '#f84960' : '#0ecb81'}
                    strokeWidth="1.2"
                    strokeDasharray="2 2"
                  />

                  {/* Right Y-Axis Live Price Tag */}
                  <g transform={`translate(${svgWidth - paddingRight}, ${livePriceY - 8})`}>
                    <rect
                      x="0"
                      y="0"
                      width="72"
                      height="16"
                      rx="3"
                      fill={activeTicker.direction === 'down' ? '#f84960' : '#0ecb81'}
                    />
                    <text
                      x="36"
                      y="11.5"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {activePrice >= 1 ? activePrice.toFixed(2) : activePrice.toFixed(4)}
                    </text>
                  </g>

                  {/* Interactive Crosshair & Cursor Price Marker */}
                  {cursorPos && (
                    <g className="pointer-events-none">
                      {/* Vertical Crosshair */}
                      <line
                        x1={cursorPos.x}
                        y1={paddingTop}
                        x2={cursorPos.x}
                        y2={volumeBottom}
                        stroke="#6b7280"
                        strokeWidth="0.8"
                        strokeDasharray="3 3"
                      />

                      {/* Horizontal Crosshair */}
                      <line
                        x1={paddingLeft}
                        y1={cursorPos.y}
                        x2={svgWidth - paddingRight}
                        y2={cursorPos.y}
                        stroke="#6b7280"
                        strokeWidth="0.8"
                        strokeDasharray="3 3"
                      />

                      {/* Right Y-Axis Cursor Price Pill */}
                      {cursorPrice && cursorPos.y <= chartBottom && (
                        <g transform={`translate(${svgWidth - paddingRight}, ${cursorPos.y - 7})`}>
                          <rect x="0" y="0" width="72" height="14" rx="2" fill="#374151" />
                          <text
                            x="36"
                            y="10"
                            textAnchor="middle"
                            fill="#f3f4f6"
                            fontSize="9"
                            fontFamily="monospace"
                          >
                            {cursorPrice >= 1 ? cursorPrice.toFixed(2) : cursorPrice.toFixed(4)}
                          </text>
                        </g>
                      )}
                    </g>
                  )}
                </svg>
              )}
            </div>

            {/* Right 3 Cols: Trades & Top Movers Feed */}
            <div className="lg:col-span-3 bg-[#0f1117] p-3 flex flex-col justify-between select-none">
              <div>
                {/* Header Tabs */}
                <div className="flex items-center justify-between border-b border-[#1b1e26] pb-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRightPanelTab('topMovers')}
                      className={`text-xs font-bold transition-colors ${
                        rightPanelTab === 'topMovers' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      Top Movers
                    </button>
                    <button
                      onClick={() => setRightPanelTab('trades')}
                      className={`text-xs font-bold transition-colors ${
                        rightPanelTab === 'trades' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      Live Trades
                    </button>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] text-[#0ecb81]">
                    <Radio className="w-3 h-3 animate-pulse" /> Live
                  </span>
                </div>

                {/* Mover Filter Pills */}
                {rightPanelTab === 'topMovers' && (
                  <div className="flex items-center gap-1 mb-2.5 overflow-x-auto pb-1">
                    {(['All', 'Rise', 'Fall', 'Pullback', 'Rally'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setMoverFilter(filter)}
                        className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap transition-colors ${
                          moverFilter === filter
                            ? 'bg-[#d4f434] text-black font-bold'
                            : 'bg-[#181a22] text-zinc-400 hover:text-white'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                )}

                {/* List Feed */}
                <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1">
                  {rightPanelTab === 'topMovers' ? (
                    filteredMovers.map((mover, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedSymbol(mover.pair)}
                        className="p-2 rounded-xl bg-[#14161f] hover:bg-[#1c1f2b] border border-white/5 transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <CryptoIcon symbol={mover.pair.replace('USDT', '')} size={18} />
                            <span className="text-xs font-bold text-white group-hover:text-[#d4f434] transition-colors">
                              {mover.pair}
                            </span>
                          </div>
                          <div className="text-[10px] text-zinc-500 mt-0.5">
                            {mover.time} • <span className="text-zinc-400">{mover.tag}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`text-xs font-bold font-mono ${
                              mover.isRise ? 'text-[#0ecb81]' : 'text-[#f84960]'
                            }`}
                          >
                            {mover.isRise ? '+' : ''}
                            {mover.change.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    /* Live Trades Feed Mock */
                    <div className="space-y-1.5 text-[11px] font-mono">
                      {[
                        { price: activePrice * 1.0002, size: '0.428', time: '14:15:02', isBuy: true },
                        { price: activePrice * 0.9998, size: '1.205', time: '14:15:01', isBuy: false },
                        { price: activePrice * 1.0001, size: '0.089', time: '14:14:59', isBuy: true },
                        { price: activePrice * 1.0003, size: '2.140', time: '14:14:57', isBuy: true },
                        { price: activePrice * 0.9995, size: '0.650', time: '14:14:54', isBuy: false },
                        { price: activePrice * 0.9997, size: '0.312', time: '14:14:52', isBuy: false },
                      ].map((t, idx) => (
                        <div key={idx} className="flex items-center justify-between px-2 py-1 rounded bg-[#14161f]">
                          <span className={t.isBuy ? 'text-[#0ecb81]' : 'text-[#f84960]'}>
                            {t.price >= 1 ? t.price.toFixed(2) : t.price.toFixed(4)}
                          </span>
                          <span className="text-zinc-300">{t.size}</span>
                          <span className="text-zinc-500 text-[10px]">{t.time}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-[#1b1e26] flex items-center justify-between text-[11px] text-zinc-400">
                <span className="flex items-center gap-1 text-[#d4f434]">
                  <TrendingUp className="w-3 h-3" /> Real-time Depth
                </span>
                <span>24h Perp Stream</span>
              </div>
            </div>
          </div>
        </>
      ) : activeTab === 'info' ? (
        /* Info Tab: Asset Fundamentals & Tokenomics */
        <div className="p-5 sm:p-6 bg-[#0c0d12] flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Top Token Overview Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#12141c] border border-white/5">
            <div className="flex items-center gap-3">
              <CryptoIcon symbol={baseSymbol} size={42} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{coinInfo.name}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#d4f434]/15 text-[#d4f434]">
                    Rank #{coinInfo.rank}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Consensus: <span className="text-zinc-200">{coinInfo.consensus}</span> • Launched: <span className="text-zinc-200">{coinInfo.issueDate}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={coinInfo.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1a1d28] hover:bg-[#242838] text-xs font-medium text-zinc-200 hover:text-white transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Website
              </a>
              <a
                href={coinInfo.whitepaper}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1a1d28] hover:bg-[#242838] text-xs font-medium text-zinc-200 hover:text-white transition-colors"
              >
                <FileText className="w-3.5 h-3.5" /> Whitepaper
              </a>
              <a
                href={coinInfo.explorer}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1a1d28] hover:bg-[#242838] text-xs font-medium text-zinc-200 hover:text-white transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Explorer
              </a>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 rounded-2xl bg-[#12141c] border border-white/5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">About {coinInfo.name}</h4>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans">{coinInfo.description}</p>
          </div>

          {/* Fundamental Market Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            <div className="p-3.5 rounded-2xl bg-[#12141c] border border-white/5">
              <span className="text-[11px] text-zinc-500 uppercase font-semibold block">Market Cap</span>
              <span className="text-sm sm:text-base font-bold text-white font-mono mt-1 block">{coinInfo.marketCap}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#12141c] border border-white/5">
              <span className="text-[11px] text-zinc-500 uppercase font-semibold block">Fully Diluted (FDV)</span>
              <span className="text-sm sm:text-base font-bold text-white font-mono mt-1 block">{coinInfo.fdv}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#12141c] border border-white/5">
              <span className="text-[11px] text-zinc-500 uppercase font-semibold block">Circulating Supply</span>
              <span className="text-sm sm:text-base font-bold text-white font-mono mt-1 block">{coinInfo.circulatingSupply}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#12141c] border border-white/5">
              <span className="text-[11px] text-zinc-500 uppercase font-semibold block">Max Supply</span>
              <span className="text-sm sm:text-base font-bold text-white font-mono mt-1 block">{coinInfo.maxSupply}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#12141c] border border-white/5">
              <span className="text-[11px] text-zinc-500 uppercase font-semibold block">All-Time High (ATH)</span>
              <span className="text-sm sm:text-base font-bold text-[#0ecb81] font-mono mt-1 block">{coinInfo.allTimeHigh}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#12141c] border border-white/5">
              <span className="text-[11px] text-zinc-500 uppercase font-semibold block">All-Time Low (ATL)</span>
              <span className="text-sm sm:text-base font-bold text-zinc-300 font-mono mt-1 block">{coinInfo.allTimeLow}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#12141c] border border-white/5">
              <span className="text-[11px] text-zinc-500 uppercase font-semibold block">24h Trading Volume</span>
              <span className="text-sm sm:text-base font-bold text-[#d4f434] font-mono mt-1 block">
                ${((volumeQuoteTotal || 3150210000) / 1000000).toFixed(2)}M
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#12141c] border border-white/5">
              <span className="text-[11px] text-zinc-500 uppercase font-semibold block">Market Dominance</span>
              <span className="text-sm sm:text-base font-bold text-white font-mono mt-1 block">
                {baseSymbol === 'BTC' ? '58.4%' : baseSymbol === 'ETH' ? '14.2%' : baseSymbol === 'SOL' ? '3.8%' : '1.2%'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Trading Data Tab: Derivatives & Market Analytics */
        <div className="p-5 sm:p-6 bg-[#0c0d12] flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Long / Short Ratio Meter */}
          <div className="p-5 rounded-2xl bg-[#12141c] border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#d4f434]" /> Global Accounts Long / Short Ratio
                </h4>
                <span className="text-xs text-zinc-400">Derivatives Position Skew (Binance Futures)</span>
              </div>
              <span className="font-mono text-sm font-bold text-[#d4f434]">
                Ratio: {coinInfo.longShortRatio.ratio}
              </span>
            </div>

            {/* Split Progress Bar */}
            <div className="h-4 w-full rounded-full bg-[#1b1e26] overflow-hidden flex">
              <div
                style={{ width: `${coinInfo.longShortRatio.longPercent}%` }}
                className="bg-[#0ecb81] h-full flex items-center justify-start pl-2 text-[10px] font-bold text-black"
              >
                {coinInfo.longShortRatio.longPercent}% Long
              </div>
              <div
                style={{ width: `${coinInfo.longShortRatio.shortPercent}%` }}
                className="bg-[#f84960] h-full flex items-center justify-end pr-2 text-[10px] font-bold text-white"
              >
                {coinInfo.longShortRatio.shortPercent}% Short
              </div>
            </div>
          </div>

          {/* 3 Analytics Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Taker Volume */}
            <div className="p-4 rounded-2xl bg-[#12141c] border border-white/5">
              <div className="flex items-center gap-2 mb-2 text-zinc-400 text-xs font-semibold">
                <Zap className="w-3.5 h-3.5 text-[#f3ba2f]" /> Taker Buy / Sell Volume
              </div>
              <div className="text-lg font-bold font-mono text-white mb-2">{coinInfo.takerVolume.totalVol}</div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Buy Volume</span>
                  <span className="text-[#0ecb81] font-mono font-semibold">{coinInfo.takerVolume.buyPercent}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Sell Volume</span>
                  <span className="text-[#f84960] font-mono font-semibold">{coinInfo.takerVolume.sellPercent}%</span>
                </div>
              </div>
            </div>

            {/* Open Interest */}
            <div className="p-4 rounded-2xl bg-[#12141c] border border-white/5">
              <div className="flex items-center gap-2 mb-2 text-zinc-400 text-xs font-semibold">
                <Layers className="w-3.5 h-3.5 text-[#d4f434]" /> Open Interest (USDT)
              </div>
              <div className="text-lg font-bold font-mono text-white mb-2">{coinInfo.openInterest.amount}</div>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-zinc-400">24h OI Change:</span>
                <span
                  className={`font-mono font-semibold flex items-center ${
                    coinInfo.openInterest.change24h >= 0 ? 'text-[#0ecb81]' : 'text-[#f84960]'
                  }`}
                >
                  {coinInfo.openInterest.change24h >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-0.5" />
                  )}
                  {coinInfo.openInterest.change24h >= 0 ? '+' : ''}
                  {coinInfo.openInterest.change24h}%
                </span>
              </div>
            </div>

            {/* 24h Liquidations */}
            <div className="p-4 rounded-2xl bg-[#12141c] border border-white/5">
              <div className="flex items-center gap-2 mb-2 text-zinc-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#e91e63]" /> 24h Total Liquidations
              </div>
              <div className="text-lg font-bold font-mono text-white mb-2">{coinInfo.liquidations24h.total}</div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Longs Liquidated</span>
                  <span className="text-[#f84960] font-mono font-semibold">{coinInfo.liquidations24h.longs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Shorts Liquidated</span>
                  <span className="text-[#0ecb81] font-mono font-semibold">{coinInfo.liquidations24h.shorts}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
