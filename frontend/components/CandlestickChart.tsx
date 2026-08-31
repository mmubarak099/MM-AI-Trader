"use client";

import type {
  Candle,
  SignalHistory,
  PatternHistory,
  SupportResistance,
} from "../types/market";

type ChartCandle = Candle & {
  time?: string | number | Date;
};

type Props = {
  candles: ChartCandle[];
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
  const hasTimeData =
    candles.some(
      (candle) => candle.time != null
    );

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
    ...candles.map((candle) => candle.high)
  );

  const minPrice = Math.min(
    ...candles.map((candle) => candle.low)
  );

  const maxVolume = Math.max(
    ...candles.map(
      (candle) => candle.volume ?? 0
    ),
    1
  );

  const chartHeight = 340;
  const chartTop = 20;
  const chartLeft = 55;
  const chartRight = 970;
  const chartWidth =
    chartRight - chartLeft;

  const priceLevels = 6;

  const candleSpacing =
    candles.length > 1
      ? chartWidth /
        (candles.length - 1)
      : chartWidth / 2;

  const candleBodyWidth = Math.max(
    3,
    Math.min(8, candleSpacing * 0.55)
  );

  const getX = (index: number) => {
    if (candles.length === 1) {
      return (
        chartLeft +
        chartWidth / 2
      );
    }

    return (
      chartLeft +
      index * candleSpacing
    );
  };

  const scale = (price: number) => {
    const range =
      maxPrice - minPrice;

    if (
      !Number.isFinite(range) ||
      range <= 0
    ) {
      return (
        chartTop +
        chartHeight / 2
      );
    }

    return (
      chartTop +
      ((maxPrice - price) /
        range) *
        chartHeight
    );
  };

  const ema20Points = ema20
    .map((value, index) => {
      if (index >= candles.length) {
        return null;
      }

      return `${getX(index)},${scale(
        value
      )}`;
    })
    .filter(Boolean)
    .join(" ");

  const ema50Points = ema50
    .map((value, index) => {
      if (index >= candles.length) {
        return null;
      }

      return `${getX(index)},${scale(
        value
      )}`;
    })
    .filter(Boolean)
    .join(" ");

