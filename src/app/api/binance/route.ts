import { NextResponse } from 'next/server';

export const TOP_COINS = [
  { symbol: 'BTC', name: 'Bitcoin', pair: 'BTCUSDT', category: 'L1', color: '#f7931a' },
  { symbol: 'ETH', name: 'Ethereum', pair: 'ETHUSDT', category: 'L1', color: '#627eea' },
  { symbol: 'SOL', name: 'Solana', pair: 'SOLUSDT', category: 'L1', color: '#14f195' },
  { symbol: 'BNB', name: 'Binance Coin', pair: 'BNBUSDT', category: 'L1', color: '#f3ba2f' },
  { symbol: 'XRP', name: 'Ripple', pair: 'XRPUSDT', category: 'Payment', color: '#23292f' },
  { symbol: 'DOGE', name: 'Dogecoin', pair: 'DOGEUSDT', category: 'Meme', color: '#c2a633' },
  { symbol: 'ADA', name: 'Cardano', pair: 'ADAUSDT', category: 'L1', color: '#0033ad' },
  { symbol: 'AVAX', name: 'Avalanche', pair: 'AVAXUSDT', category: 'L1', color: '#e84142' },
  { symbol: 'LINK', name: 'Chainlink', pair: 'LINKUSDT', category: 'DeFi', color: '#375bd2' },
  { symbol: 'DOT', name: 'Polkadot', pair: 'DOTUSDT', category: 'L1', color: '#e6007a' },
  { symbol: 'NEAR', name: 'Near Protocol', pair: 'NEARUSDT', category: 'L1', color: '#000000' },
  { symbol: 'SUI', name: 'Sui Network', pair: 'SUIUSDT', category: 'L1', color: '#4da2ff' },
  { symbol: 'APT', name: 'Aptos', pair: 'APTUSDT', category: 'L1', color: '#2ed8a7' },
  { symbol: 'SHIB', name: 'Shiba Inu', pair: 'SHIBUSDT', category: 'Meme', color: '#ff6933' },
  { symbol: 'PEPE', name: 'Pepe', pair: 'PEPEUSDT', category: 'Meme', color: '#55a939' },
  { symbol: 'ALGO', name: 'Algorand', pair: 'ALGOUSDT', category: 'L1', color: '#1a1a1a' },
  { symbol: 'LTC', name: 'Litecoin', pair: 'LTCUSDT', category: 'Payment', color: '#345d9d' },
  { symbol: 'UNI', name: 'Uniswap', pair: 'UNIUSDT', category: 'DeFi', color: '#ff007a' },
  { symbol: 'ATOM', name: 'Cosmos', pair: 'ATOMUSDT', category: 'L1', color: '#2e3148' },
  { symbol: 'RENDER', name: 'Render', pair: 'RENDERUSDT', category: 'AI', color: '#e51b24' },
  { symbol: 'TAO', name: 'Bittensor', pair: 'TAOUSDT', category: 'AI', color: '#2c2d30' },
  { symbol: 'FET', name: 'Artificial Superintelligence', pair: 'FETUSDT', category: 'AI', color: '#1d2a44' },
  { symbol: 'INJ', name: 'Injective', pair: 'INJUSDT', category: 'DeFi', color: '#00f2fe' },
  { symbol: 'HBAR', name: 'Hedera', pair: 'HBARUSDT', category: 'L1', color: '#2b2b2b' },
  { symbol: 'TON', name: 'Toncoin', pair: 'TONUSDT', category: 'L1', color: '#0098ea' },
];

export async function GET() {
  try {
    const pairNames = TOP_COINS.map((c) => c.pair);
    const symbolParams = JSON.stringify(pairNames);

    const res = await fetch(
      `https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(symbolParams)}`,
      {
        next: { revalidate: 3 }, // Revalidate every 3s
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CoinEdge-Dashboard/1.0',
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Binance API error: ${res.statusText}`);
    }

    const rawData = await res.json();
    return NextResponse.json({
      success: true,
      data: rawData,
      coinsConfig: TOP_COINS,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Binance API fetch failed, fallback active:', error);
    return NextResponse.json(
      {
        success: false,
        coinsConfig: TOP_COINS,
        message: 'Binance REST API unavailable, fallback client streaming active',
        error: String(error),
      },
      { status: 200 }
    );
  }
}
