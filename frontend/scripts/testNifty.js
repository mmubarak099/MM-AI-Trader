const YahooFinance =
  require("yahoo-finance2").default;

const yahooFinance =
  new YahooFinance({
    suppressNotices: ["yahooSurvey"],
  });

async function testMarketData() {
  try {

    const nifty =
      await yahooFinance.quote("^NSEI");

    const bankNifty =
      await yahooFinance.quote("^NSEBANK");

    console.log("\n===== NIFTY 50 =====\n");

    console.log({
      symbol: nifty.symbol,
      price: nifty.regularMarketPrice,
      previousClose:
        nifty.regularMarketPreviousClose,
      change:
        nifty.regularMarketChange,
      changePercent:
        nifty.regularMarketChangePercent,
      time:
        nifty.regularMarketTime,
    });


    console.log(
      "\n===== BANK NIFTY =====\n"
    );

    console.log({
      symbol: bankNifty.symbol,
      price:
        bankNifty.regularMarketPrice,
      previousClose:
        bankNifty.regularMarketPreviousClose,
      change:
        bankNifty.regularMarketChange,
      changePercent:
        bankNifty.regularMarketChangePercent,
      time:
        bankNifty.regularMarketTime,
    });

  } catch (error) {

    console.error(
      "ERROR:",
      error
    );

  }
}

testMarketData();