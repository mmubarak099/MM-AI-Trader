type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
};

export function detectHammer(candle: Candle) {
  const body =
    Math.abs(candle.close - candle.open);

  const lowerShadow =
    Math.min(candle.open, candle.close) -
    candle.low;

  const upperShadow =
    candle.high -
    Math.max(candle.open, candle.close);

  return (
    lowerShadow >= body * 2 &&
    upperShadow <= body * 0.5
  );
}