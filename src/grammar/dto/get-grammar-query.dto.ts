import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination.dto.js';

export class GetGrammarQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  groupId?: string;
}

export class GetGrammarGroupsQueryDto extends PaginationQueryDto {}

