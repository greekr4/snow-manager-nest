import { Test, TestingModule } from '@nestjs/testing';
import { OptionsService } from './options.service';
import { PrismaService } from '../prisma/prisma.service';

describe('OptionsService', () => {
  let service: OptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<OptionsService>(OptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
