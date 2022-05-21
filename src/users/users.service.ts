import { BadRequestException, Injectable } from '@nestjs/common';
import { hashSync } from 'bcrypt';

import { PrismaService } from 'src/prisma.service';
import { getUserWithoutAuthInfo } from 'src/utils/getUserWithoutAuthInfo';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const password = hashSync(createUserDto.password, 12);
    try {
      const user = await this.prisma.user.create({
        data: { ...createUserDto, password },
      });
      return getUserWithoutAuthInfo(user);
    } catch (error) {
      if (error.code === 'P2002')
        throw new BadRequestException('동일한 정보의 유저가 있습니다.');

      throw new Error(error);
    }
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new BadRequestException('해당하는 유저를 찾을 수 없습니다.');
    }
    return getUserWithoutAuthInfo(user);
  }

  findOneForToken(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async validateEmail(email: string) {
    const [user] = await this.prisma.user.findMany({ where: { email } });
    if (user) return { message: 'email이 사용중입니다.', usable: false };
    return { message: '사용가능 한 email입니다.', usable: true };
  }

  async findAll() {
    const user = await this.prisma.user.findMany();
    if (!user) {
      throw new BadRequestException('해당하는 유저를 찾을 수 없습니다.');
    }
    return user;
  }

  async delete(id: string) {
    await this.prisma.user.delete({ where: { id } });
    return true;
  }

  async setRefreshToken(id: string, refreshToken: string) {
    await this.prisma.user.update({ where: { id }, data: { refreshToken } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        data: updateUserDto,
        where: { id },
        select: {
          email: true,
          nickname: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002')
        throw new BadRequestException('동일한 정보의 유저가 있습니다.');
    }
  }
}
