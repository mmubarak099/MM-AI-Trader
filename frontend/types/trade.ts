export type TradeStatus =
  | "PENDING"
  | "ACTIVE"
  | "CLOSED";

export type TradeResult =
  | "WIN"
  | "LOSS"
  | "NONE";

export interface Trade {

  id: string;

  action: "BUY" | "SELL";

  entry: number;

  stopLoss: number;

  target1: number;

  target2: number;

  currentPrice: number;

  pnl: number;

  confidence: number;

  urgency: string;

  openedAt: Date;

  closedAt?: Date;

  status: TradeStatus;

  result: TradeResult;

}