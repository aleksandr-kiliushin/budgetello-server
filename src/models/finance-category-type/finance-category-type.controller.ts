import { Controller, Get, Param, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/auth.guard"

import { FinanceCategoryTypeService } from "./finance-category-type.service"

@Controller("finances/category-types")
@UseGuards(AuthGuard)
export class FinanceCategoryTypeController {
  constructor(private readonly financeCategoryTypeService: FinanceCategoryTypeService) {}

  @Get()
  getAll() {
    return this.financeCategoryTypeService.getAll()
  }

  @Get(":id")
  getFinanceCategoryType(@Param("id") id: string) {
    return this.financeCategoryTypeService.getFinanceCategoryType(parseInt(id))
  }
}
