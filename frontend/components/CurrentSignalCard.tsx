import { useEffect, useState } from "react";

type Props = {
  signal: any;
};

export default function CurrentSignalCard({
  signal,
}: Props) {

  const [remaining, setRemaining] =
    useState("");

  useEffect(() => {

    if (!signal?.expiresAt) {
      setRemaining("");
      return;
    }

    const updateCountdown = () => {

      const diff =
        new Date(signal.expiresAt).getTime() -
        Date.now();

      if (diff <= 0) {
        setRemaining("Expired");
        return;
      }

      const minutes =
        Math.floor(diff / 60000);

      const seconds =
        Math.floor(
          (diff % 60000) / 1000
        );

      setRemaining(
        `${minutes}:${seconds
          .toString()
          .padStart(2, "0")}`
      );

    };

    updateCountdown();

    const timer =
      setInterval(updateCountdown, 1000);

    return () =>
      clearInterval(timer);

  }, [signal]);

  if (!signal) return null;

  return (
    <div className="bg-blue-950/60 border border-blue-500 rounded-xl p-4">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-3">

        <h2 className="text-base font-semibold text-blue-300">
          🚨 Current Signal
        </h2>

        <span
          className={`text-xs font-semibold ${
            remaining === "Expired"
              ? "text-red-400"
              : "text-green-400"
          }`}
        >
          {remaining || "-"}
        </span>

      </div>


      {/* MAIN SIGNAL */}

      <div className="grid grid-cols-2 gap-2">

        <div className="bg-gray-900/60 rounded-lg px-3 py-2">

          <p className="text-gray-500 text-xs">
            Action
          </p>

          <p
            className={`text-lg font-bold mt-1 ${
              signal.action === "BUY"
                ? "text-green-400"
                : signal.action === "SELL"
                ? "text-red-400"
                : "text-yellow-400"
            }`}
          >
            {signal.action}
          </p>

        </div>


        <div className="bg-gray-900/60 rounded-lg px-3 py-2">

          <p className="text-gray-500 text-xs">
            Confidence
          </p>

          <p className="text-lg font-bold text-yellow-400 mt-1">
            {signal.confidence}%
          </p>

        </div>


        <div className="bg-gray-900/60 rounded-lg px-3 py-2">

          <p className="text-gray-500 text-xs">
            Entry
          </p>

          <p className="text-sm font-bold text-white mt-1">
            {Number(signal.entry).toFixed(2)}
          </p>

        </div>


        <div className="bg-gray-900/60 rounded-lg px-3 py-2">

          <p className="text-gray-500 text-xs">
            Urgency
          </p>

          <p
            className={`text-sm font-bold mt-1 ${
              signal.urgency === "HIGH"
                ? "text-red-400"
                : signal.urgency === "MEDIUM"
                ? "text-yellow-400"
                : "text-green-400"
            }`}
          >
            {signal.urgency}
          </p>

        </div>

      </div>


      {/* EXPIRY */}

      <div className="mt-3 pt-3 border-t border-blue-900 flex items-center justify-between">

        <span className="text-gray-500 text-xs">
          Signal Expires
        </span>

        <span
          className={`text-sm font-bold ${
            remaining === "Expired"
              ? "text-red-400"
              : "text-green-400"
          }`}
        >
          {remaining || "-"}
        </span>

      </div>

    </div>
  );
}