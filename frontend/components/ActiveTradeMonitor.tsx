type Props = {
  trade: any;
};

export default function ActiveTradeMonitor({
  trade,
}: Props) {

  if (!trade) return null;

  const pnlColor =
    trade.pnl >= 0
      ? "text-green-400"
      : "text-red-400";

  return (

    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">

      <h3 className="text-xl font-bold mb-5">
        📈 Active Trade
      </h3>

      <div className="grid grid-cols-2 gap-4">

        <div>
          <p className="text-gray-400">Action</p>
          <p className="font-bold">
            {trade.action}
          </p>
        </div>

        <div>
          <p className="text-gray-400">
  Status
</p>

<p
  className={`font-bold ${
    trade.status === "Healthy"
      ? "text-green-400"
      : trade.status === "Target 1 Reached"
      ? "text-cyan-400"
      : trade.status === "Target 2 Reached"
      ? "text-blue-400"
      : trade.status === "Stop Loss Hit"
      ? "text-red-400"
      : "text-yellow-400"
  }`}
>
  {trade.status}
</p>
        </div>

        <div>
          <p className="text-gray-400">
            Entry
          </p>
          <p>{trade.entry}</p>
        </div>

        <div>
          <p className="text-gray-400">
            Current
          </p>
          <p>{trade.currentPrice}</p>
        </div>

        <div>
  <p className="text-gray-400">
    Live P/L
  </p>

  <p className={`${pnlColor} font-bold text-xl`}>
    {trade.pnl >= 0 ? "+" : ""}
    {trade.pnl.toFixed(2)}
  </p>


  {trade.realizedPnL !== undefined && (
    <>
      <p className="text-gray-400 mt-2">
        Realized P/L
      </p>

      <p
        className={`font-bold ${
          trade.realizedPnL >= 0
            ? "text-green-400"
            : "text-red-400"
        }`}
      >
        {trade.realizedPnL >= 0 ? "+" : ""}
        {trade.realizedPnL.toFixed(2)}
      </p>
    </>
  )}
</div>

        <div>
          <p className="text-gray-400">
            Stop Loss
          </p>
          <p className="text-red-400">
            {trade.stopLoss}
          </p>
        </div>

        <div>
          <p className="text-gray-400">
            Target 1
          </p>
          <p className="text-green-400">
            {trade.target1}
          </p>
        </div>

        <div>
          <p className="text-gray-400">
            Target 2
          </p>
          <p className="text-green-400">
            {trade.target2}
          </p>
                </div>

        {/* Trade Timeline */}

        <div className="mt-8 border-t border-gray-800 pt-5">

          <h4 className="font-bold text-lg mb-4">
            📜 Trade Timeline
          </h4>

          <div className="space-y-3">

            {trade.events?.map((event: any) => (

              <div
                key={event.id}
                className="flex items-start gap-3"
              >

                <div className="w-2 h-2 mt-2 rounded-full bg-cyan-400" />

                <div>

                  <p className="font-semibold">
                    {event.type}
                  </p>

                  <p className="text-sm text-gray-400">
                    {event.description}
                  </p>

                  <p className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  );

}