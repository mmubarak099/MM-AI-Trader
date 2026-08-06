"use client";

import PriceChart from "../components/PriceChart";
import { useEffect, useState } from "react";

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

import { generateMarketPrice } from "../lib/marketSimulator";
import { analyzeMarket } from "../lib/aiEngine";
import { calculateRisk } from "../lib/riskEngine";
import { detectBullishEngulfing } from "../lib/candlestick";
import { analyzePattern } from "../lib/patternAnalyzer";
import CandlestickChart from "../components/CandlestickChart";
import { detectMarketStructure } from "../lib/marketStructure";
import { detectBreakout } from "../lib/breakoutDetector";
import { analyzeVolume } from "../lib/volumeAnalyzer";
import { validateSignal } from "../lib/signalValidator";
import { manageTrade } from "../lib/tradeManagerAI";
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
const [tradePlan, setTradePlan] =
  useState<any>(null);
const [activeTrade, setActiveTrade] =
  useState<any>(null);
const [tradeHistory, setTradeHistory] =
  useState<any[]>([]);
const [tradeDecision, setTradeDecision] = useState<any>(null);
  const [signalExpiry, setSignalExpiry] =
  useState<Date | null>(null);

  const [lastSignal, setLastSignal] =
  useState<string>("NONE");

  // NEW ------------------------------

const [signalLocked, setSignalLocked] =
  useState(false);

const [signalCreatedAt, setSignalCreatedAt] =
  useState<Date | null>(null);

const [signalTimeLeft, setSignalTimeLeft] =
  useState(0);

const SIGNAL_DURATION = 120000; // 2 minutes

// ------------------------------

const [patternHistory, setPatternHistory] =
  useState<
    {
      type: string;
      candleIndex: number;
    }[]
  >([]);


  const [currentRSI, setCurrentRSI] = useState<number | null>(null);
  const [ema20, setEma20] = useState<number | null>(null);
  const [ema50, setEma50] = useState<number | null>(null);
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

const handleTakeTrade = () => {

  if (!tradePlan) return;

  const active = activateTrade(tradePlan);

  setActiveTrade(active);

  setTradePlan(null);

  setCurrentSignal(null);

  // Reset signal lifecycle
  setSignalLocked(false);
  setSignalCreatedAt(null);
  setSignalTimeLeft(0);
  setSignalExpiry(null);
  setLastSignal("NONE");
   console.log("✅ TradePlan cleared");

};

