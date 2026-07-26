import { Candle } from "./candle";
import { Signal } from "./signal";

export type ChartPoint = {
  candle: Candle;

  ema20: number | null;
  ema50: number | null;

  rsi: number | null;
  macd: number | null;
  vwap: number | null;

  signal?: Signal;
};