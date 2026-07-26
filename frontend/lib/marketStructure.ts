export function detectMarketStructure(
  prices: number[]
): "UPTREND" | "DOWNTREND" | "SIDEWAYS" {

  if (prices.length < 20) {
    return "SIDEWAYS";
  }

  const recent = prices.slice(-20);

  const first = recent[0];
  const last = recent[recent.length - 1];

  const change = ((last - first) / first) * 100;

  if (change > 0.8) {
    return "UPTREND";
  }

  if (change < -0.8) {
    return "DOWNTREND";
  }

  return "SIDEWAYS";
}