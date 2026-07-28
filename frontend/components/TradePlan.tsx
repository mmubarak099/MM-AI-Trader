import { useEffect, useState } from "react";

type Props = {
  plan: any;
  expiry: Date | null;
  onTakeTrade: () => void;
};

export default function TradePlan({
  plan,
  expiry,
  onTakeTrade,
}: Props) {

  if (!plan) return null;
  const [remaining, setRemaining] =
  useState("");

  useEffect(() => {

  if (!expiry) {
    setRemaining("-");
    return;
  }

  const updateCountdown = () => {

    const diff =
      expiry.getTime() - Date.now();

    if (diff <= 0) {

      setRemaining("Expired");

      return;

    }

    const minutes =
      Math.floor(diff / 60000);

    const seconds =
      Math.floor((diff % 60000) / 1000);

    setRemaining(
      `${minutes}m ${seconds}s`
    );

  };

  updateCountdown();

  const timer =
    setInterval(updateCountdown, 1000);

  return () => clearInterval(timer);

}, [expiry]);

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <h3 className="text-xl font-bold mb-4">
        Trade Plan
      </h3>

      <div className="grid grid-cols-2 gap-4">

        <div>
          <p className="text-gray-400">Action</p>
          <p className="font-bold">{plan.action}</p>
        </div>

        <div>
          <p className="text-gray-400">Entry</p>
          <p>{plan.entry}</p>
        </div>

        <div>
          <p className="text-gray-400">Stop Loss</p>
          <p className="text-red-400">{plan.stopLoss}</p>
        </div>

        <div>
          <p className="text-gray-400">Target 1</p>
          <p className="text-green-400">{plan.target1}</p>
        </div>

        <div>
          <p className="text-gray-400">Target 2</p>
          <p className="text-green-400">{plan.target2}</p>
        </div>

        <div>
          <p className="text-gray-400">Risk / Reward</p>
          <p>{plan.riskReward}</p>
        </div>

        <div>
          <p className="text-gray-400">Urgency</p>
          <p>{plan.urgency}</p>
        </div>
<div>

  <p className="text-gray-400">
    Signal Status
  </p>

  <p
    className={
      remaining === "Expired"
        ? "text-red-400 font-bold"
        : "text-green-400 font-bold"
    }
  >
    {remaining === "Expired"
      ? "Expired"
      : "Valid"}
  </p>

</div>

<div>

  <p className="text-gray-400">
    Time Remaining
  </p>

  <p className="font-bold">
    {remaining}
  </p>

</div>

</div>

<div className="mt-6">

  <button
    onClick={onTakeTrade}
    className="w-full rounded-lg bg-green-600 hover:bg-green-700 py-3 font-semibold transition"
  >
    ✅ Take Trade
  </button>

</div>

</div>

  );
}