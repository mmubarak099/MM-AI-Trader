export interface TradeSignal {

  id: string;

  action: "BUY" | "SELL";

  confidence: number;

  entry: number;

  trend: string;

  marketCondition: string;

  riskLevel: string;

  advice: string;

  stopLoss: number;

  target1: number;

  target2: number;

  urgency: string;

  riskRewardRatio: number;

  confirmationCount: number;

  status:
    | "ACTIVE"
    | "TAKEN"
    | "EXPIRED";

  createdAt: Date;

  expiresAt: Date;

  pattern: string;

  marketStructure: string;

  breakout: string;

  volumeStrength: string;
}