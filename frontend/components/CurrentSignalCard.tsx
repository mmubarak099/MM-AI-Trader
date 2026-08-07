import { useEffect, useState } from "react";

type Props = {
  signal: any;
};

export default function CurrentSignalCard({
  signal,
}: Props) {

  if (!signal) return null;

  const [remaining, setRemaining] =
  useState("");

useEffect(() => {

  if (!signal.expiresAt) return;

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
      Math.floor((diff % 60000) / 1000);

    setRemaining(
      `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`
    );

  };

  updateCountdown();

  const timer =
    setInterval(updateCountdown, 1000);

  return () => clearInterval(timer);

}, [signal]);

  return (

    <div className="bg-blue-950 border-2 border-blue-500 rounded-xl p-6 mb-6">

      <h2 className="text-2xl font-bold text-blue-300 mb-4">

        🚨 CURRENT SIGNAL

      </h2>

     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

  <div>

    <p className="text-gray-400">
      Action
    </p>

    <p
      className={`text-3xl font-bold ${
        signal.action === "BUY"
          ? "text-green-400"
          : "text-red-400"
      }`}
    >
      {signal.action}
    </p>

  </div>

  <div>

    <p className="text-gray-400">
      Confidence
    </p>

    <p className="text-3xl font-bold text-yellow-400">
      {signal.confidence}%
    </p>

  </div>

  <div>

    <p className="text-gray-400">
      Entry
    </p>

    <p className="text-2xl font-bold">
      {signal.entry}
    </p>

  </div>

  <div>

    <p className="text-gray-400">
      Urgency
    </p>

    <p className="text-2xl font-bold">
      {signal.urgency}
    </p>

  </div>

<div>

  <p className="text-gray-400">
    Signal Expires
  </p>

  <p
    className={`text-2xl font-bold ${
      remaining === "Expired"
        ? "text-red-400"
        : "text-green-400"
    }`}
  >
    {remaining}
  </p>

</div>

</div>

    </div>

  );

}