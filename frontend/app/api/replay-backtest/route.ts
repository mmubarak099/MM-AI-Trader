import {
  NextResponse,
} from "next/server";

import {
  scanReplayDay,
  scanReplayDayExecutable,
  scanReplayDayExecutableSellImmediate,
  summarizeReplayCandidates,
  findReplayRunnerCandidates,
  findReplayRunnerExitCandidates,
  findOpenReplayRunnerCandidates,
} from "../../../lib/replayMultiDayScanner";
import {
  calculatePerformanceAnalytics,
} from "../../../lib/performanceAnalytics";
import {
  mkdir,
  readFile,
  writeFile,
} from "fs/promises";

import path from "path";


// ==========================================
// SERVER-SIDE REPLAY BACKTEST
//
// Example:
//
// /api/replay-backtest
//
// or:
//
// /api/replay-backtest
//   ?start=2026-01-01
//   &end=2026-08-21
//
// Heavy multi-day scanning happens here,
// NOT inside page.tsx / browser.
//
// Existing strategy logic is reused.
// ==========================================

// ==========================================
// REPLAY DATA FETCH WITH RETRY
//
// Retries transient network / server errors.
// Does NOT retry genuine 404 non-trading days.
// ==========================================

async function fetchReplayDataWithRetry(
  url: URL,
  maxAttempts = 3
): Promise<Response> {

  let lastError:
    unknown = null;


  for (
    let attempt = 1;
    attempt <= maxAttempts;
    attempt++
  ) {

    try {

      const response =
        await fetch(
          url,
          {
            method: "GET",
            cache: "no-store",
          }
        );


      // Genuine non-trading day.
      // No point retrying.
      if (
        response.status === 404
      ) {
        return response;
      }


      // Successful response.
      if (response.ok) {
        return response;
      }


      // Retry only temporary server /
      // throttling conditions.
      if (
        response.status !== 429 &&
        response.status < 500
      ) {
        return response;
      }


      lastError =
        new Error(
          `Replay data returned HTTP ${response.status}`
        );


    } catch (error) {

      lastError =
        error;
    }


    // --------------------------------------
    // WAIT BEFORE NEXT ATTEMPT
    // --------------------------------------

    if (
      attempt < maxAttempts
    ) {

      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            750 * attempt
          )
      );
    }
  }


  throw (
    lastError instanceof Error
      ? lastError
      : new Error(
          "Replay data fetch failed after retries."
        )
  );
}

// ==========================================
// PERSISTENT BACKTEST RESULT CACHE
// ==========================================

// Change this whenever strategy / execution
// logic changes in a way that invalidates
// historical backtest results.
const BACKTEST_CACHE_VERSION =
  "v2-sell-stability-1";


type BacktestCacheEntry = {

  version: string;

  key: string;

  result: any;

  createdAt: number;
};


let backtestCache:
  BacktestCacheEntry | null = null;


const BACKTEST_CACHE_DIRECTORY =
  path.join(
    process.cwd(),
    ".cache"
  );


const BACKTEST_CACHE_FILE =
  path.join(
    BACKTEST_CACHE_DIRECTORY,
    "replay-backtest-cache.json"
  );


// ==========================================
// READ PERSISTENT CACHE
// ==========================================

async function readPersistentBacktestCache():
  Promise<
    BacktestCacheEntry | null
  > {

  try {

    const raw =
      await readFile(
        BACKTEST_CACHE_FILE,
        "utf8"
      );


    const parsed =
      JSON.parse(
        raw
      ) as BacktestCacheEntry;


    if (
      parsed.version !==
      BACKTEST_CACHE_VERSION
    ) {
      return null;
    }


    return parsed;

  } catch {

    return null;
  }
}


// ==========================================
// WRITE PERSISTENT CACHE
// ==========================================

async function writePersistentBacktestCache(
  entry:
    BacktestCacheEntry
) {

  await mkdir(
    BACKTEST_CACHE_DIRECTORY,
    {
      recursive: true,
    }
  );


  await writeFile(
    BACKTEST_CACHE_FILE,
    JSON.stringify(
      entry
    ),
    "utf8"
  );
}

