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

import { generateMarketPrice } from "../lib/marketSimulator";
import { analyzeMarket } from "../lib/aiEngine";
import { calculateRisk } from "../lib/riskEngine";
import {
  calculateMovingAverage,
  getTrend,
  calculateRSI,
  calculateEMA,
  calculateMACD,
  calculateVWAP,
} from "../lib/indicators";



export default function Home() {


  const [nifty, setNifty] = useState({
    price: 24650,
    change: 0.52
  });



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



const [aiSignal, setAiSignal] = useState({

  trend: "Neutral",

  confidence: 50,

  action: "WAIT",

  reasons: [] as string[],

  marketCondition: "Sideways",

  riskLevel: "Medium",

  advice: "Wait for confirmation",

});



  const [currentRSI, setCurrentRSI] = useState<number | null>(null);
  const [ema20, setEma20] = useState<number | null>(null);
  const [ema50, setEma50] = useState<number | null>(null);
  const [macd, setMacd] = useState<number | null>(null);
const [vwap, setVwap] = useState<number | null>(null);



  const [riskPlan, setRiskPlan] = useState({

    entry: 24650,

    target: 24730,

    stopLoss: 24610,

    riskReward: 2

  });





  useEffect(() => {


    const timer = setInterval(() => {



      const newNifty =
        generateMarketPrice(
          nifty.price
        );
        const niftyChange =
  ((newNifty.price - 24650) / 24650) * 100;



      const updatedHistory = [

        ...priceHistory,

        newNifty.price

      ];





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





      const analysis = analyzeMarket({
  price: newNifty.price,
  previousPrice: nifty.price,
  trend: marketTrend,
  rsi,
  ema20: ema20Value,
  ema50: ema50Value,
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
      
      setMacd(macdValue);
      setVwap(vwapValue);



      setAiSignal(analysis);



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

<IndicatorPanel
  rsi={currentRSI}
  ema20={ema20}
  ema50={ema50}
  macd={macd}
  vwap={vwap}
/>





          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">





            <div className="lg:col-span-2">

              <MarketStatus />

            </div>







            <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">


              <h3 className="text-gray-400">

                NIFTY Trend

              </h3>



              <p className="text-blue-400 text-2xl font-bold mt-2">

                {aiSignal.trend}

              </p>


            </div>







            <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">


              <h3 className="text-gray-400">

                AI Confidence

              </h3>



              <div className="mt-4">
  <ConfidenceMeter confidence={aiSignal.confidence} />
</div>


            </div>








            <MarketCard

              name="NIFTY 50"

              price={nifty.price}

              change={nifty.change}

              trend={aiSignal.trend}

            />






            <MarketCard

              name="BANK NIFTY"

              price={bankNifty.price}

              change={bankNifty.change}

              trend="Strong"

            />



          </div>

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
  className={`font-bold text-lg ${
    aiSignal.action === "BUY"
      ? "text-green-400"
      : aiSignal.action === "SELL"
      ? "text-red-400"
      : aiSignal.action === "WATCH"
      ? "text-blue-400"
      : "text-yellow-400"
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

                  <li key={index}>
                    ✓ {reason}
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