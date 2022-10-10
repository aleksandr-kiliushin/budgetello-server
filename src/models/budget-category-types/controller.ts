import { Controller, Get, Param, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"

import { BudgetCategoryTypesService } from "./service"

@Controller("budget/category-types")
@UseGuards(AuthGuard)
export class BudgetCategoryTypesController {
  constructor(private readonly budgetCategoryTypesService: BudgetCategoryTypesService) {}

  @Get()
  getAll() {
    return this.budgetCategoryTypesService.getAll()
  }

  @Get(":id")
  find(
    @Param("id")
    categoryTypeId: string
  ) {
    return this.budgetCategoryTypesService.find({ categoryTypeId: parseInt(categoryTypeId) })
  }
}
