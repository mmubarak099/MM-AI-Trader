type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
};

export function detectBearishEngulfing(
  previousCandle: Candle,
  currentCandle: Candle
) {
  const previousBullish =
    previousCandle.close > previousCandle.open;

  const currentBearish =
    currentCandle.close < currentCandle.open;

  const bodyEngulfed =
    currentCandle.open > previousCandle.close &&
    currentCandle.close < previousCandle.open;

  return (
    previousBullish &&
    currentBearish &&
    bodyEngulfed
  );
}  