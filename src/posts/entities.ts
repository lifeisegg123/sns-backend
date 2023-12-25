import { ApiProperty } from '@nestjs/swagger';
import { CommentEntity } from 'src/comments/entities';

class AuthorEntity {
  @ApiProperty()
  nickname: string;
}

export class PostEntity {
  @ApiProperty()
  'id': string;
  @ApiProperty()
  'title': string;
  @ApiProperty()
  'desc': string;
  @ApiProperty()
  'authorId': string;
  @ApiProperty({
    type: [CommentEntity],
  })
  'comments': CommentEntity[];
  @ApiProperty({ type: AuthorEntity })
  'author': AuthorEntity;
}