export async function GET(
  request: Request
) {

  const scanStartedAt =
    Date.now();


  try {

    // ======================================
    // READ DATE RANGE
    // ======================================

    const requestUrl =
      new URL(
        request.url
      );

      const forceFresh =
  requestUrl.searchParams.get(
    "forceFresh"
  ) === "true";

    const requestedStartDate =
      requestUrl.searchParams.get(
        "start"
      ) ??
      "2026-01-01";


    const requestedEndDate =
      requestUrl.searchParams.get(
        "end"
      ) ??
      "2026-08-21";

      const cacheKey =
  `${requestedStartDate}|${requestedEndDate}`;

// ======================================
// CHECK MEMORY / PERSISTENT CACHE
// ======================================

if (
  !forceFresh
) {

  if (
    !backtestCache
  ) {

    backtestCache =
      await readPersistentBacktestCache();
  }


  const cachedResult =
    backtestCache;


  if (
    cachedResult &&
    cachedResult.version ===
      BACKTEST_CACHE_VERSION &&
    cachedResult.key ===
      cacheKey
  ) {

    return NextResponse.json({

      ...cachedResult.result,

      cache: {

        used:
          true,

        createdAt:
          cachedResult.createdAt,
      },
    });
  }
}

    const startDate =
      new Date(
        `${requestedStartDate}T00:00:00+05:30`
      );


    const endDate =
      new Date(
        `${requestedEndDate}T00:00:00+05:30`
      );


    if (
      Number.isNaN(
        startDate.getTime()
      ) ||
      Number.isNaN(
        endDate.getTime()
      )
    ) {

      return NextResponse.json(
        {
          success: false,

          error:
            "Invalid backtest date range.",
        },
        {
          status: 400,
        }
      );
    }


    if (
      startDate >
      endDate
    ) {

      return NextResponse.json(
        {
          success: false,

          error:
            "Backtest start date must be before or equal to end date.",
        },
        {
          status: 400,
        }
      );
    }


    // ======================================
    // RESULTS
    // ======================================

    const allCandidates: any[] =
      [];


    const executableCandidates:
      any[] = [];

    const hypotheticalSellImmediateCandidates:
    any[] = [];

    const successfulDates:
      string[] = [];


    const skippedDates:
      string[] = [];


    const failedDates:
      {
        date: string;
        status?: number;
        error: string;
      }[] = [];


    // ======================================
    // SCAN EACH CALENDAR DAY
    // ======================================

    for (
      let currentDate =
        new Date(
          startDate
        );

      currentDate <=
        endDate;

      currentDate.setDate(
        currentDate.getDate() + 1
      )
    ) {

const dateString =
  new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone:
        "Asia/Kolkata",

      year:
        "numeric",

      month:
        "2-digit",

      day:
        "2-digit",
    }
  ).format(
    currentDate
  );


      try {

        // ==================================
        // REUSE EXISTING UPSTOX REPLAY API
        //
        // This preserves the exact same:
        //
        // warmup5m
        // warmup1m
        // candles5m
        // candles1m
        //
        // contract already validated.
        // ==================================

        const replayDataUrl =
          new URL(
            `/api/replay-data-upstox?date=${dateString}`,
            request.url
          );


const response =
  await fetchReplayDataWithRetry(
    replayDataUrl
  );


        if (
          response.status === 404
        ) {

          skippedDates.push(
            dateString
          );

          continue;
        }


        if (!response.ok) {

          let errorMessage =
            "Replay data request failed.";


          try {

            const errorData =
              await response.json();


            if (
              errorData?.error
            ) {

              errorMessage =
                String(
                  errorData.error
                );
            }

          } catch {
            // Keep fallback error message.
          }


          failedDates.push({

            date:
              dateString,

            status:
              response.status,

            error:
              errorMessage,
          });


          continue;
        }


        const data =
          await response.json();


        if (
          !data.success ||
          !Array.isArray(
            data.candles5m
          ) ||
          !Array.isArray(
            data.candles1m
          ) ||
          !Array.isArray(
            data.warmup5m
          ) ||
          !Array.isArray(
            data.warmup1m
          )
        ) {

          failedDates.push({

            date:
              dateString,

            error:
              "Replay data response was incomplete.",
          });

          continue;
        }


        successfulDates.push(
          dateString
        );


        // ==================================
        // SAME DATA OBJECT USED BY BOTH
        // RAW + EXECUTION-AWARE SCANNERS
        // ==================================

        const dayData = {

          date:
            dateString,

          warmup5m:
            data.warmup5m,

          warmup1m:
            data.warmup1m,

          candles5m:
            data.candles5m,

          candles1m:
            data.candles1m,
        };


        // ==================================
        // RAW QUALIFIED CANDIDATES
        // ==================================

        const dayCandidates =
          scanReplayDay(
            dayData
          );


        allCandidates.push(
          ...dayCandidates
        );


        // ==================================
        // EXECUTION-AWARE TRADES
        // ==================================

        const dayExecutable =
          scanReplayDayExecutable(
            dayData
          );


        executableCandidates.push(
          ...dayExecutable
        );

        const dayHypotheticalSellImmediate =
  scanReplayDayExecutableSellImmediate(
    dayData
  );


hypotheticalSellImmediateCandidates.push(
  ...dayHypotheticalSellImmediate
);

      } catch (error) {

        failedDates.push({

          date:
            dateString,

          error:
            error instanceof Error
              ? error.message
              : "Unknown scan error",
        });
      }
    }


    // ======================================
    // SUMMARIES
    // ======================================

    const rawSummary =
      summarizeReplayCandidates(
        allCandidates
      );


    const executionAwareSummary =
      summarizeReplayCandidates(
        executableCandidates
      );
      const hypotheticalSellImmediateSummary =
  summarizeReplayCandidates(
    hypotheticalSellImmediateCandidates
  );

      const performanceAnalytics =
  calculatePerformanceAnalytics(
    executableCandidates.map(
      trade => ({

        date:
          trade.date,

        action:
          trade.action,

result:
  trade.result,

confirmations:
  trade.confirmations,

realizedPnL:
  trade.realizedPnL,

        target1Hit:
          trade.reachesTarget1,

        target2Hit:
          trade.reachesTarget2,

        runnerActivated:
          trade.runnerActivated,
      })
    )
  );

  // ======================================
