import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"
import { UserEntity } from "#models/user/entities/user.entity"

import { AuthorizedUser } from "#helpers/AuthorizedUser.decorator"

import { CreateBudgetCategoryDto } from "./dto/create-budget-category.dto"
import { SearchBudgetCategoriesQueryDto } from "./dto/seach-budget-categories-query.dto"
import { UpdateBudgetCategoryDto } from "./dto/update-budget-category.dto"
import { BudgetCategoriesService } from "./service"

@Controller("budget/categories")
@UseGuards(AuthGuard)
export class BudgetCategoriesController {
  constructor(private budgetCategoriesService: BudgetCategoriesService) {}

  @Get("search")
  search(
    @Query()
    query: SearchBudgetCategoriesQueryDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.budgetCategoriesService.search({ authorizedUser, query })
  }

  @Get(":id")
  findById(
    @Param("id")
    categoryId: string,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.budgetCategoriesService.find({ authorizedUser, categoryId: parseInt(categoryId) })
  }

  @Post()
  create(
    @Body()
    requestBody: CreateBudgetCategoryDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.budgetCategoriesService.create({ authorizedUser, requestBody })
  }

  @Patch(":id")
  update(
    @Param("id")
    categoryId: string,
    @Body()
    requestBody: UpdateBudgetCategoryDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.budgetCategoriesService.update({ authorizedUser, categoryId: parseInt(categoryId), requestBody })
  }

  @Delete(":id")
  delete(
    @Param("id")
    categoryId: string,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.budgetCategoriesService.delete({ authorizedUser, categoryId: parseInt(categoryId) })
  }
}
