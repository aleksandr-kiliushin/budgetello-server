import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/auth.guard"

import { CreateFinanceCategoryDto } from "./dto/create-finance-category.dto"
import { UpdateFinanceCategoryDto } from "./dto/update-finance-category.dto"
import { FinanceCategoryService } from "./finance-category.service"

@Controller("finance-category")
@UseGuards(AuthGuard)
export class FinanceCategoryController {
  constructor(private financeCategoryService: FinanceCategoryService) {}

  @Get()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getFinanceCategories(@Query() query: any) {
    return this.financeCategoryService.getFinanceCategories(query)
  }

  @Get(":id")
  getFinanceCategory(@Param("id") id: string) {
    return this.financeCategoryService.getFinanceCategory(parseInt(id))
  }

  @Post()
  createFinanceCategory(@Body() createFinanceCategoryDto: CreateFinanceCategoryDto) {
    return this.financeCategoryService.createFinanceCategory(createFinanceCategoryDto)
  }

  @Patch(":id")
  updateFinanceCategory(@Param("id") id: string, @Body() updateFinanceCategoryDto: UpdateFinanceCategoryDto) {
    return this.financeCategoryService.updateFinanceCategory(parseInt(id), updateFinanceCategoryDto)
  }

  @Delete(":id")
  deleteFinanceCategory(@Param("id") id: string) {
    return this.financeCategoryService.deleteFinanceCategory(parseInt(id))
  }
}
