import { IsString, IsUUID } from 'class-validator';

export class CreatePostDto {
  @IsString()
  desc: string;

  @IsUUID()
  authorId: string;
}
