import {
  analyzeReplayCandle,
} from "./replayAnalyzer";

import {
  analyzeReplayOpportunity,
} from "./replayDiagnostics";

import type {
  ReplayAnalyzerCandle,
} from "./replayAnalyzer";


// ==========================================
// MULTI-DAY REPLAY SCANNER TYPES
// ==========================================

export type ReplayDayData = {

  date: string;

  warmup5m:
    ReplayAnalyzerCandle[];

  warmup1m:
    ReplayAnalyzerCandle[];

  candles5m:
    ReplayAnalyzerCandle[];

  candles1m:
    ReplayAnalyzerCandle[];
};


export type ReplayMultiDayCandidate = {

  date: string;

  candle: number;

  candleIndex: number;

  action:
    | "BUY"
    | "SELL";

  entry: number;

  confidence: number;

  confirmations: number;

  bestFavorableMove: number;

  worstAdverseMove: number;

  reachesProtection8: boolean;

  reachesProtection15: boolean;

  reachesProtection25: boolean;

  reachesTarget1: boolean;

  reachesTarget2: boolean;

  runnerActivated: boolean;

tradeClosed: boolean;

finalStopLoss: number;

exitReason:
  | "TRADE_MANAGER"
  | "END_OF_DAY";

result:
  | "WIN"
  | "LOSS"
  | "BREAKEVEN"
  | "OPEN";

  realizedPnL: number;
};

// ==========================================
// APPLY END-OF-DAY CLOSE
//
// Historical intraday rule:
//
// If Trade Manager has NOT closed the trade
// before the Replay session ends, close the
// remaining position at the final available
// 5m candle close.
//
// This is backtest accounting only.
// It does NOT modify Trade Manager.
// ==========================================

function applyReplayEndOfDayClose(
  diagnostic:
    ReturnType<
      typeof analyzeReplayOpportunity
    >,

  action:
    | "BUY"
    | "SELL",

  entry: number,

  candles:
    ReplayAnalyzerCandle[]
) {

  if (
    diagnostic.tradeClosed ||
    diagnostic.result !== "OPEN"
  ) {

    return {
      diagnostic,
      exitReason:
        "TRADE_MANAGER" as const,
    };
  }


  const lastCandle =
    candles[
      candles.length - 1
    ];


  if (!lastCandle) {

    return {
      diagnostic,
      exitReason:
        "TRADE_MANAGER" as const,
    };
  }


  const endOfDayPrice =
    Number(
      lastCandle.close
    );


  const fullPositionMove =
    action === "BUY"
      ? endOfDayPrice - entry
      : entry - endOfDayPrice;


  // If T1 was reached, 50% was already
  // booked and only the remaining 50%
  // must be closed at end of day.
  const finalRealizedPnL =
    diagnostic.partialProfitBooked
      ? Number(
          (
            diagnostic.realizedPnL +
            fullPositionMove * 0.5
          ).toFixed(2)
        )
      : Number(
          fullPositionMove.toFixed(2)
        );


const finalResult:
  | "WIN"
  | "LOSS"
  | "BREAKEVEN" =
    finalRealizedPnL > 0
      ? "WIN"
      : finalRealizedPnL < 0
      ? "LOSS"
      : "BREAKEVEN";

  return {

    diagnostic: {

      ...diagnostic,

      tradeClosed:
        true,

      result:
        finalResult,

      realizedPnL:
        finalRealizedPnL,

      exitCandle:
        candles.length,

      exitPrice:
        Number(
          endOfDayPrice.toFixed(2)
        ),
    },

    exitReason:
      "END_OF_DAY" as const,
  };
}

// ==========================================
// SCAN ONE REPLAY DAY
// ==========================================

export function scanReplayDay(
  data: ReplayDayData
): ReplayMultiDayCandidate[] {

  const results:
    ReplayMultiDayCandidate[] = [];


  // --------------------------------------
  // Process every 5m candle synchronously
  // --------------------------------------

  for (
    let currentIndex = 0;
    currentIndex <
      data.candles5m.length;
    currentIndex++
  ) {

    const analysis =
      analyzeReplayCandle({

        currentIndex,

        warmup5m:
          data.warmup5m,

        warmup1m:
          data.warmup1m,

        candles5m:
          data.candles5m,

        candles1m:
          data.candles1m,
      });


    if (
      !analysis ||
      !analysis.qualified ||
      (
        analysis.action !== "BUY" &&
        analysis.action !== "SELL"
      )
    ) {
      continue;
    }


    // ------------------------------------
    // Diagnostic lifecycle
    // ------------------------------------

    const diagnostic =
      analyzeReplayOpportunity({

        candleIndex:
          currentIndex,

        action:
          analysis.action,

        entry:
          analysis.price,

        candles:
          data.candles5m,
      });


    results.push({

      date:
        data.date,

      candle:
        analysis.candle,

      candleIndex:
        currentIndex,

      action:
        analysis.action,

      entry:
        analysis.price,

      confidence:
        analysis.confidence,

      confirmations:
        analysis.confirmations,

      bestFavorableMove:
        diagnostic.bestFavorableMove,

      worstAdverseMove:
        diagnostic.worstAdverseMove,

      reachesProtection8:
        diagnostic.reachesProtection8,

      reachesProtection15:
        diagnostic.reachesProtection15,

      reachesProtection25:
        diagnostic.reachesProtection25,

      reachesTarget1:
        diagnostic.reachesTarget1,

      reachesTarget2:
        diagnostic.reachesTarget2,

      runnerActivated:
        diagnostic.runnerActivated,

      result:
        diagnostic.result,

      realizedPnL:
        diagnostic.realizedPnL,

        tradeClosed:
  diagnostic.tradeClosed,

finalStopLoss:
  diagnostic.finalStopLoss,

  exitReason:
  "TRADE_MANAGER",

    });
  }


  return results;
}

