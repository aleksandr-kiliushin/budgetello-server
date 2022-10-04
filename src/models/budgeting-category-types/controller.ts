import { Controller, Get, Param, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"

import { BudgetingCategoryTypeService } from "./service"

@Controller("budgeting/category-types")
@UseGuards(AuthGuard)
export class BudgetingCategoryTypeController {
  constructor(private readonly budgetingCategoryTypeservice: BudgetingCategoryTypeService) {}

  @Get()
  getAll() {
    return this.budgetingCategoryTypeservice.getAll()
  }

  @Get(":id")
  find(
    @Param("id")
    budgetingCategoryTypeId: string
  ) {
    return this.budgetingCategoryTypeservice.find({ budgetingCategoryTypeId: parseInt(budgetingCategoryTypeId) })
  }
}
