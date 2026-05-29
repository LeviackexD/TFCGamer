import { z } from 'zod';
import { GamesUseCases } from './games.useCases.js';
import { createGameSchema, updateGameSchema, completeGameSchema, listGamesQuerySchema } from './games.schemas.js';

const gamesUseCases = new GamesUseCases();

const idParamSchema = z.coerce.number().positive('El ID debe ser un número positivo');

function parseId(req) {
  const { id } = req.params;
  return idParamSchema.parse(id);
}

export const gamesController = {
  async listGames(req, res, next) {
    try {
      const filters = listGamesQuerySchema.parse(req.query);
      const games = await gamesUseCases.listGames(filters, req.user.id);
      res.json({ success: true, data: games });
    } catch (error) {
      next(error);
    }
  },

  async getGame(req, res, next) {
    try {
      const id = parseId(req);
      const game = await gamesUseCases.getGameById(id, req.user.id);
      res.json({ success: true, data: game });
    } catch (error) {
      next(error);
    }
  },

  async createGame(req, res, next) {
    try {
      const parsed = createGameSchema.parse(req.body);
      const game = await gamesUseCases.createGame(parsed, req.user.id);
      res.status(201).json({ success: true, data: game });
    } catch (error) {
      next(error);
    }
  },

  async updateGame(req, res, next) {
    try {
      const id = parseId(req);
      const parsed = updateGameSchema.parse(req.body);
      const game = await gamesUseCases.updateGame(id, parsed, req.user.id);
      res.json({ success: true, data: game });
    } catch (error) {
      next(error);
    }
  },

  async deleteGame(req, res, next) {
    try {
      const id = parseId(req);
      const result = await gamesUseCases.deleteGame(id, req.user.id);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async completeGame(req, res, next) {
    try {
      const id = parseId(req);
      const parsed = completeGameSchema.parse(req.body);
      const game = await gamesUseCases.completeGame(id, parsed, req.user.id);
      res.json({ success: true, data: game });
    } catch (error) {
      next(error);
    }
  },

  async uncompleteGame(req, res, next) {
    try {
      const id = parseId(req);
      const game = await gamesUseCases.uncompleteGame(id, req.user.id);
      res.json({ success: true, data: game });
    } catch (error) {
      next(error);
    }
  },
};
