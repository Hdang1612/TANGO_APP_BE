import { Module } from '@nestjs/common';
import { GrammarService } from './grammar.service.js';
import { GrammarController } from './grammar.controller.js';

@Module({
  controllers: [GrammarController],
  providers: [GrammarService],
})
export class GrammarModule {}
