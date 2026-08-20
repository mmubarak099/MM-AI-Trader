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
  opportunityRating: string;
  probability: number;
  marketRegime: string;
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

  console.log("🤖 V1 INPUT:", {
    price: data.price,
    previousPrice: data.previousPrice,
    trend: data.trend,
    rsi: data.rsi,
    ema20: data.ema20,
    ema50: data.ema50,
    macd: data.macd,
    pattern: data.pattern,
    breakout: data.breakout,
    volumeStrength: data.volumeStrength,
    marketStructure: data.marketStructure,
  });

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

  // ===============================
// Candlestick Pattern Scoring
// ===============================

if (data.pattern === "Bullish Engulfing") {

  if (data.trend === "Bullish") {

    patternScore += 15;

    reasons.push(
      "Bullish Engulfing confirms the bullish setup."
    );

  } else {

    patternScore += 8;

    reasons.push(
      "Bullish Engulfing detected."
    );

  }

}

if (data.pattern === "Bearish Engulfing") {

  if (data.trend === "Bearish") {

    patternScore -= 15;

    reasons.push(
      "Bearish Engulfing confirms the bearish setup."
    );

  } else {

    patternScore -= 8;

    reasons.push(
      "Bearish Engulfing detected."
    );

  }

}

if (data.pattern === "Hammer") {

  patternScore += 8;

  reasons.push(
    "Hammer pattern detected."
  );

}

if (data.pattern === "No Pattern") {

  patternScore = 0;

}

// ===============================
// Market Regime Engine
// ===============================

let marketRegime = "RANGING";

if (
  Math.abs(movement) > 25
) {

  marketRegime = "VOLATILE";

}
else if (
  data.marketStructure === "UPTREND"
) {

  marketRegime = "TRENDING_BULLISH";

}
else if (
  data.marketStructure === "DOWNTREND"
) {

  marketRegime = "TRENDING_BEARISH";

}
else if (
  data.marketStructure === "SIDEWAYS"
) {

  marketRegime = "RANGING";

}

console.log("🏛️ MARKET REGIME CHECK:", {
  trend: data.trend,
  marketStructure: data.marketStructure,
  movement,
  marketRegime,
});

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
// Directional Confirmation Engine
// ===============================

let bullishConfirmationScore = 0;
let bearishConfirmationScore = 0;

// ---------- BULLISH ----------

if (data.trend === "Bullish")
  bullishConfirmationScore += 30;

if (data.breakout === "BREAKOUT")
  bullishConfirmationScore += 25;

if (data.volumeStrength === "HIGH")
  bullishConfirmationScore += 15;

if (
  data.rsi !== null &&
  data.rsi > 50 &&
  data.rsi < 70
)
  bullishConfirmationScore += 10;

if (
  data.ema20 !== null &&
  data.ema50 !== null &&
  data.ema20 > data.ema50
)
  bullishConfirmationScore += 10;

if (
  data.pattern === "Bullish Engulfing" ||
  data.pattern === "Hammer"
)
  bullishConfirmationScore += 10;


// ---------- BEARISH ----------

if (data.trend === "Bearish")
  bearishConfirmationScore += 30;

if (data.breakout === "BREAKDOWN")
  bearishConfirmationScore += 25;

if (data.volumeStrength === "HIGH")
  bearishConfirmationScore += 15;

if (
  data.rsi !== null &&
  data.rsi < 50 &&
  data.rsi > 30
)
  bearishConfirmationScore += 10;

if (
  data.ema20 !== null &&
  data.ema50 !== null &&
  data.ema20 < data.ema50
)
  bearishConfirmationScore += 10;

if (data.pattern === "Bearish Engulfing")
  bearishConfirmationScore += 10;


// ---------- Direction ----------

const confirmationScore =
  data.trend === "Bearish"
    ? bearishConfirmationScore
    : data.trend === "Bullish"
      ? bullishConfirmationScore
      : Math.max(
          bullishConfirmationScore,
          bearishConfirmationScore
        );


// ---------- Reasons ----------

if (bullishConfirmationScore >= 70) {

  reasons.push(
    "Strong bullish confluence detected."
  );

}

if (bearishConfirmationScore >= 70) {

  reasons.push(
    "Strong bearish confluence detected."
  );

}

