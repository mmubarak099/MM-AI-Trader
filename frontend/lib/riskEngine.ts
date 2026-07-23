interface RiskInput {

  price: number;

  action: string;

}



export function calculateRisk(
  data: RiskInput
) {


  const entry = data.price;


  let target = entry;

  let stopLoss = entry;



  const riskPoints = 40;



  if (data.action === "BUY") {


    target = entry + 80;

    stopLoss = entry - riskPoints;


  }



  else if (data.action === "SELL") {


    target = entry - 80;

    stopLoss = entry + riskPoints;


  }





  else {


    target = entry;

    stopLoss = entry;


  }





  const risk = Math.abs(
    entry - stopLoss
  );


  const reward = Math.abs(
    target - entry
  );



  const riskReward =
    reward / risk;



  return {


    entry: Number(
      entry.toFixed(2)
    ),


    target: Number(
      target.toFixed(2)
    ),


    stopLoss: Number(
      stopLoss.toFixed(2)
    ),


    riskReward: Number(
      riskReward.toFixed(2)
    )


  };


}