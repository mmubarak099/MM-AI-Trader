interface MarketInput {
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



export function analyzeMarket(
  data: MarketInput
): {
  trend: string;
  confidence: number;
  tradeQuality: string;
  probability: number;
  action: string;
  reasons: string[];
  marketCondition: string;
  riskLevel: string;
  advice: string;
  summary: string;
  breakdown: {
    trend: number;
    momentum: number;
    pattern: number;
    ema: number;
    structure: number;
    breakout: number;
    volume: number;
    risk: number;
  };
} {



  const movement =
    Number(
      (data.price - data.previousPrice).toFixed(2)
    );



  let score = 50;

  let reasons: string[] = [];
  let trendScore = 0;
  let momentumScore = 0;
  let patternScore = 0;
  let movingAverageScore = 0;
  let riskScore = 0;
  let tradeQuality = "C";
  let marketTradable = true;

  // ======================================
// Market Filter Engine
// ======================================

  let marketFilterReason = "";
  let volumeScore = 0;
  let breakoutScore = 0;
  let structureScore = 0;
  let marketFilterPassed = true;

  const nearestSupport =
  data.support.length > 0
    ? Math.max(...data.support)
    : null;

const nearestResistance =
  data.resistance.length > 0
    ? Math.min(...data.resistance)
    : null;

    const distanceToResistance =
  nearestResistance !== null
    ? nearestResistance - data.price
    : null;

const distanceToSupport =
  nearestSupport !== null
    ? data.price - nearestSupport
    : null;

// ===============================
// AI Confluence Bonus
// ===============================

let confirmationScore = 0;

if (data.trend === "Bullish")
  confirmationScore += 30;

if (data.breakout === "BREAKOUT")
  confirmationScore += 25;

if (data.volumeStrength === "HIGH")
  confirmationScore += 15;

if (
  data.rsi !== null &&
  data.rsi > 50 &&
  data.rsi < 70
)
  confirmationScore += 10;

if (
  data.ema20 !== null &&
  data.ema50 !== null &&
  data.ema20 > data.ema50
)
  confirmationScore += 10;

if (data.pattern !== "NONE")
  confirmationScore += 10;

if (confirmationScore >= 70) {

  score += 25;

  reasons.push(
    "High-confidence bullish confluence detected."
  );

}
else if (confirmationScore >= 50) {

  score += 15;

  reasons.push(
    "Good bullish confluence detected."
  );

}

// ===============================
// Strong Trend Bonus
// ===============================

if (

  data.trend === "Bullish" &&

  data.breakout === "BREAKOUT" &&

  data.volumeStrength === "HIGH"

) {

  breakoutScore += 10;

  reasons.push(
    "Strong bullish trend confirmed by breakout and volume."
  );

}

// ===============================
// Strong Bearish Trend Bonus
// ===============================

if (

  data.trend === "Bearish" &&

  data.breakout === "BREAKDOWN" &&

  data.volumeStrength === "HIGH"

) {

  score -= 10;

  reasons.push(
    "Strong bearish trend confirmed by breakdown and volume."
  );

}

// ===============================
// Avoid buying into resistance
// ===============================

if (

  distanceToResistance !== null &&

  distanceToResistance < 20

) {

  score -= 15;

  reasons.push(
    "Resistance is too close."
  );

}

// ===============================
// Avoid selling into support
// ===============================

if (

  distanceToSupport !== null &&

  distanceToSupport < 20 &&

  data.trend === "Bearish"

) {

  riskScore -= 8;

  reasons.push(
    "Support is too close for a SELL."
  );

}

// ===============================
// Sideways Zone Detection
// ===============================

if (

  distanceToResistance !== null &&
  distanceToSupport !== null &&
  distanceToResistance < 20 &&
  distanceToSupport < 20

) {

  riskScore -= 10;

  reasons.push(
    "Price is trapped between nearby support and resistance."
  );

}

// ===============================
// Reject conflicting signals
// ===============================

if (

  data.trend === "Bearish" &&

  data.breakout === "BREAKOUT"

) {

  breakoutScore -= 20;

  reasons.push(
    "Bullish breakout rejected because the primary trend is Bearish."
  );

}

if (

  data.trend === "Bullish" &&

  movement < 0

) {

  score -= 10;

  reasons.push(
    "Price is moving against the bullish trend."
  );

}

// ===============================
// Bearish Confluence
// ===============================

let bearishConfirmations = 0;

if (data.breakout === "BREAKDOWN") bearishConfirmations++;
if (data.volumeStrength === "HIGH") bearishConfirmations++;
if (data.trend === "Bearish") bearishConfirmations++;
if (
  data.rsi !== null &&
  data.rsi < 50
) bearishConfirmations++;

if (
  data.pattern === "BEARISH_ENGULFING"
) bearishConfirmations++;

if (bearishConfirmations >= 4) {

  score -= 20;

  reasons.push(
    "Multiple bearish confirmations align."
  );

}

 // Price momentum

if (movement > 0) {

  momentumScore += 15;
  reasons.push("Price is gaining momentum compared to the previous candle.");

}

else if (movement < 0) {

  momentumScore -= 15;
  reasons.push("Price is losing momentum compared to the previous candle.");

}





  // Moving average trend

if (data.trend === "Bullish") {

  trendScore += 10;

  reasons.push(
    "Overall market trend is Bullish."
  );

}

else if (data.trend === "Bearish") {

  trendScore -= 10;
  reasons.push("Overall market trend is Bearish.");

}

if (data.marketStructure === "UPTREND") {

  structureScore += 15;

  reasons.push(
    "Overall market structure is in an uptrend."
  );

}

if (data.marketStructure === "DOWNTREND") {

  structureScore -= 15;

  reasons.push(
    "Overall market structure is in a downtrend."
  );

}

if (data.marketStructure === "SIDEWAYS") {

  marketFilterPassed = false;

  reasons.push(
    "Market is ranging with no clear trend."
  );

}

// Support & Resistance

if (
  nearestSupport !== null &&
  Math.abs(data.price - nearestSupport) <= 15
) {

  riskScore += 8;

  reasons.push(
    "Price is trading near a support zone."
  );

}

if (
  nearestResistance !== null &&
  Math.abs(data.price - nearestResistance) <= 15
) {

  riskScore -= 8;

  reasons.push(
    "Price is trading near a resistance zone."
  );

}

// Breakout / Breakdown

// Breakout / Breakdown

if (
  data.breakout === "BREAKOUT" &&
  data.trend === "Bullish" &&
  data.marketStructure !== "SIDEWAYS"
) {
  
  breakoutScore += 20;

  reasons.push(
    "Bullish breakout confirmed with trend."
  );

}

if (
  data.breakout === "BREAKDOWN" &&
  data.trend === "Bearish" &&
  data.marketStructure !== "SIDEWAYS"
)
{

  breakoutScore -= 20;

  reasons.push(
    "Bearish breakdown confirmed with trend."
  );

}

// ===============================
// Volume Confirmation
// ===============================

if (
  data.breakout === "BREAKOUT" &&
  data.trend === "Bullish" &&
  data.volumeStrength === "HIGH"
)
{

  volumeScore += 8;

  reasons.push(
    "High trading volume confirms the breakout."
  );

}

if (
  data.breakout === "BREAKDOWN" &&
  data.trend === "Bearish" &&
  data.volumeStrength === "HIGH"
)
{

  volumeScore -= 8;

  reasons.push(
    "High selling volume confirms the breakdown."
  );

}

if (
  data.breakout === "BREAKOUT" &&
  data.trend !== "Bullish" &&
  data.volumeStrength === "LOW"
)
{

  volumeScore -= 5;

  reasons.push(
    "Breakout has weak volume confirmation."
  );

}

if (
  data.breakout === "BREAKDOWN" &&
  data.trend !== "Bearish" &&
  data.volumeStrength === "LOW"
)
{

  volumeScore += 5;

  reasons.push(
    "Breakdown has weak selling volume."
  );

}

  // RSI analysis

  if (data.rsi !== null) {


    // Overbought condition

if (data.rsi > 70) {

  momentumScore -= 15;

  reasons.push(
    "RSI indicates the market is overbought."
  );

}

else if (data.rsi < 30) {

  if (data.trend === "Bullish") {

    momentumScore += 10;

    reasons.push(
      "RSI indicates the market is oversold, supporting the bullish trend."
    );

  } else {

    reasons.push(
      "RSI is oversold, but the primary trend is bearish."
    );

  }

}

  }

// MACD analysis

if (data.macd !== null) {

  if (data.macd > 0) {

    if (data.trend === "Bullish") {

      momentumScore += 8;

      reasons.push(
        "MACD confirms bullish momentum."
      );

  }

   } else if (data.macd < 0) {

    if (data.trend === "Bearish") {

      momentumScore -= 8;

      reasons.push(
        "MACD confirms bearish momentum."
      );

  }

}
}



// EMA analysis

if (
  data.ema20 !== null &&
  data.ema50 !== null
) {

  if (data.ema20 > data.ema50) {

    if (data.trend === "Bullish") {

      movingAverageScore += 12;
      reasons.push("EMA20 is trading above EMA50, confirming bullish trend.");

  }

   }else {

    if (data.trend === "Bearish") {

      movingAverageScore -= 12;
      reasons.push("EMA20 is trading below EMA50, confirming bearish trend.");

  }

}

}

  // Movement strength

  const strength =
    Math.abs(movement);

  


if (strength > 20) {

  reasons.push(
    "Strong price movement detected."
  );

}

// ===============================
// Final AI Score Calculation
// ===============================

score =
  50 +
  trendScore +
  momentumScore +
  patternScore +
  movingAverageScore +
  structureScore +
  breakoutScore +
  volumeScore +
  riskScore;

  // ===============================
// High Confidence Bonus
// ===============================

if (
  confirmationScore >= 80 &&
  trendScore > 0 &&
  breakoutScore > 0 &&
  volumeScore > 0
) {

  score += 15;

  reasons.push(
    "A+ trade setup detected."
  );

}

// Keep score within limits
score = Math.max(0, Math.min(100, score));

let trend = "Neutral";

let action = "WAIT";

let marketCondition = "Sideways";

let riskLevel = "Medium";

let advice = "Wait for confirmation";


// ===============================
// Market Tradability Filter
// ===============================

if (

  data.marketStructure === "SIDEWAYS" &&

  data.volumeStrength !== "HIGH" &&

  confirmationScore < 70

) {

  marketTradable = false;

  reasons.push(
    "Market is sideways with weak confirmation."
  );

}


if (
  score >= 75 &&
  marketTradable &&
  confirmationScore >= 70
) {

  trend = "Bullish";

  action = "BUY";

}

else if (
  score <= 25 &&
  marketTradable &&
  bearishConfirmations >= 4
) {

  trend = "Bearish";

  action = "SELL";

}

else if (score >= 60 && score < 75) {

  trend = trendScore >= 0 ? "Bullish" : "Bearish";

  action = "WATCH";

}

else {

  trend = "Neutral";

  action = "WAIT";

}

  if (score >= 75) {

  marketCondition = "Strong Bullish";

  riskLevel = "Medium";

  advice = "Look for confirmation before entry";

}

else if (score <= 25) {

  marketCondition = "Strong Bearish";

  riskLevel = "High";

  advice = "Avoid long positions";

}

else {

  marketCondition = "Sideways Market";

  riskLevel = "Low";

  advice = "Wait for a clearer setup";

}


let summary = "";

if (action === "BUY") {

  summary =
    "The market is showing bullish characteristics with positive momentum. Trend and technical indicators support a potential buying opportunity while maintaining disciplined risk management.";

}

// A+ setup
if (
  confirmationScore >= 90 &&
  score >= 90
) {
  advice = "A+ setup detected. Aggressive position sizing allowed.";
  riskLevel = "Very Low";

  reasons.push(
    "Exceptional confluence across all major indicators."
  );
}

else if (action === "SELL") {

  summary =
    "The market is showing bearish characteristics with increasing selling pressure. Current technical indicators suggest caution and favor short-selling opportunities.";

}

// A+ SELL setup
if (
  bearishConfirmations >= 5 &&
  score <= 10
) {
  advice = "A+ SELL setup detected. Aggressive position sizing allowed.";
  riskLevel = "Very Low";

  reasons.push(
    "Exceptional bearish confluence across all major indicators."
  );
}

else if (action === "WATCH") {

  summary =
    "The market is developing a possible trading setup, but confirmation from additional price action is recommended before entering a position.";

}

else {

  summary =
    "The market is currently moving sideways with mixed technical signals. Waiting for a clearer opportunity is the recommended approach.";

}

// ===============================
// Probability Engine
// ===============================

let probability = 50;

probability += trendScore * 0.8;
probability += momentumScore * 0.5;
probability += movingAverageScore * 0.5;
probability += breakoutScore * 0.7;
probability += volumeScore * 0.4;
probability += patternScore * 0.6;
probability += structureScore * 0.4;
probability += riskScore * 0.3;

probability = Math.max(
  0,
  Math.min(100, Math.round(probability))
);

// ===============================
// Dynamic Confidence Engine
// ===============================

let confidence = probability;

// ===============================
// Confidence Conflict Penalty
// ===============================

let conflicts = 0;

if (
  data.trend === "Bullish" &&
  data.macd !== null &&
  data.macd < 0
)
  conflicts++;

if (
  data.trend === "Bearish" &&
  data.macd !== null &&
  data.macd > 0
)
  conflicts++;

if (
  data.trend === "Bullish" &&
  data.ema20 !== null &&
  data.ema50 !== null &&
  data.ema20 < data.ema50
)
  conflicts++;

if (
  data.trend === "Bearish" &&
  data.ema20 !== null &&
  data.ema50 !== null &&
  data.ema20 > data.ema50
)
  conflicts++;

confidence -= conflicts * 8;

confidence += Math.floor(confirmationScore / 5);

if (!marketTradable)
  confidence -= 15;

if (trend === "Bullish" && trendScore > 0)
  confidence += 5;

if (trend === "Bearish" && trendScore < 0)
  confidence += 5;

confidence = Math.max(
  0,
  Math.min(100, Math.round(confidence))
);

// ===============================
// Trade Quality Engine
// ===============================

if (confidence >= 90) {

  tradeQuality = "A+";

}
else if (confidence >= 80) {

  tradeQuality = "A";

}
else if (confidence >= 65) {

  tradeQuality = "B";

}
else {

  tradeQuality = "C";

}

// ===============================
// Final Decision Validator
// ===============================

if (action === "BUY") {

  if (
    data.marketStructure === "SIDEWAYS" &&
    confirmationScore < 80
  ) {

    action = "WAIT";

    reasons.push(
      "BUY rejected because the market is still ranging."
    );

  }

}

if (action === "SELL") {

  if (
    data.marketStructure === "SIDEWAYS" &&
    bearishConfirmations < 5
  ) {

    action = "WAIT";

    reasons.push(
      "SELL rejected because the market is still ranging."
    );

  }

}

// ===============================
// Trade Quality Filter
// ===============================

if (tradeQuality === "C") {

  action = "WAIT";

  reasons.push(
    "Trade quality is too low."
  );

}
else if (tradeQuality === "B") {

  if (action !== "WAIT") {

    action = "WATCH";

    reasons.push(
      "Trade requires additional confirmation."
    );

  }

}

return {

  trend,

  confidence,

  probability,

  tradeQuality,

  action,

  reasons,

  marketCondition,

  riskLevel,

  advice,

  summary,

  breakdown: {
    trend: trendScore,
    momentum: momentumScore,
    pattern: patternScore,
    ema: movingAverageScore,
    structure: structureScore,
    breakout: breakoutScore,
    volume: volumeScore,
    risk: riskScore,
  },

};

}
