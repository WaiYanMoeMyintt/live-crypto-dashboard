import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, LineChart } from 'lucide-react';
import { PopularCryptoItem } from '@/types/crypto';
import { CryptoIcon } from './CryptoIcon';

interface PopularCryptoTableProps {
  cryptos: PopularCryptoItem[];
  onTransferClick?: (item: PopularCryptoItem) => void;
  onSelectCoin?: (item: PopularCryptoItem) => void;
}

type FilterCategory = 'ALL' | 'L1' | 'DeFi' | 'AI' | 'Meme' | 'GAINERS' | 'VOLUME';

export const PopularCryptoTable: React.FC<PopularCryptoTableProps> = ({
  cryptos,
  onTransferClick,
  onSelectCoin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('ALL');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter and sort coins
  const processedCryptos = useMemo(() => {
    let list = [...cryptos];

    // 1. Text Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.symbol.toLowerCase().includes(q) ||
          (c.pair && c.pair.toLowerCase().includes(q))
      );
    }

    // 2. Category Filter & Sorting
    if (activeCategory === 'GAINERS') {
      list.sort((a, b) => (b.change24h || 0) - (a.change24h || 0));
    } else if (activeCategory === 'VOLUME') {
      list.sort((a, b) => (b.volume24h || b.rawPrice * 1000) - (a.volume24h || a.rawPrice * 1000));
    } else if (activeCategory !== 'ALL') {
      list = list.filter((c) => c.category === activeCategory);
    }

    return list;
  }, [cryptos, searchQuery, activeCategory]);

  // Display subset or full list based on expanded state
  const displayedCryptos = isExpanded ? processedCryptos : processedCryptos.slice(0, 5);

  const filterOptions: { id: FilterCategory; label: string }[] = [
    { id: 'ALL', label: 'All Cryptos' },
    { id: 'L1', label: 'Layer 1' },
    { id: 'DeFi', label: 'DeFi' },
    { id: 'AI', label: 'AI & Data' },
    { id: 'Meme', label: 'Meme' },
    { id: 'GAINERS', label: 'Top Gainers' },
    { id: 'VOLUME', label: 'Top Volume' },
  ];

  return (
    <div className="bg-[#121418] border border-[#1e2128] rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 w-full shadow-lg transition-all duration-300">
      {/* Table Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        {/* Left: Section Title & Count Badge */}
        <div className="flex items-center gap-2.5 shrink-0">
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-white font-sans whitespace-nowrap">
            Popular Cryptocurrencies
          </h2>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#1c1f26] text-zinc-400 border border-white/5 whitespace-nowrap">
            {processedCryptos.length} Pairs
          </span>
        </div>

        {/* Right: Category Pills + Search + Filters */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Category Filter Pills (hidden if search is open to avoid crowding) */}
          {!isSearchOpen && (
            <div className="hidden 2xl:flex items-center gap-1.5 bg-[#0e1014] p-1 rounded-full border border-white/5">
              {filterOptions.slice(0, 5).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setActiveCategory(opt.id)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-all duration-200 whitespace-nowrap ${
                    activeCategory === opt.id
                      ? 'bg-[#d4f434] text-black font-semibold shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Search bar toggle & input */}
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <div className="relative flex items-center animate-in fade-in zoom-in-95 duration-150">
                <input
                  type="text"
                  placeholder="Search coins..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="bg-[#181a20] border border-[#d4f434]/50 focus:border-[#d4f434] text-xs text-white rounded-full pl-8 pr-7 py-1.5 focus:outline-none transition-all w-44 sm:w-56 shadow-[0_0_12px_rgba(212,244,52,0.15)]"
                />
                <Search className="w-3.5 h-3.5 text-[#d4f434] absolute left-2.5" />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="absolute right-2 text-zinc-400 hover:text-white text-xs p-1 rounded-full hover:bg-white/10 transition-colors"
                  title="Close search"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-8 h-8 rounded-full bg-[#181a20] hover:bg-[#232630] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-200"
                title="Search"
                aria-label="Search"
              >
                <Search className="w-3.5 h-3.5 stroke-[2]" />
              </button>
            )}
          </div>

          {/* Filter Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-all duration-200 ${
                activeCategory !== 'ALL'
                  ? 'bg-[#d4f434]/15 border-[#d4f434]/40 text-[#d4f434]'
                  : 'bg-[#181a20] hover:bg-[#232630] border-white/5 text-zinc-300 hover:text-white'
              }`}
              title="Filter options"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span className="text-[11px] font-medium">
                {activeCategory === 'ALL' ? 'Filters' : filterOptions.find(f => f.id === activeCategory)?.label}
              </span>
            </button>

            {isFilterDropdownOpen && (
              <div className="absolute right-0 top-10 z-40 bg-[#161820] border border-white/10 rounded-2xl p-2 shadow-2xl min-w-[170px] animate-in fade-in duration-150">
                <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider px-2 py-1">
                  Filter by Category
                </div>
                {filterOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setActiveCategory(opt.id);
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      activeCategory === opt.id
                        ? 'bg-[#d4f434]/15 text-[#d4f434] font-semibold'
                        : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {activeCategory === opt.id && <span className="w-1.5 h-1.5 rounded-full bg-[#d4f434]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[540px]">
          <thead>
            <tr className="border-b border-[#1c1f26] text-[11px] font-semibold text-zinc-400">
              <th className="pb-3 pl-2 w-8">#</th>
              <th className="pb-3">Currency Name</th>
              <th className="pb-3 text-right pr-4">Price</th>
              <th className="pb-3 text-right pr-4">Cagr/Month</th>
              <th className="pb-3 text-center">Statistic</th>
              <th className="pb-3 text-right pr-2">Exchange</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#171920]">
            {displayedCryptos.map((item) => (
              <tr
                key={item.id}
                onClick={() => onSelectCoin?.(item)}
                className="group transition-colors duration-150 hover:bg-[#181a20]/60 cursor-pointer"
              >
                {/* Index # */}
                <td className="py-3.5 pl-2 text-xs font-medium text-zinc-400">
                  {item.index}
                </td>

                {/* Currency Name & Icon */}
                <td className="py-3.5">
                  <div className="flex items-center gap-2.5">
                    <CryptoIcon symbol={item.symbol} name={item.name} size={28} />
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-[13px] font-bold text-white group-hover:text-[#d4f434] transition-colors">
                        {item.name} / {item.symbol}
                      </span>
                      {item.category && (
                        <span className="hidden sm:inline-block text-[9px] font-bold px-1.5 py-0.2 rounded bg-white/5 text-zinc-400 uppercase">
                          {item.category}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Price (Live Binance Ticker) */}
                <td className="py-3.5 text-right pr-4 text-xs sm:text-[13px] font-semibold text-zinc-100 font-mono tracking-tight">
                  {item.price}
                </td>

                {/* Cagr/Month */}
                <td className="py-3.5 text-right pr-4">
                  <div
                    className={`flex items-center justify-end gap-1 text-xs sm:text-[13px] font-semibold ${
                      item.change24h !== undefined && item.change24h < 0
                        ? 'text-[#f87171]'
                        : 'text-[#4ade80]'
                    }`}
                  >
                    <span>{item.cagr}</span>
                    <span className="text-zinc-500 font-normal text-[11px]">{item.cagrSub}</span>
                  </div>
                </td>

                {/* Statistic */}
                <td className="py-3.5 text-center">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#1c1f26] text-zinc-300 text-[11px] font-medium border border-white/5">
                    {item.statistic || '249,1 MB'}
                  </span>
                </td>

                {/* Exchange / Transfer Button & Pro Chart Quick Action */}
                <td className="py-3.5 text-right pr-2">
                  <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onSelectCoin?.(item)}
                      className="p-1.5 rounded-full bg-[#181a20] hover:bg-[#232630] border border-white/10 text-zinc-400 hover:text-[#d4f434] text-xs transition-colors"
                      title="Open Pro Candlestick Flow Chart"
                    >
                      <LineChart className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onTransferClick?.(item)}
                      className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-[#181a20] hover:bg-[#232630] border border-white/10 text-zinc-300 hover:text-white text-[11px] font-semibold transition-all duration-200 group-hover:border-[#d4f434]/30"
                    >
                      <span>Transfer Now</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Show More / Show Less Toggle Bar */}
      {processedCryptos.length > 5 && (
        <div className="mt-4 pt-3 border-t border-[#1a1c24] flex items-center justify-between text-xs text-zinc-400">
          <span className="text-[11px]">
            Showing {displayedCryptos.length} of {processedCryptos.length} live crypto pairs
          </span>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="group flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#181a22] hover:bg-[#222530] text-zinc-200 hover:text-white font-medium border border-white/5 transition-all duration-200"
          >
            <span>{isExpanded ? 'Show Less' : `View All (${processedCryptos.length} Coins)`}</span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-y-0.5" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};
