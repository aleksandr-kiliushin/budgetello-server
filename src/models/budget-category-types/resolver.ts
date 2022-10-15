import { UseGuards } from "@nestjs/common"
import { Args, Int, Query, Resolver } from "@nestjs/graphql"

import { AuthGuard } from "#models/auth/guard"

import { IBudgetCategoryType } from "#interfaces/budget"

import { BudgetCategoryType } from "./models/budget-category-type.model"
import { BudgetCategoryTypesService } from "./service"

@Resolver(() => BudgetCategoryType)
@UseGuards(AuthGuard)
export class BudgetCategoryTypesResolver {
  constructor(private budgetCategoryTypesService: BudgetCategoryTypesService) {}

  @Query((returns) => [BudgetCategoryType], { name: "budgetCategoryTypes" })
  getAll() {
    return this.budgetCategoryTypesService.getAll()
  }

  @Query((returns) => BudgetCategoryType, { name: "budgetCategoryType" })
  find(
    @Args("id", { type: () => Int })
    id: IBudgetCategoryType["id"]
  ) {
    return this.budgetCategoryTypesService.find({ typeId: id })
  }
}
