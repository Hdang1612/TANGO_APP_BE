import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateLessonDto } from './dto/create-lesson.dto.js';
import { UpdateLessonDto } from './dto/update-lesson.dto.js';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.lesson.findMany({
      include: { vocabularies: true },
    });
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { vocabularies: true },
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
          create: createLessonDto.vocabularies,
        },
      },
      include: { vocabularies: true },
    });
  }

  async update(id: string, updateLessonDto: UpdateLessonDto) {
    const currentLesson = await this.findOne(id);

    const { vocabularies, ...lessonData } = updateLessonDto;

    if (!vocabularies) {
      return this.prisma.lesson.update({
        where: { id },
        data: lessonData,
        include: { vocabularies: true },
      });
    }

    const currentVocabIds = currentLesson.vocabularies.map((v) => v.id);
    const incomingVocabIds = vocabularies.map((v) => v.id).filter(Boolean);

    const vocabsToDelete = currentVocabIds.filter(
      (id) => !incomingVocabIds.includes(id),
    );
    const vocabsToUpdate = vocabularies.filter((v) => v.id);
    const vocabsToCreate = vocabularies.filter((v) => !v.id);

    return this.prisma.lesson.update({
      where: { id },
      data: {
        ...lessonData,
        vocabularies: {
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
        },
      },
      include: { vocabularies: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.lesson.delete({
      where: { id },
    });
  }
}
