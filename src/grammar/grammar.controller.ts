import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query,
} from '@nestjs/common';
import { GrammarService } from './grammar.service.js';
import { CreateGrammarGroupDto } from './dto/create-grammar-group.dto.js';
import { UpdateGrammarGroupDto } from './dto/update-grammar-group.dto.js';
import { CreateGrammarDto } from './dto/create-grammar.dto.js';
import { UpdateGrammarDto } from './dto/update-grammar.dto.js';
import { GetGrammarQueryDto, GetGrammarGroupsQueryDto } from './dto/get-grammar-query.dto.js';

@Controller()
export class GrammarController {
  constructor(private readonly grammarService: GrammarService) {}

  // ─── Grammar Groups ────────────────────────────────────────────────────────

  @Get('grammar-groups')
  findAllGroups(@Query() query: GetGrammarGroupsQueryDto) {
    return this.grammarService.findAllGroups(query);
  }

  @Get('grammar-groups/:id')
  findOneGroup(@Param('id') id: string) {
    return this.grammarService.findOneGroup(id);
  }

  @Post('grammar-groups')
  createGroup(@Body() dto: CreateGrammarGroupDto) {
    return this.grammarService.createGroup(dto);
  }

  @Patch('grammar-groups/:id')
  updateGroup(@Param('id') id: string, @Body() dto: UpdateGrammarGroupDto) {
    return this.grammarService.updateGroup(id, dto);
  }

  @Delete('grammar-groups/:id')
  removeGroup(@Param('id') id: string) {
    return this.grammarService.removeGroup(id);
  }

  // ─── Grammar Items ─────────────────────────────────────────────────────────

  @Get('grammars')
  findAllGrammars(@Query() query: GetGrammarQueryDto) {
    return this.grammarService.findAllGrammars(query);
  }

  @Get('grammars/:id')
  findOneGrammar(@Param('id') id: string) {
    return this.grammarService.findOneGrammar(id);
  }

  @Post('grammars')
  createGrammar(@Body() dto: CreateGrammarDto) {
    return this.grammarService.createGrammar(dto);
  }

  @Patch('grammars/:id')
  updateGrammar(@Param('id') id: string, @Body() dto: UpdateGrammarDto) {
    return this.grammarService.updateGrammar(id, dto);
  }

  @Delete('grammars/:id')
  removeGrammar(@Param('id') id: string) {
    return this.grammarService.removeGrammar(id);
  }
}
