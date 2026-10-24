import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateKanjiDto {
  @IsString()
  @IsNotEmpty()
  character: string;

  @IsString()
  @IsOptional()
  hanViet?: string;

  @IsString()
  @IsNotEmpty()
  meaning: string;

  @IsString()
  @IsOptional()
  onYomi?: string;

  @IsString()
  @IsOptional()
  kunYomi?: string;

  @IsOptional()
  examples?: object;

  @IsUUID()
  @IsNotEmpty()
  lessonId: string;
}
