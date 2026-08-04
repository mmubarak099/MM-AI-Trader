const SIGNAL_WEIGHTS = {

  TREND: 10,

  EMA_ALIGNMENT: 10,

  RSI: 10,

  MACD: 10,

  BREAKOUT: 15,

  VOLUME: 10,

  MARKET_STRUCTURE: 10,

  SUPPORT_RESISTANCE: 15,

};
export interface SignalValidation {

  isValid: boolean;

  score: number;

  reasons: string[];

}

export interface SignalValidationInput {

  trend: string;

  rsi: number;

  ema20: number;

  ema50: number;

  macd: number;

  vwap: number;

  pattern: string;

  breakout: boolean;

  volumeStrength: number;

  support: number;

  resistance: number;

  marketStructure: string;

  price: number;

}

export function validateSignal(
  input: SignalValidationInput
): SignalValidation {

  let score = 50;

  const reasons: string[] = [];

  //--------------------------------------------------
// Trend Validation
//--------------------------------------------------

if (input.trend === "Bullish") {

  score += SIGNAL_WEIGHTS.TREND;

  reasons.push("Bullish trend");

}

else if (input.trend === "Bearish") {

  score += SIGNAL_WEIGHTS.TREND;

  reasons.push("Bearish trend");

}

else {

  score -= SIGNAL_WEIGHTS.TREND;

  reasons.push("Sideways market");

}

//--------------------------------------------------
// EMA Alignment
//--------------------------------------------------

if (input.ema20 > input.ema50) {

  score += SIGNAL_WEIGHTS.EMA_ALIGNMENT;

  reasons.push("EMA Bullish");

} else {

  score -= SIGNAL_WEIGHTS.EMA_ALIGNMENT;

  reasons.push("EMA Bearish");

}

//--------------------------------------------------
// RSI Validation
//--------------------------------------------------

if (input.rsi >= 45 && input.rsi <= 70) {

  score += SIGNAL_WEIGHTS.RSI;

  reasons.push("Healthy RSI");

}
else if (input.rsi > 70) {

  score -= SIGNAL_WEIGHTS.RSI;

  reasons.push("Overbought");

}
else if (input.rsi < 30) {

  score -= SIGNAL_WEIGHTS.RSI;

  reasons.push("Oversold");

}
else {

  reasons.push("Neutral RSI");

}

//--------------------------------------------------
// MACD Validation
//--------------------------------------------------

if (input.macd > 0) {

  score += SIGNAL_WEIGHTS.MACD;

  reasons.push("Positive MACD");

}
else {

  score -= SIGNAL_WEIGHTS.MACD;

  reasons.push("Negative MACD");

}

//--------------------------------------------------
// Breakout Validation
//--------------------------------------------------

if (input.breakout) {

  score += SIGNAL_WEIGHTS.BREAKOUT;

  reasons.push("Breakout confirmed");

}
else {

  score -= 5;

  reasons.push("No breakout");

}

//--------------------------------------------------
// Volume Validation
//--------------------------------------------------

if (input.volumeStrength >= 70) {

  score += SIGNAL_WEIGHTS.VOLUME;

  reasons.push("Strong volume");

}
else if (input.volumeStrength >= 50) {

  score += 5;

  reasons.push("Average volume");

}
else {

  score -= SIGNAL_WEIGHTS.VOLUME;

  reasons.push("Weak volume");

}

//--------------------------------------------------
// Market Structure Validation
//--------------------------------------------------

if (input.marketStructure === "UPTREND") {

  score += SIGNAL_WEIGHTS.MARKET_STRUCTURE;

  reasons.push("Uptrend structure");

}
else if (input.marketStructure === "DOWNTREND") {

  score += SIGNAL_WEIGHTS.MARKET_STRUCTURE;

  reasons.push("Downtrend structure");

}
else {

  score -= SIGNAL_WEIGHTS.MARKET_STRUCTURE;

  reasons.push("Range market");

}

//--------------------------------------------------
// Support / Resistance Validation
//--------------------------------------------------

const distanceToSupport =
  Math.abs(input.price - input.support);

const distanceToResistance =
  Math.abs(input.resistance - input.price);

if (
  distanceToSupport <
  distanceToResistance
) {

  score += SIGNAL_WEIGHTS.SUPPORT_RESISTANCE;

  reasons.push("Near support");

}
else {

  score -= SIGNAL_WEIGHTS.SUPPORT_RESISTANCE;

  reasons.push("Near resistance");

}

  return {
    isValid: score >= 70,
    score,
    reasons,
  };

}