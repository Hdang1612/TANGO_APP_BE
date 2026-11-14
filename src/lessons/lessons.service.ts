import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateLessonDto } from './dto/create-lesson.dto.js';
import { UpdateLessonDto } from './dto/update-lesson.dto.js';
import { GetLessonsQueryDto } from './dto/get-lessons-query.dto.js';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: GetLessonsQueryDto) {
    const page = query?.page ? Number(query.page) : undefined;
    const limit = query?.limit ? Number(query.limit) : undefined;
    const type = query?.type;

    const where: any = {};
    if (type === 'vocabulary') {
      where.vocabularies = { some: {} };
    } else if (type === 'kanji') {
      where.kanjis = { some: {} };
    }

    if (!page && !limit) {
      return this.prisma.lesson.findMany({
        where,
        include: { vocabularies: true, kanjis: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    const currentPage = Math.max(1, page || 1);
    const take = Math.max(1, limit || 10);
    const skip = (currentPage - 1) * take;

    const [data, total] = await Promise.all([
      this.prisma.lesson.findMany({
        where,
        include: { vocabularies: true, kanjis: true },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.lesson.count({ where }),
    ]);

    return {
      data,
      total,
      page: currentPage,
      limit: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async getRandomVocabularies(limit: number = 20) {
    const take = Math.max(1, Math.min(100, Number(limit) || 20));
    return this.prisma.$queryRaw<any[]>`
      SELECT id, japanese, vietnamese, "hanViet", "lessonId", "createdAt", "updatedAt"
      FROM "Vocabulary"
      ORDER BY RANDOM()
      LIMIT ${take}
    `;
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { vocabularies: true, kanjis: true },
    });
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
    return lesson;
  }

  async create(createLessonDto: CreateLessonDto) {
    return this.prisma.lesson.create({
      data: {
        title: createLessonDto.title,
        description: createLessonDto.description,
        vocabularies: {
          create: createLessonDto.vocabularies || [],
        },
        kanjis: {
          create: (createLessonDto.kanjis || []).map((k) => ({
            character: k.character,
            meaning: k.meaning,
            hanViet: k.hanViet,
            onYomi: k.onYomi,
            kunYomi: k.kunYomi,
            examples: k.examples ? (k.examples as any) : undefined,
          })),
        }
      },
      include: { vocabularies: true, kanjis: true },
    });
  }

  async update(id: string, updateLessonDto: UpdateLessonDto) {
    const currentLesson = await this.findOne(id);

    const { vocabularies, kanjis, ...lessonData } = updateLessonDto;

    const data: any = {
      ...lessonData,
    };

    if (vocabularies) {
      const currentVocabIds = currentLesson.vocabularies.map((v) => v.id);
      const incomingVocabIds = vocabularies.map((v) => v.id).filter(Boolean);

      const vocabsToDelete = currentVocabIds.filter(
        (id) => !incomingVocabIds.includes(id),
      );
      const vocabsToUpdate = vocabularies.filter((v) => v.id);
      const vocabsToCreate = vocabularies.filter((v) => !v.id);

      data.vocabularies = {
        deleteMany: {
          id: { in: vocabsToDelete },
        },
        create: vocabsToCreate.map((v) => ({
          japanese: v.japanese as string,
          vietnamese: v.vietnamese as string,
          hanViet: v.hanViet,
        })),
        update: vocabsToUpdate.map((v) => ({
          where: { id: v.id },
          data: {
            japanese: v.japanese,
            vietnamese: v.vietnamese,
            hanViet: v.hanViet,
          },
        })),
      };
    }

    if (kanjis) {
      const currentKanjiIds = currentLesson.kanjis.map((k) => k.id);
      const incomingKanjiIds = kanjis.map((k) => k.id).filter(Boolean);

      const kanjisToDelete = currentKanjiIds.filter(
        (id) => !incomingKanjiIds.includes(id),
      );
      const kanjisToUpdate = kanjis.filter((k) => k.id);
      const kanjisToCreate = kanjis.filter((k) => !k.id);

      data.kanjis = {
        deleteMany: {
          id: { in: kanjisToDelete },
        },
        create: kanjisToCreate.map((k) => ({
          character: k.character as string,
          meaning: k.meaning as string,
          hanViet: k.hanViet,
          onYomi: k.onYomi,
          kunYomi: k.kunYomi,
          examples: k.examples ? (k.examples as any) : undefined,
        })),
        update: kanjisToUpdate.map((k) => ({
          where: { id: k.id },
          data: {
            character: k.character,
            meaning: k.meaning,
            hanViet: k.hanViet,
            onYomi: k.onYomi,
            kunYomi: k.kunYomi,
            examples: k.examples ? (k.examples as any) : undefined,
          },
        })),
      };
    }

    return this.prisma.lesson.update({
      where: { id },
      data,
      include: { vocabularies: true, kanjis: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.lesson.delete({
      where: { id },
    });
  }
}
