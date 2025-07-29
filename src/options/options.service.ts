import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';

@Injectable()
export class OptionsService {
  constructor(private prisma: PrismaService) {}

  async create(createOptionDto: CreateOptionDto) {
    const now = new Date();
    return this.prisma.tb_task_option.create({
      data: {
        OPTION_KEY: createOptionDto.optionKey,
        OPTION_TITLE: createOptionDto.optionTitle,
        CREATE_AT: now,
        UPDATED_AT: now,
      },
    });
  }

  async findAll() {
    return this.prisma.tb_task_option.findMany({
      orderBy: {
        CREATE_AT: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const option = await this.prisma.tb_task_option.findUnique({
      where: {
        OPTION_KEY: id,
      },
    });

    if (!option) {
      throw new NotFoundException(`Option with ID ${id} not found`);
    }

    return option;
  }

  async findOneWithRelations(id: string) {
    const option = await this.prisma.tb_task_option.findUnique({
      where: {
        OPTION_KEY: id,
      },
      include: {
        tb_task_option_company: true,
        tb_task_option_detail: true,
      },
    });

    if (!option) {
      throw new NotFoundException(`Option with ID ${id} not found`);
    }

    return option;
  }

  async findAllWithRelations() {
    return this.prisma.tb_task_option.findMany({
      include: {
        tb_task_option_company: true,
        tb_task_option_detail: true,
      },
      orderBy: {
        CREATE_AT: 'desc',
      },
    });
  }

  async update(id: string, updateOptionDto: UpdateOptionDto) {
    const option = await this.findOne(id);

    return this.prisma.tb_task_option.update({
      where: {
        OPTION_KEY: id,
      },
      data: {
        OPTION_TITLE: updateOptionDto.optionTitle,
        UPDATED_AT: new Date(),
      },
    });
  }

  async remove(id: string) {
    const option = await this.findOne(id);

    return this.prisma.tb_task_option.delete({
      where: {
        OPTION_KEY: id,
      },
    });
  }

  // 회사 관련 메서드들
  async findCompaniesByOption(optionKey: string) {
    return this.prisma.tb_task_option_company.findMany({
      where: {
        OPTION_KEY: optionKey,
      },
    });
  }

  async findDetailsByOption(optionKey: string) {
    return this.prisma.tb_task_option_detail.findMany({
      where: {
        OPTION_KEY: optionKey,
      },
    });
  }
}
