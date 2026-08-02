import type { Trade } from "../types/trade";

type Props = {
  trades: Trade[];
};

export default function TradeStatistics({
  trades,
}: Props) {

  const totalTrades = trades.length;

  const winningTrades =
    trades.filter(
      (trade) => trade.result === "WIN"
    ).length;

  const losingTrades =
    trades.filter(
      (trade) => trade.result === "LOSS"
    ).length;


  const winRate =
    totalTrades > 0
      ? (
          (winningTrades / totalTrades) *
          100
        ).toFixed(1)
      : "0";


  const totalPoints =
    trades.reduce(
      (total, trade) =>
        total + trade.pnl,
      0
    ).toFixed(2);


  const averageProfit =
    winningTrades > 0
      ? (
          trades
            .filter(
              (trade) =>
                trade.result === "WIN"
            )
            .reduce(
              (total, trade) =>
                total + trade.pnl,
              0
            ) / winningTrades
        ).toFixed(2)
      : "0";


  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">

      <h3 className="text-xl font-bold mb-4">
        Trade Performance
      </h3>


      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">


        <div>
          <p className="text-gray-400">
            Total Trades
          </p>
          <p className="text-white font-bold text-xl">
            {totalTrades}
          </p>
        </div>


        <div>
          <p className="text-gray-400">
            Wins
          </p>
          <p className="text-green-400 font-bold text-xl">
            {winningTrades}
          </p>
        </div>


        <div>
          <p className="text-gray-400">
            Losses
          </p>
          <p className="text-red-400 font-bold text-xl">
            {losingTrades}
          </p>
        </div>


        <div>
          <p className="text-gray-400">
            Win Rate
          </p>
          <p className="text-blue-400 font-bold text-xl">
            {winRate}%
          </p>
        </div>


        <div>
          <p className="text-gray-400">
            Total Points
          </p>
          <p className="text-green-400 font-bold text-xl">
            {totalPoints}
          </p>
        </div>


      </div>


      <div className="mt-5">

        <p className="text-gray-400">
          Average Profit
        </p>

        <p className="text-yellow-400 font-bold text-xl">
          {averageProfit}
        </p>

      </div>


    </div>
  );
}