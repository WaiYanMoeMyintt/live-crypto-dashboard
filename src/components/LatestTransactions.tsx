'use client';

import React from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { TransactionItem } from '@/types/crypto';
import { CryptoIcon } from './CryptoIcon';

interface LatestTransactionsProps {
  transactions: TransactionItem[];
  onSelectTransaction?: (tx: TransactionItem) => void;
  onSeeAll?: () => void;
}

export const LatestTransactions: React.FC<LatestTransactionsProps> = ({
  transactions,
  onSelectTransaction,
  onSeeAll,
}) => {
  return (
    <div className="bg-[#121418] border border-[#1e2128] rounded-2xl md:rounded-3xl p-4 sm:p-5 w-full shadow-lg flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <h2 className="text-base font-bold tracking-tight text-white font-sans">
          Lanst Transactions
        </h2>
        <button
          onClick={onSeeAll}
          className="group flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <span>See All</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Transaction List */}
      <div className="space-y-1.5 sm:space-y-2">
        {transactions.map((tx) => {
          const isActive = tx.isActive;

          return (
            <div
              key={tx.id}
              onClick={() => onSelectTransaction?.(tx)}
              className={`group flex items-center justify-between p-2 sm:p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                isActive
                  ? 'border border-[#d4f434]/40 bg-[#d4f434]/[0.04] shadow-[0_0_15px_rgba(212,244,52,0.08)]'
                  : 'hover:bg-[#181a20] border border-transparent'
              }`}
            >
              {/* Left: Icon + Name & Subtitle */}
              <div className="flex items-center gap-2.5">
                <CryptoIcon symbol={tx.symbol} name={tx.name} size={32} />
                <div className="flex flex-col">
                  <span className="text-xs sm:text-[13px] font-bold text-white group-hover:text-[#d4f434] transition-colors">
                    {tx.name}
                  </span>
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    {tx.symbol}
                  </span>
                </div>
              </div>


              {/* Right: Amounts & Arrow Button */}
              <div className="flex items-center gap-2.5">
                <div className="flex flex-col text-right">
                  <span className="text-xs sm:text-[13px] font-bold text-white">
                    {tx.amount}
                  </span>
                  <span className="text-[10px] font-medium text-zinc-400">
                    {tx.usdValue}
                  </span>
                </div>

                {/* Up-Right Arrow Button */}
                <div className="w-7 h-7 rounded-full bg-[#181a20] group-hover:bg-[#252834] group-hover:text-white flex items-center justify-center text-zinc-400 border border-white/5 transition-all duration-200">
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