// ==========================================
// SCAN ONE REPLAY DAY — EXECUTION AWARE
//
// Rules mirrored here:
//
// - qualification comes from analyzeReplayCandle()
// - same BUY/SELL must qualify twice consecutively
// - WAIT / non-qualified resets stability
// - opposite direction restarts stability
// - only one trade can exist at a time
// - while a trade is alive, later signals are ignored
// - scanning resumes only AFTER that trade closes
//
// Historical assumption:
// once stability reaches 2, the signal is
// considered taken immediately at that
// Replay candle close.
// ==========================================

export function scanReplayDayExecutable(
  data: ReplayDayData
): ReplayMultiDayCandidate[] {

  const results:
    ReplayMultiDayCandidate[] = [];


  let stableDirection:
    | "BUY"
    | "SELL"
    | null = null;


  let stableCount = 0;


  // Zero-based Replay index through which
  // an existing simulated trade is active.
  let blockedThroughIndex = -1;


  for (
    let currentIndex = 0;
    currentIndex <
      data.candles5m.length;
    currentIndex++
  ) {

    // ======================================
    // EXISTING TRADE STILL ACTIVE
    // ======================================

    if (
      currentIndex <=
      blockedThroughIndex
    ) {
      continue;
    }


    const analysis =
      analyzeReplayCandle({

        currentIndex,

        warmup5m:
          data.warmup5m,

        warmup1m:
          data.warmup1m,

        candles5m:
          data.candles5m,

        candles1m:
          data.candles1m,
      });


    // ======================================
    // WAIT / NOT QUALIFIED
    // → reset stability
    // ======================================

    if (
      !analysis ||
      !analysis.qualified ||
      (
        analysis.action !== "BUY" &&
        analysis.action !== "SELL"
      )
    ) {

      stableDirection = null;

      stableCount = 0;

      continue;
    }


    const direction =
      analysis.action;


    // ======================================
    // CONSECUTIVE DIRECTION STABILITY
    // ======================================

    if (
      stableDirection ===
      direction
    ) {

      stableCount += 1;

    } else {

      stableDirection =
        direction;

      stableCount = 1;
    }


// ======================================
// DIRECTIONAL STABILITY RULE
//
// BUY  -> requires 2 consecutive
//         qualified observations.
//
// SELL -> requires 1 qualified
//         observation.
// ======================================

const requiredStability =
  direction === "SELL"
    ? 1
    : 2;

if (
  stableCount <
  requiredStability
) {
  continue;
}


    // ======================================
    // STABLE SIGNAL CONFIRMED
    //
    // Treat this Replay close as the
    // historical execution entry.
    // ======================================

const rawDiagnostic =
  analyzeReplayOpportunity({

    candleIndex:
      currentIndex,

    action:
      direction,

    entry:
      analysis.price,

    candles:
      data.candles5m,
  });


const {
  diagnostic,
  exitReason,
} =
  applyReplayEndOfDayClose(

    rawDiagnostic,

    direction,

    analysis.price,

    data.candles5m
  );


results.push({

      date:
        data.date,

      candle:
        analysis.candle,

      candleIndex:
        currentIndex,

      action:
        direction,

      entry:
        analysis.price,

      confidence:
        analysis.confidence,

      confirmations:
        analysis.confirmations,

      bestFavorableMove:
        diagnostic.bestFavorableMove,

      worstAdverseMove:
        diagnostic.worstAdverseMove,

      reachesProtection8:
        diagnostic.reachesProtection8,

      reachesProtection15:
        diagnostic.reachesProtection15,

      reachesProtection25:
        diagnostic.reachesProtection25,

      reachesTarget1:
        diagnostic.reachesTarget1,

      reachesTarget2:
        diagnostic.reachesTarget2,

      runnerActivated:
        diagnostic.runnerActivated,

tradeClosed:
  diagnostic.tradeClosed,

finalStopLoss:
  diagnostic.finalStopLoss,

exitReason,

result:
  diagnostic.result,

      realizedPnL:
        diagnostic.realizedPnL,
    });


    // ======================================
    // SIGNAL USED
    // Reset stability exactly as the Replay
    // signal path does after confirmation.
    // ======================================

    stableDirection = null;

    stableCount = 0;


    // ======================================
    // BLOCK OVERLAPPING SIGNALS
    //
    // If trade closed:
    // ignore candles through its exit candle.
    //
    // If still OPEN at end of session:
    // block the rest of this day.
    // ======================================

    if (
      diagnostic.tradeClosed &&
      diagnostic.exitCandle !== null
    ) {

      blockedThroughIndex =
        diagnostic.exitCandle - 1;

    } else {

      blockedThroughIndex =
        data.candles5m.length - 1;
    }
  }


  return results;
}

