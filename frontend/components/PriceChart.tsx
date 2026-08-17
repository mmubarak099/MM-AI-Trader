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
}

export default function PriceChart({
  prices,
}: PriceChartProps) {

  const data = prices.map((price, index) => ({
    time: new Date(
      Date.now() - (prices.length - index) * 3000
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    price,
  }));

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

  return (
    <div className="bg-gray-900 px-4 py-3 rounded-xl border border-gray-800">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-2">

        <h3 className="text-base font-semibold">
          Live Price
        </h3>

        {latestPrice !== null && (
          <span
            className={`text-sm font-bold ${
              isUp
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {latestPrice.toFixed(2)}
          </span>
        )}

      </div>

      {/* CHART */}
      <div className="h-[160px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#263142"
              vertical={false}
            />

            <XAxis
              dataKey="time"
              stroke="#6B7280"
              tick={{
                fontSize: 10,
              }}
              tickLine={false}
              axisLine={false}
              minTickGap={35}
            />

            <YAxis
              stroke="#6B7280"
              domain={["auto", "auto"]}
              tick={{
                fontSize: 10,
              }}
              tickLine={false}
              axisLine={false}
              width={58}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{
                color: "#9CA3AF",
              }}
            />

            <Line
              type="monotone"
              dataKey="price"
              stroke={
                isUp
                  ? "#22C55E"
                  : "#EF4444"
              }
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}