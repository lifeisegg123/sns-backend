import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  create(createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data: createPostDto,
      select: {
        id: true,
        desc: true,
        authorId: true,
        comments: {
          select: {
            id: true,
            desc: true,
            commenter: {
              select: {
                id: true,
                nickname: true,
              },
            },
          },
        },
        author: {
          select: {
            nickname: true,
          },
        },
      },
    });
  }

  find(take: number, lastItemId?: string) {
    return this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      cursor: lastItemId && { id: lastItemId },
      take,
      skip: lastItemId ? 1 : 0,
      select: {
        id: true,
        desc: true,
        authorId: true,
        comments: {
          select: {
            id: true,
            desc: true,
            commenter: {
              select: {
                id: true,
                nickname: true,
              },
            },
          },
        },
        author: {
          select: {
            nickname: true,
          },
        },
      },
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: string) {
    return this.prisma.post.updateMany({
      data: updatePostDto,
      where: { id, authorId: userId },
    });
  }
}
