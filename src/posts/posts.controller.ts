import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostEntity } from './entities';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiResponse({ status: 200, type: PostEntity })
  @ApiBody({ type: CreatePostDto })
  create(
    @Body() createPostDto: Omit<CreatePostDto, 'authorId'>,
    @Request() req,
  ) {
    return this.postsService.create({
      ...createPostDto,
      authorId: req.user.userId,
    });
  }

  @Get()
  @ApiResponse({ status: 200, type: [PostEntity] })
  find(@Query('take') take: string, @Query('lastItemId') lastItemId?: string) {
    return this.postsService.find(+take, lastItemId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  @ApiResponse({ status: 200, type: [PostEntity] })
  findMyPosts(
    @Query('take') take: string,
    @Request() req,
    @Query('lastItemId') lastItemId?: string,
  ) {
    return this.postsService.findMy(+take, req.user.userId, lastItemId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiResponse({ status: 200, type: PostEntity })
  @ApiBody({ type: UpdatePostDto })
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ) {
    return this.postsService.update(id, updatePostDto, req.user.userId);
  }
}
