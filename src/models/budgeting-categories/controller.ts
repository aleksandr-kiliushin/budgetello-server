import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"
import { UserEntity } from "#models/user/entities/user.entity"

import { AuthorizedUser } from "#helpers/AuthorizedUser.decorator"

import { CreateBudgetingCategoryDto } from "./dto/create-budgeting-category.dto"
import { SearchbudgetingCategoriesQueryDto } from "./dto/seach-budgeting-categories-query.dto"
import { UpdateBudgetingCategoryDto } from "./dto/update-budgeting-category.dto"
import { BudgetingCategoryService } from "./service"

@Controller("budgeting/categories")
@UseGuards(AuthGuard)
export class BudgetingCategoryController {
  constructor(private BudgetingCategoryService: BudgetingCategoryService) {}

  @Get("search")
  searchCategories(
    @Query()
    query: SearchbudgetingCategoriesQueryDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.BudgetingCategoryService.searchCategories({ authorizedUser, query })
  }

  @Get(":id")
  findById(
    @Param("id")
    id: string,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.BudgetingCategoryService.findById({ authorizedUser, categoryId: parseInt(id) })
  }

  @Post()
  create(
    @Body()
    CreateBudgetingCategoryDto: CreateBudgetingCategoryDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.BudgetingCategoryService.create({ authorizedUser, CreateBudgetingCategoryDto })
  }

  @Patch(":id")
  update(
    @Param("id")
    id: string,
    @Body()
    UpdateBudgetingCategoryDto: UpdateBudgetingCategoryDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.BudgetingCategoryService.update({
      authorizedUser,
      categoryId: parseInt(id),
      UpdateBudgetingCategoryDto,
    })
  }

  @Delete(":id")
  delete(
    @Param("id")
    id: string,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.BudgetingCategoryService.delete({ authorizedUser, categoryId: parseInt(id) })
  }
}
