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
  calculateMovingAverage,
  getTrend,
  calculateRSI,
  calculateEMA,
  calculateMACD,
  calculateVWAP,
} from "../lib/indicators";
import { calculateSupportResistance }
  from "../lib/supportResistance";
import type { TradeSignal } from "../types/tradeSignal";



export default function Home() {


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

  const realChartCandles = realNiftyCandles.map(
  (candle) => ({
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
    volume: 0,
  })
);

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

const realConfirmationChecks = [

  // 1. Trend
  realTrend === "Bullish" ||
  realTrend === "Bearish",

  // 2. Pattern
  realPattern === "Bullish Engulfing" ||
  realPattern === "Bearish Engulfing" ||
  realPattern === "Hammer",

  // 3. Structure
  realMarketStructure === "UPTREND" ||
  realMarketStructure === "DOWNTREND",

  // 4. Breakout
  realBreakout === "BREAKOUT" ||
  realBreakout === "BREAKDOWN",

  // 5. Volume
  false,

  // 6. Confidence
  (realAIAnalysis?.confidence ?? 0) >= 50,
];

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

  const previousCandle =
    realNiftyCandles[
      realNiftyCandles.length - 2
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
    price: realMarketData.nifty.price,
    previousPrice: previousCandle.close,
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
    action: qualified
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
]);

useEffect(() => {

  if (
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
      required: 2,
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

  if (
    realStableSignalCountRef.current < 2
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

const handleTakeTrade = () => {

  if (!currentSignal) return;


  // ======================================
  // PRE-ENTRY LIVE VALIDATION
  // ======================================

const liveDirectionOpposite =
  (currentSignal.action === "BUY" &&
    aiSignal.action === "SELL") ||
  (currentSignal.action === "SELL" &&
    aiSignal.action === "BUY");

const liveMarketUnsafe =
  aiSignal.riskLevel === "High" ||
  aiSignal.marketCondition === "Sideways Market" ||
  aiSignal.advice === "Wait for a clearer setup";

if (
  liveDirectionOpposite ||
  liveMarketUnsafe
) {

console.log("⛔ TAKE TRADE BLOCKED", {
  lockedAction: currentSignal.action,
  lockedConfidence: currentSignal.confidence,

  liveAction: aiSignal.action,
  liveConfidence: aiSignal.confidence,

  liveRisk: aiSignal.riskLevel,
  liveMarketCondition: aiSignal.marketCondition,
  liveAdvice: aiSignal.advice,

  blockedByOppositeDirection: liveDirectionOpposite,
  blockedByUnsafeMarket: liveMarketUnsafe,
});

    setTradeAlert({
  type: "WARNING",
  title: "Trade Blocked",
  message: `Locked ${currentSignal.action} signal is no longer confirmed by the live market.`,
});

    return;
  }


  console.log(
    "✅ PRE-ENTRY VALIDATION PASSED",
    {
      lockedAction: currentSignal.action,
      lockedConfidence: currentSignal.confidence,
      liveAction: aiSignal.action,
      liveConfidence: aiSignal.confidence,
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
  confirmations: number
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
if (
  analysis.marketRegime === "RANGING" ||
  analysis.marketCondition === "Sideways Market" ||
  analysis.riskLevel === "High" ||
  analysis.advice === "Wait for a clearer setup"
) {
  console.log(
    "Trade rejected: Market conditions are not suitable",
    {
      marketRegime: analysis.marketRegime,
      marketCondition: analysis.marketCondition,
      riskLevel: analysis.riskLevel,
      advice: analysis.advice,
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

  setSignalLocked(true);

  setSignalCreatedAt(new Date());

  setLastSignal(analysis.action);

  setSignalExpiry(
    new Date(Date.now() + SIGNAL_DURATION)
  );

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
  passedConfirmations >= 3;


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

  if (
    stableSignalCountRef.current >= 2
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

setTradeAlert({
  type: "INFO",
  title: "Signal Confirmed",
  message: `${analysis.action} signal confirmed at ${analysis.confidence}% confidence with ${passedConfirmations}/6 confirmations.`,
});

processTradeEngine(
  analysis,
  newNifty.price,
  passedConfirmations
);

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

if (activeTrade) {

  const updatedTrade = updateTrade(
    activeTrade,
    newNifty.price
  );

/*
console.log(
  "Updated Trade:",
  JSON.stringify(updatedTrade, null, 2)
);
*/

  // TARGET 1 ALERT
if (
  updatedTrade.target1Hit &&
  !activeTrade.target1Hit
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
  !activeTrade.target2Hit
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
  !activeTrade.events?.some(
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
  !activeTrade.events?.some(
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
      JSON.stringify(updatedTrade, null, 2)
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
    if (updatedTrade.result === "LOSS") {

      setTradeCooldown(true);

      setTimeout(() => {
        setTradeCooldown(false);
      }, 60000);

    }

    setActiveTrade(null);
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
  nifty={nifty.price}
  bankNifty={bankNifty.price}
  niftyChange={nifty.change}
  bankNiftyChange={bankNifty.change}
/>

{realMarketData && (
  <div className="mt-3 p-3 border rounded-lg">
    <div className="font-semibold mb-2">
      🌐 Real Market Data — Test Feed
    </div>

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
  candles={realChartCandles}
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