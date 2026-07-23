type AITradeCardProps = {
  signal: {
    trend: string;
    confidence: number;
    action: string;
  };

  risk: {
    entry: number;
    target: number;
    stopLoss: number;
    riskReward: number;
  };

  rsi: number;

  trend: string;
};

export default function AITradeCard({
  signal,
  risk,
  rsi,
  trend,
}: AITradeCardProps) {
  const actionColor =
    signal.action === "BUY"
      ? "text-green-400"
      : signal.action === "SELL"
      ? "text-red-400"
      : "text-yellow-400";

  const trendColor =
    trend === "Bullish"
      ? "text-green-400"
      : trend === "Bearish"
      ? "text-red-400"
      : "text-gray-300";

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">

      <h2 className="text-xl font-bold mb-6">
        AI Trade Recommendation
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        <div>
          <p className="text-gray-400 text-sm">
            Action
          </p>

          <p className={`text-2xl font-bold ${actionColor}`}>
            {signal.action}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">
            Confidence
          </p>

          <p className="text-yellow-400 text-2xl font-bold">
            {signal.confidence}%
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">
            RSI
          </p>

          <p className="text-blue-400 text-2xl font-bold">
            {rsi}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">
            Trend
          </p>

          <p className={`text-2xl font-bold ${trendColor}`}>
            {trend}
          </p>
        </div>

      </div>

      <div className="border-t border-gray-800 mt-6 pt-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          <div>
            <p className="text-gray-400 text-sm">
              Entry
            </p>

            <p className="font-bold">
              {risk.entry}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">
              Target
            </p>

            <p className="text-green-400 font-bold">
              {risk.target}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">
              Stop Loss
            </p>

            <p className="text-red-400 font-bold">
              {risk.stopLoss}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">
              Risk / Reward
            </p>

            <p className="text-yellow-400 font-bold">
              1 : {risk.riskReward}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}