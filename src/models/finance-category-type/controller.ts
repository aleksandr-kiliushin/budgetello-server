import { Controller, Get, Param, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"

import { FinanceCategoryTypeService } from "./service"

@Controller("finances/category-types")
@UseGuards(AuthGuard)
export class FinanceCategoryTypeController {
  constructor(private readonly financeCategoryTypeService: FinanceCategoryTypeService) {}

  @Get()
  getAll() {
    return this.financeCategoryTypeService.getAll()
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.financeCategoryTypeService.findById(parseInt(id))
  }
}
