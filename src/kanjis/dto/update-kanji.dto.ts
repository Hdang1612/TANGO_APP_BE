import { PartialType } from '@nestjs/mapped-types';
import { CreateKanjiDto } from './create-kanji.dto.js';

export class UpdateKanjiDto extends PartialType(CreateKanjiDto) {}
