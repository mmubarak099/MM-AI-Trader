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


  // ======================================
  // REAL VALIDATION
  // ======================================

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


  // ======================================
  // SIMULATOR VALIDATION
  // ======================================

  simulatorAction?:
    | "BUY"
    | "SELL"
    | "WAIT"
    | "WATCH";

  simulatorRiskLevel?: string;

  simulatorMarketCondition?: string;

  simulatorAdvice?: string;


  // ======================================
  // REPLAY VALIDATION
  // ======================================

  replayQualified?: boolean;

  replayQualifiedAction?:
    | "BUY"
    | "SELL"
    | "WAIT";

  replayV1Action?:
    | "BUY"
    | "SELL"
    | "WAIT"
    | "WATCH";

  replayMtfDirection?:
    | "BUY"
    | "SELL"
    | "WAIT";

  replayMtfEntryState?:
    | "READY"
    | "NOT_READY"
    | "EXTENDED";
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
      reason:
        "Locked signal is not executable.",
    };
  }


  if (
    !Number.isFinite(
      input.lockedEntry
    ) ||
    !Number.isFinite(
      input.currentPrice
    )
  ) {

    return {
      allowed: false,
      reason:
        "Entry or current price is invalid.",
    };
  }


  // ======================================
  // ENTRY DRIFT VALIDATION
  // Applies to ALL execution sources
  // ======================================

  const entryDrift =
    Math.abs(
      input.currentPrice -
      input.lockedEntry
    );


  const maxEntryDrift = 5;


  if (
    entryDrift >
    maxEntryDrift
  ) {

    return {
      allowed: false,

      reason:
        `Entry moved ${entryDrift.toFixed(
          2
        )} points from the locked signal. Maximum allowed drift is ${maxEntryDrift} points.`,
    };
  }


// ======================================
// REAL MARKET VALIDATION
// ======================================

if (input.source === "REAL") {

  const oppositeDirection =
    (
      input.lockedAction === "BUY" &&
      input.realV1Action === "SELL"
    ) ||
    (
      input.lockedAction === "SELL" &&
      input.realV1Action === "BUY"
    );

  if (oppositeDirection) {
    return {
      allowed: false,
      reason:
        "Real V1 direction is now opposite to the locked signal.",
    };
  }
}

// ======================================
// REPLAY VALIDATION
// ======================================

if (input.source === "REPLAY") {

  const oppositeDirection =
    (
      input.lockedAction === "BUY" &&
      input.replayV1Action === "SELL"
    ) ||
    (
      input.lockedAction === "SELL" &&
      input.replayV1Action === "BUY"
    );

  if (oppositeDirection) {
    return {
      allowed: false,
      reason:
        "Replay V1 direction is now opposite to the locked signal.",
    };
  }
}

// ======================================
// VALIDATION PASSED
// ======================================

return {
  allowed: true,
  reason:
    "Execution validation passed.",
};
}