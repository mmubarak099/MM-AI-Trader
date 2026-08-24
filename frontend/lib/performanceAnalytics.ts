// ==========================================
// MM AI TRADER
// PERFORMANCE ANALYTICS
//
// Purpose:
// Convert completed trade results into
// reusable performance statistics.
//
// IMPORTANT:
// This module does NOT change:
// - V1 strategy
// - signal qualification
// - stability
// - trade management
// - Replay execution
// ==========================================


export type PerformanceTrade = {

  date: string;

  action:
    | "BUY"
    | "SELL";

result:
  | "WIN"
  | "LOSS"
  | "BREAKEVEN"
  | "OPEN";

confirmations: number;

realizedPnL: number;

  target1Hit: boolean;

  target2Hit: boolean;

  runnerActivated: boolean;
};

// ==========================================
// EQUITY CURVE POINT
// ==========================================

export type EquityCurvePoint = {

  tradeNumber: number;

  date: string;

  cumulativePnL: number;

  drawdown: number;
};

// ==========================================
// MONTHLY PERFORMANCE
// ==========================================

export type MonthlyPerformance = {

  month: string;

  trades: number;

  wins: number;

  losses: number;

  breakevens: number;

  netPnL: number;

  winRate: number;
};

// ==========================================
// CONFIRMATION PERFORMANCE
// ==========================================

export type ConfirmationPerformance = {

  confirmations: number;

  trades: number;

  wins: number;

  losses: number;

  breakevens: number;

  netPnL: number;

  winRate: number;
};

// ==========================================
// PERFORMANCE SUMMARY
// ==========================================

export type PerformanceAnalytics = {

  totalTrades: number;

  closedTrades: number;

  openTrades: number;


  wins: number;

  losses: number;

  breakevens: number;


  winRate: number;

  lossRate: number;

  breakevenRate: number;


  netPnL: number;

  grossProfit: number;

  grossLoss: number;

  averageTrade: number;

  averageWin: number;

  averageLoss: number;

  profitFactor: number;


  buyTrades: number;

  sellTrades: number;


  target1Hits: number;

  target2Hits: number;

  runnerActivations: number;


  longestWinningStreak: number;

  longestLosingStreak: number;

  maxDrawdown: number;

  monthlyPerformance:
  MonthlyPerformance[];

  equityCurve:
  EquityCurvePoint[];

  confirmationPerformance:
  ConfirmationPerformance[];
};


// ==========================================
// EMPTY ANALYTICS
// ==========================================

export const emptyPerformanceAnalytics:
  PerformanceAnalytics = {

  totalTrades: 0,

  closedTrades: 0,

  openTrades: 0,

  wins: 0,

  losses: 0,

  breakevens: 0,

  winRate: 0,

  lossRate: 0,

  breakevenRate: 0,

  netPnL: 0,

  grossProfit: 0,

  grossLoss: 0,

  averageTrade: 0,

  averageWin: 0,

  averageLoss: 0,

  profitFactor: 0,

  buyTrades: 0,

  sellTrades: 0,

  target1Hits: 0,

  target2Hits: 0,

  runnerActivations: 0,

  longestWinningStreak: 0,

  longestLosingStreak: 0,

  maxDrawdown: 0,

  monthlyPerformance: [],

  equityCurve: [],

  confirmationPerformance: [],
};

// ==========================================
// CALCULATE PERFORMANCE ANALYTICS
// ==========================================

