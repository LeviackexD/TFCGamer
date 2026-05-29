import { Router } from 'express';
import { gamesRouter } from '../modules/games/games.routes.js';
import { authRouter } from '../modules/auth/auth.routes.js';

export const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

router.use('/auth', authRouter);
router.use('/games', gamesRouter);
