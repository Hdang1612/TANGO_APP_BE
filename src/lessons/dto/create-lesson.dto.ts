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
  @ArrayMinSize(1)
  vocabularies: CreateVocabularyDto[];
}
