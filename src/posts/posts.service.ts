import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  create(createPostDto: CreatePostDto) {
    return this.prisma.post.create({ data: createPostDto });
  }

  find(take: number, lastItemId?: string) {
    return this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      cursor: lastItemId && { id: lastItemId },
      take,
      skip: lastItemId ? 1 : 0,
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    return this.prisma.post.update({ data: updatePostDto, where: { id } });
  }
}
