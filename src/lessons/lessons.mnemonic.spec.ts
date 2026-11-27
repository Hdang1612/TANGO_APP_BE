import { ValidationPipe } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto.js';
import { UpdateLessonDto } from './dto/update-lesson.dto.js';
import { LessonsService } from './lessons.service.js';

const pipe = new ValidationPipe({ whitelist: true, transform: true });
const kanji = {
  character: '日',
  meaning: 'mặt trời',
  mnemonic: 'cách nhớ',
  mnemonicTip: 'mẹo nhớ',
};
const notes = { mnemonic: 'cách nhớ', mnemonicTip: 'mẹo nhớ' };

function setup() {
  const prisma = {
    lesson: {
      create: vi.fn(),
      update: vi.fn(),
      findUnique: vi
        .fn()
        .mockResolvedValue({ id: 'l1', vocabularies: [], kanjis: [] }),
    },
  };
  return { prisma, service: new LessonsService(prisma as any) };
}

describe('Lessons: mnemonic và mnemonicTip', () => {
  it('được lưu khi tạo bài học', async () => {
    const { prisma, service } = setup();
    const dto = await pipe.transform(
      { title: 'Bài 1', kanjis: [kanji] },
      { type: 'body', metatype: CreateLessonDto },
    );

    await service.create(dto);

    const { data } = prisma.lesson.create.mock.calls[0][0];
    expect(data.kanjis.create[0]).toMatchObject(notes);
  });

  it('được lưu khi thêm và sửa kanji trong bài học', async () => {
    const { prisma, service } = setup();
    const dto = await pipe.transform(
      { kanjis: [kanji, { ...kanji, id: 'k1' }] },
      { type: 'body', metatype: UpdateLessonDto },
    );

    await service.update('l1', dto);

    const { data } = prisma.lesson.update.mock.calls[0][0];
    expect(data.kanjis.create[0]).toMatchObject(notes);
    expect(data.kanjis.update[0].data).toMatchObject(notes);
  });
});
