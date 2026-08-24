import {
  NextResponse,
} from "next/server";


// ==========================================
// UPSTOX HISTORICAL DATA TEST
//
// Purpose:
//
// 1. Test Analytics Token
// 2. Load NIFTY 1m history
// 3. Normalize Upstox candle arrays
// 4. Sort oldest -> newest
// 5. Build 5m candles from 1m data
//
// Does NOT modify Replay API yet.
// ==========================================


type NormalizedCandle = {

  time: string;

  open: number;

  high: number;

  low: number;

  close: number;

  volume: number;
};


// ==========================================
// NORMALIZE UPSTOX 1m CANDLE
//
// Upstox format:
//
// [
//   timestamp,
//   open,
//   high,
//   low,
//   close,
//   volume,
//   openInterest
// ]
// ==========================================

function normalizeUpstoxCandle(
  candle: any[]
): NormalizedCandle {

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
// BUILD 5m CANDLES FROM 1m CANDLES
//
// Input must already be chronological:
// oldest -> newest
// ==========================================

function build5mCandles(
  candles1m: NormalizedCandle[]
): NormalizedCandle[] {

  const candles5m:
    NormalizedCandle[] = [];


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


    const candle5m:
      NormalizedCandle = {

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
      };


    candles5m.push(
      candle5m
    );
  }


  return candles5m;
}


// ==========================================
// UPSTOX HISTORICAL DATA TEST
// ==========================================

export async function GET() {

  try {

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
    // TEST ONE KNOWN TRADING DAY
    // ======================================

    const fromDate =
      "2026-08-20";

    const toDate =
      "2026-08-20";


    const encodedInstrumentKey =
      encodeURIComponent(
        instrumentKey
      );


    const upstoxUrl =
      `https://api.upstox.com/v3/historical-candle/${encodedInstrumentKey}/minutes/1/${toDate}/${fromDate}`;


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

          status:
            response.status,

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
    // NORMALIZE
    // ======================================

    const candles1m =
      rawCandles.map(
        normalizeUpstoxCandle
      );


    // ======================================
    // IMPORTANT:
    // Upstox sends newest -> oldest.
    //
    // Replay requires oldest -> newest.
    // ======================================

    candles1m.sort(
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
    // BUILD 5m DATA
    // ======================================

    const candles5m =
      build5mCandles(
        candles1m
      );


    // ======================================
    // RESPONSE
    // ======================================

    return NextResponse.json({

      success: true,

      instrumentKey,

      fromDate,

      toDate,


      counts: {

        raw1m:
          rawCandles.length,

        normalized1m:
          candles1m.length,

        derived5m:
          candles5m.length,
      },


      first1m:
        candles1m[0] ??
        null,

      last1m:
        candles1m[
          candles1m.length - 1
        ] ??
        null,


      first5m:
        candles5m[0] ??
        null,

      last5m:
        candles5m[
          candles5m.length - 1
        ] ??
        null,


      sample1m:
        candles1m.slice(
          0,
          3
        ),

      sample5m:
        candles5m.slice(
          0,
          3
        ),
    });


  } catch (error) {

    console.error(
      "UPSTOX TEST ERROR:",
      error
    );


    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to test Upstox historical data.",
      },
      {
        status: 500,
      }
    );
  }
}