// ==========================================
// HYPOTHETICAL EXECUTION TEST
//
// BUY:
// - current locked rule remains unchanged
// - requires 2 consecutive qualifications
//
// SELL:
// - evaluation only
// - requires 1 qualified observation
//
// IMPORTANT:
// This does NOT change the real Replay,
// V1, stability, or execution rules.
// ==========================================

export function scanReplayDayExecutableSellImmediate(
  data: ReplayDayData
): ReplayMultiDayCandidate[] {

  const results:
    ReplayMultiDayCandidate[] = [];


  let stableDirection:
    | "BUY"
    | "SELL"
    | null = null;


  let stableCount = 0;


  let blockedThroughIndex = -1;


  for (
    let currentIndex = 0;
    currentIndex <
      data.candles5m.length;
    currentIndex++
  ) {

    // ======================================
    // EXISTING TRADE STILL ACTIVE
    // ======================================

    if (
      currentIndex <=
      blockedThroughIndex
    ) {
      continue;
    }


    const analysis =
      analyzeReplayCandle({

        currentIndex,

        warmup5m:
          data.warmup5m,

        warmup1m:
          data.warmup1m,

        candles5m:
          data.candles5m,

        candles1m:
          data.candles1m,
      });


    // ======================================
    // WAIT / NOT QUALIFIED
    // ======================================

    if (
      !analysis ||
      !analysis.qualified ||
      (
        analysis.action !== "BUY" &&
        analysis.action !== "SELL"
      )
    ) {

      stableDirection = null;

      stableCount = 0;

      continue;
    }


    const direction =
      analysis.action;


    // ======================================
    // STABILITY TRACKING
    // ======================================

    if (
      stableDirection ===
      direction
    ) {

      stableCount += 1;

    } else {

      stableDirection =
        direction;

      stableCount = 1;
    }


    // ======================================
    // HYPOTHETICAL RULE
    //
    // BUY  -> still requires 2
    // SELL -> requires only 1
    // ======================================

    const requiredStability =
      direction === "SELL"
        ? 1
        : 2;


    if (
      stableCount <
      requiredStability
    ) {
      continue;
    }


    // ======================================
    // SIMULATE TRADE
    // ======================================

    const rawDiagnostic =
      analyzeReplayOpportunity({

        candleIndex:
          currentIndex,

        action:
          direction,

        entry:
          analysis.price,

        candles:
          data.candles5m,
      });


    const {
      diagnostic,
      exitReason,
    } =
      applyReplayEndOfDayClose(

        rawDiagnostic,

        direction,

        analysis.price,

        data.candles5m
      );


    results.push({

      date:
        data.date,

      candle:
        analysis.candle,

      candleIndex:
        currentIndex,

      action:
        direction,

      entry:
        analysis.price,

      confidence:
        analysis.confidence,

      confirmations:
        analysis.confirmations,

      bestFavorableMove:
        diagnostic.bestFavorableMove,

      worstAdverseMove:
        diagnostic.worstAdverseMove,

      reachesProtection8:
        diagnostic.reachesProtection8,

      reachesProtection15:
        diagnostic.reachesProtection15,

      reachesProtection25:
        diagnostic.reachesProtection25,

      reachesTarget1:
        diagnostic.reachesTarget1,

      reachesTarget2:
        diagnostic.reachesTarget2,

      runnerActivated:
        diagnostic.runnerActivated,

      tradeClosed:
        diagnostic.tradeClosed,

      finalStopLoss:
        diagnostic.finalStopLoss,

      exitReason,

      result:
        diagnostic.result,

      realizedPnL:
        diagnostic.realizedPnL,
    });


    // ======================================
    // SIGNAL USED
    // ======================================

    stableDirection = null;

    stableCount = 0;


    // ======================================
    // PREVENT OVERLAPPING TRADES
    // ======================================

    if (
      diagnostic.tradeClosed &&
      diagnostic.exitCandle !== null
    ) {

      blockedThroughIndex =
        diagnostic.exitCandle - 1;

    } else {

      blockedThroughIndex =
        data.candles5m.length - 1;
    }
  }


  return results;
}

