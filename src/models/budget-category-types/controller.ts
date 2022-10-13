import { Controller, Get, Param, ParseIntPipe, UseGuards } from "@nestjs/common"

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

  @Get(":typeId")
  find(
    @Param("typeId", ParseIntPipe)
    typeId: number
  ) {
    return this.budgetCategoryTypesService.find({ typeId })
  }
}
