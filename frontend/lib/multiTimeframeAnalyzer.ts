type TimeframeAnalysis = {
  trend: string;
  rsi: number | null;
  pattern: string;
  marketStructure: string;
  breakout: string;
};

export function analyzeMultiTimeframe(
  analysis5m: TimeframeAnalysis | null,
  analysis1m: TimeframeAnalysis | null
) {
  if (!analysis5m || !analysis1m) {
    return {
      direction: "WAIT",
      alignment: "NONE",
      entryState: "NOT_READY",
      reasons: ["Waiting for timeframe analysis"],
    };
  }

  const reasons: string[] = [];

// ===============================
// 5m Market Context
// ===============================

const bullish5mConfirmations = [
  analysis5m.trend === "Bullish",
  analysis5m.marketStructure === "UPTREND",
  analysis5m.breakout === "BREAKOUT",
].filter(Boolean).length;

const bearish5mConfirmations = [
  analysis5m.trend === "Bearish",
  analysis5m.marketStructure === "DOWNTREND",
  analysis5m.breakout === "BREAKDOWN",
].filter(Boolean).length;

// Require the 5m trend plus at least
// one additional market-context confirmation.

const bullishContext =
  analysis5m.trend === "Bullish" &&
  bullish5mConfirmations >= 2;

const bearishContext =
  analysis5m.trend === "Bearish" &&
  bearish5mConfirmations >= 2;


// ===============================
// 1m Entry Confirmation
// ===============================

const bullish1mConfirmations = [
  analysis1m.trend === "Bullish",
  analysis1m.marketStructure === "UPTREND",
  analysis1m.breakout === "BREAKOUT",
].filter(Boolean).length;

const bearish1mConfirmations = [
  analysis1m.trend === "Bearish",
  analysis1m.marketStructure === "DOWNTREND",
  analysis1m.breakout === "BREAKDOWN",
].filter(Boolean).length;

// Entry timing requires 2 of the 3
// short-term confirmations.

const bullishEntry =
  bullish1mConfirmations >= 2;

const bearishEntry =
  bearish1mConfirmations >= 2;

  const bearishExtended =
    (analysis5m.rsi !== null &&
      analysis5m.rsi <= 15) ||
    (analysis1m.rsi !== null &&
      analysis1m.rsi <= 20);

  const bullishExtended =
    (analysis5m.rsi !== null &&
      analysis5m.rsi >= 85) ||
    (analysis1m.rsi !== null &&
      analysis1m.rsi >= 80);

  if (bearishContext && bearishEntry) {
    reasons.push(
      "5m bearish context aligns with 1m bearish entry conditions."
    );

    if (bearishExtended) {
      reasons.push(
        "Bearish move is already extended; avoid chasing the entry."
      );

      return {
        direction: "SELL",
        alignment: "BEARISH",
        entryState: "EXTENDED",
        reasons,
      };
    }

    return {
      direction: "SELL",
      alignment: "BEARISH",
      entryState: "READY",
      reasons,
    };
  }

  if (bullishContext && bullishEntry) {
    reasons.push(
      "5m bullish context aligns with 1m bullish entry conditions."
    );

    if (bullishExtended) {
      reasons.push(
        "Bullish move is already extended; avoid chasing the entry."
      );

      return {
        direction: "BUY",
        alignment: "BULLISH",
        entryState: "EXTENDED",
        reasons,
      };
    }

    return {
      direction: "BUY",
      alignment: "BULLISH",
      entryState: "READY",
      reasons,
    };
  }

  if (
    analysis5m.trend !== analysis1m.trend
  ) {
    reasons.push(
      "1m entry direction conflicts with the 5m market context."
    );
  } else {
    reasons.push(
      "Entry timeframe does not yet have sufficient structure and breakout confirmation."
    );
  }

  return {
    direction: "WAIT",
    alignment: "MIXED",
    entryState: "NOT_READY",
    reasons,
  };
}