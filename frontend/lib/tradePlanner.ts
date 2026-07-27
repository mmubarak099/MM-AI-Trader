import type { Trade } from "../types/trade";

export type TradePlan = {
  action: string;

  entry: number;

  stopLoss: number;

  target1: number;

  target2: number;

  riskReward: string;

  urgency: string;
};

export function createTradePlan(
  action: string,
  price: number,
  confidence: number
): Trade {

  if (action === "BUY") {

    const entry = price;

    const stopLoss = Number(
      (price - 40).toFixed(2)
    );

    const target1 = Number(
      (price + 60).toFixed(2)
    );

    const target2 = Number(
      (price + 120).toFixed(2)
    );

return {

  id: crypto.randomUUID(),

  action: "BUY",

  entry,

  stopLoss,

  target1,

  target2,

  currentPrice: entry,

  pnl: 0,

  confidence,

  urgency:
    confidence >= 90
      ? "HIGH"
      : "MEDIUM",

  openedAt: new Date(),

  status: "PENDING",

  result: "NONE",

};

  }

  if (action === "SELL") {

    const entry = price;

    const stopLoss = Number(
      (price + 40).toFixed(2)
    );

    const target1 = Number(
      (price - 60).toFixed(2)
    );

    const target2 = Number(
      (price - 120).toFixed(2)
    );

  return {

  id: crypto.randomUUID(),

  action: "SELL",

  entry,

  stopLoss,

  target1,

  target2,

  currentPrice: entry,

  pnl: 0,

  confidence,

  urgency:
    confidence >= 90
      ? "HIGH"
      : "MEDIUM",

  openedAt: new Date(),

  status: "PENDING",

  result: "NONE",

};

  }

 return {

  id: crypto.randomUUID(),

  action: "BUY",

  entry: price,

  stopLoss: price,

  target1: price,

  target2: price,

  currentPrice: price,

  pnl: 0,

  confidence,

  urgency: "LOW",

  openedAt: new Date(),

  status: "PENDING",

  result: "NONE",

};

}