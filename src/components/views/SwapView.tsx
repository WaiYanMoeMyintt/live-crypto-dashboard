'use client';

import React, { useState } from 'react';
import {
  ArrowDownUp,
  Settings2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { CryptoIcon } from '../CryptoIcon';
import { TickerData } from '@/hooks/useBinanceLive';

interface SwapViewProps {
  tickers: Record<string, TickerData>;
}

const AVAILABLE_SWAP_TOKENS = ['USDT', 'BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'DOGE', 'ADA', 'AVAX', 'LINK', 'SUI', 'NEAR'];

export const SwapView: React.FC<SwapViewProps> = ({ tickers }) => {
  const [paySymbol, setPaySymbol] = useState('USDT');
  const [receiveSymbol, setReceiveSymbol] = useState('BTC');
  const [payAmount, setPayAmount] = useState<string>('1000');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isPayDropdownOpen, setIsPayDropdownOpen] = useState(false);
  const [isReceiveDropdownOpen, setIsReceiveDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const payPrice = paySymbol === 'USDT' ? 1.0 : tickers[paySymbol]?.price || (paySymbol === 'BTC' ? 86415.09 : paySymbol === 'ETH' ? 2726.37 : 184.6);
  const receivePrice = receiveSymbol === 'USDT' ? 1.0 : tickers[receiveSymbol]?.price || (receiveSymbol === 'BTC' ? 86415.09 : receiveSymbol === 'ETH' ? 2726.37 : 184.6);

  const numPay = parseFloat(payAmount) || 0;
  const calculatedReceive = (numPay * payPrice) / receivePrice;
  const simulatedTxHash = '0x7f48a912c9b4e3194a0815cb9824f92d47e8e91a';

  const handleSwapPairs = () => {
    const temp = paySymbol;
    setPaySymbol(receiveSymbol);
    setReceiveSymbol(temp);
  };

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(simulatedTxHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-center w-full py-4 animate-in fade-in duration-300">
      <div className="bg-[#121418] border border-[#1e2128] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Instant Swap</h2>
            <p className="text-xs text-zinc-400">Zero slippage routing via Binance Liquidity</p>
          </div>
          <button className="w-8 h-8 rounded-full bg-[#181a20] hover:bg-[#232630] flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
            <Settings2 className="w-4 h-4" />
          </button>
        </div>

        {/* You Pay Box */}
        <div className="bg-[#0b0c0f] border border-[#1a1c24] rounded-2xl p-4 mb-2 relative">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span>You Pay</span>
            <span>Balance: 14,500.00 {paySymbol}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <input
              type="number"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              placeholder="0.00"
              className="bg-transparent font-mono text-2xl font-bold text-white focus:outline-none w-full"
            />

            {/* Pay Token Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsPayDropdownOpen(!isPayDropdownOpen);
                  setIsReceiveDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181a22] hover:bg-[#222530] border border-white/10 text-white font-bold text-xs shrink-0 transition-colors"
              >
                <CryptoIcon symbol={paySymbol} size={22} />
                <span>{paySymbol}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              {isPayDropdownOpen && (
                <div className="absolute right-0 top-10 z-50 bg-[#161822] border border-white/10 rounded-2xl p-2 shadow-2xl min-w-[140px] max-h-56 overflow-y-auto">
                  {AVAILABLE_SWAP_TOKENS.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setPaySymbol(t);
                        setIsPayDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                        paySymbol === t ? 'bg-[#d4f434]/15 text-[#d4f434] font-bold' : 'text-zinc-300 hover:bg-white/5'
                      }`}
                    >
                      <CryptoIcon symbol={t} size={18} />
                      <span>{t}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 mt-1 font-mono">
            ≈ ${(numPay * payPrice).toFixed(2)} USD
          </div>
        </div>

        {/* Swap Direction Switcher */}
        <div className="flex justify-center -my-3 relative z-10">
          <button
            onClick={handleSwapPairs}
            className="w-10 h-10 rounded-full bg-[#1e212b] hover:bg-[#282c3b] border-4 border-[#121418] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:rotate-180 duration-300"
            title="Invert swap pairs"
          >
            <ArrowDownUp className="w-4 h-4 text-[#d4f434]" />
          </button>
        </div>

        {/* You Receive Box */}
        <div className="bg-[#0b0c0f] border border-[#1a1c24] rounded-2xl p-4 mt-2 mb-4 relative">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span>You Receive (Estimated)</span>
            <span>Rate: 1 {receiveSymbol} ≈ ${(receivePrice / payPrice).toLocaleString()} {paySymbol}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="font-mono text-2xl font-bold text-[#d4f434] overflow-hidden truncate">
              {calculatedReceive >= 1 ? calculatedReceive.toFixed(4) : calculatedReceive.toFixed(6)}
            </div>

            {/* Receive Token Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsReceiveDropdownOpen(!isReceiveDropdownOpen);
                  setIsPayDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181a22] hover:bg-[#222530] border border-white/10 text-white font-bold text-xs shrink-0 transition-colors"
              >
                <CryptoIcon symbol={receiveSymbol} size={22} />
                <span>{receiveSymbol}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              {isReceiveDropdownOpen && (
                <div className="absolute right-0 top-10 z-50 bg-[#161822] border border-white/10 rounded-2xl p-2 shadow-2xl min-w-[140px] max-h-56 overflow-y-auto">
                  {AVAILABLE_SWAP_TOKENS.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setReceiveSymbol(t);
                        setIsReceiveDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                        receiveSymbol === t ? 'bg-[#d4f434]/15 text-[#d4f434] font-bold' : 'text-zinc-300 hover:bg-white/5'
                      }`}
                    >
                      <CryptoIcon symbol={t} size={18} />
                      <span>{t}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 mt-1 font-mono">
            ≈ ${(calculatedReceive * receivePrice).toFixed(2)} USD
          </div>
        </div>

        {/* Network Fee & Slippage Notice */}
        <div className="flex items-center justify-between text-xs text-zinc-400 px-1 mb-6">
          <span className="flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-zinc-500" /> Network Fee
          </span>
          <span className="text-zinc-200 font-medium">~$0.85 (0.00%)</span>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsSuccessModalOpen(true)}
          className="w-full py-3.5 rounded-full bg-[#d4f434] hover:bg-[#bfe025] text-black font-extrabold text-sm transition-all shadow-[0_0_20px_rgba(212,244,52,0.35)] flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Confirm Swap</span>
        </button>
      </div>

      {/* Beautiful High-End Swap Success Modal */}
      {isSuccessModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsSuccessModalOpen(false)}
        >
          <div
            className="bg-[#12141c] border border-white/15 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-[0_25px_80px_rgba(0,0,0,0.8)] relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success Icon */}
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-14 h-14 rounded-full bg-[#0ecb81]/15 border border-[#0ecb81]/30 flex items-center justify-center text-[#0ecb81] mb-3 shadow-[0_0_30px_rgba(14,203,129,0.3)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Swap Successful!</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Transaction verified and confirmed on Binance Liquidity</p>
            </div>

            {/* Swap Summary Card */}
            <div className="bg-[#0b0c10] border border-white/5 rounded-2xl p-4 mb-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">You Paid</span>
                <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold text-white">
                  <CryptoIcon symbol={paySymbol} size={18} />
                  <span>{payAmount} {paySymbol}</span>
                </div>
              </div>

              <div className="flex items-center justify-center text-zinc-600">
                <ArrowRight className="w-4 h-4 text-[#d4f434]" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">You Received</span>
                <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold text-[#d4f434]">
                  <CryptoIcon symbol={receiveSymbol} size={18} />
                  <span>{calculatedReceive >= 1 ? calculatedReceive.toFixed(4) : calculatedReceive.toFixed(6)} {receiveSymbol}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 space-y-1.5 text-[11px] text-zinc-400">
                <div className="flex justify-between">
                  <span>Execution Rate</span>
                  <span className="font-mono text-zinc-200">1 {receiveSymbol} ≈ ${(receivePrice / payPrice).toFixed(2)} {paySymbol}</span>
                </div>
                <div className="flex justify-between">
                  <span>Network Fee</span>
                  <span className="text-zinc-200 font-mono">~$0.85 (0.00%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Transaction Hash</span>
                  <button
                    onClick={handleCopyHash}
                    className="flex items-center gap-1 text-[10px] font-mono text-zinc-300 hover:text-[#d4f434] transition-colors"
                  >
                    <span>{simulatedTxHash.slice(0, 8)}...{simulatedTxHash.slice(-6)}</span>
                    {copied ? <Check className="w-3 h-3 text-[#0ecb81]" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full py-3 rounded-full bg-[#d4f434] hover:bg-[#bfe025] text-black font-bold text-xs transition-all shadow-md active:scale-98 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
