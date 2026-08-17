import type { Candle } from "../types/market";

// ==========================================
// Persistent Simulated Market Regime
// ==========================================

type SimulatedRegime =
  | "TRENDING_BULLISH"
  | "TRENDING_BEARISH"
  | "RANGING";

let currentRegime: SimulatedRegime = "RANGING";

let regimeTicksRemaining = 0;


// ==========================================
// Generate Market Price
// ==========================================

export function generateMarketPrice(
  basePrice: number
) {

  // ----------------------------------
  // Choose a new regime only when the
  // previous simulated regime expires.
  // ----------------------------------

  if (regimeTicksRemaining <= 0) {

    const roll = Math.random();

    if (roll < 0.40) {

      currentRegime = "TRENDING_BULLISH";

    }
    else if (roll < 0.80) {

      currentRegime = "TRENDING_BEARISH";

    }
    else {

      currentRegime = "RANGING";

    }

    // Keep the same regime for several candles.
    regimeTicksRemaining =
      Math.floor(Math.random() * 15) + 15;

    console.log(
      "🌐 SIMULATED MARKET REGIME:",
      currentRegime,
      "for",
      regimeTicksRemaining,
      "candles"
    );
  }

  regimeTicksRemaining--;

  // ----------------------------------
  // Regime-based movement
  // ----------------------------------

  let movement = 0;

  if (currentRegime === "TRENDING_BULLISH") {

    movement =
      1.2 +
      (Math.random() - 0.5) * 4;

  }

  else if (currentRegime === "TRENDING_BEARISH") {

    movement =
      -1.2 +
      (Math.random() - 0.5) * 4;

  }

  else {

    movement =
      (Math.random() - 0.5) * 5;

  }

  // ----------------------------------
  // Occasional stronger movement
  // ----------------------------------

  const momentumChance = Math.random();

  if (momentumChance < 0.10) {

    movement *= 2.5;

  }

  // ----------------------------------
  // New price
  // ----------------------------------

  const newPrice = Number(
    (basePrice + movement).toFixed(2)
  );

  // ----------------------------------
  // Candle
  // ----------------------------------

  const candle: Candle = {

    open: Number(
      basePrice.toFixed(2)
    ),

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
      Math.floor(
        Math.random() * 600
      ) + 400,

  };

  // ----------------------------------
  // Occasionally generate Hammer
  // ----------------------------------

  const randomPattern = Math.random();

  if (randomPattern < 0.04) {

    candle.open =
      Number(
        basePrice.toFixed(2)
      );

    candle.close =
      Number(
        (basePrice + 1.5).toFixed(2)
      );

    candle.high =
      Number(
        (candle.close + 0.8).toFixed(2)
      );

    candle.low =
      Number(
        (basePrice - 6).toFixed(2)
      );

  }

  // ----------------------------------
  // Percentage change
  // ----------------------------------

  const change = Number(
    (
      ((newPrice - basePrice) /
        basePrice) *
      100
    ).toFixed(2)
  );

  return {

    price: newPrice,

    change,

    candle,

  };

}