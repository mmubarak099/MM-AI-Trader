export function detectMarketStructure(
  prices: number[]
): "UPTREND" | "DOWNTREND" | "SIDEWAYS" {

  if (prices.length < 20) {
    return "SIDEWAYS";
  }

  const recent = prices.slice(-20);

  // Split the recent price history into 4 sections.
  // This lets us determine whether price is progressively
  // moving higher or lower instead of looking only at
  // the first and last price.
  const sectionSize = 5;

  const sections = [
    recent.slice(0, sectionSize),
    recent.slice(sectionSize, sectionSize * 2),
    recent.slice(sectionSize * 2, sectionSize * 3),
    recent.slice(sectionSize * 3, sectionSize * 4),
  ];

  const sectionAverages = sections.map(section => {
    return (
      section.reduce((sum, price) => sum + price, 0) /
      section.length
    );
  });

  const [avg1, avg2, avg3, avg4] = sectionAverages;

  // Count directional movement.
  let upwardMoves = 0;
  let downwardMoves = 0;

  for (let i = 1; i < recent.length; i++) {

    if (recent[i] > recent[i - 1]) {
      upwardMoves++;
    }

    else if (recent[i] < recent[i - 1]) {
      downwardMoves++;
    }
  }

  // Overall percentage movement.
  const first = recent[0];
  const last = recent[recent.length - 1];

  const changePercent =
    ((last - first) / first) * 100;

  // Progressive structure.
  const bullishStructure =
    avg2 > avg1 &&
    avg3 > avg2 &&
    avg4 > avg3;

  const bearishStructure =
    avg2 < avg1 &&
    avg3 < avg2 &&
    avg4 < avg3;

  // Require a reasonable directional bias.
  const bullishMoves = upwardMoves >= 11;
  const bearishMoves = downwardMoves >= 11;

  if (bullishStructure && bullishMoves) {

    console.log("📈 MARKET STRUCTURE: UPTREND", {
      changePercent,
      upwardMoves,
      downwardMoves,
      sectionAverages,
    });

    return "UPTREND";
  }

  if (bearishStructure && bearishMoves) {

    console.log("📉 MARKET STRUCTURE: DOWNTREND", {
      changePercent,
      upwardMoves,
      downwardMoves,
      sectionAverages,
    });

    return "DOWNTREND";
  }

  console.log("📐 MARKET STRUCTURE: SIDEWAYS", {
    changePercent,
    upwardMoves,
    downwardMoves,
    sectionAverages,
  });

  return "SIDEWAYS";
}