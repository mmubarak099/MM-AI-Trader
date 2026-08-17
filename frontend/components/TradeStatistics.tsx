import type { Trade } from "../types/trade";

type Props = {
  trades: Trade[];
};

export default function TradeStatistics({
  trades,
}: Props) {

  const closedTrades = trades.filter(
    (t) => t.status === "CLOSED"
  );

  const wins = closedTrades.filter(
    (t) => t.result === "WIN"
  );

  const losses = closedTrades.filter(
    (t) => t.result === "LOSS"
  );

  const totalPnL = closedTrades.reduce(
    (sum, t) => sum + t.realizedPnL,
    0
  );

  const grossProfit = wins.reduce(
    (sum, t) => sum + t.realizedPnL,
    0
  );

  const grossLoss = Math.abs(
    losses.reduce(
      (sum, t) => sum + t.realizedPnL,
      0
    )
  );

  const profitFactor =
    grossLoss === 0
      ? grossProfit > 0
        ? Infinity
        : 0
      : grossProfit / grossLoss;

  const maxWinStreak = (() => {
    let max = 0;
    let current = 0;

    closedTrades.forEach((trade) => {
      if (trade.result === "WIN") {
        current++;
        max = Math.max(max, current);
      } else {
        current = 0;
      }
    });

    return max;
  })();

  const maxLossStreak = (() => {
    let max = 0;
    let current = 0;

    closedTrades.forEach((trade) => {
      if (trade.result === "LOSS") {
        current++;
        max = Math.max(max, current);
      } else {
        current = 0;
      }
    });

    return max;
  })();

const decisiveTrades =
  wins.length + losses.length;

const winRate =
  decisiveTrades === 0
    ? 0
    : (
        (wins.length / decisiveTrades) *
        100
      ).toFixed(1);

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 px-4 py-3">

      <div className="flex items-center justify-between mb-3">

        <h2 className="text-base font-semibold">
          Trading Performance
        </h2>

        <span className="text-xs text-gray-500">
          {closedTrades.length} trades
        </span>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div>
          <p className="text-xs text-gray-500">
            Trades
          </p>

          <p className="text-lg font-semibold">
            {closedTrades.length}
          </p>
        </div>


        <div>
          <p className="text-xs text-gray-500">
            Wins
          </p>

          <p className="text-lg font-semibold text-green-400">
            {wins.length}
          </p>
        </div>


        <div>
          <p className="text-xs text-gray-500">
            Losses
          </p>

          <p className="text-lg font-semibold text-red-400">
            {losses.length}
          </p>
        </div>


        <div>
          <p className="text-xs text-gray-500">
            Win Rate
          </p>

          <p className="text-lg font-semibold">
            {winRate}%
          </p>
        </div>


        <div>
          <p className="text-xs text-gray-500">
            Total P&L
          </p>

          <p
            className={`text-lg font-semibold ${
              totalPnL >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {totalPnL.toFixed(2)}
          </p>
        </div>


        <div>
          <p className="text-xs text-gray-500">
            Profit Factor
          </p>

          <p
            className={`text-lg font-semibold ${
              profitFactor >= 1
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {profitFactor.toFixed(2)}
          </p>
        </div>


        <div>
          <p className="text-xs text-gray-500">
            Win Streak
          </p>

          <p className="text-lg font-semibold text-green-400">
            {maxWinStreak}
          </p>
        </div>


        <div>
          <p className="text-xs text-gray-500">
            Loss Streak
          </p>

          <p className="text-lg font-semibold text-red-400">
            {maxLossStreak}
          </p>
        </div>

      </div>

    </div>
  );
}