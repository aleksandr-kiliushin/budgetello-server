import { UseGuards } from "@nestjs/common"
import { Args, Int, Query, Resolver } from "@nestjs/graphql"

import { AuthorizationGuard } from "#models/authorization/guard"
import { UserEntity } from "#models/users/entities/user.entity"

import { AuthorizedUser } from "#helpers/AuthorizedUser.decorator"

import { SearchBudgetCategoriesArgs } from "./dto/search-budget-categories.args"
import { BudgetCategoryEntity } from "./entities/budget-category.entity"
import { BudgetCategory } from "./models/budget-category.model"
import { BudgetCategoriesService } from "./service"

@Resolver(() => BudgetCategory)
@UseGuards(AuthorizationGuard)
export class BudgetCategoriesResolver {
  constructor(private budgetCategoriesService: BudgetCategoriesService) {}

  @Query((returns) => [BudgetCategory], { name: "budgetCategories" })
  search(
    @Args()
    args: SearchBudgetCategoriesArgs,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<BudgetCategoryEntity[]> {
    return this.budgetCategoriesService.search({ args, authorizedUser })
  }

  @Query((returns) => BudgetCategory, { name: "budgetCategory" })
  find(
    @Args("id", { type: () => Int })
    categoryId: number,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<BudgetCategoryEntity> {
    return this.budgetCategoriesService.find({ authorizedUser, categoryId })
  }

  // @Post()
  // create(
  //   @Body(new ValidationPipe())
  //   requestBody: CreateBudgetCategoryDto,
  //   @AuthorizedUser()
  //   authorizedUser: UserEntity
  // ) {
  //   return this.budgetCategoriesService.create({ authorizedUser, requestBody })
  // }

  // @Patch(":categoryId")
  // update(
  //   @Param("categoryId", ParseIntPipe)
  //   categoryId: number,
  //   @Body()
  //   requestBody: UpdateBudgetCategoryDto,
  //   @AuthorizedUser()
  //   authorizedUser: UserEntity
  // ) {
  //   return this.budgetCategoriesService.update({ authorizedUser, categoryId, requestBody })
  // }

  // @Delete(":categoryId")
  // delete(
  //   @Param("categoryId", ParseIntPipe)
  //   categoryId: number,
  //   @AuthorizedUser()
  //   authorizedUser: UserEntity
  // ) {
  //   return this.budgetCategoriesService.delete({ authorizedUser, categoryId })
  // }
}
