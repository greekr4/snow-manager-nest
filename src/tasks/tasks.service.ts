import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTasksDto } from './dto/create-tasks.dto';
import { UpdateTasksDto } from './dto/update-tasks.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import {
  PaginatedTasksResponse,
  PaginationInfo,
} from './dto/paginated-tasks.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTasksDto: CreateTasksDto) {
    const now = new Date();
    return this.prisma.tb_task.create({
      data: {
        TASK_KEY: nanoid(20),
        ADMIN_KEY: createTasksDto.adminKey,
        TASK_TITLE: createTasksDto.taskTitle,
        TASK_COMPANY: createTasksDto.taskCompany,
        TASK_PRIORITY: createTasksDto.taskPriority,
        TASK_PROGRESSING: createTasksDto.taskProgressing,
        TASK_ORDER_DATE: createTasksDto.taskOrderDate,
        TASK_DELIVERY_DATE: createTasksDto.taskDeliveryDate,
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

  async findAllWithPagination(
    query: PaginationQueryDto,
  ): Promise<PaginatedTasksResponse> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // 전체 작업 수 조회
    const total = await this.prisma.tb_task.count();

    // 페이지네이션된 작업 조회
    const tasks = await this.prisma.tb_task.findMany({
      skip,
      take: limit,
      orderBy: {
        CREATED_AT: 'desc',
      },
    });

    // 페이지네이션 정보 계산
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const pagination: PaginationInfo = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    };

    return {
      data: tasks,
      pagination,
    };
  }

  async findOne(id: string) {
    const task = await this.prisma.tb_task.findUnique({
      include: {
        tb_task_comment: {
          include: {
            tb_admin_user: true,
          },
          orderBy: {
            CREATED_AT: 'asc',
          },
        },
        tb_task_log: {
          include: {
            tb_admin_user: true,
          },
          orderBy: {
            CREATED_AT: 'desc',
          },
        },
        tb_admin_user: true,
      },
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
        TASK_COMPANY: updateTasksDto.taskCompany,
        TASK_PRIORITY: updateTasksDto.taskPriority,
        TASK_PROGRESSING: updateTasksDto.taskProgressing,
        TASK_ORDER_DATE: updateTasksDto.taskOrderDate,
        TASK_DELIVERY_DATE: updateTasksDto.taskDeliveryDate,
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

  async getTaskCounts() {
    const total = await this.prisma.tb_task.count();
    const 진행중 = await this.prisma.tb_task.count({
      where: { TASK_PROGRESSING: '진행중' },
    });
    const 완료 = await this.prisma.tb_task.count({
      where: { TASK_PROGRESSING: '완료' },
    });

    return {
      total,
      진행중,
      완료,
    };
  }
}
