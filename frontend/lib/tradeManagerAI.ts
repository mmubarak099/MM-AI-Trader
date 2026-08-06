export interface TradeManagementInput {
  action: "BUY" | "SELL";

  currentPrice: number;

  entry: number;

  stopLoss: number;

  target1: number;

  target2: number;

  rsi: number;

  ema20: number;

  ema50: number;

  macd: number;

  trend: string;

  breakout: boolean;

  volumeStrength: number;

  marketStructure: string;

  pnl: number;

  target1Hit: boolean;
}

export interface TradeManagementDecision {

  recommendation:
    | "HOLD"
    | "MOVE_TO_BREAK_EVEN"
    | "TRAIL_STOP"
    | "BOOK_PARTIAL"
    | "EXIT";

  confidence: number;

  reasons: string[];
}

export function manageTrade(
  input: TradeManagementInput
): TradeManagementDecision {

  const reasons: string[] = [];

  let confidence = 50;

//--------------------------------------------------
// Trend
//--------------------------------------------------

if (input.action === "BUY") {

  if (input.trend === "Bullish") {

    confidence += 10;

    reasons.push("Bullish trend supports BUY");

  }

  else if (input.trend === "Bearish") {

    confidence -= 15;

    reasons.push("Trend turning bearish");

  }

}

else {

  if (input.trend === "Bearish") {

    confidence += 10;

    reasons.push("Bearish trend supports SELL");

  }

  else if (input.trend === "Bullish") {

    confidence -= 15;

    reasons.push("Trend turning bullish");

  }

}

//--------------------------------------------------
// EMA
//--------------------------------------------------

if (input.action === "BUY") {

  if (input.ema20 > input.ema50) {

    confidence += 10;

    reasons.push("EMA confirms BUY trend");

  }

  else {

    confidence -= 10;

    reasons.push("EMA weakening BUY");

  }

}

else {

  if (input.ema20 < input.ema50) {

    confidence += 10;

    reasons.push("EMA confirms SELL trend");

  }

  else {

    confidence -= 10;

    reasons.push("EMA weakening SELL");

  }

}

//--------------------------------------------------
// RSI
//--------------------------------------------------

if (input.action === "BUY") {

  if (input.rsi >= 55 && input.rsi <= 70) {

    confidence += 8;

    reasons.push("Healthy BUY momentum");

  }

  else if (input.rsi > 75) {

    confidence -= 8;

    reasons.push("BUY becoming overbought");

  }

  else if (input.rsi < 45) {

    confidence -= 10;

    reasons.push("Weak BUY momentum");

  }

}

else {

  if (input.rsi <= 45 && input.rsi >= 30) {

    confidence += 8;

    reasons.push("Healthy SELL momentum");

  }

  else if (input.rsi < 25) {

    confidence -= 8;

    reasons.push("SELL becoming oversold");

  }

  else if (input.rsi > 55) {

    confidence -= 10;

    reasons.push("Weak SELL momentum");

  }

}

//--------------------------------------------------
// MACD
//--------------------------------------------------

if (input.action === "BUY") {

  if (input.macd > 0) {

    confidence += 10;

    reasons.push("Bullish MACD");

  }

  else {

    confidence -= 12;

    reasons.push("Bearish MACD");

  }

}

else {

  if (input.macd < 0) {

    confidence += 10;

    reasons.push("Bearish MACD");

  }

  else {

    confidence -= 12;

    reasons.push("Bullish MACD against SELL");

  }

}

//--------------------------------------------------
// Breakout
//--------------------------------------------------

if (input.breakout) {

  confidence += 10;

  reasons.push("Price breakout confirmed");

}

else {

  confidence -= 5;

  reasons.push("No breakout confirmation");

}

//--------------------------------------------------
// Volume
//--------------------------------------------------

if (input.volumeStrength >= 70) {

  confidence += 10;

  reasons.push("Strong volume confirmation");

}

else if (input.volumeStrength >= 50) {

  confidence += 5;

  reasons.push("Average volume");

}

else {

  confidence -= 10;

  reasons.push("Weak volume");

}

//--------------------------------------------------
// Market Structure
//--------------------------------------------------

if (input.action === "BUY") {

  if (input.marketStructure === "UPTREND") {

    confidence += 15;

    reasons.push("Bullish market structure");

  }

  else if (input.marketStructure === "SIDEWAYS") {

    confidence -= 5;

    reasons.push("Sideways market");

  }

  else {

    confidence -= 20;

    reasons.push("Bearish market structure");

  }

}

else {

  if (input.marketStructure === "DOWNTREND") {

    confidence += 15;

    reasons.push("Bearish market structure");

  }

  else if (input.marketStructure === "SIDEWAYS") {

    confidence -= 5;

    reasons.push("Sideways market");

  }

  else {

    confidence -= 20;

    reasons.push("Bullish market structure");

  }

}

//--------------------------------------------------
// Recommendation
//--------------------------------------------------

let recommendation:
TradeManagementDecision["recommendation"] =
"HOLD";

const stopDistance = Math.abs(
  input.currentPrice - input.stopLoss
);

// Move SL to Entry only after decent profit
if (
  !input.target1Hit &&
  input.pnl >= 20 &&
  confidence >= 75
) {

  recommendation = "MOVE_TO_BREAK_EVEN";

  reasons.push("Protect capital");

}

// After Target 1, trail only if trend is still healthy
else if (
  input.target1Hit &&
  confidence >= 70 &&
  input.ema20 > input.ema50 &&
  input.macd > 0
) {

  recommendation = "TRAIL_STOP";

  reasons.push("Trend remains strong");

}

// If Target 1 is hit but momentum weakens
else if (
  input.target1Hit &&
  confidence < 60
) {

  recommendation = "BOOK_PARTIAL";

  reasons.push("Momentum is weakening");

}

// Exit only when the trade is actually failing
else if (
  stopDistance <= 3
) {

  recommendation = "EXIT";

  reasons.push("Price is very close to Stop Loss");

}

else if (
  input.action === "BUY" &&
  input.trend === "Bearish" &&
  input.ema20 < input.ema50 &&
  input.macd < 0
) {

  recommendation = "EXIT";

  reasons.push("Bullish trend has reversed");

}

else if (
  input.action === "SELL" &&
  input.trend === "Bullish" &&
  input.ema20 > input.ema50 &&
  input.macd > 0
) {

  recommendation = "EXIT";

  reasons.push("Bearish trend has reversed");

}

return {

  recommendation,

  confidence,

  reasons,

};

}