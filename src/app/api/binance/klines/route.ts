import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get('symbol') || 'BTCUSDT').toUpperCase();
  const interval = searchParams.get('interval') || '1h';
  const limit = searchParams.get('limit') || '60';

  try {
    const res = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(interval)}&limit=${encodeURIComponent(limit)}`,
      {
        next: { revalidate: 2 }, // Cache 2 seconds
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CoinEdge-Dashboard/1.0',
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Binance klines error: ${res.status} ${res.statusText}`);
    }

    const rawKlines = await res.json();

    // Map to clean structured candlestick objects
    const candles = rawKlines.map((k: (number | string)[]) => ({
      time: Number(k[0]),
      open: parseFloat(String(k[1])),
      high: parseFloat(String(k[2])),
      low: parseFloat(String(k[3])),
      close: parseFloat(String(k[4])),
      volume: parseFloat(String(k[5])),
      closeTime: Number(k[6]),
      quoteVolume: parseFloat(String(k[7])),
      trades: Number(k[8]),
    }));

    return NextResponse.json({
      success: true,
      symbol,
      interval,
      data: candles,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error(`Failed to fetch klines for ${symbol}:`, error);

    // Generate realistic fallback klines if network throttled
    const now = Date.now();
    const intervalMs = interval === '15m' ? 15 * 60 * 1000 : interval === '4h' ? 4 * 3600 * 1000 : interval === '1d' ? 24 * 3600 * 1000 : 3600 * 1000;
    const count = parseInt(limit, 10) || 50;

    let basePrice = symbol.includes('BTC') ? 85700 : symbol.includes('ETH') ? 2700 : symbol.includes('SOL') ? 185 : 1.84;
    const generated = [];

    for (let i = count - 1; i >= 0; i--) {
      const time = now - i * intervalMs;
      const volatility = basePrice * 0.008;
      const open = basePrice;
      const delta = (Math.random() - 0.48) * volatility;
      const close = open + delta;
      const high = Math.max(open, close) + Math.random() * volatility * 0.5;
      const low = Math.min(open, close) - Math.random() * volatility * 0.5;
      const volume = Math.random() * 500 + 100;
      basePrice = close;

      generated.push({
        time,
        open,
        high,
        low,
        close,
        volume,
        closeTime: time + intervalMs,
        quoteVolume: volume * close,
        trades: Math.floor(Math.random() * 800 + 200),
      });
    }

    return NextResponse.json({
      success: false,
      isFallback: true,
      symbol,
      interval,
      data: generated,
      timestamp: Date.now(),
    });
  }
}
