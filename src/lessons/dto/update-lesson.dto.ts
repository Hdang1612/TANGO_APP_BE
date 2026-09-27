import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

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
}
