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
      return "text-gray-500";
    }

    if (rsi >= 70) return "text-red-400";
    if (rsi <= 30) return "text-green-400";

    return "text-yellow-400";
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 px-4 py-3 mt-5">

      <h2 className="text-base font-semibold mb-3">
        Technical Indicators
      </h2>

      <div className="grid grid-cols-5">

        {/* RSI */}
        <div className="min-w-0 px-3 first:pl-0">

          <p className="text-gray-500 text-xs">
            RSI
          </p>

          <p
            className={`text-lg font-bold mt-1 truncate ${getRsiColor()}`}
            title={
              rsi !== null
                ? rsi.toFixed(1)
                : "Calculating"
            }
          >
            {rsi !== null
              ? rsi.toFixed(1)
              : "—"}
          </p>

        </div>


        {/* EMA 20 */}
        <div className="min-w-0 px-3 border-l border-gray-700">

          <p className="text-gray-500 text-xs">
            EMA 20
          </p>

          <p
            className="text-blue-400 text-lg font-bold mt-1 truncate"
            title={
              ema20 !== null
                ? ema20.toFixed(2)
                : "Calculating"
            }
          >
            {ema20 !== null
              ? ema20.toFixed(2)
              : "—"}
          </p>

        </div>


        {/* EMA 50 */}
        <div className="min-w-0 px-3 border-l border-gray-700">

          <p className="text-gray-500 text-xs">
            EMA 50
          </p>

          <p
            className="text-green-400 text-lg font-bold mt-1 truncate"
            title={
              ema50 !== null
                ? ema50.toFixed(2)
                : "Calculating"
            }
          >
            {ema50 !== null
              ? ema50.toFixed(2)
              : "—"}
          </p>

        </div>


        {/* MACD */}
        <div className="min-w-0 px-3 border-l border-gray-700">

          <p className="text-gray-500 text-xs">
            MACD
          </p>

          <p
            className={`text-lg font-bold mt-1 truncate ${
              macd === null
                ? "text-gray-500"
                : macd >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
            title={
              macd !== null
                ? macd.toFixed(2)
                : "Calculating"
            }
          >
            {macd !== null
              ? macd.toFixed(2)
              : "—"}
          </p>

        </div>


        {/* VWAP */}
        <div className="min-w-0 pl-3 border-l border-gray-700">

          <p className="text-gray-500 text-xs">
            VWAP
          </p>

          <p
            className="text-purple-400 text-lg font-bold mt-1 truncate"
            title={
              vwap !== null
                ? vwap.toFixed(2)
                : "Calculating"
            }
          >
            {vwap !== null
              ? vwap.toFixed(2)
              : "—"}
          </p>

        </div>

      </div>

    </div>
  );
}