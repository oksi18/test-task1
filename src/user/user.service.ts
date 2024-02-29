import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async getAll(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }

    if (user.role === 'ADMIN') {
      return this.prismaService.user.findMany();
    } else if (user.role === 'BOSS') {
      return this.prismaService.user.findMany({
        where: { OR: [{ id: userId }, { bossId: userId }] },
      });
    } else {
      return [user];
    }
  }

  async addUserToBoss(userId: string, bossId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    const boss = await this.prismaService.user.findUnique({
      where: { id: bossId },
    });
    if (!user || !boss) {
      throw new Error('User or boss not found');
    }

    if (user.role !== 'USER' || boss.role !== 'BOSS') {
      throw new Error('User must have role USER and boss must have role BOSS');
    }

    await this.prismaService.user.update({
      where: { id: userId },
      data: { bossId },
    });
  }

  async changeUserBoss(userId: string, newBossId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const newBoss = await this.prismaService.user.findUnique({
      where: { id: newBossId },
    });
    if (!newBoss) {
      throw new NotFoundException('New boss not found');
    }

    await this.prismaService.user.update({
      where: { id: userId },
      data: { bossId: newBossId },
    });
  }
}
// Your question: So I will be able to see password, right? -> No, because all passwords are hashed
