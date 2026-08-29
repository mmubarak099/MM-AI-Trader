type Props = {
  signal: any;
  pattern: string;
};

export default function AIDecisionPanel({
  signal,
  pattern,
}: Props) {


  // ===============================
  // DISPLAY HELPERS
  // ===============================

  const actionColor =
    signal.action === "BUY"
      ? "text-emerald-400"
      : signal.action === "SELL"
      ? "text-rose-400"
      : signal.action === "WATCH"
      ? "text-blue-400"
      : "text-amber-400";


  const actionStyle =
    signal.action === "BUY"
      ? "border-emerald-500/20 bg-emerald-500/10"
      : signal.action === "SELL"
      ? "border-rose-500/20 bg-rose-500/10"
      : signal.action === "WATCH"
      ? "border-blue-500/20 bg-blue-500/10"
      : "border-amber-500/20 bg-amber-500/10";


  const riskColor =
    signal.riskLevel === "High"
      ? "text-rose-400"
      : signal.riskLevel === "Low"
      ? "text-emerald-400"
      : "text-amber-400";


  return (

    <div className="rounded-2xl border border-slate-800/80 bg-[#081321]/90 p-5 shadow-[0_12px_35px_rgba(0,0,0,0.18)]">


      {/* ================= HEADER ================= */}

      <div className="flex items-start justify-between gap-4">

        <div>

          <p className="text-[10px] uppercase tracking-[0.18em] text-cyan-400">
            AI Market Intelligence
          </p>

          <h3 className="mt-1 text-lg font-bold text-white">
            Live AI Decision
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Current market interpretation from the AI engine.
          </p>

        </div>


        <div
          className={`rounded-lg border px-3 py-1.5 ${actionStyle}`}
        >

          <span
            className={`text-xs font-black tracking-wide ${actionColor}`}
          >
            {signal.action}
          </span>

        </div>

      </div>


      {/* ================= LIVE VIEW NOTICE ================= */}

      <div className="mt-4 rounded-xl border border-blue-500/15 bg-blue-500/5 px-3 py-2.5">

        <div className="flex items-start gap-2">

          <span className="mt-0.5 text-xs text-blue-400">
            ●
          </span>

          <p className="text-xs leading-relaxed text-slate-400">
            Live market view — does not change the locked Current Signal.
          </p>

        </div>

      </div>


      {/* ================= DECISION DETAILS ================= */}

      <div className="mt-4 grid grid-cols-2 gap-3">


        {/* TREND */}

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Trend
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-200">
            {signal.trend}
          </p>

        </div>


        {/* CONFIDENCE */}

        <div className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-3">

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Confidence
          </p>

          <p className="mt-1 text-sm font-bold text-cyan-400">
            {signal.confidence}%
          </p>

        </div>


        {/* PATTERN */}

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Pattern
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-200">
            {pattern}
          </p>

        </div>


        {/* RISK */}

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Risk
          </p>

          <p className={`mt-1 text-sm font-bold ${riskColor}`}>
            {signal.riskLevel}
          </p>

        </div>

      </div>


      {/* ================= MARKET CONDITION ================= */}

      <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/50 p-3">

        <p className="text-[10px] uppercase tracking-wider text-slate-500">
          Market Condition
        </p>

        <p className="mt-1 text-sm font-semibold text-white">
          {signal.marketCondition}
        </p>

      </div>


      {/* ================= CONFIDENCE BAR ================= */}

      <div className="mt-4">

        <div className="mb-2 flex items-center justify-between">

          <span className="text-[10px] uppercase tracking-wider text-slate-500">
            AI Confidence
          </span>

          <span className="text-xs font-semibold text-cyan-400">
            {signal.confidence}%
          </span>

        </div>


        <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">

          <div
            className="h-full rounded-full bg-cyan-400 transition-all duration-300"
            style={{
              width: `${Math.min(
                Math.max(
                  Number(signal.confidence) || 0,
                  0
                ),
                100
              )}%`,
            }}
          />

        </div>

      </div>


      {/* ================= AI ADVICE ================= */}

      <div className="mt-5 border-t border-slate-800/80 pt-4">

        <div className="rounded-xl border border-blue-500/15 bg-blue-500/5 p-4">

          <div className="flex items-start gap-3">

            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10">

              <span className="text-sm">
                💡
              </span>

            </div>


            <div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-400">
                AI Advice
              </p>

              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                {signal.advice}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}