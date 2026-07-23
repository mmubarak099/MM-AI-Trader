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



  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">

      <h3 className="text-xl font-bold mb-4">
        Live Price Chart
      </h3>

      <ResponsiveContainer width="100%" height={320}>

        <LineChart data={data}>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#333"
          />

          <XAxis
            dataKey="time"
            stroke="#999"
          />

          <YAxis
            stroke="#999"
            domain={["auto", "auto"]}
          />

          <Tooltip />

          <Line
  type="monotone"
  dataKey="price"
  stroke={
    prices[prices.length - 1] >= prices[0]
      ? "#22C55E"
      : "#EF4444"
  }
  strokeWidth={3}
  dot={false}
/>

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}