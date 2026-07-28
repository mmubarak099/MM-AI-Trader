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
      ? Number(
          (currentPrice - trade.entry).toFixed(2)
        )
      : Number(
          (trade.entry - currentPrice).toFixed(2)
        );

let status = trade.status;

let result = trade.result;

let closedAt = trade.closedAt;

let stopLoss = trade.stopLoss;

let target1Hit = trade.target1Hit;

let target2Hit = trade.target2Hit;

const hitTarget1 =
  trade.action === "BUY"
    ? currentPrice >= trade.target1
    : currentPrice <= trade.target1;

  const hitTarget2 =
    trade.action === "BUY"
      ? currentPrice >= trade.target2
      : currentPrice <= trade.target2;

  const hitStopLoss =
    trade.action === "BUY"
      ? currentPrice <= trade.stopLoss
      : currentPrice >= trade.stopLoss;

if (
  hitTarget1 &&
  !target1Hit
) {

  target1Hit = true;

  stopLoss = trade.entry;

  status = "TARGET 1 HIT";

}

if (
  hitTarget2 &&
  !target2Hit
) {

  target2Hit = true;

  status = "CLOSED";

  result = "WIN";

  closedAt = new Date();

}

if (hitStopLoss) {

  status = "CLOSED";

  result =
    pnl >= 0
      ? "WIN"
      : "LOSS";

  closedAt = new Date();

}

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

};

}