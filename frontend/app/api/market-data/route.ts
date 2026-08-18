import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
});

export async function GET() {
  try {
const [
  nifty,
  bankNifty,
  niftyChart,
  niftyChart1m,
] = await Promise.all([
  yahooFinance.quote("^NSEI"),
  yahooFinance.quote("^NSEBANK"),

  yahooFinance.chart("^NSEI", {
    period1: new Date(
      Date.now() - 24 * 60 * 60 * 1000
    ),
    interval: "5m",
  }),

  yahooFinance.chart("^NSEI", {
    period1: new Date(
      Date.now() - 24 * 60 * 60 * 1000
    ),
    interval: "1m",
  }),
]);

    return NextResponse.json({
      success: true,

      nifty: {
        symbol: nifty.symbol,
        price: nifty.regularMarketPrice,
        previousClose: nifty.regularMarketPreviousClose,
        change: nifty.regularMarketChange,
        changePercent: nifty.regularMarketChangePercent,
        time: nifty.regularMarketTime,
      },

      bankNifty: {
        symbol: bankNifty.symbol,
        price: bankNifty.regularMarketPrice,
        previousClose: bankNifty.regularMarketPreviousClose,
        change: bankNifty.regularMarketChange,
        changePercent: bankNifty.regularMarketChangePercent,
        time: bankNifty.regularMarketTime,
      },

niftyCandles: niftyChart.quotes
  .filter(
    (candle) =>
      candle.open != null &&
      candle.high != null &&
      candle.low != null &&
      candle.close != null &&
      candle.date.getTime() <=
        Date.now() - 5 * 60 * 1000
  )
  .map((candle) => ({
    time: candle.date,
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
  })),

  niftyCandles1m: niftyChart1m.quotes
  .filter(
    (candle) =>
      candle.open != null &&
      candle.high != null &&
      candle.low != null &&
      candle.close != null &&
      candle.date.getTime() <=
        Date.now() - 1 * 60 * 1000
  )
  .map((candle) => ({
    time: candle.date,
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
  })),
  
    });
  } catch (error) {
    console.error("MARKET DATA ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch market data",
      },
      {
        status: 500,
      }
    );
  }
}