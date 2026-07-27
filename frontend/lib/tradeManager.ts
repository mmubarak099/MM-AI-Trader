import type { Trade } from "../types/trade";

export function updateTrade(
  trade: Trade,
  currentPrice: number
): Trade {

  let pnl =
    trade.action === "BUY"
      ? currentPrice - trade.entry
      : trade.entry - currentPrice;

  pnl = Number(pnl.toFixed(2));

  let status = trade.status;
  let result = trade.result;
  let closedAt = trade.closedAt;

  if (trade.action === "BUY") {

    if (currentPrice <= trade.stopLoss) {
      status = "CLOSED";
      result = "LOSS";
      closedAt = new Date();
    }

    if (currentPrice >= trade.target2) {
      status = "CLOSED";
      result = "WIN";
      closedAt = new Date();
    }

  } else {

    if (currentPrice >= trade.stopLoss) {
      status = "CLOSED";
      result = "LOSS";
      closedAt = new Date();
    }

    if (currentPrice <= trade.target2) {
      status = "CLOSED";
      result = "WIN";
      closedAt = new Date();
    }

  }

  return {

    ...trade,

    currentPrice,

    pnl,

    status,

    result,

    closedAt,

  };

}