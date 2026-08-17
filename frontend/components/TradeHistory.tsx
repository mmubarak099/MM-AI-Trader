type Props = {
  trades: any[];
};

export default function TradeHistory({
  trades,
}: Props) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold">
          Trade History
        </h3>

        <span className="text-xs text-gray-500">
          {trades.length} trades
        </span>
      </div>

      {trades.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No completed trades yet.
        </p>
      ) : (
        <div className="space-y-2">

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

              return (
                <details
                  key={trade.id}
                  className="bg-gray-800 rounded-lg border border-gray-700"
                >

                  {/* TRADE SUMMARY */}
                  <summary className="cursor-pointer list-none px-3 py-3">

                    <div className="flex items-center justify-between gap-4">

                      <div className="flex items-center gap-4 flex-wrap">

                        <span
                          className={`text-sm font-bold ${
                            trade.action === "BUY"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {trade.action}
                        </span>

                        <span
                          className={`text-xs font-semibold ${
                            trade.result === "WIN"
                              ? "text-green-400"
                              : trade.result === "LOSS"
                              ? "text-red-400"
                              : "text-gray-400"
                          }`}
                        >
                          {trade.result}
                        </span>

                        <span className="text-xs text-gray-500">
                          Entry{" "}
                          <span className="text-gray-200">
                            {Number(
                              trade.entry
                            ).toFixed(2)}
                          </span>
                        </span>

                        <span className="text-xs text-gray-500">
                          Exit{" "}
                          <span className="text-gray-200">
                            {Number(
                              trade.currentPrice ??
                              trade.exit ??
                              trade.entry
                            ).toFixed(2)}
                          </span>
                        </span>

                      </div>

                      <div className="text-right shrink-0">

                        <p
                          className={`text-sm font-bold ${
                            pnl >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {pnl >= 0 ? "+" : ""}
                          {pnl.toFixed(2)}
                        </p>

                        <p className="text-xs text-gray-500">
                          {duration !== null
                            ? `${duration}s`
                            : "-"}
                        </p>

                      </div>

                    </div>

                  </summary>


                  {/* EXPANDED TRADE DETAILS */}
                  <div className="px-3 pb-3 border-t border-gray-700">

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 py-3">

                      <div>
                        <p className="text-xs text-gray-500">
                          Status
                        </p>
                        <p className="text-xs font-semibold text-cyan-400">
                          {trade.status}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Confidence
                        </p>
                        <p className="text-xs font-semibold text-yellow-400">
                          {trade.confidence}%
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Opened
                        </p>
                        <p className="text-xs text-gray-200">
                          {trade.openedAt
                            ? new Date(
                                trade.openedAt
                              ).toLocaleTimeString()
                            : "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Closed
                        </p>
                        <p className="text-xs text-gray-200">
                          {trade.closedAt
                            ? new Date(
                                trade.closedAt
                              ).toLocaleTimeString()
                            : "-"}
                        </p>
                      </div>

                    </div>


                    {/* COLLAPSED TRADE EVENTS */}
                    {trade.events &&
                      trade.events.length > 0 && (

                        <details className="pt-3 border-t border-gray-700">

                          <summary className="cursor-pointer text-xs text-gray-400 hover:text-white">
                            View {trade.events.length} trade events
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
                                    className="flex items-center justify-between gap-3 py-1"
                                  >

                                    <div className="min-w-0">

                                      <div className="flex items-center gap-2 flex-wrap">

                                        <span className="text-cyan-400 text-xs font-medium">
                                          {event.type}
                                        </span>

                                        {difference !== null && (
                                          <span
                                            className={`text-xs font-semibold ${
                                              difference >= 0
                                                ? "text-green-400"
                                                : "text-red-400"
                                            }`}
                                          >
                                            {difference >= 0
                                              ? "+"
                                              : ""}
                                            {difference.toFixed(2)} pts
                                          </span>
                                        )}

                                      </div>

                                      <p className="text-gray-500 text-xs">
                                        {event.description}
                                      </p>

                                      {event.type ===
                                        "PARTIAL_PROFIT_BOOKED" && (
                                        <p className="text-green-400 text-xs">
                                          Position: 50% booked
                                        </p>
                                      )}

                                    </div>

                                    <span className="text-gray-600 text-xs whitespace-nowrap">
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

    </div>
  );
}