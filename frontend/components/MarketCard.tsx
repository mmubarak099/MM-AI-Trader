"use client";

interface MarketCardProps {

  name: string;
  price: number;
  change: number;
  trend: string;

}


export default function MarketCard({
  name,
  price,
  change,
  trend
}: MarketCardProps) {


  return (

    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">


      <h3 className="text-gray-400">
        {name}
      </h3>


      <p className="text-3xl font-bold mt-3">
        {price.toLocaleString()}
      </p>



      <p className={`mt-2 font-bold ${
        change >= 0
        ? "text-green-400"
        : "text-red-400"
      }`}>

        {change >= 0 ? "▲" : "▼"}

        {" "}
        {change.toFixed(2)}%

      </p>




      <div className="mt-3 text-sm text-gray-400">

        Trend:

        <span className="ml-2 text-white font-bold">
          {trend}
        </span>

      </div>



    </div>

  );

}