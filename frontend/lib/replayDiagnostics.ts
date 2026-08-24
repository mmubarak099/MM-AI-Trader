// ==========================================
// Replay Diagnostics
//
// IMPORTANT:
// This diagnostic mirrors the CURRENT
// tradeManager lifecycle using Replay
// candle CLOSE prices.
//
// It does NOT replace tradeManager.ts.
// tradeManager.ts remains the authority.
// ==========================================


export type ReplayDiagnosticCandle = {
  time: Date | string;

  open: number;
  high: number;
  low: number;
  close: number;

  volume?: number;
};


export type ReplayDiagnosticInput = {
  candleIndex: number;

  action:
    | "BUY"
    | "SELL";

  entry: number;

  candles: ReplayDiagnosticCandle[];

  stopLossDistance?: number;

  target1Distance?: number;

  target2Distance?: number;
};


export type ReplayDiagnosticResult = {
  candle: number;

  action:
    | "BUY"
    | "SELL";

  entry: number;

  bestFavorableMove: number;

  worstAdverseMove: number;


  // ======================================
  // Protection / target lifecycle
  // ======================================

  reachesProtection8: boolean;

  reachesProtection15: boolean;

  reachesProtection25: boolean;

  reachesTarget1: boolean;

  reachesTarget2: boolean;

  hitsOriginalStop: boolean;


  // ======================================
  // First lifecycle event
  // ======================================

  firstOutcome:
    | "STOP_LOSS"
    | "PROTECTION_8"
    | "PROTECTION_15"
    | "PROTECTION_25"
    | "TARGET_1"
    | "TARGET_2"
    | "NONE";

  firstOutcomeCandle:
    number | null;


  // ======================================
  // Actual simulated lifecycle result
  // ======================================

  result:
    | "WIN"
    | "LOSS"
    | "BREAKEVEN"
    | "OPEN";

  tradeClosed: boolean;

  exitPrice:
    number | null;

  exitCandle:
    number | null;

  finalStopLoss: number;

  target1Hit: boolean;

  target2Hit: boolean;

  partialProfitBooked: boolean;

  runnerActivated: boolean;

  remainingPosition: number;

  realizedPnL: number;

  processedCandles: number;
};


// ==========================================
// Helpers
// ==========================================

function round2(
  value: number
): number {

  return Number(
    value.toFixed(2)
  );
}


// ==========================================
// Analyze One Replay Opportunity
// ==========================================