function processTradeEngine(
  analysis: any,
  price: number
) {

if (
  signalLocked ||
  tradePlan ||
  activeTrade
) {
  return;
}

if (
  analysis.action !== "BUY" &&
  analysis.action !== "SELL"
) {
  return;
}

if (analysis.confidence < 70) {
  console.log(
    "Trade rejected: Confidence too low",
    analysis.confidence
  );
  return;
}

if (
  analysis.action === lastSignal &&
  signalExpiry &&
  signalExpiry > new Date()
) {
  console.log(
    "Duplicate signal skipped (still within expiry)"
  );
  return;
}

const plan = createTradePlan(
  analysis.action,
  price,
  analysis.confidence
);

if (!plan) return;

console.log("AI Confidence:", analysis.confidence);

console.log("🚨 Creating NEW Trade Plan");

  setTradePlan(plan);

  setCurrentSignal({
  id: plan.id,
  action: plan.action,
  confidence: plan.confidence,
  entry: plan.entry,
  stopLoss: plan.stopLoss,
  target1: plan.target1,
  target2: plan.target2,
  urgency: plan.urgency,
  status: "ACTIVE",
  createdAt: new Date(),
  expiresAt: new Date(Date.now() + SIGNAL_DURATION),
});

setSignalLocked(true);

setSignalCreatedAt(new Date());

  setLastSignal(analysis.action);
  setSignalExpiry(
  new Date(Date.now() + 30000)
);
  console.log(
    "New Trade Created:",
    plan
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

      setTradePlan(null);

      console.log("⏰ Signal Expired");

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
        





      const marketTrend =
        getTrend(
          newNifty.price,
          movingAverage
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


console.log("Pattern being sent to AI:", detectedPattern);


      const analysis = analyzeMarket({
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


processTradeEngine(
  analysis,
  newNifty.price
);

if (activeTrade) {

  const updatedTrade =
    updateTrade(
      activeTrade,
      newNifty.price
    );

    const tradeDecision = manageTrade({

  action: updatedTrade.action,

  currentPrice: newNifty.price,

  entry: updatedTrade.entry,

  stopLoss: updatedTrade.stopLoss,

  target1: updatedTrade.target1,

  target2: updatedTrade.target2,

  pnl: updatedTrade.pnl,

  target1Hit: updatedTrade.target1Hit,

  rsi: rsi ?? 50,

  ema20: ema20Value ?? 0,

  ema50: ema50Value ?? 0,

  macd: macdValue ?? 0,

  trend: marketTrend,

  breakout: breakout !== "NONE",

  volumeStrength: volumeScore,

  marketStructure: structure,

});

console.log("🤖 Trade Manager AI:", tradeDecision);

setTradeDecision(tradeDecision);

if (tradeDecision.recommendation === "MOVE_TO_BREAK_EVEN") {

  updatedTrade.stopLoss = updatedTrade.entry;

}

else if (
  tradeDecision.recommendation === "TRAIL_STOP"
) {

  if (updatedTrade.action === "BUY") {

    updatedTrade.stopLoss = Math.max(
      updatedTrade.stopLoss,
      updatedTrade.currentPrice - 15
    );

  } else {

    updatedTrade.stopLoss = Math.min(
      updatedTrade.stopLoss,
      updatedTrade.currentPrice + 15
    );

  }

}

else if (
  tradeDecision.recommendation === "BOOK_PARTIAL"
) {

  console.log("📦 AI recommends partial booking");

}

else if (
  tradeDecision.recommendation === "EXIT"
) {

  console.log("🚪 AI recommends immediate exit");

}

    console.log(
  "REALIZED PNL FROM updateTrade:",
  updatedTrade.realizedPnL
);

console.log(
  "FULL UPDATED TRADE:",
  updatedTrade
);

    console.log(
  "Updated Trade:",
  JSON.stringify(updatedTrade, null, 2)
);

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

<div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">


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

 {tradePlan && (
  <TradePlan
    plan={tradePlan}
    expiry={signalExpiry}
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

<AIMarketSummary
  summary={aiSignal.summary}
  confidence={aiSignal.confidence}
  action={aiSignal.action}
/>

</div>

</div>   {/* closes xl:grid-cols-3 layout */}

<div className="mt-8">
  <PriceChart prices={priceHistory} />
</div>  

<div className="mt-8">
  <TradeHistory trades={tradeHistory} />
</div>

<div className="mt-8">
  <TradeStatistics
    trades={tradeHistory}
  />
</div>

<div className="mt-8">

  <AIDecisionPanel
    signal={aiSignal}
    pattern={pattern}
  />

</div>

<div className="mt-8 bg-gray-900 p-6 rounded-xl border border-gray-800">



            <h3 className="text-xl font-bold">
              
              

              AI Trade Signal

            </h3>

            {signalLocked && (

  <div className="mt-3 rounded-lg border border-cyan-500 bg-cyan-950/40 p-3">

    <div className="flex justify-between items-center">

      <span className="font-semibold text-cyan-300">
        🔒 Signal Locked
      </span>

      <span className="font-bold text-white">

        {Math.floor(signalTimeLeft / 60000)}:

        {String(
          Math.floor((signalTimeLeft % 60000) / 1000)
        ).padStart(2, "0")}

      </span>

    </div>

    <p className="text-gray-400 text-sm mt-2">

      This signal will remain valid until the timer expires.

    </p>

  </div>

)}

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-6">






              <div>

                <p className="text-gray-400">

                  Stock

                </p>


                <p className="font-bold">

                  NIFTY 50

                </p>

              </div>






              <div>

                <p className="text-gray-400">

                  Entry

                </p>


                <p className="font-bold">

                  {riskPlan.entry}

                </p>

              </div>

              <div>

                <p className="text-gray-400">

                  Action

                </p>


                {activeTrade ? (

  <div className="space-y-2">

    <p className="font-bold text-cyan-400">
      MANAGING
    </p>

    <p className="text-sm text-gray-300">
      Current Trade: {activeTrade.action}
    </p>

    <p
      className={`inline-flex items-center px-4 py-2 rounded-full font-bold text-white ${
        aiSignal.action === "BUY"
          ? "bg-green-600"
          : aiSignal.action === "SELL"
          ? "bg-red-600"
          : "bg-yellow-500 text-black"
      }`}
    >
      Market Bias: {aiSignal.action}
    </p>

  </div>

) : (

  <p
    className={`inline-flex items-center px-4 py-2 rounded-full font-bold text-white ${
      aiSignal.action === "BUY"
        ? "bg-green-600"
        : aiSignal.action === "SELL"
        ? "bg-red-600"
        : aiSignal.action === "WATCH"
        ? "bg-blue-600"
        : "bg-yellow-500 text-black"
    }`}
  >
    {aiSignal.action}
  </p>

)}

              </div>







              <div>

                <p className="text-gray-400">

                  Target

                </p>


                <p className="font-bold">

                  {riskPlan.target}

                </p>

              </div>







              <div>

                <p className="text-gray-400">

                  Stop Loss

                </p>


                <p className="text-red-400 font-bold">

                  {riskPlan.stopLoss}

                </p>

              </div>







              <div>

                <p className="text-gray-400">

                  Risk Reward

                </p>


                <p className="text-yellow-400 font-bold">

                  1 : {riskPlan.riskReward}

                </p>

              </div>







              <div>

                <p className="text-gray-400">

                  RSI

                </p>


                <p className="text-purple-400 font-bold">

                  {currentRSI ?? "Calculating..."}

                </p>

                          </div>
                          <div>
  <p className="text-gray-400">
    EMA 20
  </p>

  <p className="text-cyan-400 font-bold">
    {ema20 ?? "Calculating..."}
  </p>
</div>
<div>

  <p className="text-gray-400">
    EMA 50
  </p>

  <p className="text-orange-400 font-bold">
    {ema50 ?? "Calculating..."}
  </p>

</div>


            <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

  <div>
    <p className="text-gray-400">
      Market Condition
    </p>

    <p className="text-blue-400 font-bold">
      {aiSignal.marketCondition}
    </p>
  </div>

  <div>
    <p className="text-gray-400">
      Risk Level
    </p>

    <p className="text-yellow-400 font-bold">
      {aiSignal.riskLevel}
    </p>
  </div>



</div>
<div className="mt-5 p-4 bg-gray-800 rounded-lg border border-blue-500">

  <p className="text-blue-400 font-semibold">
    💡 AI Advice
  </p>

  <p className="text-white mt-2">
    {aiSignal.advice}
  </p>

</div>

              <h4 className="text-lg font-bold">
                AI Reasoning
              </h4>


              <ul className="mt-3 text-gray-300 space-y-2">

                {aiSignal.reasons.map((reason, index) => (

  <li
  key={index}
  className="flex items-start gap-2"
>
  <span className="text-green-400">
    ✔
  </span>

  <span>
    {reason}
  </span>
</li>

                ))}

              </ul>

            </div>


          </div>
            



          </div>





        </main>


      </div>


    </div>


  );


}