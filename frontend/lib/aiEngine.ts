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

  let reasons: string[] = [];



  // Price momentum

  if (movement > 0) {

  score += 15;
  reasons.push("Price momentum is positive");

}

else if (movement < 0) {

  score -= 15;
  reasons.push("Price momentum is negative");

}





  // Moving average trend

  if (data.trend === "Bullish") {

  score += 10;
  reasons.push("Trend is bullish");

}

else if (data.trend === "Bearish") {

  score -= 10;
  reasons.push("Trend is bearish");

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

let marketCondition = "Sideways";

let riskLevel = "Medium";

let advice = "Wait for confirmation";





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

  if (score >= 75) {

  marketCondition = "Strong Bullish";

  riskLevel = "Medium";

  advice = "Look for confirmation before entry";

}

else if (score <= 25) {

  marketCondition = "Strong Bearish";

  riskLevel = "High";

  advice = "Avoid long positions";

}

else {

  marketCondition = "Sideways Market";

  riskLevel = "Low";

  advice = "Wait for a clearer setup";

}





return {

  trend,

  confidence: Math.round(score),

  action,

  reasons,

  marketCondition,

  riskLevel,

  advice,

};


}