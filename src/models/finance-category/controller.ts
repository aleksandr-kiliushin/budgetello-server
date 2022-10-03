import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"

import { IUser } from "#interfaces/user"

import { CreateFinanceCategoryDto } from "./dto/create-finance-category.dto"
import { SearchFinanceCategoriesQueryDto } from "./dto/seach-finance-categories-query.dto"
import { UpdateFinanceCategoryDto } from "./dto/update-finance-category.dto"
import { FinanceCategoryService } from "./service"

@Controller("finances/categories")
@UseGuards(AuthGuard)
export class FinanceCategoryController {
  constructor(private financeCategoryService: FinanceCategoryService) {}

  @Get("search")
  searchCategories(
    @Query() query: SearchFinanceCategoriesQueryDto,
    @Request()
    request: Record<string, unknown> & { userId: IUser["id"] }
  ) {
    return this.financeCategoryService.searchCategories({ authorizedUserId: request.userId, query })
  }

  @Get(":id")
  findById(
    @Param("id")
    id: string,
    @Request()
    request: Record<string, unknown> & { userId: IUser["id"] }
  ) {
    return this.financeCategoryService.findById({ authorizedUserId: request.userId, categoryId: parseInt(id) })
  }

  @Post()
  create(
    @Body()
    createFinanceCategoryDto: CreateFinanceCategoryDto,
    @Request()
    request: Record<string, unknown> & { userId: IUser["id"] }
  ) {
    return this.financeCategoryService.create({ authorizedUserId: request.userId, createFinanceCategoryDto })
  }

  @Patch(":id")
  update(
    @Param("id")
    id: string,
    @Body()
    updateFinanceCategoryDto: UpdateFinanceCategoryDto,
    @Request()
    request: Record<string, unknown> & { userId: IUser["id"] }
  ) {
    return this.financeCategoryService.update({
      authorizedUserId: request.userId,
      categoryId: parseInt(id),
      updateFinanceCategoryDto,
    })
  }

  @Delete(":id")
  delete(
    @Param("id")
    id: string,
    @Request()
    request: Record<string, unknown> & { userId: IUser["id"] }
  ) {
    return this.financeCategoryService.delete({ authorizedUserId: request.userId, categoryId: parseInt(id) })
  }
}
