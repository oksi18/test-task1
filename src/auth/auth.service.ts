import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);
    try {
      await this.prismaService.user.create({
        data: {
          name: registerUserDto.name,
          email: registerUserDto.email,
          password: hashedPassword,
          role: registerUserDto.role,
        },
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
    return HttpStatus.CREATED;
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: loginUserDto.email,
      },
    });

    const isMatched = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (isMatched) {
      const payload = {
        id: user.id,
        email: user.email,
      };
      return this.tokenService.generateJwtToken(payload);
    } else {
      throw new UnauthorizedException('Invalid email or password');
    }
  }
}
