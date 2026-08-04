export interface AIScoreBreakdown {
  trend: number;
  ema: number;
  macd: number;
  rsi: number;
  vwap: number;
  pattern: number;
  volume: number;
  marketStructure: number;
  supportResistance: number;

  total: number;
  grade: string;
}

interface ScoreInput {
  trend: string;
  ema20: number;
  ema50: number;
  macd: number;
  rsi: number;
  vwap: number;
  currentPrice: number;
  pattern: string;
  volumeTrend: string;
  marketStructure: string;
}

export function calculateAIScore(
  data: ScoreInput
): AIScoreBreakdown {

  let trend = 0;
  let ema = 0;
  let macd = 0;
  let rsi = 0;
  let vwap = 0;
  let pattern = 0;
  let volume = 0;
  let structure = 0;
  let support = 5;

  // Trend
  if (data.trend === "Bullish")
    trend = 20;
  else if (data.trend === "Bearish")
    trend = 20;
  else
    trend = 8;

  // EMA
  ema =
    data.ema20 > data.ema50
      ? 15
      : 5;

  // MACD
  macd =
    data.macd > 0
      ? 15
      : 5;

  // RSI
  if (data.rsi >= 50 && data.rsi <= 70)
    rsi = 15;
  else if (data.rsi >= 40)
    rsi = 10;
  else
    rsi = 5;

  // VWAP
  vwap =
    data.currentPrice > data.vwap
      ? 10
      : 4;

  // Candlestick Pattern
  pattern =
    data.pattern !== "No Pattern"
      ? 10
      : 2;

  // Volume
  volume =
    data.volumeTrend === "High"
      ? 10
      : 5;

  // Market Structure
  structure =
    data.marketStructure === "Trending"
      ? 10
      : 5;

  const total =
    trend +
    ema +
    macd +
    rsi +
    vwap +
    pattern +
    volume +
    structure +
    support;

  let grade = "C";

  if (total >= 95)
    grade = "A+";
  else if (total >= 90)
    grade = "A";
  else if (total >= 80)
    grade = "B";
  else if (total >= 70)
    grade = "C";
  else
    grade = "D";

  return {
    trend,
    ema,
    macd,
    rsi,
    vwap,
    pattern,
    volume,
    marketStructure: structure,
    supportResistance: support,
    total,
    grade,
  };
}