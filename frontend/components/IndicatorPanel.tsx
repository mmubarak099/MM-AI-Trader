type IndicatorPanelProps = {
  rsi: number | null;
  ema20: number | null;
  ema50: number | null;
  macd: number | null;
  vwap: number | null;
};

export default function IndicatorPanel({
  rsi,
  ema20,
  ema50,
  macd,
  vwap,
}: IndicatorPanelProps) {

const getRsiColor = () => {
  if (rsi === null) {
    return "text-gray-400";
  }

  if (rsi >= 70) return "text-red-400";

  if (rsi <= 30) return "text-green-400";

  return "text-yellow-400";
};

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mt-8">

      <h2 className="text-xl font-bold mb-6">
        Technical Indicators
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">

        <div>
          <p className="text-gray-400 text-sm">
            RSI
          </p>

          <p className={`text-2xl font-bold ${getRsiColor()}`}>
            {rsi?.toFixed(1) ?? "Calculating..."}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">
            EMA 20
          </p>

          <p className="text-blue-400 text-2xl font-bold">
            {ema20?.toFixed(2) ?? "Calculating..."}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">
            EMA 50
          </p>

          <p className="text-green-400 text-2xl font-bold">
            {ema50?.toFixed(2) ?? "Calculating..."}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">
            MACD
          </p>

          <p
            className={`text-2xl font-bold ${
  macd === null
    ? "text-gray-400"
    : macd >= 0
    ? "text-green-400"
    : "text-red-400"
}`}
          >
            {macd?.toFixed(2) ?? "Calculating..."}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">
            VWAP
          </p>

          <p className="text-purple-400 text-2xl font-bold">
            {vwap?.toFixed(2) ?? "Calculating..."}
          </p>
        </div>

      </div>

    </div>
  );
}