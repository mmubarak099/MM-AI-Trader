type Props = {
  trades: any[];
};

export default function TradeHistory({
  trades,
}: Props) {
  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">

      <h3 className="text-xl font-bold mb-4">
        Trade History
      </h3>

      {trades.length === 0 ? (
        <p className="text-gray-500">
          No completed trades yet.
        </p>
      ) : (
        <div className="space-y-3">

          {trades
            .slice()
            .reverse()
            .map((trade, index) => (

              <div
                key={index}
                className="bg-gray-800 rounded-lg p-4"
              >
                <div className="flex justify-between">

                  <span
                    className={
                      trade.action === "BUY"
                        ? "text-green-400 font-bold"
                        : "text-red-400 font-bold"
                    }
                  >
                    {trade.action}
                  </span>

                  <div className="text-right">

  <p
    className={
      trade.result === "WIN"
        ? "text-green-400 font-bold"
        : "text-red-400 font-bold"
    }
  >
    {trade.result}
  </p>

  <p
    className={
      trade.pnl >= 0
        ? "text-green-400"
        : "text-red-400"
    }
  >
    P&L : {trade.pnl.toFixed(2)}
  </p>

</div>

                </div>

<div className="mt-3 text-sm space-y-1">

  <p>
    <span className="text-gray-400">Entry :</span>{" "}
    <span className="text-white">{trade.entry}</span>
  </p>

  <p>
    <span className="text-gray-400">Exit :</span>{" "}
    <span className="text-white">{trade.currentPrice}</span>
  </p>

  <p>
    <span className="text-gray-400">Status :</span>{" "}
    <span className="text-cyan-400">{trade.status}</span>
  </p>

  <p>
    <span className="text-gray-400">Confidence :</span>{" "}
    <span className="text-yellow-400">
      {trade.confidence}%
    </span>
  </p>

<p>
  <span className="text-gray-400">Opened :</span>{" "}
  <span className="text-white">
    {trade.openedAt
      ? new Date(trade.openedAt).toLocaleTimeString()
      : "-"}
  </span>
</p>

<p>
  <span className="text-gray-400">Closed :</span>{" "}
  <span className="text-white">
    {trade.closedAt
      ? new Date(trade.closedAt).toLocaleTimeString()
      : "-"}
  </span>
</p>

<p>
  <span className="text-gray-400">Duration :</span>{" "}
  <span className="text-cyan-400">
    {trade.openedAt && trade.closedAt
      ? `${Math.floor(
          (new Date(trade.closedAt).getTime() -
            new Date(trade.openedAt).getTime()) /
            1000
        )} sec`
      : "-"}
  </span>
</p>

</div>

              </div>

            ))}

        </div>
      )}

    </div>
  );
}