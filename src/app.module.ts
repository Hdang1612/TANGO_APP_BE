import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { LessonsModule } from './lessons/lessons.module.js';

@Module({
  imports: [PrismaModule, LessonsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
