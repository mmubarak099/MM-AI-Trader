"use client";

import PriceChart from "../components/PriceChart";
import { useEffect, useRef, useState } from "react";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MarketStatus from "../components/MarketStatus";
import MarketCard from "../components/MarketCard";
import MarketOverview from "../components/MarketOverview";
import ConfidenceMeter from "../components/ConfidenceMeter";
import IndicatorPanel from "../components/IndicatorPanel";
import AIMarketSummary from "../components/AIMarketSummary";
import TradePlan from "../components/TradePlan";
import AIDecisionPanel from "../components/AIDecisionPanel";
import ActiveTradeMonitor from "../components/ActiveTradeMonitor";
import TradeHistory from "../components/TradeHistory";
import TradeStatistics from "../components/TradeStatistics";
import TradeManagerAI from "../components/TradeManagerAI";
import TradeReadiness from "../components/TradeReadiness";
import CurrentSignalCard from "../components/CurrentSignalCard";
import TradeAlert from "../components/TradeAlert";

import { generateMarketPrice } from "../lib/marketSimulator";
import {
  analyzeMarket as analyzeMarketV1
} from "../lib/aiEngine";
import { calculateRisk } from "../lib/riskEngine";
import { detectBullishEngulfing } from "../lib/candlestick";
import { analyzePattern } from "../lib/patternAnalyzer";
import CandlestickChart from "../components/CandlestickChart";
import { detectMarketStructure } from "../lib/marketStructure";
import { detectBreakout } from "../lib/breakoutDetector";
import { analyzeVolume } from "../lib/volumeAnalyzer";
import { validateSignal } from "../lib/signalValidator";
import { manageTrade } from "../lib/tradeManagerAI";
import { analyzeRealTimeframe } from "../lib/realMarketAnalyzer";
import { analyzeMultiTimeframe } from "../lib/multiTimeframeAnalyzer";
import {
  validateExecution,
} from "../lib/executionValidator";
import {
  activateTrade,
  updateTrade,
} from "../lib/tradeManager";
import {
  getSignalExpiry,
  isSignalExpired,
} from "../lib/signalExpiry";
import {
  createTradePlan,
} from "../lib/tradePlanner";
import {
  createReplayState,
  stepReplay,
  resetReplay,
  getReplayCurrentCandle,
  getReplayCandlesSoFar,
  getReplayProgress,
} from "../lib/replayEngine";

import {
  sampleReplayCandles,
} from "../lib/replayData";
import {
  calculateMovingAverage,
  getTrend,
  calculateRSI,
  calculateEMA,
  calculateMACD,
  calculateVWAP,
} from "../lib/indicators";
import { calculateSupportResistance }
  from "../lib/supportResistance";
  import {
  analyzeReplayOpportunities,
} from "../lib/replayDiagnostics";
import {
  analyzeReplayCandle,
} from "../lib/replayAnalyzer";
import {
  scanReplayDay,
  scanReplayDayExecutable,
  findReplayRunnerCandidates,
  findReplayRunnerExitCandidates,
  findOpenReplayRunnerCandidates,
  summarizeReplayCandidates,
} from "../lib/replayMultiDayScanner";
import type { TradeSignal } from "../types/tradeSignal";



