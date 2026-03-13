export function safeDivide(numerator: number, denominator: number) {
  return numerator / (denominator || 1);
}

export function roundTo(value: number, digits = 2) {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(digits));
}

export function formatFixed(value: number, digits = 1) {
  return roundTo(value, digits).toFixed(digits);
}

export function formatPercent(value: number, digits = 1) {
  const normalized = Math.abs(value) <= 1 ? value * 100 : value;
  return `${formatFixed(normalized, digits)}%`;
}

export function calcTsPercent(points: number, fieldGoalAttempts: number, freeThrowAttempts: number) {
  return roundTo(safeDivide(points, 2 * (fieldGoalAttempts + 0.44 * freeThrowAttempts)) * 100);
}

export function calcEfgPercent(
  fieldGoalsMade: number,
  threesMade: number,
  fieldGoalAttempts: number,
) {
  return roundTo(safeDivide(fieldGoalsMade + 0.5 * threesMade, fieldGoalAttempts) * 100);
}

export function calcRate(numerator: number, denominator: number) {
  return roundTo(safeDivide(numerator, denominator) * 100);
}

export function calcRatio(numerator: number, denominator: number) {
  return roundTo(safeDivide(numerator, denominator));
}

export function calcTwoPointMakes(fieldGoalsMade: number, threesMade: number) {
  return Math.max(fieldGoalsMade - threesMade, 0);
}

export function calcTwoPointAttempts(fieldGoalAttempts: number, threePointAttempts: number) {
  return Math.max(fieldGoalAttempts - threePointAttempts, 0);
}

export function calcTwoPointPercent(
  fieldGoalsMade: number,
  threesMade: number,
  fieldGoalAttempts: number,
  threePointAttempts: number,
) {
  const twoPointMakes = calcTwoPointMakes(fieldGoalsMade, threesMade);
  const twoPointAttempts = calcTwoPointAttempts(fieldGoalAttempts, threePointAttempts);
  return roundTo(safeDivide(twoPointMakes, twoPointAttempts) * 100);
}

export function calcTwoPointAttemptRate(fieldGoalAttempts: number, threePointAttempts: number) {
  const twoPointAttempts = calcTwoPointAttempts(fieldGoalAttempts, threePointAttempts);
  return roundTo(safeDivide(twoPointAttempts, fieldGoalAttempts) * 100);
}

export function calcTurnoverRateProxy(
  turnovers: number,
  fieldGoalAttempts: number,
  freeThrowAttempts: number,
) {
  return roundTo(
    safeDivide(turnovers, fieldGoalAttempts + 0.44 * freeThrowAttempts + turnovers) * 100,
  );
}

export function calcPointsPerShotAttempt(
  points: number,
  fieldGoalAttempts: number,
  freeThrowAttempts: number,
) {
  return roundTo(safeDivide(points, fieldGoalAttempts + 0.44 * freeThrowAttempts));
}

export function calcShotDiet(
  fieldGoalsMade: number,
  threesMade: number,
  freeThrowsMade: number,
) {
  const twoPointPoints = Math.max(calcTwoPointMakes(fieldGoalsMade, threesMade) * 2, 0);
  const threePointPoints = threesMade * 3;
  const freeThrowPoints = freeThrowsMade;
  const totalPoints = twoPointPoints + threePointPoints + freeThrowPoints;

  return {
    twoPointPoints,
    threePointPoints,
    freeThrowPoints,
    twoPointShare: roundTo(safeDivide(twoPointPoints, totalPoints) * 100),
    threePointShare: roundTo(safeDivide(threePointPoints, totalPoints) * 100),
    freeThrowShare: roundTo(safeDivide(freeThrowPoints, totalPoints) * 100),
  };
}

export function calcGameScore(
  points: number,
  fieldGoalsMade: number,
  fieldGoalAttempts: number,
  freeThrowsMade: number,
  freeThrowAttempts: number,
  rebounds: number,
  assists: number,
  steals: number,
  blocks: number,
  personalFouls: number,
  turnovers: number,
) {
  return roundTo(
    points +
      0.4 * fieldGoalsMade -
      0.7 * fieldGoalAttempts -
      0.4 * (freeThrowAttempts - freeThrowsMade) +
      0.7 * rebounds +
      0.7 * assists +
      steals +
      0.7 * blocks -
      0.4 * personalFouls -
      turnovers,
  );
}

export function calcMedian(values: number[]) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? roundTo((sorted[mid - 1] + sorted[mid]) / 2)
    : roundTo(sorted[mid]);
}

export function calcStdDev(values: number[]) {
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  return roundTo(Math.sqrt(variance));
}
