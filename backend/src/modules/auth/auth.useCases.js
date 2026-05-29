import bcrypt from 'bcrypt';
import { AuthService } from './auth.service.js';
import { signToken } from '../../utils/jwt.js';
import { ConflictError, NotFoundError, UnauthorizedError } from '../../lib/errors.js';

const authService = new AuthService();

export class AuthUseCases {
  async register(input) {
    const existing = await authService.findByEmail(input.email);

    if (existing) {
      throw new ConflictError('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    const user = await authService.createUser({
      email: input.email,
      password: hashedPassword,
      alias: input.alias,
    });

    const token = signToken({ id: user.id, email: user.email, alias: user.alias });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        alias: user.alias,
      },
    };
  }

  async login(input) {
    const user = await authService.findByEmail(input.email);

    if (!user) {
      throw new UnauthorizedError('Credenciales incorrectas');
    }

    const validPassword = await bcrypt.compare(input.password, user.password);

    if (!validPassword) {
      throw new UnauthorizedError('Credenciales incorrectas');
    }

    const token = signToken({ id: user.id, email: user.email, alias: user.alias });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        alias: user.alias,
      },
    };
  }

  async getProfile(userId) {
    const user = await authService.findById(userId);

    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    return {
      id: user.id,
      email: user.email,
      alias: user.alias,
      createdAt: user.createdAt.toISOString(),
    };
  }

  async getStats(userId) {
    const user = await authService.findById(userId);
    if (!user) throw new NotFoundError('Usuario no encontrado');

    const games = await authService.getUserGames(userId);

    const totalGames = games.length;
    const completedGames = games.filter(g => g.completed).length;

    const totalHours = games.reduce((sum, g) => sum + g.hoursToBeat, 0);

    const ratedGames = games.filter(g => g.rating);
    const averageRating = ratedGames.length
      ? Number((ratedGames.reduce((sum, g) => sum + g.rating, 0) / ratedGames.length).toFixed(1))
      : 0;

    const completionRate = totalGames
      ? Number(((completedGames / totalGames) * 100).toFixed(1))
      : 0;

    const level = Math.floor(completedGames / 3) + 1;
    const xpPercent = totalGames
      ? Math.round(((completedGames % 3) / 3) * 100)
      : 0;

    const categoryCounts = {};
    games.forEach(g => {
      categoryCounts[g.category] = (categoryCounts[g.category] || 0) + 1;
    });
    const entries = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
    const topCategory = entries[0]?.[0] || 'Novato';

    const classMap = {
      'RPG': 'RPG Main',
      'Shooter': 'Shooter Elite',
      'Aventura': 'Aventurero',
      'Indie': 'Indie Devotee',
      'Puzle': 'Puzzle Master',
      'Plataformas': 'Platform King',
      'Metroidvania': 'Explorer',
    };
    const classTitle = classMap[topCategory] || `${topCategory} Expert`;

    const recentCompleted = games
      .filter(g => g.completed)
      .slice(0, 3)
      .map(g => ({
        name: g.name,
        rating: g.rating,
        hoursToBeat: g.hoursToBeat,
      }));

    const categoryBreakdown = entries.map(([category, count]) => ({
      category,
      count,
      percent: Number(((count / totalGames) * 100).toFixed(0)),
    }));

    return {
      user: { id: user.id, email: user.email, alias: user.alias },
      stats: {
        totalGames,
        completedGames,
        totalHours,
        averageRating,
        completionRate,
        level,
        xpPercent,
        classTitle,
        topCategory,
        recentCompleted,
        categoryBreakdown,
      },
    };
  }
}
