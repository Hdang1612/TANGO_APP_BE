import { PartialType } from '@nestjs/mapped-types';
import { CreateGrammarGroupDto } from './create-grammar-group.dto.js';

export class UpdateGrammarGroupDto extends PartialType(CreateGrammarGroupDto) {}
