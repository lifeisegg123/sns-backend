import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
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
    const result = await compare(password, user.password);
    if (result) {
      user.password = undefined;
      return user;
    }
    return null;
  }

  async login(user: any) {
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
    };
  }
}