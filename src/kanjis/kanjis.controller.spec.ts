import { Test, TestingModule } from '@nestjs/testing';
import { KanjisController } from './kanjis.controller.js';
import { KanjisService } from './kanjis.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('KanjisController', () => {
  let controller: KanjisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KanjisController],
      providers: [
        KanjisService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<KanjisController>(KanjisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
