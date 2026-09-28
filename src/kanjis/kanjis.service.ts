import { Injectable } from '@nestjs/common';
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
    return this.prisma.kanji.findMany();
  }

  findOne(id: string) {
    // When fetching a kanji, we optionally might want its vocabularies containing the kanji
    return this.prisma.kanji.findUnique({ where: { id } });
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