console.log("🧩 V1 DIRECTIONAL CONFIRMATION:", {
  bullishConfirmationScore,
  bearishConfirmationScore,
  confirmationScore,
  trend: data.trend,
  breakout: data.breakout,
  volumeStrength: data.volumeStrength,
  rsi: data.rsi,
  ema20: data.ema20,
  ema50: data.ema50,
  pattern: data.pattern,
});

console.log("🎯 V1 DIRECTIONAL GATE:", {
  trend: data.trend,
  confirmationScore,
  bearishConfirmationScore,
  bullishConfirmationScore,
  breakout: data.breakout,
  rsi: data.rsi,
  ema20: data.ema20,
  ema50: data.ema50,
});

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
  riskScore -= 5;

  reasons.push(
    "Support is close, reducing SELL entry quality."
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
  data.pattern === "Bearish Engulfing"
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

// ===============================
// Momentum Exhaustion Engine
// ===============================

const previousMovement = data.price - data.previousPrice;

if (
  data.trend === "Bullish" &&
  movement > 0 &&
  Math.abs(movement) < Math.abs(previousMovement)
) {

  momentumScore -= 5;

  reasons.push(
    "Bullish momentum is weakening."
  );

}

if (
  data.trend === "Bearish" &&
  movement < 0 &&
  Math.abs(movement) < Math.abs(previousMovement)
) {

  momentumScore += 5;

  reasons.push(
    "Bearish momentum is weakening."
  );

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
  Math.abs(data.price - nearestResistance) <= 15 &&
  data.trend === "Bullish"
) {

  riskScore -= 5;

  reasons.push(
    "Price is approaching resistance, reducing BUY entry quality."
  );

}

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

// ===============================
// Smart Entry Score
// ===============================

let entryScore = 0;

console.log("🎯 ENTRY SCORE START:", {
  trend: data.trend,
  ema20: data.ema20,
  ema50: data.ema50,
  strength,
  breakout: data.breakout,
  volumeStrength: data.volumeStrength,
  pattern: data.pattern,
  movement,
});

// ===============================
// Trend Alignment
// ===============================

if (data.trend === "Bullish") {

  entryScore += 2;

}

else if (data.trend === "Bearish") {

  entryScore += 2;

}

// ===============================
// Candlestick Pattern
// ===============================

if (
  data.pattern === "Bullish Engulfing" ||
  data.pattern === "Bearish Engulfing"
) {

  entryScore += 2;

}

// ===============================
// EMA Alignment
// ===============================

if (
  data.ema20 !== null &&
  data.ema50 !== null
) {

  console.log("🎯 ENTRY EMA CHECK:", {
    trend: data.trend,
    ema20: data.ema20,
    ema50: data.ema50,
    bullishAlignment:
      data.trend === "Bullish" &&
      data.ema20 > data.ema50,
    bearishAlignment:
      data.trend === "Bearish" &&
      data.ema20 < data.ema50,
    entryScoreBeforeEMA: entryScore,
  });

  if (
    data.trend === "Bullish" &&
    data.ema20 > data.ema50
  ) {

    entryScore += 2;

    console.log("✅ ENTRY SCORE +2: BULLISH EMA ALIGNMENT", {
      entryScore,
    });

  }

  else if (
    data.trend === "Bearish" &&
    data.ema20 < data.ema50
  ) {

    entryScore += 2;

    console.log("✅ ENTRY SCORE +2: BEARISH EMA ALIGNMENT", {
      entryScore,
    });

  }

}

// ===============================
// Momentum
// ===============================

if (strength > 20) {

  entryScore += 2;

}

else if (strength > 10) {

  entryScore += 1;

}

// ===============================
// RSI Entry Quality
// ===============================

// Bullish entries become less attractive
// when RSI is already extremely overbought.

if (
  data.rsi !== null &&
  data.trend === "Bullish"
) {

  if (data.rsi >= 90) {

    entryScore -= 4;

    reasons.push(
      "RSI is extremely overbought. Fresh BUY entry is strongly discouraged."
    );

  }

  else if (data.rsi >= 80) {

    entryScore -= 3;

    reasons.push(
      "RSI is overbought. Fresh BUY entry is less favorable."
    );

  }

  else if (data.rsi >= 70) {

    entryScore -= 1;

    reasons.push(
      "RSI is elevated. BUY entry has reduced room for immediate upside."
    );

  }
}


// Bearish entries become less attractive
// when RSI is already extremely oversold.

if (
  data.rsi !== null &&
  data.trend === "Bearish"
) {

  if (data.rsi <= 10) {

    entryScore -= 4;

    reasons.push(
      "RSI is extremely oversold. Fresh SELL entry is strongly discouraged."
    );

  }

  else if (data.rsi <= 20) {

    entryScore -= 3;

    reasons.push(
      "RSI is oversold. Fresh SELL entry is less favorable."
    );

  }

  else if (data.rsi <= 30) {

    entryScore -= 1;

    reasons.push(
      "RSI is depressed. SELL entry has reduced room for immediate downside."
    );

  }
}


// ===============================
// Breakout Confirmation
// ===============================

if (
  data.breakout === "BREAKOUT" &&
  data.trend === "Bullish"
) {

  entryScore += 2;

}

else if (
  data.breakout === "BREAKDOWN" &&
  data.trend === "Bearish"
) {

  entryScore += 2;

}

// ===============================
// Volume Confirmation
// ===============================

if (data.volumeStrength === "HIGH") {

  entryScore += 2;

}

// ===============================
// Pullback / Chasing Protection
// ===============================

if (
  data.trend === "Bullish" &&
  movement > 25
) {

  entryScore -= 2;

  reasons.push(
    "Bullish move is extended. Waiting for a pullback."
  );

}

if (
  data.trend === "Bearish" &&
  movement < -25
) {

  entryScore -= 2;

  reasons.push(
    "Bearish move is extended. Waiting for a pullback."
  );

}

if (strength > 40) {

  entryScore -= 3;

  reasons.push(
    "Price has already moved significantly. Waiting for a pullback."
  );

}

if (strength > 20) {

  reasons.push(
    "Strong price movement detected."
  );

}

console.log("🎯 V1 ENTRY SCORE BEFORE CLAMP:", {
  entryScore,
  trend: data.trend,
  ema20: data.ema20,
  ema50: data.ema50,
  strength,
  movement,
  breakout: data.breakout,
  volumeStrength: data.volumeStrength,
  pattern: data.pattern,
});

// Keep entry score within range

entryScore = Math.max(
  0,
  Math.min(10, entryScore)
);


// ===============================
// Regime-Aware Risk Adjustment
// ===============================

if (marketRegime === "RANGING") {

  riskScore -= 10;

  reasons.push(
    "Ranging market reduces trade reliability."
  );

}

if (marketRegime === "VOLATILE") {

  riskScore -= 5;

  reasons.push(
    "High volatility increases trade risk."
  );

}

if (
  marketRegime === "TRENDING_BULLISH" &&
  data.trend === "Bullish"
) {

  trendScore += 8;

  reasons.push(
    "Bullish trend is supported by the market regime."
  );

}

if (
  marketRegime === "TRENDING_BEARISH" &&
  data.trend === "Bearish"
) {

  trendScore -= 8;

  reasons.push(
    "Bearish trend is supported by the market regime."
  );

}

// ===============================
// Final AI Score Calculation
// ===============================

const confluenceBonus =
  confirmationScore >= 70
    ? 25
    : confirmationScore >= 50
      ? 15
      : 0;


score =
  50 +
  trendScore +
  momentumScore +
  patternScore +
  movingAverageScore +
  structureScore +
  breakoutScore +
  volumeScore +
  entryScore +
  confluenceBonus;


// ===============================
// Ranging Market Score Penalty
// ===============================

if (marketRegime === "RANGING") {

  if (confirmationScore < 70) {

    score -= 20;

    reasons.push(
      "Ranging market reduces score because confirmation is insufficient."
    );

  }

}

// Limit the risk penalty so it cannot completely destroy
// an otherwise valid directional setup.
const riskPenalty = Math.max(-15, riskScore);

score += riskPenalty;

console.log("📊 V1 SCORE CALCULATION:", {
  startingScore: 50,
  trendScore,
  momentumScore,
  patternScore,
  movingAverageScore,
  structureScore,
  breakoutScore,
  volumeScore,
  entryScore,
  confirmationScore,
  confluenceBonus,
  riskScore,
  riskPenalty,
  rsi: data.rsi,
  scoreBeforeClamp: score,
});

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

console.log("⚠️ RISK SCORE DEBUG:", {
  riskScore,
  riskPenalty,
  rsi: data.rsi,
});

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
  confirmationScore < 40
) {

  marketTradable = false;

  reasons.push(
    "Market is sideways with weak confirmation."
  );

}

