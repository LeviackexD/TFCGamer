import { prisma } from '../../config/prisma.js';

export class AuthService {
  async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }

  async createUser(data) {
    return prisma.user.create({ data });
  }

  async findById(id) {
    return prisma.user.findUnique({ where: { id } });
  }

  async getUserGames(userId) {
    return prisma.game.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
    });
  }
}
