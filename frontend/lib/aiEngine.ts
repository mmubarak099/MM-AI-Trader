interface MarketInput {

  price: number;

  previousPrice: number;

  trend: string;

  rsi: number | null;

}



export function analyzeMarket(
  data: MarketInput
) {


  const movement =
    Number(
      (data.price - data.previousPrice).toFixed(2)
    );



  let score = 50;



  // Price momentum

  if (movement > 0) {

    score += 15;

  }

  else if (movement < 0) {

    score -= 15;

  }





  // Moving average trend

  if (data.trend === "Bullish") {

    score += 10;

  }


  else if (data.trend === "Bearish") {

    score -= 10;

  }





  // RSI analysis

  if (data.rsi !== null) {


    // Overbought condition

    if (data.rsi > 70) {

      score -= 15;

    }



    // Oversold condition

    else if (data.rsi < 30) {

      score += 10;

    }


  }





  // Movement strength

  const strength =
    Math.abs(movement);



  if (strength > 20) {

    score += movement > 0 ? 10 : -10;

  }





  // Keep score between 0-100

  score = Math.max(
    0,
    Math.min(
      score,
      100
    )
  );





  let trend = "Neutral";

  let action = "WAIT";





  if (score >= 75) {

    trend = "Bullish";

    action = "BUY";

  }



  else if (score <= 25) {

    trend = "Bearish";

    action = "SELL";

  }



  else if (score >= 60 && score < 75) {

    trend = "Bullish";

    action = "WATCH";

  }



  else if (score > 25 && score < 40) {

    trend = "Bearish";

    action = "WATCH";

  }



  else {

    trend = "Neutral";

    action = "WAIT";

  }





  return {

    trend,

    confidence: Math.round(score),

    action,

  };


}