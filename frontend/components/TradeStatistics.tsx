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

  const averageWin =
  wins.length === 0
    ? 0
    : wins.reduce(
        (sum, t) => sum + t.realizedPnL,
        0
      ) / wins.length;

const averageLoss =
  losses.length === 0
    ? 0
    : losses.reduce(
        (sum, t) => sum + t.realizedPnL,
        0
      ) / losses.length;

const biggestWin =
  wins.length === 0
    ? 0
    : Math.max(
        ...wins.map(
          t => t.realizedPnL
        )
      );

const biggestLoss =
  losses.length === 0
    ? 0
    : Math.min(
        ...losses.map(
          t => t.realizedPnL
        )
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
    ? grossProfit
    : grossProfit / grossLoss;

    const expectancy =
  closedTrades.length === 0
    ? 0
    : totalPnL / closedTrades.length;

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

  const winRate =
    closedTrades.length === 0
      ? 0
      : (
          (wins.length / closedTrades.length) *
          100
        ).toFixed(1);

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">

      <h2 className="text-xl font-bold mb-6">
        Trading Performance
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        <div>
          <p className="text-gray-400">
            Total Trades
          </p>
          <p className="text-2xl font-bold">
            {closedTrades.length}
          </p>
        </div>

        <div>
          <p className="text-gray-400">
            Wins
          </p>
          <p className="text-2xl font-bold text-green-400">
            {wins.length}
          </p>
        </div>

        <div>
          <p className="text-gray-400">
            Losses
          </p>
          <p className="text-2xl font-bold text-red-400">
            {losses.length}
          </p>
        </div>

        <div>
          <p className="text-gray-400">
            Win Rate
          </p>
          <p className="text-2xl font-bold">
            {winRate}%
          </p>
        </div>

        <div>
          <p className="text-gray-400">
            Total PnL
          </p>

          <p
            className={`text-2xl font-bold ${
              totalPnL >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {totalPnL.toFixed(2)}
          </p>

        </div>

<div>
  <p className="text-gray-400">
    Avg Win
  </p>
  <p className="text-green-400 text-2xl font-bold">
    {averageWin.toFixed(2)}
  </p>
</div>

<div>
  <p className="text-gray-400">
    Avg Loss
  </p>
  <p className="text-red-400 text-2xl font-bold">
    {averageLoss.toFixed(2)}
  </p>
</div>

<div>
  <p className="text-gray-400">
    Biggest Win
  </p>
  <p className="text-green-400 text-2xl font-bold">
    {biggestWin.toFixed(2)}
  </p>
</div>

<div>
  <p className="text-gray-400">
    Biggest Loss
  </p>
  <p className="text-red-400 text-2xl font-bold">
    {biggestLoss.toFixed(2)}
  </p>
</div>

<div>
  <p className="text-gray-400">
    Profit Factor
  </p>

  <p
    className={`text-2xl font-bold ${
      profitFactor >= 1
        ? "text-green-400"
        : "text-red-400"
    }`}
  >
    {profitFactor.toFixed(2)}
  </p>
</div>

<div>
  <p className="text-gray-400">
    Expectancy
  </p>

  <p
    className={`text-2xl font-bold ${
      expectancy >= 0
        ? "text-green-400"
        : "text-red-400"
    }`}
  >
    {expectancy.toFixed(2)}
  </p>
</div>

<div>
  <p className="text-gray-400">
    Max Win Streak
  </p>

  <p className="text-2xl font-bold text-green-400">
    {maxWinStreak}
  </p>
</div>

<div>
  <p className="text-gray-400">
    Max Loss Streak
  </p>

  <p className="text-2xl font-bold text-red-400">
    {maxLossStreak}
  </p>
</div>

      </div>

    </div>
  );
}