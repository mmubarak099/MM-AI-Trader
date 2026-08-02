  import type { Trade } from "../types/trade";

  export function createTradePlan(
    action: string,
    price: number,
    confidence: number
  ): Trade | null {

    if (
      action !== "BUY" &&
      action !== "SELL"
    ) {
      return null;
    }

    const isBuy = action === "BUY";

return {

  id: crypto.randomUUID(),

  action,

  entry: price,

  currentPrice: price,

  stopLoss: Number(
    (
      isBuy
        ? price - 20
        : price + 20
    ).toFixed(2)
  ),

  target1: Number(
    (
      isBuy
        ? price + 30
        : price - 30
    ).toFixed(2)
  ),

  target2: Number(
    (
      isBuy
        ? price + 60
        : price - 60
    ).toFixed(2) 
  ),

  pnl: 0,
realizedPnL: 0,
unrealizedPnL: 0,

  confidence,

  urgency:
    confidence >= 90
      ? "HIGH"
      : confidence >= 75
      ? "MEDIUM"
      : "LOW",

  status: "PENDING",

  result: "NONE",

  target1Hit: false,

  target2Hit: false,

  partialProfitBooked: false,

  remainingPosition: 100,

  // NEW
  highestPrice: price,

  // NEW
  lowestPrice: price,

  // NEW
  trailingStopEnabled: false,

  // NEW
  riskRewardRatio: 1.5,

  events: [
    {
      id: crypto.randomUUID(),
      type: "TRADE_CREATED",
      timestamp: new Date(),
      price,
      description: `${action} trade plan created`,
    },
  ],

};

  }