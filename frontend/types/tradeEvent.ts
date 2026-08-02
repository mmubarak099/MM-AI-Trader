export type TradeEventType =
  | "TRADE_CREATED"
  | "TRADE_OPENED"
  | "TARGET1_HIT"
  | "PARTIAL_PROFIT_BOOKED"
  | "BREAK_EVEN_ENABLED"
  | "TARGET2_HIT"
  | "STOP_LOSS_HIT"
  | "TRADE_CLOSED";

export interface TradeEvent {
  id: string;

  type: TradeEventType;

  timestamp: Date;

  price: number;

  description: string;
}