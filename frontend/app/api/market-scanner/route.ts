import { NextRequest, NextResponse } from "next/server";

type MarketCandle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type ScannerSymbol =
  | "RELIANCE"
  | "HDFCBANK"
  | "ICICIBANK"
  | "SBIN"
  | "INFY";

function normalizeUpstoxCandle(
  candle: any[]
): MarketCandle {
  return {
    time: String(candle[0]),
    open: Number(candle[1]),
    high: Number(candle[2]),
    low: Number(candle[3]),
    close: Number(candle[4]),
    volume: Number(candle[5] ?? 0),
  };
}

function sortCandles(
  candles: MarketCandle[]
): MarketCandle[] {
  return [...candles].sort(
    (a, b) =>
      new Date(a.time).getTime() -
      new Date(b.time).getTime()
  );
}

function build5mCandles(
  candles1m: MarketCandle[]
): MarketCandle[] {
  const buckets =
    new Map<string, MarketCandle[]>();

  for (const candle of candles1m) {
    const date =
      new Date(candle.time);

    const bucketDate =
      new Date(date);

    bucketDate.setMinutes(
      Math.floor(
        date.getMinutes() / 5
      ) * 5,
      0,
      0
    );

    const key =
      bucketDate.toISOString();

    const group =
      buckets.get(key) ?? [];

    group.push(candle);

    buckets.set(
      key,
      group
    );
  }

  const candles5m:
    MarketCandle[] = [];

  for (
    const group of
      buckets.values()
  ) {
    if (group.length !== 5) {
      continue;
    }

    const sorted =
      sortCandles(group);

    candles5m.push({
      time:
        sorted[0].time,

      open:
        sorted[0].open,

      high:
        Math.max(
          ...sorted.map(
            candle =>
              candle.high
          )
        ),

      low:
        Math.min(
          ...sorted.map(
            candle =>
              candle.low
          )
        ),

      close:
        sorted[
          sorted.length - 1
        ].close,

      volume:
        sorted.reduce(
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

  return sortCandles(
    candles5m
  );
}

function formatISTDate(
  date: Date
): string {
  const parts =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone:
          "Asia/Kolkata",

        year:
          "numeric",

        month:
          "2-digit",

        day:
          "2-digit",
      }
    ).formatToParts(
      date
    );

  const year =
    parts.find(
      part =>
        part.type ===
        "year"
    )?.value;

  const month =
    parts.find(
      part =>
        part.type ===
        "month"
    )?.value;

  const day =
    parts.find(
      part =>
        part.type ===
        "day"
    )?.value;

  return `${year}-${month}-${day}`;
}

function getInstrumentKey(
  symbol: ScannerSymbol
): string | undefined {
  switch (symbol) {
    case "RELIANCE":
      return process.env
        .UPSTOX_RELIANCE_INSTRUMENT_KEY;

    case "HDFCBANK":
      return process.env
        .UPSTOX_HDFCBANK_INSTRUMENT_KEY;

    case "ICICIBANK":
      return process.env
        .UPSTOX_ICICIBANK_INSTRUMENT_KEY;

    case "SBIN":
      return process.env
        .UPSTOX_SBIN_INSTRUMENT_KEY;

    case "INFY":
      return process.env
        .UPSTOX_INFY_INSTRUMENT_KEY;
  }
}

function isScannerSymbol(
  value: string
): value is ScannerSymbol {
  return [
    "RELIANCE",
    "HDFCBANK",
    "ICICIBANK",
    "SBIN",
    "INFY",
  ].includes(
    value
  );
}

export async function GET(
  request: NextRequest
) {
  try {
    // =====================================
    // CONFIG
    // =====================================

    const accessToken =
      process.env
        .UPSTOX_ACCESS_TOKEN;

    if (!accessToken) {
      throw new Error(
        "UPSTOX_ACCESS_TOKEN is missing."
      );
    }

    // =====================================
    // SYMBOL
    // =====================================

    const requestedSymbol =
      (
        request.nextUrl
          .searchParams
          .get("symbol") ??
        ""
      )
        .trim()
        .toUpperCase();

    if (
      !isScannerSymbol(
        requestedSymbol
      )
    ) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            "Invalid scanner symbol.",

          supportedSymbols: [
            "RELIANCE",
            "HDFCBANK",
            "ICICIBANK",
            "SBIN",
            "INFY",
          ],
        },
        {
          status:
            400,
        }
      );
    }

    const symbol =
      requestedSymbol;

    const instrumentKey =
      getInstrumentKey(
        symbol
      );

    if (!instrumentKey) {
      throw new Error(
        `Instrument key is missing for ${symbol}.`
      );
    }

    // =====================================
    // DATES
    // =====================================

    const now =
      new Date();

    const yesterday =
      new Date(
        now.getTime() -
          24 *
            60 *
            60 *
            1000
      );

    const historyStart =
      new Date(
        now.getTime() -
          10 *
            24 *
            60 *
            60 *
            1000
      );

    const historicalTo =
      formatISTDate(
        yesterday
      );

    const historicalFrom =
      formatISTDate(
        historyStart
      );

    // =====================================
    // URLS
    // =====================================

    const encodedInstrument =
      encodeURIComponent(
        instrumentKey
      );

    const intradayUrl =
      `https://api.upstox.com/v3/historical-candle/intraday/${encodedInstrument}/minutes/1`;

    const historicalUrl =
      `https://api.upstox.com/v3/historical-candle/${encodedInstrument}/minutes/1/${historicalTo}/${historicalFrom}`;

    const headers = {
      Accept:
        "application/json",

      Authorization:
        `Bearer ${accessToken}`,
    };

    // =====================================
    // FETCH STOCK CANDLES
    // =====================================

    const [
      intradayResponse,
      historicalResponse,
    ] =
      await Promise.all([
        fetch(
          intradayUrl,
          {
            headers,
            cache:
              "no-store",
          }
        ),

        fetch(
          historicalUrl,
          {
            headers,
            cache:
              "no-store",
          }
        ),
      ]);

    const [
      intradayJson,
      historicalJson,
    ] =
      await Promise.all([
        intradayResponse.json(),
        historicalResponse.json(),
      ]);

    // =====================================
    // VALIDATE RESPONSES
    // =====================================

    if (
      !intradayResponse.ok
    ) {
      console.error(
        `UPSTOX ${symbol} INTRADAY ERROR:`,
        intradayJson
      );

      throw new Error(
        `${symbol} intraday request failed (${intradayResponse.status}).`
      );
    }

    if (
      !historicalResponse.ok
    ) {
      console.error(
        `UPSTOX ${symbol} HISTORICAL ERROR:`,
        historicalJson
      );

      throw new Error(
        `${symbol} historical request failed (${historicalResponse.status}).`
      );
    }

    // =====================================
    // NORMALIZE 1m
    // =====================================

    const historicalRaw:
      any[][] =
      historicalJson?.data
        ?.candles ?? [];

    const intradayRaw:
      any[][] =
      intradayJson?.data
        ?.candles ?? [];

    const historical1m =
      sortCandles(
        historicalRaw.map(
          normalizeUpstoxCandle
        )
      );

    const currentSession1m =
      sortCandles(
        intradayRaw.map(
          normalizeUpstoxCandle
        )
      );

    // =====================================
    // COMPLETED CURRENT 1m
    // =====================================

    const completed1mCutoff =
      Date.now() -
      60 * 1000;

    const completedCurrent1m =
      currentSession1m.filter(
        candle =>
          new Date(
            candle.time
          ).getTime() <=
          completed1mCutoff
      );

    // =====================================
    // BUILD 5m
    // =====================================

    const historical5m =
      build5mCandles(
        historical1m
      );

    const current5m =
      build5mCandles(
        completedCurrent1m
      );

    // =====================================
    // WARMUP
    // =====================================

    const warmup1m =
      historical1m.slice(
        -375
      );

    const warmup5m =
      historical5m.slice(
        -75
      );

    const candles1m = [
      ...warmup1m,
      ...completedCurrent1m,
    ];

    const candles5m = [
      ...warmup5m,
      ...current5m,
    ];

    // =====================================
    // RESPONSE
    // =====================================

    return NextResponse.json({
      success:
        true,

      source:
        "UPSTOX",

      symbol,

      instrumentKey,

      candles1m,

      candles5m,

      diagnostics: {
        historical1m:
          historical1m.length,

        currentSession1m:
          currentSession1m.length,

        completedCurrent1m:
          completedCurrent1m.length,

        warmup1m:
          warmup1m.length,

        warmup5m:
          warmup5m.length,

        current5m:
          current5m.length,

        total1m:
          candles1m.length,

        total5m:
          candles5m.length,
      },
    });
  } catch (error) {
    console.error(
      "MARKET SCANNER ERROR:",
      error
    );

    return NextResponse.json(
      {
        success:
          false,

        source:
          "UPSTOX",

        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch scanner market data.",
      },
      {
        status:
          500,
      }
    );
  }
}