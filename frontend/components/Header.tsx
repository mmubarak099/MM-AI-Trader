"use client";

import { useEffect, useState } from "react";
import { getNseMarketStatus } from "../lib/marketSession";
import MMLogo from "./MMLogo";

export default function Header() {
  const [time, setTime] =
    useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());

    const timer =
      setInterval(() => {
        setTime(new Date());
      }, 1000);

    return () =>
      clearInterval(timer);
  }, []);

  const marketStatus =
    time
      ? getNseMarketStatus(time)
      : null;

  return (
    <header className="h-[72px] border-b border-slate-800/70 bg-[#07111f] px-6 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.22)]">

      {/* ================= BRAND ================= */}
      <div className="flex items-center">
        <MMLogo size={48} />
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="flex items-center gap-4">

        {/* MARKET STATUS */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-700/60 bg-slate-900/70 px-4 py-2">

          <span
            className={`w-2 h-2 rounded-full ${
              marketStatus?.status
                ?.toLowerCase()
                .includes("open")
                ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                : "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.6)]"
            }`}
          />

          <div>
            <p className="text-[9px] uppercase tracking-[0.16em] text-slate-500 leading-none mb-1">
              NSE Market
            </p>

            <span
              className={`text-xs font-semibold ${
                marketStatus?.color ??
                "text-slate-400"
              }`}
            >
              {marketStatus?.status ??
                "Checking market..."}
            </span>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="hidden md:block h-8 w-px bg-slate-800" />

        {/* LOGIN */}
        <button className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300 transition-all duration-200 hover:border-blue-400/50 hover:bg-blue-500/20 hover:text-blue-200">
          Login
        </button>

      </div>

    </header>
  );
}