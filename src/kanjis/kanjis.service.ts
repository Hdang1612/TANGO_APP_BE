import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateKanjiDto } from './dto/create-kanji.dto.js';
import { UpdateKanjiDto } from './dto/update-kanji.dto.js';
import { GetKanjisQueryDto } from './dto/get-kanjis-query.dto.js';

import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class KanjisService {
  constructor(private prisma: PrismaService) {}

  create(createKanjiDto: CreateKanjiDto) {
    return this.prisma.kanji.create({ data: createKanjiDto });
  }

  async findAll(query?: GetKanjisQueryDto) {
    const page = query?.page ? Number(query.page) : undefined;
    const limit = query?.limit ? Number(query.limit) : undefined;

    if (!page && !limit) {
      return this.prisma.kanji.findMany({
        include: { lesson: true },
        orderBy: { createdAt: 'asc' },
      });
    }

    const currentPage = Math.max(1, page || 1);
    const take = Math.max(1, limit || 10);
    const skip = (currentPage - 1) * take;

    const [data, total] = await Promise.all([
      this.prisma.kanji.findMany({
        include: { lesson: true },
        skip,
        take,
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.kanji.count(),
    ]);

    return {
      data,
      total,
      page: currentPage,
      limit: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async findByLessonId(lessonId: string, query?: GetKanjisQueryDto) {
    const page = query?.page ? Number(query.page) : undefined;
    const limit = query?.limit ? Number(query.limit) : undefined;

    const where = { lessonId };

    if (!page && !limit) {
      return this.prisma.kanji.findMany({
        where,
        orderBy: { createdAt: 'asc' },
      });
    }

    const currentPage = Math.max(1, page || 1);
    const take = Math.max(1, limit || 10);
    const skip = (currentPage - 1) * take;

    const [data, total] = await Promise.all([
      this.prisma.kanji.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.kanji.count({ where }),
    ]);

    return {
      data,
      total,
      page: currentPage,
      limit: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async getRandomKanjis(limit: number = 20) {
    const take = Math.max(1, Math.min(100, Number(limit) || 20));
    return this.prisma.$queryRaw<any[]>`
      SELECT id, character, "hanViet", meaning, "onYomi", "kunYomi", examples, "lessonId", "createdAt", "updatedAt"
      FROM "Kanji"
      ORDER BY RANDOM()
      LIMIT ${take}
    `;
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
