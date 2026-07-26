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

import { generateMarketPrice } from "../lib/marketSimulator";
import { analyzeMarket } from "../lib/aiEngine";
import { calculateRisk } from "../lib/riskEngine";
import { detectBullishEngulfing } from "../lib/candlestick";
import { analyzePattern } from "../lib/patternAnalyzer";
import CandlestickChart from "../components/CandlestickChart";
import { detectMarketStructure } from "../lib/marketStructure";
import { detectBreakout } from "../lib/breakoutDetector";
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

});





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




    },3000);





    return () => clearInterval(timer);



  }, [nifty, bankNifty, priceHistory]);







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

  {/* Action */}

  <div className="rounded-lg bg-gray-800 p-4">

    <p className="text-gray-400 text-sm">
      AI Action
    </p>

    <p
      className={`mt-2 text-2xl font-bold ${
        aiSignal.action === "BUY"
          ? "text-green-400"
          : aiSignal.action === "SELL"
          ? "text-red-400"
          : "text-yellow-400"
      }`}
    >
      {aiSignal.action}
    </p>

  </div>

  {/* Trend */}

  <div>

    <p className="text-gray-400">
      Trend
    </p>

    <p className="text-blue-400 font-bold text-xl">
      {aiSignal.trend}
    </p>

  </div>

  {/* Pattern */}

  <div>

    <p className="text-gray-400">
      Pattern
    </p>

    <p className="text-green-400 font-bold">
      {pattern}
    </p>

  </div>

  {/* Confidence */}

  <div>

    <p className="text-gray-400 mb-2">
      Confidence
    </p>

    <ConfidenceMeter
      confidence={aiSignal.confidence}
    />

  </div>

  {/* Market */}

  <div>

    <p className="text-gray-400">
      Market Condition
    </p>

    <p className="text-white font-semibold">
      {aiSignal.marketCondition}
    </p>

  </div>

  {/* Risk */}

  <div>

    <p className="text-gray-400">
      Risk Level
    </p>

    <p className="text-yellow-400 font-bold">
      {aiSignal.riskLevel}
    </p>

  </div>

  {/* Advice */}

  <div className="rounded-lg border border-blue-500 bg-gray-800 p-4">

    <p className="text-blue-400 font-semibold">
      💡 AI Advice
    </p>

    <p className="mt-2 text-white">
      {aiSignal.advice}
    </p>

  </div>

</div>

</div>   // closes xl:grid-cols-3 layout

<div className="mt-8">
  <PriceChart prices={priceHistory} />
</div>  

<div className="mt-8 bg-gray-900 p-6 rounded-xl border border-gray-800">



            <h3 className="text-xl font-bold">
              
              

              AI Trade Signal

            </h3>





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