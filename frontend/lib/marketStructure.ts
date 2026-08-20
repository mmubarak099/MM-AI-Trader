export function detectMarketStructure(
  prices: number[]
): "UPTREND" | "DOWNTREND" | "SIDEWAYS" {

  if (prices.length < 20) {
    return "SIDEWAYS";
  }

  const recent = prices.slice(-20);

  const sectionSize = 5;

  const sections = [
    recent.slice(0, sectionSize),
    recent.slice(sectionSize, sectionSize * 2),
    recent.slice(sectionSize * 2, sectionSize * 3),
    recent.slice(sectionSize * 3, sectionSize * 4),
  ];

  const sectionAverages =
    sections.map((section) => {
      return (
        section.reduce(
          (sum, price) => sum + price,
          0
        ) / section.length
      );
    });

  const [avg1, avg2, avg3, avg4] =
    sectionAverages;

  // ---------------------------------
  // Candle-to-candle directional bias
  // ---------------------------------

  let upwardMoves = 0;
  let downwardMoves = 0;

  for (
    let i = 1;
    i < recent.length;
    i++
  ) {

    if (recent[i] > recent[i - 1]) {
      upwardMoves++;
    }

    else if (
      recent[i] < recent[i - 1]
    ) {
      downwardMoves++;
    }
  }

  // ---------------------------------
  // Overall movement
  // ---------------------------------

  const first = recent[0];

  const last =
    recent[recent.length - 1];

  const changePercent =
    ((last - first) / first) * 100;

  // Require some meaningful net movement.
  // This prevents tiny fluctuations from
  // being classified as a trend.

  const minimumStructureMove = 0.05;

  // ---------------------------------
  // Section progression
  // ---------------------------------

  const bullishSectionMoves = [
    avg2 > avg1,
    avg3 > avg2,
    avg4 > avg3,
  ].filter(Boolean).length;

  const bearishSectionMoves = [
    avg2 < avg1,
    avg3 < avg2,
    avg4 < avg3,
  ].filter(Boolean).length;

  // Instead of requiring all 3 section
  // transitions to agree, require 2 of 3.
  // This allows normal intraday pullbacks.

  const bullishStructure =
    bullishSectionMoves >= 2;

  const bearishStructure =
    bearishSectionMoves >= 2;

  // 10 of the 19 candle transitions gives
  // a simple majority directional bias.

  const bullishMoves =
    upwardMoves >= 10;

  const bearishMoves =
    downwardMoves >= 10;

  // ---------------------------------
  // Final structure decision
  // ---------------------------------

  if (
    bullishStructure &&
    bullishMoves &&
    changePercent >= minimumStructureMove
  ) {

    console.log(
      "📈 MARKET STRUCTURE: UPTREND",
      {
        changePercent,
        upwardMoves,
        downwardMoves,
        bullishSectionMoves,
        bearishSectionMoves,
        sectionAverages,
      }
    );

    return "UPTREND";
  }

  if (
    bearishStructure &&
    bearishMoves &&
    changePercent <= -minimumStructureMove
  ) {

    console.log(
      "📉 MARKET STRUCTURE: DOWNTREND",
      {
        changePercent,
        upwardMoves,
        downwardMoves,
        bullishSectionMoves,
        bearishSectionMoves,
        sectionAverages,
      }
    );

    return "DOWNTREND";
  }

  console.log(
    "📐 MARKET STRUCTURE: SIDEWAYS",
    {
      changePercent,
      upwardMoves,
      downwardMoves,
      bullishSectionMoves,
      bearishSectionMoves,
      sectionAverages,
    }
  );

  return "SIDEWAYS";
}