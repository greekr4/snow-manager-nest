import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class LogsService {
  constructor(private prisma: PrismaService) {}

  async create(createLogDto: CreateLogDto) {
    const now = new Date();
    return this.prisma.tb_task_log.create({
      data: {
        LOG_KEY: nanoid(20),
        TASK_KEY: createLogDto.taskKey,
        ADMIN_KEY: createLogDto.adminKey,
        LOG_CONTENT: createLogDto.logContent,
        CREATED_AT: now,
        UPDATED_AT: now,
      },
      include: {
        tb_task: true,
        tb_admin_user: true,
      },
    });
  }

  async findAll() {
    return this.prisma.tb_task_log.findMany({
      include: {
        tb_task: true,
        tb_admin_user: true,
      },
      orderBy: {
        CREATED_AT: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const log = await this.prisma.tb_task_log.findUnique({
      where: {
        LOG_KEY: id,
      },
      include: {
        tb_task: true,
        tb_admin_user: true,
      },
    });

    if (!log) {
      throw new NotFoundException(`Log with ID ${id} not found`);
    }

    return log;
  }

  async update(id: string, updateLogDto: UpdateLogDto) {
    const log = await this.findOne(id);

    return this.prisma.tb_task_log.update({
      where: {
        LOG_KEY: id,
      },
      data: {
        LOG_CONTENT: updateLogDto.logContent,
        UPDATED_AT: new Date(),
      },
      include: {
        tb_task: true,
        tb_admin_user: true,
      },
    });
  }

  async remove(id: string) {
    const log = await this.findOne(id);

    return this.prisma.tb_task_log.delete({
      where: {
        LOG_KEY: id,
      },
      include: {
        tb_task: true,
        tb_admin_user: true,
      },
    });
  }

  async findByTaskKey(taskKey: string) {
    return this.prisma.tb_task_log.findMany({
      where: {
        TASK_KEY: taskKey,
      },
      include: {
        tb_task: true,
        tb_admin_user: true,
      },
      orderBy: {
        CREATED_AT: 'desc',
      },
    });
  }
}
