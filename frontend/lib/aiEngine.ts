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
) {


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

  const nearestSupport =
  data.support.length > 0
    ? Math.max(...data.support)
    : null;

const nearestResistance =
  data.resistance.length > 0
    ? Math.min(...data.resistance)
    : null;

    if (score >= 90) {

  tradeQuality = "A+";

} else if (score >= 80) {

  tradeQuality = "A";

} else if (score >= 70) {

  tradeQuality = "B";

} else {

  tradeQuality = "C";

}

// ===============================
// AI Confluence Bonus
// ===============================

let confirmations = 0;

if (data.breakout === "BREAKOUT") confirmations++;
if (data.volumeStrength === "HIGH") confirmations++;
if (data.trend === "Bullish") confirmations++;
if (
  data.rsi !== null &&
  data.rsi > 50 &&
  data.rsi < 70
) confirmations++;
if (data.pattern !== "NONE") confirmations++;

if (confirmations >= 4) {

  score += 15;

  reasons.push(
    "Multiple bullish confirmations align."
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

  score -= 15;

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
    "Market trend remains bullish based on moving averages."
  );

}

else if (data.trend === "Bearish") {

  trendScore -= 10;
  reasons.push("Market trend remains bearish based on moving averages.");

}

if (data.marketStructure === "UPTREND") {
  score += 15;
  reasons.push(
    "Overall market structure is in an uptrend."
  );
}

if (data.marketStructure === "DOWNTREND") {
  score -= 15;
  reasons.push(
    "Overall market structure is in a downtrend."
  );
}

if (data.marketStructure === "SIDEWAYS") {
  reasons.push(
    "Market is ranging with no clear trend."
  );
}

// Support & Resistance

if (
  nearestSupport !== null &&
  Math.abs(data.price - nearestSupport) <= 15
) {
  score += 8;

  reasons.push(
    "Price is trading near a support zone."
  );
}

if (
  nearestResistance !== null &&
  Math.abs(data.price - nearestResistance) <= 15
) {
  score -= 8;

  reasons.push(
    "Price is trading near a resistance zone."
  );
}

// Breakout / Breakdown

if (data.breakout === "BREAKOUT") {

  score += 20;

  reasons.push(
    "Price has broken above resistance."
  );

}

if (data.breakout === "BREAKDOWN") {

  score -= 20;

  reasons.push(
    "Price has broken below support."
  );

}

// ===============================
// Volume Confirmation
// ===============================

if (
  data.breakout === "BREAKOUT" &&
  data.volumeStrength === "HIGH"
) {

  score += 12;

  reasons.push(
    "High trading volume confirms the breakout."
  );

}

if (
  data.breakout === "BREAKDOWN" &&
  data.volumeStrength === "HIGH"
) {

  score -= 12;

  reasons.push(
    "High selling volume confirms the breakdown."
  );

}

if (
  data.breakout === "BREAKOUT" &&
  data.volumeStrength === "LOW"
) {

  score -= 8;

  reasons.push(
    "Breakout has weak volume confirmation."
  );

}

if (
  data.breakout === "BREAKDOWN" &&
  data.volumeStrength === "LOW"
) {

  score += 8;

  reasons.push(
    "Breakdown has weak selling volume."
  );

}


  // RSI analysis

  if (data.rsi !== null) {


    // Overbought condition

    if (data.rsi > 70) {

  score -= 15;
  reasons.push("RSI indicates the market is overbought.");

}



    // Oversold condition

    else if (data.rsi < 30) {

  score += 10;
  reasons.push("RSI indicates the market is oversold, increasing reversal potential.");

}


  }

  // MACD analysis

if (data.macd !== null) {

  if (data.macd > 0) {

    score += 8;
    reasons.push("MACD confirms increasing buying momentum.");

  }

  else if (data.macd < 0) {

    score -= 8;
    reasons.push("MACD confirms increasing selling pressure.");

  }

}

if (data.pattern === "Bullish Engulfing") {
  patternScore += 15;
  reasons.push(
    "Bullish Engulfing pattern indicates a potential bullish reversal."
  );
}

if (data.pattern === "Bearish Engulfing") {
  patternScore -= 15;
  reasons.push(
    "Bearish Engulfing pattern indicates a potential bearish reversal."
  );
}

if (data.pattern === "Hammer") {
  patternScore += 12;
  reasons.push(
    "Hammer pattern indicates a potential bullish reversal after a decline."
  );
}


// EMA analysis

if (
  data.ema20 !== null &&
  data.ema50 !== null
) {

  if (data.ema20 > data.ema50) {

    movingAverageScore += 12;
    reasons.push("EMA20 is trading above EMA50, confirming bullish trend.");

  }

  else {

    movingAverageScore -= 12;
    reasons.push("EMA20 is trading below EMA50, confirming bearish trend.");

  }

}

// Candlestick pattern analysis

if (data.pattern === "Bullish Engulfing") {

  score += 15;

  reasons.push(
    "Bullish Engulfing pattern detected, indicating potential upward reversal."
  );

}



  // Movement strength

  const strength =
    Math.abs(movement);

  


  if (strength > 20) {

    score += movement > 0 ? 10 : -10;

  }


score += trendScore;
score += momentumScore;
score += patternScore;
score += movingAverageScore;
score += riskScore;


  // Keep score between 0-100

  score = Math.max(
    0,
    Math.min(
      score,
      100
    )
  );





let trend = "Neutral";

let action = "WAIT";

let marketCondition = "Sideways";

let riskLevel = "Medium";

let advice = "Wait for confirmation";





  if (score >= 75) {

    trend = "Bullish";

    action = "BUY";

  }



  else if (score <= 25) {

    trend = "Bearish";

    action = "SELL";

  }



  else if (score >= 60 && score < 75) {

    trend = "Bullish";

    action = "WATCH";

  }



  else if (score > 25 && score < 40) {

    trend = "Bearish";

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

else if (action === "SELL") {

  summary =
    "The market is showing bearish characteristics with increasing selling pressure. Current technical indicators suggest caution and favor short-selling opportunities.";

}

else if (action === "WATCH") {

  summary =
    "The market is developing a possible trading setup, but confirmation from additional price action is recommended before entering a position.";

}

else {

  summary =
    "The market is currently moving sideways with mixed technical signals. Waiting for a clearer opportunity is the recommended approach.";

}


return {

  trend,

  confidence: Math.round(score),

  action,

  reasons,

  marketCondition,

  riskLevel,

  advice,

  summary,

};


}