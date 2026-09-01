import { NextResponse } from "next/server";

type MarketCandle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type UpstoxLtp = {
  last_price?: number;
  cp?: number;
  instrument_token?: string;
};

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
) {
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

    /*
      NSE 5m candles are anchored to
      the 09:15 IST session start.

      Because 09:15 itself is divisible
      by five, normal 5-minute clock
      bucketing gives:

      09:15-09:19
      09:20-09:24
      ...
    */
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

    buckets.set(key, group);
  }

  const candles5m:
    MarketCandle[] = [];

  for (const group of buckets.values()) {
    if (group.length !== 5) {
      continue;
    }

    const sorted =
      sortCandles(group);

    candles5m.push({
      time: sorted[0].time,

      open: sorted[0].open,

      high: Math.max(
        ...sorted.map(
          candle => candle.high
        )
      ),

      low: Math.min(
        ...sorted.map(
          candle => candle.low
        )
      ),

      close:
        sorted[
          sorted.length - 1
        ].close,

      volume:
        sorted.reduce(
          (total, candle) =>
            total + candle.volume,
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
    ).formatToParts(date);

  const year =
    parts.find(
      part =>
        part.type === "year"
    )?.value;

  const month =
    parts.find(
      part =>
        part.type === "month"
    )?.value;

  const day =
    parts.find(
      part =>
        part.type === "day"
    )?.value;

  return `${year}-${month}-${day}`;
}

function findQuote(
  data: Record<
    string,
    UpstoxLtp
  >,
  instrumentKey: string
): UpstoxLtp | null {
  /*
    Upstox response object keys may use
    a display-style separator while
    instrument_token contains the exact
    instrument key.

    Match instrument_token first.
  */
  for (
    const quote of
      Object.values(data)
  ) {
    if (
      quote?.instrument_token ===
      instrumentKey
    ) {
      return quote;
    }
  }

  /*
    Fallback for response keys such as:
    NSE_INDEX:Nifty 50
  */
  const alternateKey =
    instrumentKey.replace(
      "|",
      ":"
    );

  return (
    data[instrumentKey] ??
    data[alternateKey] ??
    null
  );
}

export async function GET() {
  try {
    // =====================================
    // CONFIG
    // =====================================

    const accessToken =
      process.env
        .UPSTOX_ACCESS_TOKEN;

    const niftyInstrumentKey =
      process.env
        .UPSTOX_NIFTY_INSTRUMENT_KEY;

    const bankNiftyInstrumentKey =
      process.env
        .UPSTOX_BANKNIFTY_INSTRUMENT_KEY;

    const relianceInstrumentKey =
  process.env
    .UPSTOX_RELIANCE_INSTRUMENT_KEY;

const hdfcBankInstrumentKey =
  process.env
    .UPSTOX_HDFCBANK_INSTRUMENT_KEY;

const iciciBankInstrumentKey =
  process.env
    .UPSTOX_ICICIBANK_INSTRUMENT_KEY;

const sbinInstrumentKey =
  process.env
    .UPSTOX_SBIN_INSTRUMENT_KEY;

const infyInstrumentKey =
  process.env
    .UPSTOX_INFY_INSTRUMENT_KEY;

    if (!accessToken) {
      throw new Error(
        "UPSTOX_ACCESS_TOKEN is missing."
      );
    }

    if (!niftyInstrumentKey) {
      throw new Error(
        "UPSTOX_NIFTY_INSTRUMENT_KEY is missing."
      );
    }

    if (!bankNiftyInstrumentKey) {
      throw new Error(
        "UPSTOX_BANKNIFTY_INSTRUMENT_KEY is missing."
      );
    }

    if (!relianceInstrumentKey) {
  throw new Error(
    "UPSTOX_RELIANCE_INSTRUMENT_KEY is missing."
  );
}

if (!hdfcBankInstrumentKey) {
  throw new Error(
    "UPSTOX_HDFCBANK_INSTRUMENT_KEY is missing."
  );
}

if (!iciciBankInstrumentKey) {
  throw new Error(
    "UPSTOX_ICICIBANK_INSTRUMENT_KEY is missing."
  );
}

if (!sbinInstrumentKey) {
  throw new Error(
    "UPSTOX_SBIN_INSTRUMENT_KEY is missing."
  );
}

if (!infyInstrumentKey) {
  throw new Error(
    "UPSTOX_INFY_INSTRUMENT_KEY is missing."
  );
}

    // =====================================
    // DATES
    // =====================================

    const now =
      new Date();

    /*
      Historical warm-up deliberately
      ends before today.

      We request several calendar days
      because weekends/holidays can exist.
    */

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

    const encodedNifty =
      encodeURIComponent(
        niftyInstrumentKey
      );

const quoteInstrumentKeys =
  encodeURIComponent(
    [
      niftyInstrumentKey,
      bankNiftyInstrumentKey,
      relianceInstrumentKey,
      hdfcBankInstrumentKey,
      iciciBankInstrumentKey,
      sbinInstrumentKey,
      infyInstrumentKey,
    ].join(",")
  );

    const ltpUrl =
      `https://api.upstox.com/v3/market-quote/ltp?instrument_key=${quoteInstrumentKeys}`;

    const intradayUrl =
      `https://api.upstox.com/v3/historical-candle/intraday/${encodedNifty}/minutes/1`;

    const historicalUrl =
      `https://api.upstox.com/v3/historical-candle/${encodedNifty}/minutes/1/${historicalTo}/${historicalFrom}`;

    const headers = {
      Accept:
        "application/json",

      Authorization:
        `Bearer ${accessToken}`,
    };

    // =====================================
    // FETCH ALL UPSTOX DATA
    // =====================================

    const [
      ltpResponse,
      intradayResponse,
      historicalResponse,
    ] =
      await Promise.all([
        fetch(
          ltpUrl,
          {
            headers,
            cache:
              "no-store",
          }
        ),

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
      ltpJson,
      intradayJson,
      historicalJson,
    ] =
      await Promise.all([
        ltpResponse.json(),
        intradayResponse.json(),
        historicalResponse.json(),
      ]);

    // =====================================
    // VALIDATE UPSTOX RESPONSES
    // =====================================

    if (!ltpResponse.ok) {
      console.error(
        "UPSTOX LTP ERROR:",
        ltpJson
      );

      throw new Error(
        `Upstox LTP request failed (${ltpResponse.status}).`
      );
    }

    if (!intradayResponse.ok) {
      console.error(
        "UPSTOX INTRADAY ERROR:",
        intradayJson
      );

      throw new Error(
        `Upstox intraday request failed (${intradayResponse.status}).`
      );
    }

    if (!historicalResponse.ok) {
      console.error(
        "UPSTOX HISTORICAL ERROR:",
        historicalJson
      );

      throw new Error(
        `Upstox historical request failed (${historicalResponse.status}).`
      );
    }

    // =====================================
    // LIVE QUOTES
    // =====================================

    const ltpData:
      Record<
        string,
        UpstoxLtp
      > =
        ltpJson?.data ?? {};

    const niftyQuote =
      findQuote(
        ltpData,
        niftyInstrumentKey
      );

    const bankNiftyQuote =
      findQuote(
        ltpData,
        bankNiftyInstrumentKey
      );

      const relianceQuote =
  findQuote(
    ltpData,
    relianceInstrumentKey
  );

const hdfcBankQuote =
  findQuote(
    ltpData,
    hdfcBankInstrumentKey
  );

const iciciBankQuote =
  findQuote(
    ltpData,
    iciciBankInstrumentKey
  );

const sbinQuote =
  findQuote(
    ltpData,
    sbinInstrumentKey
  );

const infyQuote =
  findQuote(
    ltpData,
    infyInstrumentKey
  );

    if (
      niftyQuote?.last_price ==
        null ||
      niftyQuote?.cp == null
    ) {
      console.error(
        "UPSTOX NIFTY QUOTE:",
        niftyQuote
      );

      throw new Error(
        "Valid NIFTY LTP was not returned by Upstox."
      );
    }

    if (
      bankNiftyQuote?.last_price ==
        null ||
      bankNiftyQuote?.cp == null
    ) {
      console.error(
        "UPSTOX BANK NIFTY QUOTE:",
        bankNiftyQuote
      );

      throw new Error(
        "Valid BANK NIFTY LTP was not returned by Upstox."
      );
    }

    const niftyPrice =
      Number(
        niftyQuote.last_price
      );

    const niftyPreviousClose =
      Number(
        niftyQuote.cp
      );

    const niftyChange =
      niftyPrice -
      niftyPreviousClose;

    const niftyChangePercent =
      niftyPreviousClose !== 0
        ? (
            niftyChange /
            niftyPreviousClose
          ) * 100
        : 0;

    const bankNiftyPrice =
      Number(
        bankNiftyQuote.last_price
      );

    const bankNiftyPreviousClose =
      Number(
        bankNiftyQuote.cp
      );

    const bankNiftyChange =
      bankNiftyPrice -
      bankNiftyPreviousClose;

    const bankNiftyChangePercent =
      bankNiftyPreviousClose !==
      0
        ? (
            bankNiftyChange /
            bankNiftyPreviousClose
          ) * 100
        : 0;

    // =====================================
    // NORMALIZE CANDLES
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
    // COMPLETED CURRENT 1m CANDLES
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
    // BUILD 5m PER DATASET
    //
    // IMPORTANT:
    // Historical and today's session are
    // aggregated separately so a candle
    // can never cross session boundaries.
    // =====================================

    const historical5m =
      build5mCandles(
        historical1m
      );

    const current5m =
      build5mCandles(
        completedCurrent1m
      );

    /*
      Keep enough previous-session history
      for EMA50 / MACD / RSI / MTF,
      then append today's completed data.
    */

    const warmup1m =
      historical1m.slice(
        -375
      );

    const warmup5m =
      historical5m.slice(
        -75
      );

    const niftyCandles1m = [
      ...warmup1m,
      ...completedCurrent1m,
    ];

    const niftyCandles = [
      ...warmup5m,
      ...current5m,
    ];

    // =====================================
    // RESPONSE
    //
    // Preserve the existing response shape
    // consumed by page.tsx.
    // =====================================

    return NextResponse.json({
      success:
        true,

      source:
        "UPSTOX",

      nifty: {
        symbol:
          "NIFTY 50",

        price:
          niftyPrice,

        previousClose:
          niftyPreviousClose,

        change:
          niftyChange,

        changePercent:
          niftyChangePercent,

        time:
          Date.now(),
      },

      bankNifty: {
        symbol:
          "BANK NIFTY",

        price:
          bankNiftyPrice,

        previousClose:
          bankNiftyPreviousClose,

        change:
          bankNiftyChange,

        changePercent:
          bankNiftyChangePercent,

        time:
          Date.now(),
      },

      scanner: {
  reliance: {
    symbol: "RELIANCE",
    price:
      relianceQuote?.last_price ??
      null,
  },

  hdfcBank: {
    symbol: "HDFCBANK",
    price:
      hdfcBankQuote?.last_price ??
      null,
  },

  iciciBank: {
    symbol: "ICICIBANK",
    price:
      iciciBankQuote?.last_price ??
      null,
  },

  sbin: {
    symbol: "SBIN",
    price:
      sbinQuote?.last_price ??
      null,
  },

  infy: {
    symbol: "INFY",
    price:
      infyQuote?.last_price ??
      null,
  },
},

      niftyCandles,

      niftyCandles1m,

      diagnostics: {
        source:
          "UPSTOX",

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
          niftyCandles1m.length,

        total5m:
          niftyCandles.length,
      },
    });
  } catch (error) {
    console.error(
      "REAL MARKET DATA ERROR:",
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
            : "Failed to fetch REAL market data.",
      },
      {
        status:
          500,
      }
    );
  }
}