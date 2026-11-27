import { IsOptional, IsIn } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination.dto.js';

export class GetLessonsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsIn(['vocabulary', 'kanji'])
  type?: 'vocabulary' | 'kanji';
}
