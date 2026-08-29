"use client";

import { useEffect, useState } from "react";
import { getNseMarketStatus } from "../lib/marketSession";


export default function MarketStatus() {

 const [time, setTime] = useState<Date | null>(null);


  useEffect(() => {

  // Set the time immediately when the component loads
  setTime(new Date());

  // Then update it every second
  const timer = setInterval(() => {
    setTime(new Date());
  }, 1000);

  return () => clearInterval(timer);

}, []);


  // Convert to Indian Standard Time

const indiaTime = time
  ? new Date(
      time.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      })
    )
  : null;


 const marketStatus =
  time
    ? getNseMarketStatus(time)
    : null;

const status =
  marketStatus?.status ?? "";

const color =
  marketStatus?.color ?? "";

const session =
  marketStatus?.session ?? "";

return (

  <div className="rounded-2xl border border-slate-800/80 bg-[#081321]/90 p-5 shadow-[0_12px_35px_rgba(0,0,0,0.18)]">

    <div className="flex items-start justify-between gap-4">

      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
          Exchange Status
        </p>

        <h3 className="mt-1 text-sm font-semibold text-slate-200">
          🇮🇳 NSE Market
        </h3>
      </div>

      <div className="rounded-lg border border-slate-700/60 bg-slate-900/70 px-3 py-1.5">
        <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
          IST
        </span>
      </div>

    </div>


    <div className="mt-5 flex items-center gap-3">

      <span
        className={`h-2.5 w-2.5 rounded-full ${
          status.toLowerCase().includes("open")
            ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.75)]"
            : "bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.55)]"
        }`}
      />

      <p className={`text-xl font-bold ${color}`}>
        {status}
      </p>

    </div>


    <div className="mt-5 grid grid-cols-2 gap-3">

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">

        <p className="text-[10px] uppercase tracking-wider text-slate-500">
          Current Time
        </p>

        <p className="mt-1 text-sm font-semibold text-white">
          {indiaTime ? indiaTime.toLocaleTimeString() : ""}
        </p>

      </div>


      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">

        <p className="text-[10px] uppercase tracking-wider text-slate-500">
          Session
        </p>

        <p className="mt-1 text-sm font-semibold text-white">
          {session}
        </p>

      </div>

    </div>


    <div className="mt-4 border-t border-slate-800/80 pt-3">

      <p className="text-xs text-slate-500">
        NSE Trading Hours
        <span className="ml-2 font-medium text-slate-300">
          09:15 AM – 03:30 PM
        </span>
      </p>

    </div>

  </div>

);
}