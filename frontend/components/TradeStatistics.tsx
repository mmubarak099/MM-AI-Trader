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

  const profitFactorDisplay =
    profitFactor === Infinity
      ? "∞"
      : profitFactor.toFixed(2);

  const performanceMetrics = [
    {
      label: "Trades",
      value: closedTrades.length,
      tone: "neutral",
    },
    {
      label: "Wins",
      value: wins.length,
      tone: "positive",
    },
    {
      label: "Losses",
      value: losses.length,
      tone: "negative",
    },
    {
      label: "Win Rate",
      value: `${winRate}%`,
      tone:
        Number(winRate) >= 50
          ? "positive"
          : closedTrades.length === 0
          ? "neutral"
          : "negative",
    },
    {
      label: "Total P&L",
      value: totalPnL.toFixed(2),
      tone:
        totalPnL > 0
          ? "positive"
          : totalPnL < 0
          ? "negative"
          : "neutral",
    },
    {
      label: "Profit Factor",
      value: profitFactorDisplay,
      tone:
        profitFactor >= 1 && profitFactor !== 0
          ? "positive"
          : profitFactor === 0
          ? "neutral"
          : "negative",
    },
    {
      label: "Win Streak",
      value: maxWinStreak,
      tone:
        maxWinStreak > 0
          ? "positive"
          : "neutral",
    },
    {
      label: "Loss Streak",
      value: maxLossStreak,
      tone:
        maxLossStreak > 0
          ? "negative"
          : "neutral",
    },
  ];

  const toneClasses = {
    positive:
      "border-emerald-500/15 bg-emerald-500/[0.06] text-emerald-400",
    negative:
      "border-rose-500/15 bg-rose-500/[0.06] text-rose-400",
    neutral:
      "border-slate-800/80 bg-slate-900/50 text-slate-200",
  };

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-[#081321]/90 p-5">

      {/* HEADER */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
            Performance
          </p>

          <h2 className="mt-1 text-base font-semibold text-white">
            Trading Performance
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Results from completed trades in the current execution mode
          </p>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5">
          <span className="text-xs font-medium text-slate-400">
            {closedTrades.length}{" "}
            {closedTrades.length === 1
              ? "trade"
              : "trades"}
          </span>
        </div>
      </div>

      {/* PRIMARY PERFORMANCE */}
      <div className="mb-4 grid grid-cols-2 gap-3">

        <div
          className={`rounded-xl border p-4 ${
            totalPnL > 0
              ? "border-emerald-500/20 bg-emerald-500/[0.06]"
              : totalPnL < 0
              ? "border-rose-500/20 bg-rose-500/[0.06]"
              : "border-slate-800/80 bg-slate-900/50"
          }`}
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
            Net P&L
          </p>

          <p
            className={`mt-2 text-2xl font-bold tracking-tight ${
              totalPnL > 0
                ? "text-emerald-400"
                : totalPnL < 0
                ? "text-rose-400"
                : "text-slate-200"
            }`}
          >
            {totalPnL > 0 ? "+" : ""}
            {totalPnL.toFixed(2)}
          </p>
        </div>

        <div
          className={`rounded-xl border p-4 ${
            Number(winRate) >= 50 &&
            closedTrades.length > 0
              ? "border-emerald-500/20 bg-emerald-500/[0.06]"
              : "border-slate-800/80 bg-slate-900/50"
          }`}
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
            Win Rate
          </p>

          <p
            className={`mt-2 text-2xl font-bold tracking-tight ${
              Number(winRate) >= 50 &&
              closedTrades.length > 0
                ? "text-emerald-400"
                : "text-slate-200"
            }`}
          >
            {winRate}%
          </p>
        </div>

      </div>

      {/* METRICS */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

        {performanceMetrics.map(
          (metric) => (
            <div
              key={metric.label}
              className={`rounded-xl border p-3 ${
                toneClasses[
                  metric.tone as keyof typeof toneClasses
                ]
              }`}
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">
                {metric.label}
              </p>

              <p className="mt-1.5 text-lg font-semibold">
                {metric.value}
              </p>
            </div>
          )
        )}

      </div>

      {/* EMPTY STATE */}
      {closedTrades.length === 0 && (
        <div className="mt-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/30 px-4 py-3 text-center">
          <p className="text-xs text-slate-500">
            Performance metrics will populate after a trade is completed.
          </p>
        </div>
      )}

    </div>
  );
}