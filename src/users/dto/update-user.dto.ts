import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PickType(CreateUserDto, [
  'email',
  'nickname',
]) {
  @ApiProperty()
  email: string;

  @ApiProperty()
  nickname: string;
}
