import type {
  ReplayCandle,
} from "./replayEngine";


// ==========================================
// SAMPLE REPLAY DATA
// ==========================================
//
// This is temporary test data.
//
// Later we will replace this with real
// historical NIFTY candles collected from
// the market-data API.
//
// For now it lets us verify that Replay Mode
// can move through candles without depending
// on market hours.
// ==========================================

export const sampleReplayCandles: ReplayCandle[] = [

  {
    time: "2026-08-21T09:15:00+05:30",
    open: 24240,
    high: 24244,
    low: 24235,
    close: 24238,
    volume: 1000,
  },

  {
    time: "2026-08-21T09:20:00+05:30",
    open: 24238,
    high: 24241,
    low: 24230,
    close: 24232,
    volume: 1100,
  },

  {
    time: "2026-08-21T09:25:00+05:30",
    open: 24232,
    high: 24234,
    low: 24220,
    close: 24223,
    volume: 1250,
  },

  {
    time: "2026-08-21T09:30:00+05:30",
    open: 24223,
    high: 24225,
    low: 24208,
    close: 24210,
    volume: 1400,
  },

  {
    time: "2026-08-21T09:35:00+05:30",
    open: 24210,
    high: 24218,
    low: 24205,
    close: 24214,
    volume: 1350,
  },

  {
    time: "2026-08-21T09:40:00+05:30",
    open: 24214,
    high: 24228,
    low: 24212,
    close: 24225,
    volume: 1500,
  },

  {
    time: "2026-08-21T09:45:00+05:30",
    open: 24225,
    high: 24236,
    low: 24222,
    close: 24234,
    volume: 1550,
  },

  {
    time: "2026-08-21T09:50:00+05:30",
    open: 24234,
    high: 24248,
    low: 24231,
    close: 24245,
    volume: 1650,
  },

];