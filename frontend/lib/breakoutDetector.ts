export function detectBreakout(
  price: number,
  resistance: number[],
  support: number[]
) {

  // Nearest resistance zone.
  // We care about the first meaningful resistance
  // that price needs to clear, not the furthest one.
  const nearestResistance =
    resistance.length > 0
      ? Math.min(...resistance)
      : null;

  // Nearest support zone.
  // We care about the first meaningful support
  // that price needs to lose, not the furthest one.
  const nearestSupport =
    support.length > 0
      ? Math.max(...support)
      : null;

  // Keep the existing 5-point confirmation buffer
  // for now so normal price noise is not classified
  // as a breakout.
  const breakoutBuffer = 5;

  if (
    nearestResistance !== null &&
    price > nearestResistance + breakoutBuffer
  ) {
    return "BREAKOUT";
  }

  if (
    nearestSupport !== null &&
    price < nearestSupport - breakoutBuffer
  ) {
    return "BREAKDOWN";
  }

  return "NONE";
}