export function calculatePriorityScore(metacriticScore, hoursToBeat) {
  if (hoursToBeat <= 0) {
    return 0;
  }

  return Number((metacriticScore / hoursToBeat).toFixed(2));
}
