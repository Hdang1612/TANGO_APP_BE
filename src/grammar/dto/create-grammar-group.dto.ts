import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateGrammarGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
