import {
  NextResponse,
} from "next/server";

import YahooFinance from "yahoo-finance2";


const yahooFinance =
  new YahooFinance({
    suppressNotices: [
      "yahooSurvey",
    ],
  });


// ==========================================
// REPLAY DATA API
// ==========================================
//
// Replay date:
// Friday 21 August 2026
//
// Thursday data is also loaded as warm-up
// history so indicators can work from
// Friday market open.
// ==========================================

export async function GET() {

  try {

    // --------------------------------------
    // Historical warm-up starts Thursday
    // --------------------------------------

    const period1 =
      new Date(
        "2026-08-20T09:15:00+05:30"
      );

    // --------------------------------------
    // End after Friday market close
    // --------------------------------------

    const period2 =
      new Date(
        "2026-08-21T15:31:00+05:30"
      );


    const [
      nifty5m,
      nifty1m,
    ] = await Promise.all([

      yahooFinance.chart(
        "^NSEI",
        {
          period1,
          period2,
          interval: "5m",
        }
      ),

      yahooFinance.chart(
        "^NSEI",
        {
          period1,
          period2,
          interval: "1m",
        }
      ),

    ]);


    // ======================================
    // NORMALIZE 5 MINUTE DATA
    // ======================================

    const all5m =
      nifty5m.quotes
        .filter(
          (candle) =>
            candle.open != null &&
            candle.high != null &&
            candle.low != null &&
            candle.close != null
        )
        .map(
          (candle) => ({
            time:
              candle.date,

            open:
              candle.open,

            high:
              candle.high,

            low:
              candle.low,

            close:
              candle.close,

            volume:
              candle.volume ?? 0,
          })
        );


    // ======================================
    // NORMALIZE 1 MINUTE DATA
    // ======================================

    const all1m =
      nifty1m.quotes
        .filter(
          (candle) =>
            candle.open != null &&
            candle.high != null &&
            candle.low != null &&
            candle.close != null
        )
        .map(
          (candle) => ({
            time:
              candle.date,

            open:
              candle.open,

            high:
              candle.high,

            low:
              candle.low,

            close:
              candle.close,

            volume:
              candle.volume ?? 0,
          })
        );


    // ======================================
    // FRIDAY SESSION START
    // ======================================

    const fridayStart =
      new Date(
        "2026-08-21T09:15:00+05:30"
      ).getTime();


    // ======================================
    // SPLIT WARM-UP + FRIDAY REPLAY DATA
    // ======================================

    const warmup5m =
      all5m.filter(
        (candle) =>
          new Date(
            candle.time
          ).getTime() <
          fridayStart
      );


    const candles5m =
      all5m.filter(
        (candle) =>
          new Date(
            candle.time
          ).getTime() >=
          fridayStart
      );


    const warmup1m =
      all1m.filter(
        (candle) =>
          new Date(
            candle.time
          ).getTime() <
          fridayStart
      );


    const candles1m =
      all1m.filter(
        (candle) =>
          new Date(
            candle.time
          ).getTime() >=
          fridayStart
      );


    // ======================================
    // RESPONSE
    // ======================================

    return NextResponse.json({

      success: true,

      date:
        "2026-08-21",

      warmup5m,

      warmup1m,

      candles5m,

      candles1m,

      counts: {

        warmup5m:
          warmup5m.length,

        warmup1m:
          warmup1m.length,

        friday5m:
          candles5m.length,

        friday1m:
          candles1m.length,
      },

    });

  } catch (error) {

    console.error(
      "REPLAY DATA ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to load replay data",
      },
      {
        status: 500,
      }
    );

  }

}