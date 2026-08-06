export interface TradeSignal {

  id: string;

  action: "BUY" | "SELL";

  confidence: number;

  entry: number;

  stopLoss: number;

  target1: number;

  target2: number;

  urgency: string;

  status:
    | "ACTIVE"
    | "TAKEN"
    | "EXPIRED";

  createdAt: Date;

  expiresAt: Date;

}