'use client';

import React, { useState } from 'react';
import {
  Settings,
  MessageSquare,
  Menu,
  X,
  ShieldCheck,
  CreditCard,
  User,
  LogOut,
  Bell,
  CheckCircle2,
  AlertCircle,
  Sliders,
  DollarSign,
  ChevronRight,
  QrCode,
  Copy,
  Check,
  Smartphone,
  Key,
  Laptop,
} from 'lucide-react';
import { NavTab } from '@/types/crypto';

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

type ModalType = 'account' | 'security' | 'deposit' | 'feeDiscount' | null;

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onMobileMenuToggle,
  isMobileMenuOpen = false,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [copied, setCopied] = useState(false);

  const tabs: NavTab[] = ['Dashboard', 'Cryptocurrencies', 'Analytics', 'Exchange', 'Trade'];
  const depositAddress = 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq';

  const handleCopy = () => {
    navigator.clipboard?.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mockNotifications = [
    {
      id: 1,
      type: 'success',
      title: 'Limit Order Executed',
      desc: 'Bought 0.05 BTC at $85,200 USDT',
      time: '2 mins ago',
    },
    {
      id: 2,
      type: 'info',
      title: 'Price Alert: SOL/USDT',
      desc: 'SOL crossed above $184.60 (+4.82%)',
      time: '14 mins ago',
    },
    {
      id: 3,
      type: 'security',
      title: 'New Device Login',
      desc: 'Authorized from Chrome (Singapore)',
      time: '1 hour ago',
    },
    {
      id: 4,
      type: 'reward',
      title: 'Staking Yield Deposited',
      desc: '+0.0028 ETH transferred to Spot Wallet',
      time: '4 hours ago',
    },
  ];

  return (
    <header className="flex items-center justify-between w-full py-2 px-1 md:px-2 relative select-none">
      {/* Brand Logo on Left */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden w-9 h-9 rounded-full bg-[#181a20] flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2.5 cursor-pointer group">
          {/* Neon Lime CoinEdge Emblem */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              className="w-8 h-8 transition-transform duration-300 group-hover:rotate-12"
            >
              <circle cx="16" cy="16" r="14" fill="#0e1014" stroke="#252833" strokeWidth="1.5" />
              <path
                d="M16 6C10.4772 6 6 10.4772 6 16C6 21.5228 10.4772 26 16 26C18.2 26 20.2 25.3 21.8 24.1C18.2 23.5 15.5 20.5 15.5 16C15.5 11.5 18.2 8.5 21.8 7.9C20.2 6.7 18.2 6 16 6Z"
                fill="#d4f434"
              />
              <circle cx="21" cy="16" r="3.2" fill="#d4f434" />
            </svg>
          </div>
          <span className="text-lg md:text-xl font-bold tracking-tight text-white font-sans">
            CoinEdge
          </span>
        </div>
      </div>

      {/* Central Pill Navigation (Desktop & Tablet) */}
      <nav
        className="hidden md:flex items-center bg-[#14161c] p-1.5 rounded-full border border-white/5 shadow-inner"
        aria-label="Header Tabs"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`relative text-xs md:text-sm font-medium px-4 md:px-5 py-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-white text-black font-bold shadow-md shadow-black/20 scale-100'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </nav>

      {/* Right Actions & Profile */}
      <div className="flex items-center gap-2.5 md:gap-3 relative">
        {/* Settings / Gear Flower Icon */}
        <div className="relative">
          <button
            onClick={() => {
              setIsSettingsOpen(!isSettingsOpen);
              setIsNotificationsOpen(false);
              setIsProfileOpen(false);
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 border shadow-sm cursor-pointer ${
              isSettingsOpen
                ? 'bg-[#d4f434] text-black border-[#d4f434]'
                : 'bg-[#181a20] hover:bg-[#242732] text-zinc-400 hover:text-white border-white/5'
            }`}
            title="Trading & System Settings"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4 stroke-[1.8]" />
          </button>

          {/* Settings Dropdown */}
          {isSettingsOpen && (
            <div className="absolute right-0 top-12 z-50 w-72 bg-[#14161f] border border-white/10 rounded-2xl p-4 shadow-2xl animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#d4f434]" /> Trading Preferences
                </h4>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="text-zinc-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-300">Base Currency</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 font-mono text-zinc-200 font-semibold">USD ($)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-300">Slippage Tolerance</span>
                  <span className="px-2 py-0.5 rounded bg-[#d4f434]/15 text-[#d4f434] font-mono font-semibold">0.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-300">Order Confirmation</span>
                  <span className="text-[#0ecb81] font-semibold">Always On</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-300">Chart Engine</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-zinc-200 font-semibold">Binance Pro SVG</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message / Notification Icon */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsSettingsOpen(false);
              setIsProfileOpen(false);
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 border shadow-sm relative cursor-pointer ${
              isNotificationsOpen
                ? 'bg-[#d4f434] text-black border-[#d4f434]'
                : 'bg-[#181a20] hover:bg-[#242732] text-zinc-400 hover:text-white border-white/5'
            }`}
            title="Notifications"
            aria-label="Notifications"
          >
            <MessageSquare className="w-4 h-4 stroke-[1.8]" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#d4f434] rounded-full ring-2 ring-[#181a20]" />
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 top-12 z-50 w-80 bg-[#14161f] border border-white/10 rounded-2xl p-4 shadow-2xl animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#d4f434]" /> Activity Alerts
                </h4>
                <span className="text-[10px] text-zinc-400">4 New</span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {mockNotifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-[#1a1d28] hover:bg-[#222534] transition-colors flex items-start gap-2.5">
                    {n.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-[#0ecb81] shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-[#d4f434] shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white leading-tight">{n.title}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">{n.desc}</div>
                      <div className="text-[9px] text-zinc-500 mt-1 font-mono">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative pl-1">
          <div
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsSettingsOpen(false);
              setIsNotificationsOpen(false);
            }}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full ring-2 ring-white/80 overflow-hidden bg-zinc-800 shadow-md transition-transform duration-200 hover:scale-105 cursor-pointer"
          >
            {/* SVG Profile Avatar */}
            <svg viewBox="0 0 40 40" className="w-full h-full object-cover">
              <rect width="40" height="40" fill="#2d323f" />
              <circle cx="20" cy="15" r="7" fill="#ecc8af" />
              <path
                d="M12 36C12 28.5 15.5 25 20 25C24.5 25 28 28.5 28 36"
                fill="#ecc8af"
              />
              <path
                d="M13 14C13 10 16 7 20 7C24 7 27 10 27 14C27 15.5 26.5 18 26.5 18C25 15 23 14 20 14C17 14 15 15 13.5 18C13.5 18 13 15.5 13 14Z"
                fill="#4a2e18"
              />
              <path
                d="M13 14L10 26C10 26 12 28 14 26L15 18"
                fill="#4a2e18"
              />
              <path
                d="M27 14L30 26C30 26 28 28 26 26L25 18"
                fill="#4a2e18"
              />
            </svg>
          </div>

          {/* Profile Details Dropdown Card */}
          {isProfileOpen && (
            <div className="absolute right-0 top-12 z-50 w-72 bg-[#14161f] border border-white/10 rounded-2xl p-4 shadow-2xl animate-in fade-in duration-150">
              <div className="flex items-center gap-3 pb-3 mb-3 border-b border-white/10">
                <div className="w-10 h-10 rounded-full bg-[#1e2230] border border-white/10 flex items-center justify-center font-bold text-white text-sm">
                  EV
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Elena Vance</h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#d4f434]/15 text-[#d4f434]">
                    VIP Tier 2 • Verified
                  </span>
                </div>
              </div>

              {/* Balance Summary */}
              <div className="p-2.5 rounded-xl bg-[#1b1e2c] mb-3">
                <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Total Estimated Value</span>
                <span className="text-base font-black text-white font-mono">$30,976.82 USD</span>
              </div>

              {/* Navigation Items */}
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setActiveModal('account');
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-zinc-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2"><User className="w-3.5 h-3.5" /> Account Details</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setActiveModal('security');
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-zinc-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-[#0ecb81]" /> Security (2FA Active)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setActiveModal('deposit');
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-zinc-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2"><CreditCard className="w-3.5 h-3.5" /> Deposit / Withdraw</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setActiveModal('feeDiscount');
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-zinc-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2"><DollarSign className="w-3.5 h-3.5 text-[#f3ba2f]" /> Fee Discount (25% with BNB)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </button>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-[#f84960] hover:bg-red-500/10 transition-colors mt-2 pt-2 border-t border-white/5 cursor-pointer"
                >
                  <span className="flex items-center gap-2"><LogOut className="w-3.5 h-3.5" /> Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 1. Account Details Modal */}
      {activeModal === 'account' && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-[#12141c] border border-white/15 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-[#d4f434]" /> Account Details
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 text-zinc-300 hover:text-white flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#0c0d12] border border-white/5 flex items-center justify-between">
                <span className="text-zinc-400">Account ID</span>
                <span className="font-mono text-white font-bold">#8492-019-COIN</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0c0d12] border border-white/5 flex items-center justify-between">
                <span className="text-zinc-400">Email Address</span>
                <span className="font-mono text-zinc-200 font-semibold">elena.vance@coinedge.io</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0c0d12] border border-white/5 flex items-center justify-between">
                <span className="text-zinc-400">Identity Verification (KYC)</span>
                <span className="px-2 py-0.5 rounded-full bg-[#0ecb81]/15 text-[#0ecb81] font-bold">
                  Tier 2 Verified (ID & Proof of Address)
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0c0d12] border border-white/5 flex items-center justify-between">
                <span className="text-zinc-400">24h Withdrawal Limit</span>
                <span className="font-mono text-white font-bold">100.00 BTC ($8,640,000 USD)</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0c0d12] border border-white/5 flex items-center justify-between">
                <span className="text-zinc-400">Registered Since</span>
                <span className="font-mono text-zinc-300">January 14, 2024</span>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-5 py-3 rounded-full bg-[#d4f434] hover:bg-[#bfe025] text-black font-bold text-xs transition-all cursor-pointer shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 2. Security (2FA Active) Modal */}
      {activeModal === 'security' && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-[#12141c] border border-white/15 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0ecb81]" /> Security Center
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 text-zinc-300 hover:text-white flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#0c0d12] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-[#d4f434]" />
                  <div>
                    <div className="text-white font-bold">Google Authenticator (2FA)</div>
                    <div className="text-[10px] text-zinc-400">Used for withdrawals and login</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#0ecb81]/15 text-[#0ecb81] font-bold text-[10px]">
                  Enabled
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#0c0d12] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Key className="w-4 h-4 text-[#f3ba2f]" />
                  <div>
                    <div className="text-white font-bold">Anti-Phishing Code</div>
                    <div className="text-[10px] text-zinc-400">Code: Sat***2024</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#0ecb81]/15 text-[#0ecb81] font-bold text-[10px]">
                  Configured
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#0c0d12] border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-zinc-400 flex items-center gap-1.5 font-bold">
                    <Laptop className="w-3.5 h-3.5 text-zinc-300" /> Active Sessions
                  </span>
                  <span className="text-[#0ecb81] text-[10px] font-bold">Current Device</span>
                </div>
                <div className="text-[11px] text-zinc-300 font-mono">
                  Chrome on Windows (Singapore) • 192.168.1.104
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-5 py-3 rounded-full bg-[#d4f434] hover:bg-[#bfe025] text-black font-bold text-xs transition-all cursor-pointer shadow-md"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 3. Deposit / Withdraw Modal */}
      {activeModal === 'deposit' && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-[#12141c] border border-white/15 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#d4f434]" /> Deposit Crypto
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 text-zinc-300 hover:text-white flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-36 h-36 bg-white p-2.5 rounded-2xl flex items-center justify-center mb-3 shadow-md">
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

              <span className="text-xs text-zinc-400 mb-1">BTC Deposit Address (SegWit)</span>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0c0d12] border border-white/10 w-full mb-4">
                <span className="font-mono text-xs text-zinc-200 truncate flex-1">{depositAddress}</span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  title="Copy address"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#0ecb81]" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                </button>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-3 rounded-full bg-[#d4f434] hover:bg-[#bfe025] text-black font-bold text-xs transition-all cursor-pointer shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Fee Discount (25% with BNB) Modal */}
      {activeModal === 'feeDiscount' && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-[#12141c] border border-white/15 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#f3ba2f]" /> VIP Fee Discount Program
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 text-zinc-300 hover:text-white flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#0c0d12] border border-[#f3ba2f]/30 flex items-center justify-between">
                <div>
                  <div className="text-white font-bold text-sm">BNB Fee Deduction (25% OFF)</div>
                  <div className="text-[11px] text-zinc-400">Pay trading fees using BNB for instant discount</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#f3ba2f] text-black font-extrabold text-[10px]">
                  ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-[#0c0d12] border border-white/5">
                  <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Maker Rate</span>
                  <span className="font-mono text-white text-base font-bold">0.015%</span>
                  <span className="text-[10px] text-[#0ecb81] block mt-0.5">Reduced from 0.020%</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#0c0d12] border border-white/5">
                  <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Taker Rate</span>
                  <span className="font-mono text-white text-base font-bold">0.035%</span>
                  <span className="text-[10px] text-[#0ecb81] block mt-0.5">Reduced from 0.040%</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0c0d12] border border-white/5">
                <div className="flex justify-between mb-1.5">
                  <span className="text-zinc-400 font-semibold">30-Day Trading Volume</span>
                  <span className="text-white font-mono font-bold">$1,420,500 / $2,000,000 USD</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-[#d4f434] rounded-full" style={{ width: '71%' }} />
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 block">71% progress toward VIP Tier 3 upgrade</span>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-5 py-3 rounded-full bg-[#d4f434] hover:bg-[#bfe025] text-black font-bold text-xs transition-all cursor-pointer shadow-md"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
