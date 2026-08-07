type Props = {
  signal: any;
};

export default function TradeReadiness({
  signal,
}: Props) {

  if (!signal) return null;

  let score = 0; 

  const checks = [

  {
    label: "Trend",
    passed:
      signal.trend === "Bullish" ||
      signal.trend === "Bearish",
  },

  {
    label: "Pattern",
    passed:
      signal.pattern !== "No Pattern",
  },

  {
    label: "Structure",
    passed:
      signal.marketStructure !== "NEUTRAL",
  },

  {
    label: "Breakout",
    passed:
      signal.breakout !== "NONE",
  },

  {
    label: "Volume",
    passed:
      signal.volumeStrength === "STRONG",
  },

  {
    label: "Confidence",
    passed:
      signal.confidence >= 90,
  },

];
  
  if (signal.confidence >= 90) {

  score++;

}
else if (signal.confidence < 70) {

  score--;

}

if (signal.trend === "Bullish" || signal.trend === "Bearish")
  score++;

if (
  signal.pattern &&
  signal.pattern !== "No Pattern"
)
  score++;

if (
  signal.marketStructure &&
  signal.marketStructure !== "NEUTRAL"
)
  score++;

if (
  signal.breakout &&
  signal.breakout !== "NONE"
)
  score++;

if (
  signal.volumeStrength === "STRONG"
)
  score++;

score++; // Risk/Reward (currently fixed at 1:1.5)

let recommendation = "WAIT";

if (score >= 5) {

  recommendation = "TAKE TRADE";

}
else if (score <= 2) {

  recommendation = "AVOID";

}

  return (

    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">

      <h2 className="text-2xl font-bold mb-6">
        🤖 AI Trade Readiness
      </h2>

      <div className="grid grid-cols-2 gap-6">

        <div>

          <p className="text-gray-400">
            Signal
          </p>

          <p className="text-2xl font-bold">
            {signal.action}
          </p>

        </div>

        <div>

          <p className="text-gray-400">
            Confidence
          </p>

          <p className="text-2xl font-bold">
            {signal.confidence}%
          </p>

        </div>

      </div>

<div className="mt-8 space-y-3">

  {checks.map((check) => (

    <div
      key={check.label}
      className="flex justify-between items-center"
    >

      <span>

        {check.passed ? "✅" : "❌"} {check.label}

      </span>

      <span
        className={
          check.passed
            ? "text-green-400 font-semibold"
            : "text-red-400 font-semibold"
        }
      >

  {check.label === "Trend"
  ? signal.trend
  : check.label === "Pattern"
  ? signal.pattern
  : check.label === "Structure"
  ? signal.marketStructure
  : check.label === "Breakout"
  ? signal.breakout
  : check.label === "Volume"
  ? signal.volumeStrength
  : `${signal.confidence}%`}

      </span>

    </div>

  ))}

</div>

<hr className="my-6 border-gray-700" />

<div>

  <p className="text-gray-400">
    Trade Score
  </p>

  <p className="text-3xl font-bold text-yellow-400 mt-2">
    {"★".repeat(score)}
    {"☆".repeat(6 - score)}
  </p>

  <p className="text-gray-300 mt-1">
    {score} / 6 Confirmations
  </p>

<hr className="my-6 border-gray-700" />

<div>

  <p className="text-gray-400">
    Recommendation
  </p>

  <p
    className={`text-2xl font-bold mt-2 ${
      score >= 5
        ? "text-green-400"
        : score >= 3
        ? "text-yellow-400"
        : "text-red-400"
    }`}
  >
    {score >= 5
      ? "🟢 TAKE TRADE"
      : score >= 3
      ? "🟡 WAIT"
      : "🔴 AVOID"}
  </p>

</div>

</div>

    </div>

  );

}