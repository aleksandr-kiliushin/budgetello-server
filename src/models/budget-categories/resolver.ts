import { UseGuards } from "@nestjs/common"
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql"

import { AuthorizationGuard } from "#models/authorization/guard"
import { UserEntity } from "#models/users/entities/user.entity"

import { AuthorizedUser } from "#helpers/AuthorizedUser.decorator"

import { CreateBudgetCategoryInput } from "./dto/create-budget-category.input"
import { SearchBudgetCategoriesArgs } from "./dto/search-budget-categories.args"
import { UpdateBudgetCategoryInput } from "./dto/update-budget-category.input"
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

  @Mutation((returns) => BudgetCategory, { name: "createBudgetCategory" })
  create(
    @Args("input")
    input: CreateBudgetCategoryInput,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<BudgetCategoryEntity> {
    return this.budgetCategoriesService.create({ authorizedUser, input })
  }

  @Mutation((returns) => BudgetCategory, { name: "updateBudgetCategory" })
  update(
    @Args("input")
    input: UpdateBudgetCategoryInput,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<BudgetCategoryEntity> {
    return this.budgetCategoriesService.update({ authorizedUser, input })
  }

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