export function analyzeReplayOpportunity(
  input: ReplayDiagnosticInput
): ReplayDiagnosticResult {

  const {
    candleIndex,
    action,
    entry,
    candles,
    stopLossDistance = 20,
    target1Distance = 30,
    target2Distance = 60,
  } = input;


  // ======================================
  // Trade levels
  // ======================================

  const originalStopLoss =
    action === "BUY"
      ? entry - stopLossDistance
      : entry + stopLossDistance;


  const target1 =
    action === "BUY"
      ? entry + target1Distance
      : entry - target1Distance;


  const target2 =
    action === "BUY"
      ? entry + target2Distance
      : entry - target2Distance;


  // ======================================
  // Internal trade state
  //
  // Mirrors the state used by updateTrade()
  // ======================================

  let stopLoss =
    originalStopLoss;

  let target1Hit = false;

  let target2Hit = false;

  let partialProfitBooked = false;

  let remainingPosition = 100;

  let realizedPnL = 0;

  let highestPrice =
    entry;

  let lowestPrice =
    entry;

  let runnerActivated = false;


  let tradeClosed = false;

  let result:
    ReplayDiagnosticResult["result"] =
      "OPEN";

  let exitPrice:
    number | null = null;

  let exitCandle:
    number | null = null;


  // ======================================
  // Diagnostic measurements
  //
  // IMPORTANT:
  // These stop updating when the simulated
  // trade closes.
  // ======================================

  let bestFavorableMove = 0;

  let worstAdverseMove = 0;


  let reachesProtection8 = false;

  let reachesProtection15 = false;

  let reachesProtection25 = false;

  let reachesTarget1 = false;

  let reachesTarget2 = false;

  let hitsOriginalStop = false;


  let firstOutcome:
    ReplayDiagnosticResult["firstOutcome"] =
      "NONE";

  let firstOutcomeCandle:
    number | null = null;


  let processedCandles = 0;


  // ======================================
  // Future Replay candles
  //
  // Entry candle itself is NOT processed.
  // This matches the deterministic Replay
  // trade-management architecture.
  // ======================================

  const futureCandles =
    candles.slice(
      candleIndex + 1
    );


  // ======================================
  // Process future Replay CLOSE prices
  // ======================================

  for (
    let i = 0;
    i < futureCandles.length;
    i++
  ) {

    if (tradeClosed) {
      break;
    }


    const candle =
      futureCandles[i];


    const currentPrice =
      candle.close;


    const replayCandleNumber =
      candleIndex + i + 2;


    processedCandles += 1;


    // ======================================
    // Update extrema
    //
    // tradeManager receives only
    // currentPrice, which in Replay is
    // replayCurrentCandle.close.
    // ======================================

    highestPrice =
      Math.max(
        highestPrice,
        currentPrice
      );


    lowestPrice =
      Math.min(
        lowestPrice,
        currentPrice
      );


    // ======================================
    // Favorable / adverse movement
    // while trade is alive
    // ======================================

    const favorableMove =
      action === "BUY"
        ? currentPrice - entry
        : entry - currentPrice;


    const adverseMove =
      action === "BUY"
        ? entry - currentPrice
        : currentPrice - entry;


    bestFavorableMove =
      Math.max(
        bestFavorableMove,
        favorableMove,
        0
      );


    worstAdverseMove =
      Math.max(
        worstAdverseMove,
        adverseMove,
        0
      );


    // ======================================
    // Target checks
    // ======================================

    const hitTarget1 =
      action === "BUY"
        ? currentPrice >= target1
        : currentPrice <= target1;


    const hitTarget2 =
      action === "BUY"
        ? currentPrice >= target2
        : currentPrice <= target2;


    // ======================================
    // TARGET 1
    //
    // Mirrors tradeManager:
    //
    // - mark T1
    // - book 50%
    // - protect remaining at T1
    // ======================================

    if (
      hitTarget1 &&
      !target1Hit
    ) {

      target1Hit = true;

      reachesTarget1 = true;

      partialProfitBooked = true;

      remainingPosition = 50;


      const bookedProfit =
        action === "BUY"
          ? target1 - entry
          : entry - target1;


      realizedPnL =
        round2(
          bookedProfit * 0.5
        );


      stopLoss =
        target1;


      if (
        firstOutcome === "NONE"
      ) {

        firstOutcome =
          "TARGET_1";

        firstOutcomeCandle =
          replayCandleNumber;
      }
    }


    // ======================================
    // Dynamic Profit Protection
    // BEFORE TARGET 1
    //
    // +8  -> breakeven
    // +15 -> lock +5
    // +25 -> lock +15
    //
    // Uses highest/lowest observed CLOSE,
    // exactly like updateTrade() receives
    // from Replay.
    // ======================================

    if (!target1Hit) {

      if (
        action === "BUY"
      ) {

        const favorableFromHigh =
          highestPrice - entry;


        // +25 -> lock +15
        if (
          favorableFromHigh >= 25
        ) {

          const protectedSL =
            entry + 15;


          if (
            protectedSL > stopLoss
          ) {

            stopLoss =
              round2(
                protectedSL
              );


            reachesProtection25 =
              true;


            if (
              firstOutcome === "NONE"
            ) {

              firstOutcome =
                "PROTECTION_25";

              firstOutcomeCandle =
                replayCandleNumber;
            }
          }


        // +15 -> lock +5
        } else if (
          favorableFromHigh >= 15
        ) {

          const protectedSL =
            entry + 5;


          if (
            protectedSL > stopLoss
          ) {

            stopLoss =
              round2(
                protectedSL
              );


            reachesProtection15 =
              true;


            if (
              firstOutcome === "NONE"
            ) {

              firstOutcome =
                "PROTECTION_15";

              firstOutcomeCandle =
                replayCandleNumber;
            }
          }


        // +8 -> breakeven
        } else if (
          favorableFromHigh >= 8
        ) {

          const protectedSL =
            entry;


          if (
            protectedSL > stopLoss
          ) {

            stopLoss =
              round2(
                protectedSL
              );


            reachesProtection8 =
              true;


            if (
              firstOutcome === "NONE"
            ) {

              firstOutcome =
                "PROTECTION_8";

              firstOutcomeCandle =
                replayCandleNumber;
            }
          }
        }


      } else {

        const favorableFromLow =
          entry - lowestPrice;


        // +25 -> lock +15
        if (
          favorableFromLow >= 25
        ) {

          const protectedSL =
            entry - 15;


          if (
            protectedSL < stopLoss
          ) {

            stopLoss =
              round2(
                protectedSL
              );


            reachesProtection25 =
              true;


            if (
              firstOutcome === "NONE"
            ) {

              firstOutcome =
                "PROTECTION_25";

              firstOutcomeCandle =
                replayCandleNumber;
            }
          }


        // +15 -> lock +5
        } else if (
          favorableFromLow >= 15
        ) {

          const protectedSL =
            entry - 5;


          if (
            protectedSL < stopLoss
          ) {

            stopLoss =
              round2(
                protectedSL
              );


            reachesProtection15 =
              true;


            if (
              firstOutcome === "NONE"
            ) {

              firstOutcome =
                "PROTECTION_15";

              firstOutcomeCandle =
                replayCandleNumber;
            }
          }


        // +8 -> breakeven
        } else if (
          favorableFromLow >= 8
        ) {

          // IMPORTANT:
          // Matches confirmed SELL precision fix.
          const protectedSL =
            round2(
              entry
            );


          if (
            protectedSL < stopLoss
          ) {

            stopLoss =
              protectedSL;


            reachesProtection8 =
              true;


            if (
              firstOutcome === "NONE"
            ) {

              firstOutcome =
                "PROTECTION_8";

              firstOutcomeCandle =
                replayCandleNumber;
            }
          }
        }
      }
    }


    // ======================================
    // TARGET 2
    //
    // Runner activates.
    // Trade does NOT close here.
    // ======================================

    if (
      hitTarget2 &&
      !target2Hit
    ) {

      target2Hit = true;

      reachesTarget2 = true;

      runnerActivated = true;

      remainingPosition = 50;


      if (
        firstOutcome === "NONE"
      ) {

        firstOutcome =
          "TARGET_2";

        firstOutcomeCandle =
          replayCandleNumber;
      }
    }


    // ======================================
    // RUNNER PROTECTION AFTER TARGET 2
    //
    // Must also have partial profit booked.
    //
    // Before +10 beyond T2:
    // protect exactly at T2.
    //
    // After +10 beyond T2:
    // BUY  -> highest - 20
    // SELL -> lowest + 20
    //
    // T2 remains the protection floor /
    // ceiling.
    // ======================================

    if (
      target2Hit &&
      partialProfitBooked &&
      remainingPosition > 0
    ) {

      const runnerActivationDistance =
        10;

      const runnerGiveback =
        20;


      if (
        action === "BUY"
      ) {

        const runnerMove =
          highestPrice - target2;


        if (
          runnerMove <
          runnerActivationDistance
        ) {

          if (
            stopLoss < target2
          ) {

            stopLoss =
              round2(
                target2
              );
          }


        } else {

          const runnerSL =
            highestPrice -
            runnerGiveback;


          const protectedSL =
            Math.max(
              target2,
              runnerSL
            );


          if (
            protectedSL > stopLoss
          ) {

            stopLoss =
              round2(
                protectedSL
              );
          }
        }


      } else {

        const runnerMove =
          target2 - lowestPrice;


        if (
          runnerMove <
          runnerActivationDistance
        ) {

          if (
            stopLoss > target2
          ) {

            stopLoss =
              round2(
                target2
              );
          }


        } else {

          const runnerSL =
            lowestPrice +
            runnerGiveback;


          const protectedSL =
            Math.min(
              target2,
              runnerSL
            );


          if (
            protectedSL < stopLoss
          ) {

            stopLoss =
              round2(
                protectedSL
              );
          }
        }
      }
    }


    // ======================================
    // FINAL STOP LOSS CHECK
    //
    // IMPORTANT:
    // This happens AFTER all protection
    // logic, matching tradeManager.ts.
    // ======================================

    const hitStopLoss =
      action === "BUY"
        ? currentPrice <= stopLoss
        : currentPrice >= stopLoss;


    if (hitStopLoss) {

      const stopExecutionPrice =
        stopLoss;


      // ====================================
      // Was this still the ORIGINAL stop?
      // ====================================

      const originalStopWasActive =
        round2(stopLoss) ===
        round2(originalStopLoss);


      if (
        originalStopWasActive
      ) {

        hitsOriginalStop =
          true;
      }


      // ====================================
      // Final realized P/L
      // ====================================

      if (
        partialProfitBooked
      ) {

        const remainingProfit =
          action === "BUY"
            ? stopExecutionPrice - entry
            : entry - stopExecutionPrice;


        realizedPnL =
          round2(
            realizedPnL +
            remainingProfit * 0.5
          );


      } else {

        realizedPnL =
          round2(
            action === "BUY"
              ? stopExecutionPrice - entry
              : entry - stopExecutionPrice
          );
      }


      result =
        realizedPnL > 0
          ? "WIN"
          : realizedPnL < 0
          ? "LOSS"
          : "BREAKEVEN";


      remainingPosition = 0;

      tradeClosed = true;

      exitPrice =
        round2(
          stopExecutionPrice
        );

      exitCandle =
        replayCandleNumber;


      if (
        firstOutcome === "NONE"
      ) {

        firstOutcome =
          "STOP_LOSS";

        firstOutcomeCandle =
          replayCandleNumber;
      }


      // ====================================
      // STOP scanning immediately.
      //
      // This is the critical difference
      // from the old diagnostic.
      // ====================================

      break;
    }
  }


  // ======================================
  // Final Result
  // ======================================

  return {

    candle:
      candleIndex + 1,

    action,

    entry:
      round2(
        entry
      ),

    bestFavorableMove:
      round2(
        bestFavorableMove
      ),

    worstAdverseMove:
      round2(
        worstAdverseMove
      ),

    reachesProtection8,

    reachesProtection15,

    reachesProtection25,

    reachesTarget1,

    reachesTarget2,

    hitsOriginalStop,

    firstOutcome,

    firstOutcomeCandle,

    result,

    tradeClosed,

    exitPrice,

    exitCandle,

    finalStopLoss:
      round2(
        stopLoss
      ),

    target1Hit,

    target2Hit,

    partialProfitBooked,

    runnerActivated,

    remainingPosition,

    realizedPnL:
      round2(
        realizedPnL
      ),

    processedCandles,
  };
}


// ==========================================
// Analyze Multiple Replay Opportunities
// ==========================================

export function analyzeReplayOpportunities(
  opportunities: {
    candleIndex: number;

    action:
      | "BUY"
      | "SELL";

    entry: number;
  }[],

  candles: ReplayDiagnosticCandle[]
): ReplayDiagnosticResult[] {

  return opportunities.map(
    opportunity =>
      analyzeReplayOpportunity({

        candleIndex:
          opportunity.candleIndex,

        action:
          opportunity.action,

        entry:
          opportunity.entry,

        candles,
      })
  );
}