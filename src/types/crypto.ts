export interface CryptoCardData {
  id: string;
  name: string;
  symbol: string;
  amount: string;
  price?: number;
  priceFormatted?: string;
  change24h?: number;
  high24h?: number;
  low24h?: number;
  volume24h?: number;
  bgGradient: string;
  theme: 'btc' | 'bnb' | 'usdt' | 'sol';
  iconColor: string;
  sparkline: number[];
}

export interface BinanceWsTickerPayload {
  e: string; // Event type '24hrTicker'
  E: number; // Event time
  s: string; // Symbol e.g. 'BTCUSDT'
  p: string; // Price change
  P: string; // Price change percent
  w: string; // Weighted average price
  x: string; // First trade(F)-1 price (previous close)
  c: string; // Last price
  Q: string; // Last quantity
  b: string; // Best bid price
  B: string; // Best bid quantity
  a: string; // Best ask price
  A: string; // Best ask quantity
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Total traded base asset volume
  q: string; // Total traded quote asset volume
}

export interface BinanceCombinedStreamMessage {
  stream: string;
  data: BinanceWsTickerPayload;
}

export interface UsageDataPoint {
  month: string;
  fullDate: string;
  assets: number;
  profits: number;
  deposits: number;
  priceFormatted: string;
  volFormatted: string;
}

export interface PopularCryptoItem {
  id: string;
  index: string;
  name: string;
  symbol: string;
  pair: string;
  category: 'L1' | 'DeFi' | 'AI' | 'Meme' | 'Payment';
  price: string;
  rawPrice: number;
  cagr: string;
  cagrSub: string;
  statistic: string;
  color: string;
  logoUrl?: string;
  change24h?: number;
  volume24h?: number;
  volumeFormatted?: string;
  high24h?: number;
  low24h?: number;
}

export interface TransactionItem {
  id: string;
  name: string;
  symbol: string;
  amount: string;
  usdValue: string;
  iconBg: string;
  logoUrl?: string;
  rawAmount?: number;
  isActive?: boolean;
}

export interface WalletInfo {
  currency: string;
  balance: string;
  percentageChange: number;
  revenueWeek: string;
  lastUpdated: string;
  chartPoints: number[];
  currentPinValue: string;
}

export type Timeframe = 'Today' | 'Last Week' | 'Last Month';
export type NavTab = 'Dashboard' | 'Cryptocurrencies' | 'Analytics' | 'Exchange' | 'Trade';

