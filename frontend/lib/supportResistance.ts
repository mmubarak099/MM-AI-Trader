export function calculateSupportResistance(
  candles: {
    high: number;
    low: number;
  }[]
) {
  const support: number[] = [];
  const resistance: number[] = [];

  if (candles.length < 7) {
    return { support, resistance };
  }

  for (let i = 2; i < candles.length - 2; i++) {

    const current = candles[i];

    // Swing High
    if (
      current.high > candles[i - 1].high &&
      current.high > candles[i - 2].high &&
      current.high > candles[i + 1].high &&
      current.high > candles[i + 2].high
    ) {
      resistance.push(current.high);
    }

    // Swing Low
    if (
      current.low < candles[i - 1].low &&
      current.low < candles[i - 2].low &&
      current.low < candles[i + 1].low &&
      current.low < candles[i + 2].low
    ) {
      support.push(current.low);
    }
  }

  return {
    support: support.slice(-2),
    resistance: resistance.slice(-2),
  };
}