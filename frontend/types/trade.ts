export type TradeAction =
  | "BUY"
  | "SELL";

export type TradeStatus =
  | "PENDING"
  | "ACTIVE"
  | "TARGET 1 HIT"
  | "CLOSED";

export type TradeResult =
  | "WIN"
  | "LOSS"
  | "NONE";

export type TradeUrgency =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export interface Trade {

  id: string;

  action: TradeAction;

  entry: number;

  currentPrice: number;

  stopLoss: number;

  target1: number;

  target2: number;

  pnl: number;

  confidence: number;

  urgency: TradeUrgency;

  status: TradeStatus;

  result: TradeResult;

  openedAt?: Date;

  closedAt?: Date;

  target1Hit: boolean;

target2Hit: boolean;

}