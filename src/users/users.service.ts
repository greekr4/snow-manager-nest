import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const now = new Date();
    return this.prisma.tb_admin_user.create({
      data: {
        ADMIN_KEY: createUserDto.adminKey,
        ADMIN_ID: createUserDto.adminId,
        ADMIN_PW: createUserDto.adminPw,
        ADMIN_NAME: createUserDto.adminName,
        ADMIN_POSITION: createUserDto.adminPosition,
        CREATE_AT: now,
        UPDATED_AT: now,
      },
    });
  }

  async findAll() {
    return this.prisma.tb_admin_user.findMany({
      orderBy: {
        CREATE_AT: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.tb_admin_user.findUnique({
      where: {
        ADMIN_KEY: id,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    return this.prisma.tb_admin_user.update({
      where: {
        ADMIN_KEY: id,
      },
      data: {
        ADMIN_ID: updateUserDto.adminId,
        ADMIN_PW: updateUserDto.adminPw,
        ADMIN_NAME: updateUserDto.adminName,
        ADMIN_POSITION: updateUserDto.adminPosition,
        UPDATED_AT: new Date(),
      },
    });
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    return this.prisma.tb_admin_user.delete({
      where: {
        ADMIN_KEY: id,
      },
    });
  }
}
