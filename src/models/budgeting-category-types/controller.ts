import { Controller, Get, Param, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"

import { BudgetingCategoryTypesService } from "./service"

@Controller("budgeting/category-types")
@UseGuards(AuthGuard)
export class BudgetingCategoryTypesController {
  constructor(private readonly budgetingCategoryTypesService: BudgetingCategoryTypesService) {}

  @Get()
  getAll() {
    return this.budgetingCategoryTypesService.getAll()
  }

  @Get(":id")
  find(
    @Param("id")
    categoryTypeId: string
  ) {
    return this.budgetingCategoryTypesService.find({ categoryTypeId: parseInt(categoryTypeId) })
  }
}
