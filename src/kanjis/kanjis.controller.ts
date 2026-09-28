import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KanjisService } from './kanjis.service.js';
import { CreateKanjiDto } from './dto/create-kanji.dto.js';
import { UpdateKanjiDto } from './dto/update-kanji.dto.js';

@Controller('kanjis')
export class KanjisController {
  constructor(private readonly kanjisService: KanjisService) {}

  @Post()
  create(@Body() createKanjiDto: CreateKanjiDto) {
    return this.kanjisService.create(createKanjiDto);
  }

  @Get()
  findAll() {
    return this.kanjisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kanjisService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKanjiDto: UpdateKanjiDto) {
    return this.kanjisService.update(id, updateKanjiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kanjisService.remove(id);
  }
}
