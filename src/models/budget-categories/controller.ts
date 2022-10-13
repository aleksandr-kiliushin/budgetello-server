import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"
import { UserEntity } from "#models/user/entities/user.entity"

import { AuthorizedUser } from "#helpers/AuthorizedUser.decorator"
import { JoiValidationPipe } from "#helpers/JoiValidationSchema"

import { CreateBudgetCategoryDto } from "./dto/create-budget-category.dto"
import { SearchBudgetCategoriesQueryDto } from "./dto/seach-budget-categories-query.dto"
import { UpdateBudgetCategoryDto } from "./dto/update-budget-category.dto"
import { BudgetCategoriesService } from "./service"
import { createCategoryValidator } from "./validators/create-category.validator"

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

  @Get(":categoryId")
  find(
    @Param("categoryId", ParseIntPipe)
    categoryId: number,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.budgetCategoriesService.find({ authorizedUser, categoryId })
  }

  @Post()
  create(
    @Body(new JoiValidationPipe(createCategoryValidator))
    requestBody: CreateBudgetCategoryDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.budgetCategoriesService.create({ authorizedUser, requestBody })
  }

  @Patch(":categoryId")
  update(
    @Param("categoryId", ParseIntPipe)
    categoryId: number,
    @Body()
    requestBody: UpdateBudgetCategoryDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.budgetCategoriesService.update({ authorizedUser, categoryId, requestBody })
  }

  @Delete(":categoryId")
  delete(
    @Param("categoryId", ParseIntPipe)
    categoryId: number,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.budgetCategoriesService.delete({ authorizedUser, categoryId })
  }
}