// ===============================
// Regime-Specific Entry Filter
// ===============================

let regimeEntryAllowed = true;

if (marketRegime === "RANGING") {

  regimeEntryAllowed = false;

}

if (marketRegime === "VOLATILE") {

  regimeEntryAllowed =
    confirmationScore >= 80 &&
    entryScore >= 5;

}


// ===============================
// Final Entry Blockers
// ===============================

// These are hard blockers for a fresh BUY.
// A high score must NOT override them.

const buyEntryBlocked =
  data.trend === "Bullish" &&
  (
    (data.rsi !== null && data.rsi >= 90) ||
    entryScore < 4 ||
    confirmationScore < 50 ||
    !marketTradable ||
    !regimeEntryAllowed
  );


// These are hard blockers for a fresh SELL.

const sellEntryBlocked =
  data.trend === "Bearish" &&
  (
    (data.rsi !== null && data.rsi <= 10) ||
    entryScore < 5 ||
    !marketTradable ||
    !regimeEntryAllowed
  );


console.log("🔎 FINAL ENTRY GATE:", {

  score,

  trendInput: data.trend,

  confirmationScore,

  entryScore,

  marketTradable,

  marketRegime,

  regimeEntryAllowed,

  rsi: data.rsi,

  buyEntryBlocked,

  sellEntryBlocked,

});


