export interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface SignalHistory {
  action: string;
  confidence: number;
  pattern: string;
  candleIndex: number;
}

export interface PatternHistory {
  type: string;
  candleIndex: number;
}

export interface SupportResistance {
  support: number[];
  resistance: number[];
}