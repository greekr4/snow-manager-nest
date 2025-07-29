import { Test, TestingModule } from '@nestjs/testing';
import { OptionsController } from './options.controller';
import { OptionsService } from './options.service';
import { PrismaService } from '../prisma/prisma.service';

describe('OptionsController', () => {
  let controller: OptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OptionsController],
      providers: [
        OptionsService,
        {
          provide: PrismaService,
          useValue: {
            tb_task_option: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            tb_task_option_company: {
              findMany: jest.fn(),
            },
            tb_task_option_detail: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<OptionsController>(OptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
