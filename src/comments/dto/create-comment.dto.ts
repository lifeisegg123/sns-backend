import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  desc: string;

  @ApiProperty()
  @IsUUID()
  postId: string;
}
