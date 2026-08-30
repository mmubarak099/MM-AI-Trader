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
  ];

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-[#081321]/90 p-5">

      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
            Market Overview
          </p>

          <h3 className="mt-1 text-base font-semibold text-white">
            Primary Indices
          </h3>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5">
          <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
            NSE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

        {markets.map((market) => {
          const isNegative = market.change.startsWith("-");

          return (
            <div
              key={market.name}
              className="rounded-xl border border-slate-800/80 bg-slate-900/55 p-4"
            >
              <div className="flex items-start justify-between gap-4">

                <div>
                  <p className="text-xs font-medium tracking-wide text-slate-400">
                    {market.name}
                  </p>

                  <p className="mt-2 text-2xl font-bold tracking-tight text-white">
                    {market.value}
                  </p>
                </div>

                <div
                  className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${
                    isNegative
                      ? "border-rose-500/20 bg-rose-500/10 text-rose-400"
                      : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                  }`}
                >
                  {market.change}
                </div>

              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
}