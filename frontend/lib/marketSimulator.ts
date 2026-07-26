import type { Candle } from "../types/market";

export function generateMarketPrice(
  basePrice: number
) {

  const movement =
    (Math.random() - 0.5) * 50;

    const randomPattern = Math.random();


  const newPrice =
    basePrice + movement;

    const candle: Candle = {

  open: basePrice,

  close: Number(newPrice.toFixed(2)),

  high: Number(
    Math.max(basePrice, newPrice) +
      Math.random() * 10
  ),

  low: Number(
    Math.min(basePrice, newPrice) -
      Math.random() * 10
  ),

  volume:
    Math.floor(Math.random() * 900) + 100,

};

// Occasionally generate a Hammer candle (about 5% of the time)
if (randomPattern < 0.05) {

  candle.open = basePrice;

  candle.close = basePrice + 2;

  candle.high = candle.close + 1;

  candle.low = basePrice - 20;

}

  const change =
    ((newPrice - basePrice) / basePrice) * 100;


  return {

  price: Number(newPrice.toFixed(2)),

  change: Number(change.toFixed(2)),

  candle,

};

}