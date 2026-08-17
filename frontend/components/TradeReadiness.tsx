type Props = {
  signal: any;
};

export default function TradeReadiness({
  signal,
}: Props) {
  if (!signal) return null;

const score =
  signal.confirmationCount ?? 0;

  const checks = [
    {
      label: "Trend",
      passed:
        signal.trend === "Bullish" ||
        signal.trend === "Bearish",
      value: signal.trend,
    },
    {
      label: "Pattern",
      passed:
        signal.pattern &&
        signal.pattern !== "No Pattern",
      value:
        signal.pattern ?? "No Pattern",
    },
    {
      label: "Structure",
      passed:
        signal.marketStructure &&
        signal.marketStructure !== "NEUTRAL",
      value:
        signal.marketStructure ?? "NEUTRAL",
    },
    {
      label: "Breakout",
      passed:
        signal.breakout &&
        signal.breakout !== "NONE",
      value:
        signal.breakout ?? "NONE",
    },
    {
      label: "Volume",
      passed:
        signal.volumeStrength === "STRONG",
      value:
        signal.volumeStrength ?? "NORMAL",
    },
    {
      label: "Confidence",
      passed:
        signal.confidence >= 90,
      value: `${signal.confidence}%`,
    },
  ];

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">

        <h2 className="text-base font-semibold">
          🤖 Trade Readiness
        </h2>

        <span className="text-xs text-gray-500">
          Supporting Checks
        </span>

      </div>


      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-2">

        <div className="bg-gray-800 rounded-lg px-3 py-2">

          <p className="text-gray-500 text-xs">
            Signal
          </p>

          <p
            className={`text-sm font-bold mt-1 ${
              signal.action === "BUY"
                ? "text-green-400"
                : signal.action === "SELL"
                ? "text-red-400"
                : signal.action === "WATCH"
                ? "text-blue-400"
                : "text-yellow-400"
            }`}
          >
            {signal.action}
          </p>

        </div>


        <div className="bg-gray-800 rounded-lg px-3 py-2">

          <p className="text-gray-500 text-xs">
            Confidence
          </p>

          <p className="text-sm font-bold text-cyan-400 mt-1">
            {signal.confidence}%
          </p>

        </div>


        <div className="bg-gray-800 rounded-lg px-3 py-2">

          <p className="text-gray-500 text-xs">
            Confirmations
          </p>

          <p className="text-sm font-bold text-yellow-400 mt-1">
            {score} / 6
          </p>

        </div>

      </div>


      {/* CONFIRMATION CHECKS */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">

        {checks.map((check) => (

          <div
            key={check.label}
            className="border-b border-gray-800 pb-2"
          >

            <p className="text-gray-500 text-xs">
              {check.label}
            </p>

            <div className="flex items-center gap-1 mt-1">

              <span
                className={
                  check.passed
                    ? "text-green-400 text-sm"
                    : "text-red-400 text-sm"
                }
              >
                {check.passed
                  ? "✓"
                  : "×"}
              </span>

              <span
                className={`text-xs font-semibold ${
                  check.passed
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {check.value}
              </span>

            </div>

          </div>

        ))}

      </div>


      {/* INFORMATION ONLY */}
      <div className="mt-4 pt-3 border-t border-gray-800">

        <p className="text-xs text-gray-500">
          These checks support the signal but do not create a separate trade decision.
        </p>

      </div>

    </div>
  );
}