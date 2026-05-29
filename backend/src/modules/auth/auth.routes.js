import { Router } from 'express';
import { authController } from './auth.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { authLimiter } from '../../middlewares/rate-limit.middleware.js';

export const authRouter = Router();

authRouter.get('/me', authMiddleware, authController.me);
authRouter.get('/stats', authMiddleware, authController.stats);
authRouter.post('/register', authLimiter, authController.register);
authRouter.post('/login', authLimiter, authController.login);
