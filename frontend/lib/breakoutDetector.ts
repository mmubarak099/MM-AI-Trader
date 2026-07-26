export function detectBreakout(
  price: number,
  resistance: number[],
  support: number[]
) {
  const highestResistance =
    resistance.length > 0
      ? Math.max(...resistance)
      : null;

  const lowestSupport =
    support.length > 0
      ? Math.min(...support)
      : null;

  if (
    highestResistance !== null &&
    price > highestResistance + 5
  ) {
    return "BREAKOUT";
  }

  if (
    lowestSupport !== null &&
    price < lowestSupport - 5
  ) {
    return "BREAKDOWN";
  }

  return "NONE";
}