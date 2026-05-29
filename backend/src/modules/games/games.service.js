import { prisma } from '../../config/prisma.js';

export class GamesService {
  async findMany(where, orderBy) {
    return prisma.game.findMany({ where, orderBy });
  }

  async findFirst(where) {
    return prisma.game.findFirst({ where });
  }

  async create(data) {
    return prisma.game.create({ data });
  }

  async update(id, data) {
    return prisma.game.update({ where: { id }, data });
  }

  async delete(id) {
    return prisma.game.delete({ where: { id } });
  }
}
