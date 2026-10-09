'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AssetHero } from './AssetHero';
import { CryptoStatCards } from './CryptoStatCards';
import { UsageChart } from './UsageChart';
import { PopularCryptoTable } from './PopularCryptoTable';
import { LatestTransactions } from './LatestTransactions';
import { WalletCard } from './WalletCard';
import { WalletView } from './views/WalletView';
import { TradingGridView } from './views/TradingGridView';
import { SwapView } from './views/SwapView';
import { AnalyticsView } from './views/AnalyticsView';
import { ProPriceFlowChart } from './ProPriceFlowChart';
import {
  initialCryptoCards,
  usageDataPoints,
  popularCryptos as mockPopular,
  latestTransactions as mockTransactions,
  walletData as mockWallet,
} from '@/data/mockData';
import { useBinanceLive } from '@/hooks/useBinanceLive';
import { NavTab } from '@/types/crypto';

export const CryptoDashboard: React.FC = () => {
  const [activeHeaderTab, setActiveHeaderTab] = useState<NavTab>('Dashboard');
  const [activeSidebarTab, setActiveSidebarTab] = useState('home');
  const isLiveEnabled = true;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeProChartSymbol, setActiveProChartSymbol] = useState<string | null>(null);

  // Binance live market data hook
  const { tickers } = useBinanceLive(isLiveEnabled);

  // Master crypto cards derived from baseline + live ticker data
  const cryptoCards = useMemo(() => {
    return initialCryptoCards.map((c) => {
      const ticker = tickers[c.symbol];
      if (ticker && isLiveEnabled) {
        return {
          ...c,
          price: ticker.price,
          priceFormatted: ticker.priceFormatted,
          change24h: ticker.change24h,
          high24h: ticker.high24h,
          low24h: ticker.low24h,
        };
      }
      return c;
    });
  }, [tickers, isLiveEnabled]);

  // Popular cryptos list derived from baseline + live ticker data
  const popularList = useMemo(() => {
    return mockPopular.map((p) => {
      const ticker = tickers[p.symbol];
      if (ticker && isLiveEnabled) {
        const formatted =
          ticker.price >= 1000
            ? `$${ticker.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : ticker.price >= 1
            ? `$${ticker.price.toFixed(2)}`
            : ticker.price >= 0.001
            ? `$${ticker.price.toFixed(4)}`
            : `$${ticker.price.toFixed(6)}`;

        return {
          ...p,
          price: formatted,
          rawPrice: ticker.price,
          change24h: ticker.change24h,
          cagr: `${ticker.change24h >= 0 ? '+' : ''}${ticker.change24h.toFixed(2)}%`,
          volume24h: ticker.volumeQuote,
          high24h: ticker.high24h,
          low24h: ticker.low24h,
        };
      }
      return p;
    });
  }, [tickers, isLiveEnabled]);

  // Transactions list with live USD rates
  const transactionsList = useMemo(() => {
    return mockTransactions.map((tx) => {
      const ticker = tickers[tx.symbol];
      if (ticker && isLiveEnabled) {
        const rawCoinAmount = 18.9718;
        const liveUsd = rawCoinAmount * ticker.price;
        return {
          ...tx,
          usdValue: `${liveUsd.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} USD`,
        };
      }
      return tx;
    });
  }, [tickers, isLiveEnabled]);

  const [wallet, setWallet] = useState(mockWallet);
  const dashboardRef = useRef<HTMLDivElement>(null);

  // GSAP Entrance Timeline
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        dashboardRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
        .fromTo(
          '.gsap-fade-in',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
          '-=0.3'
        );
    }, dashboardRef);

    return () => ctx.revert();
  }, []);

  const handleWalletRefresh = () => {
    setWallet((prev) => ({
      ...prev,
      lastUpdated: 'Just now',
      balance: `$${(30976.82 + (Math.random() - 0.4) * 50).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    }));
  };

  // Synchronized Tab Switching Handlers
  const handleSidebarTabChange = (tab: string) => {
    setActiveSidebarTab(tab);
    if (tab === 'home') setActiveHeaderTab('Dashboard');
    else if (tab === 'wallet') setActiveHeaderTab('Dashboard');
    else if (tab === 'grid') setActiveHeaderTab('Cryptocurrencies');
    else if (tab === 'swap') setActiveHeaderTab('Exchange');
    else if (tab === 'analytics') setActiveHeaderTab('Analytics');
  };

  const handleHeaderTabChange = (tab: NavTab) => {
    setActiveHeaderTab(tab);
    if (tab === 'Dashboard') setActiveSidebarTab('home');
    else if (tab === 'Cryptocurrencies') setActiveSidebarTab('grid');
    else if (tab === 'Analytics') setActiveSidebarTab('analytics');
    else if (tab === 'Exchange' || tab === 'Trade') setActiveSidebarTab('swap');
  };

  // Lock background body scroll when pro chart modal is active
  useEffect(() => {
    if (activeProChartSymbol) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeProChartSymbol]);

  return (
    <div className="min-h-screen w-full bg-[#08090b] flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
      {/* Main Dashboard Enclosing Container */}
      <div
        ref={dashboardRef}
        className="w-full max-w-[1440px] bg-[#0c0d11] border border-[#1b1e26] rounded-2xl md:rounded-[32px] p-3 sm:p-5 md:p-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-4 md:gap-5"
      >
        {/* Desktop Sidebar Rail */}
        <Sidebar
          activeTab={activeSidebarTab}
          onTabChange={handleSidebarTabChange}
          className="hidden md:flex shrink-0"
        />

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col p-6">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xl font-bold text-white">CoinEdge Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {(['Dashboard', 'Cryptocurrencies', 'Analytics', 'Exchange', 'Trade'] as NavTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    handleHeaderTabChange(tab);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left text-lg font-semibold py-2 px-4 rounded-xl transition-colors ${
                    activeHeaderTab === tab
                      ? 'bg-[#d4f434] text-black'
                      : 'text-zinc-300 hover:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col gap-4 sm:gap-5 min-w-0">
          {/* Top Header Bar */}
          <div className="gsap-fade-in">
            <Header
              activeTab={activeHeaderTab}
              onTabChange={handleHeaderTabChange}
              onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              isMobileMenuOpen={isMobileMenuOpen}
            />
          </div>

          {/* Conditional View Rendering based on active sidebar/header tab */}
          {activeSidebarTab === 'wallet' ? (
            <WalletView tickers={tickers} />
          ) : activeSidebarTab === 'grid' || activeHeaderTab === 'Cryptocurrencies' ? (
            <TradingGridView tickers={tickers} />
          ) : activeSidebarTab === 'swap' || activeHeaderTab === 'Exchange' || activeHeaderTab === 'Trade' ? (
            <SwapView tickers={tickers} />
          ) : activeSidebarTab === 'analytics' || activeHeaderTab === 'Analytics' ? (
            <AnalyticsView tickers={tickers} />
          ) : (
            /* Default: Main Dashboard View */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
              {/* Left Main Column (approx 8 cols on desktop / ~67% width) */}
              <div className="lg:col-span-8 flex flex-col gap-4 sm:gap-5 min-w-0">
                {/* Active Asset Overview (Ripple XRP) & 4 Crypto Mini Cards */}
                <div className="grid grid-cols-1 2xl:grid-cols-12 gap-4 items-start gsap-fade-in">
                  {/* Active Coin Header */}
                  <div className="2xl:col-span-5 w-full">
                    <AssetHero
                      name="Ripple"
                      symbol="XRP"
                      livePrice={isLiveEnabled ? tickers.XRP?.priceFormatted : undefined}
                      change24h={isLiveEnabled ? tickers.XRP?.change24h : undefined}
                      direction={isLiveEnabled ? tickers.XRP?.direction : 'neutral'}
                      onTradeClick={() => {
                        setActiveSidebarTab('grid');
                        setActiveHeaderTab('Cryptocurrencies');
                      }}
                    />
                  </div>

                  {/* 4 Colored Mini Stat Cards */}
                  <div className="2xl:col-span-7 w-full">
                    <CryptoStatCards
                      cards={cryptoCards}
                      onCardClick={() => {
                        setActiveSidebarTab('grid');
                        setActiveHeaderTab('Cryptocurrencies');
                      }}
                    />
                  </div>
                </div>

                {/* Estimated Usage Analytics Multi-line Spline Chart */}
                <div className="gsap-fade-in">
                  <UsageChart dataPoints={usageDataPoints} />
                </div>

                {/* Popular Cryptocurrencies Data Table */}
                <div className="gsap-fade-in">
                  <PopularCryptoTable
                    cryptos={popularList}
                    onSelectCoin={(item) => {
                      setActiveProChartSymbol(`${item.symbol}USDT`);
                    }}
                    onTransferClick={() => {
                      setActiveSidebarTab('swap');
                      setActiveHeaderTab('Trade');
                    }}
                  />
                </div>
              </div>

              {/* Right Column (approx 4 cols on desktop / ~33% width) */}
              <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-5 min-w-0">
                {/* Lanst (Latest) Transactions Card */}
                <div className="gsap-fade-in">
                  <LatestTransactions
                    transactions={transactionsList}
                    onSelectTransaction={() => {
                      setActiveSidebarTab('grid');
                      setActiveHeaderTab('Cryptocurrencies');
                    }}
                    onSeeAll={() => {
                      setActiveSidebarTab('wallet');
                      setActiveHeaderTab('Dashboard');
                    }}
                  />
                </div>

                {/* Wallet Card */}
                <div className="gsap-fade-in">
                  <WalletCard wallet={wallet} onRefresh={handleWalletRefresh} />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Pro Candlestick Price Flow Modal Overlay */}
      {activeProChartSymbol && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200"
          onClick={() => setActiveProChartSymbol(null)}
        >
          <div
            className="w-full max-w-5xl max-h-[92vh] overflow-y-auto overflow-x-hidden shadow-[0_20px_70px_rgba(0,0,0,0.6)] rounded-3xl border border-white/10 overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            <ProPriceFlowChart
              initialSymbol={activeProChartSymbol}
              tickers={tickers}
              onClose={() => setActiveProChartSymbol(null)}
              isStandalone={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};