// ===============================
// FINAL ACTION DECISION
// ===============================

if (
  score >= 75 &&
  data.trend === "Bullish" &&
  !buyEntryBlocked
) {

  trend = "Bullish";

  action = "BUY";

}

else if (
  score <= 25 &&
  data.trend === "Bearish" &&
  !sellEntryBlocked &&
  bearishConfirmations >= 4
) {

  trend = "Bearish";

  action = "SELL";

}

else if (
  score >= 60 &&
  score < 75 &&
  marketTradable &&
  regimeEntryAllowed
) {

  trend =
    trendScore >= 0
      ? "Bullish"
      : "Bearish";

  action = "WATCH";

}

else {

  trend = "Neutral";

  action = "WAIT";

}


console.log("🚦 FINAL ACTION DECISION:", {

  action,

  trend,

  score,

  trendInput: data.trend,

  marketTradable,

  confirmationScore,

  entryScore,

  regimeEntryAllowed,

  marketRegime,

  rsi: data.rsi,

  buyEntryBlocked,

  sellEntryBlocked,

});

if (
  action === "BUY" &&
  score >= 75 &&
  marketRegime !== "RANGING"
) {

  marketCondition = "Strong Bullish";

  riskLevel = "Medium";

  advice = "Look for confirmation before entry";

}

else if (
  action === "SELL" &&
  score <= 25 &&
  marketRegime !== "RANGING"
) {

  marketCondition = "Strong Bearish";

  riskLevel = "High";

  advice = "Avoid long positions";

}

else if (marketRegime === "RANGING") {

  marketCondition = "Sideways Market";

  riskLevel = "High";

  advice = "Wait for a clearer setup";

}

else {

  marketCondition = "Mixed Market";

  riskLevel = "Medium";

  advice = "Wait for confirmation";

}

// ===============================
// Trade Opportunity Rating
// ===============================

let opportunityRating = "Poor";

if (
  score >= 90 &&
  tradeQuality === "A+"
) {

  opportunityRating = "Excellent";

}

else if (
  score >= 75 &&
  tradeQuality === "A"
) {

  opportunityRating = "Good";

}

