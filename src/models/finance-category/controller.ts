import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"
import { UserEntity } from "#models/user/entities/user.entity"

import { AuthorizedUser } from "#helpers/AuthorizedUser.decorator"

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
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.financeCategoryService.searchCategories({ authorizedUser, query })
  }

  @Get(":id")
  findById(
    @Param("id")
    id: string,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.financeCategoryService.findById({ authorizedUser, categoryId: parseInt(id) })
  }

  @Post()
  create(
    @Body()
    createFinanceCategoryDto: CreateFinanceCategoryDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.financeCategoryService.create({ authorizedUser, createFinanceCategoryDto })
  }

  @Patch(":id")
  update(
    @Param("id")
    id: string,
    @Body()
    updateFinanceCategoryDto: UpdateFinanceCategoryDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.financeCategoryService.update({ authorizedUser, categoryId: parseInt(id), updateFinanceCategoryDto })
  }

  @Delete(":id")
  delete(
    @Param("id")
    id: string,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.financeCategoryService.delete({ authorizedUser, categoryId: parseInt(id) })
  }
}
