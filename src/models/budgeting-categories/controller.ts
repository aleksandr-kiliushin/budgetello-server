import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"
import { UserEntity } from "#models/user/entities/user.entity"

import { AuthorizedUser } from "#helpers/AuthorizedUser.decorator"

import { CreateBudgetingCategoryDto } from "./dto/create-budgeting-category.dto"
import { SearchbudgetingCategoriesQueryDto } from "./dto/seach-budgeting-categories-query.dto"
import { UpdateBudgetingCategoryDto } from "./dto/update-budgeting-category.dto"
import { BudgetingCategoriesService } from "./service"

@Controller("budgeting/categories")
@UseGuards(AuthGuard)
export class BudgetingCategoriesController {
  constructor(private budgetingCategoriesService: BudgetingCategoriesService) {}

  @Get("search")
  search(
    @Query()
    query: SearchbudgetingCategoriesQueryDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.budgetingCategoriesService.search({ authorizedUser, query })
  }

  @Get(":id")
  findById(
    @Param("id")
    categoryId: string,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.budgetingCategoriesService.find({ authorizedUser, categoryId: parseInt(categoryId) })
  }

  @Post()
  create(
    @Body()
    requestBody: CreateBudgetingCategoryDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.budgetingCategoriesService.create({ authorizedUser, requestBody })
  }

  @Patch(":id")
  update(
    @Param("id")
    categoryId: string,
    @Body()
    requestBody: UpdateBudgetingCategoryDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.budgetingCategoriesService.update({ authorizedUser, categoryId: parseInt(categoryId), requestBody })
  }

  @Delete(":id")
  delete(
    @Param("id")
    categoryId: string,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.budgetingCategoriesService.delete({ authorizedUser, categoryId: parseInt(categoryId) })
  }
}
