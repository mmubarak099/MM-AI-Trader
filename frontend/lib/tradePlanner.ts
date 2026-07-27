export type TradePlan = {
  action: string;

  entry: number;

  stopLoss: number;

  target1: number;

  target2: number;

  riskReward: string;

  urgency: string;
};

export function createTradePlan(
  action: string,
  price: number,
  confidence: number
): TradePlan {

  if (action === "BUY") {

    const entry = price;

    const stopLoss = Number(
      (price - 40).toFixed(2)
    );

    const target1 = Number(
      (price + 60).toFixed(2)
    );

    const target2 = Number(
      (price + 120).toFixed(2)
    );

    return {

      action,

      entry,

      stopLoss,

      target1,

      target2,

      riskReward: "1 : 3",

      urgency:
        confidence >= 90
          ? "HIGH"
          : "MEDIUM",

    };

  }

  if (action === "SELL") {

    const entry = price;

    const stopLoss = Number(
      (price + 40).toFixed(2)
    );

    const target1 = Number(
      (price - 60).toFixed(2)
    );

    const target2 = Number(
      (price - 120).toFixed(2)
    );

    return {

      action,

      entry,

      stopLoss,

      target1,

      target2,

      riskReward: "1 : 3",

      urgency:
        confidence >= 90
          ? "HIGH"
          : "MEDIUM",

    };

  }

  return {

    action: "WAIT",

    entry: price,

    stopLoss: price,

    target1: price,

    target2: price,

    riskReward: "-",

    urgency: "LOW",

  };

}