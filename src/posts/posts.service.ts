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
        title: true,
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

  async find(take: number, lastItemId?: string) {
    const { id: lastId } = await this.prisma.post.findFirst({
      orderBy: { createdAt: 'asc' },
      select: { id: true },
    });
    const posts = await this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      cursor: lastItemId && { id: lastItemId },
      take,
      skip: lastItemId ? 1 : 0,
      select: {
        id: true,
        title: true,
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
    return {
      lastId,
      posts,
    };
  }

  async findMy(take: number, authorId: string, lastItemId?: string) {
    const { id: lastId } = await this.prisma.post.findFirst({
      orderBy: { createdAt: 'asc' },
      where: {
        authorId,
      },
      select: { id: true },
    });
    const posts = await this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      cursor: lastItemId && { id: lastItemId },
      where: {
        authorId,
      },
      take,
      skip: lastItemId ? 1 : 0,
      select: {
        id: true,
        title: true,
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
    return {
      lastId,
      posts,
    };
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: string) {
    return this.prisma.post.updateMany({
      data: updatePostDto,
      where: { id, authorId: userId },
    });
  }
}
