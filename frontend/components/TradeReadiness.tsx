"use client";

type Props = {
  signal: any;
  pattern?: string;
  confirmationCount?: number;
};

export default function TradeReadiness({
  signal,
  pattern,
  confirmationCount = 0,
}: Props) {
  const action =
    signal?.action ?? "WAIT";

  const confidence =
    signal?.confidence ?? 0;

  const isBuy =
    action === "BUY";

  const isSell =
    action === "SELL";

  const directional =
    isBuy || isSell;

  const checks = [
    {
      label: "Trend",
      value:
        signal?.trend ?? "Neutral",
      passed:
        isBuy
          ? signal?.trend === "Bullish"
          : isSell
          ? signal?.trend === "Bearish"
          : false,
    },

    {
      label: "Candlestick",
      value:
        pattern ?? "No Pattern",
      passed:
        isBuy
          ? pattern ===
              "Bullish Engulfing" ||
            pattern === "Hammer"
          : isSell
          ? pattern ===
            "Bearish Engulfing"
          : false,
    },

    {
      label: "Structure",
      value:
        signal?.marketStructure ??
        "—",
      passed:
        isBuy
          ? signal?.marketStructure ===
            "UPTREND"
          : isSell
          ? signal?.marketStructure ===
            "DOWNTREND"
          : false,
    },

    {
      label: "Breakout",
      value:
        signal?.breakout ?? "NONE",
      passed:
        isBuy
          ? signal?.breakout ===
            "BREAKOUT"
          : isSell
          ? signal?.breakout ===
            "BREAKDOWN"
          : false,
    },

    {
      label: "Volume",
      value:
        signal?.volumeStrength ??
        "NORMAL",
      passed:
        directional &&
        signal?.volumeStrength ===
          "HIGH",
    },

    {
      label: "Confidence",
      value: `${confidence}%`,
      passed:
        directional &&
        confidence >= 90,
    },
  ];

  const displayCount =
    directional
      ? confirmationCount
      : 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            AI Trade
          </p>

          <h2 className="mt-1 text-lg font-semibold text-white">
            Trade Readiness
          </h2>
        </div>

        <div className="text-right">
          <div className="text-xl font-bold text-white">
            {action}
          </div>

          <div className="text-xs text-slate-400">
            {confidence}% confidence
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <span className="text-sm text-slate-400">
          Confirmations
        </span>

        <span className="text-lg font-semibold text-white">
          {displayCount} / 6
        </span>
      </div>

      <div className="space-y-2">
        {checks.map(check => (
          <div
            key={check.label}
            className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2"
          >
            <span className="text-sm text-slate-400">
              {check.label}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300">
                {check.value}
              </span>

              <span
                className={
                  check.passed
                    ? "text-emerald-400"
                    : "text-slate-600"
                }
              >
                {check.passed
                  ? "●"
                  : "○"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {!directional && (
        <div className="mt-4 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-xs text-slate-500">
          Waiting for a BUY or SELL direction before
          directional confirmations are evaluated.
        </div>
      )}
    </div>
  );
}