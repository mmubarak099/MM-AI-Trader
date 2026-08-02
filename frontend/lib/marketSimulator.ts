import type { Candle } from "../types/market";

export function generateMarketPrice(
  basePrice: number
) {
  // ----------------------------------
  // Realistic Price Movement
  // ----------------------------------

  let movement = (Math.random() - 0.5) * 8;

  // Occasionally create stronger momentum candles
  const momentumChance = Math.random();

  if (momentumChance < 0.10) {
    movement *= 2.5;
  }

  const newPrice = Number(
    (basePrice + movement).toFixed(2)
  );

  // ----------------------------------
  // Candle Creation
  // ----------------------------------

  const candle: Candle = {
    open: Number(basePrice.toFixed(2)),

    close: newPrice,

    high: Number(
      (
        Math.max(basePrice, newPrice) +
        Math.random() * 2
      ).toFixed(2)
    ),

    low: Number(
      (
        Math.min(basePrice, newPrice) -
        Math.random() * 2
      ).toFixed(2)
    ),

    volume:
      Math.floor(Math.random() * 600) + 400,
  };

  // ----------------------------------
  // Occasionally Generate Hammer
  // ----------------------------------

  const randomPattern = Math.random();

  if (randomPattern < 0.04) {
    candle.open = Number(basePrice.toFixed(2));

    candle.close = Number(
      (basePrice + 1.5).toFixed(2)
    );

    candle.high = Number(
      (candle.close + 0.8).toFixed(2)
    );

    candle.low = Number(
      (basePrice - 6).toFixed(2)
    );
  }

  // ----------------------------------
  // Percentage Change
  // ----------------------------------

  const change = Number(
    (
      ((newPrice - basePrice) / basePrice) *
      100
    ).toFixed(2)
  );

  return {
    price: newPrice,

    change,

    candle,
  };
}