export default function Home() {

const [executionMode, setExecutionMode] =
  useState<
    "REAL" |
    "SIMULATOR" |
    "REPLAY"
  >("REAL");

  const [nifty, setNifty] = useState({
    price: 24650,
    change: 0.52
  });

  const [previousCandle, setPreviousCandle] =
  useState<any>(null);


  const [bankNifty, setBankNifty] = useState({
    price: 55230,
    change: 0.38
  });

const [realMarketData, setRealMarketData] =
  useState<any>(null);

const [realNiftyCandles, setRealNiftyCandles] =
  useState<any[]>([]);

  const [realNiftyCandles1m, setRealNiftyCandles1m] =
  useState<any[]>([]);

  const [liveRealCandle, setLiveRealCandle] =
  useState<any>(null);

const [replayState, setReplayState] =
  useState(
    createReplayState(
      sampleReplayCandles
    )
  );

const replayCurrentCandle =
  getReplayCurrentCandle(
    replayState
  );

const replayCandlesSoFar =
  getReplayCandlesSoFar(
    replayState
  );

const replayProgress =
  getReplayProgress(
    replayState
  );


// ======================================
// HISTORICAL REPLAY DATA
// ======================================

const [historicalReplay5m, setHistoricalReplay5m] =
  useState<any[]>([]);

const [historicalReplay1m, setHistoricalReplay1m] =
  useState<any[]>([]);

const [historicalReplayWarmup5m, setHistoricalReplayWarmup5m] =
  useState<any[]>([]);

const [historicalReplayWarmup1m, setHistoricalReplayWarmup1m] =
  useState<any[]>([]);

const [replayLoaded, setReplayLoaded] =
  useState(false);

  const [replayRunning, setReplayRunning] =
  useState(false);

// ==========================================
// SERVER HISTORICAL BACKTEST
// ==========================================

const [historicalScanRunning, setHistoricalScanRunning] =
  useState(false);

const [historicalScanResult, setHistoricalScanResult] =
  useState<any>(null);

const [historicalScanError, setHistoricalScanError] =
  useState<string | null>(null);

  const [
  replayExecutionTest,
  setReplayExecutionTest
] = useState(false);

const [replayDate, setReplayDate] =
  useState("2026-08-21");

  const [replayAnalysis5m, setReplayAnalysis5m] =
  useState<any>(null);

const [replayAnalysis1m, setReplayAnalysis1m] =
  useState<any>(null);

const [replayMultiTimeframe, setReplayMultiTimeframe] =
  useState<any>(null);

  const [replayAIAnalysis, setReplayAIAnalysis] =
  useState<any>(null);

const [replayPassedConfirmations, setReplayPassedConfirmations] =
  useState(0);

const [qualifiedReplaySignal, setQualifiedReplaySignal] =
  useState<any>(null);

// ======================================
// SYNCHRONIZED REPLAY ANALYSIS
//
// One Replay candle
// → 5m + 1m
// → MTF
// → V1
// → confirmations
// → qualification
//
// All derived from the SAME candle.
// ======================================

useEffect(() => {

  if (
    executionMode !== "REPLAY" ||
    !replayLoaded ||
    historicalReplay5m.length === 0 ||
    historicalReplay1m.length === 0 ||
    historicalReplayWarmup5m.length === 0 ||
    historicalReplayWarmup1m.length === 0 ||
    !replayCurrentCandle
  ) {
    return;
  }


  const result =
    analyzeReplayCandle({

      currentIndex:
        replayState.currentIndex,

      warmup5m:
        historicalReplayWarmup5m,

      warmup1m:
        historicalReplayWarmup1m,

      candles5m:
        historicalReplay5m,

      candles1m:
        historicalReplay1m,
    });


  if (!result) {

    setReplayAnalysis5m(null);

    setReplayAnalysis1m(null);

    setReplayMultiTimeframe(null);

    setReplayAIAnalysis(null);

    setReplayPassedConfirmations(0);

    setQualifiedReplaySignal(null);

    return;
  }


  // --------------------------------------
  // Store display / diagnostic state
  // from the SAME synchronous result
  // --------------------------------------

  setReplayAnalysis5m(
    result.analysis5m
  );

  setReplayAnalysis1m(
    result.analysis1m
  );

  setReplayMultiTimeframe(
    result.multiTimeframe
  );

  setReplayAIAnalysis(
    result.replayV1
  );

  setReplayPassedConfirmations(
    result.confirmations
  );


  // --------------------------------------
  // Qualification reason
  // --------------------------------------

  const directionMatches =
    (
      result.v1Direction === "BUY" ||
      result.v1Direction === "SELL"
    ) &&
    result.v1Direction ===
      result.mtfDirection;


  const entryReady =
    result.entryState === "READY";


  const confidenceReady =
    result.confidence >= 90;


  const confirmationsReady =
    result.confirmations >= 4;


  const reason =
    result.qualified
      ? "Replay V1 and multi-timeframe entry conditions are aligned."
      : !directionMatches
      ? "Replay V1 and multi-timeframe directions are not aligned."
      : !entryReady
      ? "Replay multi-timeframe entry is not ready."
      : !confidenceReady
      ? "Replay V1 confidence is below 90%."
      : !confirmationsReady
      ? "Replay confirmations are below 4 of 6."
      : "Replay signal is not qualified.";


  setQualifiedReplaySignal({

    replayIndex:
      result.replayIndex,

    action:
      result.action,

    qualified:
      result.qualified,

    confidence:
      result.confidence,

    confirmations:
      result.confirmations,

    v1Direction:
      result.v1Direction,

    mtfDirection:
      result.mtfDirection,

    entryState:
      result.entryState,

    reason,
  });


}, [
  executionMode,
  replayLoaded,
  replayState.currentIndex,
  replayCurrentCandle,
  historicalReplay5m,
  historicalReplay1m,
  historicalReplayWarmup5m,
  historicalReplayWarmup1m,
]);

// ======================================
// LOAD HISTORICAL REPLAY
// ======================================

const loadHistoricalReplay = async () => {

  try {

const response =
  await fetch(
    `/api/replay-data-upstox?date=${replayDate}`,
    {
      cache: "no-store",
    }
  );

    const data =
      await response.json();

    if (
      !data.success ||
      !Array.isArray(data.candles5m) ||
      !Array.isArray(data.candles1m)
    ) {

      console.error(
        "❌ REPLAY DATA INVALID",
        data
      );

      return;
    }

    setHistoricalReplay5m(
      data.candles5m
    );

    setHistoricalReplay1m(
      data.candles1m
    );

    setHistoricalReplayWarmup5m(
  data.warmup5m
);

setHistoricalReplayWarmup1m(
  data.warmup1m
);

    setReplayState(
      createReplayState(
        data.candles5m
      )
    );

    setReplayLoaded(true);

    console.log(
      "✅ REPLAY DATA LOADED",
      {
        candles5m:
          data.candles5m.length,

        candles1m:
          data.candles1m.length,
      }
    );

  } catch (error) {

    console.error(
      "❌ REPLAY LOAD ERROR",
      error
    );
  }
};


// ======================================
// MOVE REPLAY ONE CANDLE FORWARD
// ======================================

const handleReplayNext = () => {

  if (!replayLoaded) {
    return;
  }

  setReplayState(prev =>
    stepReplay(prev)
  );
};

const processActiveTradeUpdate = (
  trade: NonNullable<typeof activeTrade>,
  price: number
) => {

  const updatedTrade = updateTrade(
    trade,
    price
  );

  // TARGET 1 ALERT
  if (
    updatedTrade.target1Hit &&
    !trade.target1Hit
  ) {
    setTradeAlert({
      type: "SUCCESS",
      title: "Target 1 Hit",
      message: `${updatedTrade.action} trade reached Target 1 at ${Number(
        updatedTrade.target1
      ).toFixed(2)}.`,
    });
  }

  // TARGET 2 ALERT
  if (
    updatedTrade.target2Hit &&
    !trade.target2Hit
  ) {
    setTradeAlert({
      type: "SUCCESS",
      title: "Target 2 Hit",
      message: `${updatedTrade.action} trade reached Target 2 at ${Number(
        updatedTrade.target2
      ).toFixed(2)}.`,
    });
  }

  const stopLossJustHit =
    updatedTrade.events?.some(
      (event: any) =>
        event.type === "STOP_LOSS_HIT"
    ) &&
    !trade.events?.some(
      (event: any) =>
        event.type === "STOP_LOSS_HIT"
    );

  if (stopLossJustHit) {
    setTradeAlert({
      type: "ERROR",
      title: "Stop Loss Hit",
      message: `${updatedTrade.action} trade hit stop loss at ${Number(
        updatedTrade.stopLoss
      ).toFixed(2)}.`,
    });
  }

  const profitProtectionJustEnabled =
    updatedTrade.events?.some(
      (event: any) =>
        event.type === "PROFIT_PROTECTION_ENABLED"
    ) &&
    !trade.events?.some(
      (event: any) =>
        event.type === "PROFIT_PROTECTION_ENABLED"
    );

  if (profitProtectionJustEnabled) {
    setTradeAlert({
      type: "INFO",
      title: "Profit Protection Enabled",
      message: `${updatedTrade.action} trade is now protected.`,
    });
  }

  setActiveTrade(updatedTrade);

  if (updatedTrade.status === "CLOSED") {

    console.log(
      "Trade Closed:",
      JSON.stringify(
        updatedTrade,
        null,
        2
      )
    );

    setTradeHistory(prev => [
      ...prev,
      updatedTrade,
    ]);

    setTradeAlert({
      type:
        updatedTrade.result === "WIN"
          ? "SUCCESS"
          : updatedTrade.result === "LOSS"
          ? "ERROR"
          : "INFO",

      title:
        updatedTrade.result === "WIN"
          ? "Trade Closed — Win"
          : updatedTrade.result === "LOSS"
          ? "Trade Closed — Loss"
          : "Trade Closed — Breakeven",

      message: `${updatedTrade.action} trade closed with P&L ${Number(
        updatedTrade.realizedPnL ?? 0
      ).toFixed(2)}.`,
    });

    // Start cooldown after a losing trade
    if (
      updatedTrade.result === "LOSS"
    ) {

      setTradeCooldown(true);

      setTimeout(() => {
        setTradeCooldown(false);
      }, 60000);
    }

    setActiveTrade(null);
  }
};

useEffect(() => {

  if (
    executionMode !== "REPLAY" ||
    !replayRunning ||
    !replayLoaded
  ) {
    return;
  }

  const timer = setInterval(() => {

    setReplayState(prev => {

      const next =
        stepReplay(prev);

      if (next.completed) {
        setReplayRunning(false);
      }

      return next;
    });

  }, 800);

  return () =>
    clearInterval(timer);

}, [
  executionMode,
  replayRunning,
  replayLoaded,
]);

useEffect(() => {

  const price =
    realMarketData?.nifty?.price;

  if (price == null) {
    return;
  }

  const marketTimestamp =
    realMarketData?.nifty?.time
      ? new Date(
          realMarketData.nifty.time
        ).getTime()
      : Date.now();

  // Align time into a 5-minute candle bucket.
  const fiveMinutes =
    5 * 60 * 1000;

  const candleStart =
    Math.floor(
      marketTimestamp / fiveMinutes
    ) * fiveMinutes;

  setLiveRealCandle(
    (previous: any) => {

      // Start first live candle,
      // or start a fresh candle when
      // the 5-minute period changes.
      if (
        !previous ||
        previous.candleStart !==
          candleStart
      ) {

        return {
          candleStart,
          open: price,
          high: price,
          low: price,
          close: price,
          volume: 0,
        };
      }

      // Update the currently forming candle.
      return {
        ...previous,

        high: Math.max(
          previous.high,
          price
        ),

        low: Math.min(
          previous.low,
          price
        ),

        close: price,
      };
    }
  );

}, [
  realMarketData?.nifty?.price,
  realMarketData?.nifty?.time,
]);

const realChartCandles = [
  ...realNiftyCandles.map(
    (candle) => ({
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: 0,
    })
  ),

  ...(liveRealCandle
    ? [liveRealCandle]
    : []),
];

const realClosePrices =
  realNiftyCandles.map(
    (candle) => candle.close
  );

  useEffect(() => {
  if (realClosePrices.length > 14) {
    const rsi =
      calculateRSI(realClosePrices);

    setRealRSI(rsi);
  }
}, [realNiftyCandles]);

useEffect(() => {
  if (realClosePrices.length >= 20) {
    const ema =
      calculateEMA(
        realClosePrices,
        20
      );

    setRealEMA20(ema);
  }
}, [realNiftyCandles]);

useEffect(() => {
  if (realClosePrices.length >= 50) {
    const ema =
      calculateEMA(
        realClosePrices,
        50
      );

    setRealEMA50(ema);
  }
}, [realNiftyCandles]);

useEffect(() => {
  if (realClosePrices.length >= 26) {
    const macd =
      calculateMACD(realClosePrices);

    setRealMACD(macd);
  }
}, [realNiftyCandles]);

useEffect(() => {
  if (realNiftyCandles.length >= 7) {
    const levels =
      calculateSupportResistance(
        realNiftyCandles
      );

    setRealLevels(levels);
  }
}, [realNiftyCandles]);

useEffect(() => {
  if (realNiftyCandles.length >= 2) {
    const previousCandle =
      realNiftyCandles[
        realNiftyCandles.length - 2
      ];

    const currentCandle =
      realNiftyCandles[
        realNiftyCandles.length - 1
      ];

    const detected =
      analyzePattern(
        previousCandle,
        currentCandle
      );

    setRealPattern(detected);
  }
}, [realNiftyCandles]);

useEffect(() => {
  if (realClosePrices.length >= 20) {
    const structure =
      detectMarketStructure(
        realClosePrices
      );

    setRealMarketStructure(
      structure
    );
  }
}, [realNiftyCandles]);


  const [priceHistory, setPriceHistory] = useState([
    24600,
    24620,
    24640,
    24630,
    24650
  ]);

  const [volumeHistory, setVolumeHistory] =
  useState<number[]>([]);

const [pattern, setPattern] =
  useState("No Pattern");

  const [candleHistory, setCandleHistory] =
  useState<any[]>([]);

const [aiSignal, setAiSignal] = useState({

  trend: "Neutral",

  confidence: 50,

  action: "WAIT",

  reasons: [] as string[],

  marketCondition: "Sideways",

  riskLevel: "Medium",

  advice: "Wait for confirmation",

  summary: "",

});

const [signalHistory, setSignalHistory] =
  useState<
    {
      action: string;
      confidence: number;
      pattern: string;
      candleIndex: number;
    }[]
  >([]);

 const [levels, setLevels] = useState({
  support: [] as number[],
  resistance: [] as number[],
});

const [currentSignal, setCurrentSignal] =
  useState<TradeSignal | null>(null);
const [activeTrade, setActiveTrade] =
  useState<any>(null);
const [tradeHistory, setTradeHistory] =
  useState<any[]>([]);

const [tradeAlert, setTradeAlert] =
  useState<{
    type: "SUCCESS" | "WARNING" | "INFO" | "ERROR";
    title: string;
    message: string;
  } | null>(null);

const [tradeDecision, setTradeDecision] = useState<any>(null);
  const [signalExpiry, setSignalExpiry] =
  useState<Date | null>(null);

  const [lastSignal, setLastSignal] =
  useState<string>("NONE");

  const [tradeCooldown, setTradeCooldown] =
  useState(false);

  // NEW ------------------------------

const [signalLocked, setSignalLocked] =
  useState(false);

const [signalCreatedAt, setSignalCreatedAt] =
  useState<Date | null>(null);

const [signalTimeLeft, setSignalTimeLeft] =
  useState(0);

const SIGNAL_DURATION = 120000; // 2 minutes

const stableSignalDirectionRef =
  useRef<"BUY" | "SELL" | null>(null);

const stableSignalCountRef =
  useRef(0);

  const realStableSignalDirectionRef =
  useRef<"BUY" | "SELL" | null>(null);

const realStableSignalCountRef =
  useRef(0);

  // ======================================
// REAL SIGNAL CANDLE PROCESSING GUARD
//
// Prevent the same completed 5m candle
// from counting more than once toward
// signal stability.
// ======================================

const realLastProcessedCandleTimeRef =
  useRef<string | number | null>(null);
  
  // ======================================
// REAL OPPORTUNITY HISTORY
//
// Diagnostic only.
// Records REAL qualified opportunities
// without changing signal/trade logic.
// ======================================

const realOpportunityHistoryRef =
  useRef<
    {
      candleTime: string | number | null;
      action: "BUY" | "SELL";
      price: number;
      confidence: number;
      confirmations: number;
      mtfDirection: string;
      entryState: string;
      stability: number;
      requiredStability: number;
      stabilityPassed: boolean;
      tradePlanCreated: boolean;
    }[]
  >([]);

// ======================================
// REPLAY SIGNAL STABILITY
// ======================================

const replayStableSignalDirectionRef =
  useRef<"BUY" | "SELL" | null>(null);

const replayStableSignalCountRef =
  useRef(0);
  
  const replayLastProcessedIndexRef =
  useRef<number | null>(null);

  const replayTradeLastProcessedIndexRef =
  useRef<number | null>(null);

  const replayQualifiedHistoryRef =
  useRef<
    {
      candle: number;
      action: "BUY" | "SELL";
      confidence: number;
      confirmations: number;
    }[]
  >([]);


  const replayExecutableHistoryRef =
  useRef<
    {
      candle: number;
      action: "BUY" | "SELL";
      entry: number;
      confidence: number;
      confirmations: number;
    }[]
  >([]);

  // ======================================
// REPLAY ACTIVE TRADE MANAGEMENT
//
// Process a REPLAY trade exactly once
// for each new Replay candle.
// ======================================

useEffect(() => {

  if (executionMode !== "REPLAY") {
    return;
  }

  if (
    !activeTrade ||
    activeTrade.source !== "REPLAY"
  ) {

    replayTradeLastProcessedIndexRef.current =
      null;

    return;
  }

  if (!replayCurrentCandle) {
    return;
  }

  // When the REPLAY trade is first opened,
  // treat the current candle as the entry
  // candle. Do not manage the trade against
  // that same candle again.
  if (
    replayTradeLastProcessedIndexRef.current ===
    null
  ) {

    replayTradeLastProcessedIndexRef.current =
      replayState.currentIndex;

    return;
  }

  // This Replay candle was already used
  // to update this trade.
  if (
    replayTradeLastProcessedIndexRef.current ===
    replayState.currentIndex
  ) {
    return;
  }

  replayTradeLastProcessedIndexRef.current =
    replayState.currentIndex;

  processActiveTradeUpdate(
    activeTrade,
    replayCurrentCandle.close
  );

}, [
  executionMode,
  activeTrade,
  replayState.currentIndex,
  replayCurrentCandle,
]);

// ------------------------------

const [patternHistory, setPatternHistory] =
  useState<
    {
      type: string;
      candleIndex: number;
    }[]
  >([]);


  const [currentRSI, setCurrentRSI] = 
  useState<number | null>(null);
const [realRSI, setRealRSI] =
  useState<number | null>(null);

  const [ema20, setEma20] 
  = useState<number | null>(null);

  const [ema50, setEma50] = 
  useState<number | null>(null);

  const [realEMA20, setRealEMA20] =
  useState<number | null>(null);

  const [realEMA50, setRealEMA50] =
  useState<number | null>(null);

  const [realMACD, setRealMACD] =
  useState<number | null>(null);

  const [realLevels, setRealLevels] =
  useState({
    support: [] as number[],
    resistance: [] as number[],
  });

  const [realPattern, setRealPattern] =
  useState("No Pattern");

  const [realMarketStructure, setRealMarketStructure] =
  useState<"UPTREND" | "DOWNTREND" | "SIDEWAYS">(
    "SIDEWAYS"
  );

  const [realBreakout, setRealBreakout] =
  useState("NONE");

  const [realTrend, setRealTrend] =
  useState("Neutral");

  const [realAIAnalysis, setRealAIAnalysis] =
  useState<any>(null);

  const [analysis5m, setAnalysis5m] =
  useState<any>(null);

const [analysis1m, setAnalysis1m] =
  useState<any>(null);

  const [multiTimeframeAnalysis, setMultiTimeframeAnalysis] =
  useState<any>(null);

  const [qualifiedRealSignal, setQualifiedRealSignal] =
  useState<any>(null);

const realConfirmationChecks =
  realAIAnalysis?.action === "BUY"
    ? [
        realTrend === "Bullish",
        realPattern === "Bullish Engulfing" ||
          realPattern === "Hammer",
        realMarketStructure === "UPTREND",
        realBreakout === "BREAKOUT",
        false,
        (realAIAnalysis?.confidence ?? 0) >= 90,
      ]
    : realAIAnalysis?.action === "SELL"
    ? [
        realTrend === "Bearish",
        realPattern === "Bearish Engulfing",
        realMarketStructure === "DOWNTREND",
        realBreakout === "BREAKDOWN",
        false,
        (realAIAnalysis?.confidence ?? 0) >= 90,
      ]
    : [];

const realPassedConfirmations =
  realConfirmationChecks.filter(Boolean).length;

  useEffect(() => {
  if (
    realMarketData?.nifty?.price != null
  ) {
    const breakout =
      detectBreakout(
        realMarketData.nifty.price,
        realLevels.resistance,
        realLevels.support
      );

    setRealBreakout(breakout);
  }
}, [
  realMarketData,
  realLevels,
]);

useEffect(() => {
  if (
    realMarketData?.nifty?.price != null
  ) {
    const trend =
      getTrend(
        realMarketData.nifty.price,
        realEMA20
      );

    setRealTrend(trend);
  }
}, [
  realMarketData,
  realEMA20,
]);

useEffect(() => {
  if (
    realMarketData?.nifty?.price == null ||
    realNiftyCandles.length < 2
  ) {
    return;
  }

const currentCandle =
  realNiftyCandles[
    realNiftyCandles.length - 1
  ];

   console.log("🌐 REAL VALUES SENT TO V1", {
  realTrend,
  realRSI,
  realEMA20,
  realEMA50,
  realPattern,
  realMarketStructure,
  realBreakout,
});

  const analysis = analyzeMarketV1({

price: currentCandle.close,
previousPrice: currentCandle.open,
    trend: realTrend,
    rsi: realRSI,
    ema20: realEMA20,
    ema50: realEMA50,
    macd: realMACD,

    pattern: realPattern,
    support: realLevels.support,
    resistance: realLevels.resistance,
    marketStructure: realMarketStructure,
    breakout: realBreakout,

    // Yahoo NIFTY index volume is not usable,
    // so keep volume neutral for observation mode.
    volumeStrength: "NORMAL",
  });

  setRealAIAnalysis(analysis);

}, [
  realMarketData,
  realNiftyCandles,
  realTrend,
  realRSI,
  realEMA20,
  realEMA50,
  realMACD,
  realPattern,
  realLevels,
  realMarketStructure,
  realBreakout,
]);

useEffect(() => {
  if (
    realMarketData?.nifty?.price == null
  ) {
    return;
  }

  const result =
    analyzeRealTimeframe(
      realNiftyCandles,
      realMarketData.nifty.price
    );

  setAnalysis5m(result);

}, [
  realMarketData,
  realNiftyCandles,
]);

useEffect(() => {
  if (
    realMarketData?.nifty?.price == null
  ) {
    return;
  }

  const result =
    analyzeRealTimeframe( 
      realNiftyCandles1m,
      realMarketData.nifty.price
    );

  setAnalysis1m(result);

}, [
  realMarketData,
  realNiftyCandles1m,
]);

useEffect(() => {

  if (
    !analysis5m ||
    !analysis1m
  ) {
    return;
  }

  const result =
    analyzeMultiTimeframe(
      analysis5m,
      analysis1m
    );

  setMultiTimeframeAnalysis(
    result
  );

}, [
  analysis5m,
  analysis1m,
]);

useEffect(() => {
  if (
    !realAIAnalysis ||
    !multiTimeframeAnalysis
  ) {
    setQualifiedRealSignal(null);
    return;
  }

  const v1Direction =
    realAIAnalysis.action;

  const mtfDirection =
    multiTimeframeAnalysis.direction;

  const directionMatches =
    (
      v1Direction === "BUY" ||
      v1Direction === "SELL"
    ) &&
    v1Direction === mtfDirection;

  const entryReady =
    multiTimeframeAnalysis.entryState ===
    "READY";

  const confidenceReady =
    realAIAnalysis.confidence >= 90;

  const confirmationsReady =
    realPassedConfirmations >= 4;

  const qualified =
    directionMatches &&
    entryReady &&
    confidenceReady &&
    confirmationsReady;

  setQualifiedRealSignal({

    candleTime:
  realNiftyCandles[
    realNiftyCandles.length - 1
  ]?.time ?? null,

    action: 
    qualified
      ? v1Direction
      : "WAIT",

    qualified,

    confidence:
      realAIAnalysis.confidence,

    confirmations:
      realPassedConfirmations,

    v1Direction,

    mtfDirection,

    entryState:
      multiTimeframeAnalysis.entryState,

    reason: qualified
      ? "Real V1 and multi-timeframe entry conditions are aligned."
      : !directionMatches
      ? "V1 and multi-timeframe directions are not aligned."
      : !entryReady
      ? "Multi-timeframe entry is not ready."
      : !confidenceReady
      ? "Real V1 confidence is below 90%."
      : !confirmationsReady
      ? "Real confirmations are below 4 of 6."
      : "Signal is not qualified.",
  });

}, [
  realAIAnalysis,
  multiTimeframeAnalysis,
  realPassedConfirmations,
  realNiftyCandles,
]);

useEffect(() => {

  if (
    executionMode !== "REAL" ||
    !qualifiedRealSignal ||
    !realAIAnalysis ||
    realMarketData?.nifty?.price == null
  ) {
    return;
  }

  // ---------------------------------------
  // Real signal/trade availability
  // ---------------------------------------

  const realSignalEngineAvailable =
    !signalLocked &&
    !tradeCooldown &&
    !currentSignal &&
    !activeTrade;

  // ---------------------------------------
  // Reset stability when real setup is
  // no longer qualified
  // ---------------------------------------

  if (
    !qualifiedRealSignal.qualified ||
    qualifiedRealSignal.action === "WAIT"
  ) {

    realStableSignalDirectionRef.current =
      null;

    realStableSignalCountRef.current = 0;

    return;
  }

  if (!realSignalEngineAvailable) {
    return;
  }

  const candidateDirection =
    qualifiedRealSignal.action as
      | "BUY"
      | "SELL";

      // ---------------------------------------
// Process each completed REAL 5m candle
// only once for signal stability
// ---------------------------------------

const realCandleTime =
  qualifiedRealSignal.candleTime;


if (
  realCandleTime == null
) {
  return;
}


if (
  realLastProcessedCandleTimeRef.current ===
  realCandleTime
) {
  return;
}


realLastProcessedCandleTimeRef.current =
  realCandleTime;

  // ---------------------------------------
  // Real signal stability counter
  // ---------------------------------------

  if (
    realStableSignalDirectionRef.current ===
    candidateDirection
  ) {

    realStableSignalCountRef.current += 1;

  } else {

    realStableSignalDirectionRef.current =
      candidateDirection;

    realStableSignalCountRef.current = 1;

  }

  console.log(
    "🌐 REAL SIGNAL STABILITY CHECK:",
    {
      direction: candidateDirection,
      stability:
        realStableSignalCountRef.current,
      required:
  candidateDirection === "SELL"
    ? 1
    : 2,
      confidence:
        realAIAnalysis.confidence,
      confirmations:
        realPassedConfirmations,
      entryState:
        multiTimeframeAnalysis?.entryState,
    }
  );

  // ---------------------------------------
  // Wait for two stable qualified cycles
  // ---------------------------------------

// ---------------------------------------
// Directional stability requirement
//
// BUY  -> 2 qualified observations
// SELL -> 1 qualified observation
// ---------------------------------------

const requiredRealStability =
  candidateDirection === "SELL"
    ? 1
    : 2;

    realOpportunityHistoryRef.current.push({
  candleTime:
    realCandleTime,

  action:
    candidateDirection,

  price:
    realMarketData.nifty.price,

  confidence:
    realAIAnalysis.confidence,

  confirmations:
    realPassedConfirmations,

  mtfDirection:
    multiTimeframeAnalysis?.direction ?? "WAIT",

  entryState:
    multiTimeframeAnalysis?.entryState ?? "UNKNOWN",

  stability:
    realStableSignalCountRef.current,

  requiredStability:
    requiredRealStability,

stabilityPassed:
  realStableSignalCountRef.current >=
    requiredRealStability,
    tradePlanCreated: false,
});


console.log(
  "🌐 REAL OPPORTUNITY HISTORY:",
  realOpportunityHistoryRef.current
);

if (
  realStableSignalCountRef.current <
    requiredRealStability
) {
  return;
}
  console.log(
    "✅ REAL STABLE SIGNAL CONFIRMED:",
    {
      action: candidateDirection,
      confidence:
        realAIAnalysis.confidence,
      confirmations:
        realPassedConfirmations,
    }
  );

  const realExecutionAnalysis = {
  ...realAIAnalysis,

  action: candidateDirection,

  pattern:
    realPattern,

  marketStructure:
    realMarketStructure,

  breakout:
    realBreakout,

  volumeStrength:
    "NORMAL",
};

if (executionMode === "REAL") {
processTradeEngine(
  realExecutionAnalysis,
  realMarketData.nifty.price,
  realPassedConfirmations,
  "REAL"
);
}


realStableSignalDirectionRef.current =
  null;

realStableSignalCountRef.current = 0;

}, [
  qualifiedRealSignal,
  realAIAnalysis,
  realMarketData,
  realPassedConfirmations,
  multiTimeframeAnalysis,
  signalLocked,
  tradeCooldown,
  currentSignal,
  activeTrade,
  executionMode,
]);

  const [ema20History, setEma20History] =
  useState<number[]>([]);

const [ema50History, setEma50History] =
  useState<number[]>([]);

  const [macd, setMacd] = useState<number | null>(null);
const [vwap, setVwap] = useState<number | null>(null);



  const [riskPlan, setRiskPlan] = useState({

    entry: 24650,

    target: 24730,

    stopLoss: 24610,

    riskReward: 2

  });

const [marketStructure, setMarketStructure] =
  useState("SIDEWAYS");

useEffect(() => {
  async function fetchRealMarketData() {
    try {
      const response = await fetch(
        "/api/market-data",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

if (data.success) {
  setRealMarketData(data);

  console.log(
    "REAL CANDLE CHECK:",
    Array.isArray(data.niftyCandles),
    data.niftyCandles?.length
  );

  if (Array.isArray(data.niftyCandles)) {
    setRealNiftyCandles(data.niftyCandles);
  }

  if (Array.isArray(data.niftyCandles1m)) {
    setRealNiftyCandles1m(
      data.niftyCandles1m
    );
  }
}
    } catch (error) {
      console.error(
        "REAL MARKET DATA FETCH ERROR:",
        error
      );
    }
  }

  fetchRealMarketData();

  const interval = setInterval(
    fetchRealMarketData,
    15000
  );

  return () => clearInterval(interval);

}, []);

  useEffect(() => {

  if (!tradeAlert) return;

  const timer = setTimeout(() => {
    setTradeAlert(null);
  }, 5000);

  return () => clearTimeout(timer);

}, [tradeAlert]);

// ======================================
// REPLAY SIGNAL STABILITY + EXECUTION
// ======================================

useEffect(() => {

  if (
    executionMode !== "REPLAY" ||
    !qualifiedReplaySignal ||
    !replayAIAnalysis ||
    !replayCurrentCandle
  ) {
    return;
  }

  // --------------------------------------
  // IMPORTANT:
  // Wait until qualification belongs to
  // the CURRENT replay candle.
  //
  // Do NOT reset stability while React is
  // still updating from the previous candle.
  // --------------------------------------

  const qualificationIsCurrent =
    qualifiedReplaySignal.replayIndex ===
    replayState.currentIndex;

  if (!qualificationIsCurrent) {
    return;
  }

  // --------------------------------------
  // Process each replay candle only once
  // --------------------------------------

  if (
    replayLastProcessedIndexRef.current ===
    replayState.currentIndex
  ) {
    return;
  }

  replayLastProcessedIndexRef.current =
    replayState.currentIndex;


  const replaySignalEngineAvailable =
    !signalLocked &&
    !tradeCooldown &&
    !currentSignal &&
    !activeTrade;


  const replayQualified =
    qualifiedReplaySignal.qualified === true &&
    (
      qualifiedReplaySignal.action === "BUY" ||
      qualifiedReplaySignal.action === "SELL"
    );


  // --------------------------------------
  // Current completed candle is NOT
  // qualified -> reset stability.
  // --------------------------------------

  if (!replayQualified) {

    replayStableSignalDirectionRef.current =
      null;

    replayStableSignalCountRef.current = 0;

    console.log(
      "⏪ REPLAY STABILITY RESET:",
      {
        candle:
          replayState.currentIndex + 1,

        action:
          qualifiedReplaySignal.action,

        qualified:
          qualifiedReplaySignal.qualified,
      }
    );

    return;
  }


  // --------------------------------------
  // A trade/signal already owns execution
  // --------------------------------------

  if (!replaySignalEngineAvailable) {
    return;
  }


  const direction =
    qualifiedReplaySignal.action as
      | "BUY"
      | "SELL";
replayQualifiedHistoryRef.current.push({
  candle:
    replayState.currentIndex + 1,

  action:
    direction,

  confidence:
    replayAIAnalysis.confidence,

  confirmations:
    replayPassedConfirmations,
});

console.log(
  "📋 REPLAY QUALIFIED HISTORY:",
  replayQualifiedHistoryRef.current
);

  // --------------------------------------
  // Consecutive direction stability
  // --------------------------------------

  if (
    replayStableSignalDirectionRef.current ===
    direction
  ) {

    replayStableSignalCountRef.current += 1;

  } else {

    replayStableSignalDirectionRef.current =
      direction;

    replayStableSignalCountRef.current = 1;
  }


  console.log(
    "⏪ REPLAY SIGNAL STABILITY CHECK:",
    {
      candle:
        replayState.currentIndex + 1,

      direction,

      stability:
        replayStableSignalCountRef.current,

      required:
      direction === "SELL"
       ? 1
       : 2,

      confidence:
        replayAIAnalysis.confidence,

      confirmations:
        replayPassedConfirmations,
    }
  );


  // ======================================
  // STABLE REPLAY SIGNAL CONFIRMED
  // ======================================

const requiredReplayStability =
  replayAIAnalysis.action === "SELL"
    ? 1
    : 2;


if (
  replayStableSignalCountRef.current >=
    requiredReplayStability
) {

    console.log(
      "✅ REPLAY STABLE SIGNAL CONFIRMED:",
      {
        candle:
          replayState.currentIndex + 1,

        action:
          replayAIAnalysis.action,

        price:
          replayCurrentCandle.close,

        confidence:
          replayAIAnalysis.confidence,

        confirmations:
          replayPassedConfirmations,
      }
    );


    processTradeEngine(
      replayAIAnalysis,
      replayCurrentCandle.close,
      replayPassedConfirmations,
      "REPLAY"
    );


    replayStableSignalDirectionRef.current =
      null;

    replayStableSignalCountRef.current = 0;
  }

}, [
  executionMode,
  qualifiedReplaySignal,
  replayAIAnalysis,
  replayCurrentCandle,
  replayPassedConfirmations,
  signalLocked,
  tradeCooldown,
  currentSignal,
  activeTrade,
  replayState.currentIndex,
]);

// ======================================
// REPLAY LAB DIAGNOSTIC
// ======================================

const runReplayDiagnostics = () => {

if (
  historicalReplay5m.length === 0 ||
  replayExecutableHistoryRef.current.length === 0
) {

  console.log(
    "🧪 REPLAY DIAGNOSTICS:",
    "No executable replay opportunities available."
  );

  return;
}

const opportunities =
  replayExecutableHistoryRef.current.map(
    item => {

      return {
        candleIndex:
          item.candle - 1,

        action:
          item.action,

        entry:
          item.entry,
      };
    }
  );

  const results =
    analyzeReplayOpportunities(
      opportunities,
      historicalReplay5m
    );


  console.log(
    "📊 REPLAY DIAGNOSTIC RESULTS:",
    results
  );
};

const showReplayQualifiedHistory = () => {

  console.log(
    "📋 REPLAY QUALIFIED HISTORY:",
    replayQualifiedHistoryRef.current
  );
};

const scanReplayQualifiedCandidates = () => {

  if (
    historicalReplay5m.length === 0 ||
    replayQualifiedHistoryRef.current.length === 0
  ) {

    console.log(
      "🔎 REPLAY CANDIDATE SCAN:",
      "No qualified replay candidates available."
    );

    return;
  }

  const opportunities =
    replayQualifiedHistoryRef.current
      .map(item => {

        const candleIndex =
          item.candle - 1;

        const candle =
          historicalReplay5m[
            candleIndex
          ];

        if (!candle) {
          return null;
        }

        return {
          candleIndex,
          action:
            item.action,
          entry:
            candle.close,
        };
      })
      .filter(
        (
          item
        ): item is {
          candleIndex: number;
          action: "BUY" | "SELL";
          entry: number;
        } =>
          item !== null
      );


  const results =
    analyzeReplayOpportunities(
      opportunities,
      historicalReplay5m
    );


  console.log(
    "🔎 REPLAY QUALIFIED CANDIDATE SCAN:",
    results
  );
};

const scanReplayDateRange = async () => {

const startDate =
  new Date("2026-01-01");

const endDate =
  new Date("2026-08-21");


const allCandidates: any[] = [];

const executableCandidates: any[] = [];

const successfulScanDates: string[] = [];

const skippedScanDates: string[] = [];

  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(
      date.getDate() + 1
    )
  ) {

    const dateString =
      date
        .toISOString()
        .slice(0, 10);


/*
console.log(
  "🔎 SCANNING REPLAY DATE:",
  dateString
);
*/


    try {

      const response =
        await fetch(
          `/api/replay-data-upstox?date=${dateString}`,
          {
            cache: "no-store",
          }
        );


if (!response.ok) {

  skippedScanDates.push(
    dateString
  );

  console.log(
    "⏭️ SKIPPING DATE:",
    dateString
  );

  continue;
}


      const data =
        await response.json();


if (!data.success) {

  skippedScanDates.push(
    dateString
  );

  continue;
}

successfulScanDates.push(
  dateString
);

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

const dayCandidates =
  scanReplayDay(
    dayData
  );


const dayExecutableTrades =
  scanReplayDayExecutable(
    dayData
  );


allCandidates.push(
  ...dayCandidates
);


executableCandidates.push(
  ...dayExecutableTrades
);


    } catch (error) {

      console.error(
        "❌ REPLAY DATE SCAN ERROR:",
        dateString,
        error
      );
    }
  }


const runnerCandidates =
  findReplayRunnerCandidates(
    allCandidates
  );


const runnerExitCandidates =
  findReplayRunnerExitCandidates(
    allCandidates
  );

  const openRunnerCandidates =
  findOpenReplayRunnerCandidates(
    allCandidates
  );
  const replaySummary =
  summarizeReplayCandidates(
    allCandidates
  );

  const executableReplaySummary =
  summarizeReplayCandidates(
    executableCandidates
  );

/*
console.log(
  "📊 MULTI-DAY REPLAY CANDIDATES:",
  allCandidates
);
*/

console.log(
  "🏃 T2 / RUNNER CANDIDATES:",
  runnerCandidates
);


console.log(
  "🏁 RUNNER FINAL EXIT CANDIDATES:",
  runnerExitCandidates
);

console.log(
  "🏃 OPEN RUNNER CANDIDATES:",
  openRunnerCandidates
);

console.log(
  "📈 RAW CANDIDATE SUMMARY:",
  replaySummary
);

/*
console.log(
  "🎯 EXECUTION-AWARE TRADES:",
  executableCandidates
);
*/

console.log(
  "🎯 EXECUTION-AWARE SUMMARY:",
  executableReplaySummary
);

console.log(
  "🗓️ HISTORICAL DATA COVERAGE:",
  {
    requestedStartDate:
      startDate
        .toISOString()
        .slice(0, 10),

    requestedEndDate:
      endDate
        .toISOString()
        .slice(0, 10),

    successfulTradingDays:
      successfulScanDates.length,

    skippedCalendarDays:
      skippedScanDates.length,

    earliestSuccessfulDate:
      successfulScanDates[0] ?? null,

    latestSuccessfulDate:
      successfulScanDates[
        successfulScanDates.length - 1
      ] ?? null,

    successfulDates:
      successfulScanDates,

    skippedDates:
      skippedScanDates,
  }
);

};

// ==========================================
// RUN SERVER HISTORICAL BACKTEST
// ==========================================

const runServerHistoricalBacktest = async () => {

  if (historicalScanRunning) {
    return;
  }

  setHistoricalScanRunning(true);

  setHistoricalScanError(null);

  setHistoricalScanResult(null);


  try {

    const response =
      await fetch(
        "/api/replay-backtest?start=2026-01-01&end=2026-08-24",
        {
          cache: "no-store",
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data?.error ??
        "Historical backtest failed."
      );
    }


    setHistoricalScanResult(
      data
    );


  } catch (error) {

    setHistoricalScanError(
      error instanceof Error
        ? error.message
        : "Historical backtest failed."
    );

  } finally {

    setHistoricalScanRunning(
      false
    );
  }
};

// ======================================
// REPLAY EXECUTION TEST
// ======================================

const handleReplayExecutionTest = () => {

  if (
    executionMode !== "REPLAY" ||
    !replayExecutionTest ||
    !replayCurrentCandle ||
    !replayAIAnalysis ||
    !qualifiedReplaySignal
  ) {
    return;
  }

  if (
    !qualifiedReplaySignal.qualified ||
    (
      qualifiedReplaySignal.action !== "BUY" &&
      qualifiedReplaySignal.action !== "SELL"
    )
  ) {

    console.log(
      "🧪 REPLAY EXECUTION TEST BLOCKED:",
      "Current replay candle is not qualified."
    );

    return;
  }

  console.log(
    "🧪 REPLAY EXECUTION TEST:",
    {
      candle:
        replayState.currentIndex + 1,

      action:
        qualifiedReplaySignal.action,

      price:
        replayCurrentCandle.close,

      confidence:
        replayAIAnalysis.confidence,

      confirmations:
        replayPassedConfirmations,
    }
  );

  processTradeEngine(
    replayAIAnalysis,
    replayCurrentCandle.close,
    replayPassedConfirmations,
    "REPLAY"
  );
};

// ======================================
// TAKE TRADE
// ======================================

const handleTakeTrade = () => {

  if (!currentSignal) return;


  // ======================================
  // CENTRAL EXECUTION VALIDATION
  // ======================================

const signalSource =
  currentSignal.source ?? "SIMULATOR";

const currentExecutionPrice =
  signalSource === "REAL"
    ? realMarketData?.nifty?.price
    : signalSource === "REPLAY"
    ? replayCurrentCandle?.close
    : nifty.price;
  if (currentExecutionPrice == null) {

    setTradeAlert({
      type: "WARNING",
      title: "Trade Blocked",
      message:
        "Current market price is not available.",
    });

    return;
  }

const validation =
  validateExecution({

    source: signalSource,

    lockedAction:
      currentSignal.action,

    lockedEntry:
      currentSignal.entry,

    currentPrice:
      currentExecutionPrice,


    // ======================================
    // REAL
    // ======================================

    realQualified:
      qualifiedRealSignal?.qualified,

    realQualifiedAction:
      qualifiedRealSignal?.action,

    realV1Action:
      realAIAnalysis?.action,

    mtfDirection:
      multiTimeframeAnalysis?.direction,

    mtfEntryState:
      multiTimeframeAnalysis?.entryState,


    // ======================================
    // SIMULATOR
    // ======================================

    simulatorAction:
      aiSignal.action as
        | "BUY"
        | "SELL"
        | "WAIT"
        | "WATCH",

    simulatorRiskLevel:
      aiSignal.riskLevel,

    simulatorMarketCondition:
      aiSignal.marketCondition,

    simulatorAdvice:
      aiSignal.advice,


    // ======================================
    // REPLAY
    // ======================================

    replayQualified:
      qualifiedReplaySignal?.qualified,

    replayQualifiedAction:
      qualifiedReplaySignal?.action,

    replayV1Action:
      replayAIAnalysis?.action,

    replayMtfDirection:
      replayMultiTimeframe?.direction,

    replayMtfEntryState:
      replayMultiTimeframe?.entryState,

  });

  if (!validation.allowed) {

    console.log(
      "⛔ TAKE TRADE BLOCKED",
      {
        source:
          signalSource,

        action:
          currentSignal.action,

        entry:
          currentSignal.entry,

        currentPrice:
          currentExecutionPrice,

        reason:
          validation.reason,
      }
    );

    setTradeAlert({
      type: "WARNING",
      title: "Trade Blocked",
      message:
        validation.reason,
    });

    return;
  }


  console.log(
    "✅ EXECUTION VALIDATION PASSED",
    {
      source:
        signalSource,

      action:
        currentSignal.action,

      entry:
        currentSignal.entry,

      currentPrice:
        currentExecutionPrice,
    }
  );

  // ======================================
  // CREATE + ACTIVATE TRADE
  // ======================================

  const plan = createTradePlan(
    currentSignal.action,
    currentSignal.entry,
    currentSignal.confidence
  );

  if (!plan) {

    console.log(
      "❌ TAKE TRADE FAILED: Trade plan could not be created"
    );

    return;
  }


  const active =
    activateTrade(plan);
active.source =
  currentSignal.source;
  setActiveTrade(active);

  console.log("📈 TRADE OPENED", {
  action: active.action,
  entry: active.entry,
  stopLoss: active.stopLoss,
  target1: active.target1,
  target2: active.target2,
  confidence: active.confidence,
});

  setTradeAlert({
  type: "SUCCESS",
  title: "Trade Opened",
  message: `${active.action} trade activated`,
});

  // ======================================
  // CLEAR LOCKED SIGNAL
  // ======================================

  setCurrentSignal(null);

  setSignalLocked(false);
  setSignalCreatedAt(null);
  setSignalTimeLeft(0);
  setSignalExpiry(null);
  setLastSignal("NONE");

  console.log(
    "✅ Trade activated — locked signal cleared"
  );

};

function processTradeEngine(
  analysis: any,
  price: number,
  confirmations: number,
  source:
  | "SIMULATOR"
  | "REAL"
  | "REPLAY"
) {

  console.log("========== TRADE ENGINE CHECK ==========");
  console.log("Action:", analysis.action);
  console.log("Confidence:", analysis.confidence);
  console.log("Price:", price);
  console.log("Signal Locked:", signalLocked);
  console.log("Trade Cooldown:", tradeCooldown);
  console.log("Current Signal:", currentSignal);
  console.log("Active Trade:", activeTrade);
  console.log("Last Signal:", lastSignal);
  console.log(
    "Signal Expiry:",
    signalExpiry
      ? signalExpiry.toISOString()
      : "NONE"
  );

  // 1. Existing trade/signal protection
  if (
    signalLocked ||
    tradeCooldown ||
    currentSignal ||
    activeTrade
  ) {
    console.log(
      "❌ TRADE REJECTED: Existing signal/trade/cooldown"
    );
    return;
  }

  // 2. Only BUY / SELL can create trades
  if (
    analysis.action !== "BUY" &&
    analysis.action !== "SELL"
  ) {
    console.log(
      "❌ TRADE REJECTED: Action is not BUY/SELL"
    );
    return;
  }

  // 2B. Final AI decision safety lock
// Only the final V1 BUY/SELL decision may reach trade creation.

if (analysis.action !== "BUY" && analysis.action !== "SELL") {
  console.log(
    "🛑 FINAL TRADE SAFETY: No executable V1 action",
    {
      action: analysis.action,
      confidence: analysis.confidence,
      probability: analysis.probability,
    }
  );

  return;
}

  // 3. Confidence threshold
  if (analysis.confidence < 70) {
    console.log(
      "❌ TRADE REJECTED: Confidence below 70",
      analysis.confidence
    );
    return;
  }

  // Reject weak market conditions even when confidence is high
const directionAlignedStrongMarket =
  (
    analysis.action === "BUY" &&
    analysis.marketRegime === "TRENDING_BULLISH" &&
    analysis.marketCondition === "Strong Bullish"
  ) ||
  (
    analysis.action === "SELL" &&
    analysis.marketRegime === "TRENDING_BEARISH" &&
    analysis.marketCondition === "Strong Bearish"
  );

const highRiskActuallyUnsafe =
  analysis.riskLevel === "High" &&
  !directionAlignedStrongMarket;

if (
  analysis.marketRegime === "RANGING" ||
  analysis.marketCondition === "Sideways Market" ||
  analysis.advice === "Wait for a clearer setup" ||
  highRiskActuallyUnsafe
) {

  console.log(
    "❌ TRADE REJECTED: Market conditions are not suitable",
    {
      action: analysis.action,
      marketRegime: analysis.marketRegime,
      marketCondition: analysis.marketCondition,
      riskLevel: analysis.riskLevel,
      advice: analysis.advice,
      directionAlignedStrongMarket,
      highRiskActuallyUnsafe,
    }
  );

  return;
}
  // 4. Duplicate signal protection
  if (
    analysis.action === lastSignal &&
    signalExpiry &&
    signalExpiry > new Date()
  ) {
    console.log(
      "❌ TRADE REJECTED: Duplicate signal still valid"
    );
    return;
  }

console.log("✅ TRADE PASSED ALL CHECKS");

// Entry analysis debug logging temporarily disabled

console.log("🚨 CREATING TRADE:",
  analysis.action,
  "Confidence:",
  analysis.confidence,
  "Entry:",
  price
);

  const plan = createTradePlan(
    analysis.action,
    price,
    analysis.confidence
  );

  if (!plan) {
    console.log(
      "❌ TRADE REJECTED: createTradePlan returned null"
    );
    return;
  }

  console.log(
    "🚨 NEW TRADE PLAN CREATED:",
    JSON.stringify(plan, null, 2)
  );

  setCurrentSignal({
    id: plan.id,
    action: plan.action,
source,
    confidence: plan.confidence,
    confirmationCount: confirmations,

    trend: analysis.trend,
    marketCondition: analysis.marketCondition,
    riskLevel: analysis.riskLevel,
    advice: analysis.advice,

    pattern: analysis.pattern,

    marketStructure: analysis.marketStructure,

    breakout: analysis.breakout,

    volumeStrength: analysis.volumeStrength,

    entry: plan.entry,
    stopLoss: plan.stopLoss,
    target1: plan.target1,
    target2: plan.target2,
    riskRewardRatio: plan.riskRewardRatio,

    urgency: plan.urgency,
    status: "ACTIVE",

    createdAt: new Date(),
    expiresAt: new Date(
      Date.now() + SIGNAL_DURATION
    ),
  });

    // ======================================
  // REAL TRADE PLAN DIAGNOSTIC
  // ======================================
  
  if (source === "REAL") {

  const latestRealOpportunity =
    realOpportunityHistoryRef.current[
      realOpportunityHistoryRef.current.length - 1
    ];

  if (latestRealOpportunity) {
    latestRealOpportunity.tradePlanCreated =
      true;
  }

  console.log(
    "✅ REAL TRADE PLAN CREATED:",
    latestRealOpportunity
  );
}

  setSignalLocked(true);

  setSignalCreatedAt(new Date());

  setLastSignal(analysis.action);

  setSignalExpiry(
    new Date(Date.now() + SIGNAL_DURATION)
  );

  if (source === "REPLAY") {

  replayExecutableHistoryRef.current.push({
    candle:
      replayState.currentIndex + 1,

    action:
      plan.action,

    entry:
      plan.entry,

    confidence:
      plan.confidence,

    confirmations,
  });

  console.log(
    "🎯 REPLAY EXECUTABLE HISTORY:",
    replayExecutableHistoryRef.current
  );
}

  console.log(
    "🔒 SIGNAL LOCKED UNTIL:",
    new Date(
      Date.now() + SIGNAL_DURATION
    ).toISOString()
  );
}

useEffect(() => {

  if (!signalLocked || !signalCreatedAt) return;

  const timer = setInterval(() => {

    const elapsed =
      Date.now() - signalCreatedAt.getTime();

    const remaining =
      Math.max(
        0,
        SIGNAL_DURATION - elapsed
      );

    setSignalTimeLeft(remaining);

if (remaining <= 0) {

  setSignalLocked(false);

  setSignalCreatedAt(null);

  setSignalTimeLeft(0);

  setLastSignal("NONE");

  setSignalExpiry(null);

  // Clear expired signal from the UI and trade engine
  setCurrentSignal(null);

  setTradeAlert({
  type: "WARNING",
  title: "Signal Expired",
  message: "The locked trade signal expired before entry.",
});

  console.log("⏰ SIGNAL EXPIRED — ALL SIGNAL DATA CLEARED");

}

  }, 1000);

  return () => clearInterval(timer);

}, [
  signalLocked,
  signalCreatedAt,
]);

useEffect(() => {

    if (executionMode !== "SIMULATOR") {
      return;
    }

    const timer = setInterval(() => {



      const newNifty =
        generateMarketPrice(
          nifty.price
        );

        const breakout =
  detectBreakout(
    newNifty.price,
    levels.resistance,
    levels.support
  );

const currentCandle =
  newNifty.candle;  

    let detectedPattern = "No Pattern";

if (previousCandle) {

  console.log({
    previous: previousCandle,
    current: currentCandle,
  });

  detectedPattern = analyzePattern(
    previousCandle,
    currentCandle
  );

  if (detectedPattern !== "No Pattern") {
    console.log(`🔥 ${detectedPattern} detected`);
  }

  setPattern(detectedPattern);

}

setPreviousCandle(currentCandle); 

setCandleHistory((prev) => {

  const updated = [...prev, currentCandle];

  if (updated.length > 50) {
    updated.shift();
  }

  const sr =
    calculateSupportResistance(updated);

  setLevels(sr);

  return updated;

});

setVolumeHistory(prev => {

  const updated = [
    ...prev,
    currentCandle.volume,
  ];

  if (updated.length > 50) {
    updated.shift();
  }

  return updated;

});

const volumeStrength =
  analyzeVolume([
    ...volumeHistory,
    currentCandle.volume,
  ]);

const volumeScore =
  volumeStrength === "NORMAL"
    ? 70
    : 30;

        const niftyChange =
  ((newNifty.price - 24650) / 24650) * 100;



      const updatedHistory = [

        ...priceHistory,

        newNifty.price

      ];
const structure =
  detectMarketStructure(updatedHistory);

setMarketStructure(structure);




      const movingAverage =
        calculateMovingAverage(
          updatedHistory,
          5
        );
        
      const rsi =
        calculateRSI(
          updatedHistory,
          14
        );

        const ema20Value = calculateEMA(
  updatedHistory,
  20
);
const ema50Value = calculateEMA(
  updatedHistory,
  50
);
const macdValue = calculateMACD(
  updatedHistory
);

const vwapValue = calculateVWAP(
  updatedHistory
);

const marketTrend =
  ema20Value !== null && ema50Value !== null
    ? ema20Value > ema50Value
      ? "Bullish"
      : ema20Value < ema50Value
        ? "Bearish"
        : "Neutral"
    : "Neutral";
    
console.log("Pattern being sent to AI:", detectedPattern);

console.group("🧪 SIMULATOR V1 ANALYSIS");
      const analysis = analyzeMarketV1({
  price: newNifty.price,
  previousPrice: nifty.price,
  trend: marketTrend,
  rsi,
  ema20: ema20Value,
  ema50: ema50Value,
  macd: macdValue,
 pattern: detectedPattern,
   support: levels.support,
  resistance: levels.resistance,
  marketStructure: structure,
  breakout,
  volumeStrength,

});
console.groupEnd();

console.log("========== V1 AI ANALYSIS ==========");

console.log("V1:", analysis);

console.log("V1 Breakdown:", analysis.breakdown);

// ===============================
// FINAL AI DECISION CHECK
// ===============================

console.log("🚦 FINAL AI DECISION CHECK:", {

  v1Action: analysis.action,
  v1Confidence: analysis.confidence,
  v1Probability: analysis.probability,
  v1Trend: analysis.trend,
  v1TradeQuality: analysis.tradeQuality,

  v1Reasons: analysis.reasons,

});

// =======================================
// SIGNAL STABILITY + QUALITY GATE
// =======================================

const isBuyCandidate =
  analysis.action === "BUY";

const isSellCandidate =
  analysis.action === "SELL";


// ---------------------------------------
// 6 directional confirmation checks
// ---------------------------------------

const confirmationChecks = [

  // 1. Trend
  isBuyCandidate
    ? marketTrend === "Bullish"
    : isSellCandidate
    ? marketTrend === "Bearish"
    : false,

  // 2. Candlestick pattern
  isBuyCandidate
    ? (
        detectedPattern === "Bullish Engulfing" ||
        detectedPattern === "Hammer"
      )
    : isSellCandidate
    ? detectedPattern === "Bearish Engulfing"
    : false,

  // 3. Market structure
  isBuyCandidate
    ? structure === "UPTREND"
    : isSellCandidate
    ? structure === "DOWNTREND"
    : false,

  // 4. Breakout / Breakdown
  isBuyCandidate
    ? breakout === "BREAKOUT"
    : isSellCandidate
    ? breakout === "BREAKDOWN"
    : false,

// 5. Volume
volumeStrength === "HIGH",

  // 6. Confidence
  analysis.confidence >= 90,

];


const passedConfirmations =
  confirmationChecks.filter(Boolean).length;


const candidateEligible =
  (
    isBuyCandidate ||
    isSellCandidate
  ) &&
  analysis.confidence >= 90 &&
  passedConfirmations >= 4; 


// ---------------------------------------
// Do not build another candidate while
// a signal/trade/cooldown already exists
// ---------------------------------------

const signalEngineAvailable =
  !signalLocked &&
  !tradeCooldown &&
  !currentSignal &&
  !activeTrade;


// ---------------------------------------
// Stability counter
// ---------------------------------------

if (
  candidateEligible &&
  signalEngineAvailable
) {

  const candidateDirection =
    analysis.action as "BUY" | "SELL";


  if (
    stableSignalDirectionRef.current ===
    candidateDirection
  ) {

    stableSignalCountRef.current += 1;

  } else {

    stableSignalDirectionRef.current =
      candidateDirection;

    stableSignalCountRef.current = 1;

  }


  console.log(
    "🧠 SIGNAL STABILITY CHECK:",
    {
      direction: candidateDirection,
      stability:
        stableSignalCountRef.current,
      required: 2,
      confidence:
        analysis.confidence,
      confirmations:
        passedConfirmations,
    }
  );


  // =====================================
  // SIGNAL CONFIRMED
  // =====================================

const requiredSignalStability =
  analysis.action === "SELL"
    ? 1
    : 2;


if (
  stableSignalCountRef.current >=
    requiredSignalStability
) {

    console.log(
      "✅ STABLE SIGNAL CONFIRMED:",
      {
        action: analysis.action,
        confidence:
          analysis.confidence,
        confirmations:
          passedConfirmations,
        stability:
          stableSignalCountRef.current,
      }
    );

if (executionMode === "SIMULATOR") {

  setTradeAlert({
    type: "INFO",
    title: "Signal Confirmed",
    message: `${analysis.action} signal confirmed at ${analysis.confidence}% confidence with ${passedConfirmations}/6 confirmations.`,
  });

  processTradeEngine(
    analysis,
    newNifty.price,
    passedConfirmations,
    "SIMULATOR"
  );
}

    // A new future signal must prove
    // stability again from zero.
    stableSignalDirectionRef.current =
      null;

    stableSignalCountRef.current = 0;

  }

} else {

  // BUY → WAIT or SELL → WAIT etc.
  // immediately resets confirmation.
  stableSignalDirectionRef.current =
    null;

  stableSignalCountRef.current = 0;


  if (
    isBuyCandidate ||
    isSellCandidate
  ) {

    console.log(
      "⏳ SIGNAL NOT READY:",
      {
        action:
          analysis.action,
        confidence:
          analysis.confidence,
        confirmations:
          passedConfirmations,
        requiredConfirmations: 4,
        signalEngineAvailable,
      }
    );

  }

}

// ======================================
// ACTIVE TRADE UPDATE
// REAL + SIMULATOR ONLY
//
// REPLAY trade management is processed
// separately from Replay candle changes.
// ======================================

if (
  activeTrade &&
  activeTrade.source !== "REPLAY"
) {

  const activeTradePrice =
    activeTrade.source === "REAL"
      ? realMarketData?.nifty?.price
      : newNifty.price;

  if (activeTradePrice != null) {

    processActiveTradeUpdate(
      activeTrade,
      activeTradePrice
    );
  }
}

// Create expiry only for BUY / SELL signals

if (
  analysis.action === "BUY" ||
  analysis.action === "SELL"
) {
  setSignalExpiry(getSignalExpiry());
} else {
  setSignalExpiry(null);
}

      const risk =
        calculateRisk({

          price: newNifty.price,

          action: analysis.action

        });






      setNifty({
  price: newNifty.price,
  change: Number(niftyChange.toFixed(2))
});



      const newBankNifty =
  generateMarketPrice(
    bankNifty.price
  );

const bankNiftyChange =
  ((newBankNifty.price - 55230) / 55230) * 100;


setBankNifty({
  price: newBankNifty.price,
  change: Number(bankNiftyChange.toFixed(2))
});



      setPriceHistory(

        updatedHistory.slice(-50)

      );



      setCurrentRSI(rsi);
      setEma20(ema20Value);
      setEma50(ema50Value);

    if (ema20Value !== null) {
  setEma20History(prev => {
    const updated = [...prev, ema20Value];

    if (updated.length > 50) {
      updated.shift();
    }

    return updated;
  });
}

if (ema50Value !== null) {
  setEma50History(prev => {
    const updated = [...prev, ema50Value];

    if (updated.length > 50) {
      updated.shift();
    }

    return updated;
  });
}
      
      setMacd(macdValue);
      setVwap(vwapValue);


console.log("AI Analysis:", analysis);

      setAiSignal(analysis);

      setSignalHistory(prev => {
  const updated = [
    ...prev,
    {
      action: analysis.action,
      confidence: analysis.confidence,
      pattern,
      candleIndex: candleHistory.length,
    },
  ];

  if (updated.length > 50) {
    updated.shift();
  }

  return updated;
});

if (detectedPattern !== "No Pattern") {
  setPatternHistory(prev => {
    const updated = [
      ...prev,
      {
        type: detectedPattern,
        candleIndex: candleHistory.length,
      },
    ];

    if (updated.length > 50) {
      updated.shift();
    }

    return updated;
  });
}



      setRiskPlan(risk);




    },1000);





    return () => clearInterval(timer);



}, [
  nifty,
  bankNifty,
  priceHistory,
  activeTrade,
  executionMode,
  realMarketData?.nifty?.price,
]);

// ======================================
// REAL ACTIVE TRADE UPDATE
// ======================================

useEffect(() => {

  if (executionMode !== "REAL") {
    return;
  }

  if (
    !activeTrade ||
    activeTrade.source !== "REAL"
  ) {
    return;
  }

  const activeTradePrice =
    realMarketData?.nifty?.price;

  if (activeTradePrice == null) {
    return;
  }

  processActiveTradeUpdate(
    activeTrade,
    activeTradePrice
  );

}, [
  executionMode,
  activeTrade,
  realMarketData?.nifty?.price,
]);

  return (

    <div className="min-h-screen bg-gray-950 text-white">


      <Header />

      <TradeAlert alert={tradeAlert} />

      <div className="flex">


        <Sidebar />



        <main className="p-6 flex-1">



          <h2 className="text-3xl font-bold">

            MM AI Trader Dashboard

          </h2>




          <p className="text-gray-400 mt-2">

            AI-powered intraday trading assistant.

          </p>

<MarketOverview
  nifty={
    executionMode === "REAL" &&
    realMarketData?.nifty?.price != null
      ? realMarketData.nifty.price
      : nifty.price
  }

  bankNifty={
    executionMode === "REAL" &&
    realMarketData?.bankNifty?.price != null
      ? realMarketData.bankNifty.price
      : bankNifty.price
  }

niftyChange={
  executionMode === "REAL" &&
  realMarketData?.nifty?.changePercent != null
    ? realMarketData.nifty.changePercent
    : nifty.change
}

bankNiftyChange={
  executionMode === "REAL" &&
  realMarketData?.bankNifty?.changePercent != null
    ? realMarketData.bankNifty.changePercent
    : bankNifty.change
}
/>

{realMarketData && (
  <details className="mt-3 border border-gray-800 rounded-lg bg-gray-900">

    <summary className="px-3 py-3 cursor-pointer font-semibold text-gray-200">
      🌐 Real Market Data — Diagnostics
    </summary>

    <div className="p-3 pt-1">

    <div>
      NIFTY 50:{" "}
      <strong>
        {realMarketData.nifty.price?.toFixed(2)}
      </strong>
    </div>

    <div>
      BANK NIFTY:{" "}
      <strong>
        {realMarketData.bankNifty.price?.toFixed(2)}
      </strong>
    </div>
    <div>
  Real NIFTY candles:{" "}
  <strong>{realNiftyCandles.length}</strong>
</div>
<div>
  Real 1m candles:{" "}
  <strong>
    {realNiftyCandles1m.length}
  </strong>
</div>
<div>
  Real RSI:{" "}
  <strong>
    {realRSI !== null
      ? realRSI.toFixed(2)
      : "Calculating..."}
  </strong>
</div>
<div>
  Real EMA20:{" "}
  <strong>
    {realEMA20 !== null
      ? realEMA20.toFixed(2)
      : "Calculating..."}
  </strong>
</div>
<div>
  Real EMA50:{" "}
  <strong>
    {realEMA50 !== null
      ? realEMA50.toFixed(2)
      : "Calculating..."}
  </strong>
</div>
<div>
  Real MACD:{" "}
  <strong>
    {realMACD !== null
      ? realMACD.toFixed(2)
      : "Calculating..."}
  </strong>
</div>
<div>
  Real Support:{" "}
  <strong>
    {realLevels.support.length > 0
      ? realLevels.support
          .map((level) => level.toFixed(2))
          .join(", ")
      : "None"}
  </strong>
</div>

<div>
  Real Resistance:{" "}
  <strong>
    {realLevels.resistance.length > 0
      ? realLevels.resistance
          .map((level) => level.toFixed(2))
          .join(", ")
      : "None"}
  </strong>
</div>
<div>
  Real Pattern:{" "}
  <strong>{realPattern}</strong>
</div>
<div>
  Real Market Structure:{" "}
  <strong>{realMarketStructure}</strong>
</div>
<div>
  Real Breakout:{" "}
  <strong>{realBreakout}</strong>
</div>
<div>
  Real Trend:{" "}
  <strong>{realTrend}</strong>
</div>
<div>
  Debug realTrend:{" "}
  <strong>{realTrend}</strong>
</div>

<div>
  Debug realRSI:{" "}
  <strong>{realRSI ?? "--"}</strong>
</div>

<div>
  Debug realEMA20:{" "}
  <strong>{realEMA20 ?? "--"}</strong>
</div>

<div>
  Debug realEMA50:{" "}
  <strong>{realEMA50 ?? "--"}</strong>
</div>

<div>
  Debug realMarketStructure:{" "}
  <strong>{realMarketStructure}</strong>
</div>

<div>
  Debug realBreakout:{" "}
  <strong>{realBreakout}</strong>
</div>
<div>
  Analyzer 5m Trend:{" "}
  <strong>
    {analysis5m?.trend ?? "--"}
  </strong>
</div>
<div>
  Analyzer 1m Trend:{" "}
  <strong>
    {analysis1m?.trend ?? "--"}
  </strong>
</div>
<div>
  Analyzer 5m RSI:{" "}
  <strong>
    {analysis5m?.rsi ?? "--"}
  </strong>
</div>

<div>
  Analyzer 1m RSI:{" "}
  <strong>
    {analysis1m?.rsi ?? "--"}
  </strong>
</div>

<div>
  Analyzer 5m Pattern:{" "}
  <strong>
    {analysis5m?.pattern ?? "--"}
  </strong>
</div>

<div>
  Analyzer 1m Pattern:{" "}
  <strong>
    {analysis1m?.pattern ?? "--"}
  </strong>
</div>

<div>
  Analyzer 5m Structure:{" "}
  <strong>
    {analysis5m?.marketStructure ?? "--"}
  </strong>
</div>

<div>
  Analyzer 1m Structure:{" "}
  <strong>
    {analysis1m?.marketStructure ?? "--"}
  </strong>
</div>

<div>
  Analyzer 5m Breakout:{" "}
  <strong>
    {analysis5m?.breakout ?? "--"}
  </strong>
</div>

<div>
  Analyzer 1m Breakout:{" "}
  <strong>
    {analysis1m?.breakout ?? "--"}
  </strong>
</div>

<div>
  Multi-Timeframe Direction:{" "}
  <strong>
    {multiTimeframeAnalysis?.direction ?? "--"}
  </strong>
</div>

<div>
  Multi-Timeframe Alignment:{" "}
  <strong>
    {multiTimeframeAnalysis?.alignment ?? "--"}
  </strong>
</div>

<div>
  Multi-Timeframe Entry State:{" "}
  <strong>
    {multiTimeframeAnalysis?.entryState ?? "--"}
  </strong>
</div>

<div>
  Multi-Timeframe Reason:{" "}
  <strong>
    {multiTimeframeAnalysis?.reasons?.[0] ?? "--"}
  </strong>
</div>

<div className="mt-2">
  Qualified Real Signal:{" "}
  <strong>
    {qualifiedRealSignal?.action ?? "--"}
  </strong>
</div>

<div>
  Qualified:{" "}
  <strong>
    {qualifiedRealSignal?.qualified
      ? "YES"
      : "NO"}
  </strong>
</div>

<div>
  Qualification Reason:{" "}
  <strong>
    {qualifiedRealSignal?.reason ?? "--"}
  </strong>
</div>

<div className="mt-2">
  Real V1 Action:{" "}
  <strong>
    {realAIAnalysis?.action ?? "Waiting..."}
  </strong>
</div>

<div>
  Real V1 Confidence:{" "}
  <strong>
    {realAIAnalysis?.confidence ?? "--"}%
  </strong>
</div>
<div>
  Real V1 Probability:{" "}
  <strong>
    {realAIAnalysis?.probability ?? "--"}%
  </strong>
</div>

<div>
  Real V1 Trend Score:{" "}
  <strong>
    {realAIAnalysis?.breakdown?.trend ?? "--"}
  </strong>
</div>

<div>
  Real V1 Momentum Score:{" "}
  <strong>
    {realAIAnalysis?.breakdown?.momentum ?? "--"}
  </strong>
</div>

<div>
  Real V1 EMA Score:{" "}
  <strong>
    {realAIAnalysis?.breakdown?.ema ?? "--"}
  </strong>
</div>

<div>
  Real V1 Structure Score:{" "}
  <strong>
    {realAIAnalysis?.breakdown?.structure ?? "--"}
  </strong>
</div>

<div>
  Real V1 Breakout Score:{" "}
  <strong>
    {realAIAnalysis?.breakdown?.breakout ?? "--"}
  </strong>
</div>

<div>
  Real V1 Risk Score:{" "}
  <strong>
    {realAIAnalysis?.breakdown?.risk ?? "--"}
  </strong>
</div>

<div>
  Real Confirmations:{" "}
  <strong>
    {realPassedConfirmations} / 6
  </strong>
</div>
<div>
  Real V1 Market:{" "}
  <strong>
    {realAIAnalysis?.marketCondition ?? "--"}
  </strong>
</div>

<div>
  Real V1 Risk:{" "}
  <strong>
    {realAIAnalysis?.riskLevel ?? "--"}
  </strong>
</div>

<div>
  Real V1 Advice:{" "}
  <strong>
    {realAIAnalysis?.advice ?? "--"}
  </strong>
</div>
<div>
  Real Market Regime:{" "}
  <strong>
    {realAIAnalysis?.marketRegime ?? "--"}
  </strong>
</div>

<div>
  Real Trade Quality:{" "}
  <strong>
    {realAIAnalysis?.tradeQuality ?? "--"}
  </strong>
</div>
{realNiftyCandles.length > 0 && (
  <div>
    Latest candle:{" "}
    <strong>
      {new Date(
        realNiftyCandles[
          realNiftyCandles.length - 1
        ].time
      ).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      })}
    </strong>

    {" | Close: "}

    <strong>
      {realNiftyCandles[
        realNiftyCandles.length - 1
      ].close?.toFixed(2)}
    </strong>
  </div>
)}

<div className="mt-4 pt-3 border-t border-gray-800">

  <div className="font-semibold mb-2">
    REAL Opportunity History
  </div>

  <div>
    Qualified opportunities recorded:{" "}
    <strong>
      {realOpportunityHistoryRef.current.length}
    </strong>
  </div>

  {realOpportunityHistoryRef.current.length === 0 ? (

    <div className="mt-2 text-gray-400">
      No qualified REAL opportunities recorded
      during this session.
    </div>

  ) : (

    <div className="mt-2 space-y-2">

      {realOpportunityHistoryRef.current.map(
        (item, index) => (

          <div
            key={`${item.candleTime}-${index}`}
            className="p-2 border border-gray-800 rounded"
          >
            <div>
              Opportunity #{index + 1}
            </div>

            <div>
              Candle:{" "}
              <strong>
                {item.candleTime != null
                  ? new Date(
                      item.candleTime
                    ).toLocaleTimeString(
                      "en-IN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone:
                          "Asia/Kolkata",
                      }
                    )
                  : "--"}
              </strong>
            </div>

            <div>
              Action:{" "}
              <strong>{item.action}</strong>
            </div>

            <div>
              Price:{" "}
              <strong>
                {item.price.toFixed(2)}
              </strong>
            </div>

            <div>
              Confidence:{" "}
              <strong>
                {item.confidence}%
              </strong>
            </div>

            <div>
              Confirmations:{" "}
              <strong>
                {item.confirmations} / 6
              </strong>
            </div>

            <div>
              MTF:{" "}
              <strong>
                {item.mtfDirection}
              </strong>
            </div>

            <div>
              Entry State:{" "}
              <strong>
                {item.entryState}
              </strong>
            </div>

            <div>
              Stability:{" "}
              <strong>
                {item.stability} /{" "}
                {item.requiredStability}
              </strong>
            </div>

            <div>
              Stability Passed:{" "}
              <strong>
                {item.stabilityPassed
                  ? "YES"
                  : "NO"}
              </strong>
            </div>

          </div>

        )
      )}

    </div>

  )}

</div>

  </div>
   </details>
)}

