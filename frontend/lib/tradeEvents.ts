import type {
  TradeEvent,
  TradeEventType,
} from "../types/tradeEvent";

export function createTradeEvent(
  type: TradeEventType,
  price: number,
  description: string
): TradeEvent {
  return {
    id: crypto.randomUUID(),
    type,
    timestamp: new Date(),
    price,
    description,
  };
}