// ==========================================
// FIND T2 / RUNNER CANDIDATES
// ==========================================

export function findReplayRunnerCandidates(
  candidates:
    ReplayMultiDayCandidate[]
) {

  return candidates.filter(
    candidate =>
      candidate.reachesTarget2 ||
      candidate.runnerActivated
  );
}

// ==========================================
// FIND COMPLETED RUNNER EXIT CANDIDATES
// ==========================================

export function findReplayRunnerExitCandidates(
  candidates:
    ReplayMultiDayCandidate[]
) {

  return candidates.filter(
    candidate =>
      candidate.runnerActivated &&
      candidate.result !== "OPEN" &&
      candidate.exitReason ===
        "TRADE_MANAGER"
  );
}
// ==========================================
// FIND OPEN RUNNER CANDIDATES
// ==========================================

export function findOpenReplayRunnerCandidates(
  candidates:
    ReplayMultiDayCandidate[]
) {

  return candidates.filter(
    candidate =>
      candidate.runnerActivated &&
      !candidate.tradeClosed
  );
}

// ==========================================
// MULTI-DAY REPLAY SUMMARY
// ==========================================

export type ReplayMultiDaySummary = {

  totalCandidates: number;

  buyCandidates: number;

  sellCandidates: number;

  wins: number;

  losses: number;

  breakevens: number;

  openTrades: number;

  target1Hits: number;

  target2Hits: number;

  runnerActivations: number;

  totalRealizedPnL: number;

  averageWin: number;

  averageLoss: number;

  winRate: number;

  lossRate: number;

  breakevenRate: number;
};


export function summarizeReplayCandidates(
  candidates:
    ReplayMultiDayCandidate[]
): ReplayMultiDaySummary {

  const totalCandidates =
    candidates.length;


  const buyCandidates =
    candidates.filter(
      candidate =>
        candidate.action === "BUY"
    ).length;


  const sellCandidates =
    candidates.filter(
      candidate =>
        candidate.action === "SELL"
    ).length;


  const wins =
    candidates.filter(
      candidate =>
        candidate.result === "WIN"
    );


  const losses =
    candidates.filter(
      candidate =>
        candidate.result === "LOSS"
    );


  const breakevens =
    candidates.filter(
      candidate =>
        candidate.result === "BREAKEVEN"
    );


  const openTrades =
    candidates.filter(
      candidate =>
        candidate.result === "OPEN"
    ).length;


  const target1Hits =
    candidates.filter(
      candidate =>
        candidate.reachesTarget1
    ).length;


  const target2Hits =
    candidates.filter(
      candidate =>
        candidate.reachesTarget2
    ).length;


  const runnerActivations =
    candidates.filter(
      candidate =>
        candidate.runnerActivated
    ).length;


  const totalRealizedPnL =
    Number(
      candidates
        .reduce(
          (
            total,
            candidate
          ) =>
            total +
            candidate.realizedPnL,
          0
        )
        .toFixed(2)
    );


  const averageWin =
    wins.length > 0
      ? Number(
          (
            wins.reduce(
              (
                total,
                candidate
              ) =>
                total +
                candidate.realizedPnL,
              0
            ) /
            wins.length
          ).toFixed(2)
        )
      : 0;


  const averageLoss =
    losses.length > 0
      ? Number(
          (
            losses.reduce(
              (
                total,
                candidate
              ) =>
                total +
                candidate.realizedPnL,
              0
            ) /
            losses.length
          ).toFixed(2)
        )
      : 0;


  const closedTrades =
    wins.length +
    losses.length +
    breakevens.length;


  const winRate =
    closedTrades > 0
      ? Number(
          (
            wins.length /
            closedTrades *
            100
          ).toFixed(2)
        )
      : 0;


  const lossRate =
    closedTrades > 0
      ? Number(
          (
            losses.length /
            closedTrades *
            100
          ).toFixed(2)
        )
      : 0;


  const breakevenRate =
    closedTrades > 0
      ? Number(
          (
            breakevens.length /
            closedTrades *
            100
          ).toFixed(2)
        )
      : 0;


  return {

    totalCandidates,

    buyCandidates,

    sellCandidates,

    wins:
      wins.length,

    losses:
      losses.length,

    breakevens:
      breakevens.length,

    openTrades,

    target1Hits,

    target2Hits,

    runnerActivations,

    totalRealizedPnL,

    averageWin,

    averageLoss,

    winRate,

    lossRate,

    breakevenRate,
  };
}