import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTasksDto } from './dto/create-tasks.dto';
import { UpdateTasksDto } from './dto/update-tasks.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTasksDto: CreateTasksDto) {
    const now = new Date();
    return this.prisma.tb_task.create({
      data: {
        TASK_KEY: createTasksDto.taskKey,
        ADMIN_KEY: createTasksDto.adminKey,
        TASK_TITLE: createTasksDto.taskTitle,
        TASK_DESC: createTasksDto.taskDesc,
        TASK_DETAIL: createTasksDto.taskDetail,
        CREATED_AT: now,
        UPDATED_AT: now,
      },
    });
  }

  async findAll() {
    return this.prisma.tb_task.findMany({
      orderBy: {
        CREATED_AT: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.tb_task.findUnique({
      where: {
        TASK_KEY: id,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTasksDto: UpdateTasksDto) {
    const task = await this.findOne(id);

    return this.prisma.tb_task.update({
      where: {
        TASK_KEY: id,
      },
      data: {
        TASK_TITLE: updateTasksDto.taskTitle,
        TASK_DESC: updateTasksDto.taskDesc,
        TASK_DETAIL: updateTasksDto.taskDetail,
        UPDATED_AT: new Date(),
      },
    });
  }

  async remove(id: string) {
    const task = await this.findOne(id);

    return this.prisma.tb_task.delete({
      where: {
        TASK_KEY: id,
      },
    });
  }
}