export function calculatePerformanceAnalytics(
  trades:
    PerformanceTrade[]
): PerformanceAnalytics {

  if (
    trades.length === 0
  ) {
    return {
      ...emptyPerformanceAnalytics,
    };
  }


  const totalTrades =
    trades.length;


  const closedTradesList =
    trades.filter(
      trade =>
        trade.result !== "OPEN"
    );


  const openTrades =
    trades.filter(
      trade =>
        trade.result === "OPEN"
    ).length;


  const wins =
    trades.filter(
      trade =>
        trade.result === "WIN"
    );


  const losses =
    trades.filter(
      trade =>
        trade.result === "LOSS"
    );


  const breakevens =
    trades.filter(
      trade =>
        trade.result === "BREAKEVEN"
    );


  const closedTrades =
    closedTradesList.length;


  const winRate =
    closedTrades > 0
      ? Number(
          (
            wins.length /
            closedTrades *
            100
          ).toFixed(2)
        )
      : 0;


  const lossRate =
    closedTrades > 0
      ? Number(
          (
            losses.length /
            closedTrades *
            100
          ).toFixed(2)
        )
      : 0;


  const breakevenRate =
    closedTrades > 0
      ? Number(
          (
            breakevens.length /
            closedTrades *
            100
          ).toFixed(2)
        )
      : 0;


  const netPnL =
    Number(
      trades
        .reduce(
          (
            total,
            trade
          ) =>
            total +
            trade.realizedPnL,
          0
        )
        .toFixed(2)
    );


  const grossProfit =
    Number(
      trades
        .filter(
          trade =>
            trade.realizedPnL > 0
        )
        .reduce(
          (
            total,
            trade
          ) =>
            total +
            trade.realizedPnL,
          0
        )
        .toFixed(2)
    );


  const grossLoss =
    Number(
      Math.abs(
        trades
          .filter(
            trade =>
              trade.realizedPnL < 0
          )
          .reduce(
            (
              total,
              trade
            ) =>
              total +
              trade.realizedPnL,
            0
          )
      ).toFixed(2)
    );


  const averageTrade =
    closedTrades > 0
      ? Number(
          (
            netPnL /
            closedTrades
          ).toFixed(2)
        )
      : 0;


  const averageWin =
    wins.length > 0
      ? Number(
          (
            wins.reduce(
              (
                total,
                trade
              ) =>
                total +
                trade.realizedPnL,
              0
            ) /
            wins.length
          ).toFixed(2)
        )
      : 0;


  const averageLoss =
    losses.length > 0
      ? Number(
          (
            losses.reduce(
              (
                total,
                trade
              ) =>
                total +
                trade.realizedPnL,
              0
            ) /
            losses.length
          ).toFixed(2)
        )
      : 0;


  const profitFactor =
    grossLoss > 0
      ? Number(
          (
            grossProfit /
            grossLoss
          ).toFixed(2)
        )
      : grossProfit > 0
      ? Infinity
      : 0;


  const buyTrades =
    trades.filter(
      trade =>
        trade.action === "BUY"
    ).length;


  const sellTrades =
    trades.filter(
      trade =>
        trade.action === "SELL"
    ).length;


  const target1Hits =
    trades.filter(
      trade =>
        trade.target1Hit
    ).length;


  const target2Hits =
    trades.filter(
      trade =>
        trade.target2Hit
    ).length;


  const runnerActivations =
    trades.filter(
      trade =>
        trade.runnerActivated
    ).length;


  // ========================================
  // WINNING / LOSING STREAKS
  // ========================================

  let currentWinningStreak = 0;
  let currentLosingStreak = 0;

  let longestWinningStreak = 0;
  let longestLosingStreak = 0;


  for (
    const trade of
    closedTradesList
  ) {

    if (
      trade.result === "WIN"
    ) {

      currentWinningStreak += 1;

      currentLosingStreak = 0;


      longestWinningStreak =
        Math.max(
          longestWinningStreak,
          currentWinningStreak
        );

    } else if (
      trade.result === "LOSS"
    ) {

      currentLosingStreak += 1;

      currentWinningStreak = 0;


      longestLosingStreak =
        Math.max(
          longestLosingStreak,
          currentLosingStreak
        );

    } else {

      currentWinningStreak = 0;

      currentLosingStreak = 0;
    }
  }


  // ========================================
  // MAX DRAWDOWN
  //
  // Uses cumulative realized P/L.
  // ========================================

let equity = 0;

let peakEquity = 0;

let maxDrawdown = 0;

const equityCurve:
  EquityCurvePoint[] = [];


for (
  const trade of
  closedTradesList
) {

  equity +=
    trade.realizedPnL;


  peakEquity =
    Math.max(
      peakEquity,
      equity
    );


  const drawdown =
    peakEquity -
    equity;


  maxDrawdown =
    Math.max(
      maxDrawdown,
      drawdown
    );


  equityCurve.push({

    tradeNumber:
      equityCurve.length + 1,

    date:
      trade.date,

    cumulativePnL:
      Number(
        equity.toFixed(2)
      ),

    drawdown:
      Number(
        drawdown.toFixed(2)
      ),
  });
}

// ========================================
// MONTHLY PERFORMANCE
// ========================================

const monthlyMap =
  new Map<
    string,
    {
      trades: number;
      wins: number;
      losses: number;
      breakevens: number;
      netPnL: number;
    }
  >();


for (
  const trade of
  closedTradesList
) {

  // Trade date format:
  // YYYY-MM-DD
  const month =
    trade.date.slice(
      0,
      7
    );


  const existing =
    monthlyMap.get(
      month
    ) ?? {
      trades: 0,
      wins: 0,
      losses: 0,
      breakevens: 0,
      netPnL: 0,
    };


  existing.trades += 1;

  existing.netPnL +=
    trade.realizedPnL;


  if (
    trade.result === "WIN"
  ) {

    existing.wins += 1;

  } else if (
    trade.result === "LOSS"
  ) {

    existing.losses += 1;

  } else if (
    trade.result === "BREAKEVEN"
  ) {

    existing.breakevens += 1;
  }


  monthlyMap.set(
    month,
    existing
  );
}


const monthlyPerformance:
  MonthlyPerformance[] =
  Array.from(
    monthlyMap.entries()
  )
    .sort(
      (
        [monthA],
        [monthB]
      ) =>
        monthA.localeCompare(
          monthB
        )
    )
    .map(
      (
        [month, data]
      ) => ({

        month,

        trades:
          data.trades,

        wins:
          data.wins,

        losses:
          data.losses,

        breakevens:
          data.breakevens,

        netPnL:
          Number(
            data.netPnL.toFixed(2)
          ),

        winRate:
          data.trades > 0
            ? Number(
                (
                  data.wins /
                  data.trades *
                  100
                ).toFixed(2)
              )
            : 0,
      })
    );

    // ========================================
// CONFIRMATION PERFORMANCE
// ========================================

const confirmationMap =
  new Map<
    number,
    {
      trades: number;
      wins: number;
      losses: number;
      breakevens: number;
      netPnL: number;
    }
  >();


for (
  const trade of
  closedTradesList
) {

  const confirmations =
    trade.confirmations;


  const existing =
    confirmationMap.get(
      confirmations
    ) ?? {
      trades: 0,
      wins: 0,
      losses: 0,
      breakevens: 0,
      netPnL: 0,
    };


  existing.trades += 1;

  existing.netPnL +=
    trade.realizedPnL;


  if (
    trade.result === "WIN"
  ) {

    existing.wins += 1;

  } else if (
    trade.result === "LOSS"
  ) {

    existing.losses += 1;

  } else if (
    trade.result === "BREAKEVEN"
  ) {

    existing.breakevens += 1;
  }


  confirmationMap.set(
    confirmations,
    existing
  );
}


const confirmationPerformance:
  ConfirmationPerformance[] =
  Array.from(
    confirmationMap.entries()
  )
    .sort(
      (
        [a],
        [b]
      ) =>
        a - b
    )
    .map(
      (
        [confirmations, data]
      ) => ({

        confirmations,

        trades:
          data.trades,

        wins:
          data.wins,

        losses:
          data.losses,

        breakevens:
          data.breakevens,

        netPnL:
          Number(
            data.netPnL.toFixed(2)
          ),

        winRate:
          data.trades > 0
            ? Number(
                (
                  data.wins /
                  data.trades *
                  100
                ).toFixed(2)
              )
            : 0,
      })
    );

  return {

    totalTrades,

    closedTrades,

    openTrades,

    wins:
      wins.length,

    losses:
      losses.length,

    breakevens:
      breakevens.length,

    winRate,

    lossRate,

    breakevenRate,

    netPnL,

    grossProfit,

    grossLoss,

    averageTrade,

    averageWin,

    averageLoss,

    profitFactor,

    buyTrades,

    sellTrades,

    target1Hits,

    target2Hits,

    runnerActivations,

    longestWinningStreak,

    longestLosingStreak,

    maxDrawdown:
      Number(
        maxDrawdown.toFixed(2)
      ),

    monthlyPerformance,
    equityCurve,
    confirmationPerformance,
  };
}
