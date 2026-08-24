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
// Example:
//
// /api/replay-data?date=2026-08-21
//
// The selected date becomes the Replay day.
//
// Historical candles before that date are
// automatically used as indicator warm-up.
// ==========================================

export async function GET(
  request: Request
) {

  try {

    // ======================================
    // READ REPLAY DATE
    // ======================================

    const url =
      new URL(request.url);

    const requestedDate =
      url.searchParams.get("date") ??
      "2026-08-21";


    // ======================================
    // TARGET MARKET SESSION
    // ======================================

    const replayStart =
      new Date(
        `${requestedDate}T09:15:00+05:30`
      );

    const replayEnd =
      new Date(
        `${requestedDate}T15:31:00+05:30`
      );


    // ======================================
    // LOAD EXTRA HISTORY FOR WARM-UP
    //
    // Seven calendar days gives us room for
    // weekends and normal market holidays.
    // ======================================

    const historyStart =
      new Date(
        replayStart.getTime() -
        7 * 24 * 60 * 60 * 1000
      );


    // ======================================
    // DOWNLOAD HISTORICAL DATA
    // ======================================

    const [
      nifty5m,
      nifty1m,
    ] = await Promise.all([

      yahooFinance.chart(
        "^NSEI",
        {
          period1:
            historyStart,

          period2:
            replayEnd,

          interval:
            "5m",
        }
      ),

      yahooFinance.chart(
        "^NSEI",
        {
          period1:
            historyStart,

          period2:
            replayEnd,

          interval:
            "1m",
        }
      ),

    ]);


    // ======================================
    // NORMALIZE 5m DATA
    // ======================================

    const all5m =
      nifty5m.quotes
        .filter(
          candle =>
            candle.open != null &&
            candle.high != null &&
            candle.low != null &&
            candle.close != null
        )
        .map(
          candle => ({
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
    // NORMALIZE 1m DATA
    // ======================================

    const all1m =
      nifty1m.quotes
        .filter(
          candle =>
            candle.open != null &&
            candle.high != null &&
            candle.low != null &&
            candle.close != null
        )
        .map(
          candle => ({
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


    const replayStartTime =
      replayStart.getTime();

    const replayEndTime =
      replayEnd.getTime();


    // ======================================
    // WARM-UP DATA
    // ======================================

    const previous5m =
      all5m.filter(
        candle =>
          new Date(
            candle.time
          ).getTime() <
          replayStartTime
      );


    const previous1m =
      all1m.filter(
        candle =>
          new Date(
            candle.time
          ).getTime() <
          replayStartTime
      );


    // Keep only enough recent history
    // for indicators / structure.

    const warmup5m =
      previous5m.slice(-75);

    const warmup1m =
      previous1m.slice(-375);


    // ======================================
    // SELECTED REPLAY SESSION
    // ======================================

    const candles5m =
      all5m.filter(
        candle => {

          const time =
            new Date(
              candle.time
            ).getTime();

          return (
            time >= replayStartTime &&
            time <= replayEndTime
          );
        }
      );


    const candles1m =
      all1m.filter(
        candle => {

          const time =
            new Date(
              candle.time
            ).getTime();

          return (
            time >= replayStartTime &&
            time <= replayEndTime
          );
        }
      );


    // ======================================
    // VALIDATE SELECTED DAY
    // ======================================

    if (
      candles5m.length === 0 ||
      candles1m.length === 0
    ) {

      return NextResponse.json(
        {
          success: false,

          date:
            requestedDate,

          error:
            "No market candles were found for the selected replay date. It may be a weekend or market holiday.",
        },
        {
          status: 404,
        }
      );
    }


    // ======================================
    // RESPONSE
    // ======================================

    return NextResponse.json({

      success: true,

      date:
        requestedDate,

      warmup5m,

      warmup1m,

      candles5m,

      candles1m,

      counts: {

        warmup5m:
          warmup5m.length,

        warmup1m:
          warmup1m.length,

        replay5m:
          candles5m.length,

        replay1m:
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