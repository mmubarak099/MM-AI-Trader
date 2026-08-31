"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface PriceChartProps {
  prices: number[];
  times?: Array<string | number | Date>;
}

export default function PriceChart({
  prices,
  times,
}: PriceChartProps) {
  const data = prices.map((price, index) => {
    const suppliedTime =
      times?.[index] != null
        ? new Date(times[index])
        : null;

    const displayTime =
      suppliedTime &&
      !Number.isNaN(suppliedTime.getTime())
        ? suppliedTime.toLocaleTimeString(
            "en-IN",
            {
              timeZone: "Asia/Kolkata",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }
          )
        : new Date(
            Date.now() -
              (prices.length - index) * 3000
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });

    return {
      time: displayTime,
      price,
    };
  });

  const latestPrice =
    prices.length > 0
      ? prices[prices.length - 1]
      : null;

  const firstPrice =
    prices.length > 0
      ? prices[0]
      : null;

  const isUp =
    latestPrice !== null &&
    firstPrice !== null &&
    latestPrice >= firstPrice;

  const change =
    latestPrice !== null &&
    firstPrice !== null
      ? latestPrice - firstPrice
      : null;

  const hasChartData = prices.length >= 2;

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-[#081321]/90 p-5">

      {/* HEADER */}
      <div className="mb-4 flex items-start justify-between gap-4">

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
            Market Feed
          </p>

          <h3 className="mt-1 text-base font-semibold text-white">
            Live Price
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Recent market price movement
          </p>
        </div>

        {latestPrice !== null ? (
          <div className="text-right">

            <p className="text-xl font-bold tracking-tight text-white">
              {latestPrice.toFixed(2)}
            </p>

            {change !== null && (
              <div
                className={`mt-1 inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold ${
                  isUp
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : "border-rose-500/20 bg-rose-500/10 text-rose-400"
                }`}
              >
                Recent: {change > 0 ? "+" : ""}
                {change.toFixed(2)} pts
              </div>
            )}

          </div>
        ) : (
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5">
            <span className="text-xs font-medium text-slate-500">
              Waiting for data
            </span>
          </div>
        )}

      </div>

      {/* CHART */}
      <div className="relative h-[180px] overflow-hidden rounded-xl border border-slate-800/70 bg-slate-950/40">

        {hasChartData ? (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <LineChart
              data={data}
              margin={{
                top: 16,
                right: 14,
                left: 0,
                bottom: 8,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e293b"
                vertical={false}
              />

              <XAxis
                dataKey="time"
                stroke="#64748b"
                tick={{
                  fontSize: 10,
                  fill: "#64748b",
                }}
                tickLine={false}
                axisLine={false}
                minTickGap={35}
                interval="preserveStartEnd"
                padding={{
                  left: 24,
                  right: 24,
                }}
              />

              <YAxis
                stroke="#64748b"
                domain={["auto", "auto"]}
                tick={{
                  fontSize: 10,
                  fill: "#64748b",
                }}
                tickLine={false}
                axisLine={false}
                width={64}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#07111f",
                  border: "1px solid #334155",
                  borderRadius: "10px",
                  fontSize: "12px",
                  color: "#e2e8f0",
                }}
                labelStyle={{
                  color: "#94a3b8",
                  marginBottom: "4px",
                }}
                formatter={(value) => [
                  Number(value).toFixed(2),
                  "Price",
                ]}
              />

              <Line
                type="monotone"
                dataKey="price"
                stroke={
                  isUp
                    ? "#22c55e"
                    : "#ef4444"
                }
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 4,
                  strokeWidth: 0,
                }}
              />

            </LineChart>

          </ResponsiveContainer>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">

            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/70">
              <span className="text-lg text-slate-500">
                ∿
              </span>
            </div>

            <p className="text-sm font-medium text-slate-300">
              Waiting for price history
            </p>

            <p className="mt-1 max-w-[260px] text-xs leading-5 text-slate-500">
              The chart will appear once at least two market price points are available.
            </p>

            {latestPrice !== null && (
              <p className="mt-3 text-xs text-slate-600">
                Latest price received:{" "}
                <span className="font-medium text-slate-400">
                  {latestPrice.toFixed(2)}
                </span>
              </p>
            )}

          </div>
        )}

      </div>

    </div>
  );
}