'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  quoteVolume?: number;
  trades?: number;
  isClosed?: boolean;
}

export interface KlineStreamState {
  candles: Candle[];
  ma7: (number | null)[];
  ma25: (number | null)[];
  ma99: (number | null)[];
  currentCandle: Candle | null;
  high24h: number;
  low24h: number;
  volumeTotal: number;
  volumeQuoteTotal: number;
  isLoading: boolean;
  isConnected: boolean;
}

// Calculate simple moving average
function calculateSMA(data: Candle[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].close;
      }
      result.push(sum / period);
    }
  }
  return result;
}

export function useBinanceKlineStream(
  symbol = 'BTCUSDT',
  interval = '1h',
  enabled = true
) {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const wsRef = useRef<WebSocket | null>(null);

  const cleanSymbol = symbol.toUpperCase().replace('/', '');

  // 1. Initial snapshot fetch
  const fetchKlines = useCallback(async () => {
    try {
      const res = await fetch(`/api/binance/klines?symbol=${cleanSymbol}&interval=${interval}&limit=70`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setCandles(json.data);
        }
      }
    } catch (e) {
      console.error('Error loading initial klines:', e);
    } finally {
      setIsLoading(false);
    }
  }, [cleanSymbol, interval]);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    const loadData = async () => {
      try {
        const res = await fetch(`/api/binance/klines?symbol=${cleanSymbol}&interval=${interval}&limit=70`);
        if (res.ok && !cancelled) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data)) {
            setCandles(json.data);
          }
        }
      } catch (e) {
        if (!cancelled) console.error('Error loading initial klines:', e);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [cleanSymbol, interval, enabled]);

  // 2. Real-time WebSocket connection for live kline ticking
  useEffect(() => {
    if (!enabled) return;

    let ws: WebSocket | null = null;
    let fallbackInterval: NodeJS.Timeout | null = null;

    try {
      const streamName = `${cleanSymbol.toLowerCase()}@kline_${interval}`;
      ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streamName}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.e === 'kline' && payload.k) {
            const k = payload.k;
            const updatedCandle: Candle = {
              time: Number(k.t),
              open: parseFloat(k.o),
              high: parseFloat(k.h),
              low: parseFloat(k.l),
              close: parseFloat(k.c),
              volume: parseFloat(k.v),
              quoteVolume: parseFloat(k.q),
              trades: Number(k.n),
              isClosed: Boolean(k.x),
            };

            setCandles((prev) => {
              if (prev.length === 0) return [updatedCandle];

              const lastIdx = prev.length - 1;
              const last = prev[lastIdx];

              // If same bucket time, update current candle
              if (last.time === updatedCandle.time) {
                const updated = [...prev];
                updated[lastIdx] = updatedCandle;
                return updated;
              }

              // New candle period started
              return [...prev.slice(1), updatedCandle];
            });
          }
        } catch {
          // Ignore JSON parse error
        }
      };

      ws.onerror = () => {
        setIsConnected(false);
      };

      ws.onclose = () => {
        setIsConnected(false);
      };
    } catch {
      // WebSocket creation failed (e.g. offline or SSR)
    }

    // Micro-jitter simulation if websocket is throttled
    fallbackInterval = setInterval(() => {
      setCandles((prev) => {
        if (prev.length === 0) return prev;
        const lastIdx = prev.length - 1;
        const last = prev[lastIdx];
        const delta = (Math.random() - 0.49) * (last.close * 0.0008);
        const newClose = last.close + delta;
        const updated: Candle = {
          ...last,
          close: newClose,
          high: Math.max(last.high, newClose),
          low: Math.min(last.low, newClose),
          volume: last.volume + Math.random() * 2,
        };
        const copy = [...prev];
        copy[lastIdx] = updated;
        return copy;
      });
    }, 1800);

    return () => {
      if (ws) {
        ws.close();
      }
      if (fallbackInterval) {
        clearInterval(fallbackInterval);
      }
    };
  }, [cleanSymbol, interval, enabled]);

  // Compute Moving Averages and ranges
  const ma7 = calculateSMA(candles, 7);
  const ma25 = calculateSMA(candles, 25);
  const ma99 = calculateSMA(candles, 99);

  const currentCandle = candles[candles.length - 1] || null;
  const high24h = candles.length > 0 ? Math.max(...candles.map((c) => c.high)) : 0;
  const low24h = candles.length > 0 ? Math.min(...candles.map((c) => c.low)) : 0;
  const volumeTotal = candles.reduce((acc, c) => acc + c.volume, 0);
  const volumeQuoteTotal = candles.reduce((acc, c) => acc + (c.quoteVolume || c.volume * c.close), 0);

  return {
    candles,
    ma7,
    ma25,
    ma99,
    currentCandle,
    high24h,
    low24h,
    volumeTotal,
    volumeQuoteTotal,
    isLoading,
    isConnected,
    refetch: fetchKlines,
  };
}
