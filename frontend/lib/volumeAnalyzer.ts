export function analyzeVolume(
  volumes: number[]
) {
  if (volumes.length < 20) {
    return "NORMAL";
  }

  const lastVolume =
    volumes[volumes.length - 1];

  const averageVolume =
    volumes
      .slice(-20)
      .reduce((a, b) => a + b, 0) / 20;

  if (lastVolume >= averageVolume * 1.5) {
    return "HIGH";
  }

  if (lastVolume <= averageVolume * 0.7) {
    return "LOW";
  }

  return "NORMAL";
}