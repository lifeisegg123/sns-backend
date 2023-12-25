import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty()
  email: string;
  @ApiProperty()
  id: string;
  @ApiProperty()
  nickname: string;
}

export class EmailEntity {
  @ApiProperty()
  usable: boolean;

  @ApiProperty()
  message: string;
}
