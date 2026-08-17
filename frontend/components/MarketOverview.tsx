"use client";

interface MarketOverviewProps {
  nifty: number;
  bankNifty: number;
  niftyChange: number;
  bankNiftyChange: number;
}

export default function MarketOverview({
  nifty,
  bankNifty,
  niftyChange,
  bankNiftyChange,
}: MarketOverviewProps) {

  const markets = [
    {
      name: "NIFTY 50",
      value: nifty.toLocaleString(),
      change: `${niftyChange > 0 ? "+" : ""}${niftyChange.toFixed(2)}%`,
    },
    {
      name: "BANK NIFTY",
      value: bankNifty.toLocaleString(),
      change: `${bankNiftyChange > 0 ? "+" : ""}${bankNiftyChange.toFixed(2)}%`,
    },
    {
      name: "SENSEX",
      value: "80,600",
      change: "+0.20%",
    },
    {
      name: "INDIA VIX",
      value: "14.5",
      change: "-1.20%",
    },
  ];

  return (
    <div className="bg-gray-900 px-4 py-3 rounded-xl border border-gray-700">

      <h3 className="text-base font-semibold mb-3">
        Market Overview
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

        {markets.map((market) => (

          <div
            key={market.name}
            className="bg-gray-800 px-3 py-3 rounded-lg border border-gray-700"
          >

            <p className="text-xs text-gray-400">
              {market.name}
            </p>

            <p className="text-lg font-bold mt-1">
              {market.value}
            </p>

            <p
              className={`text-sm font-medium mt-1 ${
                market.change.startsWith("-")
                  ? "text-red-400"
                  : "text-green-400"
              }`}
            >
              {market.change}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}