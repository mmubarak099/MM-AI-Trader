type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
};

export function detectBullishEngulfing(
  previousCandle: Candle,
  currentCandle: Candle
) {
  const previousBearish =
  previousCandle.close < previousCandle.open;

  const currentBullish =
  currentCandle.close > currentCandle.open;

  const bodyEngulfed =
  currentCandle.open <= previousCandle.close &&
  currentCandle.close > previousCandle.open;

return (
  previousBearish &&
  currentBullish &&
  bodyEngulfed
);
}