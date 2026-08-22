// ==========================================
// Replay Engine
// ==========================================

export type ReplayCandle = {
  time: Date | string;

  open: number;
  high: number;
  low: number;
  close: number;

  volume?: number;
};


// ==========================================
// Replay State
// ==========================================

export type ReplayState = {
  candles: ReplayCandle[];

  currentIndex: number;

  running: boolean;

  completed: boolean;
};


// ==========================================
// Create Replay State
// ==========================================

export function createReplayState(
  candles: ReplayCandle[]
): ReplayState {

  return {
    candles,

    currentIndex: 0,

    running: false,

    completed:
      candles.length === 0,
  };
}


// ==========================================
// Start Replay
// ==========================================

export function startReplay(
  state: ReplayState
): ReplayState {

  if (
    state.completed ||
    state.candles.length === 0
  ) {
    return state;
  }

  return {
    ...state,

    running: true,
  };
}


// ==========================================
// Pause Replay
// ==========================================

export function pauseReplay(
  state: ReplayState
): ReplayState {

  return {
    ...state,

    running: false,
  };
}


// ==========================================
// Reset Replay
// ==========================================

export function resetReplay(
  state: ReplayState
): ReplayState {

  return {
    ...state,

    currentIndex: 0,

    running: false,

    completed:
      state.candles.length === 0,
  };
}


// ==========================================
// Step Replay Forward
// ==========================================

export function stepReplay(
  state: ReplayState
): ReplayState {

  if (
    state.completed ||
    state.candles.length === 0
  ) {
    return state;
  }

  const nextIndex =
    state.currentIndex + 1;

  if (
    nextIndex >=
    state.candles.length
  ) {

    return {
      ...state,

      currentIndex:
        state.candles.length - 1,

      running: false,

      completed: true,
    };
  }

  return {
    ...state,

    currentIndex:
      nextIndex,
  };
}


// ==========================================
// Current Replay Candle
// ==========================================

export function getReplayCurrentCandle(
  state: ReplayState
): ReplayCandle | null {

  if (
    state.candles.length === 0
  ) {
    return null;
  }

  return (
    state.candles[
      state.currentIndex
    ] ?? null
  );
}


// ==========================================
// Replay Candle History
// ==========================================

export function getReplayCandlesSoFar(
  state: ReplayState
): ReplayCandle[] {

  if (
    state.candles.length === 0
  ) {
    return [];
  }

  return state.candles.slice(
    0,
    state.currentIndex + 1
  );
}


// ==========================================
// Replay Progress
// ==========================================

export function getReplayProgress(
  state: ReplayState
): number {

  if (
    state.candles.length === 0
  ) {
    return 0;
  }

  if (
    state.candles.length === 1
  ) {
    return 100;
  }

  const progress =
    (
      state.currentIndex /
      (state.candles.length - 1)
    ) *
    100;

  return Number(
    progress.toFixed(2)
  );
}


// ==========================================
// Replay Current Price
// ==========================================

export function getReplayCurrentPrice(
  state: ReplayState
): number | null {

  const candle =
    getReplayCurrentCandle(
      state
    );

  if (!candle) {
    return null;
  }

  return candle.close;
}