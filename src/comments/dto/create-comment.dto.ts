import { IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  desc: string;

  @IsUUID()
  postId: string;
}
