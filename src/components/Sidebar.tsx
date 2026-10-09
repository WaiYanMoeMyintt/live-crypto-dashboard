'use client';

import React from 'react';
import { Home, Wallet, LayoutGrid, ArrowLeftRight, PieChart, LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab = 'home',
  onTabChange,
  className = '',
}) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Dashboard' },
    { id: 'wallet', icon: Wallet, label: 'Wallet & Assets' },
    { id: 'grid', icon: LayoutGrid, label: 'Markets & Trading' },
    { id: 'swap', icon: ArrowLeftRight, label: 'Instant Swap' },
    { id: 'analytics', icon: PieChart, label: 'Market Analytics' },
  ];

  return (
    <aside
      className={`flex flex-col items-center justify-between py-6 px-2.5 bg-[#0d0e12] border-r border-[#1e2028] min-h-[calc(100vh-4rem)] rounded-2xl md:rounded-3xl relative z-30 shrink-0 select-none ${className}`}
    >
      {/* Top Section */}
      <div className="flex flex-col items-center gap-8 w-full">
        {/* Navigation Items */}
        <nav className="flex flex-col items-center gap-3.5 w-full" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <div key={item.id} className="relative group flex items-center justify-center">
                <button
                  onClick={() => onTabChange?.(item.id)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#d4f434] text-black shadow-[0_0_20px_rgba(212,244,52,0.35)] scale-105'
                      : 'bg-[#181a20] text-zinc-400 hover:text-white hover:bg-[#232630] hover:scale-105'
                  }`}
                  aria-label={item.label}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'
                    }`}
                  />
                </button>

                {/* Refined floating badge tooltip (positioned cleanly with high z-index and dark glass card) */}
                <div className="absolute left-14 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 -translate-x-1 transition-all duration-150 z-50 whitespace-nowrap">
                  <div className="bg-[#181b24] text-zinc-100 text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-white/15 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4f434]" />
                    <span>{item.label}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section / Logout */}
      <div className="flex flex-col items-center gap-4 w-full mt-auto pt-6">
        <div className="relative group flex items-center justify-center">
          <button
            className="w-11 h-11 rounded-full bg-[#181a20] text-zinc-400 hover:text-white hover:bg-[#281c20] hover:text-red-400 flex items-center justify-center transition-all duration-200 cursor-pointer"
            aria-label="Sign Out"
          >
            <LogOut className="w-5 h-5 stroke-[1.8] transition-transform duration-200 group-hover:-translate-x-0.5" />
          </button>

          {/* Sign Out Tooltip */}
          <div className="absolute left-14 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 -translate-x-1 transition-all duration-150 z-50 whitespace-nowrap">
            <div className="bg-[#24171a] text-red-300 text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-red-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span>Sign Out</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
