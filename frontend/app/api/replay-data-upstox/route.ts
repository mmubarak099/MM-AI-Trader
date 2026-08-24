import {
  NextResponse,
} from "next/server";


// ==========================================
// UPSTOX REPLAY DATA API
//
// Example:
//
// /api/replay-data-upstox?date=2026-08-20
//
// IMPORTANT:
//
// Returns the SAME response structure as
// the existing Yahoo Replay API:
//
// warmup5m
// warmup1m
// candles5m
// candles1m
//
// Existing Replay / Analyzer / Scanner
// should therefore require no changes.
// ==========================================


type ReplayCandle = {

  time: string;

  open: number;
  high: number;
  low: number;
  close: number;

  volume: number;
};


// ==========================================
// NORMALIZE UPSTOX CANDLE
// ==========================================

function normalizeUpstoxCandle(
  candle: any[]
): ReplayCandle {

  return {

    time:
      String(
        candle[0]
      ),

    open:
      Number(
        candle[1]
      ),

    high:
      Number(
        candle[2]
      ),

    low:
      Number(
        candle[3]
      ),

    close:
      Number(
        candle[4]
      ),

    volume:
      Number(
        candle[5] ?? 0
      ),
  };
}


// ==========================================
// DERIVE 5m FROM CHRONOLOGICAL 1m DATA
// ==========================================

function build5mCandles(
  candles1m: ReplayCandle[]
): ReplayCandle[] {

  const candles5m:
    ReplayCandle[] = [];


  for (
    let i = 0;
    i < candles1m.length;
    i += 5
  ) {

    const group =
      candles1m.slice(
        i,
        i + 5
      );


    if (
      group.length !== 5
    ) {
      continue;
    }


    candles5m.push({

      time:
        group[0].time,

      open:
        group[0].open,

      high:
        Math.max(
          ...group.map(
            candle =>
              candle.high
          )
        ),

      low:
        Math.min(
          ...group.map(
            candle =>
              candle.low
          )
        ),

      close:
        group[
          group.length - 1
        ].close,

      volume:
        group.reduce(
          (
            total,
            candle
          ) =>
            total +
            candle.volume,
          0
        ),
    });
  }


  return candles5m;
}


// ==========================================
// API
// ==========================================

export async function GET(
  request: Request
) {

  try {

    // ======================================
    // ENVIRONMENT
    // ======================================

    const accessToken =
      process.env
        .UPSTOX_ACCESS_TOKEN;


    const instrumentKey =
      process.env
        .UPSTOX_NIFTY_INSTRUMENT_KEY ??
      "NSE_INDEX|Nifty 50";


    if (!accessToken) {

      return NextResponse.json(
        {
          success: false,

          error:
            "UPSTOX_ACCESS_TOKEN is missing.",
        },
        {
          status: 500,
        }
      );
    }


    // ======================================
    // REQUESTED REPLAY DATE
    // ======================================

    const url =
      new URL(
        request.url
      );


    const requestedDate =
      url.searchParams.get(
        "date"
      ) ??
      "2026-08-21";


    // ======================================
    // HISTORY WINDOW
    //
    // Seven calendar days gives enough
    // previous-market data for:
    //
    // 375 x 1m warm-up
    // 75  x 5m warm-up
    //
    // while remaining well inside Upstox's
    // 1-minute retrieval window.
    // ======================================

    const replayDate =
      new Date(
        `${requestedDate}T00:00:00+05:30`
      );


    const historyStart =
      new Date(
        replayDate.getTime() -
        7 * 24 * 60 * 60 * 1000
      );


    const historyStartDate =
      historyStart
        .toISOString()
        .slice(0, 10);


    const encodedInstrumentKey =
      encodeURIComponent(
        instrumentKey
      );


    // ======================================
    // LOAD 1m HISTORY FROM UPSTOX
    // ======================================

    const upstoxUrl =
      `https://api.upstox.com/v3/historical-candle/${encodedInstrumentKey}/minutes/1/${requestedDate}/${historyStartDate}`;


    const response =
      await fetch(
        upstoxUrl,
        {
          method:
            "GET",

          headers: {

            Accept:
              "application/json",

            Authorization:
              `Bearer ${accessToken}`,
          },

          cache:
            "no-store",
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      return NextResponse.json(
        {
          success: false,

          date:
            requestedDate,

          status:
            response.status,

          error:
            "Upstox historical-data request failed.",

          upstoxResponse:
            data,
        },
        {
          status:
            response.status,
        }
      );
    }


    const rawCandles:
      any[][] =
      data?.data?.candles ??
      [];


    // ======================================
    // NORMALIZE + CHRONOLOGICAL SORT
    // ======================================

    const all1m =
      rawCandles
        .map(
          normalizeUpstoxCandle
        )
        .sort(
          (
            a,
            b
          ) =>
            new Date(
              a.time
            ).getTime() -
            new Date(
              b.time
            ).getTime()
        );


    // ======================================
    // TARGET SESSION BOUNDARIES
    // ======================================

    const replayStart =
      new Date(
        `${requestedDate}T09:15:00+05:30`
      );


    const replayEnd =
      new Date(
        `${requestedDate}T15:29:59+05:30`
      );


    const replayStartTime =
      replayStart.getTime();


    const replayEndTime =
      replayEnd.getTime();


    // ======================================
    // PREVIOUS 1m HISTORY
    // ======================================

    const previous1m =
      all1m.filter(
        candle =>
          new Date(
            candle.time
          ).getTime() <
          replayStartTime
      );


    // ======================================
    // REPLAY DAY 1m
    // ======================================

    const candles1m =
      all1m.filter(
        candle => {

          const time =
            new Date(
              candle.time
            ).getTime();


          return (
            time >=
              replayStartTime &&
            time <=
              replayEndTime
          );
        }
      );


    // ======================================
    // VALIDATE SELECTED SESSION
    // ======================================

    if (
      candles1m.length === 0
    ) {

      return NextResponse.json(
        {
          success: false,

          date:
            requestedDate,

          error:
            "No Upstox market candles were found for the selected Replay date. It may be a weekend or market holiday.",
        },
        {
          status: 404,
        }
      );
    }


    // ======================================
    // WARM-UP 1m
    // ======================================

    const warmup1m =
      previous1m.slice(
        -375
      );


    // ======================================
    // BUILD 5m HISTORY
    //
    // Build from each dataset separately so
    // Replay session starts exactly at 09:15.
    // ======================================

    const previous5m =
      build5mCandles(
        previous1m
      );


    const candles5m =
      build5mCandles(
        candles1m
      );


    const warmup5m =
      previous5m.slice(
        -75
      );


    // ======================================
    // RESPONSE
    //
    // SAME SHAPE AS EXISTING REPLAY API
    // ======================================

    return NextResponse.json({

      success: true,

      source:
        "UPSTOX",

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
      "UPSTOX REPLAY DATA ERROR:",
      error
    );


    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to load Upstox Replay data.",
      },
      {
        status: 500,
      }
    );
  }
}