"use client";

import { useEffect, useState } from "react";

type Props = {
  signal: any;
  onTakeTrade: () => void;
};

export default function TradePlan({
  signal,
  onTakeTrade,
}: Props) {

  const [timeRemaining, setTimeRemaining] =
    useState("");

  const [expired, setExpired] =
    useState(false);


  // ===============================
  // SIGNAL COUNTDOWN
  // ===============================

  useEffect(() => {

    if (!signal?.expiresAt) {
      setTimeRemaining("-");
      setExpired(false);
      return;
    }

    const updateTimer = () => {

      const remaining =
        new Date(signal.expiresAt).getTime() -
        Date.now();

      if (remaining <= 0) {

        setTimeRemaining("Expired");
        setExpired(true);

        return;
      }

      const minutes =
        Math.floor(remaining / 60000);

      const seconds =
        Math.floor(
          (remaining % 60000) / 1000
        );

      setTimeRemaining(
        `${minutes}m ${seconds
          .toString()
          .padStart(2, "0")}s`
      );

      setExpired(false);
    };

    updateTimer();

    const timer =
      setInterval(updateTimer, 1000);

    return () =>
      clearInterval(timer);

  }, [signal]);


  if (!signal) return null;


  // ===============================
  // HELPERS
  // ===============================

  const actionColor =
    signal.action === "BUY"
      ? "text-emerald-400"
      : signal.action === "SELL"
      ? "text-rose-400"
      : "text-amber-400";

  const urgencyColor =
    signal.urgency === "HIGH"
      ? "text-rose-400"
      : signal.urgency === "MEDIUM"
      ? "text-amber-400"
      : "text-emerald-400";


  // ===============================
  // UI
  // ===============================

  return (

    <div className="rounded-2xl border border-slate-800/80 bg-[#081321]/90 p-5 shadow-[0_12px_35px_rgba(0,0,0,0.18)]">

      {/* ================= HEADER ================= */}

      <div className="flex items-start justify-between gap-4 mb-5">

        <div>

          <p className="text-[10px] uppercase tracking-[0.18em] text-blue-400">
            Qualified Setup
          </p>

          <h3 className="mt-1 text-lg font-bold text-white">
            Trade Plan
          </h3>

        </div>


        <div
          className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 ${
            expired
              ? "border-rose-500/20 bg-rose-500/10"
              : "border-emerald-500/20 bg-emerald-500/10"
          }`}
        >

          <span
            className={`h-2 w-2 rounded-full ${
              expired
                ? "bg-rose-400"
                : "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.75)]"
            }`}
          />

          <span
            className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${
              expired
                ? "text-rose-300"
                : "text-emerald-300"
            }`}
          >
            {expired
              ? "Expired"
              : "Valid Signal"}
          </span>

        </div>

      </div>


      {/* ================= ACTION ================= */}

      <div className="mb-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">

        <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
          Recommended Action
        </p>

        <div className="mt-2 flex items-end justify-between gap-4">

          <p
            className={`text-2xl font-black tracking-wide ${actionColor}`}
          >
            {signal.action}
          </p>


          <div className="text-right">

            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Confidence
            </p>

            <p className="mt-1 text-lg font-bold text-cyan-400">
              {signal.confidence}%
            </p>

          </div>

        </div>

      </div>


      {/* ================= PRICE LEVELS ================= */}

      <div className="grid grid-cols-2 gap-3">

        {/* ENTRY */}

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Entry
          </p>

          <p className="mt-1 text-base font-bold text-white">
            {Number(signal.entry).toFixed(2)}
          </p>

        </div>


        {/* STOP LOSS */}

        <div className="rounded-xl border border-rose-500/15 bg-rose-500/5 p-3">

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Stop Loss
          </p>

          <p className="mt-1 text-base font-bold text-rose-400">
            {Number(signal.stopLoss).toFixed(2)}
          </p>

        </div>


        {/* TARGET 1 */}

        <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-3">

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Target 1
          </p>

          <p className="mt-1 text-base font-bold text-emerald-400">
            {Number(signal.target1).toFixed(2)}
          </p>

        </div>


        {/* TARGET 2 */}

        <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-3">

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Target 2
          </p>

          <p className="mt-1 text-base font-bold text-emerald-400">
            {Number(signal.target2).toFixed(2)}
          </p>

        </div>

      </div>


      {/* ================= META ================= */}

      <div className="mt-4 grid grid-cols-2 gap-3">

        {/* RISK / REWARD */}

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Risk / Reward
          </p>

          <p className="mt-1 text-sm font-semibold text-amber-400">
            1 : 1.5
          </p>

        </div>


        {/* URGENCY */}

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Urgency
          </p>

          <p
            className={`mt-1 text-sm font-semibold ${urgencyColor}`}
          >
            {signal.urgency}
          </p>

        </div>

      </div>


      {/* ================= EXPIRY ================= */}

      <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-4">

        <div>

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Signal Validity
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Time remaining before expiry
          </p>

        </div>


        <span
          className={`text-sm font-bold ${
            expired
              ? "text-rose-400"
              : "text-emerald-400"
          }`}
        >
          {timeRemaining}
        </span>

      </div>


      {/* ================= TAKE TRADE ================= */}

      <button
        type="button"
        onClick={onTakeTrade}
        disabled={expired}
        className={`mt-4 w-full rounded-xl border py-3 text-sm font-bold transition-all duration-200 ${
          expired
            ? "cursor-not-allowed border-slate-700 bg-slate-800/70 text-slate-500"
            : signal.action === "SELL"
            ? "border-rose-500/30 bg-rose-500/15 text-rose-300 hover:bg-rose-500/25"
            : "border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"
        }`}
      >
        {expired
          ? "Signal Expired"
          : `Take ${signal.action} Trade`}
      </button>

    </div>

  );
}