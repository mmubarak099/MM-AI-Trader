export type ExecutionValidationResult = {
  allowed: boolean;
  reason: string;
};

export type ExecutionSource =
  | "REAL"
  | "SIMULATOR"
  | "REPLAY";
  
  export type ExecutionValidationInput = {
  source: ExecutionSource;

  lockedAction:
    | "BUY"
    | "SELL";

  lockedEntry: number;

  currentPrice: number;

  // REAL validation
  realQualified?: boolean;
  realQualifiedAction?:
    | "BUY"
    | "SELL"
    | "WAIT";

  realV1Action?:
    | "BUY"
    | "SELL"
    | "WAIT"
    | "WATCH";

  mtfDirection?:
    | "BUY"
    | "SELL"
    | "WAIT";

  mtfEntryState?:
    | "READY"
    | "NOT_READY"
    | "EXTENDED";

  // SIMULATOR validation
  simulatorAction?:
    | "BUY"
    | "SELL"
    | "WAIT"
    | "WATCH";

  simulatorRiskLevel?: string;
  simulatorMarketCondition?: string;
  simulatorAdvice?: string;
};

export function validateExecution(
  input: ExecutionValidationInput
): ExecutionValidationResult {

  // ======================================
  // BASIC VALIDATION
  // ======================================

  if (
    input.lockedAction !== "BUY" &&
    input.lockedAction !== "SELL"
  ) {
    return {
      allowed: false,
      reason: "Locked signal is not executable.",
    };
  }

  if (
    !Number.isFinite(input.lockedEntry) ||
    !Number.isFinite(input.currentPrice)
  ) {
    return {
      allowed: false,
      reason: "Entry or current price is invalid.",
    };
  }

  const entryDrift =
  Math.abs(
    input.currentPrice -
    input.lockedEntry
  );

const maxEntryDrift = 5;

if (entryDrift > maxEntryDrift) {
  return {
    allowed: false,
    reason:
      `Entry moved ${entryDrift.toFixed(2)} points from the locked signal. Maximum allowed drift is ${maxEntryDrift} points.`,
  };
}

  // ======================================
  // REAL MARKET VALIDATION
  // ======================================

  if (input.source === "REAL") {

    if (input.realQualified !== true) {
      return {
        allowed: false,
        reason:
          "Real signal is no longer qualified.",
      };
    }

    if (
      input.realQualifiedAction !==
      input.lockedAction
    ) {
      return {
        allowed: false,
        reason:
          "Real qualified direction no longer matches the locked signal.",
      };
    }

    if (
      input.realV1Action !==
      input.lockedAction
    ) {
      return {
        allowed: false,
        reason:
          "Real V1 direction no longer matches the locked signal.",
      };
    }

    if (
      input.mtfDirection !==
      input.lockedAction
    ) {
      return {
        allowed: false,
        reason:
          "Multi-timeframe direction no longer matches the locked signal.",
      };
    }

    if (
      input.mtfEntryState !== "READY"
    ) {
      return {
        allowed: false,
        reason:
          "Multi-timeframe entry is no longer ready.",
      };
    }
  }


  // ======================================
  // SIMULATOR VALIDATION
  // ======================================

  if (input.source === "SIMULATOR") {

    const oppositeDirection =
      (
        input.lockedAction === "BUY" &&
        input.simulatorAction === "SELL"
      ) ||
      (
        input.lockedAction === "SELL" &&
        input.simulatorAction === "BUY"
      );

    if (oppositeDirection) {
      return {
        allowed: false,
        reason:
          "Simulator direction is now opposite to the locked signal.",
      };
    }

    const unsafeMarket =
      input.simulatorRiskLevel === "High" ||
      input.simulatorMarketCondition ===
        "Sideways Market" ||
      input.simulatorAdvice ===
        "Wait for a clearer setup";

    if (unsafeMarket) {
      return {
        allowed: false,
        reason:
          "Simulator market conditions are no longer suitable.",
      };
    }
  }


  // ======================================
  // VALIDATION PASSED
  // ======================================

  return {
    allowed: true,
    reason: "Execution validation passed.",
  };
}