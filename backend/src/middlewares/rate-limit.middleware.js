import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, message: 'Demasiadas solicitudes, inténtalo de nuevo en un minuto' },
  standardHeaders: true,
  legacyHeaders: false,
});
