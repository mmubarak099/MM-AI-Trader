"use client";

import { useEffect, useState } from "react";
import { getNseMarketStatus } from "../lib/marketSession";


export default function MarketStatus() {

 const [time, setTime] = useState<Date | null>(null);


  useEffect(() => {

  // Set the time immediately when the component loads
  setTime(new Date());

  // Then update it every second
  const timer = setInterval(() => {
    setTime(new Date());
  }, 1000);

  return () => clearInterval(timer);

}, []);


  // Convert to Indian Standard Time

const indiaTime = time
  ? new Date(
      time.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      })
    )
  : null;


 const marketStatus =
  time
    ? getNseMarketStatus(time)
    : null;

const status =
  marketStatus?.status ?? "";

const color =
  marketStatus?.color ?? "";

const session =
  marketStatus?.session ?? "";

  return (

    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">

      <h3 className="text-gray-400">
        🇮🇳 NSE MARKET STATUS
      </h3>


      <p className={`text-2xl font-bold mt-3 ${color}`}>
        {status}
      </p>


      <div className="mt-4 space-y-2 text-gray-300">


        <p>
          Current Time:
          <span className="ml-2 font-bold text-white">
            {indiaTime ? indiaTime.toLocaleTimeString() : ""}
          </span>
        </p>


        <p>
          Session:
          <span className="ml-2 font-bold text-white">
            {session}
          </span>
        </p>


        <p className="text-sm text-gray-500">
          NSE Trading Hours: 09:15 AM - 03:30 PM
        </p>


      </div>


    </div>

  );
}