const formatTime = (
  time: string | number | Date
) => {
    const date = new Date(time);

    if (
      Number.isNaN(date.getTime())
    ) {
      return "";
    }

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      }
    );
  };

  const timeLabelIndexes =
    hasTimeData
      ? candles.reduce<number[]>(
          (indexes, candle, index) => {
            if (candle.time == null) {
              return indexes;
            }

            const date =
              new Date(candle.time);

            if (
              Number.isNaN(
                date.getTime()
              )
            ) {
              return indexes;
            }

            const timeText =
              date.toLocaleTimeString(
                "en-IN",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                  timeZone:
                    "Asia/Kolkata",
                }
              );

            const [
              hourText,
              minuteText,
            ] = timeText.split(":");

            const hour =
              Number(hourText);
            const minute =
              Number(minuteText);

            const isMarketOpen =
              hour === 9 &&
              minute === 15;

            const isHourly =
              minute === 0;

            const isLast =
              index ===
              candles.length - 1;

            if (
              isMarketOpen ||
              isHourly ||
              isLast
            ) {
              indexes.push(index);
            }

            return indexes;
          },
          []
        )
      : [];

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-[#081321]/90 p-6 shadow-[0_12px_35px_rgba(0,0,0,0.20)]">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-blue-400">
            Market Intelligence
          </p>

          <h2 className="text-lg font-bold text-white mt-1">
            {hasTimeData
              ? "NIFTY 50 · 5 Minute · Today"
              : "Candlestick Chart"}
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
        viewBox="0 0 1000 460"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto rounded-xl border border-slate-800/80 bg-[#050b14] shadow-inner"
      >
        {Array.from({
          length: priceLevels,
        }).map((_, index) => {
          const price =
            maxPrice -
            ((maxPrice - minPrice) /
              (priceLevels - 1)) *
              index;

          const y =
            chartTop +
            (chartHeight /
              (priceLevels - 1)) *
              index;

          return (
            <g key={index}>
              <text
                x={5}
                y={y}
                fill="#9ca3af"
                fontSize="12"
              >
                {price.toFixed(2)}
              </text>

              <line
                x1={chartLeft}
                x2={chartRight}
                y1={y}
                y2={y}
                stroke="#1f2937"
                strokeWidth={1}
              />
            </g>
          );
        })}

        {levels.support.map(
          (price, index) => {
            const y =
              scale(price);

            return (
              <g
                key={`support-${index}`}
              >
                <line
                  x1={chartLeft}
                  x2={chartRight}
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
          }
        )}

        {levels.resistance.map(
          (price, index) => {
            const y =
              scale(price);

            return (
              <g
                key={`resistance-${index}`}
              >
                <line
                  x1={chartLeft}
                  x2={chartRight}
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
          }
        )}

        {ema20Points && (
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth={2}
            points={ema20Points}
          />
        )}

        {ema50Points && (
          <polyline
            fill="none"
            stroke="#f59e0b"
            strokeWidth={2}
            points={ema50Points}
          />
        )}

        {patterns.map(
          (pattern, index) => {
            const candle =
              candles[
                pattern.candleIndex
              ];

            if (!candle) {
              return null;
            }

            const x = getX(
              pattern.candleIndex
            );

            const y =
              scale(candle.high) -
              35;

            let icon = "";

            switch (
              pattern.type
            ) {
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
          }
        )}

        {signals
          .filter(
            (signal) =>
              signal.action !==
                "WAIT" &&
              signal.confidence >=
                90
          )
          .map((signal) => {
            const candle =
              candles[
                signal.candleIndex
              ];

            if (!candle) {
              return null;
            }

            const x = getX(
              signal.candleIndex
            );

            const y =
              scale(candle.high) -
              15;

            return (
              <text
                key={
                  signal.candleIndex
                }
                x={x}
                y={y}
                textAnchor="middle"
                fontSize="18"
              >
                {signal.action ===
                "BUY"
                  ? "🟢"
                  : "🔴"}
              </text>
            );
          })}

        {candles.map(
          (candle, index) => {
            const x =
              getX(index);

            const openY =
              scale(candle.open);

            const closeY =
              scale(candle.close);

            const bodyTop =
              Math.min(
                openY,
                closeY
              );

            const bodyHeight =
              Math.max(
                Math.abs(
                  openY - closeY
                ),
                2
              );

            const bullish =
              candle.close >=
              candle.open;

            return (
              <g key={index}>
                <line
                  x1={x}
                  x2={x}
                  y1={scale(
                    candle.high
                  )}
                  y2={scale(
                    candle.low
                  )}
                  stroke="white"
                  strokeWidth={1}
                />

                <rect
                  x={
                    x -
                    candleBodyWidth /
                      2
                  }
                  y={bodyTop}
                  width={
                    candleBodyWidth
                  }
                  height={
                    bodyHeight
                  }
                  fill={
                    bullish
                      ? "#22c55e"
                      : "#ef4444"
                  }
                />
              </g>
            );
          }
        )}

        {candles.map(
          (candle, index) => {
            const x =
              getX(index);

            const volume =
              candle.volume ?? 0;

            const barHeight =
              (volume /
                maxVolume) *
              55;

            const safeBarHeight =
              Number.isFinite(
                barHeight
              )
                ? barHeight
                : 0;

            const y =
              415 -
              safeBarHeight;

            return (
              <rect
                key={`volume-${index}`}
                x={
                  x -
                  candleBodyWidth /
                    2
                }
                y={y}
                width={
                  candleBodyWidth
                }
                height={
                  safeBarHeight
                }
                fill={
                  candle.close >=
                  candle.open
                    ? "#22c55e"
                    : "#ef4444"
                }
                opacity={0.6}
              />
            );
          }
        )}

        {timeLabelIndexes.map(
          (index) => {
            const candle =
              candles[index];

            if (
              candle?.time == null
            ) {
              return null;
            }

            const x =
              getX(index);

            const label =
              formatTime(
                candle.time
              );

            if (!label) {
              return null;
            }

            return (
              <g
                key={`time-${index}`}
              >
                <line
                  x1={x}
                  x2={x}
                  y1={420}
                  y2={426}
                  stroke="#64748b"
                  strokeWidth={1}
                />

                <text
                  x={x}
                  y={443}
                  fill="#94a3b8"
                  fontSize="11"
                  textAnchor="middle"
                >
                  {label}
                </text>
              </g>
            );
          }
        )}
      </svg>
    </div>
  );
}