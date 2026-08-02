import type { Trade } from "../types/trade";

export function activateTrade(
  trade: Trade
): Trade {

  return {

    ...trade,

    status: "ACTIVE",

    openedAt: new Date(),

  };

}

export function updateTrade(
  trade: Trade,
  currentPrice: number
): Trade {

  const pnl =
    trade.action === "BUY"
      ? Number((currentPrice - trade.entry).toFixed(2))
      : Number((trade.entry - currentPrice).toFixed(2));

  let status = trade.status;
  let result = trade.result;
  let closedAt = trade.closedAt;

  let stopLoss = trade.stopLoss;

  let target1Hit = trade.target1Hit;
  let target2Hit = trade.target2Hit;

  let partialProfitBooked =
    trade.partialProfitBooked;

  let remainingPosition =
    trade.remainingPosition;

  let realizedPnL =
    trade.realizedPnL;

  //--------------------------------------------------
  // NEW
  //--------------------------------------------------

  let highestPrice = trade.highestPrice;
  let lowestPrice = trade.lowestPrice;
  let trailingStopEnabled =
    trade.trailingStopEnabled;

  if (trade.action === "BUY") {

    highestPrice = Math.max(
      highestPrice,
      currentPrice
    );

  } else {

    lowestPrice = Math.min(
      lowestPrice,
      currentPrice
    );

  }

  //--------------------------------------------------
  // Target checks
  //--------------------------------------------------

  const hitTarget1 =
    trade.action === "BUY"
      ? currentPrice >= trade.target1
      : currentPrice <= trade.target1;

  const hitTarget2 =
    trade.action === "BUY"
      ? currentPrice >= trade.target2
      : currentPrice <= trade.target2;

  //--------------------------------------------------
  // Target 1
  //--------------------------------------------------

  if (
    hitTarget1 &&
    !target1Hit
  ) {

    target1Hit = true;

    partialProfitBooked = true;

    remainingPosition = 50;

    trailingStopEnabled = true;

    const bookedProfit =
      trade.action === "BUY"
        ? trade.target1 - trade.entry
        : trade.entry - trade.target1;

    realizedPnL = Number(
      (bookedProfit * 0.5).toFixed(2)
    );

    stopLoss = trade.entry;

    status = "TARGET 1 HIT";

    console.log("🎯 TARGET 1 HIT");
  }

  //--------------------------------------------------
  // Trailing Stop
  //--------------------------------------------------

  if (trailingStopEnabled) {

    if (trade.action === "BUY") {

      const newSL =
        highestPrice - 20;

      if (newSL > stopLoss) {
        stopLoss = Number(
          newSL.toFixed(2)
        );
      }

    } else {

      const newSL =
        lowestPrice + 20;

      if (newSL < stopLoss) {
        stopLoss = Number(
          newSL.toFixed(2)
        );
      }

    }

  }

  //--------------------------------------------------
  // Recalculate Stop after trailing
  //--------------------------------------------------

  const hitStopLoss =
    trade.action === "BUY"
      ? currentPrice <= stopLoss
      : currentPrice >= stopLoss;

  //--------------------------------------------------
  // Target2
  //--------------------------------------------------

if (
  hitTarget2 &&
  !target2Hit
) {

  target2Hit = true;

  // Calculate final realized profit
  if (partialProfitBooked) {

    const remainingProfit =
      trade.action === "BUY"
        ? trade.target2 - trade.entry
        : trade.entry - trade.target2;

    realizedPnL = Number(
      (
        realizedPnL +
        remainingProfit * 0.5
      ).toFixed(2)
    );

  } else {

    realizedPnL = pnl;

  }

  status = "CLOSED";

  result = "WIN";

  closedAt = new Date();

  console.log("🏆 TARGET 2 HIT");

}

  //--------------------------------------------------
  // Stop Loss
  //--------------------------------------------------

if (hitStopLoss) {

  // Calculate final realized profit
  if (partialProfitBooked) {

    const remainingProfit =
      trade.action === "BUY"
        ? currentPrice - trade.entry
        : trade.entry - currentPrice;

    realizedPnL = Number(
      (
        realizedPnL +
        remainingProfit * 0.5
      ).toFixed(2)
    );

  } else {

    realizedPnL = pnl;

  }

  status = "CLOSED";

  result =
    realizedPnL >= 0
      ? "WIN"
      : "LOSS";

  closedAt = new Date();

  console.log("🛑 STOP LOSS HIT");

}

console.log("RETURNING realizedPnL =", realizedPnL);
console.log("RETURNING pnl =", pnl);

  return {

    ...trade,

    currentPrice,

    pnl,

    status,

    result,

    closedAt,

    stopLoss,

    target1Hit,

    target2Hit,

    partialProfitBooked,

    remainingPosition,

    realizedPnL,

    highestPrice,

    lowestPrice,

    trailingStopEnabled,

  };

}