// ===========================================
// MM AI Trader AI Engine V2
// ===========================================

export interface MarketInput {
  price: number;
  previousPrice: number;
  trend: string;
  rsi: number | null;
  ema20: number | null;
  ema50: number | null;
  macd: number | null;
  pattern: string;
  support: number[];
  resistance: number[];
  marketStructure: string;
  breakout: string;
  volumeStrength: string;
}

export interface ScoreResult {
  score: number;
  reasons: string[];
}

export interface AIResult {
  trend: string;
  confidence: number;
  action: string;
  reasons: string[];
  marketCondition: string;
  riskLevel: string;
  advice: string;
  summary: string;
}

function createResult(
  score: number = 0,
  reasons: string[] = []
): ScoreResult {

  return {
    score,
    reasons,
  };

}

function calculateTrendScore(
  data: MarketInput
): ScoreResult {

  const result = createResult();

  if (data.trend === "Bullish") {

    result.score += 15;

    result.reasons.push(
      "Overall trend is Bullish."
    );

  }

  else if (data.trend === "Bearish") {

    result.score -= 15;

    result.reasons.push(
      "Overall trend is Bearish."
    );

  }

  if (data.marketStructure === "UPTREND") {

    result.score += 15;

    result.reasons.push(
      "Market structure confirms an uptrend."
    );

  }

  else if (data.marketStructure === "DOWNTREND") {

    result.score -= 15;

    result.reasons.push(
      "Market structure confirms a downtrend."
    );

  }

  else {

    result.reasons.push(
      "Market structure is sideways."
    );

  }

  return result;

}

function calculateMomentumScore(
  data: MarketInput
): ScoreResult {

  const result = createResult();

  const movement =
    Number(
      (data.price - data.previousPrice).toFixed(2)
    );

  if (movement > 0) {

    result.score += 15;

    result.reasons.push(
      "Price is gaining momentum."
    );

  }

  else if (movement < 0) {

    result.score -= 15;

    result.reasons.push(
      "Price is losing momentum."
    );

  }

  if (Math.abs(movement) > 20) {

    result.score += movement > 0 ? 10 : -10;

    result.reasons.push(
      "Strong price momentum detected."
    );

  }

  return result;

}

function calculatePatternScore(
  data: MarketInput
): ScoreResult {

  const result = createResult();

  switch (data.pattern) {

    case "Bullish Engulfing":

      result.score += 15;

      result.reasons.push(
        "Bullish Engulfing detected."
      );

      break;

    case "Bearish Engulfing":

      result.score -= 15;

      result.reasons.push(
        "Bearish Engulfing detected."
      );

      break;

    case "Hammer":

      result.score += 12;

      result.reasons.push(
        "Hammer indicates bullish reversal."
      );

      break;

    default:

      result.reasons.push(
        "No major candlestick pattern."
      );

  }

  return result;

}

function calculateMovingAverageScore(
  data: MarketInput
): ScoreResult {

  const result = createResult();

  if (
    data.ema20 === null ||
    data.ema50 === null
  ) {

    return result;

  }

  if (data.ema20 > data.ema50) {

    result.score += 12;

    result.reasons.push(
      "EMA20 is above EMA50."
    );

  }

  else {

    result.score -= 12;

    result.reasons.push(
      "EMA20 is below EMA50."
    );

  }

  return result;

}

function calculateRSIScore(
  data: MarketInput
): ScoreResult {

  const result = createResult();

  if (data.rsi === null) {

    return result;

  }

  if (data.rsi < 30) {

    result.score += 12;

    result.reasons.push(
      "RSI indicates oversold conditions."
    );

  }

  else if (data.rsi > 70) {

    result.score -= 15;

    result.reasons.push(
      "RSI indicates overbought conditions."
    );

  }

  else if (data.rsi >= 50 && data.rsi <= 70) {

    result.score += 5;

    result.reasons.push(
      "RSI supports bullish momentum."
    );

  }

  else if (data.rsi >= 30 && data.rsi < 50) {

    result.score -= 5;

    result.reasons.push(
      "RSI supports bearish momentum."
    );

  }

  return result;

}

function calculateMACDScore(
  data: MarketInput
): ScoreResult {

  const result = createResult();

  if (data.macd === null) {

    return result;

  }

  if (data.macd > 0) {

    result.score += 8;

    result.reasons.push(
      "MACD confirms bullish momentum."
    );

  }

  else if (data.macd < 0) {

    result.score -= 8;

    result.reasons.push(
      "MACD confirms bearish momentum."
    );

  }

  return result;

}

function calculateBreakoutScore(
  data: MarketInput
): ScoreResult {

  const result = createResult();

  if (
    data.breakout === "BREAKOUT" &&
    data.volumeStrength === "HIGH"
  ) {

    result.score += 20;

    result.reasons.push(
      "Strong bullish breakout confirmed by high volume."
    );

  }

  else if (
    data.breakout === "BREAKDOWN" &&
    data.volumeStrength === "HIGH"
  ) {

    result.score -= 20;

    result.reasons.push(
      "Strong bearish breakdown confirmed by high volume."
    );

  }

  else if (
    data.breakout === "BREAKOUT" &&
    data.volumeStrength === "LOW"
  ) {

    result.score -= 8;

    result.reasons.push(
      "Bullish breakout lacks volume confirmation."
    );

  }

  else if (
    data.breakout === "BREAKDOWN" &&
    data.volumeStrength === "LOW"
  ) {

    result.score += 8;

    result.reasons.push(
      "Bearish breakdown lacks volume confirmation."
    );

  }

  return result;

}

