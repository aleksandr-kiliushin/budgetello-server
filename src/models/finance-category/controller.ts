import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"

import { AuthorizedUserId } from "#helpers/AuthorizedUserId.decorator"

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
    @Query()
    query: SearchFinanceCategoriesQueryDto,
    @AuthorizedUserId()
    authorizedUserId: IUser["id"]
  ) {
    return this.financeCategoryService.searchCategories({ authorizedUserId, query })
  }

  @Get(":id")
  findById(
    @Param("id")
    id: string,
    @AuthorizedUserId()
    authorizedUserId: IUser["id"]
  ) {
    return this.financeCategoryService.findById({ authorizedUserId, categoryId: parseInt(id) })
  }

  @Post()
  create(
    @Body()
    createFinanceCategoryDto: CreateFinanceCategoryDto,
    @AuthorizedUserId()
    authorizedUserId: IUser["id"]
  ) {
    return this.financeCategoryService.create({ authorizedUserId, createFinanceCategoryDto })
  }

  @Patch(":id")
  update(
    @Param("id")
    id: string,
    @Body()
    updateFinanceCategoryDto: UpdateFinanceCategoryDto,
    @AuthorizedUserId()
    authorizedUserId: IUser["id"]
  ) {
    return this.financeCategoryService.update({ authorizedUserId, categoryId: parseInt(id), updateFinanceCategoryDto })
  }

  @Delete(":id")
  delete(
    @Param("id")
    id: string,
    @AuthorizedUserId()
    authorizedUserId: IUser["id"]
  ) {
    return this.financeCategoryService.delete({ authorizedUserId, categoryId: parseInt(id) })
  }
}
