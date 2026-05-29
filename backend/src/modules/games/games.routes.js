import { Router } from 'express';
import { gamesController } from './games.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

export const gamesRouter = Router();

gamesRouter.use(authMiddleware);

gamesRouter.get('/', gamesController.listGames);
gamesRouter.get('/:id', gamesController.getGame);
gamesRouter.post('/', gamesController.createGame);
gamesRouter.put('/:id', gamesController.updateGame);
gamesRouter.delete('/:id', gamesController.deleteGame);
gamesRouter.patch('/:id/complete', gamesController.completeGame);
gamesRouter.patch('/:id/uncomplete', gamesController.uncompleteGame);
