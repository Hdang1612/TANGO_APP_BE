import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { LessonsService } from './lessons.service.js';
import { CreateLessonDto } from './dto/create-lesson.dto.js';
import { UpdateLessonDto } from './dto/update-lesson.dto.js';
import { GetLessonsQueryDto } from './dto/get-lessons-query.dto.js';
import { TestQueryDto } from '../common/dto/test-query.dto.js';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto);
  }

  @Get()
  findAll(@Query() query: GetLessonsQueryDto) {
    return this.lessonsService.findAll(query);
  }

  @Get('test-vocabularies')
  getRandomVocabularies(@Query() query: TestQueryDto) {
    return this.lessonsService.getRandomVocabularies(query.limit);
  }

  @Get('random-vocabularies')
  getRandomVocabulariesAlias(@Query() query: TestQueryDto) {
    return this.lessonsService.getRandomVocabularies(query.limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }

  @Patch(':id')
  updatePatch(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonsService.update(id, updateLessonDto);
  }

  @Put(':id')
  updatePut(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonsService.update(id, updateLessonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }
}
