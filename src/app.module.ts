import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { LessonsModule } from './lessons/lessons.module.js';
import { KanjisModule } from './kanjis/kanjis.module.js';

@Module({
  imports: [PrismaModule, LessonsModule, KanjisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
