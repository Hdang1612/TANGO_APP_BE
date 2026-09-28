import { Module } from '@nestjs/common';
import { KanjisService } from './kanjis.service.js';
import { KanjisController } from './kanjis.controller.js';

@Module({
  controllers: [KanjisController],
  providers: [KanjisService],
})
export class KanjisModule {}