// HYPOTHETICAL SELL STABILITY ANALYTICS
// ======================================

const hypotheticalSellImmediateAnalytics =
  calculatePerformanceAnalytics(
    hypotheticalSellImmediateCandidates.map(
      trade => ({

        date:
          trade.date,

        action:
          trade.action,

        result:
          trade.result,

          confirmations:
  trade.confirmations,

        realizedPnL:
          trade.realizedPnL,

        target1Hit:
          trade.reachesTarget1,

        target2Hit:
          trade.reachesTarget2,

        runnerActivated:
          trade.runnerActivated,
      })
    )
  );

// ======================================
// QUALIFICATION STABILITY DIAGNOSTICS
// ======================================

let consecutiveBuyPairs = 0;
let consecutiveSellPairs = 0;

let maxBuyQualifiedStreak = 0;
let maxSellQualifiedStreak = 0;

let currentBuyStreak = 0;
let currentSellStreak = 0;


for (let i = 0; i < allCandidates.length; i++) {

  const current =
    allCandidates[i];

  const previous =
    i > 0
      ? allCandidates[i - 1]
      : null;


  const consecutiveToPrevious =
    previous &&
    previous.date === current.date &&
    current.candle ===
      previous.candle + 1;


  if (
    current.action === "BUY" &&
    consecutiveToPrevious &&
    previous?.action === "BUY"
  ) {

    consecutiveBuyPairs += 1;

  }


  if (
    current.action === "SELL" &&
    consecutiveToPrevious &&
    previous?.action === "SELL"
  ) {

    consecutiveSellPairs += 1;
  }


  if (current.action === "BUY") {

    if (
      previous &&
      previous.date === current.date &&
      previous.action === "BUY" &&
      current.candle ===
        previous.candle + 1
    ) {

      currentBuyStreak += 1;

    } else {

      currentBuyStreak = 1;
    }


    currentSellStreak = 0;

  } else {

    if (
      previous &&
      previous.date === current.date &&
      previous.action === "SELL" &&
      current.candle ===
        previous.candle + 1
    ) {

      currentSellStreak += 1;

    } else {

      currentSellStreak = 1;
    }


    currentBuyStreak = 0;
  }


  maxBuyQualifiedStreak =
    Math.max(
      maxBuyQualifiedStreak,
      currentBuyStreak
    );


  maxSellQualifiedStreak =
    Math.max(
      maxSellQualifiedStreak,
      currentSellStreak
    );
}

// ======================================
// RAW SELL PERFORMANCE
// ======================================

const rawSellCandidates =
  allCandidates.filter(
    candidate =>
      candidate.action === "SELL"
  );


const rawSellPerformance =
  summarizeReplayCandidates(
    rawSellCandidates
  );

  const rawSellOpenTrades =
  rawSellCandidates.filter(
    candidate =>
      candidate.result === "OPEN"
  ).length;

// ======================================
// SELL PIPELINE EVALUATION
// ======================================

