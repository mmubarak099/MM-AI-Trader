"use client";

type Signal = {
  action: string;
  confidence: number;
  pattern: string;
  candleIndex: number;
};

type Props = {
  candles: Candle[];
  ema20: number[];
  ema50: number[];
  signals: Signal[];
};

export default function CandlestickChart({
  candles,
  ema20,
  ema50,
  signals,
}: Props) {

    const maxPrice = Math.max(
  ...candles.map(c => c.high)
);

const minPrice = Math.min(
  ...candles.map(c => c.low)
);

const chartHeight = 380;

const priceLevels = 6;

const scale = (price: number) =>
  ((maxPrice - price) /
    (maxPrice - minPrice)) *
  chartHeight + 20;

  const ema20Points = ema20
  .map((value, index) => {
    const x = index * 18 + 30;
    const y = scale(value);

    return `${x},${y}`;
  })
  .join(" ");

  const ema50Points = ema50
  .map((value, index) => {
    const x = index * 18 + 30;
    const y = scale(value);

    return `${x},${y}`;
  })
  .join(" ");

return (
  <div className="bg-gray-900 rounded-xl p-6">
    <h2 className="text-2xl font-bold mb-4">
      Candlestick Chart
    </h2>

    <svg
      width="100%"
      height="450"
      viewBox="0 0 1000 450"
      className="bg-gray-950 rounded-lg"
    >
    {Array.from({ length: priceLevels }).map((_, i) => {

  const price =
    maxPrice -
    ((maxPrice - minPrice) /
      (priceLevels - 1)) * i;

  const y =
    20 +
    (chartHeight / (priceLevels - 1)) * i;

  return (
    <g key={i}>

      <text
        x={5}
        y={y}
        fill="#9ca3af"
        fontSize="12"
      >
        {price.toFixed(2)}
      </text>

      <line
        x1={45}
        x2={980}
        y1={y}
        y2={y}
        stroke="#1f2937"
        strokeWidth={1}
      />

    </g>
  );

})}

<polyline
  fill="none"
  stroke="#3b82f6"
  strokeWidth={2}
  points={ema20Points}
/>
<polyline
  fill="none"
  stroke="#f59e0b"
  strokeWidth={2}
  points={ema50Points}
/>

{/* AI BUY / SELL MARKERS */}

{signals
  .filter(
    signal =>
      signal.action !== "WAIT" &&
      signal.confidence >= 90
  )
  .map(signal => {

    const x =
      signal.candleIndex * 18 + 30;

    const candle =
      candles[signal.candleIndex];

    if (!candle) return null;

    const y =
      scale(candle.high) - 15;

    return (
      <text
        key={signal.candleIndex}
        x={x}
        y={y}
        textAnchor="middle"
        fontSize="18"
      >
        {signal.action === "BUY"
          ? "🟢"
          : "🔴"}
      </text>
    );

  })}

      {candles.map((candle, index) => {

        const x = index * 18 + 30;

        const openY = scale(candle.open);
const closeY = scale(candle.close);

const bodyTop = Math.min(openY, closeY);
const bodyHeight = Math.max(
  Math.abs(openY - closeY),
  2
);

const bullish = candle.close >= candle.open;

return (
  <g key={index}>

    <line
      x1={x}
      x2={x}
      y1={scale(candle.high)}
      y2={scale(candle.low)}
      stroke="white"
      strokeWidth={1}
    />

    <rect
      x={x - 4}
      y={bodyTop}
      width={8}
      height={bodyHeight}
      fill={bullish ? "#22c55e" : "#ef4444"}
    />

  </g>
);  

      })}

    </svg>
    
  </div>
);
}