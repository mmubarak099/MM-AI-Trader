import type { Trade } from "../types/trade";
import type { TradeEvent } from "../types/tradeEvent";

function addEvent(
  events: TradeEvent[],
  type: TradeEvent["type"],
  price: number,
  description: string
): TradeEvent[] {
  return [
    ...events,
    {
      id: crypto.randomUUID(),
      type,
      timestamp: new Date(),
      price,
      description,
    },
  ];
}

export function activateTrade(
  trade: Trade
): Trade {

  const events = addEvent(
    [...trade.events],
    "TRADE_OPENED",
    trade.entry,
    `${trade.action} trade activated`
  );

  return {

    ...trade,

    status: "ACTIVE",

    openedAt: new Date(),

    events,

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

  let events = [...trade.events];

  //--------------------------------------------------
  // NEW
  //--------------------------------------------------

  let highestPrice = trade.highestPrice;
  let lowestPrice = trade.lowestPrice;
  let trailingStopEnabled =
    trade.trailingStopEnabled;

  highestPrice = Math.max(
  highestPrice,
  currentPrice
);

lowestPrice = Math.min(
  lowestPrice,
  currentPrice
);

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

stopLoss = trade.target1;

events = addEvent(
  events,
  "PROFIT_PROTECTION_ENABLED",
  stopLoss,
  "Remaining position protected at Target 1"
);

    status = "TARGET 1 HIT";

events = addEvent(
  events,
  "TARGET1_HIT",
  currentPrice,
  "Target 1 reached"
);

events = addEvent(
  events,
  "PARTIAL_PROFIT_BOOKED",
  currentPrice,
  "50% position booked"
);
    console.log("🎯 TARGET 1 HIT");
  }

//--------------------------------------------------
// Dynamic Profit Protection BEFORE Target 1
//--------------------------------------------------

if (!target1Hit) {

  if (trade.action === "BUY") {

    const favorableMove =
      highestPrice - trade.entry;

    // +25 points → lock +15
    if (favorableMove >= 25) {

      const protectedSL =
        trade.entry + 15;

      if (protectedSL > stopLoss) {

        stopLoss = Number(
          protectedSL.toFixed(2)
        );

        events = addEvent(
          events,
          "PROFIT_PROTECTION_ENABLED",
          stopLoss,
          "Profit protected after +25 point favorable move"
        );
      }

    // +15 points → lock +5
    } else if (favorableMove >= 15) {

      const protectedSL =
        trade.entry + 5;

      if (protectedSL > stopLoss) {

        stopLoss = Number(
          protectedSL.toFixed(2)
        );

        events = addEvent(
          events,
          "PROFIT_PROTECTION_ENABLED",
          stopLoss,
          "Profit protected after +15 point favorable move"
        );
      }

    // +8 points → move to breakeven
    } else if (favorableMove >= 8) {

      const protectedSL =
        trade.entry;

      if (protectedSL > stopLoss) {

        stopLoss = Number(
          protectedSL.toFixed(2)
        );

        events = addEvent(
          events,
          "PROFIT_PROTECTION_ENABLED",
          stopLoss,
          "Trade protected at break even after +8 point favorable move"
        );
      }
    }

  } else {

    const favorableMove =
      trade.entry - lowestPrice;

    // +25 points → lock +15
    if (favorableMove >= 25) {

      const protectedSL =
        trade.entry - 15;

      if (protectedSL < stopLoss) {

        stopLoss = Number(
          protectedSL.toFixed(2)
        );

        events = addEvent(
          events,
          "PROFIT_PROTECTION_ENABLED",
          stopLoss,
          "Profit protected after +25 point favorable move"
        );
      }

    // +15 points → lock +5
    } else if (favorableMove >= 15) {

      const protectedSL =
        trade.entry - 5;

      if (protectedSL < stopLoss) {

        stopLoss = Number(
          protectedSL.toFixed(2)
        );

        events = addEvent(
          events,
          "PROFIT_PROTECTION_ENABLED",
          stopLoss,
          "Profit protected after +15 point favorable move"
        );
      }

    // +8 points → breakeven
    } else if (favorableMove >= 8) {

      const protectedSL =
        trade.entry;

      if (protectedSL < stopLoss) {

        stopLoss = Number(
          protectedSL.toFixed(2)
        );

        events = addEvent(
          events,
          "PROFIT_PROTECTION_ENABLED",
          stopLoss,
          "Trade protected at break even after +8 point favorable move"
        );
      }
    }
  }
}

//--------------------------------------------------
// Target 2
// Activate runner - DO NOT CLOSE TRADE
//--------------------------------------------------

if (
  hitTarget2 &&
  !target2Hit &&
  status !== "CLOSED"
) {

  target2Hit = true;

  status = "TARGET 2 HIT";

  // Runner starts only after T2
  trailingStopEnabled = true;

  // Keep remaining 50% open
  remainingPosition = 50;

  events = addEvent(
    events,
    "TARGET2_HIT",
    currentPrice,
    "Target 2 reached - runner activated"
  );

  console.log(
    "🏃 TARGET 2 HIT - RUNNER ACTIVATED"
  );
}

//--------------------------------------------------
// Runner Protection After Target 2
//
// Once Target 2 is hit:
// BUY  -> remaining 50% is protected at T2
// SELL -> remaining 50% is protected at T2
//
// Runner only starts trailing after price moves
// 10 points beyond T2.
//
// BUY  -> SL follows highestPrice - 20
// SELL -> SL follows lowestPrice + 20
//
// T2 remains the absolute protection floor/ceiling.
//--------------------------------------------------

if (
  target2Hit &&
  partialProfitBooked &&
  remainingPosition > 0 &&
  status !== "CLOSED"
) {

  const runnerActivationDistance = 10;
  const runnerGiveback = 20;

  if (trade.action === "BUY") {

    // ---------------------------------------------
    // Phase 1: T2 reached, but price has NOT moved
    // 10 points beyond T2 yet.
    //
    // Protect remaining position exactly at T2.
    // ---------------------------------------------

    const runnerMove =
      highestPrice - trade.target2;

    if (runnerMove < runnerActivationDistance) {

      if (stopLoss < trade.target2) {

        stopLoss = Number(
          trade.target2.toFixed(2)
        );

        events = addEvent(
          events,
          "PROFIT_PROTECTION_ENABLED",
          stopLoss,
          "BUY runner protected at Target 2"
        );

        console.log(
          "🛡️ BUY RUNNER PROTECTED AT T2:",
          stopLoss
        );
      }

    } else {

      // ---------------------------------------------
      // Phase 2: Price moved at least +10 beyond T2.
      //
      // Now trailing protection becomes active.
      // ---------------------------------------------

      const runnerSL =
        highestPrice - runnerGiveback;

      // NEVER allow SL below T2
      const protectedSL =
        Math.max(
          trade.target2,
          runnerSL
        );

      if (protectedSL > stopLoss) {

        stopLoss = Number(
          protectedSL.toFixed(2)
        );

        events = addEvent(
          events,
          "PROFIT_PROTECTION_ENABLED",
          stopLoss,
          "BUY runner trailing protection updated"
        );

        console.log(
          "🏃 BUY RUNNER TRAILING:",
          {
            highestPrice,
            runnerMove,
            runnerSL,
            protectedSL,
          }
        );
      }
    }

  } else {

    // ---------------------------------------------
    // SELL RUNNER
    // ---------------------------------------------

    const runnerMove =
      trade.target2 - lowestPrice;

    // ---------------------------------------------
    // Phase 1: T2 reached, but price has NOT moved
    // 10 points beyond T2 yet.
    //
    // Protect remaining position exactly at T2.
    // ---------------------------------------------

    if (runnerMove < runnerActivationDistance) {

      if (stopLoss > trade.target2) {

        stopLoss = Number(
          trade.target2.toFixed(2)
        );

        events = addEvent(
          events,
          "PROFIT_PROTECTION_ENABLED",
          stopLoss,
          "SELL runner protected at Target 2"
        );

        console.log(
          "🛡️ SELL RUNNER PROTECTED AT T2:",
          stopLoss
        );
      }

    } else {

      // ---------------------------------------------
      // Phase 2: Price moved at least 10 points
      // beyond T2.
      //
      // Now trailing protection becomes active.
      // ---------------------------------------------

      const runnerSL =
        lowestPrice + runnerGiveback;

      // NEVER allow SL above T2
      const protectedSL =
        Math.min(
          trade.target2,
          runnerSL
        );

      if (protectedSL < stopLoss) {

        stopLoss = Number(
          protectedSL.toFixed(2)
        );

        events = addEvent(
          events,
          "PROFIT_PROTECTION_ENABLED",
          stopLoss,
          "SELL runner trailing protection updated"
        );

        console.log(
          "🏃 SELL RUNNER TRAILING:",
          {
            lowestPrice,
            runnerMove,
            runnerSL,
            protectedSL,
          }
        );
      }
    }
  }
}

//--------------------------------------------------
// Final Stop Loss Check
//--------------------------------------------------

const hitStopLoss =
  status !== "CLOSED" &&
  (
    trade.action === "BUY"
      ? currentPrice <= stopLoss
      : currentPrice >= stopLoss
  );

  const stopExecutionPrice = hitStopLoss
  ? stopLoss
  : currentPrice;

//--------------------------------------------------
// Stop Loss
//--------------------------------------------------

if (hitStopLoss && status !== "CLOSED") {

  // Calculate final realized profit
  if (partialProfitBooked) {

const remainingProfit =
  trade.action === "BUY"
    ? stopExecutionPrice - trade.entry
    : trade.entry - stopExecutionPrice;

    realizedPnL = Number(
      (
        realizedPnL +
        remainingProfit * 0.5
      ).toFixed(2)
    );

  } else {

  realizedPnL =
  trade.action === "BUY"
    ? stopExecutionPrice - trade.entry
    : trade.entry - stopExecutionPrice;

  }

result =
  realizedPnL > 0
    ? "WIN"
    : realizedPnL < 0
    ? "LOSS"
    : "BREAKEVEN";

  remainingPosition = 0;
  trailingStopEnabled = false;

  closedAt = new Date();
status = "CLOSED";

  const profitProtected =
  trade.action === "BUY"
    ? stopLoss >= trade.entry
    : stopLoss <= trade.entry;

  console.log("🧪 CLOSE CLASSIFICATION:", {
  action: trade.action,
  entry: trade.entry,
  currentPrice,
  stopLoss,
  profitProtected,
  partialProfitBooked,
  target2Hit,
});

if (
  profitProtected ||
  partialProfitBooked ||
  target2Hit
) {

  events = addEvent(
    events,
    "PROFIT_PROTECTION_ENABLED",
    stopExecutionPrice,
    "Trade closed by protected stop"
  );

  events = addEvent(
    events,
    "TRADE_CLOSED",
    stopExecutionPrice,
    "Trade closed by profit protection"
  );

  console.log(
    "🛡️ PROFIT PROTECTION EXIT"
  );

} else {

  events = addEvent(
    events,
    "STOP_LOSS_HIT",
    stopExecutionPrice,
    "Stop loss triggered"
  );

  events = addEvent(
    events,
    "TRADE_CLOSED",
    stopExecutionPrice,
    "Trade closed by stop loss"
  );

  console.log(
    "🛑 STOP LOSS HIT"
  );

}

}

//--------------------------------------------------
// Final return
//--------------------------------------------------

console.log(
  "RETURNING realizedPnL =",
  realizedPnL
);

console.log(
  "RETURNING pnl =",
  pnl
);

return {
  ...trade,

  currentPrice: hitStopLoss
    ? stopExecutionPrice
    : currentPrice,

  pnl: hitStopLoss
    ? Number(
        (
          trade.action === "BUY"
            ? stopExecutionPrice - trade.entry
            : trade.entry - stopExecutionPrice
        ).toFixed(2)
      )
    : pnl,

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

  events,
};

}
