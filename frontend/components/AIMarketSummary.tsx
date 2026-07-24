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
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mt-8">

      <h2 className="text-xl font-bold mb-4">
        🤖 AI Market Summary
      </h2>

      <div className="flex justify-between mb-4">

        <div>

          <p className="text-gray-400 text-sm">
            Recommendation
          </p>

          <p className={`text-2xl font-bold ${actionColor}`}>
            {action}
          </p>

        </div>

        <div className="text-right">

          <p className="text-gray-400 text-sm">
            Confidence
          </p>

          <p className="text-2xl font-bold text-cyan-400">
            {confidence}%
          </p>

        </div>

      </div>

      <p className="text-gray-300 leading-7">
        {summary}
      </p>

    </div>
  );
}