const sellPipelineEvaluation = {

  rawSellCandidates:
    rawSummary.sellCandidates,

  consecutiveSellPairs,

  maxSellQualifiedStreak,

  executableSellTrades:
    executionAwareSummary.sellCandidates,

  filteredBeforeStability:
    Math.max(
      0,
      rawSummary.sellCandidates -
      consecutiveSellPairs
    ),
    rawSellPerformance,

    rawSellOpenTrades,
};

const stabilityDiagnostics = {

  rawBuyCandidates:
    rawSummary.buyCandidates,

  rawSellCandidates:
    rawSummary.sellCandidates,

  consecutiveBuyPairs,

  consecutiveSellPairs,

  maxBuyQualifiedStreak,

  maxSellQualifiedStreak,
};

    // ======================================
    // RUNNER DIAGNOSTICS
    // ======================================

    const runnerCandidates =
      findReplayRunnerCandidates(
        executableCandidates
      );


    const runnerExitCandidates =
      findReplayRunnerExitCandidates(
        executableCandidates
      );


    const openRunnerCandidates =
      findOpenReplayRunnerCandidates(
        executableCandidates
      );


    // ======================================
    // COVERAGE
    // ======================================

    const coverage = {

      requestedStartDate,

      requestedEndDate,

      successfulTradingDays:
        successfulDates.length,

      skippedCalendarDays:
        skippedDates.length,

      failedDays:
        failedDates.length,

      earliestSuccessfulDate:
        successfulDates[0] ??
        null,

      latestSuccessfulDate:
        successfulDates[
          successfulDates.length - 1
        ] ??
        null,

        successfulDates,

        skippedDates,

        failedDates,

    };


    // ======================================
    // COMPACT EXECUTABLE TRADE LIST
    //
    // Enough information for validation
    // without sending huge diagnostic
    // objects to the browser.
    // ======================================

    const executableTrades =
      executableCandidates.map(
        trade => ({

          date:
            trade.date,

          candle:
            trade.candle,

          action:
            trade.action,

          entry:
            Number(
              trade.entry.toFixed(2)
            ),

          confidence:
            trade.confidence,

          confirmations:
            trade.confirmations,

          result:
            trade.result,

          realizedPnL:
            trade.realizedPnL,

          target1Hit:
            trade.reachesTarget1,

          target2Hit:
            trade.reachesTarget2,

          runnerActivated:
            trade.runnerActivated,

          tradeClosed:
            trade.tradeClosed,

          bestFavorableMove:
            trade.bestFavorableMove,

          worstAdverseMove:
            trade.worstAdverseMove,
        })
      );


    // ======================================
    // DURATION
    // ======================================

    const scanDurationMs =
      Date.now() -
      scanStartedAt;


    const scanDurationSeconds =
      Number(
        (
          scanDurationMs /
          1000
        ).toFixed(2)
      );


    // ======================================
    // FINAL RESPONSE
    //
    // IMPORTANT:
    // No giant candle arrays.
    // No giant raw-candidate arrays.
    // ======================================

const finalResult = {

  success: true,

  source:
    "UPSTOX",

  coverage,

  rawSummary,

  executionAwareSummary,

  hypotheticalSellImmediateSummary,

  performanceAnalytics,

  hypotheticalSellImmediateAnalytics,

  sellPipelineEvaluation,

  stabilityDiagnostics,

  runnerSummary: {

    runnerCandidates:
      runnerCandidates.length,

    completedRunnerExits:
      runnerExitCandidates.length,

    openRunners:
      openRunnerCandidates.length,
  },

  executableTrades,

  failedDates,

  performance: {

    scanDurationSeconds,
  },
};


// ======================================
// STORE FRESH RESULT IN CACHE
// ======================================

const cacheCreatedAt =
  Date.now();


const cacheEntry:
  BacktestCacheEntry = {

  version:
    BACKTEST_CACHE_VERSION,

  key:
    cacheKey,

  result:
    finalResult,

  createdAt:
    cacheCreatedAt,
};


backtestCache =
  cacheEntry;


await writePersistentBacktestCache(
  cacheEntry
);


// ======================================
// RETURN FRESH RESULT
// ======================================

return NextResponse.json({

  ...finalResult,

  cache: {

    used:
      false,

    createdAt:
      cacheCreatedAt,
  },
});

  } catch (error) {

    console.error(
      "SERVER REPLAY BACKTEST ERROR:",
      error
    );


    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Failed to run server-side Replay backtest.",
      },
      {
        status: 500,
      }
    );
  }
}