import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    tb_task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTasksDto = {
        taskKey: 'TASK001',
        adminKey: 'ADMIN001',
        taskTitle: '테스트 태스크',
        taskDesc: '테스트 설명',
        taskDetail: { priority: 'high' },
      };

      const expectedTask = {
        TASK_KEY: 'TASK001',
        ADMIN_KEY: 'ADMIN001',
        TASK_TITLE: '테스트 태스크',
        TASK_DESC: '테스트 설명',
        TASK_DETAIL: { priority: 'high' },
        CREATED_AT: expect.any(Date),
        UPDATED_AT: expect.any(Date),
      };

      mockPrismaService.tb_task.create.mockResolvedValue(expectedTask);

      const result = await service.create(createTasksDto);

      expect(mockPrismaService.tb_task.create).toHaveBeenCalledWith({
        data: {
          TASK_KEY: 'TASK001',
          ADMIN_KEY: 'ADMIN001',
          TASK_TITLE: '테스트 태스크',
          TASK_DESC: '테스트 설명',
          TASK_DETAIL: { priority: 'high' },
          CREATED_AT: expect.any(Date),
          UPDATED_AT: expect.any(Date),
        },
      });
      expect(result).toEqual(expectedTask);
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      const expectedTasks = [
        {
          TASK_KEY: 'TASK001',
          ADMIN_KEY: 'ADMIN001',
          TASK_TITLE: '태스크 1',
          TASK_DESC: '설명 1',
          CREATED_AT: new Date(),
          UPDATED_AT: new Date(),
        },
        {
          TASK_KEY: 'TASK002',
          ADMIN_KEY: 'ADMIN001',
          TASK_TITLE: '태스크 2',
          TASK_DESC: '설명 2',
          CREATED_AT: new Date(),
          UPDATED_AT: new Date(),
        },
      ];

      mockPrismaService.tb_task.findMany.mockResolvedValue(expectedTasks);

      const result = await service.findAll();

      expect(mockPrismaService.tb_task.findMany).toHaveBeenCalledWith({
        orderBy: {
          CREATED_AT: 'desc',
        },
      });
      expect(result).toEqual(expectedTasks);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const taskId = 'TASK001';
      const expectedTask = {
        TASK_KEY: 'TASK001',
        ADMIN_KEY: 'ADMIN001',
        TASK_TITLE: '테스트 태스크',
        TASK_DESC: '테스트 설명',
        CREATED_AT: new Date(),
        UPDATED_AT: new Date(),
      };

      mockPrismaService.tb_task.findUnique.mockResolvedValue(expectedTask);

      const result = await service.findOne(taskId);

      expect(mockPrismaService.tb_task.findUnique).toHaveBeenCalledWith({
        where: {
          TASK_KEY: taskId,
        },
      });
      expect(result).toEqual(expectedTask);
    });

    it('should throw NotFoundException when task not found', async () => {
      const taskId = 'NONEXISTENT';
      mockPrismaService.tb_task.findUnique.mockResolvedValue(null);

      await expect(service.findOne(taskId)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(taskId)).rejects.toThrow(
        `Task with ID ${taskId} not found`,
      );
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const taskId = 'TASK001';
      const updateTasksDto = {
        taskTitle: '수정된 태스크',
        taskDesc: '수정된 설명',
      };

      const existingTask = {
        TASK_KEY: 'TASK001',
        ADMIN_KEY: 'ADMIN001',
        TASK_TITLE: '기존 태스크',
        TASK_DESC: '기존 설명',
        CREATED_AT: new Date(),
        UPDATED_AT: new Date(),
      };

      const updatedTask = {
        ...existingTask,
        TASK_TITLE: '수정된 태스크',
        TASK_DESC: '수정된 설명',
        UPDATED_AT: expect.any(Date),
      };

      mockPrismaService.tb_task.findUnique.mockResolvedValue(existingTask);
      mockPrismaService.tb_task.update.mockResolvedValue(updatedTask);

      const result = await service.update(taskId, updateTasksDto);

      expect(mockPrismaService.tb_task.update).toHaveBeenCalledWith({
        where: {
          TASK_KEY: taskId,
        },
        data: {
          TASK_TITLE: '수정된 태스크',
          TASK_DESC: '수정된 설명',
          TASK_DETAIL: undefined,
          UPDATED_AT: expect.any(Date),
        },
      });
      expect(result).toEqual(updatedTask);
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      const taskId = 'TASK001';
      const existingTask = {
        TASK_KEY: 'TASK001',
        ADMIN_KEY: 'ADMIN001',
        TASK_TITLE: '삭제할 태스크',
        TASK_DESC: '삭제할 설명',
        CREATED_AT: new Date(),
        UPDATED_AT: new Date(),
      };

      mockPrismaService.tb_task.findUnique.mockResolvedValue(existingTask);
      mockPrismaService.tb_task.delete.mockResolvedValue(existingTask);

      const result = await service.remove(taskId);

      expect(mockPrismaService.tb_task.delete).toHaveBeenCalledWith({
        where: {
          TASK_KEY: taskId,
        },
      });
      expect(result).toEqual(existingTask);
    });
  });
});
