import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/auth.guard"

import { CreateFinanceCategoryDto } from "./dto/create-finance-category.dto"
import { UpdateFinanceCategoryDto } from "./dto/update-finance-category.dto"
import { FinanceCategoryService } from "./finance-category.service"

@Controller("finances/categories")
@UseGuards(AuthGuard)
export class FinanceCategoryController {
  constructor(private financeCategoryService: FinanceCategoryService) {}

  @Get("search")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchCategories(@Query() query: any) {
    return this.financeCategoryService.searchCategories(query)
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.financeCategoryService.findById(parseInt(id))
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
