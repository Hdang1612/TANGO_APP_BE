import { IsString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';

export class GrammarExampleDto {
  @IsString()
  @IsNotEmpty()
  japanese: string;

  @IsString()
  @IsOptional()
  vietnamese?: string;
}

export class CreateGrammarDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  usage: string;

  @IsString()
  @IsOptional()
  structure?: string;

  @IsOptional()
  examples?: GrammarExampleDto[];

  @IsUUID()
  @IsOptional()
  groupId?: string;
}
