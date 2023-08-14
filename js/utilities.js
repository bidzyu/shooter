export function cosBetweenTwoPoints(x1, y1, x2, y2) {
  const xDiff = x1 - x2;
  return xDiff / distanceBetweenTwoPoint(x1, y1, x2, y2);
}

export function sinBetweenTwoPoints(x1, y1, x2, y2) {
  const yDiff = y1 - y2;
  return yDiff / distanceBetweenTwoPoint(x1, y1, x2, y2);
}

export function distanceBetweenTwoPoint(x1, y1, x2, y2) {
  const xDiff = x1 - x2;
  const yDiff = y1 - y2;
  return Math.hypot(xDiff, yDiff);
}
