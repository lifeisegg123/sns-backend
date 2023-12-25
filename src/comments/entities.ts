import { ApiProperty } from '@nestjs/swagger';

class CommenterEntity {
  @ApiProperty()
  id: string;
  @ApiProperty()
  nickname: string;
}

export class CommentEntity {
  @ApiProperty()
  'id': string;
  @ApiProperty()
  'desc': string;
  @ApiProperty({ type: CommenterEntity })
  'commenter': CommenterEntity;
  @ApiProperty()
  'postId': string;
  @ApiProperty()
  'createdAt': string;
  @ApiProperty()
  'updatedAt': string;
}
