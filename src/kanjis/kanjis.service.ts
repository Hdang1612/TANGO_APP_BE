import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateKanjiDto } from './dto/create-kanji.dto.js';
import { UpdateKanjiDto } from './dto/update-kanji.dto.js';

import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class KanjisService {
  constructor(private prisma: PrismaService) {}

  create(createKanjiDto: CreateKanjiDto) {
    return this.prisma.kanji.create({ data: createKanjiDto });
  }

  findAll() {
    return this.prisma.kanji.findMany({
      include: { lesson: true },
    });
  }

  findByLessonId(lessonId: string) {
    return this.prisma.kanji.findMany({
      where: { lessonId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const kanji = await this.prisma.kanji.findUnique({ where: { id } });
    if (!kanji) throw new NotFoundException(`Kanji with ID ${id} not found`);
    return kanji;
  }

  update(id: string, updateKanjiDto: UpdateKanjiDto) {
    return this.prisma.kanji.update({
      where: { id },
      data: updateKanjiDto,
    });
  }

  remove(id: string) {
    return this.prisma.kanji.delete({ where: { id } });
  }
}
