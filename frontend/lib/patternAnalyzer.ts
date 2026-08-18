import { detectBullishEngulfing } from "./candlestick";
import { detectBearishEngulfing } from "./bearishEngulfing";
import { detectHammer } from "./hammer";
import { detectDoji } from "./doji";

type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
};

export function analyzePattern(
  previousCandle: Candle,
  currentCandle: Candle
) {
  if (
    detectBullishEngulfing(
      previousCandle,
      currentCandle
    )
  ) {
    return "Bullish Engulfing";
  }

  if (
    detectBearishEngulfing(
      previousCandle,
      currentCandle
    )
  ) {
    console.log(
      "🔥 Bearish Engulfing detected"
    );

    return "Bearish Engulfing";
  }

  if (
    detectHammer(currentCandle)
  ) {
    console.log(
      "🔨 Hammer detected"
    );

    return "Hammer";
  }

  if (
    detectDoji(currentCandle)
  ) {
    console.log(
      "⚖️ Doji detected"
    );

    return "Doji";
  }

  return "No Pattern";
}