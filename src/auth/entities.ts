import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities';

export class LoginRequestEntity {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}

export class LoginResponseEntity {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  user: UserEntity;
}

export class RefreshTokenEntity {
  @ApiProperty()
  refreshToken: string;
}
