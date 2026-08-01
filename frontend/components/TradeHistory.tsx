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

                  <span
                    className={
                      trade.pnl >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {trade.pnl.toFixed(2)}
                  </span>

                </div>

                <div className="mt-2 text-sm text-gray-300">

                  Entry : {trade.entry}

                  <br />

                  Exit : {trade.currentPrice}

                  <br />

                  Status : {trade.status}

                </div>

              </div>

            ))}

        </div>
      )}

    </div>
  );
}