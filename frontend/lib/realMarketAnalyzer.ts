import {
  calculateRSI,
  calculateEMA,
  calculateMACD,
  getTrend,
} from "./indicators";

import { analyzePattern } from "./patternAnalyzer";

import { calculateSupportResistance } from "./supportResistance";

import { detectMarketStructure } from "./marketStructure";

import { detectBreakout } from "./breakoutDetector";


type RealCandle = {
  open: number;
  high: number;
  low: number;
  close: number;
};


export function analyzeRealTimeframe(
  candles: RealCandle[],
  currentPrice: number
) {

  if (candles.length < 50) {
    return null;
  }


  const closePrices =
    candles.map(
      (candle) => candle.close
    );


  const rsi =
    calculateRSI(closePrices);

  const ema20 =
    calculateEMA(
      closePrices,
      20
    );

  const ema50 =
    calculateEMA(
      closePrices,
      50
    );

  const macd =
    calculateMACD(
      closePrices
    );


  const levels =
    calculateSupportResistance(
      candles
    );


  const previousCandle =
    candles[
      candles.length - 2
    ];

  const currentCandle =
    candles[
      candles.length - 1
    ];


  const pattern =
    analyzePattern(
      previousCandle,
      currentCandle
    );


  const marketStructure =
    detectMarketStructure(
      closePrices
    );


  const breakout =
    detectBreakout(
      currentPrice,
      levels.resistance,
      levels.support
    );


  const trend =
    getTrend(
      currentPrice,
      ema20
    );


  return {
    rsi,

    ema20,
    ema50,

    macd,

    support:
      levels.support,

    resistance:
      levels.resistance,

    pattern,

    marketStructure,

    breakout,

    trend,

    latestClose:
      currentCandle.close,
  };
}