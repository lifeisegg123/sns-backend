import { IsString, IsUUID } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  desc: string;

  @IsUUID()
  authorId: string;
}
