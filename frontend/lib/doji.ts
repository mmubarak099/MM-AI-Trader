type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
};


export function detectDoji(
  candle: Candle
) {

  const body =
    Math.abs(
      candle.close - candle.open
    );

  const range =
    candle.high - candle.low;


  if (range === 0) {
    return false;
  }


  const bodyPercentage =
    body / range;


  return bodyPercentage <= 0.1;
}