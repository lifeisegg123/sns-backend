import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { compare } from 'bcrypt';
import { getUserWithoutAuthInfo } from 'src/utils/getUserWithoutAuthInfo';
import { UsersService } from '../users/users.service';

const DAY_IN_SEC = 86400;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user)
      throw new BadRequestException('이메일 정보가 올바르지 않습니다.');
    const result = await compare(password, user.password);
    if (result) {
      user.password = undefined;
      return user;
    }
    throw new BadRequestException('비밀번호가 올바르지 않습니다.');
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '1w' });
    await this.usersService.setRefreshToken(user.id, refreshToken);
    user.refreshToken = undefined;
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '1h' }),
      refreshToken,
      user,
    };
  }

  async getAccessToken(refreshToken: string) {
    const token = this.jwtService.verify(refreshToken, { clockTimestamp: 1 });

    const user = await this.usersService.findByEmail(token.email);

    if (user.refreshToken !== refreshToken) {
      throw new Error('Refresh token is invalid');
    }

    const now = new Date().getTime() / 1000;
    const payload = { email: user.email, sub: user.id };
    if (token.exp - now < DAY_IN_SEC) {
      refreshToken = this.jwtService.sign(payload, { expiresIn: '1w' });
      await this.usersService.setRefreshToken(user.id, refreshToken);
    }

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    return {
      accessToken,
      refreshToken,
      user: getUserWithoutAuthInfo(user),
    };
  }
}