function calculateSupportResistanceScore(
  data: MarketInput
): ScoreResult {

  const result = createResult();

  const nearestSupport =
    data.support.length > 0
      ? Math.max(...data.support)
      : null;

  const nearestResistance =
    data.resistance.length > 0
      ? Math.min(...data.resistance)
      : null;

  // ===========================
  // Support
  // ===========================

  if (

    nearestSupport !== null &&

    Math.abs(data.price - nearestSupport) <= 15

  ) {

    result.score += 8;

    result.reasons.push(
      "Price is near a strong support zone."
    );

  }

  // ===========================
  // Resistance
  // ===========================

  if (

    nearestResistance !== null &&

    Math.abs(data.price - nearestResistance) <= 15

  ) {

    result.score -= 8;

    result.reasons.push(
      "Price is near a strong resistance zone."
    );

  }

  return result;

}

function calculateRiskScore(
  data: MarketInput
): ScoreResult {

  const result = createResult();

  // Sideways market increases risk
  if (data.marketStructure === "SIDEWAYS") {

    result.score -= 10;

    result.reasons.push(
      "Sideways market increases trading risk."
    );

  }

  // Buying against bearish trend
  if (

    data.trend === "Bearish" &&
    data.breakout === "BREAKOUT"

  ) {

    result.score -= 15;

    result.reasons.push(
      "Bullish breakout is against the primary trend."
    );

  }

  // Selling against bullish trend
  if (

    data.trend === "Bullish" &&
    data.breakout === "BREAKDOWN"

  ) {

    result.score -= 15;

    result.reasons.push(
      "Bearish breakdown is against the primary trend."
    );

  }

  return result;

}

function generateDecision(
  finalScore: number
) {

  let action = "WAIT";
  let trend = "Neutral";
  let marketCondition = "Sideways";
  let riskLevel = "Medium";
  let advice = "Wait for better confirmation.";

  if (finalScore >= 85) {

    action = "BUY";
    trend = "Bullish";
    marketCondition = "Strong Bullish";
    riskLevel = "Low";
    advice = "Strong BUY setup confirmed.";

  }

  else if (finalScore >= 70) {

    action = "WATCH";
    trend = "Bullish";
    marketCondition = "Bullish";
    riskLevel = "Medium";
    advice = "Bullish setup forming. Wait for confirmation.";

  }

  else if (finalScore <= 15) {

    action = "SELL";
    trend = "Bearish";
    marketCondition = "Strong Bearish";
    riskLevel = "Low";
    advice = "Strong SELL setup confirmed.";

  }

  else if (finalScore <= 30) {

    action = "WATCH";
    trend = "Bearish";
    marketCondition = "Bearish";
    riskLevel = "Medium";
    advice = "Bearish setup forming. Wait for confirmation.";

  }

  return {

    action,

    trend,

    marketCondition,

    riskLevel,

    advice,

  };

}

export function analyzeMarket(
  data: MarketInput
): AIResult {

  const trend = calculateTrendScore(data);

  const momentum = calculateMomentumScore(data);

  const pattern = calculatePatternScore(data);

  const movingAverage =
    calculateMovingAverageScore(data);

  const rsi =
    calculateRSIScore(data);

  const macd =
    calculateMACDScore(data);

  const breakout =
    calculateBreakoutScore(data);

  const supportResistance =
    calculateSupportResistanceScore(data);

  const risk =
    calculateRiskScore(data);

  //------------------------------------------------
  // Final Score
  //------------------------------------------------

  let finalScore = 50;

  finalScore += trend.score;

  finalScore += momentum.score;

  finalScore += pattern.score;

  finalScore += movingAverage.score;

  finalScore += rsi.score;

  finalScore += macd.score;

  finalScore += breakout.score;

  finalScore += supportResistance.score;

  finalScore += risk.score;

  //------------------------------------------------
  // Clamp Score
  //------------------------------------------------

  finalScore = Math.max(
    0,
    Math.min(100, finalScore)
  );

  //------------------------------------------------
  // Decision
  //------------------------------------------------

  const decision =
    generateDecision(finalScore);

  //------------------------------------------------
  // Merge Reasons
  //------------------------------------------------

  const reasons = [

    ...trend.reasons,

    ...momentum.reasons,

    ...pattern.reasons,

    ...movingAverage.reasons,

    ...rsi.reasons,

    ...macd.reasons,

    ...breakout.reasons,

    ...supportResistance.reasons,

    ...risk.reasons,

  ];

  //------------------------------------------------
  // Summary
  //------------------------------------------------

  let summary = "";

  switch (decision.action) {

    case "BUY":

      summary =
        "Multiple technical indicators align in favor of a BUY opportunity.";

      break;

    case "SELL":

      summary =
        "Multiple technical indicators align in favor of a SELL opportunity.";

      break;

    case "WATCH":

      summary =
        "The market is showing potential but confirmation is still required.";

      break;

    default:

      summary =
        "Current market conditions do not provide a high-probability setup.";

  }

  return {

    trend: decision.trend,

    confidence: Math.round(finalScore),

    action: decision.action,

    reasons,

    marketCondition:
      decision.marketCondition,

    riskLevel:
      decision.riskLevel,

    advice:
      decision.advice,

    summary,

  };

}
