import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTasksDto } from './dto/create-tasks.dto';
import { UpdateTasksDto } from './dto/update-tasks.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTasksDto: CreateTasksDto) {
    return this.tasksService.create(createTasksDto);
  }

  @Get('count')
  getTaskCounts() {
    return this.tasksService.getTaskCounts();
  }

  @Get()
  findAll(@Query() query: any) {
    // 쿼리 파라미터를 숫자로 변환
    const paginationQuery: PaginationQueryDto = {
      page: query.page ? parseInt(query.page, 10) : 1,
      limit: query.limit ? parseInt(query.limit, 10) : 10,
    };

    // 페이지네이션 파라미터가 있으면 페이지네이션된 결과 반환
    if (query.page || query.limit) {
      return this.tasksService.findAllWithPagination(paginationQuery);
    }
    // 페이지네이션 파라미터가 없으면 모든 결과 반환
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTasksDto: UpdateTasksDto) {
    return this.tasksService.update(id, updateTasksDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
