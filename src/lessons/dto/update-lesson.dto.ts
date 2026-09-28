import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { KanjiExampleDto } from './create-lesson.dto.js';

export class UpdateVocabularyDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  japanese?: string;

  @IsString()
  @IsOptional()
  vietnamese?: string;

  @IsString()
  @IsOptional()
  hanViet?: string;
}

export class UpdateKanjiItemDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  character?: string;

  @IsString()
  @IsOptional()
  meaning?: string;

  @IsString()
  @IsOptional()
  hanViet?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KanjiExampleDto)
  @IsOptional()
  examples?: KanjiExampleDto[];
}

export class UpdateLessonDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateVocabularyDto)
  @IsOptional()
  vocabularies?: UpdateVocabularyDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateKanjiItemDto)
  @IsOptional()
  kanjis?: UpdateKanjiItemDto[];
}
