type Props = {
  signal: any;
  pattern: string;
};

export default function AIDecisionPanel({
  signal,
  pattern,
}: Props) {

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">

 {/* HEADER */}

<div className="mb-4">

  <div className="flex items-center justify-between">

    <h3 className="text-base font-semibold">
      🤖 Live AI Decision
    </h3>

    <span
      className={`text-sm font-bold ${
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
    </span>

  </div>

<p className="text-xs text-gray-500 mt-1">
  Live market view — does not change the locked Current Signal.
</p>

</div>


      {/* DECISION DETAILS */}

      <div className="grid grid-cols-2 gap-x-4 gap-y-3">

        <div>
          <p className="text-gray-500 text-xs">
            Trend
          </p>

          <p className="text-sm font-semibold mt-0.5">
            {signal.trend}
          </p>
        </div>


        <div>
          <p className="text-gray-500 text-xs">
            Confidence
          </p>

          <p className="text-sm font-semibold text-cyan-400 mt-0.5">
            {signal.confidence}%
          </p>
        </div>


        <div>
          <p className="text-gray-500 text-xs">
            Pattern
          </p>

          <p className="text-sm font-semibold mt-0.5">
            {pattern}
          </p>
        </div>


        <div>
          <p className="text-gray-500 text-xs">
            Risk
          </p>

          <p
            className={`text-sm font-semibold mt-0.5 ${
              signal.riskLevel === "High"
                ? "text-red-400"
                : signal.riskLevel === "Low"
                ? "text-green-400"
                : "text-yellow-400"
            }`}
          >
            {signal.riskLevel}
          </p>
        </div>


        <div className="col-span-2">
          <p className="text-gray-500 text-xs">
            Market Condition
          </p>

          <p className="text-sm font-semibold mt-0.5">
            {signal.marketCondition}
          </p>
        </div>

      </div>


      {/* AI ADVICE */}

      <div className="mt-3 pt-3 border-t border-gray-800">

        <div className="flex gap-2">

          <span className="text-blue-400 text-sm">
            💡
          </span>

          <div>
            <p className="text-blue-400 text-xs font-semibold">
              AI Advice
            </p>

            <p className="text-gray-300 text-xs mt-1 leading-relaxed">
              {signal.advice}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}