import { Controller, Get, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('getAll/:id')
  getAll(@Param('id') userId: string) {
    return this.userService.getAll(userId);
  }

  @Put(':userId/changeUserBoss/:newBossId')
  async changeUserBoss(
    @Param('userId') userId: string,
    @Param('newBossId') newBossId: string,
  ) {
    return this.userService.changeUserBoss(userId, newBossId);
  }
  @Put(':userId/addToBoss/:bossId')
  async addUserToBoss(
    @Param('userId') userId: string,
    @Param('bossId') bossId: string,
  ): Promise<void> {
    return this.userService.addUserToBoss(userId, bossId);
  }
}
