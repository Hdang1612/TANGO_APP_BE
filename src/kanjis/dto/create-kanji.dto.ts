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

  @IsUUID()
  @IsNotEmpty()
  lessonId: string;
}
