import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto) {
    const now = new Date();
    const commentKey = nanoid(20);

    return this.prisma.tb_task_comment.create({
      data: {
        COMMENT_KEY: commentKey,
        TASK_KEY: createCommentDto.taskKey,
        ADMIN_KEY: createCommentDto.adminKey,
        COMMENT_CONTENT: createCommentDto.commentContent,
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
    return this.prisma.tb_task_comment.findMany({
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
    const comment = await this.prisma.tb_task_comment.findUnique({
      where: {
        COMMENT_KEY: id,
      },
      include: {
        tb_task: true,
        tb_admin_user: true,
      },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.findOne(id);

    return this.prisma.tb_task_comment.update({
      where: {
        COMMENT_KEY: id,
      },
      data: {
        COMMENT_CONTENT: updateCommentDto.commentContent,
        UPDATED_AT: new Date(),
      },
      include: {
        tb_task: true,
        tb_admin_user: true,
      },
    });
  }

  async remove(id: string) {
    const comment = await this.findOne(id);

    return this.prisma.tb_task_comment.delete({
      where: {
        COMMENT_KEY: id,
      },
      include: {
        tb_task: true,
        tb_admin_user: true,
      },
    });
  }

  async findByTaskKey(taskKey: string) {
    return this.prisma.tb_task_comment.findMany({
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
