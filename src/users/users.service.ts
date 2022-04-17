import { BadRequestException, Injectable } from '@nestjs/common';
import { hashSync } from 'bcrypt';

import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const password = hashSync(createUserDto.password, 12);
    const user = await this.prisma.user.create({
      data: { ...createUserDto, password },
    });

    user.password = undefined;
    return user;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new BadRequestException('해당하는 유저를 찾을 수 없습니다.');
    }
    user.password = undefined;
    user.refreshToken = undefined;
    return user;
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findAll() {
    const user = await this.prisma.user.findMany();
    if (!user) {
      throw new BadRequestException('해당하는 유저를 찾을 수 없습니다.');
    }
    return user;
  }

  async delete(id: string) {
    const user = await this.prisma.user.delete({ where: { id } });
    return user;
  }

  async setRefreshToken(id: string, refreshToken: string) {
    await this.prisma.user.update({ where: { id }, data: { refreshToken } });
  }
}
