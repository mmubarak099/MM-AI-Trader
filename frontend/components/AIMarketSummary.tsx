type AIMarketSummaryProps = {
  summary: string;
  confidence: number;
  action: string;
};

export default function AIMarketSummary({
  summary,
  confidence,
  action,
}: AIMarketSummaryProps) {

  const actionColor =
    action === "BUY"
      ? "text-green-400"
      : action === "SELL"
      ? "text-red-400"
      : action === "WATCH"
      ? "text-blue-400"
      : "text-yellow-400";

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 mt-4">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">

        <h2 className="text-base font-semibold">
          🤖 AI Market Summary
        </h2>

        <span
          className={`text-sm font-bold ${actionColor}`}
        >
          {action}
        </span>

      </div>


      {/* SUMMARY METRICS */}
      <div className="grid grid-cols-2 gap-3 mb-3">

        <div>
          <p className="text-gray-500 text-xs">
            Recommendation
          </p>

          <p
            className={`text-sm font-bold mt-0.5 ${actionColor}`}
          >
            {action}
          </p>
        </div>


        <div className="text-right">
          <p className="text-gray-500 text-xs">
            Confidence
          </p>

          <p className="text-sm font-bold text-cyan-400 mt-0.5">
            {confidence}%
          </p>
        </div>

      </div>


      {/* SUMMARY TEXT */}
      <div className="pt-3 border-t border-gray-800">

        <p className="text-gray-300 text-xs leading-5">
          {summary}
        </p>

      </div>

    </div>
  );
}