export function serializeGame(game) {
  return {
    ...game,
    completedAt: game.completedAt?.toISOString() ?? null,
  };
}
