"use client";

import type {
  Candle,
  SignalHistory,
  PatternHistory,
  SupportResistance,
} from "../types/market";

type Props = {
  candles: Candle[];
  ema20: number[];
  ema50: number[];
  signals: SignalHistory[];

patterns: PatternHistory[];

levels: SupportResistance;
};

export default function CandlestickChart({
  candles,
  ema20,
  ema50,
  signals,
  patterns,
  levels,
}: Props) {

  if (candles.length === 0) {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-[#081321]/90 p-6 shadow-[0_12px_35px_rgba(0,0,0,0.20)]">
<div className="flex items-center justify-between mb-5">
  <div>
    <p className="text-[10px] uppercase tracking-[0.18em] text-blue-400">
      Market Intelligence
    </p>

    <h2 className="text-lg font-bold text-white mt-1">
      Candlestick Chart
    </h2>
  </div>

  <div className="flex items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-900/70 px-3 py-1.5">
    <span className="w-2 h-2 rounded-full bg-amber-400" />
    <span className="text-[10px] uppercase tracking-wider text-slate-400">
      Waiting
    </span>
  </div>
</div>

      <p className="text-gray-400">
        Waiting for market data...
      </p>
    </div>
  );
}
    const maxPrice = Math.max(
  ...candles.map(c => c.high)
);

const minPrice = Math.min(
  ...candles.map(c => c.low)
);
console.log("Max Price:", maxPrice);
console.log("Min Price:", minPrice);
console.log("Candles:", candles.length);

const maxVolume = Math.max(
  ...candles.map(c => c.volume ?? 0),
  1
);


const chartHeight = 380;

const priceLevels = 6;

const scale = (price: number) => {

  const range = maxPrice - minPrice;

  if (!Number.isFinite(range) || range <= 0) {
    return chartHeight / 2;
  }

  return (
    ((maxPrice - price) / range) *
      chartHeight +
    20
  );

};

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
  <div className="rounded-2xl border border-slate-800/80 bg-[#081321]/90 p-6 shadow-[0_12px_35px_rgba(0,0,0,0.20)]">
<div className="flex items-center justify-between mb-5">

  <div>
    <p className="text-[10px] uppercase tracking-[0.18em] text-blue-400">
      Market Intelligence
    </p>

    <h2 className="text-lg font-bold text-white mt-1">
      Candlestick Chart
    </h2>
  </div>

  <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

    <span className="text-[10px] uppercase tracking-wider text-emerald-300">
      Data Active
    </span>
  </div>

</div>

<svg
  viewBox="0 0 1000 450"
  preserveAspectRatio="xMidYMid meet"
  className="w-full h-auto rounded-xl border border-slate-800/80 bg-[#050b14] shadow-inner"
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

{/* SUPPORT LEVELS */}

{levels.support.map((price, index) => {

  const y = scale(price);

  return (

    <g key={`support-${index}`}>

      <line
        x1={45}
        x2={980}
        y1={y}
        y2={y}
        stroke="#22c55e"
        strokeWidth={1.5}
        strokeDasharray="6 4"
      />

      <text
        x={985}
        y={y - 4}
        fill="#22c55e"
        fontSize="12"
        textAnchor="end"
      >
        S {price.toFixed(2)}
      </text>

    </g>

  );

})}

{/* RESISTANCE LEVELS */}

{levels.resistance.map((price, index) => {

  const y = scale(price);

  return (

    <g key={`resistance-${index}`}>

      <line
        x1={45}
        x2={980}
        y1={y}
        y2={y}
        stroke="#ef4444"
        strokeWidth={1.5}
        strokeDasharray="6 4"
      />

      <text
        x={985}
        y={y - 4}
        fill="#ef4444"
        fontSize="12"
        textAnchor="end"
      >
        R {price.toFixed(2)}
      </text>

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

{/* PATTERN MARKERS */}

{patterns.map((pattern, index) => {

  const candle = candles[pattern.candleIndex];

  if (!candle) return null;

  const x = pattern.candleIndex * 18 + 30;
  const y = scale(candle.high) - 35;

  let icon = "";

  switch (pattern.type) {

    case "Bullish Engulfing":
      icon = "🟢";
      break;

    case "Bearish Engulfing":
      icon = "🔴";
      break;

    case "Hammer":
      icon = "🔨";
      break;

    case "Doji":
      icon = "⭐";
      break;

    default:
      return null;
  }

  return (
    <text
      key={index}
      x={x}
      y={y}
      textAnchor="middle"
      fontSize="16"
    >
      {icon}
    </text>
  );

})}

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

{/* VOLUME BARS */}

{candles.map((candle, index) => {


  const x = index * 18 + 30;

const volume = candle.volume ?? 0;

const barHeight =
  (volume / maxVolume) * 70;

 const safeBarHeight = Number.isFinite(barHeight)
  ? barHeight
  : 0;

const y = Math.max(
  360,
  430 - safeBarHeight
);


return (

    <rect
      key={`volume-${index}`}
      x={x - 4}
      y={y}
      width={8}
      height={safeBarHeight}
      fill={
        candle.close >= candle.open
          ? "#22c55e"
          : "#ef4444"
      }
      opacity={0.6}
    />

  );

})}

    </svg>
    
  </div>
);
}