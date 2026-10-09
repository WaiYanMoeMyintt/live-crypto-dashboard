'use client';

import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Wallet, ShieldCheck, RefreshCw, Send, PlusCircle, QrCode, Copy, Check } from 'lucide-react';
import { CryptoIcon } from '../CryptoIcon';
import { TickerData } from '@/hooks/useBinanceLive';

interface WalletViewProps {
  tickers: Record<string, TickerData>;
}

export const WalletView: React.FC<WalletViewProps> = ({ tickers }) => {
  const [selectedAsset, setSelectedAsset] = useState<string>('BTC');
  const [activeActionModal, setActiveActionModal] = useState<'deposit' | 'withdraw' | 'buy' | null>(null);
  const [copied, setCopied] = useState(false);

  const assets = [
    { symbol: 'BTC', name: 'Bitcoin', balance: 0.845, category: 'L1' },
    { symbol: 'ETH', name: 'Ethereum', balance: 5.42, category: 'L1' },
    { symbol: 'SOL', name: 'Solana', balance: 34.8, category: 'L1' },
    { symbol: 'BNB', name: 'Binance Coin', balance: 12.5, category: 'L1' },
    { symbol: 'XRP', name: 'Ripple', balance: 4250.0, category: 'Payment' },
    { symbol: 'USDT', name: 'Tether USD', balance: 14500.0, category: 'Stablecoin' },
    { symbol: 'LINK', name: 'Chainlink', balance: 140.0, category: 'DeFi' },
    { symbol: 'DOGE', name: 'Dogecoin', balance: 18450.0, category: 'Meme' },
  ];

  // Calculate total net worth dynamically from live prices
  const totalNetWorth = assets.reduce((acc, asset) => {
    if (asset.symbol === 'USDT') return acc + asset.balance;
    const ticker = tickers[asset.symbol];
    const price = ticker ? ticker.price : 0;
    return acc + asset.balance * price;
  }, 0);

  const depositAddress = 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq';

  const handleCopy = () => {
    navigator.clipboard?.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5 w-full animate-in fade-in duration-300">
      {/* Top Banner Card: Total Portfolio Net Worth & Quick Actions */}
      <div className="bg-gradient-to-br from-[#14161f] via-[#101217] to-[#0c0d11] border border-[#1e222c] rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold mb-1">
              <Wallet className="w-4 h-4 text-[#d4f434]" />
              <span>Total Estimated Net Worth</span>
              <span className="flex items-center gap-1 text-[#4ade80] bg-[#162914] px-2 py-0.5 rounded-full text-[10px] border border-[#2ea043]/30">
                <ShieldCheck className="w-3 h-3" /> Protected
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
              ${totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Live valuation updated across 8 active blockchain wallets
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setActiveActionModal('deposit')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#d4f434] text-black font-bold text-xs hover:bg-[#bfe025] transition-all shadow-[0_0_15px_rgba(212,244,52,0.3)] cursor-pointer"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Deposit</span>
            </button>
            <button
              onClick={() => setActiveActionModal('withdraw')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1c1f28] hover:bg-[#252936] text-white font-semibold text-xs border border-white/10 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Withdraw</span>
            </button>
            <button
              onClick={() => setActiveActionModal('buy')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1c1f28] hover:bg-[#252936] text-zinc-300 hover:text-white text-xs border border-white/10 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buy / Sell</span>
            </button>
          </div>
        </div>
      </div>

      {/* Asset Breakdown Table */}
      <div className="bg-[#121418] border border-[#1e2128] rounded-3xl p-5 sm:p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-white">Your Asset Balances</h2>
          <span className="text-xs text-zinc-400 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-[#d4f434] animate-spin" /> Live Tickers
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[560px]">
            <thead>
              <tr className="border-b border-[#1c1f26] text-[11px] font-semibold text-zinc-400">
                <th className="pb-3 pl-2">Asset</th>
                <th className="pb-3 text-right">Holdings</th>
                <th className="pb-3 text-right">Live Price</th>
                <th className="pb-3 text-right">Total USD Value</th>
                <th className="pb-3 text-right">24h Change</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171920]">
              {assets.map((asset) => {
                const ticker = tickers[asset.symbol];
                const price = asset.symbol === 'USDT' ? 1.0 : ticker ? ticker.price : 0;
                const change = ticker ? ticker.change24h : 0;
                const totalValue = asset.balance * price;

                return (
                  <tr
                    key={asset.symbol}
                    onClick={() => setSelectedAsset(asset.symbol)}
                    className={`group transition-colors hover:bg-[#181a20]/60 cursor-pointer ${
                      selectedAsset === asset.symbol ? 'bg-white/[0.02]' : ''
                    }`}
                  >
                    <td className="py-3.5 pl-2">
                      <div className="flex items-center gap-3">
                        <CryptoIcon symbol={asset.symbol} name={asset.name} size={30} />
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-white group-hover:text-[#d4f434] transition-colors">
                            {asset.name}
                          </div>
                          <div className="text-[10px] text-zinc-400 font-semibold uppercase">
                            {asset.symbol} • {asset.category}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 text-right font-mono text-xs sm:text-sm text-zinc-200 font-semibold">
                      {asset.balance.toLocaleString()} {asset.symbol}
                    </td>

                    <td className="py-3.5 text-right font-mono text-xs sm:text-sm text-zinc-300">
                      ${price >= 1 ? price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : price.toFixed(4)}
                    </td>

                    <td className="py-3.5 text-right font-mono text-xs sm:text-sm font-bold text-white">
                      ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    <td className="py-3.5 text-right">
                      <span className={`text-xs font-semibold ${change >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                        {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3.5 text-right pr-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveActionModal('deposit');
                        }}
                        className="px-3 py-1 rounded-full bg-[#181a20] hover:bg-[#232630] border border-white/10 text-zinc-300 hover:text-white text-[11px] font-semibold transition-all inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Deposit</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deposit / Withdraw Modal */}
      {activeActionModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveActionModal(null)}
        >
          <div
            className="bg-[#14161f] border border-white/15 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white capitalize flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#d4f434]" />
                {activeActionModal} Crypto
              </h3>
              <button
                onClick={() => setActiveActionModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 text-zinc-300 hover:text-white flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-40 h-40 bg-white p-3 rounded-2xl flex items-center justify-center mb-4 shadow-md">
                {/* SVG Mock QR Code */}
                <svg viewBox="0 0 100 100" className="w-full h-full fill-black">
                  <rect x="10" y="10" width="30" height="30" fill="none" stroke="black" strokeWidth="6" />
                  <rect x="20" y="20" width="10" height="10" fill="black" />
                  <rect x="60" y="10" width="30" height="30" fill="none" stroke="black" strokeWidth="6" />
                  <rect x="70" y="20" width="10" height="10" fill="black" />
                  <rect x="10" y="60" width="30" height="30" fill="none" stroke="black" strokeWidth="6" />
                  <rect x="20" y="70" width="10" height="10" fill="black" />
                  <rect x="50" y="50" width="15" height="15" fill="black" />
                  <rect x="70" y="60" width="10" height="25" fill="black" />
                </svg>
              </div>

              <span className="text-xs text-zinc-400 mb-1">Your BTC Deposit Address</span>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0d0e14] border border-white/10 w-full mb-4">
                <span className="font-mono text-xs text-zinc-200 truncate flex-1">{depositAddress}</span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  title="Copy address"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#0ecb81]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                onClick={() => setActiveActionModal(null)}
                className="w-full py-3 rounded-full bg-[#d4f434] hover:bg-[#bfe025] text-black font-bold text-xs transition-all shadow-md cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
