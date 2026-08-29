type Props = {
  decision: any;
};

export default function TradeManagerAI({
  decision,
}: Props) {

  if (!decision) return null;


  // ===============================
  // DISPLAY HELPERS
  // ===============================

  const recommendation =
    String(decision.recommendation ?? "");

  const recommendationUpper =
    recommendation.toUpperCase();

  const recommendationColor =
    recommendationUpper.includes("EXIT") ||
    recommendationUpper.includes("CLOSE")
      ? "text-rose-400"
      : recommendationUpper.includes("HOLD") ||
        recommendationUpper.includes("CONTINUE")
      ? "text-emerald-400"
      : recommendationUpper.includes("PROTECT") ||
        recommendationUpper.includes("TRAIL")
      ? "text-cyan-400"
      : "text-amber-400";

  const recommendationBorder =
    recommendationUpper.includes("EXIT") ||
    recommendationUpper.includes("CLOSE")
      ? "border-rose-500/20 bg-rose-500/5"
      : recommendationUpper.includes("HOLD") ||
        recommendationUpper.includes("CONTINUE")
      ? "border-emerald-500/20 bg-emerald-500/5"
      : recommendationUpper.includes("PROTECT") ||
        recommendationUpper.includes("TRAIL")
      ? "border-cyan-500/20 bg-cyan-500/5"
      : "border-amber-500/20 bg-amber-500/5";


  return (

    <div className="rounded-2xl border border-slate-800/80 bg-[#081321]/90 p-5 shadow-[0_12px_35px_rgba(0,0,0,0.18)]">


      {/* ================= HEADER ================= */}

      <div className="flex items-start justify-between gap-4">

        <div>

          <p className="text-[10px] uppercase tracking-[0.18em] text-cyan-400">
            AI Trade Management
          </p>

          <h3 className="mt-1 text-lg font-bold text-white">
            Trade Manager AI
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Active position analysis and management guidance.
          </p>

        </div>


        <div className="flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5">

          <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.65)]" />

          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-300">
            AI Active
          </span>

        </div>

      </div>


      {/* ================= RECOMMENDATION ================= */}

      <div
        className={`mt-5 rounded-xl border p-4 ${recommendationBorder}`}
      >

        <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
          Recommendation
        </p>


        <div className="mt-2 flex items-end justify-between gap-4">

          <p
            className={`text-xl font-black tracking-wide ${recommendationColor}`}
          >
            {decision.recommendation}
          </p>


          <div className="text-right">

            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Confidence
            </p>

            <p className="mt-1 text-lg font-bold text-cyan-400">
              {decision.confidence}%
            </p>

          </div>

        </div>

      </div>


      {/* ================= CONFIDENCE BAR ================= */}

      <div className="mt-4">

        <div className="mb-2 flex items-center justify-between">

          <span className="text-[10px] uppercase tracking-wider text-slate-500">
            AI Confidence
          </span>

          <span className="text-xs font-semibold text-slate-300">
            {decision.confidence}%
          </span>

        </div>


        <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">

          <div
            className="h-full rounded-full bg-cyan-400 transition-all duration-300"
            style={{
              width: `${Math.min(
                Math.max(
                  Number(decision.confidence) || 0,
                  0
                ),
                100
              )}%`,
            }}
          />

        </div>

      </div>


      {/* ================= AI REASONS ================= */}

      <div className="mt-5 border-t border-slate-800/80 pt-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-[10px] uppercase tracking-[0.18em] text-blue-400">
              Decision Context
            </p>

            <h4 className="mt-1 text-sm font-bold text-white">
              AI Reasons
            </h4>

          </div>


          <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5">

            <span className="text-[10px] text-slate-400">
              {decision.reasons?.length ?? 0} Reasons
            </span>

          </div>

        </div>


        <div className="mt-4 space-y-2">

          {decision.reasons?.map(
            (reason: string, index: number) => (

              <div
                key={index}
                className="flex items-start gap-3 rounded-xl border border-slate-800/70 bg-slate-900/40 p-3"
              >

                <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10">

                  <span className="text-[9px] font-bold text-cyan-400">
                    ✓
                  </span>

                </div>


                <p className="text-xs leading-relaxed text-slate-300">
                  {reason}
                </p>

              </div>

            )
          )}

        </div>

      </div>

    </div>

  );
}