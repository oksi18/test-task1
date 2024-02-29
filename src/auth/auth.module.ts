import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../database/prisma/prisma.service';
import { TokenService } from '../token/token.service';
import { TokenModule } from '../token/token.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, TokenService],
})
export class AuthModule {}
