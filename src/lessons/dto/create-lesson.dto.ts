import { IsString, IsOptional, IsArray, ValidateNested, ArrayMinSize, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVocabularyDto {
  @IsString()
  @IsNotEmpty()
  japanese: string;

  @IsString()
  @IsNotEmpty()
  vietnamese: string;

  @IsString()
  @IsOptional()
  hanViet?: string;
}

export class KanjiExampleDto {
  @IsString()
  @IsNotEmpty()
  word: string;

  @IsString()
  @IsOptional()
  reading?: string;

  @IsString()
  @IsOptional()
  meaning?: string;
}

export class CreateKanjiItemDto {
  @IsString()
  @IsNotEmpty()
  character: string;

  @IsString()
  @IsNotEmpty()
  meaning: string;

  @IsString()
  @IsOptional()
  hanViet?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KanjiExampleDto)
  @IsOptional()
  examples?: KanjiExampleDto[];
}

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVocabularyDto)
  @IsOptional()
  vocabularies: CreateVocabularyDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateKanjiItemDto)
  @IsOptional()
  kanjis?: CreateKanjiItemDto[];
}
