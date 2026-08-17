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
      ? "text-green-400"
      : signal.action === "SELL"
      ? "text-red-400"
      : "text-yellow-400";

  const urgencyColor =
    signal.urgency === "HIGH"
      ? "text-red-400"
      : signal.urgency === "MEDIUM"
      ? "text-yellow-400"
      : "text-green-400";


  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">

      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between mb-4">

        <h3 className="text-base font-semibold">
          Trade Plan
        </h3>

        <span
          className={`text-xs font-semibold ${
            expired
              ? "text-red-400"
              : "text-green-400"
          }`}
        >
          {expired ? "Expired" : "Valid"}
        </span>

      </div>


      {/* ================= MAIN DETAILS ================= */}

      <div className="grid grid-cols-2 gap-x-5 gap-y-3">

        {/* ACTION */}

        <div>
          <p className="text-xs text-gray-500">
            Action
          </p>

          <p
            className={`text-base font-bold mt-0.5 ${actionColor}`}
          >
            {signal.action}
          </p>
        </div>


        {/* ENTRY */}

        <div>
          <p className="text-xs text-gray-500">
            Entry
          </p>

          <p className="text-sm font-semibold text-white mt-0.5">
            {Number(signal.entry).toFixed(2)}
          </p>
        </div>


        {/* STOP LOSS */}

        <div>
          <p className="text-xs text-gray-500">
            Stop Loss
          </p>

          <p className="text-sm font-semibold text-red-400 mt-0.5">
            {Number(signal.stopLoss).toFixed(2)}
          </p>
        </div>


        {/* TARGET 1 */}

        <div>
          <p className="text-xs text-gray-500">
            Target 1
          </p>

          <p className="text-sm font-semibold text-green-400 mt-0.5">
            {Number(signal.target1).toFixed(2)}
          </p>
        </div>


        {/* TARGET 2 */}

        <div>
          <p className="text-xs text-gray-500">
            Target 2
          </p>

          <p className="text-sm font-semibold text-green-400 mt-0.5">
            {Number(signal.target2).toFixed(2)}
          </p>
        </div>


        {/* RISK / REWARD */}

        <div>
          <p className="text-xs text-gray-500">
            Risk / Reward
          </p>

          <p className="text-sm font-semibold text-yellow-400 mt-0.5">
            1 : 1.5
          </p>
        </div>


        {/* URGENCY */}

        <div>
          <p className="text-xs text-gray-500">
            Urgency
          </p>

          <p
            className={`text-sm font-semibold mt-0.5 ${urgencyColor}`}
          >
            {signal.urgency}
          </p>
        </div>


        {/* CONFIDENCE */}

        <div>
          <p className="text-xs text-gray-500">
            Confidence
          </p>

          <p className="text-sm font-semibold text-cyan-400 mt-0.5">
            {signal.confidence}%
          </p>
        </div>

      </div>


      {/* ================= EXPIRY ================= */}

      <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">

        <span className="text-xs text-gray-500">
          Time Remaining
        </span>

        <span
          className={`text-sm font-bold ${
            expired
              ? "text-red-400"
              : "text-green-400"
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
        className={`w-full mt-4 py-2 rounded-lg text-sm font-semibold transition ${
          expired
            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-500 text-white"
        }`}
      >
        {expired
          ? "Signal Expired"
          : "✅ Take Trade"}
      </button>

    </div>
  );
}