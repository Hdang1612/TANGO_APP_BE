import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateGrammarGroupDto } from './dto/create-grammar-group.dto.js';
import { UpdateGrammarGroupDto } from './dto/update-grammar-group.dto.js';
import { CreateGrammarDto } from './dto/create-grammar.dto.js';
import { UpdateGrammarDto } from './dto/update-grammar.dto.js';
import { GetGrammarQueryDto, GetGrammarGroupsQueryDto } from './dto/get-grammar-query.dto.js';

@Injectable()
export class GrammarService {
  constructor(private prisma: PrismaService) {}

  // ─── Grammar Groups ────────────────────────────────────────────────────────

  async findAllGroups(query?: GetGrammarGroupsQueryDto) {
    const page = query?.page ? Number(query.page) : undefined;
    const limit = query?.limit ? Number(query.limit) : undefined;

    if (!page && !limit) {
      return this.prisma.grammarGroup.findMany({
        include: {
          grammars: {
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'asc' },
      });
    }

    const currentPage = Math.max(1, page || 1);
    const take = Math.max(1, limit || 10);
    const skip = (currentPage - 1) * take;

    const [data, total] = await Promise.all([
      this.prisma.grammarGroup.findMany({
        include: {
          grammars: {
            orderBy: { createdAt: 'asc' },
          },
        },
        skip,
        take,
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.grammarGroup.count(),
    ]);

    return {
      data,
      total,
      page: currentPage,
      limit: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async findOneGroup(id: string) {
    const group = await this.prisma.grammarGroup.findUnique({
      where: { id },
      include: { grammars: { orderBy: { createdAt: 'asc' } } },
    });
    if (!group) throw new NotFoundException(`GrammarGroup with ID ${id} not found`);
    return group;
  }

  createGroup(dto: CreateGrammarGroupDto) {
    return this.prisma.grammarGroup.create({ data: dto });
  }

  async updateGroup(id: string, dto: UpdateGrammarGroupDto) {
    await this.findOneGroup(id);
    return this.prisma.grammarGroup.update({ where: { id }, data: dto });
  }

  async removeGroup(id: string) {
    await this.findOneGroup(id);
    return this.prisma.grammarGroup.delete({ where: { id } });
  }

  // ─── Grammar Items ─────────────────────────────────────────────────────────

  async findAllGrammars(query?: GetGrammarQueryDto) {
    const page = query?.page ? Number(query.page) : undefined;
    const limit = query?.limit ? Number(query.limit) : undefined;
    const groupId = query?.groupId;

    const where: any = {};
    if (groupId) {
      if (groupId === 'none') {
        where.groupId = null;
      } else if (groupId !== 'all') {
        where.groupId = groupId;
      }
    }

    if (!page && !limit) {
      return this.prisma.grammar.findMany({
        where,
        include: { group: true },
        orderBy: { createdAt: 'asc' },
      });
    }

    const currentPage = Math.max(1, page || 1);
    const take = Math.max(1, limit || 10);
    const skip = (currentPage - 1) * take;

    const [data, total] = await Promise.all([
      this.prisma.grammar.findMany({
        where,
        include: { group: true },
        skip,
        take,
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.grammar.count({ where }),
    ]);

    return {
      data,
      total,
      page: currentPage,
      limit: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async findOneGrammar(id: string) {
    const grammar = await this.prisma.grammar.findUnique({
      where: { id },
      include: { group: true },
    });
    if (!grammar) throw new NotFoundException(`Grammar with ID ${id} not found`);
    return grammar;
  }

  createGrammar(dto: CreateGrammarDto) {
    const { examples, groupId, ...rest } = dto;
    return this.prisma.grammar.create({
      data: {
        ...rest,
        examples: examples ? (examples as any) : undefined,
        ...(groupId ? { group: { connect: { id: groupId } } } : {}),
      },
      include: { group: true },
    });
  }

  async updateGrammar(id: string, dto: UpdateGrammarDto) {
    await this.findOneGrammar(id);
    const { examples, groupId, ...rest } = dto;
    return this.prisma.grammar.update({
      where: { id },
      data: {
        ...rest,
        examples: examples !== undefined ? (examples as any) : undefined,
        ...(groupId !== undefined
          ? groupId
            ? { group: { connect: { id: groupId } } }
            : { group: { disconnect: true } }
          : {}),
      },
      include: { group: true },
    });
  }

  async removeGrammar(id: string) {
    await this.findOneGrammar(id);
    return this.prisma.grammar.delete({ where: { id } });
  }
}
