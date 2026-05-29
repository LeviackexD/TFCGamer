import { AuthUseCases } from './auth.useCases.js';
import { registerSchema, loginSchema } from './auth.schemas.js';

const authUseCases = new AuthUseCases();

export const authController = {
  async register(req, res, next) {
    try {
      const parsed = registerSchema.parse(req.body);
      const result = await authUseCases.register(parsed);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const parsed = loginSchema.parse(req.body);
      const result = await authUseCases.login(parsed);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async me(req, res, next) {
    try {
      const profile = await authUseCases.getProfile(req.user.id);
      res.json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  },

  async stats(req, res, next) {
    try {
      const data = await authUseCases.getStats(req.user.id);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
};