{/* ================= EXECUTION MODE ================= */}

<div className="mt-4 p-3 border border-gray-800 rounded-lg bg-gray-900">

  <div className="flex items-center justify-between gap-4">
  
    <div>
      <div className="text-sm font-semibold">
        Execution Mode
      </div>

      <div className="text-xs text-gray-400 mt-1">
        Controls which market source can create Trade Plans.
      </div>
    </div>

    <div className="flex gap-2">

      <button
        type="button"
        onClick={() =>
          setExecutionMode("REAL")
        }
        disabled={
          !!currentSignal ||
          !!activeTrade
        }
        className={`px-4 py-2 rounded-md text-sm font-semibold border ${
          executionMode === "REAL"
            ? "bg-green-700 border-green-500 text-white"
            : "bg-gray-800 border-gray-700 text-gray-300"
        } ${
          currentSignal || activeTrade
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        REAL
      </button>

      <button
        type="button"
        onClick={() =>
          setExecutionMode("SIMULATOR")
        }
        disabled={
          !!currentSignal ||
          !!activeTrade
        }
        className={`px-4 py-2 rounded-md text-sm font-semibold border ${
          executionMode === "SIMULATOR"
            ? "bg-blue-700 border-blue-500 text-white"
            : "bg-gray-800 border-gray-700 text-gray-300"
        } ${
          currentSignal || activeTrade
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        SIMULATOR
      </button>

      <button
        type="button"
        onClick={() =>
          setExecutionMode("REPLAY")
        }
        disabled={
          !!currentSignal ||
          !!activeTrade
        }
        className={`px-4 py-2 rounded-md text-sm font-semibold border ${
          executionMode === "REPLAY"
            ? "bg-purple-700 border-purple-500 text-white"
            : "bg-gray-800 border-gray-700 text-gray-300"
        } ${
          currentSignal || activeTrade
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        REPLAY
      </button>

    </div>

  </div>

  <div className="mt-2 text-xs text-gray-400">

    Current mode:{" "}

    <strong className="text-white">
      {executionMode}
    </strong>

    {(currentSignal || activeTrade) && (
      <span className="ml-2 text-yellow-400">
        — mode locked while a signal or trade is active
      </span>
    )}

  </div>

</div>

{/* ================= REPLAY CONTROLS ================= */}

{executionMode === "REPLAY" && (
  <div className="mt-4 p-3 border border-gray-800 rounded-lg bg-gray-900">

    <div className="font-semibold mb-3">
      Replay Test
    </div>

<div className="flex gap-2 mb-3">

<div className="flex items-center gap-2">

  <input
    type="date"
    value={replayDate}
    onChange={(event) =>
      setReplayDate(
        event.target.value
      )
    }
    disabled={
      replayRunning ||
      !!currentSignal ||
      !!activeTrade
    }
    className="px-3 py-2 rounded-md border border-gray-700 bg-gray-800 text-white"
  />

  <button
    type="button"
    onClick={loadHistoricalReplay}
    disabled={
      replayRunning ||
      !!currentSignal ||
      !!activeTrade
    }
    className={`px-4 py-2 rounded-md border border-gray-700 bg-gray-800 ${
      replayRunning ||
      currentSignal ||
      activeTrade
        ? "opacity-50 cursor-not-allowed"
        : ""
    }`}
  >
    Load Replay Data
  </button>

</div>

  <button
    type="button"
    onClick={() =>
      setReplayRunning(true)
    }
    disabled={
      !replayLoaded ||
      replayRunning
    }
    className={`px-4 py-2 rounded-md border border-gray-700 bg-gray-800 ${
      !replayLoaded || replayRunning
        ? "opacity-50 cursor-not-allowed"
        : ""
    }`}
  >
    Run Replay
  </button>

  <button
    type="button"
    onClick={() =>
      setReplayRunning(false)
    }
    disabled={!replayRunning}
    className={`px-4 py-2 rounded-md border border-gray-700 bg-gray-800 ${
      !replayRunning
        ? "opacity-50 cursor-not-allowed"
        : ""
    }`}
  >
    Pause
  </button>

  <button
    type="button"
    onClick={handleReplayNext}
    disabled={
      !replayLoaded ||
      replayRunning
    }
    className={`px-4 py-2 rounded-md border border-gray-700 bg-gray-800 ${
      !replayLoaded || replayRunning
        ? "opacity-50 cursor-not-allowed"
        : ""
    }`}
  >
    Next Candle
  </button>

<button
  type="button"
  onClick={() =>
    setReplayExecutionTest(
      prev => !prev
    )
  }
  disabled={!replayLoaded}
  className={`px-4 py-2 rounded-md border ${
    replayExecutionTest
      ? "bg-purple-700 border-purple-500 text-white"
      : "bg-gray-800 border-gray-700 text-gray-300"
  } ${
    !replayLoaded
      ? "opacity-50 cursor-not-allowed"
      : ""
  }`}
>
  {replayExecutionTest
    ? "Execution Test ON"
    : "Execution Test OFF"}
</button>

<button
  type="button"
  onClick={handleReplayExecutionTest}
  disabled={
    !replayExecutionTest ||
    !qualifiedReplaySignal?.qualified ||
    !!currentSignal ||
    !!activeTrade
  }
  className={`px-4 py-2 rounded-md border ${
    replayExecutionTest &&
    qualifiedReplaySignal?.qualified &&
    !currentSignal &&
    !activeTrade
      ? "bg-green-700 border-green-500 text-white"
      : "bg-gray-800 border-gray-700 text-gray-500 opacity-50 cursor-not-allowed"
  }`}
>
  Create Test Trade Plan
</button>

  <button
    type="button"

onClick={() => {

  setReplayRunning(false);

  setReplayState(prev =>
    resetReplay(prev)
  );

  // Clear Replay stability
  replayStableSignalDirectionRef.current =
    null;

  replayStableSignalCountRef.current = 0;

replayLastProcessedIndexRef.current =
  null;

replayTradeLastProcessedIndexRef.current =
  null;

replayQualifiedHistoryRef.current = [];
replayExecutableHistoryRef.current = [];

  // Clear shared signal state
  setCurrentSignal(null);

  setSignalLocked(false);

  setSignalCreatedAt(null);

  setSignalTimeLeft(0);

  setSignalExpiry(null);

  setLastSignal("NONE");

  // Clear trade/cooldown state
  setActiveTrade(null);

  setTradeCooldown(false);

  console.log(
    "♻️ REPLAY FULL RESET COMPLETE"
  );
}}

    disabled={!replayLoaded}
    className={`px-4 py-2 rounded-md border border-gray-700 bg-gray-800 ${
      !replayLoaded
        ? "opacity-50 cursor-not-allowed"
        : ""
    }`}
  >
    Reset
  </button>

</div>

<button
  type="button"
  onClick={showReplayQualifiedHistory}
  disabled={!replayLoaded}
  className={`px-4 py-2 rounded-md border ${
    replayLoaded
      ? "bg-gray-800 border-gray-600 text-white"
      : "bg-gray-800 border-gray-700 text-gray-500 opacity-50 cursor-not-allowed"
  }`}
>
  Show Qualified History
</button>

{/* ======================================
    HISTORICAL BACKTEST CONTROLS
====================================== */}

<div className="flex flex-wrap gap-3 items-start">

  <button
    type="button"
    onClick={runServerHistoricalBacktest}
    disabled={historicalScanRunning}
    className={`px-4 py-2 rounded-md border ${
      historicalScanRunning
        ? "bg-gray-800 border-gray-700 text-gray-500 opacity-50 cursor-not-allowed"
        : "bg-emerald-700 border-emerald-500 text-white"
    }`}
  >
    {historicalScanRunning
      ? "Scanning Historical Data..."
      : "Run Server Backtest"}
  </button>


  <details className="rounded-md border border-gray-700 bg-gray-900">

    <summary className="px-4 py-2 cursor-pointer text-sm text-gray-300">
      Developer / Diagnostics
    </summary>


    <div className="p-3 pt-1 flex flex-wrap gap-3">

      <button
        type="button"
        onClick={scanReplayQualifiedCandidates}
        disabled={
          !replayLoaded ||
          replayQualifiedHistoryRef.current.length === 0
        }
        className={`px-4 py-2 rounded-md border ${
          replayLoaded &&
          replayQualifiedHistoryRef.current.length > 0
            ? "bg-purple-700 border-purple-500 text-white"
            : "bg-gray-800 border-gray-700 text-gray-500 opacity-50 cursor-not-allowed"
        }`}
      >
        Scan Qualified Candidates
      </button>


      <button
        type="button"
        onClick={scanReplayDateRange}
        className="px-4 py-2 rounded-md border bg-indigo-700 border-indigo-500 text-white"
      >
        Scan Multi-Day Replay
      </button>

    </div>

  </details>

</div>

{historicalScanError && (
  <div className="mt-3 p-3 rounded-md border border-red-700 bg-red-950/40 text-red-300">
    Historical backtest failed: {historicalScanError}
  </div>
)}


{historicalScanResult && (
  <div className="mt-4 p-4 rounded-lg border border-emerald-700 bg-gray-900">

    <div className="text-lg font-semibold mb-3">
      ✅ Historical Backtest Complete
    </div>


    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">

      <div>
        <div className="text-gray-400">
          Trading Days
        </div>
        <div className="font-semibold">
          {historicalScanResult.coverage?.successfulTradingDays ?? 0}
        </div>
      </div>

<div>
  <div className="text-gray-400">
    Skipped Days
  </div>
  <div className="font-semibold">
    {historicalScanResult.coverage?.skippedCalendarDays ?? 0}
  </div>
</div>

<div>
  <div className="text-gray-400">
    Failed Days
  </div>
  <div className="font-semibold">
    {historicalScanResult.coverage?.failedDays ?? 0}
  </div>
</div>

      <div>
        <div className="text-gray-400">
          Executable Trades
        </div>
        <div className="font-semibold">
          {historicalScanResult.executionAwareSummary?.totalCandidates ?? 0}
        </div>
      </div>

<div>
  <div className="text-gray-400">
    BUY Trades
  </div>
  <div className="font-semibold">
    {historicalScanResult.executionAwareSummary?.buyCandidates ?? 0}
  </div>
</div>


<div>
  <div className="text-gray-400">
    SELL Trades
  </div>
  <div className="font-semibold">
    {historicalScanResult.executionAwareSummary?.sellCandidates ?? 0}
  </div>
</div>

      <div>
        <div className="text-gray-400">
          Wins
        </div>
        <div className="font-semibold">
          {historicalScanResult.executionAwareSummary?.wins ?? 0}
        </div>
      </div>

      <div>
        <div className="text-gray-400">
          Losses
        </div>
        <div className="font-semibold">
          {historicalScanResult.executionAwareSummary?.losses ?? 0}
        </div>
      </div>


      <div>
        <div className="text-gray-400">
          Breakevens
        </div>
        <div className="font-semibold">
          {historicalScanResult.executionAwareSummary?.breakevens ?? 0}
        </div>
      </div>


      <div>
        <div className="text-gray-400">
          Open Trades
        </div>
        <div className="font-semibold">
          {historicalScanResult.executionAwareSummary?.openTrades ?? 0}
        </div>
      </div>


      <div>
        <div className="text-gray-400">
          Target 1 Hits
        </div>
        <div className="font-semibold">
          {historicalScanResult.executionAwareSummary?.target1Hits ?? 0}
        </div>
      </div>


      <div>
        <div className="text-gray-400">
          Target 2 Hits
        </div>
        <div className="font-semibold">
          {historicalScanResult.executionAwareSummary?.target2Hits ?? 0}
        </div>
      </div>


      <div>
        <div className="text-gray-400">
          Runner Activations
        </div>
        <div className="font-semibold">
          {historicalScanResult.executionAwareSummary?.runnerActivations ?? 0}
        </div>
      </div>


      <div>
        <div className="text-gray-400">
          Total P/L
        </div>
        <div className="font-semibold">
          {Number(
            historicalScanResult.executionAwareSummary?.totalRealizedPnL ?? 0
          ).toFixed(2)}
        </div>
      </div>


      <div>
        <div className="text-gray-400">
          Win Rate
        </div>
        <div className="font-semibold">
          {Number(
            historicalScanResult.executionAwareSummary?.winRate ?? 0
          ).toFixed(2)}%
        </div>
      </div>


      <div>
        <div className="text-gray-400">
          Scan Duration
        </div>
        <div className="font-semibold">
          {Number(
            historicalScanResult.performance?.scanDurationSeconds ?? 0
          ).toFixed(2)}s
        </div>
      </div>

    </div>


    {/* ======================================
        PERFORMANCE ANALYTICS
    ====================================== */}

    {historicalScanResult?.performanceAnalytics && (

      <div className="mt-6">

        <h3 className="text-lg font-semibold mb-4">
          📊 Performance Analytics
        </h3>


        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div>
            <div className="text-gray-400">
              Net P/L
            </div>
            <div className="font-semibold">
              {historicalScanResult.performanceAnalytics.netPnL.toFixed(2)}
            </div>
          </div>


          <div>
            <div className="text-gray-400">
              Gross Profit
            </div>
            <div className="font-semibold">
              {historicalScanResult.performanceAnalytics.grossProfit.toFixed(2)}
            </div>
          </div>


          <div>
            <div className="text-gray-400">
              Gross Loss
            </div>
            <div className="font-semibold">
              {historicalScanResult.performanceAnalytics.grossLoss.toFixed(2)}
            </div>
          </div>


          <div>
            <div className="text-gray-400">
              Profit Factor
            </div>
            <div className="font-semibold">
              {historicalScanResult.performanceAnalytics.profitFactor === Infinity
                ? "∞"
                : historicalScanResult.performanceAnalytics.profitFactor.toFixed(2)}
            </div>
          </div>


          <div>
            <div className="text-gray-400">
              Average Trade
            </div>
            <div className="font-semibold">
              {historicalScanResult.performanceAnalytics.averageTrade.toFixed(2)}
            </div>
          </div>


          <div>
            <div className="text-gray-400">
              Average Win
            </div>
            <div className="font-semibold">
              {historicalScanResult.performanceAnalytics.averageWin.toFixed(2)}
            </div>
          </div>


          <div>
            <div className="text-gray-400">
              Average Loss
            </div>
            <div className="font-semibold">
              {historicalScanResult.performanceAnalytics.averageLoss.toFixed(2)}
            </div>
          </div>


          <div>
            <div className="text-gray-400">
              Max Drawdown
            </div>
            <div className="font-semibold">
              {historicalScanResult.performanceAnalytics.maxDrawdown.toFixed(2)}
            </div>
          </div>


          <div>
            <div className="text-gray-400">
              Longest Win Streak
            </div>
            <div className="font-semibold">
              {historicalScanResult.performanceAnalytics.longestWinningStreak}
            </div>
          </div>


          <div>
            <div className="text-gray-400">
              Longest Loss Streak
            </div>
            <div className="font-semibold">
              {historicalScanResult.performanceAnalytics.longestLosingStreak}
            </div>
          </div>


          <div>
            <div className="text-gray-400">
              T1 Hits
            </div>
            <div className="font-semibold">
              {historicalScanResult.performanceAnalytics.target1Hits}
            </div>
          </div>


          <div>
            <div className="text-gray-400">
              T2 Hits
            </div>
            <div className="font-semibold">
              {historicalScanResult.performanceAnalytics.target2Hits}
            </div>
          </div>


          <div>
            <div className="text-gray-400">
              Runner Activations
            </div>
            <div className="font-semibold">
              {historicalScanResult.performanceAnalytics.runnerActivations}
            </div>
          </div>

        </div>

{/* ======================================
    MONTHLY PERFORMANCE
====================================== */}

{Array.isArray(
  historicalScanResult.performanceAnalytics.monthlyPerformance
) &&
historicalScanResult.performanceAnalytics.monthlyPerformance.length > 0 && (

  <div className="mt-6">

    <h4 className="text-base font-semibold mb-3">
      📅 Monthly Performance
    </h4>


    <div className="overflow-x-auto">

      <table className="w-full text-sm">

        <thead>

          <tr className="text-left text-gray-400 border-b border-gray-700">

            <th className="py-2 pr-4">
              Month
            </th>

            <th className="py-2 pr-4">
              Trades
            </th>

            <th className="py-2 pr-4">
              Wins
            </th>

            <th className="py-2 pr-4">
              Losses
            </th>

            <th className="py-2 pr-4">
              BE
            </th>

            <th className="py-2 pr-4">
              Win Rate
            </th>

            <th className="py-2">
              Net P/L
            </th>

          </tr>

        </thead>


        <tbody>

          {historicalScanResult.performanceAnalytics.monthlyPerformance.map(
            (
              month: any
            ) => (

              <tr
                key={month.month}
                className="border-b border-gray-800"
              >

                <td className="py-2 pr-4">
                  {month.month}
                </td>

                <td className="py-2 pr-4">
                  {month.trades}
                </td>

                <td className="py-2 pr-4">
                  {month.wins}
                </td>

                <td className="py-2 pr-4">
                  {month.losses}
                </td>

                <td className="py-2 pr-4">
                  {month.breakevens}
                </td>

                <td className="py-2 pr-4">
                  {Number(
                    month.winRate
                  ).toFixed(2)}%
                </td>

                <td className="py-2">
                  {Number(
                    month.netPnL
                  ).toFixed(2)}
                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>

  </div>

)}

      </div>

    )}

  </div>
)}

{/* ======================================
    EQUITY CURVE
====================================== */}

{historicalScanResult?.performanceAnalytics &&
Array.isArray(
  historicalScanResult.performanceAnalytics.equityCurve
) &&
historicalScanResult.performanceAnalytics.equityCurve.length > 0 && (

  <details className="mt-6 rounded-lg border border-gray-700 bg-gray-900">

    <summary className="px-4 py-3 cursor-pointer font-semibold">
      📈 Equity Curve
    </summary>

    <div className="p-4">

    <div className="text-sm text-gray-400 mb-3">
      Cumulative realized P/L across completed historical trades.
    </div>

    <div className="overflow-x-auto">

      <table className="w-full text-sm">

        <thead>

          <tr className="text-left text-gray-400 border-b border-gray-700">

            <th className="py-2 pr-4">
              Trade
            </th>

            <th className="py-2 pr-4">
              Date
            </th>

            <th className="py-2 pr-4">
              Cumulative P/L
            </th>

            <th className="py-2">
              Drawdown
            </th>

          </tr>

        </thead>

        <tbody>

          {historicalScanResult.performanceAnalytics.equityCurve.map(
            (
              point: any
            ) => (

              <tr
                key={point.tradeNumber}
                className="border-b border-gray-800"
              >

                <td className="py-2 pr-4">
                  {point.tradeNumber}
                </td>

                <td className="py-2 pr-4">
                  {point.date}
                </td>

                <td className="py-2 pr-4">
                  {Number(
                    point.cumulativePnL
                  ).toFixed(2)}
                </td>

                <td className="py-2">
                  {Number(
                    point.drawdown
                  ).toFixed(2)}
                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>

    </div>

  </details>

)}
{/* ======================================
    REPLAY TECHNICAL DIAGNOSTICS
====================================== */}

<details className="mt-3 rounded-md border border-gray-700 bg-gray-900">

  <summary className="px-4 py-2 cursor-pointer text-sm text-gray-300">
    Replay Technical Diagnostics
  </summary>

  <div className="p-4 space-y-2 text-sm">

<button
  type="button"
  onClick={runReplayDiagnostics}
  disabled={
    !replayLoaded ||
    replayExecutableHistoryRef.current.length === 0
  }
  className={`px-4 py-2 rounded-md border ${
    replayLoaded &&
    replayExecutableHistoryRef.current.length > 0
      ? "bg-cyan-700 border-cyan-500 text-white"
      : "bg-gray-800 border-gray-700 text-gray-500 opacity-50 cursor-not-allowed"
  }`}
>
  Run Diagnostics
</button>

    <div>
      Candle:{" "}
      <strong>
        {replayState.currentIndex + 1}
        {" / "}
        {replayState.candles.length}
      </strong>
    </div>

    <div>
      Progress:{" "}
      <strong>
        {replayProgress.toFixed(2)}%
      </strong>
    </div>

    <div>
      Replay Price:{" "}
      <strong>
        {replayCurrentCandle
          ? replayCurrentCandle.close.toFixed(2)
          : "--"}
      </strong>
    </div>

    <div>
      Candles Loaded:{" "}
      <strong>
        {replayCandlesSoFar.length}
      </strong>
    </div>
<div className="mt-3 pt-3 border-t border-gray-800">

  <div>
    Replay 5m Trend:{" "}
    <strong>
      {replayAnalysis5m?.trend ?? "--"}
    </strong>
  </div>

  <div>
    Replay 5m RSI:{" "}
    <strong>
      {replayAnalysis5m?.rsi ?? "--"}
    </strong>
  </div>

  <div>
    Replay 5m Structure:{" "}
    <strong>
      {replayAnalysis5m?.marketStructure ?? "--"}
    </strong>
  </div>

  <div>
    Replay 5m Breakout:{" "}
    <strong>
      {replayAnalysis5m?.breakout ?? "--"}
    </strong>
  </div>

  <div className="mt-2">
    Replay 1m Trend:{" "}
    <strong>
      {replayAnalysis1m?.trend ?? "--"}
    </strong>
  </div>

  <div>
    Replay 1m RSI:{" "}
    <strong>
      {replayAnalysis1m?.rsi ?? "--"}
    </strong>
  </div>

  <div>
    Replay 1m Structure:{" "}
    <strong>
      {replayAnalysis1m?.marketStructure ?? "--"}
    </strong>
  </div>

  <div>
    Replay 1m Breakout:{" "}
    <strong>
      {replayAnalysis1m?.breakout ?? "--"}
    </strong>
  </div>

  <div className="mt-2">
    Replay MTF Direction:{" "}
    <strong>
      {replayMultiTimeframe?.direction ?? "--"}
    </strong>
  </div>

  <div>
    Replay MTF Entry State:{" "}
    <strong>
      {replayMultiTimeframe?.entryState ?? "--"}
    </strong>
  </div>

  <div>
    Replay MTF Reason:{" "}
    <strong>
      {replayMultiTimeframe?.reasons?.[0] ?? "--"}
    </strong>
  </div>

<div className="mt-3 pt-3 border-t border-gray-800">

  <div>
    Replay V1 Action:{" "}
    <strong>
      {replayAIAnalysis?.action ?? "--"}
    </strong>
  </div>

  <div>
    Replay V1 Confidence:{" "}
    <strong>
      {replayAIAnalysis?.confidence ?? "--"}%
    </strong>
  </div>

  <div>
    Replay Confirmations:{" "}
    <strong>
      {replayPassedConfirmations} / 6
    </strong>
  </div>

  <div>
    Replay V1 Market:{" "}
    <strong>
      {replayAIAnalysis?.marketCondition ?? "--"}
    </strong>
  </div>

  <div>
    Replay V1 Risk:{" "}
    <strong>
      {replayAIAnalysis?.riskLevel ?? "--"}
    </strong>
  </div>

  <div>
    Replay Trade Quality:{" "}
    <strong>
      {replayAIAnalysis?.tradeQuality ?? "--"}
    </strong>
  </div>

  <div className="mt-2">
    Qualified Replay Signal:{" "}
    <strong>
      {qualifiedReplaySignal?.action ?? "--"}
    </strong>
  </div>

  <div>
    Qualified:{" "}
    <strong>
      {qualifiedReplaySignal?.qualified
        ? "YES"
        : "NO"}
    </strong>
  </div>

  <div>
    Qualification Reason:{" "}
    <strong>
      {qualifiedReplaySignal?.reason ?? "--"}
    </strong>
</div>

</div>

  </div>

  </div>

</details>

</div>

)}

{/* ======================================
    HYPOTHETICAL SELL STABILITY COMPARISON
====================================== */}

{historicalScanResult?.hypotheticalSellImmediateSummary && (

  <div className="mt-6 p-4 rounded-lg border border-gray-700 bg-gray-900">

    <h4 className="text-base font-semibold mb-3">
      🧪 SELL Stability Comparison
    </h4>

    <div className="text-sm text-gray-400 mb-4">
      Compares the current strategy against a hypothetical version where SELL requires only 1 qualified observation while BUY remains unchanged.
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <div className="p-3 rounded-md border border-gray-700 bg-gray-950">

        <div className="font-semibold mb-3">
          Current Strategy
        </div>

        <div className="space-y-2 text-sm">

          <div>
            Trades:{" "}
            <strong>
              {historicalScanResult.executionAwareSummary?.totalCandidates ?? 0}
            </strong>
          </div>

          <div>
            BUY:{" "}
            <strong>
              {historicalScanResult.executionAwareSummary?.buyCandidates ?? 0}
            </strong>
          </div>

          <div>
            SELL:{" "}
            <strong>
              {historicalScanResult.executionAwareSummary?.sellCandidates ?? 0}
            </strong>
          </div>

          <div>
            Wins:{" "}
            <strong>
              {historicalScanResult.executionAwareSummary?.wins ?? 0}
            </strong>
          </div>

          <div>
            Losses:{" "}
            <strong>
              {historicalScanResult.executionAwareSummary?.losses ?? 0}
            </strong>
          </div>

          <div>
            Breakevens:{" "}
            <strong>
              {historicalScanResult.executionAwareSummary?.breakevens ?? 0}
            </strong>
          </div>

          <div>
            Win Rate:{" "}
            <strong>
              {Number(
                historicalScanResult.executionAwareSummary?.winRate ?? 0
              ).toFixed(2)}%
            </strong>
          </div>

          <div>
            Net P/L:{" "}
            <strong>
              {Number(
                historicalScanResult.executionAwareSummary?.totalRealizedPnL ?? 0
              ).toFixed(2)}
            </strong>
          </div>

        </div>

      </div>


      <div className="p-3 rounded-md border border-gray-700 bg-gray-950">

        <div className="font-semibold mb-3">
          Hypothetical SELL Stability = 1
        </div>

        <div className="space-y-2 text-sm">

          <div>
            Trades:{" "}
            <strong>
              {historicalScanResult.hypotheticalSellImmediateSummary.totalCandidates ?? 0}
            </strong>
          </div>

          <div>
            BUY:{" "}
            <strong>
              {historicalScanResult.hypotheticalSellImmediateSummary.buyCandidates ?? 0}
            </strong>
          </div>

          <div>
            SELL:{" "}
            <strong>
              {historicalScanResult.hypotheticalSellImmediateSummary.sellCandidates ?? 0}
            </strong>
          </div>

          <div>
            Wins:{" "}
            <strong>
              {historicalScanResult.hypotheticalSellImmediateSummary.wins ?? 0}
            </strong>
          </div>

          <div>
            Losses:{" "}
            <strong>
              {historicalScanResult.hypotheticalSellImmediateSummary.losses ?? 0}
            </strong>
          </div>

          <div>
            Breakevens:{" "}
            <strong>
              {historicalScanResult.hypotheticalSellImmediateSummary.breakevens ?? 0}
            </strong>
          </div>

          <div>
            Win Rate:{" "}
            <strong>
              {Number(
                historicalScanResult.hypotheticalSellImmediateSummary.winRate ?? 0
              ).toFixed(2)}%
            </strong>
          </div>

          <div>
            Net P/L:{" "}
            <strong>
              {Number(
                historicalScanResult.hypotheticalSellImmediateSummary.totalRealizedPnL ?? 0
              ).toFixed(2)}
            </strong>
          </div>

        </div>

      </div>

    </div>

  </div>

)}

{/* ======================================
    HYPOTHETICAL SELL PERFORMANCE ANALYTICS
====================================== */}

{historicalScanResult?.hypotheticalSellImmediateAnalytics && (

  <div className="mt-6 p-4 rounded-lg border border-gray-700 bg-gray-900">

    <h4 className="text-base font-semibold mb-3">
      📊 Hypothetical SELL Stability Analytics
    </h4>

    <div className="text-sm text-gray-400 mb-4">
      Risk and performance metrics when SELL requires 1 qualified observation while BUY remains unchanged.
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      <div>
        <div className="text-gray-400">
          Net P/L
        </div>
        <div className="font-semibold">
          {Number(
            historicalScanResult.hypotheticalSellImmediateAnalytics.netPnL ?? 0
          ).toFixed(2)}
        </div>
      </div>

      <div>
        <div className="text-gray-400">
          Profit Factor
        </div>
        <div className="font-semibold">
          {Number(
            historicalScanResult.hypotheticalSellImmediateAnalytics.profitFactor ?? 0
          ).toFixed(2)}
        </div>
      </div>

      <div>
        <div className="text-gray-400">
          Average Trade
        </div>
        <div className="font-semibold">
          {Number(
            historicalScanResult.hypotheticalSellImmediateAnalytics.averageTrade ?? 0
          ).toFixed(2)}
        </div>
      </div>

      <div>
        <div className="text-gray-400">
          Average Win
        </div>
        <div className="font-semibold">
          {Number(
            historicalScanResult.hypotheticalSellImmediateAnalytics.averageWin ?? 0
          ).toFixed(2)}
        </div>
      </div>

      <div>
        <div className="text-gray-400">
          Average Loss
        </div>
        <div className="font-semibold">
          {Number(
            historicalScanResult.hypotheticalSellImmediateAnalytics.averageLoss ?? 0
          ).toFixed(2)}
        </div>
      </div>

      <div>
        <div className="text-gray-400">
          Max Drawdown
        </div>
        <div className="font-semibold">
          {Number(
            historicalScanResult.hypotheticalSellImmediateAnalytics.maxDrawdown ?? 0
          ).toFixed(2)}
        </div>
      </div>

      <div>
        <div className="text-gray-400">
          Longest Win Streak
        </div>
        <div className="font-semibold">
          {historicalScanResult.hypotheticalSellImmediateAnalytics.longestWinningStreak ?? 0}
        </div>
      </div>

      <div>
        <div className="text-gray-400">
          Longest Loss Streak
        </div>
        <div className="font-semibold">
          {historicalScanResult.hypotheticalSellImmediateAnalytics.longestLosingStreak ?? 0}
        </div>
      </div>

      <div>
        <div className="text-gray-400">
          T1 Hits
        </div>
        <div className="font-semibold">
          {historicalScanResult.hypotheticalSellImmediateAnalytics.target1Hits ?? 0}
        </div>
      </div>

      <div>
        <div className="text-gray-400">
          T2 Hits
        </div>
        <div className="font-semibold">
          {historicalScanResult.hypotheticalSellImmediateAnalytics.target2Hits ?? 0}
        </div>
      </div>

      <div>
        <div className="text-gray-400">
          Runner Activations
        </div>
        <div className="font-semibold">
          {historicalScanResult.hypotheticalSellImmediateAnalytics.runnerActivations ?? 0}
        </div>
    </div>

</div>

    {/* ======================================
        HYPOTHETICAL MONTHLY PERFORMANCE
    ====================================== */}

    {Array.isArray(
      historicalScanResult.hypotheticalSellImmediateAnalytics.monthlyPerformance
    ) &&
    historicalScanResult.hypotheticalSellImmediateAnalytics.monthlyPerformance.length > 0 && (

      <div className="mt-6 pt-4 border-t border-gray-700">

        <h5 className="font-semibold mb-3">
          📅 Hypothetical Monthly Performance
        </h5>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>

              <tr className="text-left text-gray-400 border-b border-gray-700">

                <th className="py-2 pr-4">
                  Month
                </th>

                <th className="py-2 pr-4">
                  Trades
                </th>

                <th className="py-2 pr-4">
                  Wins
                </th>

                <th className="py-2 pr-4">
                  Losses
                </th>

                <th className="py-2 pr-4">
                  BE
                </th>

                <th className="py-2 pr-4">
                  Win Rate
                </th>

                <th className="py-2">
                  Net P/L
                </th>

              </tr>

            </thead>

            <tbody>

              {historicalScanResult.hypotheticalSellImmediateAnalytics.monthlyPerformance.map(
                (
                  month: any
                ) => (

                  <tr
                    key={month.month}
                    className="border-b border-gray-800"
                  >

                    <td className="py-2 pr-4">
                      {month.month}
                    </td>

                    <td className="py-2 pr-4">
                      {month.trades}
                    </td>

                    <td className="py-2 pr-4">
                      {month.wins}
                    </td>

                    <td className="py-2 pr-4">
                      {month.losses}
                    </td>

                    <td className="py-2 pr-4">
                      {month.breakevens}
                    </td>

                    <td className="py-2 pr-4">
                      {Number(
                        month.winRate
                      ).toFixed(2)}%
                    </td>

                    <td className="py-2">
                      {Number(
                        month.netPnL
                      ).toFixed(2)}
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    )}


  </div>

)}

{/* ======================================
    SELL PIPELINE EVALUATION
====================================== */}

{historicalScanResult?.sellPipelineEvaluation && (

  <div className="mt-6 p-4 rounded-lg border border-gray-700 bg-gray-900">

    <h4 className="text-base font-semibold mb-3">
      🔍 SELL Pipeline Evaluation
    </h4>

    <div className="text-sm text-gray-400 mb-4">
      Tracks where SELL candidates are being eliminated before execution.
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      <div>
        <div className="text-gray-400">
          Raw SELL Candidates
        </div>

        <div className="font-semibold">
          {historicalScanResult.sellPipelineEvaluation.rawSellCandidates ?? 0}
        </div>
      </div>


      <div>
        <div className="text-gray-400">
          Consecutive SELL Pairs
        </div>

        <div className="font-semibold">
          {historicalScanResult.sellPipelineEvaluation.consecutiveSellPairs ?? 0}
        </div>
      </div>


      <div>
        <div className="text-gray-400">
          Max SELL Streak
        </div>

        <div className="font-semibold">
          {historicalScanResult.sellPipelineEvaluation.maxSellQualifiedStreak ?? 0}
        </div>
      </div>


      <div>
        <div className="text-gray-400">
          Executable SELL Trades
        </div>

        <div className="font-semibold">
          {historicalScanResult.sellPipelineEvaluation.executableSellTrades ?? 0}
        </div>
      </div>

    </div>

  </div>

)}

{/* ======================================
    RAW SELL PERFORMANCE
====================================== */}

{historicalScanResult?.sellPipelineEvaluation?.rawSellPerformance && (

  <div className="mt-4 p-4 rounded-lg border border-gray-700 bg-gray-900">

    <h4 className="text-base font-semibold mb-3">
      📉 Raw SELL Performance
    </h4>

    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">

      <div>
        <div className="text-gray-400">
          Wins
        </div>
        <div className="font-semibold">
          {historicalScanResult.sellPipelineEvaluation.rawSellPerformance.wins ?? 0}
        </div>
      </div>

      <div>
        <div className="text-gray-400">
          Losses
        </div>
        <div className="font-semibold">
          {historicalScanResult.sellPipelineEvaluation.rawSellPerformance.losses ?? 0}
        </div>
      </div>

      <div>
        <div className="text-gray-400">
          Breakevens
        </div>
        <div className="font-semibold">
          {historicalScanResult.sellPipelineEvaluation.rawSellPerformance.breakevens ?? 0}
        </div>
      </div>

      <div>
        <div className="text-gray-400">
          Win Rate
        </div>
        <div className="font-semibold">
          {Number(
            historicalScanResult.sellPipelineEvaluation.rawSellPerformance.winRate ?? 0
          ).toFixed(2)}%
        </div>
      </div>

      <div>
        <div className="text-gray-400">
          Net P/L
        </div>
        <div className="font-semibold">
          {Number(
            historicalScanResult.sellPipelineEvaluation.rawSellPerformance.totalRealizedPnL ?? 0
          ).toFixed(2)}
        </div>
      </div>

<div>
  <div className="text-gray-400">
    Open / Unresolved
  </div>

  <div className="font-semibold">
    {historicalScanResult.sellPipelineEvaluation.rawSellOpenTrades ?? 0}
  </div>
</div>

    </div>

  </div>

)}

{/* ======================================
    CONFIRMATION PERFORMANCE
====================================== */}

{historicalScanResult?.performanceAnalytics &&
Array.isArray(
  historicalScanResult.performanceAnalytics.confirmationPerformance
) &&
historicalScanResult.performanceAnalytics.confirmationPerformance.length > 0 && (

  <div className="mt-6 p-4 rounded-lg border border-gray-700 bg-gray-900">

    <h4 className="text-base font-semibold mb-3">
      🎯 Confirmation Performance
    </h4>

    <div className="text-sm text-gray-400 mb-3">
      Performance grouped by the number of confirmations at trade entry.
    </div>

    <div className="overflow-x-auto">

      <table className="w-full text-sm">

        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-700">

            <th className="py-2 pr-4">
              Confirmations
            </th>

            <th className="py-2 pr-4">
              Trades
            </th>

            <th className="py-2 pr-4">
              Wins
            </th>

            <th className="py-2 pr-4">
              Losses
            </th>

            <th className="py-2 pr-4">
              BE
            </th>

            <th className="py-2 pr-4">
              Win Rate
            </th>

            <th className="py-2">
              Net P/L
            </th>

          </tr>
        </thead>

        <tbody>

          {historicalScanResult.performanceAnalytics.confirmationPerformance.map(
            (
              row: any
            ) => (

              <tr
                key={row.confirmations}
                className="border-b border-gray-800"
              >

                <td className="py-2 pr-4">
                  {row.confirmations}/6
                </td>

                <td className="py-2 pr-4">
                  {row.trades}
                </td>

                <td className="py-2 pr-4">
                  {row.wins}
                </td>

                <td className="py-2 pr-4">
                  {row.losses}
                </td>

                <td className="py-2 pr-4">
                  {row.breakevens}
                </td>

                <td className="py-2 pr-4">
                  {Number(
                    row.winRate
                  ).toFixed(2)}%
                </td>

                <td className="py-2">
                  {Number(
                    row.netPnL
                  ).toFixed(2)}
                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>

  </div>

)}

<div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-4">


  {/* ================= LEFT SIDE ================= */}

  <div className="xl:col-span-2 space-y-6">

    <CandlestickChart
      candles={candleHistory}
      ema20={ema20History}
      ema50={ema50History}
      signals={signalHistory}
      patterns={patternHistory}
      levels={levels}
    />

    <CandlestickChart
  candles={realChartCandles.slice(-50)}
  ema20={[]}
  ema50={[]}
  signals={[]}
  patterns={[]}
  levels={{
    support: [],
    resistance: [],
  }}
/>

    <IndicatorPanel
      rsi={currentRSI}
      ema20={ema20}
      ema50={ema50}
      macd={macd}
      vwap={vwap}
    />

  </div>

  {/* ================= RIGHT SIDE ================= */}

<div className="space-y-6">

  <MarketStatus />

  {currentSignal && (
    <TradePlan
      signal={currentSignal}
      onTakeTrade={handleTakeTrade}
    />
  )}

  {activeTrade && (
    <ActiveTradeMonitor
      trade={activeTrade}
    />
  )}

  {activeTrade && (
    <TradeManagerAI
      decision={tradeDecision}
    />
  )}

</div>

</div>   {/* closes xl:grid-cols-3 layout */}

{/* ================= LOWER DASHBOARD ================= */}

<div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">

  {/* ================= LEFT COLUMN ================= */}

  <div className="xl:col-span-2 space-y-4">

    {/* LIVE PRICE */}
    <PriceChart
      prices={priceHistory}
    />

    {/* TRADING PERFORMANCE */}
    <TradeStatistics
      trades={tradeHistory}
    />

      <TradeHistory
    trades={tradeHistory}
  />

  </div>


  {/* ================= RIGHT COLUMN ================= */}

  <div className="space-y-4">

    {currentSignal && (
      <CurrentSignalCard
        signal={currentSignal}
      />
    )}

    <TradeReadiness
      signal={
        currentSignal
          ? currentSignal
          : aiSignal
      }
    />

<AIDecisionPanel
  signal={aiSignal}
  pattern={pattern}
/>

  </div>

</div>


{/* ================= AI TRADE SIGNAL ================= */}

<div className="mt-4">


{/* ================= AI TRADE SIGNAL ================= */}

<div className="mt-4 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">

  <div className="flex items-center justify-between mb-3">

    <h3 className="text-base font-semibold">
      AI Trade Signal
    </h3>

<span
  className={`text-sm font-bold ${
    (currentSignal?.action ?? aiSignal.action) === "BUY"
      ? "text-green-400"
      : (currentSignal?.action ?? aiSignal.action) === "SELL"
      ? "text-red-400"
      : (currentSignal?.action ?? aiSignal.action) === "WATCH"
      ? "text-blue-400"
      : "text-yellow-400"
  }`}
>
  {activeTrade
    ? `MANAGING ${activeTrade.action}`
    : currentSignal
    ? currentSignal.action
    : aiSignal.action}
</span>

  </div>


  {/* SIGNAL LOCK */}

  {signalLocked && (
    <div className="mb-3 flex items-center justify-between rounded-md border border-cyan-800 bg-cyan-950/30 px-3 py-2">

      <span className="text-xs font-semibold text-cyan-300">
        🔒 Signal Locked
      </span>

      <span className="text-sm font-bold text-white">
        {Math.floor(signalTimeLeft / 60000)}:
        {String(
          Math.floor(
            (signalTimeLeft % 60000) / 1000
          )
        ).padStart(2, "0")}
      </span>

    </div>
  )}


  {/* MAIN DATA */}

  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-3">

    <div>
      <p className="text-xs text-gray-500">
        Stock
      </p>

      <p className="text-sm font-semibold mt-0.5">
        NIFTY 50
      </p>
    </div>


    <div>
      <p className="text-xs text-gray-500">
        Entry
      </p>

      <p className="text-sm font-semibold mt-0.5">
        {currentSignal
  ? Number(currentSignal.entry).toFixed(2)
  : riskPlan.entry}
      </p>
    </div>


    <div>
      <p className="text-xs text-gray-500">
        Target
      </p>

      <p className="text-sm font-semibold text-green-400 mt-0.5">
        {currentSignal
  ? Number(currentSignal.target1).toFixed(2)
  : riskPlan.target}
      </p>
    </div>


    <div>
      <p className="text-xs text-gray-500">
        Stop Loss
      </p>

      <p className="text-sm font-semibold text-red-400 mt-0.5">
        {currentSignal
  ? Number(currentSignal.stopLoss).toFixed(2)
  : riskPlan.stopLoss}
      </p>
    </div>


    <div>
      <p className="text-xs text-gray-500">
        Risk / Reward
      </p>

<p className="text-sm font-semibold text-yellow-400 mt-0.5">
  1 : {currentSignal
    ? currentSignal.riskRewardRatio ?? 1.5
    : riskPlan.riskReward}
</p>
    </div>


    <div>
      <p className="text-xs text-gray-500">
        RSI
      </p>

      <p className="text-sm font-semibold text-purple-400 mt-0.5">
        {currentRSI !== null
          ? currentRSI.toFixed(1)
          : "—"}
      </p>
    </div>


    <div>
      <p className="text-xs text-gray-500">
        Market
      </p>

      <p className="text-sm font-semibold text-blue-400 mt-0.5">
        {currentSignal
  ? currentSignal.marketCondition
  : aiSignal.marketCondition}
      </p>
    </div>


    <div>
      <p className="text-xs text-gray-500">
        Risk
      </p>

      <p className="text-sm font-semibold text-yellow-400 mt-0.5">
        {currentSignal
  ? currentSignal.riskLevel
  : aiSignal.riskLevel}
      </p>
    </div>

  </div>


  {/* AI ADVICE */}

  <div className="mt-3 pt-3 border-t border-gray-800">

    <div className="flex gap-2">

      <span className="text-blue-400 text-sm">
        💡
      </span>

      <div>
        <p className="text-xs font-semibold text-blue-400">
          AI Advice
        </p>

        <p className="text-xs text-gray-300 mt-1 leading-5">
          {aiSignal.advice}
        </p>
      </div>

    </div>

  </div>


  {/* REASONING */}

  {aiSignal.reasons &&
    aiSignal.reasons.length > 0 && (

      <details className="mt-3 pt-3 border-t border-gray-800">

        <summary className="text-xs text-gray-400 cursor-pointer hover:text-white">
          View AI reasoning ({aiSignal.reasons.length})
        </summary>

        <ul className="mt-2 space-y-1">

          {aiSignal.reasons.map(
            (reason, index) => (

              <li
                key={index}
                className="flex items-start gap-2 text-xs text-gray-400"
              >

                <span className="text-green-400">
                  ✓
                </span>

                <span>
                  {reason}
                </span>

              </li>

            )
          )}

        </ul>

      </details>

    )}

</div>

</div>
        </main>

      </div>

    </div>
  
  );
}