else if (
  score >= 60
) {

  opportunityRating = "Average";

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

// Confidence should measure the STRENGTH of the setup,
// not the DIRECTION of the setup.

let probability = 50;

probability += Math.abs(trendScore) * 0.8;

probability += Math.abs(momentumScore) * 0.5;

probability += Math.abs(movingAverageScore) * 0.5;

probability += Math.abs(breakoutScore) * 0.7;

probability += Math.abs(volumeScore) * 0.4;

probability += Math.abs(patternScore) * 0.6;

probability += Math.abs(structureScore) * 0.4;

// Risk should remain directional.
probability += riskScore * 0.3;

// ===============================
// Market Regime Probability Adjustment
// ===============================

if (marketRegime === "RANGING") {

  probability -= 20;

}

if (marketRegime === "VOLATILE") {

  probability -= 5;

}

if (
  marketRegime === "TRENDING_BULLISH" &&
  data.trend === "Bullish"
) {

  probability += 8;

}

if (
  marketRegime === "TRENDING_BEARISH" &&
  data.trend === "Bearish"
) {

  probability += 8;

}

// ===============================
// Extreme RSI Probability Adjustment
// ===============================

// Extremely overbought conditions reduce
// the reliability of a fresh BUY.
if (data.rsi !== null && data.rsi >= 85) {

  if (data.trend === "Bullish") {

    probability -= 15;

  }

}

// Extremely oversold conditions reduce
// the reliability of a fresh SELL.
if (data.rsi !== null && data.rsi <= 15) {

  if (data.trend === "Bearish") {

    probability -= 15;

  }

}

console.log("🧮 V1 PROBABILITY BREAKDOWN:", {
  trendScore,
  momentumScore,
  movingAverageScore,
  breakoutScore,
  volumeScore,
  patternScore,
  structureScore,
  riskScore,

  marketRegime,
  marketTradable,

  probabilityBeforeClamp: probability,
});

// ===============================
// Clamp Probability
// ===============================

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

console.log("🔎 CONFLICT ENGINE START:", {
  trend: data.trend,
  macd: data.macd,
  ema20: data.ema20,
  ema50: data.ema50,
  rsi: data.rsi,
});

// ---------------------------------
// MACD Conflict
// ---------------------------------

if (
  data.trend === "Bullish" &&
  data.macd !== null &&
  data.macd < 0
) {
  conflicts++;

  console.log("⚠️ CONFLICT ADDED: MACD", {
    conflicts,
    trend: data.trend,
    macd: data.macd,
  });
}


// ---------------------------------
// Moving Average Conflict
// ---------------------------------

if (
  data.trend === "Bullish" &&
  data.ema20 !== null &&
  data.ema50 !== null &&
  data.ema20 < data.ema50
) {
  conflicts++;

  console.log("⚠️ CONFLICT ADDED: EMA", {
    conflicts,
    trend: data.trend,
    ema20: data.ema20,
    ema50: data.ema50,
  });
}

if (
  data.trend === "Bearish" &&
  data.ema20 !== null &&
  data.ema50 !== null &&
  data.ema20 > data.ema50
) {
  conflicts++;

  console.log("⚠️ CONFLICT ADDED: EMA", {
    conflicts,
    trend: data.trend,
    ema20: data.ema20,
    ema50: data.ema50,
  });
}


// ---------------------------------
// RSI Extreme Entry Conflict
// ---------------------------------

if (
  data.rsi !== null &&
  data.trend === "Bullish" &&
  data.rsi >= 80
) {
  conflicts++;

  console.log("⚠️ CONFLICT ADDED: EXTREME RSI BUY", {
    conflicts,
    trend: data.trend,
    rsi: data.rsi,
  });

  reasons.push(
    "RSI is extremely overbought, reducing entry confidence."
  );
}


// ---------------------------------
// Momentum Conflict
// ---------------------------------

if (
  data.trend === "Bullish" &&
  momentumScore <= 0
) {
  conflicts++;

  reasons.push(
    "Bullish trend is not supported by sufficient momentum."
  );
}

if (
  data.trend === "Bearish" &&
  momentumScore >= 0
) {
  conflicts++;

  reasons.push(
    "Bearish trend is not supported by sufficient momentum."
  );
}


// ---------------------------------
// Resistance / Support Entry Conflict
// ---------------------------------

if (
  data.trend === "Bullish" &&
  riskScore <= -8
) {
  conflicts++;

  reasons.push(
    "Risk conditions are unfavorable for a bullish entry."
  );
}

if (
  data.trend === "Bearish" &&
  riskScore <= -8
) {
  conflicts++;

  reasons.push(
    "Risk conditions are unfavorable for a bearish entry."
  );
}


// Conflicting indicators reduce confidence

console.log("🧮 CONFLICT PENALTY:", {
  conflicts,
  penalty: conflicts * 8,
  confidenceBeforePenalty: confidence,
});

confidence -= conflicts * 8;

// ===============================
// Confirmation Contribution
// ===============================

confidence += Math.floor(
  confirmationScore / 5
);


// ===============================
// Market Tradability Penalty
// ===============================

if (!marketTradable) {
  confidence -= 10;
}


// ===============================
// Ranging Market Penalty
// ===============================

if (marketRegime === "RANGING") {
  confidence -= 10;
}


// ===============================
// Trend Agreement
// ===============================

if (
  trend === "Bullish" &&
  trendScore > 0 &&
  conflicts === 0
) {
  confidence += 5;
}

if (
  trend === "Bearish" &&
  trendScore < 0 &&
  conflicts === 0
) {
  confidence += 5;
}

// ===============================
// Probability / Confidence Consistency
// ===============================

if (
  probability >= 85 &&
  conflicts === 0
) {
  confidence += 5;
}

if (probability < 60) {
  confidence -= 10;
}


// ===============================
// Keep Confidence Within Limits
// ===============================

confidence = Math.max(
  0,
  Math.min(
    100,
    Math.round(confidence)
  )
);

console.log("🔬 ===== CONFIDENCE ENGINE DEBUG =====");

console.log({
  probability,
  confirmationScore,
  conflicts,

  trendScore,
  momentumScore,
  movingAverageScore,
  breakoutScore,
  volumeScore,
  patternScore,
  structureScore,
  riskScore,

  marketTradable,
  marketRegime,

  action,
  trend,

  rsi: data.rsi,
  trendInput: data.trend,
  breakoutInput: data.breakout,
  volumeInput: data.volumeStrength,
  marketStructureInput: data.marketStructure,

  reasons,
});

console.log(
  "📊 V1 CONFIDENCE CALCULATION:",
  {
    probability,
    conflicts,
    confirmationScore,
    marketTradable,
    marketRegime,
    trend,
    trendScore,
    confidence,
  }
);

// ===============================
// Trade Quality Engine
// ===============================

if (action === "BUY") {

  if (score >= 90 && confidence >= 85) {

    tradeQuality = "A+";

  }

  else if (score >= 75 && confidence >= 75) {

    tradeQuality = "A";

  }

  else if (confidence >= 60) {

    tradeQuality = "B";

  }

  else {

    tradeQuality = "C";

  }

}

else if (action === "SELL") {

  if (score <= 10 && confidence >= 85) {

    tradeQuality = "A+";

  }

  else if (score <= 25 && confidence >= 75) {

    tradeQuality = "A";

  }

  else if (confidence >= 60) {

    tradeQuality = "B";

  }

  else {

    tradeQuality = "C";

  }

}

else if (action === "WATCH") {

  tradeQuality = "B";

}

else {

  tradeQuality = "C";

}

// ===============================
// Final Action / Quality Consistency
// ===============================

if (action === "WAIT") {

  tradeQuality = "C";

}

if (action === "WATCH") {

  tradeQuality = "B";

}

// ===============================
// Final Decision Validator
// ===============================

if (

  action === "BUY" &&

  data.marketStructure === "SIDEWAYS" &&

  confirmationScore < 60

) {

  action = "WAIT";

  reasons.push(

    "BUY rejected because the market is still ranging."

  );

}

if (

  action === "SELL" &&

  data.marketStructure === "SIDEWAYS" &&

  bearishConfirmations < 5

) {

  action = "WAIT";

  reasons.push(

    "SELL rejected because the market is still ranging."

  );

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

else if (

  tradeQuality === "B" &&

  action === "BUY"

) {

  action = "WATCH";

  reasons.push(

    "BUY setup requires additional confirmation."

  );

}

else if (

  tradeQuality === "B" &&

  action === "SELL"

) {

  action = "WATCH";

  reasons.push(

    "SELL setup requires additional confirmation."

  );

}

return {
  trend,
  confidence,
  probability,
  tradeQuality,
  opportunityRating,

  marketRegime,
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