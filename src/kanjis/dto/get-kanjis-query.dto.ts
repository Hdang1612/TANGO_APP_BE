import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination.dto.js';

export class GetKanjisQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  lessonId?: string;
}

