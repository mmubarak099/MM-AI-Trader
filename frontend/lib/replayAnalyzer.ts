import {
  analyzeMarket as analyzeMarketV1,
} from "./aiEngine";

import {
  analyzeRealTimeframe,
} from "./realMarketAnalyzer";

import {
  analyzeMultiTimeframe,
} from "./multiTimeframeAnalyzer";


export type ReplayAnalyzerCandle = {
  time: Date | string;

  open: number;
  high: number;
  low: number;
  close: number;

  volume?: number;
};


export type ReplayAnalyzerInput = {
  currentIndex: number;

  warmup5m:
    ReplayAnalyzerCandle[];

  warmup1m:
    ReplayAnalyzerCandle[];

  candles5m:
    ReplayAnalyzerCandle[];

  candles1m:
    ReplayAnalyzerCandle[];
};


export function analyzeReplayCandle(
  input: ReplayAnalyzerInput
) {

  const {
    currentIndex,
    warmup5m,
    warmup1m,
    candles5m,
    candles1m,
  } = input;


  const replayCurrentCandle =
    candles5m[
      currentIndex
    ];


  if (!replayCurrentCandle) {
    return null;
  }


  // ======================================
  // 5m DATA UP TO CURRENT REPLAY CANDLE
  // ======================================

  const replay5mSoFar =
    candles5m.slice(
      0,
      currentIndex + 1
    );


  // ======================================
  // CURRENT REPLAY TIME
  // ======================================

  const replayTime =
    new Date(
      replayCurrentCandle.time
    ).getTime();


  // ======================================
  // 1m DATA UP TO CURRENT REPLAY TIME
  // ======================================

  const replay1mSoFar =
    candles1m.filter(
      candle =>
        new Date(
          candle.time
        ).getTime() <=
        replayTime
    );


  // ======================================
  // ADD WARM-UP HISTORY
  // ======================================

  const full5mHistory = [
    ...warmup5m,
    ...replay5mSoFar,
  ];


  const full1mHistory = [
    ...warmup1m,
    ...replay1mSoFar,
  ];


  const currentReplayPrice =
    replayCurrentCandle.close;


  // ======================================
  // SAME TIMEFRAME ANALYSIS AS REPLAY UI
  // ======================================

  const analysis5m =
    analyzeRealTimeframe(
      full5mHistory,
      currentReplayPrice
    );


  const analysis1m =
    analyzeRealTimeframe(
      full1mHistory,
      currentReplayPrice
    );


  if (
    !analysis5m ||
    !analysis1m
  ) {
    return null;
  }


  // ======================================
  // MULTI-TIMEFRAME
  // ======================================

  const multiTimeframe =
    analyzeMultiTimeframe(
      analysis5m,
      analysis1m
    );


  if (!multiTimeframe) {
    return null;
  }


  // ======================================
  // V1
  // ======================================

  const replayV1 =
    analyzeMarketV1({

      price:
        replayCurrentCandle.close,

      previousPrice:
        replayCurrentCandle.open,

      trend:
        analysis5m.trend,

      rsi:
        analysis5m.rsi,

      ema20:
        analysis5m.ema20,

      ema50:
        analysis5m.ema50,

      macd:
        analysis5m.macd,

      pattern:
        analysis5m.pattern,

      support:
        analysis5m.support,

      resistance:
        analysis5m.resistance,

      marketStructure:
        analysis5m.marketStructure,

      breakout:
        analysis5m.breakout,

      volumeStrength:
        "NORMAL",
    });


  // ======================================
  // SAME 6 CONFIRMATIONS
  // ======================================

  const isBuyCandidate =
    replayV1.action === "BUY";


  const isSellCandidate =
    replayV1.action === "SELL";


  const confirmationChecks = [

    // 1. Trend
    isBuyCandidate
      ? analysis5m.trend ===
          "Bullish"
      : isSellCandidate
      ? analysis5m.trend ===
          "Bearish"
      : false,


    // 2. Pattern
    isBuyCandidate
      ? (
          analysis5m.pattern ===
            "Bullish Engulfing" ||
          analysis5m.pattern ===
            "Hammer"
        )
      : isSellCandidate
      ? analysis5m.pattern ===
          "Bearish Engulfing"
      : false,


    // 3. Structure
    isBuyCandidate
      ? analysis5m.marketStructure ===
          "UPTREND"
      : isSellCandidate
      ? analysis5m.marketStructure ===
          "DOWNTREND"
      : false,


    // 4. Breakout
    isBuyCandidate
      ? analysis5m.breakout ===
          "BREAKOUT"
      : isSellCandidate
      ? analysis5m.breakout ===
          "BREAKDOWN"
      : false,


    // 5. Volume
    false,


    // 6. Confidence
    replayV1.confidence >= 90,
  ];


  const confirmations =
    confirmationChecks.filter(
      Boolean
    ).length;


  // ======================================
  // SAME REPLAY QUALIFICATION
  // ======================================

  const directionMatches =
    (
      replayV1.action === "BUY" ||
      replayV1.action === "SELL"
    ) &&
    replayV1.action ===
      multiTimeframe.direction;


  const entryReady =
    multiTimeframe.entryState ===
      "READY";


  const confidenceReady =
    replayV1.confidence >= 90;


  const confirmationsReady =
    confirmations >= 4;


  const qualified =
    directionMatches &&
    entryReady &&
    confidenceReady &&
    confirmationsReady;


  return {

    replayIndex:
      currentIndex,

    candle:
      currentIndex + 1,

    price:
      replayCurrentCandle.close,

    action:
      qualified
        ? replayV1.action
        : "WAIT",

    qualified,

    confidence:
      replayV1.confidence,

    confirmations,

    v1Direction:
      replayV1.action,

    mtfDirection:
      multiTimeframe.direction,

    entryState:
      multiTimeframe.entryState,

    analysis5m,

    analysis1m,

    multiTimeframe,

    replayV1,
  };
}