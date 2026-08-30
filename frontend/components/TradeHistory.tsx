type Props = {
  trades: any[];
};

export default function TradeHistory({
  trades,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-[#081321]/90 p-5">

      {/* HEADER */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
            Execution Log
          </p>

          <h3 className="mt-1 text-base font-semibold text-white">
            Trade History
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Recent completed trades and execution events
          </p>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5">
          <span className="text-xs font-medium text-slate-400">
            {trades.length}{" "}
            {trades.length === 1
              ? "trade"
              : "trades"}
          </span>
        </div>
      </div>

      {trades.length === 0 ? (

        /* EMPTY STATE */
        <div className="flex min-h-[150px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/30 px-6 text-center">

          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/70">
            <span className="text-sm text-slate-500">
              ↕
            </span>
          </div>

          <p className="text-sm font-medium text-slate-300">
            No completed trades yet
          </p>

          <p className="mt-1 max-w-[300px] text-xs leading-5 text-slate-500">
            Completed trades for the current execution mode will appear here.
          </p>

        </div>

      ) : (

        <div className="space-y-3">

          {trades
            .slice()
            .reverse()
            .slice(0, 5)
            .map((trade) => {

              const pnl = Number(
                trade.realizedPnL ??
                trade.pnl ??
                0
              );

              const duration =
                trade.openedAt &&
                trade.closedAt
                  ? Math.floor(
                      (
                        new Date(
                          trade.closedAt
                        ).getTime() -
                        new Date(
                          trade.openedAt
                        ).getTime()
                      ) / 1000
                    )
                  : null;

              const isWin =
                trade.result === "WIN";

              const isLoss =
                trade.result === "LOSS";

              return (
                <details
                  key={trade.id}
                  className="group overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/45 transition-colors open:border-slate-700"
                >

                  {/* TRADE SUMMARY */}
                  <summary className="cursor-pointer list-none px-4 py-3.5">

                    <div className="flex items-center justify-between gap-4">

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2.5">

                          {/* DIRECTION */}
                          <span
                            className={`rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                              trade.action === "BUY"
                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                : "border-rose-500/20 bg-rose-500/10 text-rose-400"
                            }`}
                          >
                            {trade.action}
                          </span>

                          {/* RESULT */}
                          <span
                            className={`rounded-md border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                              isWin
                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                : isLoss
                                ? "border-rose-500/20 bg-rose-500/10 text-rose-400"
                                : "border-slate-700 bg-slate-800/70 text-slate-400"
                            }`}
                          >
                            {trade.result}
                          </span>

                          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-600">
                            {trade.status}
                          </span>

                        </div>

                        {/* ENTRY / EXIT */}
                        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">

                          <div>
                            <p className="text-[9px] uppercase tracking-[0.12em] text-slate-600">
                              Entry
                            </p>

                            <p className="mt-0.5 text-xs font-semibold text-slate-300">
                              {Number(
                                trade.entry
                              ).toFixed(2)}
                            </p>
                          </div>

                          <div>
                            <p className="text-[9px] uppercase tracking-[0.12em] text-slate-600">
                              Exit
                            </p>

                            <p className="mt-0.5 text-xs font-semibold text-slate-300">
                              {Number(
                                trade.currentPrice ??
                                trade.exit ??
                                trade.entry
                              ).toFixed(2)}
                            </p>
                          </div>

                          {duration !== null && (
                            <div>
                              <p className="text-[9px] uppercase tracking-[0.12em] text-slate-600">
                                Duration
                              </p>

                              <p className="mt-0.5 text-xs font-semibold text-slate-400">
                                {duration}s
                              </p>
                            </div>
                          )}

                        </div>

                      </div>

                      {/* P&L */}
                      <div className="shrink-0 text-right">

                        <p className="text-[9px] uppercase tracking-[0.12em] text-slate-600">
                          P&L
                        </p>

                        <p
                          className={`mt-1 text-lg font-bold tracking-tight ${
                            pnl > 0
                              ? "text-emerald-400"
                              : pnl < 0
                              ? "text-rose-400"
                              : "text-slate-300"
                          }`}
                        >
                          {pnl > 0 ? "+" : ""}
                          {pnl.toFixed(2)}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-600 group-open:text-slate-500">
                          Details ↓
                        </p>

                      </div>

                    </div>

                  </summary>

                  {/* EXPANDED TRADE DETAILS */}
                  <div className="border-t border-slate-800/80 px-4 pb-4">

                    <div className="grid grid-cols-2 gap-3 py-4 md:grid-cols-4">

                      <div className="rounded-lg border border-slate-800/70 bg-slate-950/30 p-3">
                        <p className="text-[9px] uppercase tracking-[0.12em] text-slate-600">
                          Status
                        </p>

                        <p className="mt-1 text-xs font-semibold text-cyan-400">
                          {trade.status}
                        </p>
                      </div>

                      <div className="rounded-lg border border-slate-800/70 bg-slate-950/30 p-3">
                        <p className="text-[9px] uppercase tracking-[0.12em] text-slate-600">
                          Confidence
                        </p>

                        <p className="mt-1 text-xs font-semibold text-amber-400">
                          {trade.confidence}%
                        </p>
                      </div>

                      <div className="rounded-lg border border-slate-800/70 bg-slate-950/30 p-3">
                        <p className="text-[9px] uppercase tracking-[0.12em] text-slate-600">
                          Opened
                        </p>

                        <p className="mt-1 text-xs font-semibold text-slate-300">
                          {trade.openedAt
                            ? new Date(
                                trade.openedAt
                              ).toLocaleTimeString()
                            : "-"}
                        </p>
                      </div>

                      <div className="rounded-lg border border-slate-800/70 bg-slate-950/30 p-3">
                        <p className="text-[9px] uppercase tracking-[0.12em] text-slate-600">
                          Closed
                        </p>

                        <p className="mt-1 text-xs font-semibold text-slate-300">
                          {trade.closedAt
                            ? new Date(
                                trade.closedAt
                              ).toLocaleTimeString()
                            : "-"}
                        </p>
                      </div>

                    </div>

                    {/* TRADE EVENTS */}
                    {trade.events &&
                      trade.events.length > 0 && (

                        <details className="border-t border-slate-800/80 pt-3">

                          <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-2 py-2 text-xs text-slate-400 transition-colors hover:bg-slate-900/60 hover:text-white">

                            <span>
                              Execution Timeline
                            </span>

                            <span className="rounded-md border border-slate-800 bg-slate-900/70 px-2 py-0.5 text-[10px] text-slate-500">
                              {trade.events.length}{" "}
                              {trade.events.length === 1
                                ? "event"
                                : "events"}
                            </span>

                          </summary>

                          <div className="mt-2 space-y-1">

                            {trade.events.map(
                              (event: any) => {

                                const entry =
                                  Number(trade.entry);

                                const eventPrice =
                                  Number(event.price);

                                let difference:
                                  | number
                                  | null = null;

                                if (
                                  Number.isFinite(entry) &&
                                  Number.isFinite(eventPrice)
                                ) {
                                  difference =
                                    trade.action === "BUY"
                                      ? eventPrice - entry
                                      : entry - eventPrice;
                                }

                                return (
                                  <div
                                    key={event.id}
                                    className="flex items-start justify-between gap-4 rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-900/50"
                                  >

                                    <div className="min-w-0">

                                      <div className="flex flex-wrap items-center gap-2">

                                        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-cyan-400">
                                          {event.type}
                                        </span>

                                        {difference !== null && (
                                          <span
                                            className={`text-xs font-semibold ${
                                              difference > 0
                                                ? "text-emerald-400"
                                                : difference < 0
                                                ? "text-rose-400"
                                                : "text-slate-400"
                                            }`}
                                          >
                                            {difference > 0
                                              ? "+"
                                              : ""}
                                            {difference.toFixed(
                                              2
                                            )}{" "}
                                            pts
                                          </span>
                                        )}

                                      </div>

                                      <p className="mt-1 text-xs leading-5 text-slate-500">
                                        {event.description}
                                      </p>

                                      {event.type ===
                                        "PARTIAL_PROFIT_BOOKED" && (
                                        <p className="mt-1 text-xs font-medium text-emerald-400">
                                          Position: 50% booked
                                        </p>
                                      )}

                                    </div>

                                    <span className="shrink-0 whitespace-nowrap text-[10px] text-slate-600">
                                      {event.timestamp
                                        ? new Date(
                                            event.timestamp
                                          ).toLocaleTimeString()
                                        : "-"}
                                    </span>

                                  </div>
                                );
                              }
                            )}

                          </div>

                        </details>
                      )}

                  </div>

                </details>
              );
            })}

        </div>
      )}

      {/* FOOTER */}
      {trades.length > 5 && (
        <div className="mt-4 border-t border-slate-800/70 pt-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.12em] text-slate-600">
            Showing latest 5 of {trades.length} trades
          </p>
        </div>
      )}

    </div>
  );
}