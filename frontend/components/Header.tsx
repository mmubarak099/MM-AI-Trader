"use client";

import { useEffect, useState } from "react";
import { getNseMarketStatus } from "../lib/marketSession";

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
    <header className="bg-gray-900 border-b border-gray-800 h-16 flex items-center justify-between px-6">

      <div>
        <h1 className="text-2xl font-bold text-green-400">
          MM AI Trader
        </h1>

        <p className="text-sm text-gray-400">
          AI Powered Intraday Trading Platform
        </p>
      </div>


      <div className="flex items-center gap-4">

        <span
          className={`font-semibold ${
            marketStatus?.color ??
            "text-gray-400"
          }`}
        >
          {marketStatus?.status ??
            "Checking market..."}
        </span>


        <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-semibold">
          Login
        </button>

      </div>

    </header>
  );
}