type Props = {
  signal: any;
};

export default function TradeReadiness({
  signal,
}: Props) {

  if (!signal) return null;


  const score =
    signal.confirmationCount ?? 0;


  const checks = [
    {
      label: "Trend",
      passed:
        signal.trend === "Bullish" ||
        signal.trend === "Bearish",
      value: signal.trend,
    },
    {
      label: "Pattern",
      passed:
        signal.pattern &&
        signal.pattern !== "No Pattern",
      value:
        signal.pattern ?? "No Pattern",
    },
    {
      label: "Structure",
      passed:
        signal.marketStructure &&
        signal.marketStructure !== "NEUTRAL",
      value:
        signal.marketStructure ?? "NEUTRAL",
    },
    {
      label: "Breakout",
      passed:
        signal.breakout &&
        signal.breakout !== "NONE",
      value:
        signal.breakout ?? "NONE",
    },
    {
      label: "Volume",
      passed:
        signal.volumeStrength === "STRONG",
      value:
        signal.volumeStrength ?? "NORMAL",
    },
    {
      label: "Confidence",
      passed:
        signal.confidence >= 90,
      value: `${signal.confidence}%`,
    },
  ];


  const actionColor =
    signal.action === "BUY"
      ? "text-emerald-400"
      : signal.action === "SELL"
      ? "text-rose-400"
      : signal.action === "WATCH"
      ? "text-blue-400"
      : "text-amber-400";


  const readinessColor =
    score >= 4
      ? "text-emerald-400"
      : score >= 3
      ? "text-amber-400"
      : "text-rose-400";


  const readinessBorder =
    score >= 4
      ? "border-emerald-500/20 bg-emerald-500/10"
      : score >= 3
      ? "border-amber-500/20 bg-amber-500/10"
      : "border-rose-500/20 bg-rose-500/10";


  return (

    <div className="rounded-2xl border border-slate-800/80 bg-[#081321]/90 p-5 shadow-[0_12px_35px_rgba(0,0,0,0.18)]">


      {/* ================= HEADER ================= */}

      <div className="flex items-start justify-between gap-4">

        <div>

          <p className="text-[10px] uppercase tracking-[0.18em] text-cyan-400">
            Signal Validation
          </p>

          <h2 className="mt-1 text-lg font-bold text-white">
            Trade Readiness
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Supporting confirmation checks for the current signal.
          </p>

        </div>


        <div
          className={`rounded-lg border px-3 py-1.5 ${readinessBorder}`}
        >

          <span
            className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${readinessColor}`}
          >
            {score} / 6
          </span>

        </div>

      </div>


      {/* ================= SUMMARY ================= */}

      <div className="mt-5 grid grid-cols-3 gap-3">


        {/* SIGNAL */}

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Signal
          </p>

          <p className={`mt-1 text-base font-black ${actionColor}`}>
            {signal.action}
          </p>

        </div>


        {/* CONFIDENCE */}

        <div className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-3">

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Confidence
          </p>

          <p className="mt-1 text-base font-bold text-cyan-400">
            {signal.confidence}%
          </p>

        </div>


        {/* CONFIRMATIONS */}

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Confirmations
          </p>

          <p className={`mt-1 text-base font-bold ${readinessColor}`}>
            {score} / 6
          </p>

        </div>

      </div>


      {/* ================= READINESS BAR ================= */}

      <div className="mt-4">

        <div className="mb-2 flex items-center justify-between">

          <span className="text-[10px] uppercase tracking-wider text-slate-500">
            Confirmation Strength
          </span>

          <span className={`text-xs font-semibold ${readinessColor}`}>
            {Math.round((score / 6) * 100)}%
          </span>

        </div>


        <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">

          <div
            className={`h-full rounded-full transition-all duration-300 ${
              score >= 4
                ? "bg-emerald-400"
                : score >= 3
                ? "bg-amber-400"
                : "bg-rose-400"
            }`}
            style={{
              width: `${Math.min(
                Math.max((score / 6) * 100, 0),
                100
              )}%`,
            }}
          />

        </div>

      </div>


      {/* ================= CONFIRMATION CHECKS ================= */}

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">

        {checks.map((check) => (

          <div
            key={check.label}
            className={`rounded-xl border p-3 ${
              check.passed
                ? "border-emerald-500/15 bg-emerald-500/5"
                : "border-slate-800 bg-slate-900/40"
            }`}
          >

            <div className="flex items-start justify-between gap-3">

              <div>

                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  {check.label}
                </p>

                <p
                  className={`mt-1 text-xs font-semibold ${
                    check.passed
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  {check.value}
                </p>

              </div>


              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                  check.passed
                    ? "border-emerald-500/30 bg-emerald-500/10"
                    : "border-rose-500/30 bg-rose-500/10"
                }`}
              >

                <span
                  className={`text-xs font-bold ${
                    check.passed
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  {check.passed
                    ? "✓"
                    : "×"}
                </span>

              </div>

            </div>

          </div>

        ))}

      </div>


      {/* ================= INFORMATION ================= */}

      <div className="mt-5 border-t border-slate-800/80 pt-4">

        <div className="rounded-xl border border-blue-500/10 bg-blue-500/5 p-3">

          <p className="text-xs leading-relaxed text-slate-500">
            These checks support the signal but do not create a separate trade decision.
          </p>

        </div>

      </div>

    </div>

  );
}