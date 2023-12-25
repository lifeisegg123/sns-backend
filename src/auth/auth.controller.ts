import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  LoginRequestEntity,
  LoginResponseEntity,
  RefreshTokenEntity,
} from './entities';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiResponse({ status: 200, type: LoginResponseEntity })
  @ApiBody({ type: LoginRequestEntity })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('access-token')
  @ApiResponse({ status: 200, type: LoginResponseEntity })
  @ApiBody({ type: RefreshTokenEntity })
  async getAccessToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.getAccessToken(refreshToken);
  }
}
