import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
        {
          provide: PrismaService,
          useValue: {
            tb_task: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTasksDto = {
        adminKey: 'ADMIN001',
        taskTitle: '새 태스크',
        taskCompany: '새 회사',
        taskPriority: '새 우선순위',
        taskProgressing: '새 진행상태',
        taskOrderDate: new Date(),
        taskDeliveryDate: new Date(),
        taskDetail: { priority: 'high' },
      };

      const expectedTask = {
        TASK_KEY: 'TASK001',
        ADMIN_KEY: 'ADMIN001',
        TASK_TITLE: '새 태스크',
        TASK_DESC: '새 설명',
        TASK_DETAIL: { priority: 'high' },
        CREATED_AT: new Date(),
        UPDATED_AT: new Date(),
      };

      mockTasksService.create.mockResolvedValue(expectedTask);

      const result = await controller.create(createTasksDto);

      expect(service.create).toHaveBeenCalledWith(createTasksDto);
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

      mockTasksService.findAll.mockResolvedValue(expectedTasks);

      const result = await controller.findAll({});

      expect(service.findAll).toHaveBeenCalled();
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

      mockTasksService.findOne.mockResolvedValue(expectedTask);

      const result = await controller.findOne(taskId);

      expect(service.findOne).toHaveBeenCalledWith(taskId);
      expect(result).toEqual(expectedTask);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const taskId = 'TASK001';
      const updateTasksDto = {
        taskTitle: '수정된 태스크',
        taskDesc: '수정된 설명',
      };

      const updatedTask = {
        TASK_KEY: 'TASK001',
        ADMIN_KEY: 'ADMIN001',
        TASK_TITLE: '수정된 태스크',
        TASK_DESC: '수정된 설명',
        CREATED_AT: new Date(),
        UPDATED_AT: new Date(),
      };

      mockTasksService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(taskId, updateTasksDto);

      expect(service.update).toHaveBeenCalledWith(taskId, updateTasksDto);
      expect(result).toEqual(updatedTask);
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      const taskId = 'TASK001';
      const deletedTask = {
        TASK_KEY: 'TASK001',
        ADMIN_KEY: 'ADMIN001',
        TASK_TITLE: '삭제된 태스크',
        TASK_DESC: '삭제된 설명',
        CREATED_AT: new Date(),
        UPDATED_AT: new Date(),
      };

      mockTasksService.remove.mockResolvedValue(deletedTask);

      const result = await controller.remove(taskId);

      expect(service.remove).toHaveBeenCalledWith(taskId);
      expect(result).toEqual(deletedTask);
    });
  });
});
