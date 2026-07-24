export function calculateMovingAverage(
  prices: number[],
  period: number
) {


  if (prices.length < period) {

    return null;

  }



  const recentPrices =
    prices.slice(
      prices.length - period
    );



  const sum =
    recentPrices.reduce(
      (total, price) => total + price,
      0
    );



  const average =
    sum / period;



  return Number(
    average.toFixed(2)
  );

}




export function getTrend(
  currentPrice: number,
  movingAverage: number | null
) {


  if (movingAverage === null) {

    return "Neutral";

  }



  if (currentPrice > movingAverage) {

    return "Bullish";

  }



  else if (currentPrice < movingAverage) {

    return "Bearish";

  }



  return "Neutral";

}
export function calculateRSI(
  prices: number[],
  period: number = 14
) {


  if (prices.length <= period) {

    return null;

  }



  let gains = 0;

  let losses = 0;



  for (
    let i = prices.length - period;
    i < prices.length;
    i++
  ) {


    const difference =
      prices[i] - prices[i - 1];



    if (difference > 0) {

      gains += difference;

    }

    else {

      losses += Math.abs(difference);

    }


  }





  if (losses === 0) {

    return 100;

  }



  const relativeStrength =
    gains / losses;



  const rsi =
    100 -
    (100 / (1 + relativeStrength));



  return Number(
    rsi.toFixed(2)
  );


}
export function calculateVWAP(
  prices: number[]
) {


  if (prices.length === 0) {

    return null;

  }



  let totalPrice = 0;



  let totalVolume = 0;



  for (let i = 0; i < prices.length; i++) {


    // Simulated volume
    // Later this will come from live market data

    const volume =
      1000 + (i * 100);



    totalPrice +=
      prices[i] * volume;



    totalVolume +=
      volume;


  }





  const vwap =
    totalPrice / totalVolume;



  return Number(
    vwap.toFixed(2)
  );


}
export function calculateEMA(
  prices: number[],
  period: number
): number | null {

  if (prices.length < period) {
    return null;
  }

  const multiplier = 2 / (period + 1);

  let ema =
    prices
      .slice(0, period)
      .reduce((sum, price) => sum + price, 0) / period;

  for (let i = period; i < prices.length; i++) {
    ema =
      (prices[i] - ema) * multiplier + ema;
  }

  return Number(ema.toFixed(2));
}

export function calculateMACD(
  prices: number[]
): number | null {

  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);

  if (ema12 === null || ema26 === null) {
    return null;
  }

  return Number((ema12 - ema26).toFixed(2));
}