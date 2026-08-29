type Props = {
  trade: any;
};

export default function ActiveTradeMonitor({
  trade,
}: Props) {

  if (!trade) return null;


  // ===============================
  // DISPLAY HELPERS
  // ===============================

  const pnlColor =
    trade.pnl >= 0
      ? "text-emerald-400"
      : "text-rose-400";


  const realizedPnLColor =
    trade.realizedPnL >= 0
      ? "text-emerald-400"
      : "text-rose-400";


  const actionColor =
    trade.action === "BUY"
      ? "text-emerald-400"
      : trade.action === "SELL"
      ? "text-rose-400"
      : "text-amber-400";


  const statusColor =
    trade.status === "TARGET 1 HIT"
      ? "text-cyan-400"
      : trade.status === "TARGET 2 HIT"
      ? "text-blue-400"
      : trade.status === "CLOSED"
      ? "text-slate-400"
      : trade.status === "ACTIVE"
      ? "text-emerald-400"
      : "text-amber-400";


  return (

    <div className="rounded-2xl border border-slate-800/80 bg-[#081321]/90 p-5 shadow-[0_12px_35px_rgba(0,0,0,0.18)]">


      {/* ================= HEADER ================= */}

      <div className="flex items-start justify-between gap-4">

        <div>

          <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-400">
            Live Position
          </p>

          <h3 className="mt-1 text-lg font-bold text-white">
            Active Trade
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Real-time trade management and protection status.
          </p>

        </div>


        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">

          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.75)]" />

          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
            Monitoring
          </span>

        </div>

      </div>


      {/* ================= PRIMARY STATUS ================= */}

      <div className="mt-5 grid grid-cols-2 gap-3">


        {/* ACTION */}

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Action
          </p>

          <p className={`mt-1 text-xl font-black ${actionColor}`}>
            {trade.action}
          </p>

        </div>


        {/* STATUS */}

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Status
          </p>

          <p className={`mt-1 text-sm font-bold ${statusColor}`}>
            {trade.status}
          </p>

        </div>

      </div>


      {/* ================= PRICE ================= */}

      <div className="mt-3 grid grid-cols-2 gap-3">


        {/* ENTRY */}

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Entry
          </p>

          <p className="mt-1 text-base font-bold text-white">
            {Number(trade.entry).toFixed(2)}
          </p>

        </div>


        {/* CURRENT */}

        <div className="rounded-xl border border-blue-500/15 bg-blue-500/5 p-3">

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Current Price
          </p>

          <p className="mt-1 text-base font-bold text-blue-300">
            {Number(trade.currentPrice).toFixed(2)}
          </p>

        </div>

      </div>


      {/* ================= P/L ================= */}

      <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">

        <div className="flex items-end justify-between gap-4">

          <div>

            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Live P/L
            </p>

            <p className={`mt-1 text-2xl font-black ${pnlColor}`}>
              {trade.pnl >= 0 ? "+" : ""}
              {Number(trade.pnl).toFixed(2)}
            </p>

          </div>


          {trade.realizedPnL !== undefined && (

            <div className="text-right">

              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Realized P/L
              </p>

              <p className={`mt-1 text-base font-bold ${realizedPnLColor}`}>
                {trade.realizedPnL >= 0 ? "+" : ""}
                {Number(trade.realizedPnL).toFixed(2)}
              </p>

            </div>

          )}

        </div>

      </div>


      {/* ================= TRADE LEVELS ================= */}

      <div className="mt-3 grid grid-cols-2 gap-3">


        {/* STOP LOSS */}

        <div className="rounded-xl border border-rose-500/15 bg-rose-500/5 p-3">

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Stop Loss
          </p>

          <p className="mt-1 text-base font-bold text-rose-400">
            {Number(trade.stopLoss).toFixed(2)}
          </p>

        </div>


        {/* TARGET 1 */}

        <div
          className={`rounded-xl border p-3 ${
            trade.target1Hit
              ? "border-emerald-500/30 bg-emerald-500/10"
              : "border-emerald-500/15 bg-emerald-500/5"
          }`}
        >

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Target 1
          </p>

          <p className="mt-1 text-base font-bold text-emerald-400">
            {trade.target1Hit
              ? "✓ HIT"
              : Number(trade.target1).toFixed(2)}
          </p>

        </div>


        {/* TARGET 2 */}

        <div
          className={`rounded-xl border p-3 ${
            trade.target2Hit
              ? "border-emerald-500/30 bg-emerald-500/10"
              : "border-emerald-500/15 bg-emerald-500/5"
          }`}
        >

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Target 2
          </p>

          <p className="mt-1 text-base font-bold text-emerald-400">
            {trade.target2Hit
              ? "✓ HIT"
              : Number(trade.target2).toFixed(2)}
          </p>

        </div>


        {/* RUNNER */}

        <div
          className={`rounded-xl border p-3 ${
            trade.target2Hit
              ? "border-cyan-500/25 bg-cyan-500/10"
              : "border-slate-800 bg-slate-900/50"
          }`}
        >

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Runner
          </p>

          <p
            className={`mt-1 text-sm font-bold ${
              trade.target2Hit
                ? "text-cyan-400"
                : "text-slate-400"
            }`}
          >
            {trade.target2Hit
              ? "🏃 ACTIVE"
              : "🔒 Waiting for T2"}
          </p>

        </div>

      </div>


      {/* ================= TRADE TIMELINE ================= */}

      <div className="mt-6 border-t border-slate-800/80 pt-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-[10px] uppercase tracking-[0.18em] text-blue-400">
              Trade Lifecycle
            </p>

            <h4 className="mt-1 text-sm font-bold text-white">
              Trade Timeline
            </h4>

          </div>


          <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5">

            <span className="text-[10px] text-slate-400">
              {trade.events?.length ?? 0} Events
            </span>

          </div>

        </div>


        <div className="mt-5 space-y-4">

          {trade.events?.map((event: any) => (

            <div
              key={event.id}
              className="relative flex items-start gap-3 rounded-xl border border-slate-800/70 bg-slate-900/40 p-3"
            >

              <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_7px_rgba(34,211,238,0.55)]" />


              <div className="min-w-0 flex-1">

                <div className="flex items-start justify-between gap-3">

                  <p className="text-sm font-semibold text-slate-200">
                    {event.type}
                  </p>

                  <p className="shrink-0 text-[10px] text-slate-600">
                    {new Date(
                      event.timestamp
                    ).toLocaleTimeString()}
                  </p>

                </div>


                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  {event.description}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}